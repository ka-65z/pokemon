<script setup>
import useTrainers from '~/composables/useTrainers';

const {data:trainers} = await useTrainers();//ここでS3バケットからトレーナーファイルの中身（JSON）を取得
//バケットリストではないの？

//console.log(trainers);役に立たんwww
</script>

<template>
  <div>
    <h1>ポケットモンスター</h1>
    <GamifyList>
      <!--トレーナー情報なし時のリンク選択不可処理-->
      <GamifyItem v-if = "trainers.length > 0">
        <NuxtLink to="/trainer">つづきからはじめる</NuxtLink>
      </GamifyItem>
      <!--S3バケット内にトレーナー情報無い場合はコッチ-->
      <GamifyItem v-else>
        <p>つづきからはじめる</p>
      </GamifyItem>
      <GamifyItem>
        <NuxtLink to="/new">あたらしくはじめる</NuxtLink>
      </GamifyItem>
    </GamifyList>
    <!--<div>{{ trainers }}</div>-->
  </div>
</template>
