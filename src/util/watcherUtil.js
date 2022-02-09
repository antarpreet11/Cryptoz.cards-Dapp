import { ethers } from "ethers";

import zoomTokenContractJson from "../contracts/ZoomToken.json";
import zoombiesContractJson from "../contracts/Zoombies.json";

const isLocal =
  process.env.NODE_ENV === "development" ||
  window.location.host !== "movr.zoombies.world";

const networkId = isLocal ? 1287 : 1285;

const zoomTokenContractAddress = zoomTokenContractJson.networks[networkId].address;
const zoombiesContractAddress = zoombiesContractJson.networks[networkId].address;

//const providerURL = isLocal ? "https://rpc.api.moonbase.moonbeam.network" : "https://rpc.api.moonriver.moonbeam.network";
const providerURL = isLocal ? "https://moonbeam-alpha.api.onfinality.io/public" : "https://moonriver.api.onfinality.io/public";
// Define Provider
const rpcProvider = new ethers.providers.StaticJsonRpcProvider(providerURL, {
  chainId: networkId,
  name: isLocal ? "moonbase-alphanet" : "Moonriver",
});


export const ZoomContract = new ethers.Contract(
  zoomTokenContractAddress,
  zoomTokenContractJson.abi,
  rpcProvider
);

export const ZoomTokenInterface = new ethers.utils.Interface(
  zoomTokenContractJson.abi
);

export const ZoombiesContract = new ethers.Contract(
  zoombiesContractAddress,
  zoombiesContractJson.abi,
  rpcProvider
);
export const ZoombiesInterface = new ethers.utils.Interface(
  zoombiesContractJson.abi
);

export const EVENT_TYPES = {
  zoomBurn: "zoomBurn",
  zoomMint: "zoomMint",
  sacrificeNFT: "sacrificeNFT",
  boosterReward: "boosterReward",
  dailyReward: "dailyReward",
  sponsorReward: "sponsorReward",
  cardTypeLoaded: "cardTypeLoaded",
  cardMinted: "cardMinted",
  packOpened: "packOpened",
};

const zoomTokenEvents = [
  {
    eventName: "Zoom Burn Event",
    filter: {
      address: zoomTokenContractAddress,
      topics: [
        ethers.utils.id("Transfer(address,address,uint256)"),
        null,
        ethers.utils.hexZeroPad(ethers.constants.AddressZero, 32),
      ],
    },
    eventType: EVENT_TYPES.zoomBurn,
  },
  {
    eventName: "Zoom Mint Event",
    filter: {
      address: zoomTokenContractAddress,
      topics: [
        ethers.utils.id("Transfer(address,address,uint256)"),
        ethers.utils.hexZeroPad(ethers.constants.AddressZero, 32),
        null,
      ],
    },
    eventType: EVENT_TYPES.zoomMint,
  },
];

const zoombiesEvents = [
  {
    eventName: "Sacrifice NFT Event",
    filter: {
      address: zoombiesContractAddress,
      topics: [
        ethers.utils.id("LogSacrificeNFT(address,uint256,uint16,uint256)"),
      ],
    },
    eventType: EVENT_TYPES.sacrificeNFT,
  },
  {
    eventName: "Reward Booster Event",
    filter: {
      address: zoombiesContractAddress,
      topics: [ethers.utils.id("LogRewardBoosters(address,uint256)")],
    },
    eventType: EVENT_TYPES.boosterReward,
  },
  {
    eventName: "Daily Reward Event",
    filter: {
      address: zoombiesContractAddress,
      topics: [ethers.utils.id("LogDailyReward(address,uint256)")],
    },
    eventType: EVENT_TYPES.dailyReward,
  },
  // {
  //   eventName: "Sponsor Reward Event",
  //   filter: {
  //     address: zoombiesContractAddress,
  //     topics: [ethers.utils.id("LogSponsorReward(address,address,uint256)")],
  //   },
  //   eventType: EVENT_TYPES.sponsorReward,
  // },
  // {
  //   eventName: "Card Type Loaded Event",
  //   filter: {
  //     address: zoombiesContractAddress,
  //     topics: [ethers.utils.id("LogCardTypeLoaded(uint32,string,uint256)")],
  //   },
  //   eventType: EVENT_TYPES.cardTypeLoaded,
  // },
  {
    eventName: "Card Minted Event",
    filter: {
      address: zoombiesContractAddress,
      topics: [
        ethers.utils.id("LogCardMinted(address,uint256,uint32,uint256)"),
      ],
    },
    eventType: EVENT_TYPES.cardMinted,
  },
  {
    eventName: "Pack Opened Event",
    filter: {
      address: zoombiesContractAddress,
      topics: [ethers.utils.id("LogPackOpened(address,uint8)")],
    },
    eventType: EVENT_TYPES.packOpened,
  },
];

export const setupEventWatcher = (store) => {
  zoomTokenEvents.forEach((event) => {
    console.log(`Watching ${event.eventName}`);
    ZoomContract.provider.on(event.filter, (log) => {
      console.log(`Got ${event.eventName}`);
      // Dispatch to store to add event
      store.dispatch("events/addEvents", {
        type: event.eventType,
        data: ZoomTokenInterface.parseLog(log),
        hash: log.transactionHash,
      });
    });
  });

  zoombiesEvents.forEach((event) => {
    console.log(`Watching ${event.eventName}`);
    ZoombiesContract.provider.on(event.filter, (log) => {
      console.log(`Got ${event.eventName}`);
      // Dispatch to store to add event
      console.log(log.transactionHash);
      store.dispatch("events/addEvents", {
        type: event.eventType,
        data: ZoombiesInterface.parseLog(log),
        hash: log.transactionHash,
      });
    });
  });
};

export const processDailyRewardEvent = (data) => {
  const playerAddress = data[0];
  const boosterBalance = ethers.BigNumber.from(data[1]).toNumber();

  return {
    address: playerAddress,
    newBoosterBalance: boosterBalance,
  };
};

export const processSacrificeNFTEvent = (data) => {
  const address = data[0];
  const tokenId = ethers.BigNumber.from(data[1]).toNumber();
  const cardTypeId = data[2];
  const zoomGained = ethers.BigNumber.from(data[3]).toNumber();

  return {
    address,
    tokenId,
    cardTypeId,
    zoomGained,
  };
};

export const processRewardBoosterEvent = (data) => {
  const winner = data[0];
  const boosterAwarded = ethers.BigNumber.from(data[1]).toNumber();

  return {
    winner,
    boosterAwarded,
  };
};
