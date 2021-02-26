<template>
  <div>
    <v-col class="col-12 col-md-12 ma-0">
      <v-progress-linear
        indeterminate
        color="primary"
        v-if="itemLoading"
      ></v-progress-linear>
      <div class="pa-2">
        <v-row no-getters>
          <v-col
            class="col-2 pa-2"
            v-for="(item, key) in machineItemList"
            v-bind:key="key"
          >
            <v-card
              class="pa-4"
              heigth="300"
              @click="createTransaction(item)"
              :disabled="transactionDialog || item.itemQty <= 0 ? true : false"
            >
              <v-img
                v-if="item.itemImg"
                :src="`${baseURL}/public/uploads/${item.itemImg}`"
                class="ma-auto"
                height="200"
                width="200"
                contain
              >
              </v-img>
              <v-card-text
                class="text-center title pa-1"
                :class="item.itemQty > 0 ? '' : 'red--text'"
              >
                <b>{{ item.itemQty > 0 ? `${item.itemPrice} บาท` : "หมด" }}</b>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-col>

    <!-- create transaction -->
    <v-dialog
      v-if="transactionDialog"
      v-model="transactionDialog"
      width="560"
      persistent
    >
      <v-card>
        <v-alert
          v-if="boxAlertActive"
          border="left"
          :icon="boxAlertStatus ? 'check' : 'close'"
          :type="boxAlertStatus ? 'success' : 'error'"
          class="primary white--text font-weight-bold capTitle"
        >
          {{ boxAlertMsg }}
        </v-alert>
        <v-card-title
          v-else
          class="primary white--text font-weight-bold capTitle"
        >
          {{ transaction.itemName.replace(/\_|\-/gim, " ") }}
        </v-card-title>
        <v-card-text class="pa-6">
          <v-row class="pt-2" no-getters>
            <v-col class="col-6 ma-0">
              <v-img
                v-if="transaction.itemImg"
                :src="`${baseURL}/public/uploads/${transaction.itemImg}`"
                class="ma-auto"
                height="400"
                width="400"
                contain
              >
              </v-img>
            </v-col>
            <v-col class="col-6">
              <v-progress-linear
                indeterminate
                color="primary"
                v-if="transactionLoading"
              ></v-progress-linear>
              <div v-if="base64Transaction && !transactionLoading">
                <div class="text-center display-2 font-weight-bold">
                  {{ transaction.itemPrice }} บาท
                </div>
                <v-img
                  :src="base64Transaction"
                  class="ma-auto"
                  height="240"
                  width="240"
                  contain
                >
                </v-img>
                <div
                  v-if="!boxAlertActive"
                  class="headline font-weight-bold text-center"
                >
                  Time Left : {{ transactionTimeLeft }}
                </div>
                <v-btn
                  class="mt-4"
                  color="error"
                  @click="cancelTransaction()"
                  :loading="cancelTransactionBtn"
                  outlined
                  tile
                  block
                  >Cancel Order</v-btn
                >
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- create transaction -->
    <MySnackbar :show="snackBar" :status="snackBarStatus" :msg="snackBarMsg" />
  </div>
</template>
<script>
import lnc from "../../auth/index";
import MySnackbar from "../../components/SnackBar";
import numeral from "numeral";
import moment from "moment";
import delay from "delay";
import jwt_decode from "jwt-decode";
import io from "socket.io-client";

