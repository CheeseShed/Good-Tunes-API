'use strict';

module.exports = function crudPlugin(schema) {
  schema.static('readAll', function (options, next) {
    return this.find(options.find)
      .select(options.select)
      .populate(options.populate)
      .sort(options.sort)
      .limit(options.limit)
      .skip(options.skip)
      .exec(next);
  });

  schema.static('readOne', function (options, next) {
    return this.findOne(options.query)
      .select(options.select)
      .populate(options.populate)
      .exec(next);
  });
};
