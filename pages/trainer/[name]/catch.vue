<script setup>
const {data: pokemons } = await useFetch(
    () => 
    `https://pokeapi.co/api/v2/pokemon?limit=10&offset=0`,
    {
        default: () => [],
    },
);
//ポケモンの取得は10体の固定値で・・・時間があれば、offsetに二桁の乱数を入れてみたい

</script>

<template>
    <div>
        <h1>ポケモンをつかまえる</h1>
        <P>10しゅるいのポケモンからえらんでね</P>
        <div>{{ pokemons }}</div><!--デバッグ用-->
        <GamifyList>
            <GamifyItem v-for="pokemon in pokemons.results" :key="pokemon.url">
                <span class="pokemon-name">{{ pokemon.name }}</span>
                <!--このclassはGamifyItemに設定してあった-->
                <GamifyButton>かくほ</GamifyButton>
            </GamifyItem>
        </GamifyList>
    </div>
</template>