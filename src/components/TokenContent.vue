<template>
  <div>
    <main role="main" class="container">
      <div>
        <div v-if="load_state == -1" class="row">
          <div class="col">
            <h2>Loading....please wait</h2>
          </div>
        </div>
        <div v-else class="col content">
          <b-input-group class="search" @keyup.enter="searchToken">
            <b-form-input
              class="search-input"
              v-model="tokenToSearch"
              type="text"
              placeholder="Search for a Zoombies Token"
            />
            <b-input-group-append>
              <b-button variant="success" @click="searchToken"> Go </b-button>
            </b-input-group-append>
          </b-input-group>
          <div v-if="load_state == 0" class="row">
            <div class="col">
              <h2>
                Zoombies Token #{{ token_id }} does not exist on this chain
              </h2>
              <p>Please search for a valid token</p>
            </div>
          </div>
          <div v-else class="row">
            <div class="col-sm text-center"><br/>
              <h4 class="valuation-label">Card Scarcity Rating</h4>
              Most Scarce = 100

              <apexchart
                id="chartContainer"
                ref="scarcityChart"
                width="100%"
                type="radialBar"
                :options="chartOptions"
                :series="chartSeries"
              ></apexchart>

              <span class="valuation-label">Valuation Data:</span><br/>
              <strong>Edition Maximum:</strong> {{edition_max}}<br/>
              <strong>Total in circulation:</strong> {{total_circulation}}<br/>
              <strong>Total Minted:</strong> {{total_minted}}<br/>
              <strong>Total Sacrificed:</strong> {{total_sacrificed}}<br/>

            </div>
            <div id="card-wrapper" class="col-sm">
              <OwnedCardContent
                :id="card.id"
                :key="card.id"
                :type_id="card.attributes.type_id"
                :name="card.name"
                :cost="card.attributes.cost"
                :cset="card.attributes.card_set"
                :edition_current="edition_current"
                :edition_total="card.attributes.edition_total"
                :level="card.attributes.card_level"
                :unlock_czxp="card.attributes.unlock_czxp"
                :buy_czxp="card.attributes.buy_czxp"
                :sacrifice_czxp="card.attributes.sacrifice_czxp"
                :image="card.image"
                :card_class="card.attributes.rarity"
                :in_store="card.attributes.in_store"
                :card_owned="true"
                :is_single_card_view="true"
              />
            </div>
            <div id="stats-container" class="col-sm">
              <div class="flex-row">
                <div class="text-right font-weight-bold label">Owner:</div>
                <div>
                  <a class="wrap-text" :href="owner_url">{{
                    owner.substr(0, 8) + "..." + owner.substr(36)
                  }}</a>
                </div>
              </div>
              <div class="flex-row">
                <div class="text-right font-weight-bold label">
                  Date Minted:
                </div>
                <div class="">
                  {{ minted_date }}
                </div>
              </div>
              <div class="flex-row">
                <div class="text-right font-weight-bold label">
                  NFT #:
                </div>
                <div class="">
                  {{ token_id }}
                </div>
              </div>
              <div class="flex-row">
                <div class="text-right font-weight-bold label">Card Name:</div>
                <div class="">
                  {{ card.name }}
                </div>
              </div>
              <div class="flex-row">
                <div class="text-right font-weight-bold label">Edition:</div>
                <div class="">
                  {{ edition_current }}
                </div>
              </div>
              <div class="flex-row">
                <div class="text-right font-weight-bold label">Card Set:</div>
                <div class="">
                  {{ card.attributes.card_set }}
                </div>
              </div>
              <div class="flex-row">
                <div class="text-right font-weight-bold label">
                  Type Released:
                </div>
                <div class="">
                  {{ released_date }}
                </div>
              </div>


              <div class="flex-row mt-2">
                <div class="text-right font-weight-bold label">
                  Zombie Type:
                </div>
                <div class="">
                  {{ card.attributes.zombie_type }}
                </div>
              </div>
              <div class="flex-row">
                <div class="text-right font-weight-bold label">Rarity:</div>
                <div class="">
                  {{ rarity }}
                </div>
              </div>
              <div class="flex-row">
                <div class="text-right font-weight-bold label">Cost:</div>
                <div class="">
                  {{ card.attributes.cost }}
                </div>
              </div>
              <div class="flex-row">
                <div class="text-right font-weight-bold label">Earn ZOOM:</div>
                <div class="">
                  {{ card.attributes.buy_czxp }}
                </div>
              </div>
              <div class="flex-row">
                <div class="text-right font-weight-bold label">
                  Sacrifice ZOOM:
                </div>
                <div class="">
                  {{ card.attributes.sacrifice_czxp }}
                </div>
              </div>
              <div class="flex-row">
                <div class="text-right font-weight-bold label">
                  Unlock ZOOM:
                </div>
                <div class="">
                  {{ card.attributes.unlock_czxp }}
                </div>
              </div>
              <div class="flex-row">
                <div class="text-right font-weight-bold label">Level:</div>
                <div class="">
                  {{ card.attributes.card_level }}
                </div>
              </div>
            </div>
          </div>
          <div class="description mb-5">
            {{ card.attributes.description }}
          </div>
          <h3>Zoombie NFT #{{token_id}} Transfer History</h3>
          <div class="flex-row">
            <b-table
              stacked="sm"
              bordered
              striped
              hover
              caption-top
              head-variant="dark"
              table-variant="primary"
              :items="items"
            ></b-table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from "axios";
