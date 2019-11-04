/* New statment block creation */
const statementBlock = (function () {
  // html structure creation
  function blockCreat(container, editEl, dataPoint, delBut, content) {
    const block = document.createElement(container),
    elForContent = document.createElement(editEl),
      delButton = document.createElement(delBut);

      elForContent.setAttribute("contenteditable", "true");
      elForContent.setAttribute("data-point", dataPoint);
    if (content === undefined) {
      elForContent.innerHTML = "Написать новое утверждение";
    } else {
      elForContent.innerHTML = content;
    }
    elForContent.addEventListener("click", delDefaultText);
    elForContent.addEventListener("blur", contentStoring);
    delButton.innerHTML = "x";
    delButton.addEventListener("click", delStatementBlock)
    block.appendChild(elForContent);
    block.appendChild(delButton);

    return block;
  }
  // To search appropriate key for new element
  function appropKey(container, editEl, delBut) {
    // Get access to statment container
    const eventPlace = event.target,
      keyWord = eventPlace.getAttribute("data-containerPurpose"),
      section = eventPlace.closest(".layer"),
      statContain = section.querySelector(".layerDescription");
    let index = 1;
    // Get all created statments keys
    const editEls = statContain.querySelectorAll("[data-point]");
    if (editEls.length !== 0) {
      const keys = [];
      editEls.forEach(function (item, index) {
        keys[index] = item.getAttribute("data-point");
      });
      // Loop through array to find which certain keyword with certain index still isn't there
      while (keys.includes(keyWord + "_" + index)) {
        index++;
      }
      // using of private method to create new statment block and output it to page
      const dataPoint = keyWord + "_" + index;
      const newStatBlock = blockCreat(container, editEl, dataPoint, delBut);
      statContain.appendChild(newStatBlock);
    } else {
      const dataPoint = keyWord + "_" + index;
      const newStatBlock = blockCreat(container, editEl, dataPoint, delBut);
      statContain.appendChild(newStatBlock);
    }
  }
  return {
    blockCreat: blockCreat,
    appropKey: appropKey
  }
})();

// For work with localStorage
const storExtractKey = (function () {
  function setKey(event) {
    const key = (event.target).getAttribute("data-point"),
      content = (event.target).innerHTML;
    localStorage.setItem(key, content);
  }
  function getIndexes(keyWord) {
    // Extract all indexes which are in localStorage with a specific keyWord
    const indexes = [];
      let currentCustomStr = new RegExp(keyWord);
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          if (currentCustomStr.test(key)) {
            indexes.push(Number(/\d+/.exec(key)));
          }
        }
      }
    indexes.sort(function(a, b) {
      return a-b;
    });
    return indexes;
  }
  return {
    setKey: setKey,
    getIndexes: getIndexes
  }
})();

// event listener to add a new statement
const createBut = document.querySelectorAll(".newStatement");
createBut.forEach(function (item) {
  item.addEventListener("click", createPoint);
});

function createPoint(event) {
  event.preventDefault();
  statementBlock.appropKey("p", "span", "button");
}
// To delete default text from statement block
function delDefaultText(event) {
  if ((event.target).innerHTML === "Написать новое утверждение") {
    (event.target).innerHTML = "";
  }
}
// To store data in localStorage
function contentStoring(event) {
  storExtractKey.setKey(event);
}

// To delete statement block
function delStatementBlock(event) {
  //Get and remove localStorage key
  const block = (event.target).parentNode,
    editEl = block.querySelector("[data-point]"),
    key = editEl.getAttribute("data-point");
  localStorage.removeItem(key);
  //Remove block itself
  block.remove();
}

// Page state re-creation
(function () {
  //To get values of all possible keys for localStorage
  const creationButs = document.querySelectorAll("[data-containerPurpose]"),
  keysArray = [];
  creationButs.forEach(function (item, index) {
    keysArray[index] = item.getAttribute("data-containerPurpose");
  });
  // Recreation of all statment block with certain keyWord
  keysArray.forEach(function(key, index) {
    // To find the certain statement container
    const theSection = creationButs[index].closest(".layer"),
    theContainer = theSection.querySelector(".layerDescription");
    // Recreate all statements
    const indexes = storExtractKey.getIndexes(key);
    if (indexes.length !== 0) {
      indexes.forEach(function(item, index) {
        const content = localStorage.getItem(key + "_" + item);
        const block = statementBlock.blockCreat("p", "span", key + "_" + item,"button", content);
        theContainer.appendChild(block);
      });
    }
  });
})();


/* TODO: To look logice of exracting indexes and then using them

Read Stefanof modules and write down principles

 */