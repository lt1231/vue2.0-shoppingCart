var vm = new Vue({
  el: "#app",
  data: {
    totalMoney: 0,
    productList: [],
    checkAllFlag: false,
    delFlag: false,
    curProduct: ""
  },
  filters: {
    formatMoney: function(value) {
      // value指当前调用过滤器传过来的值
      return "¥" + value.toFixed(2);
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      vm.cartView();
    });
  },
  methods: {
    cartView: function() {
      _this = this;
      this.$http.get("data/cartData.json", { id: 123 }).then(function(res) {
        this.productList = res.body.result.list;
      });
    },
    changeMoney: function(prodcut, May) {
      if (May > 0) {
        prodcut.productQuantity++;
      } else {
        prodcut.productQuantity--;
        if (prodcut.productQuantity < 1) {
          prodcut.productQuantity = 1;
        }
      }
    },
    selectProduct: function(item) {
      if (typeof item.checked == "undefined") {
        Vue.set(item, "checked", true);
        // 局部注册
        // this.$set(item, "checked", true);
      } else {
        item.checked = !item.checked;
      }
      this.calcTotalPrice();
    },
    checkAll: function(flag) {
      this.checkAllFlag = flag;
      var _this = this;
      this.productList.forEach(function(item, index) {
        if (typeof item.checked == "undefined") {
          _this.$set(item, "checked", (_this.checkAllFlag = flag));
        } else {
          item.checked = _this.checkAllFlag;
        }
      });
      this.calcTotalPrice();
    },
    calcTotalPrice: function() {
      var _this = this;
      _this.totalMoney = 0;
      this.productList.forEach(function(item, index) {
        if (item.checked) {
          _this.totalMoney += item.productPrice * item.productQuantity;
        }
      });
    },
    delConfirm: function(item) {
      this.delFlag = true;
      this.curProduct = item;
    },
    delPorduct: function () {
     var index = this.productList.indexOf(this.curProduct);
     this.productList.splice(index, 1)
     this.delFlag = false
    }
  }
});
// 全局过滤器
Vue.filter('Money',function(value,type) {
        return "¥" + value.toFixed(2) + type;
})