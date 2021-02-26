<template>
  <div>
    <v-col class="col-12 col-md-8 ma-0">
      <v-card class="pa-2" elevation="2" title>
        <v-row class="ma-0" no-getters> </v-row>
        <v-row class="ma-0" no-getters>
          <v-col class="offset-md-8 col-md-4 col-12 text-right">
            <v-text-field
              v-model="search"
              v-on:keyup.13="showSearch()"
              append-icon="search"
              label="Search"
              single-line
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
                    {{ item.machineModel }}
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-left">
                    {{ item.name }}
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-left">
                    {{ item.address.address }}
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-left">
                    {{ item.address.city }}
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-left">
                    {{ item.address.postcode }}
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-left">
                    {{ item.address.la || "-" }}
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-right">
                    {{ locateDateTime(item.createdAt) }}
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-right">
                    <v-icon
                      @click="mangeMachineItem(item._id)"
                      color="warning"
                      size="20"
                      class="ma-1"
                      >edit</v-icon
                    >
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <MySnackbar :show="snackBar" :status="snackBarStatus" :msg="snackBarMsg" />
  </div>
</template>
<script>
import lnc from "../auth/index";
import MySnackbar from "../components/SnackBar";
import numeral from "numeral";
import moment from "moment";
// import { mapActions, mapGetters } from "vuex";

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

    addMachine: {},
    addMachineDefault: {
      name: "AA1",
      address: {
        address: "เลขที่ 442 ซอยศิริถาวร",
        district: "สวนหลวง",
        subdistrict: "แขวงสวนหลวง",
        city: "กรุงเทพมหานคร",
        postcode: "10250",
        la: "",
      },
      machineModel: "A1",
    },
    addMachineBtn: false,
    addMachineDialog: false,

    updateMachine: {},
    updateMachineDialog: false,
    updateMachineBtn: false,

    deleteMachineDialog: false,
    deleteMachine: {},
    deleteMachineBtn: false,
    header: [
      {
        text: "Machine Model",
        value: "model",
        align: "left",
        class: "",
      },
      {
        text: "Machine Name",
        value: "name",
        align: "left",
        class: "",
      },
      {
        text: "Machine Address",
        value: "adress.adress",
        align: "left",
        class: "",
      },
      {
        text: "Machine City",
        value: "address.city",
        align: "left",
        class: "",
      },
      {
        text: "Machine Postcode",
        value: "address.postcode",
        align: "left",
        class: "",
      },
      {
        text: "Machine La",
        value: "address.la",
        align: "left",
        class: "",
      },
      // {
      //   text: "ACTIVE",
      //   value: "active",
      //   align: "center",
      //   class: "",
      //   width: "125px",
      //   fixed: true,
      // },
      {
        text: "Created",
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
        text: "Info",
        value: "active",
        align: "right",
        class: "px-2",
        width: "80px",
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
    machineModelList: [
      {
        name: "A1",
        slot: [
          { row: 1, column: 12 },
          { row: 2, column: 12 },
          { row: 3, column: 6 },
        ],
      },
    ],
    machineManageList: [
      { name: "Edit Info", value: 1 },
      { name: "Edit Item", value: 2 },
    ],
  }),
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
      const url = `/api/machine/nealyoutofstock${query}`;
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

    //////////////////////////////////////
    mangeMachineItem(machineId) {
      window.open(`/machineitem/${machineId}`);
    },
    /////////////////// end delete
    showSearch() {
      this.options = { ...this.options, ...{ search: this.search } };
    },
    numeral(price, format) {
      return numeral(price).format(format);
    },
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
