var folder = process.env.FOLDER || 'C:/Users/Marco/Pictures/2015_10_17';

var fs = require('fs');
var path = require('path');
var async = require('async');

async.waterfall(
  [
    // check folder
    function(callback) {
      fs.stat(folder, function(err, stats) {
        if (err) {
          console.log('fs.stat folder err:', err);
          callback(err);
        } else {
          console.log('stats folder',stats);
          if(stats.isDirectory()) {
            callback(null, folder);
          } else {
            err = new Error('folder is not a directory');
            console.log('fs.stat isDirectory folder err:', err);
            callback(err);
          }
        }
      });
    },
    // take file of folder
    function(folder, callback) {
      fs.readdir(folder, function(err, files) {
        if (err) {
          console.log('fs.readdir folder err:', err);
          callback(err);
        } else {
          console.log('files folder',files);
          callback(null, files);
        }
      });
    },
    // take rename files
    function(files, callback) {
      async.eachSeries(files,
        function(file, callback) {
          file = path.normalize(folder+'/'+file);
          console.log('file', file);
          fs.stat(file, function(err, stats) {
            if (err) {
              console.log('fs.stat file err:', err);
              callback(err);
            } else {
              console.log('stats file',stats);
              if(stats.isFile()) {
                callback(null, folder);
              } else {
                err = new Error('file is not a file');
                console.log('fs.stat isFile file err:', err);
                callback(err);
              }
            }
          });
        },
        function(err, results) {

        }
      );
    }
  ],
  function(err, results) {
    if (err) {
      console.log('FAIL');
    } else {
      console.log('SUCCESS');
    }
  }
);
