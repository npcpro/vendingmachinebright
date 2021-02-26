<template>
  <div>
    <v-col class="col-12 col-md-12 ma-0">
      <v-card class="pa-2" elevation="2" title>
        <v-row no-gettes>
          <v-col class="col-12 col-md-2">
            <v-card-title class="ma-0 pa-0">
              Model : {{ machineModel }}
            </v-card-title>
            <v-card-title class="ma-0 pa-0">
              Name : {{ machineName }}
            </v-card-title>
            <v-card-title class="ma-0 pa-0"> Address </v-card-title>
            <v-card-text class="ma-0 pa-0"> {{ address.address }}</v-card-text>
            <v-card-text class="ma-0 pa-0">
              แขวง/ตำบล {{ address.subdistrict }}
            </v-card-text>
            <v-card-text class="ma-0 pa-0">
              อำเภอ {{ address.district }}
            </v-card-text>
            <v-card-text class="ma-0 pa-0">
              จังหวัด {{ address.city }}
            </v-card-text>
            <v-card-text class="ma-0 pa-0">
              ไปรษณีย์ {{ address.postcode }}
            </v-card-text>
            <br />
          </v-col>
          <v-col class="col-12 col-md-4">
            <div v-if="slotSelected._id">
              <div v-if="!slotSelected.item.itemId">
                <v-btn
                  color="success"
                  @click="mangeMachineItemActive(slotSelected)"
                  outlined
                >
                  <v-icon>add</v-icon> Add Machine Item
                </v-btn>
              </div>
              <div v-else>
                <v-row no-getters>
                  <v-col class="col-12">
                    <v-btn
                      color="warning"
                      @click="mangeExistsMachineItemActive(slotSelected)"
                      outlined
                      small
                    >
                      <v-icon class="mx-2">edit</v-icon> Manage Machine Item
                    </v-btn>
                  </v-col>
                  <v-col class="col-3">
                    <div class="mx-2 my-2">
                      <v-img
                        :src="
                          slotSelected.item.img
                            ? `${baseURL}/public/uploads/${slotSelected.item.img}`
                            : `${baseURL}/public/can.jpg`
                        "
                        class=""
                        width="140"
                        height="140"
                        contain
                      >
                      </v-img>
                    </div>
                  </v-col>
                  <v-col class="col-9">
                    <div class="f11 capTitle">{{ slotSelected.item.name }}</div>
                    <div class="f11">Qty: {{ slotSelected.item.qty }}</div>
                    <div class="f11">
                      UpdatedAt :
                      {{ locateDateTime(slotSelected.item.updatedAt) }}
                    </div>
                  </v-col>
                  <v-col class="col-12">
                    <v-btn
                      color="error"
                      @click="deleteMachineItemActive(slotSelected)"
                      outlined
                      small
                    >
                      <v-icon class="mx-2">delete</v-icon> Delete Machine Item
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-card-text class="mt-2 pa-0">
          <div
            v-for="(row, rowKey) in Object.keys(slot)"
            v-bind:key="rowKey"
            class="ma-0 d-flex flex-nowrap"
          >
            <v-col
              class="ma-0 pa-1"
              :style="`width:${100 / slot[row].length}%!important;`"
              v-for="(col, colKey) in slot[row]"
              v-bind:key="colKey"
            >
              <v-card
                height="140"
                class="pa-1"
                @click="slotSelect(col, rowKey, colKey)"
                :class="
                  slotSelected && slotSelected._id == col._id
                    ? 'blue lighten-4'
                    : ''
                "
              >
                <v-card-text class="f11 d-flex pa-0 mb-1">
                  <v-spacer></v-spacer>
                  <div class="capTitle">{{ col.slotY }} : {{ col.slotX }}</div>
                </v-card-text>
                <v-card-text class="pa-0 ma-0 hitemDiv">
                  <v-img
                    v-if="col.item.itemId"
                    :src="
                      col.item.img
                        ? `${baseURL}/public/uploads/${col.item.img}`
                        : `${baseURL}/public/can.jpg`
                    "
                    class="hitemImg"
                    contain
                  >
                  </v-img>
                  <div class="text-center" v-else>
                    <v-icon x-large color="grey lighten-3">add</v-icon>
                  </div>
                </v-card-text>
                <v-card-text
                  class="f11 capTitle ma-1 pa-0"
                  :class="
                    col.item && col.item.qty > 9
                      ? 'success--text'
                      : 'error--text'
                  "
                >
                  Qty : {{ col.item.qty || 0 }}
                </v-card-text>
              </v-card>
            </v-col>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- manage machine item -->
    <v-dialog
      v-if="mangeMachineItemDialog"
      v-model="mangeMachineItemDialog"
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title class="primary white--text">
          <b>Manange Machine Item</b>
          <v-spacer></v-spacer>
          <v-btn color="white" @click="mangeMachineItemClose()" fab icon>
            <v-icon> close </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-2">
          <v-row no-getters>
            <v-col class="col-12">
              <v-autocomplete
                v-model="mangeMachineItem.itemId"
                :items="itemList"
                item-value="_id"
                label="Select Item"
              >
                <template v-slot:selection="props">
                  {{ props.item.name }}
                </template>
                <template v-slot:item="props">
                  <v-img
                    :src="
                      props.item.img
                        ? `${baseURL}/public/uploads/${props.item.img}`
                        : `${baseURL}/public/can.jpg`
                    "
                    class="ma-1"
                    max-width="50"
                    max-height="50"
                    aspect-ratio="1"
                  >
                  </v-img>
                  <div class="pt-2">
                    {{ props.item.name }}
                  </div>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col class="col-12 col-md-6">
              <v-text-field
                v-model="mangeMachineItem.qty"
                type="number"
                min="0"
                max="50"
                label="Machine Qty"
                placeholder="Machine Qty"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="success"
            :disabled="!chkMachineFormAdd"
            :loading="mangeMachineItemBtn"
            outlined
            tile
            block
            @click="mangeMachineItemSend()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- manage machine item -->

    <!-- delete machine item -->
    <v-dialog
      v-if="deleteMachineItemDialog"
      v-model="deleteMachineItemDialog"
      max-width="300"
      persistent
    >
      <v-card>
        <v-card-title class="primary white--text"
          ><b>Delete Machine Item</b></v-card-title
        >
        <v-card-text class="mt-2">
          <div class="text-center f12 capTitle ma-3">
            Delete : {{ deleteMachineItem.name }}
          </div>
          <div>
            <v-img
              :src="
                deleteMachineItem.img
                  ? `${baseURL}/public/uploads/${deleteMachineItem.img}`
                  : `${baseURL}/public/can.jpg`
              "
              class="ma-2 ma-auto"
              width="180"
              height="180"
              contain
            >
            </v-img>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            :loading="deleteMachineItemBtn"
            outlined
            tile
            @click="deleteMachineItemSend()"
          >
            Yes
          </v-btn>
          <v-btn color="error" outlined tile @click="deleteMachineItemClose()">
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- delete machine item  -->

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
    machineId: "",
    machineName: "",
    machineModel: "",
    slot: {},
    address: {},
    slotSelected: {},
    slotSelectedY: {},
    slotSelectedX: {},

    mangeMachineItem: {},
    mangeMachineItemDefault: { itemId: "", qty: 20 },
    mangeMachineItemBtn: false,
    mangeMachineItemDialog: false,

    deleteMachineItemDialog: false,
    deleteMachineItem: {},
    deleteMachineItemBtn: false,
    itemList: [],
  }),

  computed: {
    baseURL() {
      return this.$http.defaults.baseURL;
    },
    chkMachineFormAdd() {
      console.log("start chkMachineFormAdd");
      if (this.mangeMachineItemDialog) {
        const chk = this.mangeMachineItem.itemId;
        console.log(chk, "chk chkMachineFormAdd");
        return chk;
      } else {
        console.log("dialog not active");
        return false;
      }
    },
    chkMachineFormUpdate() {
      console.log("start chkMachineFormUpdate");
      if (!this.updateMachineItemDialog) return false;
      if (this.updateMachineItemDialog) {
        const chk = this.updateMachineItem.itemId;
        return chk;
      } else {
        console.log("dialog not active");
        return false;
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
    this.machineId = this.$route.params.machineId;
    this.show();
    this.showItemList();
  },
  methods: {
    async show() {
      try {
        this.dtbLoading = true;
        const url = `api/machine/item/${this.machineId}`;
        const rs = await lnc.get(url);
        if (rs.status == 200) {
          this.machineName = rs.data.name;
          this.machineModel = rs.data.machineModel;
          this.address = rs.data.address;
          this.slot = rs.data.slot;
        }
      } catch (e) {
        console.log(e, "catch on show");
      }
      this.dtbLoading = false;
    },
    async showItemList() {
      try {
        const rs = await lnc.get("api/item/list");
        console.log(rs, "rs showItemList");
        if (rs.status === 200) {
          this.itemList = rs.data;
        }
      } catch (e) {
        console.log(e, "catch on showItemList");
      }
    },
    mangeMachineItemActive(item) {
      this.mangeMachineItem = JSON.parse(
        JSON.stringify({ ...item, ...this.mangeMachineItemDefault })
      );
      this.mangeMachineItemDialog = true;
    },
    mangeExistsMachineItemActive(item) {
      this.mangeMachineItem = JSON.parse(
        JSON.stringify({ ...item, ...item.item })
      );
      console.log(this.mangeMachineItem, "this.mangeMachineItem");
      this.mangeMachineItemDialog = true;
    },
    async mangeMachineItemSend() {
      try {
        this.mangeMachineItemBtn = true;
        const data = this.mangeMachineItem;
        const url = `api/machine/item/${this.machineId}`;
        const rs = await lnc.post(url, data);
        if (rs.status === 200 && rs.data.status) {
          this.setMachineItemSlot(data);
        }
        this.snackAlert(rs.data.status, rs.data.msg);
      } catch (e) {
        console.log(e, "catch on mangeMachineItemSend");
        this.snackAlert(false, "catch on mangeMachineItemSend");
      }
      this.mangeMachineItemClose();
    },
    mangeMachineItemClose() {
      this.mangeMachineItem = JSON.parse(
        JSON.stringify(this.mangeMachineItemDefault)
      );
      this.mangeMachineItemBtn = false;
      this.mangeMachineItemDialog = false;
    },
    deleteMachineItemActive(item) {
      this.deleteMachineItemDialog = true;
      this.deleteMachineItem = {
        slotId: item._id,
        name: item.item.name,
        img: item.item.img,
      };
    },
    async deleteMachineItemSend() {
      try {
        this.deleteMachineItemBtn = true;
        const url = `api/machine/item/${this.machineId}/${this.deleteMachineItem.slotId}`;
        const rs = await lnc.delete(url);
        if (rs.status === 200 && rs.data.status) {
          this.deleteMachineItemSlot();
        }
        this.snackAlert(rs.data.status, rs.data.msg);
      } catch (e) {
        console.log(e, "catch on deleteMachineItemSend");
        this.snackAlert(false, "catch on deleteMachineItemSend");
      }
      this.deleteMachineItemClose();
    },
    deleteMachineItemClose() {
      this.deleteMachineItemBtn = false;
      this.deleteMachineItemDialog = false;
      this.deleteMachineItem = {};
    },
    slotSelect(col, Y, X) {
      this.slotSelected = col;
      this.slotSelectedY = Y;
      this.slotSelectedX = X;
    },
    setMachineItemSlot(data) {
      const item = this.itemList.filter((i) => i._id == data.itemId).pop();
      const slotData = {
        ...item,
        ...{ itemId: data.itemId, qty: data.qty },
      };
      this.slot[this.slotSelectedY][this.slotSelectedX].item = slotData;
    },
    deleteMachineItemSlot() {
      this.slot[this.slotSelectedY][this.slotSelectedX].item = {};
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
    snackAlert(status, msg) {
      this.snackBar = !this.snackBar;
      this.snackBarStatus = status;
      this.snackBarMsg = msg;
    },
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