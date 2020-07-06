// pages/mainPage/mainPage.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        preSearchData: [],
        bookList: [],
        aBook: null,
        showBook: false,
        carouselImgUrls: [
            "../../assets/book1.jpg",
            "../../assets/book2.jpg",
            "../../assets/book3.jpg",
            "../../assets/book4.jpg"
        ],
        seachText: "",
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
                url: 'http://localhost:8080/getBooks',
                method: "POST",
                data: {11:11},
                header: {
                    'content-type': 'application/json', // 默认值
                    'cookie': wx.getStorageSync("sessionid") //cookie
                },
                success(res) {
                    let data = res.data;
                    for(let i=0;i<data.length;++i){
                        if(data[i].description.length>37){
                            data[i].description=data[i].description.slice(0,37)+"...";
                        }
                    }
                    that.setData({bookList: data, preSearchData:data})
                }
            });
        }
    },

    showDetail: function (e) {
        console.log(e.currentTarget.dataset);
        app.globalData.curBookId = e.currentTarget.dataset.id;
        wx.navigateTo({url: '../bookDetail/bookDetail'})
    },

    onChange: function (e){
        this.setData({searchText:e.detail});
    },

    onSearch: function (e){
        let _searchText = this.data.searchText;
        let _preSearchData = [...this.data.preSearchData];
        if(_searchText.length != 0){
            let pattern = new RegExp(_searchText.toString(), "i");
            _preSearchData = _preSearchData.filter((ele) => {
                return pattern.test(ele["name"]);
            })
        }
        this.setData({bookList:_preSearchData});
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