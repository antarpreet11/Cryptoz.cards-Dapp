import axios from "axios";

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
