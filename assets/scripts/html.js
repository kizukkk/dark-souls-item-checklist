import {localStorageIsEmpty, getWeaponListFromJsonAsync, fillWeaponLocalStorageAsync} 
from './data.js';
import {addCollectionEvent, addUpgradEvent} 
from './events.js';


const SOURCE_IMG_URL = 'http://darksouls.wikidot.com/local--files/';
const DOMAIN = 'http://darksouls.wikidot.com/';


export function fillHtml(data){
  if (localStorageIsEmpty('mode'))
    localStorage.setItem('mode', 'all');
  
  const mode = localStorage.getItem('mode');

  switch (mode){
    case 'all':
      document.querySelector('#mode').innerText = 'Personal Collection';
      fillHtml_AllWeapon(data);
      break;
    case 'collection':
      document.querySelector('#mode').innerText = 'Weapon List'
      fillHtml_CollectedWeapon(data)
      break;
  }

  addCollectionEvent();
  addUpgradEvent();
  
}

export function resetHtml(){
  const toRemove = document.querySelectorAll('body > div');

  toRemove.forEach(element => element.remove());
  fillWeaponLocalStorageAsync().then(
    getWeaponListFromJsonAsync().then(weapons => fillHtml(weapons))
  );
}

function fillHtml_AllWeapon(data){
  insertElementsToHtml(data);
}

function fillHtml_CollectedWeapon(data){ 
  const collection = localStorage.getItem('collection');
  const arrayCollection = collection.split(',').reverse();
  let outputData = {};

  arrayCollection.forEach(weaponNameInCollection => {
    Object.keys(data).forEach(weaponClassName => {
      Object.keys(data[weaponClassName]).forEach(weapon => {
        const weaponName = data[weaponClassName][weapon].Name
          .replaceAll(' ', '-')
          .toLowerCase();
        if(weaponName === weaponNameInCollection){
          if(weaponClassName in outputData === false){
            outputData[weaponClassName] = {};
          }
          outputData[weaponClassName][weapon] = data[weaponClassName][weapon];
        }
      })
    })
  })
  
  insertElementsToHtml(outputData);
}

function insertElementsToHtml(elements){
  const elementTemplate = document.getElementById('weapon-template')
  const classTemplate = document.getElementById('weapon-class-template')

  Object.keys(elements).forEach(weapon_class => {
    const classClone = classTemplate.content.cloneNode(true);
    const container = classClone.getElementById('content');
    classClone.querySelector('h1').innerHTML  = weapon_class;

    Object.keys(elements[weapon_class]).forEach(weapon => {
      const elementClone = elementTemplate.content.cloneNode(true);

      let className = (weapon_class == "Straight Swords") ?
          weapon_class.toLowerCase().replace(' ', ''):
          weapon_class.toLowerCase().replace(' ', '-');
        
      const weaponImageName = elements[weapon_class][weapon].Image;
      const weaponName = elements[weapon_class][weapon].Name.toLowerCase().replace(/ /g, '-');
      const imgURL = `${SOURCE_IMG_URL}/${className}/${weaponImageName}`
      
      elementClone.querySelector('img').src = imgURL;
      elementClone.querySelector('img').alt = weaponImageName;
      elementClone.querySelector(".title").innerText = elements[weapon_class][weapon].Name;
      elementClone.querySelector('a').href = `${DOMAIN}${weaponName}`;
      elementClone.querySelector('#drop').innerText = elements[weapon_class][weapon].Availability;

      //!РЕФАКТОРІНГ!
      const collection = localStorage.getItem("collection");
      const upgrade = localStorage.getItem("upgrade");

      const collectionIsEmpty = (typeof collection !== 'undefined' & collection !== null)
      const upgradeIsEmpty = (typeof upgrade !== 'undefined' & upgrade !== null)

      const isCollected = collectionIsEmpty && collection.split(',').includes(weaponName)
      const isUpgraded = collectionIsEmpty && upgradeIsEmpty && upgrade.split(',').includes(weaponName)

      {
        let button = elementClone.querySelector('.collection');
        if(isCollected){
            button.classList.add("collected")
            button.innerText = 'Remove'
        }
        else{
          button.classList.add("missed")
          button.innerText = 'Add to Collection'
        }
      }

      {
        let button = elementClone.querySelector('.upgrade');
        if(isUpgraded){
            button.classList.add("upgraded")
            button.innerText = 'Downgrade'
        }
        else{
          button.classList.add("common")
          button.innerText = 'Upgrade'
        }
      }
      //!ДО СЮДА РЕФАКТОРІНГ!

      const elementContainer = document.createElement('div')
      elementContainer.classList.add("item")
      elementContainer.classList.add(`${weaponName}`)
      elementContainer.appendChild(elementClone)

      container.appendChild(elementContainer);
        
    })
    const elementContainer = document.createElement('div')
    elementContainer.id = (`${weapon_class.toLowerCase().replace(/ /g, '-')}`);
    elementContainer.appendChild(classClone)
    document.body.appendChild(elementContainer);
  });
}