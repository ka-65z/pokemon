<script setup>
const {data: pokemons } = await useFetch(
    () => 
    `https://pokeapi.co/api/v2/pokemon?limit=10&offset=0`,
    {
        default: () => [],
    },
);
//ポケモンの取得は10体の固定値で・・・時間があれば、offsetに二桁の乱数を入れてみたい

const pokemonName = ref("");
const { dialog, onOpen, onClose } = useDialog();
//console.log(pokemonName);


</script>

<template>
    <div>
        <h1>ポケモンをつかまえる</h1>
        <h3>10しゅるいのポケモンからえらんでね</h3><!--pタグを使用したらワーニング発生-->
        <div>{{ pokemons }}</div><!--デバッグ用-->
        <GamifyList>
            <GamifyItem v-for="pokemon in pokemons.results" :key="pokemon.url">
                <span class="pokemon-name">{{ pokemon.name }}</span>
                <!--このclassはGamifyItemに設定してあった-->
                <GamifyButton @click="onOpen(true) , (pokemonName = pokemon.name)">かくほ</GamifyButton>
            </GamifyItem>
        </GamifyList>
        <GamifyDialog
            v-if="dialog"
            id="confirm-submit"
            title="かくにん"
            :description="`ほう　${pokemonName}　にするんじゃな？`"
            @close="onClose"
            >
            <GamifyList :border="false" direction="horizon">
                <GamifyItem>
                    <GamifyButton @click="onClose">いいえ</GamifyButton>
                </GamifyItem>
                <GamifyItem>
                    <!--<GamifyButton @click="onSubmit">はい</GamifyButton>-->
                </GamifyItem>
                <!--<GamifyItem>
                    {{ pokemonName }}
                </GamifyItem>デバッグ用-->
            </GamifyList>
        </GamifyDialog>
    </div>
</template>