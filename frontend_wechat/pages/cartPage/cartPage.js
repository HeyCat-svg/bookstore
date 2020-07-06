// pages/cartPage/cartPage.js
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        cartList: null,
        selectedRow: [],
        checked: [],
        quantity: [],
        totalPrice: 0,
        selectAll: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let userInfo = app.globalData.userInfo;
        var that = this;
        if (!app.globalData.userLogged){
            wx.navigateTo({url: '../index/index'})
        }
        else{
            wx.request({
                url: 'http://localhost:8080/getCart?userId='+userInfo.userId,
                method: "POST",
                data: {11:11},
                header: {
                    'content-type': 'application/json', // 默认值
                    'cookie': wx.getStorageSync("sessionid") //cookie
                },
                success(res) {
                    // console.log(res.data);
                    let tmp = that.data.checked;
                    let tmp1 = [];
                    for(let i=0;i<res.data.length;++i){
                        tmp.push(false);
                        tmp1.push(1);
                    }
                    that.setData({checked: tmp, cartList: res.data, quantity:tmp1});
                }
            });
        }
    },

    addOrder: function () {
        var that = this;
        if (!app.globalData.userLogged){
            wx.navigateTo({url: '../index/index'})
        }
        else{
            wx.request({
                url: 'http://localhost:8080//cartToOrder',
                method: "POST",
                data: {"data":JSON.stringify(that.data.selectedRow)},
                header: {
                    'content-type': 'application/json', // 默认值
                    'cookie': wx.getStorageSync("sessionid") //cookie
                },
                success(res) {
                    console.log(res.data);
                    wx.navigateTo({url: '../orderComplete/orderComplete',})
                }
            });
        }
    },

    updateCart: function (){

    },

    deleteCart: function () {

    },

    onChange: function (e) {
        let tmp = this.data.checked;
        let total = this.data.totalPrice;
        let selected = this.data.selectedRow;
        let cartId = e.currentTarget.dataset.cartid;
        let id = e.currentTarget.dataset.id;
        let selectAll = this.data.selectAll;
        // console.log(e.currentTarget.dataset);
        if(e.detail){
            selected.push(cartId);
            total += e.currentTarget.dataset.price*this.data.quantity[id];
        }
        else{
            let index=selected.indexOf(cartId);
            if(index>-1){
                selected.splice(index, 1);
                total -= e.currentTarget.dataset.price*this.data.quantity[id];
            }
            selectAll = false;
        }
        tmp[e.currentTarget.dataset.id]=e.detail;
        this.setData({checked: tmp,
                      selectedRow: selected,
                      totalPrice:total,
                      selectAll:selectAll
                    });

        console.log(this.data.selectedRow);
        console.log(this.data.totalPrice);
    },

    selectAll: function (e) {
        let quantity = this.data.quantity;
        let checked = [];
        let selectedRow = [];
        let totalPrice = 0;
        if(e.detail){
            for(let i=0;i<this.data.cartList.length;++i){
                checked.push(true);
                selectedRow.push(this.data.cartList[i].id);
                totalPrice += this.data.cartList[i].bookInfo.price;
            } 
        }
        else{
            for(let i=0;i<this.data.cartList.length;++i){
                checked.push(false);
            }
        }
        
        this.setData({checked:checked,
                      selectedRow:selectedRow,
                      selectAll:e.detail,
                      totalPrice:totalPrice
                    });
        console.log(this.data.selectedRow);
    },

    onQuantityChange: function (e) {
        let index = e.currentTarget.dataset.id;
        let quantity = this.data.quantity;
        let totalPrice = this.data.totalPrice;
        let offset = e.detail - quantity[index];
        quantity[index] = e.detail;
        if(this.data.checked[index]){
            totalPrice += (offset*this.data.cartList[index].bookInfo.price);
        }
        this.setData({totalPrice:totalPrice,quantity:quantity});
        console.log(quantity);
        console.log(offset);
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