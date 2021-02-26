<template>
  <div>
    <v-col class="col-12 col-md-10 ma-0">
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
              ADD MACHINE
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
              hide-details
              class="pr-2"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <hr />
        <v-card>
          <v-btn> ADD ROW </v-btn>
          <v-btn> ADD COLUMN </v-btn>
        </v-card>
        <hr />

        <p>Machine Preview</p>
        <hr />
        <div>
          <v-row
            class="ma-0"
            v-for="(row, rowKey) in defaultShelf"
            v-bind:key="rowKey"
            no-getters
          >
            <v-col
              :class="`col-${Math.round(100 / (row.length * 10))}`"
              class="ma-0 pa-1"
              v-for="(col, colKey) in row"
              v-bind:key="colKey"
            >
              <v-card height="50">{{ rowKey + 1 }}:{{ colKey + 1 }}</v-card>
            </v-col>
          </v-row>
        </div>
        <hr />
        <!-- <v-row>
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
                    {{ item.name }}
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-center">
                    <v-icon v-if="item.active" color="success">done</v-icon>
                    <v-icon v-else color="error">close</v-icon>
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-right">
                    {{ locateDateTime(item.createdOn) }}
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-right">
                    <v-icon
                      @click="updateMachineActive(item, index)"
                      color="warning"
                      size="20"
                      class="ma-1"
                      >edit</v-icon
                    >
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
        </v-row> -->
      </v-card>
    </v-col>

    <!-- add machine -->
    <v-dialog
      v-if="addMachineDialog"
      v-model="addMachineDialog"
      max-width="900"
      persistent
    >
      <v-card>
        <v-card-title class="confirm"><b>ADD NEW MACHINE</b></v-card-title>
        <v-card-text class="mt-8">
          <p>Shelf Preview</p>
          <hr />
          {{ shelf }}
          <hr />
          <!-- <v-text-field
            v-model="addMachine.name"
            :rules="[
              () => !!addMachine.name || 'Please Input Machine Name',
              () => addMachine.name.length > 3 || 'Min 3 Charactor',
            ]"
            label="Machine Name"
            placeholder="Machine Name"
            required
          >
          </v-text-field> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            :disabled="addMachine.name.length < 3 || !addMachine.name.length"
            :loading="addMachineBtn"
            outlined
            tile
            @click="addMachineSend()"
          >
            Yes
          </v-btn>
          <v-btn color="primary" outlined tile @click="addMachineClose()">
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- add machine  -->

    <!-- update machine -->
    <v-dialog
      v-if="updateMachineDialog"
      v-model="updateMachineDialog"
      max-width="600"
      persistent
    >
      <v-card>
        <v-card-title class="confirm"><b>UPDATE MACHINE</b></v-card-title>
        <v-card-text class="mt-8">
          <v-text-field
            v-model="updateMachine.name"
            :rules="[
              () => !!updateMachine.name || 'Please Input Machine Name',
              () => updateMachine.name.length > 3 || 'Min 3 Charactor',
            ]"
            label="Machine Name"
            placeholder="Machine Name"
            required
          >
          </v-text-field>
          <v-checkbox
            label="Active"
            color="blue"
            v-model="updateMachine.active"
          ></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            :disabled="
              updateMachine.name.length < 3 || !updateMachine.name.length
            "
            :loading="updateMachineBtn"
            outlined
            tile
            @click="updateMachineSend()"
          >
            Yes
          </v-btn>
          <v-btn color="primary" outlined tile @click="updateMachineClose()">
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- update machine  -->

    <!-- delete machine -->
    <v-dialog
      v-if="deleteMachineDialog"
      v-model="deleteMachineDialog"
      max-width="600"
      persistent
    >
      <v-card>
        <v-card-title class="confirm"><b>DELETE MACHINE</b></v-card-title>
        <v-card-text class="mt-8">
          <span class="title"
            >CONFIRM TO DELETE MACHINE : {{ deleteMachine.name }}</span
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
        text: "MACHINE NAME",
        value: "machineName",
        align: "left",
        class: "",
        width: "100px",
        fixed: true,
      },
      {
        text: "ACTIVE",
        value: "active",
        align: "center",
        class: "",
        width: "125px",
        fixed: true,
      },
      {
        text: "CREATED",
        value: "createdAt",
        align: "right",
        width: "80px",
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
    shelf: [],
    defaultShelf: [
      ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
      ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
      ["1", "1", "1", "1", "1", "1"],
    ],
  }),

  computed: {},

  watch: {
    options() {
      this.show();
    },
  },
  created() {
    this.show();
    this.page = this.$route.name;
  },
  methods: {
    async show() {
      // const query = lnc.qeuryStr(this.options);
      // if (!query) return;
      // const url = `/api/machine${query}`;
      // try {
      //   this.dtbLoading = true;
      //   const rs = await lnc.get(url);
      //   if (rs.status == 200) {
      //     this.pageData = rs.data.data;
      //     this.totalItems = rs.data.rows;
      //   }
      // } catch (e) {
      //   console.log(e, "catch on show", url);
      // }
      // this.dtbLoading = false;
    },
    /////////////////// end show
    addMachineActive() {
      this.addMachine = { name: "" };
      this.shelf = this.defaultShelf;
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
      this.addMachine = {};
      this.addMachineBtn = false;
      this.addMachineDialog = false;
    },
    //////////////////////////////////////
    updateMachineActive(item, index) {
      this.updateMachine = { ...item, ...{ key: index } };
      this.updateMachineDialog = true;
    },
    async updateMachineSend() {
      try {
        const key = this.updateMachine.key;
        this.updateMachineBtn = true;
        const data = {
          _id: this.updateMachine._id,
          name: this.updateMachine.name,
          active: this.updateMachine.active,
        };
        const rs = await lnc.patch(`api/machine`, data);
        if (rs.status === 200 && rs.data.status) {
          this.pageData[key].name = data.name;
          this.pageData[key].active = data.active;
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
    deleteMachineActive(item, key) {
      this.deleteMachineDialog = true;
      this.deleteMachine = { _id: item._id, name: item.name, key: key };
    },
    async deleteMachineSend() {
      try {
        const key = this.deleteMachine.key;
        this.deleteMachineBtn = true;
        const rs = await lnc.delete(`api/machine/${this.deleteMachine._id}`);
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
    save() {},
    locateDateTime(date = new Date()) {
      return moment(date).format("DD-MM-YYYY HH:mm:ss [GMT] Z");
    },
    snackAlert(status, msg) {
      this.snackBar = !this.snackBar;
      this.snackBarStatus = status;
      this.snackBarMsg = msg;
    },
  },
};
</script>


