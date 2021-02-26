<template>
  <div>
    <v-app-bar color="primary" dense dark app fixed clipped-left>
      <v-app-bar-nav-icon @click.stop="sw_drawer()"></v-app-bar-nav-icon>
      <v-toolbar-title class="title">VENDING MACHINE</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn @click="logout()" icon>
        <v-icon>logout</v-icon>
      </v-btn>
      <!-- <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="n in 5" :key="n" @click="() => {}">
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu> -->
    </v-app-bar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getterAppBarDrawer: "AppBar/drawer",
    }),
  },
  methods: {
    ...mapActions({
      actionAppBarDrawer: "AppBar/drawer",
    }),
    sw_drawer() {
      console.log(this.sw_drawer, "sw_drawer", "start");
      this.actionAppBarDrawer(this.getterAppBarDrawer);
    },
    async logout() {
      localStorage.clear();
      location.reload();
    },
  },
};
</script>
