import {updateAllCollectionData, readJsonFromServerStorage} from './assets/scripts/data.js';
import {fileURLToPath} from 'url';
import express from "express";
import path from "node:path";
import fs from "fs";

const PORT = 3000;
const APP = express()

const ITEM_CLASS = {
  'weapons': 'Weapons',
  'tools'  : 'Spell-Tools'
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));


// Server static files
APP.use('/public', express.static(path.join(__dirname, 'public')));


// Server endpoints
APP.get('/', (req, res, next) => {
  res.writeHeader(200, {"Content-Type": "text/html"});

  fs.readFile('./index.html', (err, html) => {
    if (err){
      res.writeHeader(400);
      res.write('Bad Request')
      console.log(err);
    }
    else{
      res.write(html)
      console.log(`Server return Index`)
    }
    res.end();
  })
})

APP.post('/data/update', (req, res, next) => {
  res.writeHeader(200)
  updateAllCollectionData().then(
    console.log('All collections updated!')
  )
  .catch((error) => {
    console.log('Fatal error on collections update!');
    console.log(error);
    res.writeHeader(500)
  })
  res.end();
})

APP.get('/data/:itemClass', async (req, res, next) => {
  const itemClassName = req.params.itemClass;

  if (itemClassName in ITEM_CLASS){
    res.writeHeader(200, {'Content-Type' : 'application/json'})
    readJsonFromServerStorage(ITEM_CLASS[itemClassName]).then(data => {
      const result = data.map(item => {return JSON.parse(item)})
      res.end(JSON.stringify(result, null, 3))
    });
  } else{
    res.writeHeader(400, {'Content-type' : 'text/html'})
    res.end('This collection do not exist!')
  }
  
})


// Another staff
APP.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

