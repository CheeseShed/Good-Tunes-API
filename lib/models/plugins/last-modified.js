'use strict';

module.exports = function lastModifiedPlugin(schema, options) {
  schema.add({
    created_at: {
      type: Date,
      default: Date.now()
    },
    modified_at: Date
  });

  schema.pre('save', function lastModifiedSchemaPreSave(next) {
    this.modified_at = Date.now();
    next();
  });
};
