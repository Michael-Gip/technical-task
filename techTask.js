class StatementModule {
  save(key, description) {

  }
  delete(key) {

  }
  // to get all existing identifiers of certain  key word
  getKeyIndexes(keyword) {
    const keywordPattern = RegExp(keyword),
    keyIndexes = [];
    let index = 0;
    for (key in localStorage) {
      // also outputs few built-in fields that we don’t need. So we need to filter them
      if (localStorage.hasOwnProperty(key) && keywordPattern.test(key)) {
        keyIndexes[index] = Number(/\d+/.exec(key));
        index++;
      }
    }
    keyIndexes.sort(function (a, b) {
      return a - b;
    });
    return keyIndexes;
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
  render(dataModel) {
    const keyWord = this.section.getAttribute('id');
    dataModel.forEach((keyIndex) => {
      this.sectiion.append(this.createStatement(localStorage.getItem(`${keyWord}_${keyIndex}`)));
    });
    // TODO: Don't foget about events
  }
  createStatement() {

  }
}

// Application logic
class Controller {
  initialize() {
    const dataModel = this.model.getKeyIndexes();
    this.view.render(dataModel);
  //  TODO: Don't foget about events
  }
}