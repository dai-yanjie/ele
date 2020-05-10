<template>
        <div class="index">
                <router-view></router-view>
          <Navigation></Navigation>
        </div>
</template>

<script>
    export default {
        name: "Index"
    }
</script>

<style scoped>
    .index {
        width: 100%;
        height: calc(100% - 45px);
    }

</style>