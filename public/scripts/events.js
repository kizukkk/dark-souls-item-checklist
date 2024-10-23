import { renderViewMode, renderItemCategory } from "./html.js";

export function addCollectionEvent() {
  document.querySelectorAll(".collection").forEach((button) => {
    button.addEventListener("click", (event) => {
      const container = event.target.closest(".item");
      const weaponName = container.classList[1];
      const collection = localStorage.getItem("collection");
      const upgrade = localStorage.getItem("upgrade");

      const collectionIsEmpty =
        (typeof collection !== "undefined") & (collection !== null);
      const upgradeIsEmpty =
        (typeof upgrade !== "undefined") & (upgrade !== null);

      let newCollection =
        collectionIsEmpty == 0 || collection.split(",")[0] === ""
          ? []
          : collection.split(",");

      const isCollected =
        collectionIsEmpty && collection.split(",").includes(weaponName);

      if (isCollected) {
        button.classList.remove("collected");
        button.classList.add("missed");
        button.innerText = "Add to Collection";

        if (upgradeIsEmpty && upgrade.split(",").includes(weaponName)) {
          let button = container.querySelector(".upgrade");
          button.classList.remove("upgraded");
          button.classList.add("common");
          button.innerText = "Upgrade";

          let newUpgrade = upgrade.split(",");
          newUpgrade = newUpgrade.filter((item) => item != weaponName);
          localStorage.setItem("upgrade", newUpgrade);
        }

        newCollection = newCollection.filter((item) => item != weaponName);
        localStorage.setItem("collection", newCollection);
      } else {
        button.classList.remove("missed");
        button.classList.add("collected");
        button.innerText = "Remove";

        newCollection.push(weaponName);
        localStorage.setItem("collection", newCollection);
      }
    });
  });
}

export function addUpgradEvent() {
  document.querySelectorAll(".upgrade").forEach((button) => {
    button.addEventListener("click", (event) => {
      const container = event.target.closest(".item");
      const weaponName = container.classList[1];

      const collection = localStorage.getItem("collection");
      const upgrade = localStorage.getItem("upgrade");

      const collectionIsEmpty =
        (typeof collection !== "undefined") & (collection !== null);
      const upgradeIsEmpty =
        (typeof upgrade !== "undefined") & (upgrade !== null);

      let newUpgrade =
        upgrade == 0 || upgrade == null ? [] : upgrade.split(",");

      const isInCollection = collection.split(",").includes(weaponName);
      const validStorages =
        collectionIsEmpty && upgradeIsEmpty && isInCollection;
      const isValideUpgrade = validStorages && newUpgrade.includes(weaponName);

      if (isValideUpgrade) {
        button.classList.remove("upgraded");
        button.classList.add("common");
        button.innerText = "Upgrade";

        newUpgrade = newUpgrade.filter((item) => item != weaponName);
        localStorage.setItem("upgrade", newUpgrade);
      } else if (isInCollection) {
        button.classList.remove("common");
        button.classList.add("upgraded");
        button.innerText = "Downgrade";

        newUpgrade.push(weaponName);
        localStorage.setItem("upgrade", newUpgrade);
      }
    });
  });
}

export function addModeSwitchEvent() {
  const switcher = document.querySelector("#mode");
  switcher.addEventListener("click", (event) => {
    const mode = localStorage.getItem("mode");
    switch (mode) {
      case "all":
        document.querySelector("#mode").innerText = "Collection Item";
        localStorage.setItem("mode", "collection");
        break;
      case "collection":
        document.querySelector("#mode").innerText = "Out of Collection";
        localStorage.setItem("mode", "all");
        break;
    }
    renderViewMode();
  });
}

export function addVisibleEvent() {
  const switcher = document.querySelectorAll("#collections > li");
  switcher.forEach((b) =>
    b.addEventListener("click", (event) => {
      const ctgName = event.target.id;
      const status = JSON.parse(localStorage.getItem(ctgName));
      localStorage.setItem(ctgName, !status);

      renderItemCategory();
    }),
  );
}
