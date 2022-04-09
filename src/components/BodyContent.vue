<template>
  <div>
    <main role="main" class="container">
      <b-container fluid class="text-center">
        <b-row>
          <b-col>
            <div v-if="metamaskInstalled">
              <b-col sm="12" md="12">
                <b-button
                  v-b-modal.sponsor-modal
                  size="lg"
                  variant="info"
                  class="btn-font"
                  >EARN FREE ZOOM</b-button
                >
              </b-col>

              <b-col class="mt-5" sm="12" md="12">
                <span class="zoombies-font h1">
                  <number
                    ref="nftSupply"
                    :from="oldTotalNft"
                    :to="getTotalNftSupply"
                    :format="formatNumber"
                    :duration="3.5"
                  /> </span
                ><br />
                <span class="text-pink h5">ZOOMBIE NFTS MINTED</span>
              </b-col>

              <b-col class="mt-4" sm="12" md="12">
                <span class="zoombies-font h1">
                  <number
                    ref="zoomBal"
                    :from="oldTotalZoom"
                    :to="getTotalZoomBalance"
                    :format="formatNumber"
                    :duration="3.5"
                  /> </span
                ><br />
                <span class="text-aqua h5">
                  ZOOM
                  <img src="@/assets/zoomTokenCoin.svg" class="coin-logo" />
                  TOKENS IN ZWORLD
                </span>
              </b-col>

              <b-col class="mt-4" sm="12" md="12">
                <span class="zoombies-font h1">36,955</span><br />
                <span class="text-purple h5">ZOOMBIE HERDERS</span>
              </b-col>
            </div>

            <div v-else>
              <h2>
                <p>In order to Connect and participate on the blockchain:</p>
                You must have a valid Web3 wallet installed<br /><br />
                <a href="https://metamask.io/" target="_blank">
                  <b-button variant="danger" size="lg"
                    >Install Metamask</b-button
                  >
                </a>
              </h2>
            </div>
          </b-col>
          <!-- Right side -->
          <b-col class="mt-5" md="12" sm="12" lg="8">
            <b-img-lazy
              src="https://zoombies.world/images/app_home_welcome.png"
              fluid
              alt="Welcome to Zoombies banner"
              style="max-width: 100%"
            ></b-img-lazy>
          </b-col>
        </b-row>
        <div class="d-md-none">
          <h3>
            View this website on a larger screen to view the Zoom inflation
            graphs
          </h3>
          <br />
          Over the previous 100 days:<br />
          <strong>Total ZOOM minted:</strong> {{ totalZoomMinted }}<br />
          <strong>Total ZOOM Burned:</strong> {{ totalZoomBurned }}
        </div>

        <b-row align-v="center" align-h="start">
          <b-col class="col-6">
            <b-row align-v="center" align-h="start">
              <b-col class="col-4  text-right">
                <img src="https://zoombies.world/images/dapp/zoombies_card_back.svg" width="40%" /><br/>
                <img src="https://zoombies.world/images/dapp/zoombies_card_back.svg" width="40%" />
              </b-col>
              <b-col class="col-8  text-left">
                <h3 class="zoombies-font">
                  {{NftsMinted24Hrs}}<br/>
                  NFTs Minted - Last 24 hrs<br/><br/>
                  {{NftsBurned24Hrs}}<br/>
                  NFTs Burned - Last 24 hrs
                </h3>
              </b-col>
            </b-row>
          </b-col>
          <b-col class="col-6">
            <b-row align-v="center" align-h="start">
              <b-col class="col-4 text-right">
                <img src="https://zoombies.world/images/zoombies_coin.svg" width="40%" /><br/><br/><br/>
                <img src="https://zoombies.world/images/zoombies_coin.svg" width="40%" />
              </b-col>
              <b-col class="col-8 text-left">
                <h3 class="zoombies-font">
                  {{zoomMinted24Hrs}}<br/>
                  ZOOM Minted - Last 24 hrs<br/><br/>
                  {{zoomBurned24Hrs}}<br/>
                  ZOOM Burned - Last 24 hrs
                </h3>
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <b-row class="">
          <b-col align-h="start" class="mx-auto">
            <h3 class="zoombies-font text-left">Last 5 NFTs Minted</h3>
            <span v-for="tokenId in lastFiveNFTs">
              <router-link :to="`/view/${tokenId}`">
                <img :src="`https://moonbase.zoombies.world/nft-image/${tokenId}`" width="13%" />
              </router-link>
            </span>
          </b-col>
        </b-row>

        <b-row class="d-none d-md-block">
          <b-row align-v="center" align-h="center" style="border:4px solid #7df4f6; padding:0px">
            <b-col>
              Minted Boosters
            </b-col>
            <b-col>
              <b-form-select v-model="rangeSelected" :options="mintedBoostersDateRange" @change="newRangeSelected"></b-form-select>
            </b-col>
          </b-row>
          <b-row align-v="end">
            <b-col>
              <div class="graph-title">
                NFTs Minted by Rarity
              </div>
              The NFT minted daily column chart indicates the proportion of NFTs minted per day by Rarity.<br/><br/>
              <apexchart
                id="barChartContainer"
                ref="rarityChart"
                width="100%"
                type="bar"
                :options="barChartOptions"
                :series="barChartSeries"
              ></apexchart>
            </b-col>
            <b-col>
              <div>
                <div class="graph-title">
                  Moonriver ZOOM
                  <img src="@/assets/zoomTokenCoin.svg" class="coin-logo" /> Token
                  Inflation
                </div>
                The ZOOM inflation chart tracks the amount of ZOOM tokens that
                have been minted and burned in the last 100 days.<br />
                Click and drag a region to zoom in
                <apexchart
                  id="chartContainer"
                  ref="zoomChart"
                  width="100%"
                  type="line"
                  :options="chartOptions"
                  :series="chartSeries"
                ></apexchart>
              </div>
            </b-col>
          </b-row>
        </b-row>

      </b-container>
    </main>
  </div>
