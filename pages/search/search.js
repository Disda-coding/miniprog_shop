import {request} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    TimeId:-1,
    isFocus:false,
    inputValue:""
  },
  /**
   * 输入框绑定事件
   *  获取输入框的值 
   *  合法性判断
   *  检验通过 把值发送后台
   *  返回值打印
   * 
   * 但是这样会把我们每个字符都去访问后台
   * 因此需要 防抖
   * 防止抖动： 定时器 节流
   * 1 防抖一般 输入框中防止重复发送数据
   * 2 节流 一般用作页面上下拉
   *  
   */
  handleInput(e){
    //获取输入框的值 
      const{value}=e.detail;
      //合法性判断
      if(!value.trim()){
        this.setData({
          isFocus:false
        })
        return;
      }
      this.setData({
        isFocus:true
      })
      clearTimeout(this.TimeId);
      this.TimeId=setTimeout(() => {
        //检验通过 把值发送后台
        this.qsearch(value);
      }, 1000);
      
  },
  //发送请求 获取搜索建议数据
  async qsearch(query){
    const res=await request({url:"/goods/qsearch",data:{query}});
    this.setData({
      goods:res.data.message
    })
  },
  //点击取消
  handleCancel(){
    this.setData({
      inputValue:"",
      isFocus:false,
      goods:[]
    })
  }
})