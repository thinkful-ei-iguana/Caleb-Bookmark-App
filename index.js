import bookmarkList from './bookmark-list.js';
import store from './store.js';
import api from './api.js';

const main = function () {
  api.getBookmarks()
    .then((bookmarks) => {
      bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
      store.resetExpandedBookmarks();
      store.resetFilter();
      bookmarkList.bindEventListeners();
      bookmarkList.render();
    });
};

$(main);