export default {
  components: {
    MySnackbar,
  },
  data: () => ({
    snackBar: false,
    snackBarStatus: false,
    snackBarMsg: "",

    machineItemList: [],
    machineItemName: "",

    transactionDialog: false,
    transaction: {},
    transactionCancelUrl: "",
    transactionLoading: false,
    transactionTimeOut: "",
    transactionTimeLeft: 70,
    cancelTransactionBtn: false,
    base64Transaction: "",

    boxAlertActive: false,
    boxAlertStatus: false,
    boxAlertMsg: "",
    socket: {},
  }),

  computed: {
    baseURL() {
      return this.$http.defaults.baseURL;
    },
  },
  watch: {
    options() {
      this.show();
    },
  },
  created() {
    this.page = this.$route.name;
    this.machineId = this.$route.params.machineId;
    this.show();
  },
  methods: {
    async show() {
      try {
        this.itemLoading = true;
        const url = `api/machine/item/${this.machineId}/client`;
        const rs = await lnc.get(url);
        if (rs.status == 200) {
          let data = rs.data;
          this.machineItemList = data;
          this.machineItemName = rs.data[0].name;
        }
      } catch (e) {
        console.log(e, "catch on show");
      }
      this.itemLoading = false;
    },
    showNearlyMachineItem() {},
    async createTransaction(item) {
      try {
        this.transactionLoading = true;
        this.transactionDialog = true;
        this.transaction = item;
        const url = `api/transaction/${item.machineId}/${item.itemId}`;
        const rs = await lnc.post(url);
        if (rs.status === 200 && rs.data.status) {
          const token = rs.data.token;
          this.transactionCancelUrl = rs.data.cancelUrl;
          this.base64Transaction = rs.data.qrcodeUrl;
          const data = jwt_decode(token);
          this.runTransactionTimeLeft(data.exp);
          console.log(rs.data.url, "<=========");
        } else {
          this.snackAlert(false, "Create Tranction Fail");
          await delay(1000);
          this.closeTransaction();
        }
      } catch (e) {
        console.log(e, "catch on createTransaction");
        this.snackAlert(false, "Catch On Create Trancsaction");
      }
      this.transactionLoading = false;
    },
    async runTransactionTimeLeft(exp) {
      this.transactionTimeOut = new Date(exp * 1000);
      const call = this;
      setInterval(() => {
        call.transactionTimeLeft = moment(
          new Date(call.transactionTimeOut)
        ).diff(moment(), "seconds");
        if (call.transactionTimeLeft <= 0) {
          call.boxAlert(false, "Transaction Expire");
          clearInterval();
        }
      }, 1000);
    },
    async cancelTransaction() {
      try {
        this.cancelTransactionBtn = true;
        const url = this.transactionCancelUrl;
        const rs = await lnc.patch(url);
        if (rs.status === 200 && rs.data.status) {
          await this.boxAlert(false, "Cancel Transaction");
        } else {
          this.snackAlert(false, "Cancel Tranction Fail");
        }
      } catch (e) {
        console.log(e, "Catch on Cancel Trancsaction");
        this.snackAlert(false, "Catch On Cancel Trancsaction");
      }
      this.cancelTransactionBtn = false;
    },
    closeTransaction() {
      this.transactionDialog = false;
      this.transaction = {};
      this.transactionCancelUrl = "";
      this.transactionTimeOut = "";
      this.transactionTimeLeft = 70;
      this.base64Transaction = "";
    },
    async socketReloadPage(data) {
      await this.boxAlert(data.status, data.msg);
      location.reload();
    },
    renderWord(text = "", max = 20) {
      if (text.length > max) {
        return text.substr(0, max) + "..";
      } else {
        return text;
      }
    },
    numeral(price, format) {
      return numeral(price).format(format);
    },
    locateDateTime(date = new Date()) {
      return moment(date).format("DD-MMMM-YYYY HH:mm:ss");
    },
    async boxAlert(status, msg) {
      this.boxAlertActive = true;
      this.boxAlertStatus = status;
      this.boxAlertMsg = msg;
      await delay(300);
      this.closeTransaction();
      this.boxAlertActive = false;
      this.boxAlertStatus = false;
      this.boxAlertMsg = "";
    },
    snackAlert(status, msg) {
      this.snackBar = !this.snackBar;
      this.snackBarStatus = status;
      this.snackBarMsg = msg;
    },
  },
  mounted() {
    this.socket = io(this.baseURL);
    const socketUrl = `reloadPage:${this.machineId}`;
    this.socket.on(socketUrl, this.socketReloadPage);
  },
  beforeDestroy() {
    console.log("disconnect socket");
    this.socket.disconnect();
  },
};
</script>

<style scoped>
.capTitle {
  text-transform: capitalize !important;
  font-weight: 600 !important;
}
.hitemDiv {
  height: 62% !important;
  width: 100% !important;
}
.hitemImg {
  max-height: 100% !important;
  max-width: 100% !important;
}
</style>