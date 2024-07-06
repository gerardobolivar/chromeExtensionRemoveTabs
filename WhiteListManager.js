export default class WhiteListManager{
  whiteList;
  id;
  constructor(){
    this.whiteList = new Array();
    this.id = "whiteList";
    if(localStorage.getItem(this.id) != null){this.InitializeList()}
    else{this.CreateWhiteList(this.id)}
  }

  addToWhiteList(element){
    if(this.whiteList.indexOf(element) < 0){
      this.whiteList.push(element);
      this.UpdateWhiteList(this.whiteList);
      console.log(`${element} added.`);
    }else{
      console.log(`${element} already added.`);
    }
  }

  removeFromWhiteList(element){
    if(this.whiteList.indexOf(element) >=0){
      let newList = [];
      this.whiteList.forEach((domain)=>{
        if(domain != element){
          newList.push(domain);
        }
      })
      this.whiteList = newList;
      this.UpdateWhiteList(this.whiteList);
      console.log(`${element} removed.`);
    }
  }

  printToConsole(){
    if(this.whiteList.length < 1 ){
      console.log("No elements in List.")
    }
    else{
      this.whiteList.forEach(element => {
        console.log(element);
      });
    }
  }


  CreateWhiteList(key){
    localStorage.setItem(key, new Array());  
  }

  UpdateWhiteList(whiteList){
    localStorage.setItem(this.id,whiteList);
  }

  getWhiteList(){
    return this.whiteList;
  }

  InitializeList(){
    console.log("Initializing list");
    let storageWhiteList = localStorage.getItem(this.id).split(",")
    console.log(storageWhiteList);
    if(storageWhiteList.length > 0 && storageWhiteList[0] != ""){
      storageWhiteList.forEach((element) =>{
        this.whiteList.push(element);
      })
    }
  }
}