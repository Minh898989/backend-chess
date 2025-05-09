const { Pool } = require('pg');

const pool = new Pool({
  host: 'dpg-d0f2lr49c44c738kr7ug-a.oregon-postgres.render.com',
  user: 'sql_xi3o_user',
  password: 'sYrD5vTPSuZeJaJaiR6Gm1X4BbtBLjPR',
  database: 'sql_xi3o',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL');
  release();
});

module.exports = pool;
