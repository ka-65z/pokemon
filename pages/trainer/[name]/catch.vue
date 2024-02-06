<script setup>
const {data: pokemons, refresh} = await useFetch(
    () => 
    `https://pokeapi.co/api/v2/pokemon?limit=10&offset=0`,
    {
        default: () => [],
    },
);
</script>

<template>
    <div>
        <h1>ポケモンをつかまえる</h1>
        <P>10しゅるいのポケモンからえらんでね</P>
        <div>{{ pokemons }}</div>
        <GamifyList>
            <GamifyItem v-for="pokemon in pokemons.results" :key="pokemon.url">
                <span class="pokemon-name">{{ pokemon.name }}</span>
                <GamifyButton>かくほ</GamifyButton>
            </GamifyItem>
        </GamifyList>
    </div>
</template>