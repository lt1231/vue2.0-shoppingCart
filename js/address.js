var vm = new Vue({
  el: ".container",
  data: {
    limitNum: 3,
    addressList: [],
    currentIndex: 0,
    delStatus: false,
    insFlag: false,
    curAddress:" ",
    name: '',
    streetName:'',
    phone:'',
    fromStatus: '' ,
    checkIndex: ''
   },
  mounted: function() {
    this.$nextTick(function() {
      this.getAddressList();
    });
  },
  computed: {
    filterAddress: function() {
      return this.addressList.slice(0, this.limitNum);
    }
  },
  methods: {
    getAddressList: function() {
      var _this = this;
      this.$http.get("data/address.json").then(function(response) {
        // 此处可使用response.body或response.data取得json数据结果
        var res = response.data;
        if (res.status == "0") {
          _this.addressList = res.result;
        }
      });
    },
    loadMore: function() {
    var  len = this.addressList.length;
      if (this.limitNum == len) {
        this.limitNum = 3;
      } else {
        this.limitNum = len;
      }
    },

    setDefault: function(addressId) {
      this.addressList.forEach(function(address, index) {
        if (address.addressId == addressId) {
          address.isDefault = true;
        } else {
          address.isDefault = false;
        }
      });
    },
    delConfirm: function(item) {
      this.delStatus = true;
      this.curAddress = item;
    },
    delAddress: function () {
      var index = this.addressList.indexOf(this.curAddress);
      this.addressList.splice(index, 1)
      this.delStatus = false;
    },
    insConfirm: function(item) {
      this.insFlag = true;
      this.curAddress = item;
    },
    addAddress: function (item) {
      this.fromStatus = 0;
      var checkAddress = this.addressList[this.addressList.length-1];
      // alert(a.addressId++)
     this.addressList.push({
       addressId: checkAddress.addressId++,
       userName: this.name,
       streetName: this.streetName,
       tel: this.phone
     });
     this.limitNum = this.addressList.length;
      this.insFlag = false;
    },
    editAddress: function (addressId) {
      this.fromStatus = 1;
      this.insFlag = true;
      var _this = this
      this.addressList.forEach(function (address,index) {
       if (address.addressId == addressId) {
         _this.name = address.userName;
         _this.phone = address.tel;
         _this.streetName = address.streetName;
         _this.checkIndex = index;
        }
      })
       
    },
    empty:function () {
      this.fromStatus = "";
      this.name =" ";
      this.phone = "";
      this.streetName = "";
    } ,
    saveFrom: function () {
      if(this.fromStatus == 0){
        this.addAddress();
        this.empty();
      }
      if(this.fromStatus == 1) {
        // alert(this.checkIndex);
        this.addressList.splice(this.checkIndex, 1, {
         addressId: this.addressId,
         userName: this.name,
         streetName: this.streetName,
         tel: this.phone
       });
        this.editAddress();
        this.empty();
        this.insFlag = false;
        
      }
    }
    
  }
});