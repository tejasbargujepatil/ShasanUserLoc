// // db.js
// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'tejas',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'Suhana7136',
//   port: 5432,
// });

// module.exports = pool;

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Render PostgreSQL
  },
});

module.exports = pool;
