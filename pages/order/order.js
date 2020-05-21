// pages/order/order.js

import { request } from "../../request/index.js";

/**
 * 1 页面被打开的时候 onShow
 * onShow 不同于onLoad 无法在形参上接收参数
    * 判断缓存中有没有token 么有就去授权页面
    * 获取url上的参数type
    * 根据type 去发送请求获取订单数据 和 确定标题高亮元素
    * 渲染页面
  * 2 点击不同的标题 重新发送请求来获取和渲染数据
  * 
 * 
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"待发货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      }
    ],
  },
  onShow(options){
    // 因为不是企业账号因此无法获得token
    // const token=wx.getStorageSync("token");
    // if(!token){
    //   wx.navigateTo({
    //     url: '/pages/auth/auth',        
    //   });
    //   return;
    // }
    //1 获取当前小程序的页面栈-数组 长度最大是10页面    
    let pages=getCurrentPages();
    //2 数组中索引最大的页面就是当前页面
    let currentPage=pages[pages.length-1];
    //3 获取url上的type
    const {type}=currentPage.options;
    this.getOrders(type);
    //激活选中标题
    this.changeTitleByIndex(type-1);
  },
  // 获取订单列表的方法
  async getOrders(type){
    const res=await request({url:"/my/orders/all",data:{type}});
    this.setData({
      orders:res.data.message.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },
  //根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
    let{tabs}=this.data;    
   
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },

  //标题点击事件 从子组件传递
  handleTabsItemChange(e){
    //获取索引
    const {index}=e.detail;
    this.changeTitleByIndex(index);
    //重新发送请求 
    this.getOrders(index+1);
  },
})