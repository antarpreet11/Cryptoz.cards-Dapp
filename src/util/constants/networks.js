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

export const CURR_CHAIN =
  window.location.pathname == "/moonbase" ? 1287
  : window.location.pathname == "/moonriver" ? 1285
  : window.location.pathname == "/moonbeam" ? 1284 : 
  1284;
// export const CURR_CHAIN = false;
