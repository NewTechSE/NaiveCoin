import Knex from 'knex';

const dbConnection = {
  client: 'sqlite3',
  connection: {
    filename: './db.sqlite3',
    useNullAsDefault: true,
  },
  pool: {
    min: 2,
    max: 10,
  },
};

export default Knex(dbConnection);