</template>

<script>
import { BButton, BFormSelect, BContainer, BRow, BCol, BImgLazy } from "bootstrap-vue";
import { mapGetters } from "vuex";
import apexchart from "vue-apexcharts";
import { ethers } from "ethers";
import { isMetamaskInstalled } from "../store/blockChainStore";
import { isLocal } from "../util/constants/networks";

export default {
  name: "BodyContent",
  components: {
    BButton,
    BFormSelect,
    BContainer,
    BRow,
    BCol,
    BImgLazy,
    apexchart,
  },
  data() {
    return {
      rangeSelected: null,
      zoomSold: "Loading..",
      zoomWalletsRemaining: "Loading..",
      totalCzxpToBuy: "",
      movrCost: 0,
      myPurchaseTotal: 0,
      onMainNet: false,
      oldTotalZoom: 0,
      oldTotalNft: 0,
      lastFiveNFTs: [],
      totalZoomMinted: "Loading...",
      totalZoomBurned: "Loading...",
      zoomMinted24Hrs: "Loading...",
      zoomBurned24Hrs: "Loading...",
      NftsMinted24Hrs: "Loading...",
      NftsBurned24Hrs: "Loading...",
      mintedBoostersDateRange: [],
      graphData: Object(),
      rarityCount: Object(),
      barChartOptions: {
          chart: {
            type: 'bar',
            stacked: true
          },
          xaxis: {
            labels: {
              style: {
                colors: "#FFFFFF",
                fontSize: "14px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 400,
                cssClass: "apexcharts-xaxis-label",
              },
            },
            type: 'datetime',
            categories: ['01/01/2011 GMT'],
          },
          legend: {
            fontSize: "16px",
            labels: {
              useSeriesColors: true,
            }
          },
          colors: ["#585858", "#04c1e8","#d5005a","#b92ee4","#d4e2f9","eaeef8"],
          tooltip: {
            style: {
              fontSize: "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              color: "#000000",
            },
            fillSeriesColor: true,
            theme: "dark",
            followCursor: true,
          },
      },
      chartOptions: {
        markers: {
          size: 3,
          strokeWidth: 2,
          strokeColors: "#fff",
          hover: {
            sizeOffset: 6,
          },
          colors: ["#325d5e", "#602958"],
        },
        chart: {
          id: "vuechart-example",
          zoom: {
            enabled: true,
            type: "x",
            autoScaleYaxis: true,
          },
          toolbar: {
            autoSelected: "zoom",
          },
          type: "line",
        },
        legend: {
          fontSize: "22px",
          labels: {
            useSeriesColors: true,
          },
        },
        tooltip: {
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            return (
              '<div class="arrow_box">' +
              "<span>" +
              series[seriesIndex][dataPointIndex] +
              "</span>" +
              "</div>"
            );
          },
          palette: "palette10",
          x: {
            show: false,
          },
          onDatasetHover: {
            highlightDataSeries: true,
          },
          style: {
            fontSize: "18px",
            fontFamily: "Helvetica, Arial, sans-serif",
          },
          followCursor: true,
          shared: true,
          inverseOrder: false,
          custom: undefined,
          fillSeriesColor: true,
        },
        xaxis: {
          tickPlacement: "on",
          type: "datetime",
          categories: [],
          labels: {
            style: {
              colors: "#FFFFFF",
              fontSize: "18px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
        yaxis: {
          title: {
            text: "ZOOM Tokens",
            style: {
              color: "#deadfc",
              fontSize: "22px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-title",
            },
          },
          type: "numeric",
          labels: {
            style: {
              colors: "#FFFFFF",
              fontSize: "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              cssClass: "apexcharts-yaxis-label",
            },
            formatter: function (val) {
              return parseInt(val).toLocaleString();
            },
          },
        },
      },
      barChartSeries : [{}],
      chartSeries: [
        {
          name: "minted",
          color: "#17a2b8",
          data: [1, 2, 3],
        },
        {
          name: "burned",
          color: "#f566e2",
          data: [7, 6, 4],
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      getWalletAddress: "blockChain/getWalletAddress",
      getZoomBalance: "blockChain/getZoomBalance",
      getTotalZoomBalance: "blockChain/getTotalZoomBalance",
      getTotalNftSupply: "blockChain/getTotalNftSupply",
      getTotalNftTypes: "blockChain/getTotalNftTypes",
      getChainId: "blockChain/getChainId",
    }),
    metamaskInstalled: () => {
      return isMetamaskInstalled();
    },
  },
  mounted() {
    if (
      this.getChainId == 1285 ||
      window.location.host == "movr.zoombies.world"
    ) {
      this.onMainNet = true;
    } else {
      this.onMainNet = false;
    }
    this.graphData = new Object({ date: [], minted: [], burned: [] });
    this.getZoomGraph();
  },
  watch: {
    getTotalZoomBalance(newVal, oldVal) {
      if (newVal > 0) {
        this.oldTotalZoom = oldVal;
        this.pulsateText(this.$refs.zoomBal);
      }
    },
    getTotalNftSupply(newVal, oldVal) {
      if (newVal > 0) {
        this.oldTotalNft = oldVal;
        this.pulsateText(this.$refs.nftSupply);
      }
    },
  },
  methods: {
    newRangeSelected() {
      let start = Math.trunc(this.rangeSelected*14);
      this.bindBarChart(start, start+14)
    },
    bindBarChart: async function(start, end) {
      //bind the columns on bar chart for the default view
      this.barChartSeries = [
        {
          name: 'COMMON',
          data: this.rarityCount['common'].slice(start, end)
        }, {
          name: 'UNCOMMON',
          data: this.rarityCount['uncommon'].slice(start, end)
        }, {
          name: 'RARE',
          data: this.rarityCount['rare'].slice(start, end)
        }, {
          name: 'EPIC',
          data: this.rarityCount['epic'].slice(start, end)
        }, {
          name: 'PLATINUM',
          data: this.rarityCount['platinum'].slice(start, end)
        }
      ]

      let dateShift = 1;
      if(start == 0){
        dateShift = 0;
      }

      //bind the default daterange for bar column chart
      this.barChartOptions = {
          chart: {
            type: "bar",
            stacked: true
          },
          xaxis: {
          type: "datetime",
          categories: this.rarityCount['date'].slice(start-dateShift, end-dateShift),
        },
      }
    },
    getZoomGraph: async function () {
      const query = `query {
                      logCardMinteds(orderBy:BLOCK_NUMBER_ASC,last:5) {
                        nodes {
                          tokenId
                        }
                      }
                      nFTPerDays(last:1) {
                        nodes {
                        id
                        minted
                        burned
                        }
                      }
                      zoomPerDays(last:100) {
                        nodes{
                          id
                          minted
                          burned
                        }
                      }
                      rarityPerDays(last:98) {
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

      const result = await fetch(graphEndPoint,
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

      this.rarityCount = new Object({ date: [], diamond: [], platinum: [], epic: [], rare: [], uncommon: [], common: [] });
      //shape the data for the column chart. the 4 series and the date array
      res.data.rarityPerDays.nodes.forEach((item, i) => {
        //console.log(item);
        this.rarityCount['date'].push(parseInt(item.id));
        this.rarityCount['diamond'].push(item.diamond);
        this.rarityCount['platinum'].push(item.platinum);
        this.rarityCount['epic'].push(item.epic);
        this.rarityCount['rare'].push(item.rare);
        this.rarityCount['uncommon'].push(item.uncommon);
        this.rarityCount['common'].push(item.common);
      });

      //Update the bar chart series data
      this.bindBarChart(83,97);

      //shape the data for dropdown for Minted Boosters 7 items -- 14 day items
      const from = new Date(this.rarityCount['date'][0]);
      const to = new Date(this.rarityCount['date'][97]);

      // Convert date string to dd/mm/yyyy format
      const buildDateString = (date) => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
      }

      // Increase date by x amount of days
      const increaseDays = (date, amount) => new Date(date.setDate(date.getDate() + amount));

      // Get all weeks in given period
      const buildWeeks = (start, end) => {
        const weeks = [{ value: null, text: 'Please select a range' }];
        let current = new Date(start);
        let counter = 0;
        while(current < end) {
          // Get start of the week
          const beginOfWeek = new Date(current);
          // Get end of the week
          let endOfWeek = increaseDays(current, 13); //OVERRIDE for 2 weeks
          // If there are less then 7 days left before the end, use the end.
          endOfWeek = endOfWeek > end ? end : endOfWeek;

          // Add week to our collection
          weeks.push({value: counter, text: buildDateString(beginOfWeek) +' - '+ buildDateString(endOfWeek)});
          current = increaseDays(current, 1);
          counter++;
        }

        return weeks;
      }

      const weeks = buildWeeks(from, to).reverse();

      //bind to dropdown
      this.mintedBoostersDateRange = weeks;


      //Last 5 NFTs minted
      res.data.logCardMinteds.nodes.forEach((i) => {
          this.lastFiveNFTs.push(i.tokenId);
      })

      this.NftsMinted24Hrs = ethers.utils.commify(res.data.nFTPerDays.nodes[res.data.nFTPerDays.nodes.length-1].minted);
      this.NftsBurned24Hrs = ethers.utils.commify(res.data.nFTPerDays.nodes[res.data.nFTPerDays.nodes.length-1].burned);
      this.zoomMinted24Hrs = ethers.utils.commify(ethers.utils.formatEther(res.data.zoomPerDays.nodes[res.data.zoomPerDays.nodes.length-1].minted));
      this.zoomBurned24Hrs = ethers.utils.commify(ethers.utils.formatEther(res.data.zoomPerDays.nodes[res.data.zoomPerDays.nodes.length-1].burned));

      //Shape the zoomMinted and burned totals
      let graphData = new Object({ date: [], minted: [], burned: [] });
      this.totalZoomMinted = ethers.BigNumber.from("0");
      this.totalZoomBurned = ethers.BigNumber.from("0");

      res.data.zoomPerDays.nodes.forEach((i) => {
        graphData.date.push(parseInt(i.id));
        const minted = ethers.utils.formatEther(i.minted);
        const burned = ethers.utils.formatEther(i.burned);
        //mobile
        this.totalZoomMinted = this.totalZoomMinted.add(
          ethers.utils.parseUnits(minted)
        );
        this.totalZoomBurned = this.totalZoomBurned.add(
          ethers.utils.parseUnits(burned)
        );

        graphData.minted.push(parseInt(minted));
        graphData.burned.push(parseInt(burned));
      });
      //For mobile only
      this.totalZoomMinted = parseInt(
        ethers.utils.formatEther(this.totalZoomMinted)
      ).toLocaleString();
      this.totalZoomBurned = parseInt(
        ethers.utils.formatEther(this.totalZoomBurned)
      ).toLocaleString();

      this.$refs.zoomChart.updateOptions({
        xaxis: {
          /*
          title: {
            text: "Day/Month",
            style: {
              color: "#deadfc",
              fontSize: "22px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-title",
            },
          },
          */
          type: "datetime",
          categories: graphData.date,
          labels: {
            //format: "dd/MM",
            style: {
              colors: "#FFFFFF",
              fontSize: "10px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
      });

      //Update the model for the series
      this.chartSeries = [
        {
          name: "minted",
          color: "#17a2b8",
          data: graphData.minted,
        },
        {
          name: "burned",
          color: "#f566e2",
          data: graphData.burned,
        },
      ];
    },
    formatNumber(number) {
      return parseInt(number.toFixed(0)).toLocaleString();
    },
    pulsateText(ref) {
      ref.$el.classList.value = ref.$el.classList.value + "pulsate";
      ref.play();
      setTimeout(() => {
        ref.$el.classList.value = "";
      }, 500);
    },
    addZOOMtoMetaMask: async function () {
      const tokenAddress = this.onMainNet
        ? "0x8bd5180Ccdd7AE4aF832c8C03e21Ce8484A128d4"
        : "0x8e21404bAd3A1d2327cc6D2B2118f47911a1f316";
      const tokenSymbol = this.onMainNet ? "ZOOM" : "ZOOM-DEV";
      const tokenDecimals = 18;
      const tokenImage = "https://zoombies.world/images/zoombies_coin.svg";

      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address: tokenAddress, // The address that the token is at.
              symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenDecimals, // The number of decimals in the token
              image: tokenImage, // A string url of the token logo
            },
          },
        });
      } catch (error) {
        console.log("addCZXPtoMetaMask error:", error);
      }
    },
    updateBadge: async function () {
      console.log("ggogogogo");
    },
    filterCzxpInput: function () {
      this.totalCzxpToBuy = this.totalCzxpToBuy.replace(/[^\d]/g, "");
      if (
        this.myPurchaseTotal + parseInt(this.totalCzxpToBuy * 100000000000) >
        20000000000000000000
      ) {
        this.totalCzxpToBuy =
          (20000000000000000000 - this.myPurchaseTotal) / 100000000000;
      }

      this.movrCost = parseFloat(this.totalCzxpToBuy / 10000000).toFixed(7);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.feature-panel {
  color: white;
  text-shadow: 1px 1px black;
  background: rgba(0, 0, 0, 0.35);
}

.card-demo-group {
  float: right;
  width: 30%;
  margin-left: 4em;
  position: relative;
  top: -2em;
}

.badge-icon {
  max-width: 3rem;
  filter: drop-shadow(1px 1px 4px #ffffff);
}

.btn-font {
  font-size: 2rem;
}

.coin-logo {
  max-width: 2rem;
}

.pulsate {
  display: inline-block;
  transform: scale(1);
  animation: pulsate 0.5s ease-out;
}

@keyframes pulsate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

.totals {
  display: table;
}

.graph-title {
  font-size: 28px;
  font-weight: 500;
  line-height: 1.2;
  color: #7ef4f6;
}

.apexcharts-tooltip {
  background: #1c1f50;
  border: 4px solid red;
}

.arrow_box {
  position: relative;
  background: #555;
  border: 2px solid #000000;
}
.arrow_box:after,
.arrow_box:before {
  right: 100%;
  top: 50%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.arrow_box:after {
  border-color: rgba(85, 85, 85, 0);
  border-right-color: #555;
  border-width: 10px;
  margin-top: -10px;
}
.arrow_box:before {
  border-color: rgba(0, 0, 0, 0);
  border-right-color: #000000;
  border-width: 13px;
  margin-top: -13px;
}
</style>
