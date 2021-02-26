<template>
  <div>
    TransactionSuccess
    <MySnackbar :show="snackBar" :status="snackBarStatus" :msg="snackBarMsg" />
  </div>
</template>
<script>
import MySnackbar from "../../components/SnackBar";

export default {
  components: {
    MySnackbar,
  },
  data: () => ({
    snackBar: false,
    snackBarStatus: false,
    snackBarMsg: "",
  }),

  computed: {},
  watch: {},
  created() {},
  methods: {},
};
</script>
