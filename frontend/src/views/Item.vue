<template>
  <div>
    <v-col class="col-12 col-md-6 ma-0">
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
              @click="addItemActive()"
            >
              ADD ITEM
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
                    <v-img
                      class="ma-auto"
                      :src="
                        item.img.match('blob:')
                          ? item.img
                          : `${baseURL}/public/uploads/${item.img}`
                      "
                      max-width="80"
                      max-height="80"
                      aspect-ratio="1"
                      contain
                    />
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-left">
                    {{ item.name }}
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-left">
                    {{ item.price }} บาท
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-right">
                    {{ locateDateTime(item.createdAt) }}
                  </td>
                  <td class="font-weight-bold f11 pa-1 text-right">
                    <v-icon
                      @click="updateItemActive(item, index)"
                      color="warning"
                      size="20"
                      class="ma-1"
                      >edit</v-icon
                    >
                    <v-icon
                      @click="deleteItemActive(item, index)"
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

    <!-- add item -->
    <v-dialog
      v-if="addItemDialog"
      v-model="addItemDialog"
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title class="primary white--text">
          <b>Add New Item</b>
          <v-spacer></v-spacer>
          <v-btn color="white" @click="addItemClose()" fab icon>
            <v-icon> close </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-2">
          <v-row no-getters>
            <v-col class="col-12 col-md-6 ma-0">
              <v-text-field
                v-model="addItem.name"
                :rules="[
                  () => !!addItem.name || 'Please Input Item Name',
                  () => addItem.name.length >= 3 || 'Min 3 Charactor',
                ]"
                label="Item Name"
                placeholder="Item Name"
              >
              </v-text-field>
            </v-col>
            <v-col class="col-12 col-md-6 ma-0">
              <v-text-field
                v-model="addItem.price"
                :rules="[
                  () => !!addItem.price || 'Please Input Item Price',
                  () => addItem.price >= 10 || 'Min 10 บาท',
                ]"
                label="Item Price (บาท)"
                placeholder="Item Price"
                type="number"
                min="10"
              >
              </v-text-field>
            </v-col>
            <v-col class="col-12">
              <v-file-input
                v-model="itemFile"
                accept="image/png, image/jpeg"
                label="Upload Img (png, jpg)"
                placeholder="Upload Img"
                prepend-icon="mdi-camera"
                dense
                @change="itemCreateFileUrl()"
                @click:clear="clearFile()"
                :rules="[ruleFile.chkFileType]"
              >
              </v-file-input>
              <v-img
                class="ma-auto"
                v-if="itemBlob"
                :src="itemBlob"
                max-height="300"
                max-width="300"
                aspect-ratio="1"
                contain
              ></v-img>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="text-left">
          <v-btn
            color="success"
            :disabled="!chkAddItemForm"
            :loading="addItemBtn"
            outlined
            tile
            block
            @click="addItemSend()"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- add item  -->

    <!-- add item -->
    <v-dialog
      v-if="updateItemDialog"
      v-model="updateItemDialog"
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title class="primary white--text">
          <b>Update Item</b>
          <v-spacer></v-spacer>
          <v-btn color="white" @click="updateItemClose()" fab icon>
            <v-icon> close </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-2">
          <v-row no-getters>
            <v-col class="col-12 col-md-6 ma-0">
              <v-text-field
                v-model="updateItem.name"
                :rules="[
                  () => !!updateItem.name || 'Please Input Item Name',
                  () => updateItem.name.length >= 3 || 'Min 3 Charactor',
                ]"
                label="Item Name"
                placeholder="Item Name"
              >
              </v-text-field>
            </v-col>
            <v-col class="col-12 col-md-6 ma-0">
              <v-text-field
                v-model="updateItem.price"
                :rules="[
                  () => !!updateItem.price || 'Please Input Item Price',
                  () => updateItem.price >= 10 || 'Min 10 บาท',
                ]"
                label="Item Price (บาท)"
                placeholder="Item Price"
                type="number"
                min="10"
              >
              </v-text-field>
            </v-col>
            <v-col class="col-12">
              <v-file-input
                v-model="itemFile"
                accept="image/png, image/jpeg"
                label="Upload Img (png, jpg)"
                placeholder="Upload Img"
                prepend-icon="mdi-camera"
                dense
                @change="itemCreateFileUrl()"
                @click:clear="clearFile()"
                :rules="[ruleFile.chkFileType]"
              >
              </v-file-input>
              <v-img
                class="ma-auto"
                v-if="itemBlob"
                :src="itemBlob"
                max-height="300"
                max-width="300"
                aspect-ratio="1"
                contain
              ></v-img>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="text-left">
          <v-btn
            color="success"
            :disabled="!chkUpdateItemForm"
            :loading="updateItemBtn"
            outlined
            tile
            block
            @click="updateItemSend()"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- add item  -->

    <!-- delete item -->
    <v-dialog
      v-if="deleteItemDialog"
      v-model="deleteItemDialog"
      max-width="600"
      persistent
    >
      <v-card>
        <v-card-title class="primary white--text"
          ><b>Delete Item</b></v-card-title
        >
        <v-card-text class="mt-8">
          <span class="title"
            >Confirm To Delete Item : {{ deleteItem.name }}</span
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            :loading="deleteItemBtn"
            outlined
            tile
            @click="deleteItemSend()"
          >
            Yes
          </v-btn>
          <v-btn color="error" outlined tile @click="deleteItemClose()">
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- delete item  -->
    <MySnackbar :show="snackBar" :status="snackBarStatus" :msg="snackBarMsg" />
  </div>
