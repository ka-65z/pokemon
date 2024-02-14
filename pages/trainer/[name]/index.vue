<!--NuxtのDynamic Routesという手法
    https://nuxt.com/docs/guide/directory-structure/pages
    index.vue＋トレーナ名でページをトレーナー用に生成
    ルートは/trainer/ユーザー名のはず？
-->
<script setup>
const route = useRoute();
const config = useRuntimeConfig();
const { data: trainer, refresh} = await useFetch(
    () => `/api/trainer/${route.params.name}`,
    //またパスの最初の/を忘れたため、trainer/api/trainer/トレーナー名に飛ばされていた
    //↓ここが壊滅的にわからない・・・
    //トレーナー画面再読み込みするとトレーナー取得に失敗の対応追加 srver: false,
    {
        default: () => [],
        server: false,
        baseUrl: config.public.backendOrigin,
    },
);
//以下はトレーナー削除で追加した部分
//ダイアログの切り替えは事前に設定しておくらしいby kunosan douga より
const { dialog: deleteDialog, onOpen: onOpenDelete, onClose: onColseDelete, } = useDialog();
const { dialog: nicknameDialog, onOpen: onOpenNickname, onClose: onCloseNickname,} = useDialog();
const { dialog: releaseDialog, onOpen: onOpenRelease, onClose: onCloseRelease,} = useDialog();

const router = useRouter();
//ダイアログを切り替え式にしてからvueからtrainerパラメータが渡せなくなったので変更？？？理由が知りたい
//async(trainer) => async()
//トレーナー情報はuseRouteから取得
const onDelete = async () => {
    const response = await $fetch(`/api/trainer/${route.params.name}`,{
        baseURL: config.public.backendOrigin,
        method: "DELETE",
    }).catch((e) => e);
    if (response instanceof Error) return;
    router.push(`/trainer`);
};
//はかせにおくる
const onRelease = async (pokemonId)  => {
    const response = await fetch(`/api/trainer/${route.params.name}/pokemon/${pokemonId}`,
    {
        baseURL: config.public.backendOrigin,
        method: "DELETE",
    },
    ).catch((e) => e);
    if (response instanceof Error) return;
    await refresh();
    onCloseRelease();
};

</script>

<template>
    <div>
        <h1>トレーナー情報</h1>
        <div>
            <img class = trainer-img src = "/avatar.png">
            <span>{{ trainer.name }}</span>
        </div>
        <GamifyButton @click="$router.push('/')">さいしょにもどるだけ</GamifyButton>
        <GamifyButton @click="onOpenDelete(true)">マサラタウンにもどる</GamifyButton><!--ダイアログを切り替え式にしてからtrainer情報私不可onOpen(trainer) => onOpenDelete(true)-->
        <!--ちょっと姑息ですが、rootに戻りますm(__)m-->
        <!--<div>{{ route.fullPath }}</div>デバッグ用-->
        <!--<div>{{ route.params.name }}</div>デバッグ用-->
        <!--<div>{{ trainer }}</div>-->
        <!--<div>{{ config }}</div>デバッグ用-->
        <h2>てもちのポケモン</h2>
        <CatchButton :to="`/trainer/${route.params.name}/catch`">ポケモンをつかまえる</CatchButton>
        <!--@clickでなくても遷移する？NuxtLinkでなくても:toが使えるのはCatchButton.jsに設定あるから-->
        <GamifyList>
            <GamifyItem v-for="pokemon in trainer.pokemons" :key="pokemon.id">
                <!--ここでtrainerのpokemonsのArrayをpokemonに入れる idがkey-->
                <img :src="pokemon.sprites.front_default"/>
                <!--<span>{{ pokemon }}</span>-->
                <span class="pokemon-name">{{ pokemon.name}}</span>
                <GamifyButton @click="onOpenNickname(pokemon)">ニックネームをつける</GamifyButton>
                <GamifyButton @click="onOpenRelease(pokemon)">はかせにおくる</GamifyButton>
            </GamifyItem>
        </GamifyList>
        <GamifyDialog
            v-if="deleteDialog"
            id="confirm-delete"
            title="かくにん"
            :description="`ほんとうに　マサラタウンに　かえるんじゃな！　この　そうさは　とりけせないぞ！`"
            @close="onColseDelete"
            >
            <GamifyList :border="false" direction="horizon">
                <GamifyItem>
                    <GamifyButton @click="onColseDelete">いいえ</GamifyButton>
                </GamifyItem>
                <GamifyItem>
                    <GamifyButton @click="onDelete()">はい</GamifyButton>
                </GamifyItem>
                <!--<GamifyItem>
                    {{ deleteDialog }}
                </GamifyItem>デバッグ用だがtrueしか取れないので意味がない-->
            </GamifyList>
        </GamifyDialog>
        <GamifyDialog
            v-if="releaseDialog"
            id="confirm-release"
            title="かくにん"
            :description="`ほんとうに　${releaseDialog.name}　を　はかせに　おくるんじゃな！　この　そうさは　とりけせないぞ！`"
            @close="onCloseRelease"
            >
            <GamifyList :border="false" direction="horizon">
                <GamifyItem>
                    <GamifyButton @click="onCloseRelease">いいえ</GamifyButton>
                </GamifyItem>
                <GamifyItem>
                    <GamifyButton @click="onRelease(releaseDialog.id)">はい</GamifyButton>
                </GamifyItem>
                <!--<GamifyItem>
                    {{ releaseDialog.id }}
                </GamifyItem>デバッグ用こっちは意味がある-->
            </GamifyList>
        </GamifyDialog>
        <GamifyDialog
            v-if="nicknameDialog"
            id="confirm-release"
            title="かくにん"
            :description="`${nicknameDialog.name}　の　ニックネームは？`"
            @close="onCloseNickname"
            >
            <GamifyList :border="false" direction="horizon">
                <GamifyItem>
                    <GamifyButton @click="onCloseNickname">いいえ</GamifyButton>
                </GamifyItem>
                <GamifyItem>
                    <GamifyButton @click="onNickname(nicknameDialog.id)">はい</GamifyButton>
                </GamifyItem>
                <!--<GamifyItem>
                    {{ releaseDialog.id }}
                </GamifyItem>デバッグ用こっちは意味がある-->
            </GamifyList>
        </GamifyDialog>

    </div>
</template>

<style scoped>
.trainer-img {
    width: 50px;
    height: 50px;
}
/**.gamify-item:hover img {
    animation: bounce ;
    animation-duration: 1.0s;
    animation-iteration-count: infinite;
}*/
/**ここでマウスホバーでジャンプするアニメ付加（CSS3）inifiniteで再生無限 */

.gamify-item:hover img {
    animation: rotate;
    animation-duration: 0.7s;
    animation-iteration-count: infinite;
}
@keyframes rotate {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}
/**ちょっと遊んでみましたwww */
</style>