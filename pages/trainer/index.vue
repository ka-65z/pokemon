<script setup>
//ここのサブフォルダ=>index.vueがルートになるはここ参照＋halfより
//https://tuqulore.github.io/vue-3-practices/66

const {data:trainers} = await useTrainers ();

</script>


<template>
  <div>
    <h1>つづきからはじめる</h1>
    <!--<form @submit.prevent>-->
        <GamifyList>
            <GamifyItem v-for="trainer in trainers" :key="trainer">
              <NuxtLink :to="`/trainer/${trainer}`">{{ trainer }}</NuxtLink><!--ダミーコメント-->
              <!--<p>{{ trainer }}</p>リンクなしの表示用-->
            </GamifyItem>
        </GamifyList>
    <!--</form>-->
    <!--<div>{{ trainers }}</div> デバッグ用-->
  </div>
</template>

<style scoped>
form {
  border-radius: 0.5rem;
  border: solid 4px #555;
  padding: 1.5rem 3rem;
}

form > :not(:last-child) {
  display: block;
  margin-bottom: 1rem;
}

.item > label,
.item > span {
  display: block;
  margin-bottom: 0.25rem;
}
.item > span {
  font-size: 0.875rem;
}
</style>