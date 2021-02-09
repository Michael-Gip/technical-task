class StatementModule {
  save(key, description) {

  }
  delete(key) {

  }
  // Finds appropriate key for a new statement
  getKey(event) {
    const eventEl = event.target,
      keyWord = eventEl.getAttribute("data-containerPurpose");
    let identifIndex = 1;
    allExistKeys = [];
    // Get access to statement container
    statementContainer = observer.publish('model.statement-getContainer', event);
    // Get all created statements keys
    const createdStatements = statementContainer.querySelectorAll("[data-point]");
    if (createdStatements.length !== 0) {
      createdStatements.forEach(function (item, index) {
        allExistKeys[index] = item.getAttribute("data-point");
      });
      // Loop through collection to find which certain keyword with certain index still isn't
      while (allExistKeys.includes(keyWord + "_" + identifIndex)) {
        identifIndex++;
      }
    }
    return keyWord + "_" + identifIndex;
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
    this.editElement.setAttribute("contenteditable", "true");
    this.delButton.innerHTML = "x";
    // TODO: Don't foget about events
  }
  // Recreating the app after restart
  render() {
    const keyWord = this.section.getAttribute('id'),
      dataModel = observer.publish('view.statement-getIndexes', keyWord);
    dataModel.forEach((keyIndex) => {
      this.sectiion.append(this.createStatement(`${keyWord}_${keyIndex}`));
    });
  }
  bindEvent() {
    const that = this;
    // the creation event of new statement
    const creationButton = this.section.querySelector('[data-containerpurpose]');
    creationButton.addEventListener('click', function (event) {

    })
    this.delButton.addEventListener('click', function () {

    });
    observer.subscribe('model.statement-getContainer', function() {
      that.getContainer(accessToButton);
    });
  }
  // Create structure for statement
  createStatement(key) {
    const container = this.container.cloneNode(false),
      editElement = this.editElement.cloneNode(false),
      delButton = this.delButton.cloneNode(true);
    editElement.setAttribute('data-point', key);
    key === undefined ? editElement.innerHTML = "Write new statement" : editElement.innerHTML = localStorage.getItem(key);
    container.appendChild(editElement).appendChild(delButton);
    return container;
  }
  getContainer(accessToButton) {
    if (typeof accessToButton === "object") {
      const button = accessToButton.target;
    } else {
      var button = document.querySelector("[data-containerPurpose = " + accessToButton + "]");
    }
    const section = button.closest(".layer"),
    container = section.querySelector(".layerDescription");
    return container;
  }
}

// General View
class ParentView {
  constructor(views) {
    this.views = views || [];
  }
  render(dataModel) {
    this.views.forEach((view) => {
      view.render(dataModel);
    })
  }
}


// Application logic
class Controller {
  initialize() {
    this.view.render();
    //  TODO: Don't foget about events
  }
  bindEvent() {
    const that = this;
    observer.subscribe('view.statement-getIndexes', function (keyWord) {
      that.getKeyIndexes(keyWord);
    });
  }
  // My controller itself does not provide data for the views, but allows each render method to get the data using its methods.
  getIndexes(keyWord) {
    this.model.getKeyIndexes(keyWord);
  }
}



// observer.publish('view.statement-key.add', ) -- хорошее имя события, использовать
// TODO переместить скачанные в торрент книгу о паттернах в книги