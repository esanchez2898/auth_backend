const knex = require('knex');
const dotenv = require('dotenv');

dotenv.config();

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.HOST,
        user: process.env.USERDB,
        password: process.env.PW,
        database: process.env.DB,
        ssl: true 
    }
});

module.exports = db;
