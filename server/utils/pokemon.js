/** ポケモンの取得 */
export const findPokemon = async (name) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const pokemon = await response.json();
  return pokemon;
};

/** これも動作確認用ダミー 検証時はasync(name)をsync() fetchは決め打ちで/pokemon/bulbasaur*/
export const findPokemon2 = async (name) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const pokemon = await response.json();
  return pokemon;
}
