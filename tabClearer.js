import WhiteListManager from "./WhiteListManager.js";

const tabs = await chrome.tabs.query({
  url: [
    "https://*/*",
  ]
});

let currentTabs = async () => {
  return await chrome.tabs.query({ url: ["https://*/*"] });
}

let myActiveTab = async () => {
  return await chrome.tabs.query(
    { active: true, currentWindow: true }
  )
}

let myStgManager = new WhiteListManager();
const domainRegex = new RegExp("https*:\/\/[a-z0-9.)]+")


const addBtn = document.getElementById("addBtn");
const removeBtn = document.getElementById("removeBtn");
const printBtn = document.getElementById("printBtn");
const clearBtn = document.getElementById("clearBtn");

function onClearTabs() {
  console.log("Tabs cleared!");
}

function onClearError(error) {
  console.error(error);
}

addBtn.addEventListener("click", () => {
  myActiveTab().then((tab) => {
    try {
      let result = domainRegex.exec(tab[0].url);
      myStgManager.addToWhiteList(result[0]);
    } catch (error) {
      console.log("Action not allowed");
    }
  })
});

removeBtn.addEventListener("click", () => {
  myActiveTab().then((tab) => {
    try {
      let result = domainRegex.exec(tab[0].url);
      myStgManager.removeFromWhiteList(result[0]);
    } catch (error) {
      console.log("Action not allowed");
    }
  })
});

printBtn.addEventListener("click", () => {
  //myStgManager.printToConsole();
  let whiteListItems = myStgManager.getWhiteList();
  let domListElement = document.getElementById("listaTabs");
  domListElement.replaceChildren();
  whiteListItems.forEach((e, index) => {
    let node = document.createElement("li");
    node.setAttribute("id", `tab${index}`)
    node.append(e)
    domListElement.appendChild(node);
  })
});

clearBtn.addEventListener("click", () => {
  let tabsToSave = myStgManager.getWhiteList();
  let idsToRemove = []
  currentTabs().then((tabList) => {
    tabList.forEach((tab) => {
      let result = domainRegex.exec(tab.url);
      if (tabsToSave.indexOf(result[0]) < 0) {
        idsToRemove.push(tab.id);
        console.log(`Removing ${result[0]}`);
      }
    });
    let removing = chrome.tabs.remove(idsToRemove, onClearTabs)
  }
  )
});
