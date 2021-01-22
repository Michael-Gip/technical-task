/* New statment block creation */
const newBlock = (function () {
  // html structure creation
  function toCreateBlock(block, editable, toDelete, keyWord, content) {
    const wrapper = document.createElement(block),
      editEl = document.createElement(editable),
      delBut = document.createElement(toDelete);
    // Add arguments and events
    editEl.setAttribute("contenteditable", "true");
    editEl.setAttribute("data-point", keyWord);
    editEl.addEventListener("click", delDefaultText);
    editEl.addEventListener("blur", storeContent);
    if (content === undefined) {
      editEl.innerHTML = "Write new statement";
    } else {
      editEl.innerHTML = content;
    }
    delBut.innerHTML = "x";
    delBut.addEventListener("click", toDeleteBlock);
    wrapper.appendChild(editEl);
    wrapper.appendChild(delBut);
    return wrapper;
  }
  //To search appropriate key for new statement
  function getAppropKey(event) {
    const eventEl = event.target,
      keyWord = eventEl.getAttribute("data-containerPurpose")
    let identifIndex = 1;
    allExistKeys = [];
    // Get access to statement container
    statementContain = getContainer(event);
    // Get all created statements keys
    const createdStatements = statementContain.querySelectorAll("[data-point]");
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
  // To get all keys with certain keyword from localStorage
  function getAppropKeys(keyWord) {
    const identifier = RegExp(keyWord),
      identifIndexes = [];
    let index = 0;
    for (key in localStorage) {
      if (localStorage.hasOwnProperty(key) && identifier.test(key)) {
        identifIndexes[index] = Number(/\d+/.exec(key));
        index++;
      }
    }
    identifIndexes.sort(function(a, b) {
      return a-b;
    });
    return identifIndexes;
  }
  // To get access to necessary container
  function getContainer(accessToButton) {
    if (typeof accessToButton === "object") {
      var currentBut = accessToButton.target;
    } else {
      var currentBut = document.querySelector("[data-containerPurpose = " + accessToButton + "]");
    }
    currentSection = currentBut.closest(".layer"),
      container = currentSection.querySelector(".layerDescription");
    return container;
  }
  return {
    toCreateBlock: toCreateBlock,
    getAppropKey: getAppropKey,
    getAppropKeys: getAppropKeys,
    getContainer: getContainer
  }
})();

/* Store and extract localStorage keys */
const storExtStatement = (function () {
  // Store key/content in localStorage
  function storeInLocal(event) {
    const editEl = event.target,
      key = editEl.getAttribute("data-point"),
      content = editEl.innerHTML;
    localStorage.setItem(key, content);
  }
  // Extract all indexes which are in localStorage with a specific keyWord
  return {
    storeInLocal: storeInLocal
  }
})();

/* event adding a new statement */
function addNewBlock(event) {
  const key = newBlock.getAppropKey(event),
    block = newBlock.toCreateBlock("p", "span", "button", key);
  // To find current container
  container = newBlock.getContainer(event);
  container.appendChild(block);
}

/* To delete default text from statement block */
function delDefaultText(event) {
  event.target.innerHTML = "";
}
/* Enter a new statement to save */
function storeContent(event) {
  storExtStatement.storeInLocal(event);
}

/* To delete statement block */
function toDeleteBlock(event) {
  //Get and remove localStorage key
  const block = (event.target).closest("p"),
    editEl = block.querySelector("[data-point]"),
    theKey = editEl.getAttribute("data-point");
  localStorage.removeItem(theKey);
  //Remove block itself
  block.remove();
}

/* Page launch code */
(function () {
  const creatingButs = document.querySelectorAll(".newStatement");
  creatingButs.forEach(function (item) {
    item.addEventListener("click", addNewBlock);
  });
  // Extract all indexis of certain string identifier
  creatingButs.forEach(function (item) {
    const keyWord = item.getAttribute("data-containerPurpose");
    const allIndexes = newBlock.getAppropKeys(keyWord);
    // Re-create existing statements
    if (allIndexes.length !== 0) {
      const container = newBlock.getContainer(keyWord);
      allIndexes.forEach(function (item) {
        const key = keyWord + "_" + item,
          content = localStorage.getItem(key),
          block = newBlock.toCreateBlock("p", "span", "button", key, content);
        container.appendChild(block);
      });
    }
  });
})();



// Recreation of all statment block with certain keyWord

// To find the certain statement container

// Recreate all statements


/* TODO: 
Build method for searching container in newBlock module. About 122, 123 lines to call method for container searching.
module with method for search container
To look logice of exracting indexes and then using them

 */