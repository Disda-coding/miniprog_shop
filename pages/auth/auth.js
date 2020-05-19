import {request} from "../../request/index.js";
import {login} from "../../utils/asyncWx.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  //获取用户信息
  async handleGetUserInfo(e){
      try {
         //获取用户信息
        const{encryptedData,rawData,iv,signature}=e.detail;
        // 获取小程序登录成功后code值
        const{code}=await login();
        const loginParams={encryptedData,rawData,iv,signature,code};
        // 发送请求 获取用户token
        const {token}=await request({url:"/users/wxlogin",data:loginParams,method:"post"});
        //把token存入缓存中 同时跳转回上一个页面
        wx.setStorageSync("token", token);
        wx.navigateBack({
          delta: 1 //返回上n层
        });
      } catch (error) {
        
      }
    
  }
})