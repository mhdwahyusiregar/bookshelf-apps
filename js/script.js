const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'book_APPS';

function generateId() {
  return +new Date();
}

function generatebookObject(id, task, author, year, isCompleted) {
  return {
    id,
    task,
    author,
    year,
    isCompleted,
  };
}

function findbook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findbookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makebook(bookObject) {
  const { id, task, author, year, isCompleted } = bookObject;

  const textTitle = document.createElement('h3');
  textTitle.innerText = `Judul Buku : ${task}`;

  const textTAuthor = document.createElement('p');
  textTAuthor.innerText = `Penulis : ${author}`;

  const textYear = document.createElement('p');
  textYear.innerText = `Tahun : ${year}`;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textTAuthor, textYear);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `book-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(id);
    });

    container.append(checkButton);
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function checkButton() {
  const checkBox = document.querySelector('inputBookIsCompleted');
  checkBox.addEventListener('checked', function () {
    if (checkBox == isCompleted) addTaskToCompleted(id);
  });
}

function addbook() {
  const textbook = document.getElementById('title').value;
  const textauthor = document.getElementById('author').value;
  const textyear = document.getElementById('date').value;
  const isCompleted = document.getElementById('inputBookIsCompleted').checked;

  const generatedID = generateId();
  const bookObject = generatebookObject(
    generatedID,
    textbook,
    textauthor,
    textyear,
    isCompleted,
    false,
  );
  books.push(bookObject);
  Swal.fire('Selamat', 'Buku Berhasil Ditambah', 'success');

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(bookId /* HTMLELement */) {
  const bookTarget = findbook(bookId);

  if (bookTarget == null) return;

  Swal.fire('yeeyyyy', 'Buku Selesai Dibaca 😁', 'success');

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(bookId /* HTMLELement */) {
  const bookTarget = findbookIndex(bookId);

  if (bookTarget === -1) return;

  Swal.fire('Selamat', 'buku berhasil dihapus ', 'info');
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(bookId /* HTMLELement */) {
  const bookTarget = findbook(bookId);
  if (bookTarget == null) return;

  Swal.fire('yaahhhh', 'Belum Selesai Dibaca 😓', 'info');

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm /* HTMLFormElement */ = document.getElementById('form');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addbook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedbookList = document.getElementById('books');
  const listCompleted = document.getElementById('completed-books');

  uncompletedbookList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makebook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedbookList.append(bookElement);
    }
  }
});

document
  .getElementById('searchBook')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    const searchBook = document
      .getElementById('searchBookTitle')
      .value.toLowerCase();
    const book_list = document.querySelectorAll('.inner > h3');
    for (book of book_list) {
      if (book.innerText.toLowerCase().includes(searchBook)) {
        book.parentElement.parentElement.style.display = 'block';
      } else {
        book.parentElement.parentElement.style.display = 'none';
      }
    }
  });

document.getElementById('title').focus();
