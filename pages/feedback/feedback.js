// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品、商家投诉",
        isActive:false
      }      
    ],
    //被选中的图片路径数组
    chooseImages:[],
    textVal:""


  },
  UpLoadImgs:[],
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
  /**
   * 当点击+按钮 触发tap
   * 调用小程序内置选择图片api
   * 获取到图片路径 数组
   * 把图片路径存入 data变量中
   * 页面就可以根据 图片数组进行循环展示 自定义组件
   */
  handleChooseImg(){
    wx.chooseImage({
      //同时选中图片数量
      count: 9,
      // 原图 压缩
      sizeType: ['original','compressed'],
      //来源 相册 照相机
      sourceType: ['album','camera'],
      success: (result)=>{
        this.setData({
          //图片数组拼接
          chooseImages:[...this.data.chooseImages,...result.tempFilePaths]
        })
      }
     
    });
  },
  /**
   * 删除图片
   *  获取被点击的元素索引
   *  获取data中图片数组
   *  根据索引删除对应元素
   *  把数组重新设置回data中
   */
  handleRemovelImg(e){
    const{index}=e.currentTarget.dataset;
    let{chooseImages}=this.data;
    chooseImages.splice(index,1);
    this.setData({
      chooseImages
    })
  },
  /**
   * 点击提交
   *  获取文本域：
   *    data中定义变量 表示 输入框内容
   *    文本域绑定输入事件 触发存入变量
   *  对内容 合法性验证
   *  验证成功 上传到图片服务器 返回链接
   *    微信只支持遍历上传
   *  文本域 和 外网路径 提交服务器
   *  清空当前页面
   *  返回上一页
   * 
   */
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },
  //提交按钮的点击
  handleFormSubmit(e){
    //获取文本域内容
    const {textVal,chooseImages}=this.data;
    //合法性的验证
    if(!textVal.trim()){
      //不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',       
        mask: true,      
      });
    }
    //准备上传图片到专门服务器
    wx.showLoading({
      title: "正在上传中",
      mask: true,     
    });

    //判断有没有图片需要提交
    if(chooseImages.length!=0){
      chooseImages.forEach((v,i)=>{
        var upTask = wx.uploadFile({
          url: 'https://img.coolcr.cn/api/upload',
          filePath: v,
          name: "image",
          formData: {},
          success: (result)=>{
            let url= JSON.parse(result.data).url;
            this.UpLoadImgs.push(url);
            //所有图片都上传完毕后
            if(i===chooseImages.length-1){
              wx.hideLoading();
              //提交都成功了
              this.setData({
                textVal:"",
                chooseImages:[]
              });
              //返回上一页面
              wx.navigateBack({
                delta: 1
              });
            }
          }        
        });
      })
    }else{
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
    }
    
  }
})