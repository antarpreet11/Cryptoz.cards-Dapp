import { isLocal } from "./constants/networks";


export const querySubGraph = async () => {
  const query = `query {
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

  const graphEndPoint = isLocal
    ? "https://api.subquery.network/sq/ryanprice/moonbase-alpha-zoom-and-zoombies-nft-subgraph__cnlhb"
    : "https://api.subquery.network/sq/ryanprice/zoombies-moonriver";

  try {
    const result = await fetch(graphEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
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
