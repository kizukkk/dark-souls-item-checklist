import  {parsItemsAsync} from './parser.js';

const WEAPON_URL = "http://darksouls.wikidot.com/weapons-tabview";
const TOOLS_URL = 'http://darksouls.wikidot.com/spell-tools-tabview'

//Парсінг даних та запис заголовків у LocalStorage
export async function fillWeaponLocalStorageAsync() {
  await parsItemsAsync(WEAPON_URL).then(result => {
    localStorage.setItem('Weapons Types', Object.keys(result));
    console.log(result)
  });

  await parsItemsAsync(TOOLS_URL).then(result => {
    let weapons = localStorage.getItem('Weapons Types').split(',')
    weapons.push(Object.keys(result))
    localStorage.setItem('Weapons Types', weapons);
    localStorage.setItem('Tools Types', Object.keys(result));
    console.log(result)
  });


}

//Отримати список всієї зброї з LocalStorage
export async function getWeaponListFromJsonAsync() {
  const weaponsTypes = localStorage.getItem("Weapons Types").split(',');
  let weaponsList = {};

  const promises = weaponsTypes.map(weaponType => {
    return fetch(`../assets/data/${weaponType}.json`)
      .then(response => response.json())
      .then(data => weaponsList[weaponType] = data)
      .catch(error => {
        console.log("Помилка обробки отримання даних з носія!")
        console.log(error);
      });
  });

  await Promise.all(promises);

  return weaponsList;
}

export function localStorageIsEmpty(name){
  const collection = localStorage.getItem(name)
  return (typeof collection === 'undefined' & collection === null)
}