import OwnedCardContent from "@/components/OwnedCardContent.vue";
import dAppStates from "@/dAppStates";
import apexchart from "vue-apexcharts";
import {
  BButton,
  BInputGroup,
  BFormInput,
  BInputGroupAppend,
  BTable,
} from "bootstrap-vue";
import { mapGetters } from "vuex";

export default {
  name: "TokenContent",
  components: {
    OwnedCardContent,
    BTable,
    BButton,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    apexchart,
  },
  data() {
    return {
      load_state: -1, //This is the loading state, -1 = loading state,0 - token doesn't exist, 1 = token is valid
      owner: "Loading..",
      token_id: "",
      minted_date: "Fetching...",
      edition_max: "Fetching...",
      total_minted: "Fetching...",
      total_sacrificed: "Fetching...",
      total_circulation: "Fetching...",
      card: {
        id: null,
        name: "Loading...",
        attributes: {
          rarity: "Loading...",
          edition_total: "Loading...",
          cost: "Loading...",
          card_set: "Loading...",
          zombie_type: "Loading...",
          buy_czxp: "Loading...",
          sacrifice_czxp: "Loading...",
          unlock_czxp: "Loading...",
          card_level: "Loading...",
          description: "Loading...",
        },
      },
      owner_url: "",
      rarity: "",
      released_date: "Loading..",
      edition_current: "Loading...",
      etherscan_token_id:
        "https://blockscout.moonriver.moonbeam.network/tokens/",
      tokenToSearch: "",
      chartSeries: [70],
      chartOptions: {
        chart: {
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            hollow: {
              margin: 10,
              size: '40%',
            },
            dataLabels: {
              show: true,
              name: {
                show: true,
                fontSize: '36px',
                fontWeight: 900,
              },
              value: {
                show: false
              }
            },
          },
        },
        labels: ['??'],
      },
      items: [
        {
          date_transferred: "Loading...",
          from: 'Loading...',
          to: 'Loading...',
        },
      ],
    };
  },
  computed: {
    isDAppConnected() {
      return (
        this.$store.state.dAppState === dAppStates.CONNECTED ||
        this.$store.state.dAppState === dAppStates.WALLET_CONNECTED
      );
    },
    ...mapGetters({
      getReadOnlyZoombiesContract: "blockChain/getReadOnlyZoombiesContract",
    }),
  },

  watch: {
    getReadOnlyZoombiesContract(value) {
      if (value) {
        this.loadCard(this.token_id);
      }
    },
    "$route.params.token_id": function (id) {
      this.token_id = parseInt(id);
      this.loadCard(this.token_id);
    },
  },
  mounted() {
    //grab the token id from the url
    this.token_id = parseInt(this.$route.params.token_id);
    if (this.isDAppConnected) {
      this.loadCard(this.token_id);
    }
  },
  methods: {
    querySubGraph: async function (cardTypeId) {
      const query = `query {
                        nftTransfers(
                          filter:{
                            tokenId: {
                              equalTo: "${this.token_id}"
                            }
                          }, orderBy : BLOCK_NUMBER_DESC
                        ){
                          nodes {
                            blockTimestamp
                            from
                            to
                          }
                        }
                        logCardMinteds(
                          filter:{
                            cardTypeId: {
                              equalTo: ${cardTypeId}
                            },
                          }, orderBy : BLOCK_NUMBER_ASC
                        ){
                          nodes {
                            tokenId
                            blockTimestamp
                            buyer
                            cardTypeId
                            editionNumber
                          }
                        }
                        logSacrificeNFTs(
                          filter: {
                            cardTypeId: {
                              equalTo: "${cardTypeId}"
                            },
                          }
                        ){
                          nodes{
                            tokenId
                            blockTimestamp
                            owner
                            cardTypeId
                            zoomGained
                          }
                        }
                      }`;
//console.log(query);
      try {
        const result = await fetch(
          "https://api.subquery.network/sq/ryanprice/moonbase-alpha-zoom-and-zoombies-nft-subgraph__cnlhb",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              query,
            }),
          }
        );
        const res = await result.json();
        console.log("QUERY res:",res);
        //Filter the result set for this token
        const found = res.data.logCardMinteds.nodes.find(element => element.tokenId == this.token_id);

        console.log(cardTypeId,this.token_id,found);

        this.minted_date = new Date(found.blockTimestamp).toLocaleString();
        this.total_minted = res.data.logCardMinteds.nodes.length;
        this.total_sacrificed = res.data.logSacrificeNFTs.nodes.length;
        this.total_circulation = this.total_minted - this.total_sacrificed;

        this.items = res.data.nftTransfers.nodes;

      }catch(e){
        window.alert("There was a fatal error contacting SubQuery Servers,Please let us know in the Cardinal Entertainment Discord #support channel");
        console.log("SubQuery fecth error:",e);
        return;
      }
    },
    loadCard: async function (token_id) {
      if (!this.getReadOnlyZoombiesContract) return;
      try {
        const res = await this.getReadOnlyZoombiesContract.nfts(token_id);
        //returns TypeId, Edition #
        let cardTypeId = parseInt(res[0]);

        //If the tokenId is greater than 0, we have something valid
        if (cardTypeId === 0) {
          this.load_state = 0;
          return;
        }
        this.querySubGraph(cardTypeId);
        this.edition_current = parseInt(res[1]);
        this.getCardData(cardTypeId);
        const owner = await this.getReadOnlyZoombiesContract.ownerOf(token_id);
        this.owner = owner;
        this.owner_url = this.getCryptLink(owner);
        const releaseTime = await this.getReadOnlyZoombiesContract.storeReleaseTime(
          cardTypeId
        );
        this.released_date = new Intl.DateTimeFormat("en-US", {
          dateStyle: "full",
          timeStyle: "long",
        }).format(releaseTime * 1000);
      } catch (error) {
        console.error({ error });
      }
    },
    getCryptLink(owner) {
      let url;

      if (window.location.host === "moonbase.zoombies.world") {
        url = "https://moonbase.zoombies.world";
      } else if (process.env.NODE_ENV === "development") {
        url = "http://localhost:8080";
      } else {
        url = "https://movr.zoombies.world";
      }

      return `${url}/my-zoombies-nfts/${owner}`;
    },
    getCardData: function (card_id) {
      axios
        .get(
          "https://zoombies.world/services/getCardData.php?card_id=" + card_id
        )
        .then(this.handleGotCardData);
    },
    handleGotCardData: function (res) {
      //console.log(res.data);

      var newAttr = [];
      //format the attributes to match our JS objects
      res.data.attributes.forEach(function (element) {
        newAttr[element.trait_type] = element.value;
      });

      //Overwrite our JSON reponse with vue friendly card binding data
      res.data.attributes = newAttr;

      //Get the human label for rarity
      this.rarity = res.data.attributes.rarity;

      //Append the bg
      switch (res.data.attributes.rarity) {
        case "Common":
          res.data.attributes.rarity = "card-bg card-bg-6";
          break;
        case "Uncommon":
          res.data.attributes.rarity = "card-bg card-bg-5";
          break;
        case "Rare":
          res.data.attributes.rarity = "card-bg card-bg-4";
          break;
        case "Epic":
          res.data.attributes.rarity = "card-bg card-bg-3";
          break;
        case "Diamond":
          res.data.attributes.rarity = "card-bg card-bg-2";
          break;
        case "Platinum":
          res.data.attributes.rarity = "card-bg card-bg-1";
          break;
      }

      if (res.data.attributes.edition_total === 0) {
        res.data.attributes.cost = "Booster";
      }

      this.edition_max = (res.data.attributes.edition_total == 0) ? 'Unlimited' : res.data.attributes.edition_total;
      this.card = res.data;
      this.card.id = this.token_id;
      this.load_state = 1;
    },
    searchToken() {
      const tokenId = this.tokenToSearch.replace("#", "");
      this.$router.replace(tokenId);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  padding-top: 20px;
}

a {
  color: #7ef4f6;
}

.row {
  justify-content: center;
}

#stats-container {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.flex-row {
  display: flex;
}

.flex-row > * {
  flex: 1;
  min-width: 0;
}

.wrap-text {
  word-wrap: break-word;
}

.centered {
  display: flex;
  align-items: center;
}

.label {
  max-width: 200px;
  margin-right: 10px;
}

#card-wrapper {
  display: flex;
  justify-content: center;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.search {
  width: 50%;
  min-width: 300px;
  margin-bottom: 20px;
}

.description {
  font-size: 18px;
  font-weight: 500;
  margin-top: 20px;
}

.valuation-label {
  color: #7ef4f6;
  font-weight: bold;
  font-size: 1.5em;
}
</style>
