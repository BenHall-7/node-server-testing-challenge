
exports.up = function(knex) {
  return knex.schema.createTable("jokes", tbl => {
      tbl.increments();
      tbl.text("description").notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("jokes")
};
