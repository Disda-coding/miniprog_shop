/**
 * Promise 形式的 getSetting
 */
export const getSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            },
            complete: ()=>{}
        });
    })
}
/**
 * Promise 形式的 chooseAddress
 */
export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            },
            complete: ()=>{}
        });
    })
}
/**
 * Promise 形式的 openSetting
 */
export const openSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            },
            complete: ()=>{}
        });
    })
}
/**
 * Promise 形式的 showModel
 */
export const showModel=({content})=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title: '提示',
            content: content,     
            success: (result) => {
              resolve(result);
            },
            fail: (err)=>{
                reject(err);
            },
            complete: ()=>{}     
          });
    })
}

/**
 * Promise 形式的 showToast
 */
export const showToast=({title})=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title: title,
            icon:'none',     
            success: (result) => {
              resolve(result);
            },
            fail: (err)=>{
                reject(err);
            },
            complete: ()=>{}     
          });
    })
}

/**
 * Promise 形式的 login
 */
export const login=()=>{
    return new Promise((resolve,reject)=>{
        wx.login({
            timeout:10000,
            success: (result)=>{
              resolve(result);
            },
            fail: (err)=>{
                reject(err);
            },
            complete: ()=>{}          
          });
    })
}

/**
 * Promise 形式的 requestPayment
 */
export const requestPayment=(pay)=>{
    return new Promise((resolve,reject)=>{
      wx.requestPayment({
          ...pay,
          success: (result)=>{
              resolve(result);
          },
          fail: (err)=>{
            reject(err);
          },
          complete: ()=>{}
      });
    })
}