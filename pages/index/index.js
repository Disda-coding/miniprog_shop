import {request} from "../../request/index.js"
//Page Object
Page({
  data: {
    //轮播图数组
    swiperList:[],
    // 导航数组
    catesList:[],
    // 楼层数据
    floorList:[]

  },
  //options(Object)
  onLoad: function(options){
    //发送异步请求
    // 使用promise请求来防止嵌套过多的request异步请求
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result)=>{
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   },      
    // });
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  getSwiperList(){
    request({url:"/home/swiperdata"}).then(result=>{
      this.setData({
        swiperList:result.data.message
      })
    })
  },
  getCateList(){
    request({url:"/home/catitems"}).then(result=>{
      this.setData({
        catesList:result.data.message
      })
    })
  },
  getFloorList(){
    request({url:"/home/floordata"}).then(result=>{
      this.setData({
        floorList:result.data.message
      })
    })
  },
  onReady: function(){
    
  },
  onShow: function(){
    
  },
  onHide: function(){

  },
  onUnload: function(){

  },
  onPullDownRefresh: function(){

  },
  onReachBottom: function(){

  },
  onShareAppMessage: function(){

  },
  onPageScroll: function(){

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item){

  }
});