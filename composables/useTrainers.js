import { useFetch, useRuntimeConfig } from "#app";

export default () => {
  const config = useRuntimeConfig();
  const response = useFetch("/api/trainers", {
    default: () => [],
    server: false,
    baseURL: config.public.backendOrigin,
  });
  //server falseはexpressのapiエンドポイントをたたくため？
  console.log(`**useTrainers.js:config`,config);//ここはNuxtアクセス時のみ有効(http://localhost:3000/trainer)
  console.log(`**useTrainers.js:response`, response);
  //tarainer.vue=>useTrainer.js=>route.js=>trainer.js=>findTrainers 
  //router.jsでトレーナー名の抽出処理が必要
  return response;
};
