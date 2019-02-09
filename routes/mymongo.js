var mongojs = require('mongojs');

var db = mongojs ('localhost:27017/items', ['items']);

function note (note, notedate) {
  this.note = note;
  this.notedate= notedate;
};

module.exports = {db, note};