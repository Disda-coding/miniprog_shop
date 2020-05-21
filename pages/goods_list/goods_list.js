// pages/goods_list/goods_list.js
import {request} from "../../request/index.js"
/**
 * 用户上滑页面 滚动条触底 开始加载下一页数据
 * 
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
      tabs:[
        {
          id:0,
          value:"综合",
          isActive:true
        },
        {
          id:1,
          value:"销量",
          isActive:false
        },
        {
          id:2,
          value:"价格",
          isActive:false
        }
      ],
      goods_list:[]
  },
 QueryParams:{
   query:"",
   cid:"",
   pagenum:1,
   pagesize:10
 },
 totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();
  },

//获取商品列表数据
async getGoodsList(){
  const res=await request({url:"/goods/search",data:this.QueryParams});
  // 获取总条数
  const total = res.data.message.total;
  //计算总页数
  this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
  this.setData({
    goods_list:[...this.data.goods_list,...res.data.message.goods]
  });
  //关闭下拉刷新接口
  wx.stopPullDownRefresh;
},

//标题点击事件 从子组件传递
  handleTabsItemChange(e){
    //获取索引
    const {index}=e.detail;
    //修改源数组
    console.log(e);
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },

  onReachBottom(){
    // 判断有没有下一页数据
    /**
     * 如果有下一页数据 page++
     * 重新发送请求
     * 接收数据后不能填充数据 否则覆盖旧的数据
     * 因此需要使用 数组拼接
     */
    if(this.QueryParams.pagenum>=this.totalPages){
      //console.log('%c'+"没有下一页数据","color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)");
      wx.showToast({
        title: '到底了',        
      });
    }else{
      //console.log('%c'+"有下一页数据","color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)");
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  /**
   * 下拉刷新页面
   * 1 触发事件
   * 2 重置数据数组
   * 3 重置页码
   * 4 重新发送请求
   * 5 数据请求回来 手动关闭刷新动画
   */
  onPullDownRefresh(){
    //重置数组
    this.setData({
      goods_list:[]
    });
    //重置页码
    this.QueryParams.pagenum=1;
    //重发请求
    this.getGoodsList();
  }
})