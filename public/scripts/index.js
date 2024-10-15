import { fillHtml, updateVisible} from './html.js';
import {addModeSwitchEvent, addCollectionEvent, addUpgradEvent, addVisibleEvent} from './events.js'

const HOST = 'http://localhost:3000/'

//Перша ініціалізація
{
  fetch(HOST + 'data')
    .then(response => response.json())
    .then(data => {
      data.map(collection => fillHtml(collection))
      addCollectionEvent();
      addUpgradEvent();
      updateVisible();
    })
  addModeSwitchEvent();
  addVisibleEvent();
  
}








  

