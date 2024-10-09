import http from "node:http";
import {fileURLToPath} from 'url';
import fs from "fs";
import express from "express";
import path from "node:path";

const PORT = 3000;
const APP = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

APP.use('/assets', express.static(path.join(__dirname, '/assets')));




APP.get('/', (req, res) => {
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

APP.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});