import axios from "axios";
export default {
   state:{
       code:'',
       token: sessionStorage.token || null,
       phoneCode:sessionStorage.phoneCode || null
   },
    mutations:{
        CHANGE_CODE(state,code){
            state.code = code
        },
        CHANGE_TOKEN(state,loginInfo){
            state.token = sessionStorage.token = loginInfo.token;
            state.phoneCode = sessionStorage.phoneCode=loginInfo.phoneCode
        }
    },
    actions:{
       async getCode({commit},getCodeInfo) {
            /*const {code, phoneCode} = getCodeInfo*/
           const  data = await axios.post('/sendCode',{
               phoneCode:getCodeInfo.phoneCode
            })
          const  {ok,msg,code} = data
           if (ok===1){
                commit('CHANGE_CODE',code)
           }
           if(ok===-1){
               alert("请在"+msg+"秒后请求验证码")
           }
        },
       async login({commit},loginInfo){
          const  {token,ok,msg} = await axios.post('/login',loginInfo)
           console.log(msg)
          if(ok===1){
              commit('CHANGE_TOKEN',{
                  token,
                  phoneCode:loginInfo.phoneCode
              })
          }
        }

    }
}
