// Creation statement module
const newPoint = (function() {
  const _counter = 0;
  function elCreation(tagName, keyWord, child1, child2) {
    const el = document.createElement(tagName),
    editEl = document.createElement(child1);
    editEl.setAttribute("contenteditable", "true");
    editEl.addEventListener("blur", storeContent);
    if (child2) {
      var delBut = document.createElement(child2);
      delBut.setAttribute("class", "deleteStatement");
      delBut.innerHTML = "x";
    }
    el.appendChild(editEl);
    el.appendChild(delBut);
    return el;
  }



})();


