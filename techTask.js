class DescriptionsModule {
  save(key, description) {

  }
  delete(key) {

  }
  // to get all existing statements identifiers with certain word
  getIdentifsByKeyword(keyword) {
    return localStorage()
  }
}

// View of section elements, statements. 
class sectionItemView {
  // The constructor contain not individual, but common elements for all statements.
  constructor(id) {
    this.section = document.getElementById(id);
    this.container = document.createElement('p');
    this.editElement = document.createElement('span');
    this.delButton = document.createElement('button');
    this.editEl.setAttribute("contenteditable", "true");
    this.delButton.innerHTML = "x";
    // TODO: Don't foget about events
  }
  render() {

  }
}

// Application logic
class Controller {
  
}