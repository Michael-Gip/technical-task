class StatementsModule {
  save(key, description) {

  }
  delete(key) {

  }
  // to get all existing identifiers of certain  key word
  getIdentifsByKeyword(keyword) {
    const keywordPattern = RegExp(keyword),
    identifIndexes = [];
    let index = 0;
    for (key in localStorage) {
      // also outputs few built-in fields that we don’t need. So we need to filter them
      if (localStorage.hasOwnProperty(key) && keywordPattern.test(key)) {
        identifIndexes[index] = Number(/\d+/.exec(key));
        index++;
      }
    }
    identifIndexes.sort(function (a, b) {
      return a - b;
    });
    return identifIndexes;
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