<template>
  <v-app>
    <AppBar v-if="showAppBar" />
    <Navbar v-if="showAppBar" />
    <v-main>
      <router-view></router-view>
    </v-main>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>
import AppBar from "./components/AppBar";
import Navbar from "./components/Navbar";
import lnc from "./auth/index";
export default {
  name: "App",
  components: {
    AppBar,
    Navbar,
  },
  data: () => ({
    showAppBar: false,
    //
  }),
  created() {
    this.chkLogin();
  },
  mounted() {},
  methods: {
    async chkLogin() {
      try {
        const rs = await lnc.chkLogin();
        if (rs.status) {
          this.showAppBar = true;
        }
      } catch (e) {
        console.log(e, "catch on chkLogin from app");
      }
    },
  },
};
</script>

<style media="screen">
.f20 {
  font-size: 20px !important;
}
.f11 {
  font-size: 11px !important;
}
.f10 {
  font-size: 10px !important;
}
.f9 {
  font-size: 9px !important;
}
th {
  padding: 1px !important;
}
.cpoint {
  cursor: pointer;
  color: #2a80d5;
}
</style>