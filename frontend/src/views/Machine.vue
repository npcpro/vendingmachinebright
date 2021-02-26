<template>
  <div>
    <v-col class="col-12 col-md-8 ma-0">
      <v-card class="pa-2" elevation="2" title>
        <v-row class="ma-0" no-getters> </v-row>
        <v-row class="ma-0" no-getters>
          <v-col class="col-md-2 col-12 text-left">
            <v-btn
              class="mt-4"
              color="success"
              tile
              outlined
              small
              append-icon="add"
              @click="addMachineActive()"
            >
              ADD Machine
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="col-md-4 col-12 text-right">
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
              <template v-slot:item="{ item, index }">
                <tr>
                  <td class="font-weight-bold f11 pa-1 text-left">
                    {{ item.machineModel }}
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-left">
                    {{ item.name }}
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-left">
                    {{ item.avilable || 0 }}
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
                    <v-menu offset-y
                      ><template v-slot:activator="{ on }">
                        <v-btn color="warning" v-on="on" small icon>
                          <v-icon>edit</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          v-for="(manage, k) in machineManageList"
                          @click="manageMachine(manage, item, index)"
                          v-bind:key="k"
                        >
                          <v-list-item-title
                            >{{ manage.name }}
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                    <v-icon
                      @click="deleteMachineActive(item, index)"
                      color="error"
                      size="20"
                      class="ma-1"
                      >delete</v-icon
                    >
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <!-- add machine -->
    <v-dialog
      v-if="addMachineDialog"
      v-model="addMachineDialog"
      max-width="1250"
      persistent
    >
      <v-card>
        <v-card-title class="primary white--text">
          <b>Add New Machine</b>
          <v-spacer></v-spacer>
          <v-btn color="white" @click="addMachineClose()" fab icon>
            <v-icon> close </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-2">
          <v-row no-getters>
            <v-col class="col-12 col-md-3 ma-0">
              <v-row no-getters>
                <v-col class="col-12">
                  <v-text-field
                    v-model="addMachine.name"
                    :rules="[
                      () => !!addMachine.name || 'Please Input Machine Name',
                      () => addMachine.name.length > 2 || 'Min 3 Charactor',
                    ]"
                    label="Machine Name"
                    placeholder="Machine Name"
                  >
                  </v-text-field>
                </v-col>
                <v-col class="col-12">
                  <v-select
                    v-model="addMachine.machineModel"
                    :items="machineModelList"
                    item-value="name"
                    item-text="name"
                    label="Select Machine Model"
                  ></v-select>
                </v-col>
                <v-col class="col-12">
                  <v-text-field
                    v-model="addMachine.address.la"
                    label="Latitude,Longitude"
                    placeholder="Latitude,Longitude"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col class="col-12 col-md-5 ma-0">
              <v-row no-getters>
                <v-col class="col-12">
                  <v-text-field
                    v-model="addMachine.address.address"
                    :rules="[
                      () =>
                        !!addMachine.address.address ||
                        'Please Input Machine Address',
                      () =>
                        addMachine.address.address.length > 5 ||
                        'Min 5 Charactor',
                    ]"
                    label="Machine Address"
                    placeholder="Machine Address"
                  >
                  </v-text-field>
                </v-col>
                <v-col class="col-12 col-md-6">
                  <v-text-field
                    v-model="addMachine.address.subdistrict"
                    :rules="[
                      () =>
                        !!addMachine.address.subdistrict ||
                        'Please Input Machine Subdistrict',
                      () =>
                        addMachine.address.subdistrict.length > 5 ||
                        'Min 5 Charactor',
                    ]"
                    label="Machine Subdistrict"
                    placeholder="Machine Subdistrict"
                  >
                  </v-text-field>
                </v-col>
                <v-col class="col-12 col-md-6">
                  <v-text-field
                    v-model="addMachine.address.district"
                    :rules="[
                      () =>
                        !!addMachine.address.district ||
                        'Please Input Machine District',
                      () =>
                        addMachine.address.district.length > 5 ||
                        'Min 5 Charactor',
                    ]"
                    label="Machine District"
                    placeholder="Machine District"
                  >
                  </v-text-field>
                </v-col>
                <v-col class="col-12 col-md-6">
                  <v-text-field
                    v-model="addMachine.address.city"
                    :rules="[
                      () =>
                        !!addMachine.address.city ||
                        'Please Input Machine City',
                      () =>
                        addMachine.address.city.length > 3 || 'Min 3 Charactor',
                    ]"
                    label="Machine City"
                    placeholder="Machine City"
                  >
                  </v-text-field>
                </v-col>
                <v-col class="col-12 col-md-6">
                  <v-text-field
                    v-model="addMachine.address.postcode"
                    :rules="[
                      () =>
                        !!addMachine.address.postcode ||
                        'Please Input Machine Postcode',
                      () =>
                        addMachine.address.postcode.length > 3 ||
                        'Min 3 Charactor',
                    ]"
                    label="Machine Postcode"
                    placeholder="Machine Postcode"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row no-getters>
            <v-col class="col-12">
              <div class="pa-1 mb-2">
                <b>Slot Preview</b>
              </div>
              <div class="text-center">
                <v-row
                  class="ma-0"
                  v-for="(row, rowKey) in machineModelPreview"
                  v-bind:key="rowKey"
                  no-getters
                >
                  <v-col
                    :class="`col-${Math.round(100 / (row.length * 10))}`"
                    class="ma-0 pa-1"
                    v-for="(col, colKey) in row"
                    v-bind:key="colKey"
                  >
                    <v-card class="pa-3" height="50">
                      <span> {{ rowKey + 1 }}:{{ colKey + 1 }} </span>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
              <br />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="text-left">
          <v-btn
            color="success"
            :disabled="!chkMachineFormAdd"
            :loading="addMachineBtn"
            outlined
            tile
            block
            @click="addMachineSend()"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- add machine  -->

    <!-- update machine -->
    <v-dialog
      v-if="updateMachineDialog"
      v-model="updateMachineDialog"
      max-width="1250"
      persistent
    >
      <v-card>
        <v-card-title class="primary white--text">
          <b>Update Machine Info</b>
          <v-spacer></v-spacer>
          <v-btn color="white" @click="updateMachineClose()" fab icon>
            <v-icon> close </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-2">
          <v-row no-getters>
            <v-col class="col-12 col-md-3 ma-0">
              <v-row no-getters>
                <v-col class="col-12">
                  <v-text-field
                    v-model="updateMachine.name"
                    :rules="[
                      () => !!updateMachine.name || 'Please Input Machine Name',
                      () => updateMachine.name.length > 3 || 'Min 3 Charactor',
                    ]"
                    label="Machine Name"
                    placeholder="Machine Name"
                  >
                  </v-text-field>
                </v-col>
                <v-col class="col-12">
                  <v-text-field
                    v-model="updateMachine.address.la"
                    label="Latitude, Longtitude"
                    placeholder="Latitude, Longtitude"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col class="col-12 col-md-5 ma-0">
              <v-row no-getters>
                <v-col class="col-12">
                  <v-text-field
                    v-model="updateMachine.address.address"
                    :rules="[
                      () =>
                        !!updateMachine.address.address ||
                        'Please Input Machine Address',
                      () =>
                        updateMachine.address.address.length > 5 ||
                        'Min 5 Charactor',
                    ]"
                    label="Machine Address"
                    placeholder="Machine Address"
                  >
                  </v-text-field>
                </v-col>
                <v-col class="col-12 col-md-6">
                  <v-text-field
                    v-model="updateMachine.address.subdistrict"
                    :rules="[
                      () =>
                        !!updateMachine.address.subdistrict ||
                        'Please Input Machine Sucdistrict',
                      () =>
                        updateMachine.address.subdistrict.length > 5 ||
                        'Min 5 Charactor',
                    ]"
                    label="Machine Sucdistrict"
                    placeholder="Machine Sucdistrict"
                  >
                  </v-text-field>
                </v-col>
                <v-col class="col-12 col-md-6">
                  <v-text-field
                    v-model="updateMachine.address.district"
                    :rules="[
                      () =>
                        !!updateMachine.address.district ||
                        'Please Input Machine District',
                      () =>
                        updateMachine.address.district.length > 5 ||
                        'Min 5 Charactor',
                    ]"
                    label="Machine District"
                    placeholder="Machine District"
                  >
                  </v-text-field>
                </v-col>
                <v-col class="col-12 col-md-6">
                  <v-text-field
                    v-model="updateMachine.address.city"
                    :rules="[
                      () =>
                        !!updateMachine.address.city ||
                        'Please Input Machine City',
                      () =>
                        updateMachine.address.city.length > 3 ||
                        'Min 3 Charactor',
                    ]"
                    label="Machine City"
                    placeholder="Machine City"
                  >
                  </v-text-field>
                </v-col>
                <v-col class="col-12 col-md-6">
                  <v-text-field
                    v-model="updateMachine.address.postcode"
                    :rules="[
                      () =>
                        !!updateMachine.address.postcode ||
                        'Please Input Machine Postcode',
                      () =>
                        updateMachine.address.postcode.length > 3 ||
                        'Min 3 Charactor',
                    ]"
                    label="Machine Postcode"
                    placeholder="Machine Postcode"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="text-left">
          <v-btn
            color="success"
            :disabled="!chkMachineFormUpdate"
            :loading="updateMachineBtn"
            outlined
            tile
            block
            @click="updateMachineSend()"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- update machine -->

    <!-- delete machine -->
    <v-dialog
      v-if="deleteMachineDialog"
      v-model="deleteMachineDialog"
      max-width="600"
      persistent
    >
      <v-card>
        <v-card-title class="primary white--text"
          ><b>Delete Machine</b></v-card-title
        >
        <v-card-text class="mt-8">
          <span class="title"
            >Confirm To Delete Machine : {{ deleteMachine.name }}</span
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            :loading="deleteMachineBtn"
            outlined
            tile
            @click="deleteMachineSend()"
          >
            Yes
          </v-btn>
          <v-btn color="error" outlined tile @click="deleteMachineClose()">
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- delete machine  -->
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
        text: "Machine Avilable",
        value: "avilable",
        align: "left",
        class: "",
        sortable: false,
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

  computed: {
    chkMachineFormAdd() {
      console.log("start chkMachineFormAdd");
      if (!this.addMachineDialog) return false;
      if (this.addMachineDialog) {
        const chk =
          this.addMachine.name.length >= 3 &&
          this.addMachine.machineModel &&
          this.addMachine.address.address.length >= 3 &&
          this.addMachine.address.subdistrict.length >= 3 &&
          this.addMachine.address.district.length >= 3 &&
          this.addMachine.address.city.length >= 3 &&
          this.addMachine.address.postcode.length == 5;
        return chk;
      } else {
        console.log("dialog not active");
        return false;
      }
    },
    chkMachineFormUpdate() {
      console.log("start chkMachineFormUpdate");
      if (!this.updateMachineDialog) return false;
      if (this.updateMachineDialog) {
        const chk =
          this.updateMachine.name.length >= 3 &&
          this.updateMachine.address.address.length >= 3 &&
          this.updateMachine.address.subdistrict.length >= 3 &&
          this.updateMachine.address.district.length >= 3 &&
          this.updateMachine.address.city.length >= 3 &&
          this.updateMachine.address.postcode.length == 5;
        return chk;
      } else {
        console.log("dialog not active");
        return false;
      }
    },
    machineModelPreview() {
      try {
        console.log(this.addMachine, "this.addMachine");
        if (!this.addMachineDialog || !this.addMachine.machineModel) {
          console.log("Not Model");
          return [];
        }
        const machineModel = this.machineModelList.filter(
          (i) => i.name == this.addMachine.machineModel
        );
        if (machineModel[0].slot) {
          let slot = machineModel[0].slot.sort((a, b) =>
            a.row > b.row ? 1 : -1
          );
          let createSlot = [];
          for (const slotKey in slot) {
            createSlot[slotKey] = [];
            for (let i = 1; i <= slot[slotKey].column; i++) {
              createSlot[slotKey].push("1");
            }
          }
          return createSlot;
        } else {
          return [];
        }
      } catch (e) {
        console.log(e, "catch on machineModelPreview");
        return [];
      }
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
      const url = `/api/machine${query}`;
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
    addMachineActive() {
      this.addMachine = JSON.parse(JSON.stringify(this.addMachineDefault));
      this.addMachineDialog = true;
    },
    async addMachineSend() {
      try {
        this.addMachineBtn = true;

        const data = this.addMachine;
        const rs = await lnc.post(`api/machine`, data);
        if (rs.status === 200 && rs.data.status) {
          this.pageData.push(rs.data.data);
        }
        this.snackAlert(rs.data.status, rs.data.msg);
      } catch (e) {
        console.log(e, "catch on addMachineSend");
        this.snackAlert(false, "catch on addMachineSend");
      }
      this.addMachineClose();
    },
    addMachineClose() {
      this.addMachine = JSON.parse(JSON.stringify(this.addMachineDefault));
      this.addMachineBtn = false;
      this.addMachineDialog = false;
    },
    //////////////////////////////////////
    manageMachine(manage, item, index) {
      if (manage.value == 1) {
        this.updateMachineActive(item, index);
      } else {
        window.open(`/machineitem/${item._id}`);
      }
    },
    updateMachineActive(item, index) {
      this.updateMachine = JSON.parse(
        JSON.stringify({ ...item, ...{ key: index } })
      );
      this.updateMachineDialog = true;
    },
    async updateMachineSend() {
      try {
        const key = this.updateMachine.key;
        this.updateMachineBtn = true;
        const data = this.updateMachine;
        const rs = await lnc.patch(`api/machine`, data);
        if (rs.status === 200 && rs.data.status) {
          this.pageData[key].name = data.name;
          this.pageData[key].address = data.address;
        }
        this.snackAlert(rs.data.status, rs.data.msg);
      } catch (e) {
        console.log(e, "catch on updateMachineSend");
        this.snackAlert(false, "catch on updateMachineSend");
      }
      this.updateMachineClose();
    },
    updateMachineClose() {
      this.updateMachine = {};
      this.updateMachineBtn = false;
      this.updateMachineDialog = false;
    },
    //////////////////////////////////////
    deleteMachineActive(item, index) {
      this.deleteMachineDialog = true;
      this.deleteMachine = { _id: item._id, name: item.name, key: index };
    },
    async deleteMachineSend() {
      try {
        const key = this.deleteMachine.key;
        this.deleteMachineBtn = true;
        const rs = await lnc.delete(`api/machine/${this.deleteMachine._id}`);
        console.log(rs, "rs");
        if (rs.status === 200 && rs.data.status) {
          this.pageData.splice(key, 1);
        }
        this.snackAlert(rs.data.status, rs.data.msg);
      } catch (e) {
        console.log(e, "catch on deleteMachineSend");
        this.snackAlert(false, "catch on deleteMachineSend");
      }
      this.deleteMachineClose();
    },
    deleteMachineClose() {
      this.deleteMachineBtn = false;
      this.deleteMachineDialog = false;
      this.deleteMachine = {};
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
