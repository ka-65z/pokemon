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
    //またパスの最初の/を忘れたため、trainer/api/trainer/トレーナー名に飛ばされていた
    //↓ここが壊滅的にわからない・・・
    //トレーナー画面再読み込みするとトレーナー取得に失敗の対応追加 srver: false,
    {
        default: () => [],
        server: false,
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
        <GamifyButton @click="$router.push('/')">さいしょにもどるだけ</GamifyButton>
        <!--ちょっと姑息ですが、rootに戻りますm(__)m-->
        <!--<div>{{ route.fullPath }}</div>デバッグ用-->
        <!--<div>{{ route.params.name }}</div>デバッグ用-->
        <!--<div>{{ trainer }}</div>-->
        <!--<div>{{ config }}</div>デバッグ用-->
        <h2>てもちのポケモン</h2>
        <CatchButton :to="`/trainer/${route.params.name}/catch`">ポケモンをつかまえる</CatchButton>
        <!--@clickでなくても遷移する？NuxtLinkでなくても:toが使えるのはCatchButton.jsに設定あるから-->
        <GamifyList>
            <GamifyItem v-for="pokemon in trainer.pokemons" :key="pokemon.id">
                <!--ここでtrainerのpokemonsのArrayをpokemonに入れる idがkey-->
                <img :src="pokemon.sprites.front_default"/>
                <!--<span>{{ pokemon }}</span>-->
                <span class="pokemon-name">{{ pokemon.name}}</span>
                <GamifyButton>ニックネームをつける</GamifyButton>
                <GamifyButton>はかせにおくる</GamifyButton>
            </GamifyItem>
        </GamifyList>

    </div>
</template>

<style scoped>
.trainer-img {
    width: 50px;
    height: 50px;
}
/**.gamify-item:hover img {
    animation: bounce ;
    animation-duration: 1.0s;
    animation-iteration-count: infinite;
}*/
/**ここでマウスホバーでジャンプするアニメ付加（CSS3）inifiniteで再生無限 */

.gamify-item:hover img {
    animation: rotate;
    animation-duration: 0.7s;
    animation-iteration-count: infinite;
}
@keyframes rotate {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}
/**ちょっと遊んでみましたwww */
</style>