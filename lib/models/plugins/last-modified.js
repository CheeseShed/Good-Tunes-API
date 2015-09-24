'use strict';

module.exports = function lastModifiedPlugin(schema, options) {
  schema.add({
    modifiedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now()
    }
  });

  schema.pre('save', function lastModifiedSchemaPreSave(next) {
    this.modifiedAt = new Date;
    next();
  });
};
