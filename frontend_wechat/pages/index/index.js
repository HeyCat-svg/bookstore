//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userName: "",
    password: "",
    errorMessage: "",
  },
  //用户名输入
  bindUsername: function(e) {
    this.setData({userName: e.detail.value})
  },
  //密码输入
  bindPassword: function(e) {
    this.setData({password: e.detail.value})
  },
  //登陆
  bindLogin: function() {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/login', 
      method: "POST",
      data: {
        username: this.data.userName,
        password: this.data.password
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        if(res.data.status == '0'){
          app.globalData.userLogged = true;
          app.globalData.userInfo = res.data.data;
          wx.setStorageSync("sessionid", res.header["Set-Cookie"]); //存储cookie
          wx.navigateTo({url: '../mainPage/mainPage'});
        }else{
          that.setData({"errorMessage" : "用户名密码错误"});
        }
      }
    }); 
  },
  onLoad: function () {},
})
