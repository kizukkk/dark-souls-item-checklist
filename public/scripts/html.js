const WIKI_DOMAIN = "http://darksouls.wikidot.com/";
const ITEM_CLASS = ["weapons", "tools", "shields", "armors", "spells", "rings"];

export function fillHtml(data) {
  insertElementsToHtml(data);
}

export function preRender() {
  if (localStorageIsEmpty("mode")) localStorage.setItem("mode", "all");

  //Порядок рендеру
  renderModeSwitcher();
  renderViewMode();
  renderItemCategory();
}

export function renderItemCategory() {
  const flags = ITEM_CLASS.map((name) => {
    if (localStorageIsEmpty(name)) {
      localStorage.setItem(name, true);
    }
    return { [name]: JSON.parse(localStorage.getItem(name)) };
  });

  flags.forEach((ctg) => {
    const ctgName = Object.keys(ctg)[0];
    const item = document.querySelector(`#collections > #${ctgName}`);
    const ctgContainers = document.querySelectorAll(`body > .${ctgName}`);
    if (!ctg[ctgName]) {
      item.style.textDecoration = "line-through";
      ctgContainers.forEach((div) => (div.style.display = "none"));
    } else {
      item.style.textDecoration = "";
      ctgContainers.forEach((div) => (div.style.display = ""));
    }
  });

  if (localStorage.getItem("mode") == "collection") {
    renderViewMode();
  }
}

export function renderViewMode() {
  const mode = localStorage.getItem("mode");
  // TODO: рефакторінг (створити окремі методи)
  if (mode == "collection") {
    const collection = localStorage.getItem("collection").split(",");
    const allNodes = document.querySelectorAll("body > div");
    allNodes.forEach((cat) => {
      const contentElements = Array.from(
        cat.querySelectorAll("#content > div"),
      );
      const items = contentElements.map((div) => div.classList[1]);
      const any = collection.filter((item) => items.includes(item));
      const contentCount = cat.querySelectorAll("#content > div").length;
      if (any[0] != undefined) {
        const toHide = contentElements.filter((element) =>
          any.includes(element.classList[1]),
        );
        if (contentCount == toHide.length) {
          document.body.querySelector(`#${cat.id}`).style.display = "none";
        }
        toHide.map((e) => (e.style.display = "none"));
      }
    });
  }

  if (mode == "all") {
    const allNodes = document.querySelectorAll("body > div");

    allNodes.forEach((cat) => {
      cat.style.display = "";

      Array.from(cat.querySelectorAll("#content > div")).map(
        (item) => (item.style.display = ""),
      );
    });
  }
}

function renderModeSwitcher() {
  const mode = localStorage.getItem("mode");

  switch (mode) {
    case "all":
      document.querySelector("#mode").innerText = "Out of Collection";
      break;
    case "collection":
      document.querySelector("#mode").innerText = "Collection Item";
      break;
  }
}

function insertElementsToHtml(data) {
  const itemTemplate = document.getElementById("item-template");
  const categoryTemplate = document.getElementById("category-template");

  const collectionName = Object.keys(data)[0];
  const collection = data[collectionName];

  const categories = Object.keys(collection);
  categories.forEach((category) => {
    const categoryName = Object.keys(collection[category])[0];

    const classClone = categoryTemplate.content.cloneNode(true);
    const container = classClone.getElementById("content");

    classClone.querySelector("h1").innerHTML = categoryName;

    const itemList = collection[category][categoryName];
    itemList.forEach((item) => {
      const itemElement = itemTemplate.content.cloneNode(true);

      const itemName = item.Name.toLowerCase().replace(/ /g, "-");

      itemElement.querySelector("img").src = item.Image;
      itemElement.querySelector("img").alt = itemName.toLowerCase();
      itemElement.querySelector(".title").innerText = item.Name;
      itemElement.querySelector("a").href = `${WIKI_DOMAIN}/${itemName}`;
      itemElement.querySelector("#drop").innerText = item.Availability;

      //!РЕФАКТОРІНГ!
      const collection = localStorage.getItem("collection");
      const upgrade = localStorage.getItem("upgrade");

      const collectionIsEmpty =
        (typeof collection !== "undefined") & (collection !== null);
      const upgradeIsEmpty =
        (typeof upgrade !== "undefined") & (upgrade !== null);

      const isCollected =
        collectionIsEmpty && collection.split(",").includes(itemName);
      const isUpgraded =
        collectionIsEmpty &&
        upgradeIsEmpty &&
        upgrade.split(",").includes(itemName);

      {
        let button = itemElement.querySelector(".collection");
        if (isCollected) {
          button.classList.add("collected");
          button.innerText = "Remove";
        } else {
          button.classList.add("missed");
          button.innerText = "Add to Collection";
        }
      }

      {
        let button = itemElement.querySelector(".upgrade");
        if (isUpgraded) {
          button.classList.add("upgraded");
          button.innerText = "Downgrade";
        } else {
          button.classList.add("common");
          button.innerText = "Upgrade";
        }
      }
      //!ДО СЮДА РЕФАКТОРІНГ!

      const elementContainer = document.createElement("div");
      elementContainer.classList.add("item");
      elementContainer.classList.add(`${itemName}`);
      elementContainer.appendChild(itemElement);

      container.appendChild(elementContainer);
    });
    const elementContainer = document.createElement("div");
    elementContainer.id = `${categoryName.toLowerCase().replace(/ /g, "_").replaceAll(/[()]/g, "")}`;
    elementContainer.classList.add(collectionName);
    elementContainer.appendChild(classClone);
    document.body.appendChild(elementContainer);
  });
}

function localStorageIsEmpty(name) {
  const collection = localStorage.getItem(name);
  return typeof collection === "undefined" || collection === null;
}
