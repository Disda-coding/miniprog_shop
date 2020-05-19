
import {request} from "../../request/index.js";
import {requestPayment,getSetting,chooseAddress,openSetting,showModel,showToast} from "../../utils/asyncWx.js";
Page({
  /**
   * 页面加载完毕先判断本地存储中有没有地址数据
   * 吧数据设置给data中的变量
   * 因为频繁打开因此使用onShow好一点
   */

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],    
    totalPrice:0,
    totalNum:0
  },
  /*
    回到商品详情页面 第一次添加商品的时候 手动添加属性
      num=1    checked=true
    1 获取缓存中的购物车数组
    2 把购物车数据填充到data中
   */
   /*
    全选的实现：
    onShow 获取缓存中的购物车数组
    根据购物车的商品数据 所有都被选中 checked=true 全选被选中
  */
  
  onShow(){
    //1 获取缓存中的收货地址信息
    const address=wx.getStorageSync("address");
    // 获取缓存中的购物车数组 只有checked的才能被显示
    let cart=wx.getStorageSync("cart")||[];
    //过滤后的购物车数组
    cart=cart.filter(v=>v.checked);   
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v => {      
      totalPrice+=v.num*v.goods_price;
      totalNum+=v.num;      
    });   
   
    // 把购物车重新设置回data中和缓存中
    this.setData({
      cart,    
      totalPrice,
      totalNum,
      address
    });    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
 


  
 
  /*
    微信支付：
    哪些人 哪些账号可以实现微信支付
     1 企业账号
     2 企业账号的小程序中必须给开发者添加白名单
       一个appid可以同时绑多个开发者
    支付按钮：
      1 判断缓存中有没有token
      2 没有 跳转到授权页面
    创建订单 获取订单编号
    完成微信支付
      手动删除缓存中购买过的商品
      跳转页面
  */
  async handlePay(e){
    
    try {
      const token = wx.getStorageSync("token");
      if(!token){
        wx.navigateTo({
          url: '/pages/auth/auth',        
        });
        return;
      }
      //创建订单
      // 准备 请求头参数
     // const header={Authorization:token};
      // 准备 请求体参数
      const order_price=this.data.totalPrice;
      const consignee_addr=this.data.address;
      const cart=this.data.cart;
      let goods=[];
      cart.forEach(v=>goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price
      }));
      const orderParams={order_price,consignee_addr,goods};
      // 准备发送请求 创建订单 获取订单编号
      const {order_number}=await request({url:"/my/orders/create",method:"POST",data:orderParams});
      //发起预支付接口
      const {pay} = await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}});
      //发起微信支付
      await requestPayment(pay);
      // 查询后台 订单状态
      const res = await request({url:"/my/orders/chkOrder",method:"POST",data:{order_number}});
      await showToast({title:"支付成功"});
      //手动删除缓存中购买过的商品
      let newCart=wx.getStorageSync("cart");
      newCart=newCart.filter(v=>!v.checked);
      wx.setStorageSync("cart", newCart);
      //跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/order',        
      });

    } catch (error) {
      await showToast({title:"支付失败"})
    }
  }
})

