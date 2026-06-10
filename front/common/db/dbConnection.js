const knex = require('knex');

const dbConfing = {
    client: _props.CORES.DB.CLIENT,
    connection: {
        host: _props.CORES.DB.HOST,
        port: _props.CORES.DB.PORT,
        user: _props.CORES.DB.USER,
        password: _props.CORES.DB.PASSWORD,
        database: _props.CORES.DB.DATABASE,
        charset: 'utf8mb4',
        timezone: "Asia/Seoul"
    },
    pool: {
        min: _props.CORES.DB.POOL.MIN,
        max: _props.CORES.DB.POOL.MAX
    }
};

exports.dbConfing = knex(dbConfing);