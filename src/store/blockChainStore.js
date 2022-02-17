import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import zoombiesContractJson from "../contracts/Zoombies.json";
import zoomContractJson from "../contracts/ZoomToken.json";
import dAppState from "../dAppStates";
import { EVENT_TYPES, setupEventWatcher } from "../util/watcherUtil";
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
  // wallet balances
  zoomBalance: 0,
  nftOwned: 0,
  boosterCreditOwned: 0,

  // universe balances
  totalZoomBalance: 0,
  totalNftSupply: 0,
  totalNftTypes: 0,
};

export const BLOCKCHAIN_MUTATIONS = {
  SET_BLOCKCHAIN: "SET_BLOCKCHAIN",
  CLEAR_BLOCKCHAIN: "CLEAR_BLOCKCHAIN",
  SET_WALLET_BALANCES: "SET_WALLET_BALANCES",
  SET_UNIVERSE_BALANCES: "SET_UNIVERSE_BALANCES",
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
    [BLOCKCHAIN_MUTATIONS.SET_WALLET_BALANCES](state, payload) {
      state.zoomBalance = payload.zoomBalance;
      state.nftOwned = payload.nftOwned;
      state.boosterCreditOwned = payload.boosterCreditOwned;
    },
    [BLOCKCHAIN_MUTATIONS.SET_UNIVERSE_BALANCES](state, payload) {
      state.totalZoomBalance = payload.totalZoomBalance;
      state.totalNftSupply = payload.totalNftSupply;
      state.totalNftTypes = payload.totalNftTypes;
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
          if (
            eventPayload.type === EVENT_TYPES.zoomMint ||
            eventPayload.type === EVENT_TYPES.packOpened ||
            eventPayload.type === EVENT_TYPES.cardMinted
          ) {
            dispatch("updateWalletBalances");
            dispatch("updateUniverseBalances");
          }
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

        if (
          eventPayload.type === EVENT_TYPES.zoomMint ||
          eventPayload.type === EVENT_TYPES.packOpened ||
          eventPayload.type === EVENT_TYPES.cardMinted
        ) {
          dispatch("updateWalletBalances");
          dispatch("updateUniverseBalances");
        }
      }, rpcProvider.provider);

      dispatch("updateWalletBalances");
      dispatch("updateUniverseBalances");
    },

    async updateWalletBalances({ commit, state }) {
      const { walletAddress, contracts } = state;

      if (!walletAddress || !contracts) return;

      const { readOnlyZoomContract, readOnlyZoombiesContract } = contracts;

      const zoomBalancePromise = readOnlyZoomContract.balanceOf(walletAddress);
      const nftOwnedPromise = readOnlyZoombiesContract.balanceOf(walletAddress);
      const boosterCreditPromise = readOnlyZoombiesContract.boosterCreditsOwned(
        walletAddress
      );

      const [zoomBalance, nftOwned, boosterCreditOwned] = await Promise.all([
        zoomBalancePromise,
        nftOwnedPromise,
        boosterCreditPromise,
      ]);

      commit(BLOCKCHAIN_MUTATIONS.SET_WALLET_BALANCES, {
        zoomBalance: ethers.utils.formatEther(zoomBalance),
        nftOwned: nftOwned.toNumber(),
        boosterCreditOwned: boosterCreditOwned.toNumber(),
      });
    },

    async updateUniverseBalances({ commit, state }) {
      const { contracts } = state;
      if (!contracts) return;
      const { readOnlyZoomContract, readOnlyZoombiesContract } = contracts;

      const totalCzxpPromise = readOnlyZoomContract.totalSupply();
      const totalTypesPromise = readOnlyZoombiesContract.totalCardTypes();
      const totalCryptozPromise = readOnlyZoombiesContract.totalSupply();

      const [totalCzxp, totalTypes, totalCryptoz] = await Promise.all([
        totalCzxpPromise,
        totalTypesPromise,
        totalCryptozPromise,
      ]);

      commit(BLOCKCHAIN_MUTATIONS.SET_UNIVERSE_BALANCES, {
        totalZoomBalance: ethers.utils.formatEther(totalCzxp),
        totalNftSupply: ethers.BigNumber.from(totalCryptoz).toNumber(),
        totalNftTypes: totalTypes,
      });
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
    getChainId: (state) => state.chainId,
    getNftOwned: (state) => state.nftOwned,
    getBoosterCreditOwned: (state) => state.boosterCreditOwned,
    getZoomBalance: (state) => parseInt(state.zoomBalance),
    getTotalZoomBalance: (state) => parseInt(state.totalZoomBalance),
    getTotalNftSupply: (state) => parseInt(state.totalNftSupply),
    getTotalNftTypes: (state) => parseInt(state.totalNftTypes),
  },
};

export default blockchainStore;
