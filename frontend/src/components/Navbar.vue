<template>
  <v-navigation-drawer
    width="220"
    :value="getterAppBarDrawer"
    app
    clipped
    fixed
    stateless
  >
    <v-list>
      <v-list-group
        v-model="tab.route"
        v-for="tab in tabs"
        :key="tab.title"
        :append-icon="tab.children ? 'mdi-chevron-down' : ''"
        no-action
      >
        <template v-slot:activator>
          <v-list-item
            v-if="tab.to"
            :to="tab.to"
            active-class="primary white--text"
            link
          >
            <v-list-item-content>
              <v-list-item-title
                class="itemTitle"
                v-text="tab.title"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else dense>
            <v-list-item-content>
              <v-list-item-title
                class="itemTitle"
                v-text="tab.title"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-list-item
          class="itemContent"
          v-for="child in tab.children"
          :key="child.title"
          :to="child.to"
          dense
          link
          active-class="activeTab"
        >
          <v-list-item-content>
            <v-list-item-title v-text="child.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: () => {
    return {
      tabs: [
        { title: "ITEM", to: "/item" },
        { title: "MACHINE", to: "/machine" },
        { title: "TRANSACTION", to: "/transaction" },
        { title: "NEARLY OUT OF STOCK", to: "/nearlyoutofstock" },
      ],
    };
  },
  computed: {
    ...mapGetters({
      getterAppBarDrawer: "AppBar/drawer",
    }),
  },
  watch: {
    getterAppBarDrawer() {
      console.log(this.getterAppBarDrawer, "getterAppBarDrawer");
    },
  },
};
</script>


<style media="screen">
.v-list-group__header {
  padding: 0px !important;
}

.v-list-item__title {
  font-size: 12px !important;
  font-weight: bold !important;
}

.itemTitle {
  padding-left: 10px;
}

.itemContent {
  font-size: 12px !important;
}

.hi30 {
  height: 35px !important;
}
</style>

