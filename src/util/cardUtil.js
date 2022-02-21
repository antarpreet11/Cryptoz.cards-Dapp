import axios from "axios";

export const RARITY_CLASSES = {
  Common: "card-bg card-bg-6",
  Uncommon: "card-bg card-bg-5",
  Rare: "card-bg card-bg-4",
  Epic: "card-bg card-bg-3",
  Platinum: "card-bg card-bg-2",
  Diamond: "card-bg card-bg-1",
};

export const getCardType = async (cardId) => {
  try {
    const response = await fetch(
      `https://zoombies.world/services/card_types/${cardId}.json`
    );
    const cardType = await response.json();
    return cardType;
  } catch (err) {
    console.error(err);
  }
};

export const getCardSets = async () => {
  try {
    const cardSetUrl = "https://zoombies.world/services/getCardSets.php";
    const response = await axios.get(cardSetUrl);

    if (response.status === 200) {
      return response.data;
    }

    console.error(response.statusText);
  } catch (err) {
    console.error(err);
  }
};

export const getCard = async (cardId, CryptozInstance) => {
  const res = await getCardType(cardId);
  if (!res) {
    console.log(`Failed to fetch card ${cardId}.json`);
    return;
  }

  let cardObj = { ...res };

  cardObj.id = cardId;

  if (res.attributes[3].value !== "Store") {
    return;
  }

  // using for..of here so I can use continue
  for (const attribute of res.attributes) {
    if (attribute.trait_type === "rarity") {
      cardObj["rarity"] = RARITY_CLASSES[attribute.value];
      continue;
    }
    cardObj[attribute.trait_type] = attribute.value;
  }

  const edition = await CryptozInstance.cardTypeToEdition(cardObj.id);

  cardObj.edition_current = parseInt(edition);

  // Set soldOut flag first
  if (cardObj.edition_current == cardObj.edition_total) {
    cardObj.soldOut = 1;
  } else {
    cardObj.soldOut = 0;
  }

  const t = await CryptozInstance.storeReleaseTime(cardObj.id);
  cardObj.release_time = t;
  return cardObj;
};

export const addIsOwnedProp = async (card, CryptozInstance, walletAddress) => {
  try {
    const isOwned = await CryptozInstance.cardTypesOwned(
      walletAddress,
      card.id
    );
    card.isOwned = isOwned;

    return card;
  } catch (error) {
    console.error("Failed to add is owned prop: ", error);
  }
};

export const getNftByTokenId = async (tokenId, zoombiesContract) => {
  try {
    const res = await zoombiesContract.nfts(tokenId);
    const cardTypeId = parseInt(res[0]);
    if (cardTypeId === 0) {
      return null;
    }

    const currentEdition = parseInt(res[1]);
    const cardData = await getCardType(cardTypeId);

    return {
      cardData,
      currentEdition,
    };
  } catch (error) {
    console.error("Failed to get nft by tokenID: ", tokenId, error);
  }
};
