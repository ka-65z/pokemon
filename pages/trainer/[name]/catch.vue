<script setup>
const {data: pokemons } = await useFetch(
    () => 
    `https://pokeapi.co/api/v2/pokemon?limit=10&offset=0`,
    {
        default: () => [],
    },
);
//ポケモンの取得は10体の固定値で・・・時間があれば、offsetに二桁の乱数を入れてみたい

//const pokemonName = ref("");ダイアログからダイレクトに取得可能なことが判明したので・・・
const { dialog, onOpen, onClose } = useDialog();
//console.log(pokemonName);
//routeからトレーナー名を取得する
const route =useRoute();
//useRuntimeConfigからfetch用のbackOriginを取得する
const config = useRuntimeConfig();
//最後に画面遷移するrouterが抜けていましたeslintは検知してくれないのね～
const router = useRouter();
//newよりコピペ
const onCatch = async (pokemon) => {
    //routeからトレーナー名取得 ${route.params.name}
  const response = await $fetch(`/api/trainer/${route.params.name}/pokemon`, {
    baseURL: config.public.backOrigin,
    method: "POST",
    /**headers: {
      "Content-Type": "application/json",
    },ここは不要？*/
    /**body: JSON.stringify({
      name: pokemon.name,
    }),$fetchがJSONにしてくれるので不要*/
    body: {
        name: pokemon.name,
    },
  }).catch((e) => e);
  if  (response instanceof Error) return;
  router.push(`/trainer/${route.params.name}`);
};
//デバッグ用POST router.jsのダミーAPIその２と接続
//fetch 全静的 これで送れているらしい
// async() => ssync(daialog) name:"bulbasaur" => name: pokemon.nameもOK！
const onTest = async (pokemon) => {
    const response = await $fetch(`/api/trainer/tom/pokemon2`, {
        baseURL:config.public.backOrigin,
        method: "POST",
        /**headers: {
            "Content-Type":"application/json",
        },*/
        //body:JSON.stringify({name:"bulbasaur"}),
        body: {name: pokemon.name,},
    }).catch((e) => e);
    if (response instanceof Error) return;
    router.push(`/trainer/tom`);
};

</script>

<template>
    <div>
        <h1>ポケモンをつかまえる</h1>
        <h3>10しゅるいのポケモンからえらんでね</h3><!--pタグを使用したらワーニング発生-->
        <!--<div>{{ pokemons }}</div>デバッグ用-->
        <GamifyList>
            <GamifyItem v-for="pokemon in pokemons.results" :key="pokemon.url">
                <span class="pokemon-name">{{ pokemon.name }}</span>
                <!--このclassはGamifyItemに設定してあった-->
                <!--<GamifyButton @click="onOpen(true) , (pokemonName = pokemon.name)">かくほ</GamifyButton>kunoさんの動画からお蔵入り-->
                <GamifyButton @click="onOpen(pokemon)">かくほ</GamifyButton>
            </GamifyItem>
        </GamifyList>
        <GamifyDialog
            v-if="dialog"
            id="confirm-submit"
            title="かくにん"
            :description="`ほう　${dialog.name}　にするんじゃな？`"
            @close="onClose"
            >
            <GamifyList :border="false" direction="horizon">
                <GamifyItem>
                    <GamifyButton @click="onClose">いいえ</GamifyButton>
                </GamifyItem>
                <GamifyItem>
                    <GamifyButton @click="onCatch(dialog)">はい</GamifyButton>
                </GamifyItem>
                <!--<GamifyItem>
                    {{ dialog }}
                </GamifyItem>デバッグ用-->
                <!--<GamifyItem>
                    {{ pokemonName }}
                </GamifyItem>デバッグ用-->
                <!--<GamifyItem>
                    <GamifyButton @click="onTest(dialog)">てすとそうしん</GamifyButton>
                </GamifyItem>デバッグ用-->
            </GamifyList>
        </GamifyDialog>
    </div>
</template>