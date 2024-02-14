import { Router } from "express";
import { findTrainers, upsertTrainer,findTrainer, deleteTrainer } from "~/server/utils/trainer";
import { findPokemon, findPokemon2 } from "~/server/utils/pokemon";

const router = Router();

router.get("/hello", (_req, res) => {
  res.send("Hello World");
});

/** トレーナー名の一覧の取得 */
router.get("/trainers", async (_req, res, next) => {
  try {
    const trainers = await findTrainers();
    // TODO: 期待するレスポンスボディに変更する
    const trainerNames = trainers.map(({Key}) => Key.slice(0,-5));//Key:OK key:NG replace=>slice マイナス指定で末尾から５文字を削除(.json)
    res.send(trainerNames);
    console.log(`**routers.js-trainerNames:`, trainerNames);//デバッグ用追加
    console.log(`**router.js-trainers:`, trainers);//デバッグ用追加
  } catch (err) {
    next(err);
  }
});

/** トレーナーの追加 */
router.post("/trainer", async (req, res, next) => {
  try {
    // TODO: リクエストボディにトレーナー名が含まれていなければ400を返す
    // TODO: すでにトレーナー（S3 オブジェクト）が存在していれば409を返す
    if (!("name" in req.body && req.body.name.length >0))
      return res.sendStatus(400);
    const trainers = await findTrainers();
    if (trainers.some(({Key}) => Key === `${req.body.name}.json`))
      return res.sendStatus(409);
    const result = await upsertTrainer(req.body.name, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの取得 */
// TODO: トレーナーを取得する API エンドポイントの実装
router.get("/trainer/:trainerName", async (req,res,next) =>{
  try { 
    const { trainerName } = req.params;
    const trainer = await findTrainer(trainerName);
    res.send(trainer);
    } catch (err) {
      next(err);
    }
});

/** トレーナーの更新 */
router.post("/trainer/:trainerName", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    // TODO: トレーナーが存在していなければ404を返す
    const trainers = await findTrainers();
    if (!trainers.some(({ Key }) => Key === `${trainerName}.json`))
      return res.sendStatus(404);
    const result = await upsertTrainer(trainerName, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの削除 */
// TODO: トレーナーを削除する API エンドポイントの実装
router.delete("/trainer/:trainerName", async (req,res,next) => {
  try {
    const {trainerName} = req.params;
    const result = await deleteTrainer(trainerName);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** ポケモンの追加 */
router.post("/trainer/:trainerName/pokemon", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    const pokemonName  = req.body.name;
    // TODO: リクエストボディにポケモン名が含まれていなければ400を返す
    if (!("name" in req.body && req.body.name.length >0))
      return res.sendStatus(400);
    
    const trainer = await findTrainer(trainerName);
    const pokemon = await findPokemon(pokemonName);
    const pokeOrder = pokemon.order;
    const pokeName = pokemon.name;
    const pokeSpritesFD = pokemon.sprites.front_default;

    // TODO: 削除系 API エンドポイントを利用しないかぎりポケモンは保持する
    //const result = await upsertTrainer(trainerName, { pokemons: [pokemon] });
    trainer.pokemons.push({
      id: new Date().getTime(),nickname:"",order:pokeOrder,name:pokeName,sprites:{"front_default":pokeSpritesFD}
    });
    const result = await upsertTrainer(trainerName, trainer);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** ポケモンの削除 */
// TODO: ポケモンを削除する API エンドポイントの実装
router.delete("/trainer/:trainerName/pokemon/:pokemonId", async (req,res,next) => {
  try {
    const {trainerName,pokemonId} = req.params;
    const trainer = await findTrainer(trainerName);
    const index = trainer.pokemons.findIndex(
      (pokemon) => String(pokemon.id) === pokemonId,
    );
    trainer.pokemons.splice(index,1);
    const result = await upsertTrainer(trainerName, trainer);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
},
);


//ダミーAPI findPokemonでfetchして動作確認する用(router.js=>pokemon.js)
//取得データはJSONで返ってくる来るがトレーナーにpushするには、データ加工が必要
//データ加工も完了でダミーAPIその1としては完了（WebブラウザーからAPIを直接たたく。本番環境はこれの静的部分を動的に！
router.get("/trainer/tom/pokemondummy", async (req,res,next) => {
  try {
    const pokemonNameStatic = "bulbasaur";
    const getPokeData = await findPokemon2(pokemonNameStatic);
    const trainerName ="tom"
    const trainer =await findTrainer(trainerName);
    //const pokeJson = JSON.parse(getPokeData); ダメです
    //const pokeOrder = pokeJson.order.value ダメです
    const pokeOrder = getPokeData.order;
    const pokeName = getPokeData.name;
    const pokeSpritesFD = getPokeData.sprites.front_default;
    //res.send(getPokeData);
    console.log(getPokeData.order);
    console.log(getPokeData.name);
    console.log(getPokeData.sprites.front_default);
    console.log(`pokeOrder:`, pokeOrder);
    console.log(`pokeName:`,pokeName);
    console.log(`pokeSpritesFD:`,pokeSpritesFD);
    //pokeOrder,pokeName,pokeSpritesFDを使って、trainerのPokemons Arrayに追加するdataを作る
    const trainerPushArray = {id: new Date().getTime(),nickname:"",order:pokeOrder,name:pokeName,sprites:{"front_default":pokeSpritesFD}};
    console.log(trainerPushArray);
    res.send(trainerPushArray);
    //trainerにpushする
    console.log(trainer);
    trainer.pokemons.push(trainerPushArray);
    console.log(trainer);
    //S3のtrainerを新規のtrainerで更新する
    const result = await upsertTrainer(trainerName,trainer);
    res.send(result);
    //ダミーAPIとしては完成 => 本番環境のPOSTにこれをキレイに移植www

  } catch (err) {
    next(err);
  }
});

//ダミーAPIその２ vueからPOSTでポケモン名がボディに格納できているか確認用
//(catch.vue=>router.js)
router.post("/trainer/:trainerName/pokemon2", async (req,res,next) => {
  try{
    const {trainerName} = req.params;
    const pokemonName = req.body.name;//JSON.stringfyも不要らしい
    //const trainer = await findTrainer(trainerName);
    if (!("name" in req.body && req.body.name.length >0))
      return res.sendStatus(400);
    //const pokemon = await findPokemon2(pokemonName);
    //res.send(trainerName);//レスポンス無しは、邪道かな？
    console.log(pokemonName,trainerName);//ログがundifinedになるのは、const {pokemonName} => const pokemonNameでした
  } catch (err) {
    next(err);
  }
});

export default router;
