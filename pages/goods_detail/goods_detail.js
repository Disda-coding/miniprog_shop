import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },
  //商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id}=options;
    this.getGoodsDetail(goods_id);     
  },
  // 获取商品的详情数据
  async getGoodsDetail(goods_id){
    const res = await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo=res.data.message;   
    this.setData({
      //因为后台数据过多，我们不需要全部的数据。
      //因此我们只需要拿所需数据
      goodsObj:{
        goods_name:this.GoodsInfo.goods_name,
        goods_price:this.GoodsInfo.goods_price,
        // iphone 部分手机 不识别webp图片格式
        // 最好找到后台 让他修改
        // 临时自己改 确保后台存在 1.webp=>1.jpg
        goods_introduce:this.GoodsInfo.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:this.GoodsInfo.pics 
      }
    })
  },
  /**
   * 点击轮播图预览大图
   *  给轮播图绑定点击事件
   *  调用小程序api previewImage
   */
  handlePreviewImage(e){
    // 构造要预览的图片数组
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
    //接收传递的参数 data-xxx
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },
  /**
   * 点击加入购物车
   *  获取点击事件
   *  获取缓存中的购物车数据 数组格式
   *  已经存在就修改数据 ++ 重新写入缓存中
   *  不存在的话加入即可
   *  弹出提示
   */
  handleCartAdd(e){
    //获取缓存中的购物车数据
    let cart=wx.getStorageSync("cart")||[];
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)
    if(index===-1){
      // 不存在 第一次添加
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      // 已经存在数据 执行++
      cart[index].num++;
    }
    // 将购物车重新添加到缓存中
    wx.setStorageSync("cart", cart);
    //弹窗提示
    wx.showToast({
      title: '加入成功！',
      icon: 'success',    
      //防止手抖
      mask: true,      
    });
  },
})