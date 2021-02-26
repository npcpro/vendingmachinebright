<template >
  <v-container>
    <v-row>
      <v-col class="ma-auto" col="12" sm="4">
        <v-card class="elevation-12">
          <v-toolbar dark color="dark">
            <v-toolbar-title>Login form</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-text-field
              v-model="user.username"
              :rules="[() => !!user.username || 'Please Input User']"
              prepend-icon="person"
              label="Login"
              @keyup.enter="chkform"
              required
            >
            </v-text-field>
            <v-text-field
              prepend-icon="lock"
              :append-icon="showpass ? 'visibility' : 'visibility_off'"
              @click:append="showpass = !showpass"
              :rules="[rules.required, rules.min]"
              :type="showpass ? 'text' : 'password'"
              label="password"
              v-model="user.password"
              @keyup.enter="chkform"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :loading="btnLoading"
              type="submit"
              @click="login()"
              :disabled="!user.username || !user.password"
              outlined
              tile
              >Login</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <MySnackbar :show="snackBar" :status="snackBarStatus" :msg="snackBarMsg" />
  </v-container>
</template>

<script type="text/javascript">
import axios from "axios";
import MySnackbar from "../components/SnackBar";

export default {
  components: {
    MySnackbar,
  },
  data: () => ({
    btnLoading: false,
    snackBar: false,
    snackBarStatus: false,
    snackBarMsg: "",
    valid: true,
    drawer: null,
    user: {
      username: "",
      password: "",
    },
    showpass: false,
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 4 || "Invalid Condition",
    },
  }),
  created() {},
  methods: {
    async login() {
      this.btnLoading = true;
      try {
        const rs = await axios.post("/api/admin/login", this.user);
        if (rs.data.status && rs.status == 200) {
          console.log(rs.data, " rs.data");
          const token = rs.data.token;
          this.snackAlert(true, `Login Sucess`);
          localStorage.setItem("token", JSON.stringify({ token: token }));
          location.assign("/");
        } else {
          this.snackAlert(false, `User name or password invalid`);
        }
      } catch (e) {
        console.log(e, "catch on login");
        this.snackAlert(false, `User name or password invalid`);
      }
      this.btnLoading = false;
    },
    snackAlert(status, msg) {
      this.snackBar = !this.snackBar;
      this.snackBarStatus = status;
      this.snackBarMsg = msg;
    },
  },
  mounted() {},
};
</script>
