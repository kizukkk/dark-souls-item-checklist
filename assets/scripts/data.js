import { readdir, readFile} from 'node:fs/promises';
import  {parsItemsFromMultiTableViewAsync, parsItemsFromSingleTableViewAsync} from './parser.js';
import {writeFile} from 'fs';
import path from 'path';
import fs from "fs";

const PATH = './assets/data'

const WEAPON_URL = "http://darksouls.wikidot.com/weapons-tabview";
const TOOLS_URL = 'http://darksouls.wikidot.com/spell-tools-tabview';
const SPELLS_URL = {
  'Pyromancies' : 'http://darksouls.wikidot.com/pyromancies',
  'Sorceries' : 'http://darksouls.wikidot.com/sorceries',
  'Miracles' : 'http://darksouls.wikidot.com/miracles'
}


async function writeJsonToServerStorage(items, name){

  console.log('Start data writing...')
  Object.keys(items).forEach((item, index) => {
    const dir = `${PATH}/${name}`;
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    const path = `${PATH}/${name}/${item}.json`; 
    const info = `item ${item} with path ${path}`;
    console.log(`\t[${index}] Write file: ${info}`);

    writeFile(path, JSON.stringify(items[item]), (error) => {
      if(error !== null){
        console.log(`Write file error: ${info}`);
        console.log(error)
      }
      return;
    })
  })
}

export async function readJsonFromServerStorage(itemClassName) {
  const resourcePath = `${PATH}/${itemClassName}`;

  const itemList = await readdir(resourcePath);

  const items = itemList.map(async (file) => {
    const name = file.replaceAll('.json', '');
    return {[name] : JSON.parse(await readFile(path.join(resourcePath, file), 'utf-8'))}
  });

  const result = await Promise.all(items);
  return result;
}

export async function updateAllCollectionData() {
  updateItemInfo(WEAPON_URL).then(data => {
    writeJsonToServerStorage(data, 'Weapons').then(
      console.log("Weapon data is writed!"))
  });
  updateItemInfo(TOOLS_URL).then(data => {
    writeJsonToServerStorage(data, 'Spell-Tools').then(
      console.log("Spell and Tools data is writed!"))
  });  
}

async function updateItemInfo(URL){
  const result = await parsItemsAsync(URL)
  return result;
}
