/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответствует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

// import './cookie.html';

/*
 app - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */

const homeworkContainer = document.querySelector('#app');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

const cookiesArr = getCookies();
let filterVal = '';

updateListTable();

filterNameInput.addEventListener('input', function () {
  filterVal = this.value;
  updateListTable();
});

addButton.addEventListener('click', function () {
  const name = encodeURIComponent(addNameInput.value.trim());
  const value = encodeURIComponent(addValueInput.value.trim());

  if (!name) {
    return;
  }

  document.cookie = `${name}=${value}`;
  cookiesArr.set(name, value);

  updateListTable();
});

listTable.addEventListener('click', (e) => {
  const { role, cookieName } = e.target.dataset;

  if (role === 'cookie-delete') {
    cookiesArr.delete(cookieName);
    document.cookie = `${cookieName}=deleted; max-age=0`;
    updateListTable();
  }
});

function getCookies() {
  return document.cookie
    .split('; ')
    .filter(Boolean)
    .map((cookie) => cookie.match(/^([^=]+)=(.+)/))
    .reduce((obj, [, name, value]) => {
      obj.set(name, value);

      return obj;
    }, new Map());
}

function updateListTable() {
  const fragment = document.createDocumentFragment();
  let total = 0;

  listTable.innerHTML = '';

  for (const [name, value] of cookiesArr) {
    if (
      filterVal &&
      !name.toLowerCase().includes(filterVal.toLowerCase()) &&
      !value.toLowerCase().includes(filterVal.toLowerCase())
    ) {
      continue;
    }

    total++;

    const tr = document.createElement('tr');
    const nameField = document.createElement('td');
    nameField.textContent = name;
    const valueField = document.createElement('td');
    valueField.textContent = value;
    const delField = document.createElement('td');
    const delButton = document.createElement('button');
    delButton.textContent = 'delete this cookie';
    delField.appendChild(delButton);
    delButton.dataset.role = 'cookie-delete';
    delButton.dataset.cookieName = name;
    tr.append(nameField, valueField, delField);
    fragment.append(tr);
  }

  if (total) {
    listTable.parentNode.classList.remove('hidden');
    listTable.append(fragment);
  } else {
    listTable.parentNode.classList.add('hidden');
  }
}
