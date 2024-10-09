export async function parsWeaponAsync(URL) {
  try {
    const response = await fetch(URL);
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const tabs = doc.querySelectorAll('div[id^="wiki-tab"]');
    const result = parsingDataFromTables(tabs);
        
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

function getWeaponParams(table){
  let weaponTypeParams = []

  table.querySelectorAll('th').forEach(th => {
    
    let paramText = th.textContent;
    if(paramText == "Icon"){
      paramText = "Image";
    }

    weaponTypeParams.push(paramText);
  })

  return weaponTypeParams;
}

function getWeaponTypes(table){
  const ul = table.querySelector('ul');
  const li = ul.querySelectorAll('li');

  let weaponTypeList = [];

  li.forEach(li => weaponTypeList.push(li.textContent));

  return weaponTypeList;
}

function parsingDataFromTables(tables) {
  let itemListByType = {}
  const weaponTypes = getWeaponTypes(tables[0]);
  
  tables.forEach((tab, index) => {
    if (index == 0)
      return;

    const weaponTable = tab.querySelector('tbody').querySelector('tbody');
    let weaponParams = [];
    let itemPlaceholder = {}
    let itemList = [];

    weaponTable.querySelectorAll('tr').forEach((tr, index) => {
      if (index == 0) {
        weaponParams = getWeaponParams(tr);
        
        itemParams.forEach(i => {
          if(i == "Stats Needed Stat Bonuses"){
            itemPlaceholder["Stats"] = undefined;
            return;
          }
          itemPlaceholder[i] = undefined
        });
        return;
      };
      const item = structuredClone(itemPlaceholder);

      tr.querySelectorAll('td').forEach((td, index) => {
        if (td.querySelector('img')) {
          const img = td.querySelector('img');
          item["Image"] = img.getAttribute('alt');

          return;
        }

        if(index == itemParams.indexOf("Stats Needed Stat Bonuses")){
          const firstPart = td.childNodes[0].nodeValue?.trim();
          const secondPart = td.childNodes[td.childNodes.length - 1].nodeValue?.trim();
          item.Stats = {};
          item.Stats["Stats Needed"] = firstPart;
          item.Stats["Stat Bonuses"] = secondPart;
          return;
        }
        
        item[Object.keys(itemPlaceholder)[index]] = td.textContent.replace(/\n/g, ' ');
      });

      itemList.push(item);
    });
    itemListByType[weaponTypes[index-1]] = itemList;
  });

  return itemListByType;
}