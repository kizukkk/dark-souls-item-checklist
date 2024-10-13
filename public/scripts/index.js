import { fillHtml, updateCollectionVisible} from './html.js';
import {addModeSwitchEvent, addCollectionEvent} from './events.js'

const HOST = 'http://localhost:3000/'

//Перша ініціалізація
{
  fetch(HOST + 'data')
    .then(response => response.json())
    .then(data => {
      data.map(collection => fillHtml(collection))
      addCollectionEvent();
    })
  addModeSwitchEvent();
  
}








  

