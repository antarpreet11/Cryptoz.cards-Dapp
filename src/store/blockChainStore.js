import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import zoombiesContractJson from "../contracts/Zoombies.json";
import zoomContractJson from "../contracts/ZoomToken.json";
import dAppState from "../dAppStates";
import { setupEventWatcher } from "../util/watcherUtil";
import WebsocketProvider from "../util/WebsocketProvider";

const DEFAULT_BLOCKCHAIN_STATE = {
  ethersCryptozContract: null,
  metamaskContract: null,
  walletAddress: null,
  walletBalance: null,
  chainId: null,
  contracts: {
    readOnlyZoomContract: null,
    readOnlyZoombiesContract: null,
    signedZoomContract: null,
    signedZoombiesContract: null,
  },
};

export const BLOCKCHAIN_MUTATIONS = {
  SET_BLOCKCHAIN: "SET_BLOCKCHAIN",
  CLEAR_BLOCKCHAIN: "CLEAR_BLOCKCHAIN",
};

const devChainParam = {
  chainId: "0x507", // Moonbase Alpha's chainId is 1287, which is 0x507 in hex
  chainName: "Moonbase Alpha",
  nativeCurrency: {
    name: "DEV",
    symbol: "DEV",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.api.moonbase.moonbeam.network"],
  blockExplorerUrls: ["https://moonbase.moonscan.io/"],
};

const prodChainParam = {
  chainId: "0x505", // Moonriver's chainId is 1285, which is 0x505 in hex
  chainName: "Moonriver",
  nativeCurrency: {
    name: "MOVR",
    symbol: "MOVR",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.api.moonriver.moonbeam.network"],
  blockExplorerUrls: ["https://moonriver.moonscan.io/"],
};

const isLocal =
  process.env.NODE_ENV === "development" ||
  window.location.host !== "movr.zoombies.world";
// const isLocal = false;

const setupMetamaskProvider = async () => {
  try {
    const metamaskProvider = await detectEthereumProvider({
      mustBeMetaMask: true,
    });

    if (metamaskProvider) {
      await metamaskProvider.request({
        method: "eth_requestAccounts",
      });
      await metamaskProvider.request({
        method: "wallet_addEthereumChain",
        params: [isLocal ? devChainParam : prodChainParam],
      });

      const etherWrapper = new ethers.providers.Web3Provider(metamaskProvider);
      const signer = etherWrapper.getSigner();

      const [address, balance, network] = await Promise.all([
        signer.getAddress(),
        signer.getBalance(),
        etherWrapper.getNetwork(),
      ]);

      return {
        address,
        balance,
        network,
        signer,
        provider: metamaskProvider,
      };
    }

    return null;
  } catch (e) {
    console.error("Failed to init metamask provider: ", e);
  }
};

const createContracts = (chainId, rpcProvider, signer) => {
  const zoombiesContractAddress =
    zoombiesContractJson.networks[chainId].address;
  const zoomTokenContractAddress = zoomContractJson.networks[chainId].address;

  const readOnlyZoombiesContract = new ethers.Contract(
    zoombiesContractAddress,
    zoombiesContractJson.abi,
    rpcProvider
  );
  const signedZoombiesContract = new ethers.Contract(
    zoombiesContractAddress,
    zoombiesContractJson.abi,
    signer
  );

  const readOnlyZoomContract = new ethers.Contract(
    zoomTokenContractAddress,
    zoomContractJson.abi,
    rpcProvider
  );

  const signedZoomContract = new ethers.Contract(
    zoomTokenContractAddress,
    zoomContractJson.abi,
    signer
  );

  return {
    readOnlyZoomContract,
    readOnlyZoombiesContract,
    signedZoomContract,
    signedZoombiesContract,
  };
};

const subscribeToMetamaskProviderEvents = (metamaskProvider, dispatch) => {
  // subscribe to connect and accounts changed event.
  metamaskProvider.on("connect", ({ chainId }) => {
    dispatch("setChainId", chainId);
    dispatch("setDAppState", dAppState.CONNECTED, { root: true });
  });

  metamaskProvider.on("chainChanged", (chainId) => {
    window.location.reload();
  });

  metamaskProvider.on("accountsChanged", (accounts) => {
    if (accounts.length == 0) {
      console.log("no account connected");
      dispatch("clearBlockchain");
      dispatch("setDAppState", dAppState.NOT_CONNECTED, { root: true });
    } else {
      dispatch("initBlockchain");
      dispatch("setDAppState", dAppState.CONNECTED, { root: true });
    }
  });
};

const blockchainStore = {
  namespaced: true,
  state: () => DEFAULT_BLOCKCHAIN_STATE,
  mutations: {
    [BLOCKCHAIN_MUTATIONS.SET_BLOCKCHAIN](state, payload) {
      const { walletAddress, walletBalance, chainId, contracts } = payload;

      if (walletAddress) {
        state.walletAddress = walletAddress;
      }

      if (walletBalance) {
        state.walletBalance = walletBalance;
      }

      if (chainId) {
        state.chainId = chainId;
      }

      if (contracts) {
        state.contracts = {
          ...state.contracts,
          ...contracts,
        };
      }
    },
    [BLOCKCHAIN_MUTATIONS.CLEAR_BLOCKCHAIN](state) {
      state = DEFAULT_BLOCKCHAIN_STATE;
    },
  },
  actions: {
    /**
     *
     * @param {*} payload
     * {
     *  noMetamaskCallback: a callback fn to call when no metamask detected.
     *  isLocal: boolean
     * }
     */
    async initBlockchain({ commit, state, dispatch }, payload) {
      const metamaskProviderData = await setupMetamaskProvider();
      if (!metamaskProviderData) {
        payload.noMetamaskCallback();
      }
      subscribeToMetamaskProviderEvents(
        metamaskProviderData.provider,
        dispatch
      );

      const rpcProvider = new WebsocketProvider(isLocal, (provider) => {
        /**
         * After websocket reconnects:
         * - Set new contracts
         * - watch events with new provider
         */

        const contracts = createContracts(
          metamaskProviderData.network.chainId,
          provider,
          metamaskProviderData.signer
        );

        dispatch("setContracts", contracts);
        setupEventWatcher((eventPayload) => {
          dispatch("events/addEvents", eventPayload, { root: true });
        }, provider);
      });

      rpcProvider.init();

      const contracts = createContracts(
        metamaskProviderData.network.chainId,
        rpcProvider.provider,
        metamaskProviderData.signer
      );

      dispatch("setDAppState", dAppState.WALLET_CONNECTED, { root: true });
      commit(BLOCKCHAIN_MUTATIONS.SET_BLOCKCHAIN, {
        walletAddress: metamaskProviderData.address,
        walletBalance: ethers.utils.formatEther(metamaskProviderData.balance),
        chainId: metamaskProviderData.network.chainId,
        contracts: contracts,
      });

      setupEventWatcher((eventPayload) => {
        dispatch("events/addEvents", eventPayload, { root: true });
      }, rpcProvider.provider);
    },

    setChainId({ commit }, payload) {
      commit(BLOCKCHAIN_MUTATIONS.SET_BLOCKCHAIN, {
        chainId: payload,
      });
    },

    clearBlockchain({ commit }) {
      commit(BLOCKCHAIN_MUTATIONS.CLEAR_BLOCKCHAIN);
    },

    setContracts({ commit }, payload) {
      commit(BLOCKCHAIN_MUTATIONS.SET_BLOCKCHAIN, {
        contracts: payload,
      });
    },
  },
  getters: {
    getWalletAddress: (state) => {
      return state.walletAddress;
    },
    getBalance: (state) => {
      return parseFloat(state.walletBalance);
    },
    getReadOnlyZoombiesContract: (state) =>
      state.contracts.readOnlyZoombiesContract,
    getReadOnlyZoomContract: (state) => state.contracts.readOnlyZoomContract,
    getSignedZoombiesContract: (state) =>
      state.contracts.signedZoombiesContract,
    getSignedZoomContract: (state) => state.contracts.signedZoomContract,
  },
};

export default blockchainStore;
