import { CURR_CHAIN } from "./constants/networks";


export const querySubGraph = async () => {
  const query = `query {
                  logCardMinteds(orderBy:BLOCK_NUMBER_ASC,last:5) {
                    nodes {
                      tokenId
                    }
                  }
                  zoomPerDays(last:100) {
                    nodes{
                      id
                      minted
                      burned
                    }
                  }
                  rarityPerDays(last:100) {
                    nodes {
                      id
                      diamond
                      platinum
                      epic
                      rare
                      uncommon
                      common
                    }
                  }
                }`;

  const graphEndPoint = CURR_CHAIN == 1285 ? "https://api.subquery.network/sq/Cardinal-Entertainment/zoombies-moonriver"
    : CURR_CHAIN == 1287 ? "https://api.subquery.network/sq/Cardinal-Entertainment/zoombies-moonriver"
    : CURR_CHAIN == 1284 ? "moonbeam-url-here" : "https://api.subquery.network/sq/Cardinal-Entertainment/zoombies-moonriver";

  try {
    const result = await fetch(graphEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Accept: "Access-Control-Allow-Origin"
      },
      body: JSON.stringify({
        query,
      }),
    });
    const res = await result.json();
    return res.data;
  } catch (e) {
    window.alert("There was a fatal error contacting SubQuery Servers,Please let us know in the Cardinal Entertainment Discord #support channel");
    console.error("SubQuery fetch error:", e);
    return;
  }
};

export const getLastWeeks = async () => {

};
