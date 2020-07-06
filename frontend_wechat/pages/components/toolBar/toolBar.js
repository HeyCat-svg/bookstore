// pages/components/toolBar/toolBar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        curActivIndex: Number
    },

    /**
     * 组件的初始数据
     */
    data: {
        active: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onChange(event) {
            // event.detail 的值为当前选中项的索引
            console.log(event.detail);
            var index = event.detail;
            if(index==0){
                wx.navigateTo({url: '../mainPage/mainPage'});
            }
            else if(index==1){
                wx.navigateTo({url: '../cartPage/cartPage'});
            }
            else if(index==2){
                this.setData({active:index});
                wx.navigateTo({url:'../orderComplete/orderComplete'});
            }
        }
    }
})
