<!--NuxtのDynamic Routesという手法
    https://nuxt.com/docs/guide/directory-structure/pages
    index.vue＋トレーナ名でページをトレーナー用に生成
    ルートは/trainer/ユーザー名のはず？
-->
<script setup>
const route = useRoute();
const config = useRuntimeConfig();
const { data: trainer} = await useFetch(
    () => `/api/trainer/${route.params.name}`,
    //またパスの最初の/を忘れたため、trainer/api/trainer/バケット名に飛ばされていた
    {
        default: () => [],
        baseUrl: config.public.backendOrigin,
    },
);
</script>

<template>
    <div>
        <h1>トレーナー情報</h1>
        <div>
            <img class = trainer-img src = "/avatar.png">
            <span>{{ trainer.name }}</span>
        </div>
        <!--<div>{{ route.fullPath }}</div>デバッグ用-->
        <!--<div>{{ route.params.name }}</div>デバッグ用-->
        <div>{{ trainer }}</div>
        <div>{{ config }}</div>
    </div>
</template>

<style scoped>
.trainer-img {
    width: 50px;
    height: 50px;
}
</style>