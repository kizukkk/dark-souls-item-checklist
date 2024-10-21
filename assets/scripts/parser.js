import * as jsdom from 'jsdom';

export async function parsItemsFromMultiTableViewAsync(URL) {
  try {
    const response = await fetch(URL)    
    const html = await response.text();
    const doc = new jsdom.JSDOM(html, {contentType: "text/html"});
    const tabs = doc.window.document.querySelectorAll('div[id^="wiki-tab"]');
    const result = parsingDataFromTables(tabs);
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export async function parsItemsFromSingleTableViewAsync(URL) {
  try {
    const response = await fetch(URL)    
    const html = await response.text();
    const doc = new jsdom.JSDOM(html, {contentType: "text/html"});
    const result = parsingDataFromTable(doc.window.document.querySelectorAll('table[class^="wiki"]')[0]);
        
    return result;
  } catch (error) {
    console.error(`Error fetching data (${URL}):`, error);
    return [];
  }
}

function parsingDataFromTables(tables) {
  let itemListByClass = {}
  let itemClassList = getItemsClass(tables[0]);
  
  tables = Array.from(tables).slice(1, tables.length)
  
  tables.forEach((tab, index) => {
    const itemTables = tab.querySelector('tbody').querySelector('tbody');
    let itemParams = [];
    let itemTemplate = {}
    let itemList = [];
  
    itemParams = getItemParams(itemTables.querySelector('tr'))
    
    //Init object template for item
    itemParams.forEach(i => {
      if(i == "Stats Needed Stat Bonuses"){
        itemTemplate["Stats"] = undefined;
        return;
      }
      itemTemplate[i] = undefined
    });

    //Fiil items 
    itemTables.querySelectorAll('tr').forEach((data, index) => {
      if(index == 0){
        return;
      }
      
      const item = getItemData(data, itemTemplate, itemParams)
      itemList.push(item);
    });

    itemListByClass[itemClassList[index]] = itemList;
  });

  return itemListByClass;
}

function parsingDataFromTable(table){
  let itemList = [];
  let itemTemplate = {}

  const itemParams = getItemParams(table.querySelector('tr'))
  const items = table.querySelectorAll('tr')

  itemParams.forEach(i => {
    if(i == "Stats Needed Stat Bonuses"){
      itemTemplate["Stats"] = undefined;
      return;
    }
    itemTemplate[i] = undefined
  });
  
  items.forEach((data, index) => {
    if(index == 0)
      return;
    
    const item = getItemData(data, itemTemplate, itemParams)
    itemList.push(item);
  })
  return itemList
}

function getItemParams(table){
  let weaponTypeParams = []

  table.querySelectorAll('th').forEach(th => {
    
    let paramText = th.textContent;
    if(paramText == "Icon"){
      paramText = "Image";
    }
    if(paramText == 'Location'){
      paramText = "Availability";
    }

    weaponTypeParams.push(paramText.replaceAll('\n', ' '));
  })

  return weaponTypeParams;
}

function getItemsClass(table){
  const ul = table.querySelector('ul');
  const li = ul.querySelectorAll('li');

  let weaponTypeList = [];

  li.forEach(li => weaponTypeList.push(li.textContent));

  return weaponTypeList;
}

function getItemData(data, template, params){
  const item = structuredClone(template);

  data.querySelectorAll('td').forEach((td, index) => {
    if (td.querySelector('img')) {
      const img = td.querySelector('img');
      item["Image"] = img.getAttribute('src');

      return;
    }

    if(index == params.indexOf("Stats Needed Stat Bonuses")){
      const firstPart = td.childNodes[0].nodeValue?.trim();
      const secondPart = td.childNodes[td.childNodes.length - 1].nodeValue?.trim();
      item.Stats = {};
      item.Stats["Stats Needed"] = firstPart;
      item.Stats["Stat Bonuses"] = secondPart;
      return;
    }
    
    item[Object.keys(template)[index]] = td.textContent.replace(/\n/g, ' ');

  });
  return item;
}