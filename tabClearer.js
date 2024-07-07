import WhiteListManager from "./WhiteListManager.js";

let currentTabs = async () => { return await chrome.tabs.query({ url: ["https://*/*"] })};
let myActiveTab = async () => { return await chrome.tabs.query({active: true, currentWindow: true })};
let myStgManager = new WhiteListManager();
let toggleState = "false";
const domainRegex = new RegExp("https*:\/\/[a-z0-9.)]+")
const addBtn = document.getElementById("addBtn");
const removeBtn = document.getElementById("removeBtn");
const printBtn = document.getElementById("printBtn");
const clearBtn = document.getElementById("clearBtn");
const showToggle = document.getElementById("showToggle");
const domListElement = document.getElementById("listaTabs");
const TOOGLE_ID = "toggle";

if(localStorage.getItem(TOOGLE_ID) != null){
  InitializeToggle()
}else{
  createToggleState(TOOGLE_ID)
}

showListAtPopUp();

function onClearTabs() {
}

function onClearError(error) {
  console.error(error);
}

function populateList() {
  let whiteListItems = myStgManager.getWhiteList();
  domListElement.replaceChildren();
  whiteListItems.forEach((e, index) => {
    let node = document.createElement("li");
    node.setAttribute("id", `tab${index}`)
    node.append(e)
    domListElement.appendChild(node);
  })
}

function createToggleState(){
  localStorage.setItem(TOOGLE_ID,"false")
}

function getToggleState(){
  return localStorage.getItem(TOOGLE_ID) == "true";
}

function InitializeToggle(){
  toggleState = localStorage.getItem(TOOGLE_ID);
}

function updateToggleState(value){
  localStorage.setItem(TOOGLE_ID,value)
  toggleState = value;
}

function showListAtPopUp(){
  populateList();
  if(toggleState == "true"){
    showToggle.checked = true;
    updateToggleState("true");
    domListElement.style.display = "block";
  }else{
    domListElement.style.display = "none";
    updateToggleState("false")
  }
}

addBtn.addEventListener("click", () => {
  myActiveTab().then((tab) => {
    try {
      let result = domainRegex.exec(tab[0].url);
      myStgManager.addToWhiteList(result[0]);
      if(toggleState == "true"){
        populateList();
      }
    } catch (error) {
      console.error("Action not allowed");
    }
  })
});

removeBtn.addEventListener("click", () => {
  myActiveTab().then((tab) => {
    try {
      let result = domainRegex.exec(tab[0].url);
      myStgManager.removeFromWhiteList(result[0]);
      if(toggleState == "true"){
        populateList();
      }
    } catch (error) {
      console.log("Action not allowed");
    }
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
      }
    });
    let removing = chrome.tabs.remove(idsToRemove, onClearTabs)
  }
  )
});

showToggle.addEventListener("click", ()=>{
  populateList();
  if(showToggle.checked == true){
    domListElement.style.display = "block"
    updateToggleState("true")
  }else{
    domListElement.style.display = "none";
    updateToggleState("false")
  }
})

