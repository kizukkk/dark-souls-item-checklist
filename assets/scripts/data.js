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
  updateMultItemInfo(WEAPON_URL).then(data => {
    writeJsonToServerStorage(data, 'Weapons').then(
      console.log("Weapon data is writed!"))
  });
  updateMultItemInfo(TOOLS_URL).then(data => {
    writeJsonToServerStorage(data, 'Spell-Tools').then(
      console.log("Spell and Tools data is writed!"))
  });
  
  //TODO : Зменьшити повторення (об'єднати)
  updateSinglItemInfo(SPELLS_URL['Pyromancies']).then(data => {
    writeJsonToServerStorage({'Pyromancies' : data}, 'Spells').then(
      console.log("Pyromancies data is writed!"))
  });

  updateSinglItemInfo(SPELLS_URL['Sorceries']).then(data => {
    writeJsonToServerStorage({'Sorceries' : data}, 'Spells').then(
      console.log("Sorceries data is writed!"))
  });

  updateSinglItemInfo(SPELLS_URL['Miracles']).then(data => {
    writeJsonToServerStorage({'Miracles' : data}, 'Spells').then(
      console.log("Miracles data is writed!"))
  });

}

async function updateSinglItemInfo(URL) {
  const result = await parsItemsFromSingleTableViewAsync(URL);
  return result;
}

async function updateMultItemInfo(URL) {
  const result = await parsItemsFromMultiTableViewAsync(URL);
  return result;
}
