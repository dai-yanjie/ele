<template>
    <div>
        欢迎{{phoneCode}}的到来 <input type="button" value="退出" @click="outLogin">
    </div>
</template>

<script>
    export default {
        name: "My",
        data(){
            return {
                phoneCode:""
            }
        },
        created() {
            this.phoneCode = sessionStorage.phoneCode;
        },
        methods:{
            outLogin(){
                sessionStorage.clear();
                this.$router.push("/login");
            }
        }

    }
</script>

<style scoped>

</style>