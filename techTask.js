class StatementModule {
  store(event) {
    const editEl = event.target,
      key = editEl.getAttribute("data-point"),
      content = editEl.innerHTML;
    localStorage.setItem(key, content);
  }
  delete(eventObj) {
    //Get and remove localStorage key
    const container = (eventObj.target).closest("p"),
      key = container.querySelector("[data-point]").getAttribute("data-point");
    localStorage.removeItem(key);
    observer.publish('model.statement-deleted', container);
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
    observer.publish('model.statement-creation', keyWord + "_" + identifIndex);
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
    this.delButton.addEventListener('click', function (eventObj) {
      observer.publish('view.statement-delete', eventObj);
    });
    this.editElement.addEventListener('click', function (eventObj) {
      /* To delete default text from statement block */
      const el = eventObj.target;
      if (el.innerHTML === "Write new statement") {
        el.innerHTML = "";
      }
    });
    this.editElement.addEventListener('blur', function (eventObj) {
      observer.publish('view.statement-store', eventObj);
    });
    observer.subscribe('model.statement-getContainer', function () {
      that.getContainer(accessToButton);
    });
    observer.subscribe('model.statement-creation', function (key) {
      that.createStatement(key);
    });
    observer.subscribe('model.statement-deleted', function (statement) {
      that.deleteStatement(statement);
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
  // To get access to statments container
  getContainer(accessToButton) {
    button = (typeof accessToButton === "object") ? accessToButton.target : document.querySelector("[data-containerPurpose = " + accessToButton + "]");
    const section = button.closest(".layer"),
      container = section.querySelector(".layerDescription");
    return container;
  }
  deleteStatement(statement) {
    statement.remove();
  }
}

// General View
class ParentView {
  constructor(views) {
    this.views = views || [];
  }
  render() {
    this.views.forEach((view) => {
      view.render();
    })
  }
}


// Application logic
class Controller {
  constructor(model, view) {
    // it is not entirely clear why in this case I have a module here
    this.model = model;
    this.view = view;
  }
  initialize() {
    this.view.render();
  }
  bindEvent() {
    const that = this;
    observer.subscribe('view.statement-store', function (eventObj) {
      that.store(eventObj);
    });
    observer.subscribe('view.statement-delete', function (eventObj) {
      that.delete(eventObj);
    });
    observer.subscribe('view.statement-getIndexes', function (keyWord) {
      that.getKeyIndexes(keyWord);
    });
    observer.subscribe('view.statement-getKey', function (event) {
      that.getKey(event);
    });
  }
  getKey(event) {
    this.model.getKey(event);
  }
  // My controller itself does not provide data for the views, but allows each render method to get the data using its methods.
  getKeyIndexes(keyWord) {
    this.model.getKeyIndexes(keyWord);
  }
  store(eventObj) {
    this.model.store(eventObj);
  }
  delete(eventObj) {
    this.model.delete(eventObj);
  }
}


(function () {
  const newStatementButs = document.getElementsByClassName('.newStatement');
  for (let button of newStatementButs) {
    button.addEventListener('click', function (eventObj) {
      // First gets appropriate key by model method, then invokes the creation new statement  method of view as a callback
      eventObj.preventDefault('view.statement-getKey', eventObj);
    });
  }
})();

// TODO переместить скачанные в торрент книгу о паттернах в книги