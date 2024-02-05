<!--NuxtのDynamic Routesという手法
    https://nuxt.com/docs/guide/directory-structure/pages
    index.vue＋トレーナ名でページをトレーナー用に生成
    ルートは/trainer/ユーザー名のはず？
-->
<script setup>
const route = useRoute();
const config = useRuntimeConfig();
const { data: trainer} = await useFetch(
    () => `api/trainer/${route.params.name}`,
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
        <div>{{ route }}</div>
        <div>{{ config }}</div>
        <div>{{ trainer }}</div>
    </div>
</template>

<style>
.trainer-img {
    width: 50px;
    height: 50px;
}
</style>