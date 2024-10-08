import { fillHtml } from './html.js';
import {getWeaponListFromJsonAsync, fillWeaponLocalStorageAsync} from './data.js'
import {addModeSwitchEvent} from './events.js'


//Перша ініціалізація
{
  fillWeaponLocalStorageAsync()
    .then(
      getWeaponListFromJsonAsync()
        .then(weapons => {
          fillHtml(weapons);
          addModeSwitchEvent();
      })
  );
}








  

