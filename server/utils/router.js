import { Router } from "express";
import { findTrainers, upsertTrainer,findTrainer } from "~/server/utils/trainer";
import { findPokemon } from "~/server/utils/pokemon";

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
    const result = await upsertTrainer(trainerName, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの削除 */
// TODO: トレーナーを削除する API エンドポイントの実装

/** ポケモンの追加 */
router.post("/trainer/:trainerName/pokemon", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    const { pokemonName } = req.body.name;
    // TODO: リクエストボディにポケモン名が含まれていなければ400を返す
    const trainer = await findTrainer(trainerName);
    const Pokemon = await findPokemon(pokemonName);
    // TODO: 削除系 API エンドポイントを利用しないかぎりポケモンは保持する
    //const result = await upsertTrainer(trainerName, { pokemons: [pokemon] });
    trainer.pokemons.push({
      id: new Date().getTime(),
    });
    const result = await upsertTrainer(trainerName, trainer);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** ポケモンの削除 */
// TODO: ポケモンを削除する API エンドポイントの実装

//ダミーAPI findPokemonをfetchして動作確認する時用
//取得データはJSONで返ってくる来るがトレーナーにpushするには、データ加工が必要
router.get("/trainer/tom/pokemondummy", async (req,res,next) => {
  try {
    const pokemonNameStatic = "bulbasaur";
    const getPokeData = await findPokemon(pokemonNameStatic);
    res.send(getPokeData);
  } catch (err) {
    next(err);
  }
});


export default router;
