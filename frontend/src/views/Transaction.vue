<template>
  <div>
    <v-col class="col-12 col-md-6 ma-0">
      <v-card class="pa-2" elevation="2" title>
        <v-row>
          <v-col class="offset-md-8 col-md-4 col-12 text-right">
            <v-text-field
              v-model="search"
              v-on:keyup.13="showSearch()"
              append-icon="search"
              label="Search"
              single-line
              hide-details
              class="pr-2"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-progress-linear
              :active="dtbLoading"
              reactive
            ></v-progress-linear>
            <v-data-table
              :headers="header"
              :items="pageData"
              :options.sync="options"
              :serverItemsLength="totalItems"
              :itemsPerPageOptions="[5, 15, 20, 30]"
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td class="font-weight-bold f11 pa-1 text-left">
                    {{ item.transactionNumber }}
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-center">
                    {{ item.status }}
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-center">
                    {{ item.machineName }}
                  </td>

                  <td class="font-weight-bold f11 pa-1 text-center">
                    <v-img
                      :src="
                        item.img
                          ? `${baseURL}/public/uploads/${item.img}`
                          : `${baseURL}/public/can.jpg`
                      "
                      class="ma-2 ma-auto"
                      max-width="60"
                      max-height="60"
                      aspect-ratio="1"
                      contain
                    >
                    </v-img>
                    <span>{{ item.itemName }}</span>
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-center">
                    {{ item.itemPrice }} บาท
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-right">
                    {{ locateDateTime(item.createdAt) }}
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-right">
                    <v-icon
                      @click="transactionDetailActive(item.transactionNumber)"
                      color="info"
                      size="20"
                      class="ma-1"
                      >list</v-icon
                    >
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <!-- transaction detail -->
    <v-dialog
      v-if="transactionDetailDialog"
      v-model="transactionDetailDialog"
      max-width="600"
      persistent
    >
      <v-card>
        <v-card-title class="primary white--text">
          <b>Transaction Detail</b>
          <v-spacer></v-spacer>
          <v-btn color="white" @click="transactionDetailClose()" fab icon>
            <v-icon> close </v-icon>
          </v-btn>
        </v-card-title>
        <div class="pa-2">
          <v-card-text class="pa-0">
            <b>Transaction Number : </b>
            {{ transactionDetail.transactionNumber }}
          </v-card-text>
          <v-card-text class="pa-0">
            <b>Item Name : </b> {{ transactionDetail.itemName }}
          </v-card-text>
          <v-card-text class="pa-0">
            <b>Transaction Price : </b> {{ transactionDetail.itemPrice }}
          </v-card-text>
          <v-card-text class="pa-0">
            <b>Machine Name : </b> {{ transactionDetail.machine.name }}
          </v-card-text>
          <v-card-text class="pa-0">
            <b>Machine Model : </b> {{ transactionDetail.machine.machineModel }}
          </v-card-text>
          <v-card-text class="pa-0">
            <b>Machine Address : </b>
            {{
              `${transactionDetail.machine.address.address} ${transactionDetail.machine.address.subdistrict} ${transactionDetail.machine.address.district} ${transactionDetail.machine.address.city} ${transactionDetail.machine.address.postcode}`
            }}
          </v-card-text>
          <v-card-text class="pa-0">
            <b>CreatedAt : </b>
            {{ locateDateTime(transactionDetail.createdAt) }}
          </v-card-text>
        </div>
      </v-card>
    </v-dialog>
    <!-- transaction detail -->
    <MySnackbar :show="snackBar" :status="snackBarStatus" :msg="snackBarMsg" />
  </div>
</template>
<script>
import lnc from "../auth/index";
import MySnackbar from "../components/SnackBar";
import numeral from "numeral";
import moment from "moment";

export default {
  components: {
    MySnackbar,
  },
  data: () => ({
    snackBar: false,
    snackBarStatus: false,
    snackBarMsg: "",

    dtbLoading: false,
    btnLoading: false,

    search: "",
    pageData: [],
    totalItems: 0,
    header: [
      {
        text: "Transaction Number",
        value: "transactionNumber",
        align: "left",
        class: "",
        width: "120px",
        fixed: true,
      },
      {
        text: "Status",
        value: "status",
        align: "center",
        class: "",
        width: "50px",
        fixed: true,
        sortable: false,
      },
      {
        text: "Machine Name",
        value: "machineName",
        align: "center",
        class: "",
        width: "100px",
        fixed: true,
      },
      {
        text: "Item",
        value: "itemName",
        align: "center",
        class: "",
        width: "125px",
        fixed: true,
      },
      {
        text: "Price",
        value: "itemPrice",
        align: "center",
        class: "",
        width: "80px",
        fixed: true,
      },
      {
        text: "CREATED",
        value: "createdAt",
        align: "right",
        width: "150px",
        fixed: true,
        sortable: true,
        sort: (a, b) => {
          if (new Date(a) > new Date(b)) return 1;
          if (new Date(a) < new Date(b)) return -1;
          return 0;
        },
      },
      {
        text: "INFO",
        value: "active",
        align: "right",
        class: "",
        width: "40px",
        fixed: true,
        sortable: false,
      },
    ],
    options: {
      search: "",
      itemsPerPage: 5,
      page: 1,
      sortBy: ["CreatedAt"],
      sortDesc: [true],
    },

    transactionDetailDialog: false,
    transactionDetailLoading: false,
    transactionDetail: {},
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
  },
  methods: {
    async show() {
      const query = lnc.qeuryStr(this.options);
      if (!query) return;
      const url = `/api/transaction${query}`;
      try {
        this.dtbLoading = true;
        const rs = await lnc.get(url);
        if (rs.status == 200) {
          this.pageData = rs.data.data;
          this.totalItems = rs.data.rows;
        }
      } catch (e) {
        console.log(e, "catch on show", url);
      }
      this.dtbLoading = false;
    },

    /////////////////// end show
    async transactionDetailActive(transactionNumber) {
      const url = `/api/transaction/transactiondetail/${transactionNumber}`;
      try {
        this.transactionDetailLoading = true;
        this.transactionDetailDialog = true;
        const rs = await lnc.get(url);
        console.log(rs, "rs");
        if (rs.status == 200) {
          this.transactionDetail = rs.data;
        }
      } catch (e) {
        console.log(e, "catch on transactionDetailActive", url);
      }
    },
    async transactionDetailClose() {
      this.transactionDetailLoading = false;
      this.transactionDetailDialog = false;
      this.transactionDetail = {};
    },
    /////////////////// end delete
    showSearch() {
      this.options = { ...this.options, ...{ search: this.search } };
    },
    numeral(price, format) {
      return numeral(price).format(format);
    },
    save() {},
    locateDateTime(date = new Date()) {
      return moment(date).format("DD-MMMM-YYYY HH:mm:ss");
    },
    snackAlert(status, msg) {
      this.snackBar = !this.snackBar;
      this.snackBarStatus = status;
      this.snackBarMsg = msg;
    },
  },
};
</script>


