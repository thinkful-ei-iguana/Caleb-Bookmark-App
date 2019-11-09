import store from './store.js';
import api from './api.js';


//HTML Generation and Rendering

const generateStars = function(rating) {
  const filledStarUnicode = '&#x2605';
  const emptyStarUnicode = '&#x2606';
  let ratingString = '';
  for (let i = 1; i <= 5; i++) {
    ratingString += (i <= rating) ? filledStarUnicode : emptyStarUnicode;
  }
  return ratingString;
};

const generateBookmarkElement = function(bookmark) {
  let expandedDetails = '';
  if (bookmark.expanded) {
    expandedDetails = `
    <p>${bookmark.description}</p>
    <button class="visit-site">Visit Site</button>
    <button class="delete">Delete</button>`;
  }

  const starRatings = generateStars(bookmark.rating);
  
  //bookmark.rating + ((bookmark.rating === 1) ? ' star' : ' stars');

  return `
    <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
      <h2>${bookmark.title}</h2>
      <div>
        ${expandedDetails}
        <p class="stars">${starRatings}</p>
      </div>
    </li>`;
};

const generateBookmarksString = function(bookmarksList) {
  const bookmarks = bookmarksList.map((bookmark) => generateBookmarkElement(bookmark));
  return bookmarks.join('');
};

const renderBookmarksView = function () {

  let bookmarks = [...store.bookmarks];
  bookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.filter);

  const bookmarksString = generateBookmarksString(bookmarks);

  const bookmarksViewHTML = `
    <div>
      <button class="add-new">ADD BOOKMARK</button>
      <select class="filter" name="filter" id="filter" aria-label="Filter by Minimum Rating">
        <option value="">Filter by Minimum Rating</option>
        <option value="5">>= 5</option>
        <option value="4">>= 4</option>
        <option value="3">>= 3</option>
        <option value="2">>= 2</option>
        <option value="1">>= 1</option>
      </select>
    </div>
    <ul>
      ${bookmarksString}
    </ul>`;

  $('main').html(bookmarksViewHTML);
  $('.filter').val(store.filter);
};

const addBookmarkViewHTML = `
  <h2>Create a Bookmark</h2>
  <form id="create-bookmark" action="#">
    <div>
      <input type="text" id="title" name="title" placeholder="Title" aria-label="title" required>
    </div>
    <div>
      <input type="url" id="url" name="url" placeholder="URL" aria-label="url" required>
    </div>
    <div>
      <textarea id="desc" name="desc" placeholder="Description" aria-label="description" rows="5" required></textarea>
    </div>
    <fieldset class="rating-container">
      <legend>Rate This Bookmark</legend>
      <div>
        <input type="radio" id="rating-5" name="rating" aria-label="rating-5-stars" required value="5"> &#x2605&#x2605&#x2605&#x2605&#x2605
      </div>
      <div>
        <input type="radio" id="rating-4" name="rating" aria-label="rating-4-stars" required value="4"> &#x2605&#x2605&#x2605&#x2605&#x2606
      </div>
      <div>
        <input type="radio" id="rating-3" name="rating" aria-label="rating-3-stars" required value="3"> &#x2605&#x2605&#x2605&#x2606&#x2606
      </div>
      <div>
        <input type="radio" id="rating-2" name="rating" aria-label="rating-2-stars" required value="2"> &#x2605&#x2605&#x2606&#x2606&#x2606
      </div>
      <div>
        <input type="radio" id="rating-1" name="rating" aria-label="rating-1-star" required value="1"> &#x2605&#x2606&#x2606&#x2606&#x2606
      </div>
    </fieldset>
    <div>
      <input type="submit" name="submit" id="submit" class="submit" value="CREATE BOOKMARK">
      <button class="cancel">CANCEL</button>
    </div>
  </form>`;

const renderAddBookmarkView = function() {
  $('main').html(addBookmarkViewHTML);
};

const generateError = function () {
  return `
    <button id="cancel-error">X</button>
    <h3>Oops, there seems to be a slight problem.</h3>
    <p>${store.error}</p>`;
};

const renderError = function() {
  if (store.error) {
    const errorHTML = generateError();
    $('.js-display-error').html(errorHTML);
  } else {
    $('.js-display-error').empty();
  }
};

const handleCloseError = function () {
  $('.js-display-error').on('click', '#cancel-error', () => {
    store.setError(null);
    renderError();
  });
};

const render = function () {
  renderError();

  if (store.adding) {
    renderAddBookmarkView();
  } else {
    renderBookmarksView();
  }
};

//Event Handlers

const handleAddBookmarkClicked = function () {
  $('main').on('click','.add-new',function () {
    store.toggleAdding();
    render();
  });
};

const handleRatingFilterModified = function () {
  $('main').on('change','.filter', function() {
    let newFilterValue = $('.filter').val();
    
    store.updateFilter(newFilterValue);
    render();
  });
};

const getBookmarkIdFromElement = function (bookmark) {
  return $(bookmark)
    .closest('.js-bookmark-element')
    .data('bookmark-id');
};

const handleBookmarkClicked = function () {
  $('main').on('click','li', event => {
    //if( !$(event.target).is('button'))
    const id = getBookmarkIdFromElement(event.currentTarget);
    const bookmark = store.findById(id);
    store.findAndUpdate(id, {expanded: !bookmark.expanded });
    render();    
  });
};

const handleVisitSiteClicked = function () {
  $('main').on('click','.visit-site', event => {
    const id = getBookmarkIdFromElement(event.currentTarget);
    window.location = store.getURL(id);
  });
};

const handleDeleteClicked = function () {
  $('main').on('click','.delete', event => {
    const id = getBookmarkIdFromElement(event.currentTarget);
    
    api.deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch((err) => {
        console.log(err);
        store.setError(err.message);
        renderError();
      });
  });
};

function serializeJson(form) {
  const formData = new FormData(form);
  const o = {};
  formData.forEach((val, name) => o[name] = val);
  return JSON.stringify(o);
}

const handleNewBookmarkSubmitted = function () {
  $('main').on('submit','#create-bookmark', event => {
    event.preventDefault();
    let formElement = $('#create-bookmark')[0];
    let newBookmarkData = serializeJson(formElement);
    
    api.createBookmark(newBookmarkData)
      .then((newBookmark) => {
        store.addBookmark(newBookmark);
        store.toggleAdding();
        store.resetExpandedBookmarks();
        store.resetFilter();
        render();
      })
      .catch((err) => {
        console.log(err);
        store.setError(err.message);
        renderError();
      });
  });
};

const handleCancelClicked = function () {
  $('main').on('click','.cancel',function () {
    store.toggleAdding();
    store.resetExpandedBookmarks();
    store.resetFilter();
    render();
  });
};


const bindEventListeners = function () {
  handleAddBookmarkClicked();
  handleRatingFilterModified();
  handleBookmarkClicked();
  handleVisitSiteClicked();
  handleDeleteClicked();
  handleNewBookmarkSubmitted();
  handleCancelClicked();
  handleCloseError();
};

export default {
  render,
  bindEventListeners
};