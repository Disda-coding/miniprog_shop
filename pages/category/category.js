// pages/category/category.js
import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList:[],
    rightContent:[],
    currentIndex:0,
    scrollTop:0
  },
  //接口的返回数据
  Cates:[],
  // ES6的Promise方法取代传统Ajax
  // getCates(){
  //   request({
  //     url:'/categories'
  //   }).then(res=>{
  //     this.Cates=res.data.message;
  //     //把接口数据存入本地存储中
  //     wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
  //     let leftMenuList=this.Cates.map(v=>v.cat_name);
  //     let rightContent=this.Cates[0].children;
  //     this.setData({
  //       leftMenuList,
  //       rightContent
  //     })
  //   })
  // },
  //ES7 的Async方法 勾选增强编译
  async getCates(){
    //使用es7的async await发送请求
    const res = await request({url:"/categories"});
    this.Cates=res.data.message;
    //把接口数据存入本地存储中
    wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
    let leftMenuList=this.Cates.map(v=>v.cat_name);
    let rightContent=this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  handleItemTap(e){
    // 获取点击后的index
    const {index}=e.currentTarget.dataset;
    // 通过index改变右边点击后的内容
    let rightContent=this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
       // 设置右侧内容 scroll-top
       scrollTop:0
    })
   
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    1 先判断一下有没有旧的数据
    2 没有旧的数据 直接发送请求
    3 有旧的数据 同时 旧的数据也没过期 就使用旧数据
    */
   
    // 获取本地存储的数据
    const Cates = wx.getStorageSync("cates");
    if(!Cates){     
      this.getCates();
    }else{     
      //看看是否过期
      if(Date.now()-Cates.time>60*5*1000){
          this.Cates=Cates.data;
          let leftMenuList=this.Cates.map(v=>v.cat_name);
          let rightContent=this.Cates[0].children;
          this.setData({
            leftMenuList,
            rightContent
          })
      }
    }
  },

 
})