let bookmarks = [];
let adding = false;
let error = null;
let filter = 3;

const findById = function (id) {
  return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
};

const addBookmark = function (bookmark) {
  let newBookmark = {
    id: bookmark.id,
    title: bookmark.title,
    rating: bookmark.rating,
    url: bookmark.url,
    description: bookmark.desc,
    expanded: false
  };
  this.bookmarks.push(newBookmark);
};

const toggleAdding = function () {
  this.adding = !this.adding;
};

const toggleExpanded = function (id){
  let currentBookmark = this.findById(id);
  currentBookmark.expanded = !currentBookmark.expanded;
};

const findAndUpdate = function (id, newData) {
  const currentBookmark = this.findById(id);
  Object.assign(currentBookmark, newData);
};

const findAndDelete = function (id) {
  this.bookmarks = this.bookmarks.filter(currentBookmark => currentBookmark.id !== id);
};

const updateFilter = function(newFilterValue) {
  this.filter = newFilterValue;
};

const getURL = function(id) {
  let currentBookmark = this.findById(id);
  return currentBookmark.url;
};

const resetExpandedBookmarks = function() {
  this.bookmarks = this.bookmarks.map(function(bookmark) {
    bookmark.expanded = false;
    return bookmark;
  });
};

const resetFilter = function() {
  this.updateFilter('');
};

const setError = function (err) {
  this.error = err;
};

export default {
  bookmarks,
  adding,
  error,
  filter,
  findById,
  toggleAdding,
  toggleExpanded,
  findAndDelete,
  addBookmark,
  updateFilter,
  resetFilter,
  resetExpandedBookmarks,
  setError,
  getURL,
  findAndUpdate
};