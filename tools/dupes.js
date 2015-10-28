'use strict';

const mongoose = require('mongoose');
const connection = mongoose.connect(process.env.DBPATH);
const Track = require('../lib/models/track');

Track.aggregate({
    $group: {
      _id: {
        user: '$user',
        spotify_id: '$spotify_id'
      },
      uniqueIds: {
        $addToSet: '$_id'
      },
      count: {
        $sum: 1
      }
    }
  })
  .match({
    count: {
      $gt: 1
    }
  })
  .sort({
    count: -1
  })
  .exec(function (err, docs) {
    if (err) {
      return console.error(err);
    }

    let duplicates = docs.map(function (doc) {
      doc.uniqueIds.shift();

      return doc.uniqueIds.map(function (d) {
        return { _id: d };
      });
    });

    if (!duplicates.length) {
      process.exit(0);
    }

    let flattened = duplicates.reduce(function (a, b) {
      return a.concat(b);
    });

    Track.remove({_id: { $in: flattened }}, function (err) {
      if (err) {
        return console.error(err);
      }

      console.log('Duplicates removed');
    });
  });
