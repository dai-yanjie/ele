<template>
    <div class="login">
        <div class="logo">
            <img src="@/assets/img/logo.png" alt="my login image">
        </div>
        <!-- 手机号 -->
        <div class="text_group">
            <div :class="{input_group:true, 'is-invalid':phoneId_invalid}">
                <input v-model="phoneCode" type="input" placeholder="手机号">
            </div>
            <div v-if="phoneId_invalid" class="invalid-feedback">请输入手机号</div>
        </div>
        <!-- 验证码 -->
        <div class="text_group">
            <div :class="{input_group:true, 'is-invalid':codeshow}">
                <input type="input" :value="$store.state.login.code" placeholder="验证码">
                <button @click="getCode(phoneCode)">获取验证码</button>
            </div>
            <div class="invalid-feedback" v-if="codeshow">请输入验证码</div>
        </div>
        <div class="login_des">
            <p>
                新用户登录即自动注册，并表示已同意
                <span>《用户服务协议》</span>和<span>《隐私权政策》</span>
            </p>
        </div>
        <!-- 登录按钮 -->
        <div class="login_btn">
            <button @click="login">登录</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data(){
            return {
                phoneId_invalid:false,
                phoneCode:"",
                code:"",
                codeshow:false
            }
        },
        methods:{
            getCode(){
                if(this.phoneCode<1){
                    this.phoneId_invalid=true
                }else {
                    this.$store.dispatch('getCode',{
                        code:this.code,
                        phoneCode:this.phoneCode
                    })
                }
            },
            login(){
                if(this.$store.state.login.code){
                    this.$router.go(-1)
                    this.$router.push('/')
                    this.codeshow=false
                    this.code= this.$store.state.login.code
                    if(this.phoneCode<1){
                        this.phoneId_invalid=true
                    }{
                        this.$store.dispatch('login',{
                            phoneCode:this.phoneCode,
                            code:this.code,
                        })
                    }
                }else {
                    this.codeshow=true
                }

            }
        }
    }
</script>

<style scoped>
    .login {
        width: 100%;
        height: 100%;
        padding: 30px;
        box-sizing: border-box;
        background: #fff;
    }
    .logo {
        text-align: center;
    }
    .logo img {
        width: 150px;
    }
    .text_group,
    .login_des,
    .login_btn {
        margin-top: 20px;
    }
    .login_des {
        color: #aaa;
        line-height: 22px;
    }
    .login_des span {
        color: #4d90fe;
    }
    .login_btn button {
        width: 100%;
        height: 40px;
        background-color: #4cd96f;
        border-radius: 4px;
        color: white;
        font-size: 14px;
        border: none;
        outline: none;
    }
    .login_btn button[disabled] {
        background-color: #8bda81;
    }


    .input_group {
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .input_group input {
        height: 100%;
        width: 60%;
        border:none;
        outline: none;
    }
    .input_group button {
        border: none;
        outline: none;
        background: #fff;
    }
    .input_group button[disabled] {
        color: #aaa;
    }
    .is-invalid {
        border: 1px solid red;
    }
    .invalid-feedback {
        color: red;
        padding-top: 5px;
    }
</style>