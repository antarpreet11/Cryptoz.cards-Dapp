export const NETWORKS = {
  "0x1": "Main Ethereum Network (LIVE)",
  "0x2": "Deprecated Morden test network",
  "0x3": "Ropsten test network",
  "0x4": "Rinkeby test network",
  "0x5": "Goerli test network",
  "0x2a": "Kovan test network",
  "0x38": "Binance Smart Chain",
  "0x61": "Binance Smart Chain Test Net",
  "0x507": "Moonbase Alpha",
  "0x505": "Moonriver",
  4447: "Truffle Develop Network",
  5777: "Ganache Blockchain",
  0: "Internal testing network",
};

/*
export const NETWORKS = {
 '1': 'Main Ethereum Network (LIVE)',
 '2': 'Deprecated Morden test network',
 '3': 'Ropsten test network',
 '4': 'Rinkeby test network',
 '42': 'Kovan test network',
 '56': 'Binance Smart Chain',
 '4447': 'Truffle Develop Network',
 '5777': 'Ganache Blockchain',
 '0': 'Internal testing network'
}
*/

export const NETWORK_NAMES = {
  MOONBASE: 'moonbase-alpha',
  MOONRIVER: 'moonriver',
  MOONBEAM: 'moonbeam',
}

export const NETWORKTYPES = {
  'moonbase-alpha': {
    name: NETWORK_NAMES.MOONBASE,
    chainId: 1287,
    websocketRPC: `wss://moonbeam-alpha.api.onfinality.io/ws?apikey=${process.env['REACT_APP_MOONBEAM_RPC_API_KEY']}`,
    httpRPC: `https://moonbeam-alpha.api.onfinality.io/rpc?apikey=${process.env['REACT_APP_MOONBEAM_RPC_API_KEY']}`,
    marketContractAddress: '0xd00d7b22deD10Fde1c94Be9E6D55D7190CCADD7F',
    zoomContractAddress: '0x8e21404bAd3A1d2327cc6D2B2118f47911a1f316',
    zoombiesContractAddress: '0x3E7997B8D30AA6216102fb2e9206246e478d57d3',
    wmovrContractAddress: '0x372d0695E75563D9180F8CE31c9924D7e8aaac47',
    usdtContractAddress: '0x0b77D7BDd78b2a4C2c50980968166D99e321DfB6',
    daiContractAddress: '0xEc95c10d4DD55741DE9491751407DEA41A3eF5f1',
  },
  'moonriver': {
    name: NETWORK_NAMES.MOONRIVER,
    chainId: 1285,
    websocketRPC: `wss://moonriver.api.onfinality.io/ws?apikey=${process.env['REACT_APP_MOONBEAM_RPC_API_KEY']}`,
    httpRPC: `https://moonriver.api.onfinality.io/rpc?apikey=${process.env['REACT_APP_MOONBEAM_RPC_API_KEY']}`,
    marketContractAddress: '0x0705212aeAA5d0b91c995269863856B2A17874a8',
    zoomContractAddress: '0x8bd5180Ccdd7AE4aF832c8C03e21Ce8484A128d4',
    zoombiesContractAddress: '0x08716e418e68564C96b68192E985762740728018',
    wmovrContractAddress: '0x98878B06940aE243284CA214f92Bb71a2b032B8A',
    xcKSMContractAddress: '0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080',
    xcUSDTContractAddress: '0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d',
    usdtContractAddress: '0xB44a9B6905aF7c801311e8F4E76932ee959c663C',
    daiContractAddress: '0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844',
  },
  'moonbeam': {
    name: NETWORK_NAMES.MOONBEAM,
  }
}

export const isLocal =
  process.env.NODE_ENV === "development" ||
  window.location.host !== "movr.zoombies.world";
// export const isLocal = false;

export const NETWORK_ICONS = {
  'moonbase-alpha': 'https://zoombies.world/images/moonbase.png',
  'moonriver': 'https://zoombies.world/images/mr-icon.png',
  'moonbeam': 'https://zoombies.world/images/moonbeam.png'
}

export const getNetworkNameFromURL = () => {
  const pathname = window.location.pathname

  for (const key of Object.keys(NETWORKTYPES)) {
    if (pathname.includes(key)) {
      return key
    }
  }

  return null
}
