// pages/bookDetail/bookDetail.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        book: null,
        quantity: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        if (!app.globalData.userLogged){
            wx.navigateTo({url: '../index/index'})
        }
        else{
            wx.request({
                url: "http://localhost:8080/getBook?id="+app.globalData.curBookId,
                method: "POST",
                data:{11:11},
                header: {
                    'content-type': 'application/json', // 默认值
                    'cookie': wx.getStorageSync("sessionid") //cookie
                },
                success(res){
                    console.log(res.data);
                    that.setData({book: res.data});
                }
            });
        }
    },

    /**
     * 加入购物车
     */
    addCart: function () {
        let userId = app.globalData.userInfo.userId;
        let bookId = this.data.book.id;
        let quantity = 1;
        wx.request({
            url: 'http://localhost:8080/addCart',
            method: "POST",
            data: {"userId":userId,"bookId":bookId,"quantity":quantity},
            header: {
                'content-type': 'application/json', // 默认值
                'cookie': wx.getStorageSync("sessionid") //cookie
            },
            success(res) {
                if(res.data.status==0){
                    wx.showToast({
                        title: '已加入购物车',
                        icon: 'success',
                        duration: 2000
                    })
                }
            }
        });
        
    },

    /**
     * 进入订单页面
     */
    addOrder: function () {
        wx.showToast({
            title: 'addOrder',
            icon: 'none',
            duration: 2000
        })
    },

    toHome: function () {
        wx.navigateTo({url: '../mainPage/mainPage'})
    },

    toCart: function () {
        wx.navigateTo({url: '../cartPage/cartPage'})
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})