/* TODO: Закончить писать о Github


на строке 145 используется еще не вставленная функция
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


//   1. Получить ключивое слово из кнопки
//   2. Создание начального индекса ключа
//   3. создание массива для уже созданных ключей
//   4. Получить доступ к контейнеру утверждений с помощью созданной для этого функции.
//   5. Получить в массив все имеющиеся ключи и циклируя найти свободный для нового ключа идентификатор.
//   6. Запускается функция. которая получает необходимые данные для создания инфраструктуры утверждения, включая ключ.
//   7. По-моему лишний вызов функции доступа к контейнеру утверждений.
//   8. присвоение контейнеру новой инфраструктуры утверждения.

// Запускается функция создающая инфраструктуру и получающая ключ в качестве атрибута.
// Внутри этой функции вызывается getContainer(event) для получения доступа к контейнеру

// Посмотреть по колличеству времени получения или сохранения данных. Сначало сохраняя все ключи в качестве свойств localStorage, а затем структурируя по отдельным объектам внутри localStorage.
// Посмотреть об инкапсуляции и модуляризации. 

const observer = (function() {
  const events = {},
  subscribe = (eventName, handler) => {
    if (!events.hasOwnProperty(eventName)) {
      events[eventName] = [];
    }
    if (events[eventName].includes(handler)) {
      throw new Error('That event already has handler by the name');
    }
    events[eventName].push(handler);
  },
  unsubscribe = (eventName, handler) => {
    if (events.hasOwnProperty(eventName)) {
      if (handler !== undefined) {
        if (events[eventName].includes(handler)) {
          events[eventName] = events[eventName].filter((fn) => fn !== handler);
        } else {
          throw new Error('Please enter a valid handler name');
        }        
      } else {
        delete events[eventName];
      }
    } else {
      throw new Error('There isn\'t event by the name');
    }
  },
  // The second argument of publish is array, that inside of every event handler will be destructured
  publish = (eventName, ...arguments) => {
    if (events.hasOwnProperty(eventName)) {
      if (events[eventName].length === 0) {
        throw new Error('That event has\'t a single handler')
      }
      events[eventName].forEach((handler) => {
        handler(arguments);
      });
    } else {
      throw new Error('There isn\'t event by that name');
    }
  }
  return {
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    publish: publish
  }
})();



/ --- Model --- /

class Model {
  add(element) {
    this.descripts.push(element);
    observer.publish('model.element.added', element);
  }
  removed(element) {
    const length = this.descripts.length;
    let i = 0;
    for (; i < length; i++) {
      if (this.descripts[i] === element) {
        this.descripts.splice(i, 1);
        observer.publish('model.element.removed', element);
        break;
      }
    }
  }
  // To find appropriate key for new statement
  getAppropKey(keyWord) {    
      let identifIndex = 1;
      const allExistKeys = [],
      // Get all created statements keys
      statementContainer = document.getElementById(keyWord),
      createdStatements = statementContainer.querySelectorAll("[data-point]");
      if (createdStatements.length !== 0) {
        createdStatements.forEach(function (item, index) {
          allExistKeys[index] = item.getAttribute("data-point");
        });
        // Loop through collection to find which certain keyword with certain index still isn't
        while (allExistKeys.includes(keyWord + "_" + identifIndex)) {
          identifIndex++;
        }
      }
      const key = keyWord + "_" + identifIndex;
      observer.publish('model.new-item.creation', 'p', 'span', 'button', key);
    }
    saveLocally(event) {
      const editEl = event.target,
      key = editEl.getAttribute("data-point"),
      content = editEl.innerHTML;
      localStorage.setItem(key, content);
    }
  }

/ --- Section views --- /
// TODO: Can I create one view for all static interface?
class SectionView {
  // I don't create views, but work with them and therefore create class for them
  constructor(sectionTopic) {
    this.pointCreateButton = document.querySelector(`[data-containerPurpose=${sectionTopic}]`);
    this.statementContainer = document.getElementById(`${sectionTopic}`); //FIXME may be the statementContainer is not necessary
  }
  // This method launch Controller. There data is transferred to it for displaing. TODO: Optimisation of all render methods in one
  // TODO: Is it works for repaie Items after restart 
  render(data) {

  }
  createItem(data) {
    const [blockTag, textTag, deleteBut, keyWord, content] = data;
    const wrapper = document.createElement(blockTag),
      editEl = document.createElement(textTag),
      buttonToDelete = document.createElement(deleteBut);
    // Add arguments and events
    editEl.setAttribute("contenteditable", "true");
    editEl.setAttribute("data-point", keyWord);
    // TODO: apparently needs to be transferred to bindEvents
    editEl.addEventListener("click", this.delDefaultText);
    editEl.addEventListener("blur", function(event) {
      observer.publish('save.key-statement.localStorage');
    });
    if (content === undefined) {
      editEl.innerHTML = "Write new statement";
    } else {
      editEl.innerHTML = content;
    }
    buttonToDelete.innerHTML = "x";
    // TODO: apparently needs to be transferred to bindEvents
    buttonToDelete.addEventListener("click", toDeleteBlock); // change?
    wrapper.appendChild(editEl);
    wrapper.appendChild(delBut);
    return wrapper;
  }
  bindEvents() {
    const that = this;
    this.pointCreateButton.addEventListener('click', function(event) {
      const keyWord = event.target.getAttribute("data-containerPurpose");
      // here need to be getKeys called from observer
      observer.publish('view.key.getting', keyWord);
    });
    observer.subscribe('model.new-item.creation', function(data) {
      that.createItem(data);
    });
  }
  // TODO: if I will not type original text the default will save in local?
  delDefaultText(event) {
    this.innerHTML = '';
  }
}


/ --- Controller --- /
class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
  bindEvents() {
    const that = this;
    // TODO: why to create annonim function with controller method with model method and not model at the first onset?
    observer.subscribe('view.key.getting', function(keyWord) {
      that.getKey(keyWord);
  });
  observer.subscribe('save.key-statement.localStorage', function(event) {
    that.saveInLocalStorage(event);
  })
}
// TODO: Why don't execute model funtion directly?
  getKey(keyWord) {
    this.model.getAppropKey(keyWord);
  }
  saveInLocalStorage(event) {
    this.model.saveLocally(event)
  }
}

const statementModel = new Model(),
statementView = new SectionView('strategy'),
statementController = new Controller(statementModel, statementView);
statementController.bindEvents();

statementView.bindEvents();







