var express = require('express');
var mongojs = require('mongojs');
var mymongo = require ('./mymongo.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    mymongo.db.items.find({}, function (err, items) {
    res.send(items);
  });
});

router.post ('/', function(req, res, next) {
  var newnote = new mymongo.note(req.body.note, req.body.date);
  mymongo.db.items.save(newnote, function (err,note) {
      if (err) {
           res.status(200).send("error saving note");
      } else {
          res.status(200).send("note saved");
      };
  });
  console.log(req.body.note);
} );

router.get ('/:id', function(req, res, next) {
  
  mymongo.db.items.findOne({_id:mongojs.ObjectId(req.params.id)}, function (err,note) {
      if (err) {
           res.status(200).send("error finding note");
      } else {


        console.log('nasao');
        console.log(note);
        
            res.status(200).send(note);
        };
    });
    
  } );
  
  router.put ('/:id', function(req, res, next) {
    var newnote = new mymongo.note(req.body.note, req.body.date);
    console.log(newnote);
   
    mymongo.db.items.findAndModify(
    {
      query: {_id:mongojs.ObjectId(req.params.id)},
        update: {$set: newnote}
   }
         , function (err,note) {
        if (err) {
             res.status(200).send("error finding note");
        } else {
        console.log('nasao i update');
        console.log(note);
        
            res.status(200).send(note);
        };
    });
  } );
  
  router.delete ('/:id', function(req, res, next) {
    console.log(req.params.id);
    
    mymongo.db.items.remove({_id:mongojs.ObjectId(req.params.id)}, function (err,note) {
        if (err) {
             res.status(200).send("error deleteing note");
        } else {
        console.log('brisan');
        console.log(note);
        
            res.status(200).send("note deleted");
        };
    });
    
  } );
  
  module.exports = router;
  