</template>
<script>
import lnc from "../auth/index";
import MySnackbar from "../components/SnackBar";
import numeral from "numeral";
import moment from "moment";
import axios from "axios";

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

    addItem: {},
    addItemDefault: {
      name: "Pepsi",
      price: 10,
      img: "",
    },
    itemBlob: "",
    itemFile: {},

    addItemBtn: false,
    addItemDialog: false,

    updateItem: {},
    updateItemDialog: false,
    updateItemBtn: false,

    deleteItemDialog: false,
    deleteItem: {},
    deleteItemBtn: false,
    header: [
      {
        text: "Item Img",
        value: "img",
        align: "center",
        class: "",
      },
      {
        text: "Item Name",
        value: "name",
        align: "left",
        class: "",
      },
      {
        text: "Item Price",
        value: "price",
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
    ruleFile: {
      chkFileType: (itemFile, itemUrl = "") => {
        if (
          itemFile.type === "image/jpeg" ||
          itemFile.type === "image/png" ||
          (itemUrl && itemUrl.length)
        ) {
          return true;
        } else {
          return "Invalid File.";
        }
        // return true;
      },
    },
  }),

  computed: {
    baseURL() {
      return this.$http.defaults.baseURL;
    },
    chkAddItemForm() {
      if (!this.addItemDialog) return false;
      if (this.addItemDialog) {
        const chk =
          this.addItem.name.length >= 3 &&
          this.addItem.price >= 10 &&
          this.ruleFile.chkFileType(this.itemFile, this.addItem.img) === true;
        return chk;
      } else {
        return false;
      }
    },
    chkUpdateItemForm() {
      if (!this.updateItemDialog) return false;
      if (this.updateItemDialog) {
        const chk =
          this.updateItem.name.length >= 3 &&
          this.updateItem.price >= 10 &&
          this.ruleFile.chkFileType(this.itemFile, this.updateItem.img) ===
            true;
        return chk;
      } else {
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
  },
  methods: {
    async show() {
      const query = lnc.qeuryStr(this.options);
      if (!query) return;
      const url = `/api/item${query}`;
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
    addItemActive() {
      this.addItem = JSON.parse(JSON.stringify(this.addItemDefault));
      this.addItemDialog = true;
    },
    itemCreateFileUrl() {
      if (
        this.itemFile &&
        (this.itemFile.type === "image/jpeg" ||
          this.itemFile.type === "image/png")
      ) {
        this.itemBlob = URL.createObjectURL(this.itemFile);
      } else {
        this.itemFile = {};
        this.itemBlob = "";
      }
    },
    clearFile() {
      this.itemFile = {};
      this.itemBlob = "";
    },
    async addItemSend() {
      try {
        this.addItemBtn = true;
        const data = this.addItem;
        const formData = new FormData();
        formData.append("image", this.itemFile);
        formData.append("data", JSON.stringify(data));
        const rs = await axios.post(`api/item`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (rs.status === 200 && rs.data.status) {
          this.pageData.push(rs.data.data);
        }
        this.snackAlert(rs.data.status, rs.data.msg);
      } catch (e) {
        console.log(e, "catch on addItemSend");
        this.snackAlert(false, "catch on addItemSend");
      }
      this.addItemClose();
    },
    addItemClose() {
      this.addItem = JSON.parse(JSON.stringify(this.addItemDefault));
      this.addItemBtn = false;
      this.addItemDialog = false;
      this.itemFile = {};
      this.itemBlob = "";
    },
    //////////////////////////////////////
    updateItemActive(item, index) {
      this.updateItem = JSON.parse(
        JSON.stringify({ ...item, ...{ key: index } })
      );
      if (item.img) {
        this.itemBlob = `${this.baseURL}/public/uploads/${item.img}`;
      }
      this.updateItemDialog = true;
    },
    async updateItemSend() {
      try {
        const key = this.updateItem.key;
        this.updateItemBtn = true;

        const data = this.updateItem;
        const formData = new FormData();
        if (this.itemFile) {
          formData.append("image", this.itemFile);
        }
        formData.append("data", JSON.stringify(data));
        const rs = await axios.patch(`api/item`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (rs.status === 200 && rs.data.status) {
          this.pageData[key].name = data.name;
          this.pageData[key].price = data.price;
          if (this.itemFile && this.itemFile.name) {
            this.pageData[key].img = this.itemBlob;
          }
        }

        this.snackAlert(rs.data.status, rs.data.msg);
      } catch (e) {
        console.log(e, "catch on updateItemSend");
        this.snackAlert(false, "catch on updateItemSend");
      }
      this.updateItemClose();
    },
    updateItemClose() {
      this.updateItem = {};
      this.updateItemBtn = false;
      this.updateItemDialog = false;
      this.itemFile = {};
      this.itemBlob = "";
    },
    //////////////////////////////////////
    deleteItemActive(item, index) {
      this.deleteItemDialog = true;
      this.deleteItem = { _id: item._id, name: item.name, key: index };
    },
    async deleteItemSend() {
      try {
        const key = this.deleteItem.key;
        this.deleteItemBtn = true;
        const rs = await lnc.delete(`api/item/${this.deleteItem._id}`);
        if (rs.status === 200 && rs.data.status) {
          this.pageData.splice(key, 1);
        }
        this.snackAlert(rs.data.status, rs.data.msg);
      } catch (e) {
        console.log(e, "catch on deleteItemSend");
        this.snackAlert(false, "catch on deleteItemSend");
      }
      this.deleteItemClose();
    },
    deleteItemClose() {
      this.deleteItemBtn = false;
      this.deleteItemDialog = false;
      this.deleteItem = {};
    },
    /////////////////// end delete
    showSearch() {
      this.options = { ...this.options, ...{ search: this.search } };
    },
    numeral(price, format) {
      return numeral(price).format(format);
    },
    locateDateAdd(diff = 10) {
      return moment().add(diff, "days").format("DD-MMMM-YYYY");
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
