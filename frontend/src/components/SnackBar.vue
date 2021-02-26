<template>
  <v-snackbar v-model="showSnack">
    <span>
      <v-icon text icon :color="status ? 'green' : 'red'" class="pr-3">{{
        status ? "check_circle" : "clear"
      }}</v-icon>
      {{ msg }}
    </span>
    <template v-slot:action="{ attrs }">
      <v-btn color="pink" text v-bind="attrs" @click="showSnack = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
export default {
  props: {
    show: { type: Boolean },
    status: { type: Boolean },
    msg: { type: String },
  },
  data: () => ({
    showSnack: false,
  }),
  created() {},
  methods: {
    snack() {
      let call = this;
      call.showSnack = true;
      setTimeout(function () {
        call.showSnack = false;
      }, 5000);
    },
  },
  watch: {
    show() {
      this.snack();
    },
  },
};
</script>
