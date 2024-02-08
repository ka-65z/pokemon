/** ポケモンの取得 */
export const findPokemon = async (name) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const pokemon = await response.json();
  return pokemon;
};

/** これも動作確認用ダミー */
export const findPokemon2 = async () => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/bulbasaur`);
  const pokemon = await response.json();
  return pokemon;
}
