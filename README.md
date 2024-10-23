# Dark Souls Remastered: Item Checklist

This project provides an interactive checklist for tracking items obtained in Dark Souls Remastered. It helps players manage their progress by maintaining a personal list of collected and uncollected items

## Technologies

🖥 Frontend: HTML, CSS, and JavaScript are used to dynamically render and manage the display of collected and uncollected items. The checklist allows users to filter and interact with item categories.

:wrench: Backend: Node.js with Express powers the backend, which fetches data from an external source and serves it through a REST API.

📄 Data is sourced from the external resource &mdash; [darksouls.wikidot.com](http://darksouls.wikidot.com/). 

## Getting started

:one: Download the contents of this repository using `git clone` or in main branch: Code -> Install Zip

:two: Using Node, run command in the project directory: 
`npm start` or `node server.js`

:three: Optional. Make a request to update data from a resource using `Invoke-WebRequest -Uri http://HOST:PORT/data/update -Mehodt POST` in Terminal (PowerShell)

:four: Open the page in your browser at `http://HOST:PORT/`

## Footage

<img src="https://github.com/kizukkk/ds1_collection/blob/doc/images/01.png">


<img src="https://github.com/kizukkk/ds1_collection/blob/doc/images/02.png">
