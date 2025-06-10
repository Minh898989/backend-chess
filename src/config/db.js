const { Pool } = require('pg');

const pool = new Pool({
  host: 'dpg-d13plmogjchc73feck30-a.oregon-postgres.render.com',
  user: 'sql_calc_user',
  password: 'gF6H8xoURWaMTwEVnkCzhzajrZLKNaoZ',
  database: 'sql_calc',
  port: 5432,
  ssl: {
    require: true,               
    rejectUnauthorized: false   
  }
});

pool.connect()
  .then(client => {
    console.log('✅ Connected to PostgreSQL');
    client.release();
  })
  .catch(err => {
    console.error('❌ Connection error', err.stack);
  });

module.exports = pool;
