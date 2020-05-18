//同时发送异步代码的次数
let ajaxTimes=0;
export const request=(params)=>{
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