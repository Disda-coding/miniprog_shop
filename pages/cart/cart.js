// pages/cart/cart.js
import {request} from "../../request/index.js";
import {getSetting,chooseAddress,openSetting,showModel,showToast} from "../../utils/asyncWx.js";
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
    allChecked:false,
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
    // 获取缓存中的购物车数组
    const cart=wx.getStorageSync("cart")||[];
    //计算全选
    // every数组方法 会遍历 接收一个回调函数 每个回调函数都返回true那么 every方法返回值为true
    //只要有个回调函数返回false 那么就不再循环执行了 直接返回false
    // v是每个循环项 空数组调用every 返回值就是true 
    //const allChecked=cart.length?cart.every(v=>v.checked):false;
    //1 总价格 总数量
    this.setData({
      address
    });
    this.setCart(cart);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /*
  获取用户的收货地址
    绑定点击事件
    调用小程序内置api 获取用户的收货地址
    弊端： 用户手抖后没有后悔药了

  获取用户对小程序所授予 获取地址 权限状态scope
    1 假设用户点击收货地址 为 确定 authSetting scope.address
    scope为true 直接调用获取代码
    2 假设假设用户点击收货地址 为 取消{
      诱导用户自己打开授权设置界面
      当用户重新给权限 调用获取代码
    }
    3 假设用户重来没有调用过api scope为undefined 
    直接调用获取代码
    4 把获取到的收货地址放入本地缓存

  */
  // handleChooseAddress(){
  //   wx.getSetting({
  //     success: (result)=>{
  //       //获取权限状态 只要发现一些属性名很怪异 都要用[]来获取
  //       const scopeAddress=result.authSetting["scope.address"];
  //       if(scopeAddress===true||scopeAddress===undefined){
  //         wx.chooseAddress({
  //           success: (res)=>{
              
  //           },      
  //         });
  //       }else{
  //         //用户以前拒绝过 先诱导用户打开授权界面
  //         wx.openSetting({
  //           success: (res2)=>{
  //             //可以调用 获取地址代码
  //             wx.chooseAddress({
  //               success: (res3)=>{
                  
  //               },      
  //             });
  //           }
  //         });
  //       }
  //     },
  //     fail: ()=>{},
  //     complete: ()=>{}
  //   });   
  // }
  async handleChooseAddress(){
    try {
       //1 获取权限状态
        const res1 = await getSetting();
        const scopeAddress=res1.authSetting["scope.address"];
        //2 判断权限状态
        if(scopeAddress===false){
          await openSetting();
        }
        //3 调用获取收货地址的api
        let address = await chooseAddress();
        address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
        //4 存入缓存中
        wx.setStorageSync("address", address);
    } catch (error) {
        console.log(error);
    }   
  },
  //设置购物车状态 同时 计算底部状态栏信息
  setCart(cart){
    let allChecked=true;
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v => {
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    });
    //判断数组是否为空
    allChecked=cart.length?allChecked:false;
    // 把购物车重新设置回data中和缓存中
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart", cart);
  },
/*
    商品的选中
    1 绑定change事件
    2 获取到被修改的商品对象
    3 商品对象的选中状态 取反
    4 重新填充回data中和缓存中
    5 重新计算全选 总价格 总数量
  */
  handleItemChange(e){
    //获取被修改的商品id
    const goods_id=e.currentTarget.dataset.id;
    // 获取购物车数组
    let {cart} = this.data;
    // 找到被修改的商品对象
    let index= cart.findIndex(v=>v.goods_id===goods_id);
    //选中状态取反
    cart[index].checked=!cart[index].checked;
    this.setCart(cart);
  },
  /*
    全选和反选
      全选复选框绑定事件 change
      获取data中的权限变量 allChecked
      直接取反
      遍历购物车数组，让商品选中状态取反
      把购物车数组和allChecked重新设置回data 把购物车重新设置回缓存中
  */ 
 handleItemAllCheck(){
   //获取data中的数据
   let {cart,allChecked}=this.data;
   //修改值
   allChecked=!allChecked;
   cart.forEach(v=>v.checked=allChecked);
   // 把修改后的值 填充回data或者缓存中
   this.setCart(cart);
 },
 /*
  商品数量的编辑功能
  +和- 绑定同一个点击事件 区分关键为自定义的属性
  传递被点击的商品id
  获取data中购物车数组 来获取需要被修改的商品对象
  当购物车数量为1时，用户点击“-”应该弹窗提示用户是否删除商品
  直接修改商品对象的数量 num
  把cart数组 重新设置回缓存中 和 data中
 */
  async handleItemNumEdit(e){
    const {operation,id}=e.currentTarget.dataset;
    let {cart} = this.data;
    const index=cart.findIndex(v=>v.goods_id===id);
    //判断是否要删除 
    if(cart[index].num===1&&operation===-1){
      const res=await showModel({content:"您是否要删除该商品？"});
      if(res.confirm){
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else{
      cart[index].num+=operation;
      this.setCart(cart);
    }  
  },
  /*
    点击结算
    1 判断有没有收货地址信息
    2 判断用户有没有选购商品
    3 经过以上的验证 跳转到 支付页面！
  */
  async handlePay(e){
    const {address,totalNum}=this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    //判断用户有没有选购商品
    if(totalNum===0){
      await showToast({title:"您还没有选择商品"});
      return;
    }
    //跳转到 支付页面
    wx.navigateTo({
      url: '/pages/pay/pay',      
    });
  }
})