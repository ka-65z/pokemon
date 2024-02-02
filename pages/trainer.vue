<script setup>
//import useTrainers from '~/composables/useTrainers';akibaさんと・・

//import {ListBucketCommand, S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
//const REGION = "ap-northeast-1";
//const client = new S3Client({region: REGION});トレーナー取得部分は事前に準備されたものがある。

const {data:trainers} = await useTrainers ();

</script>


<template>
  <div>
    <h1>つづきからはじめる</h1>
    <!--<form @submit.prevent>-->
        <GamifyList>
            <GamifyItem v-for="trainer in trainers" :key="trainer">
              <!--<NuxtLink :to="`/trainer/${trainer}`">{{ trainer }}</NuxtLink>-->
              <p>{{ trainer }}</p><!--とりあえずリンクなしの表示用-->
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