//同时发送异步代码的次数
let ajaxTimes=0;
export const request=(params)=>{
  //判断url中是否带有/my/ 请求是私有路径 带上 token
  let header={...params.header};
  if(params.url.includes("/my/")){
    //拼接header带上token
    header["Authorization"]=wx.getStorageSync("token");
  }

  ajaxTimes++;
  //显示加载中 效果
  wx.showLoading({
    title: "加载中",
    mask: true,   
  });
  //定义公共url
  const baseUrl='https://api-hmugo-web.itheima.net/api/public/v1'
    return new Promise((resolve,reject)=>{
        wx.request({
           ...params,
           header,
           url:baseUrl+params.url,
           success:(result)=>{
             resolve(result);
           },
           fail:(err)=>{
             reject(err);
           },
           complete:()=>{
             ajaxTimes--;
             //如果同时发送请求 其他请求还没结束就关闭loading
             //因此不能在此关闭
              if(ajaxTimes===0) wx.hideLoading();
           }
        });
    })
}