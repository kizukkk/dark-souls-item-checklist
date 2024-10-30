import { readdir, readFile } from "node:fs/promises";
import {
  parsItemsFromMultiTableViewAsync,
  parsItemsFromSingleTableViewAsync,
} from "./parser.js";
import { writeFile } from "fs";
import path from "path";
import fs from "fs";

const PATH = "./assets/data";

const RINGS_URL = "http://darksouls.wikidot.com/rings";
const SHIELDS_URL = "http://darksouls.wikidot.com/shields-tabview";
const WEAPON_URL = "http://darksouls.wikidot.com/weapons-tabview";
const TOOLS_URL = "http://darksouls.wikidot.com/spell-tools-tabview";
const SPELLS_URL = {
  Pyromancies: "http://darksouls.wikidot.com/pyromancies",
  Sorceries: "http://darksouls.wikidot.com/sorceries",
  Miracles: "http://darksouls.wikidot.com/miracles",
};

async function writeJsonToServerStorage(items, name) {
  console.log(`Start ${name} data writing...`);
  Object.keys(items).forEach((item, index) => {
    const dir = `${PATH}/${name}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const path = `${PATH}/${name}/${item}.json`;
    const info = `item ${item} with path ${path}`;
    console.log(`\t[${index}] Write file: ${info}`);

    writeFile(path, JSON.stringify(items[item]), (error) => {
      if (error !== null) {
        console.log(`Write file error: ${info}`);
        console.log(error);
      }
      return;
    });
  });
}

export async function readJsonFromServerStorage(itemClassName) {
  const resourcePath = `${PATH}/${itemClassName}`;

  const itemList = await readdir(resourcePath);

  const items = itemList.map(async (file) => {
    const name = file.replaceAll(".json", "");
    return {
      [name]: JSON.parse(
        await readFile(path.join(resourcePath, file), "utf-8"),
      ),
    };
  });

  const result = await Promise.all(items);
  return result;
}

export async function updateAllCollectionData() {
  //Update Weapons data
  updateMultItemInfo(WEAPON_URL).then((data) => {
    writeJsonToServerStorage(data, "Weapons").then(
      console.log("Weapon data is writed!"),
    );
  });

  //Update Spell-Tools data
  updateMultItemInfo(TOOLS_URL).then((data) => {
    writeJsonToServerStorage(data, "Spell-Tools").then(
      console.log("Spell-Tools data is writed!"),
    );
  });

  updateMultItemInfo(SHIELDS_URL).then((data) => {
    writeJsonToServerStorage(data, "Shields").then(
      console.log("Shields data is writed!"),
    );
  });

  //Update Spells data 
  Object.keys(SPELLS_URL).forEach(spell => {
    updateSinglItemInfo(SPELLS_URL[spell]).then((data) => {
      writeJsonToServerStorage({ [spell]: data }, spell).then(
        console.log(`${spell} data is writed!`),
      );
    });
  })

  updateSinglItemInfo(RINGS_URL).then((data) => {
    writeJsonToServerStorage({ Rings: data }, "Rings").then(
      console.log("Rings data is writed!"),
    );
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
