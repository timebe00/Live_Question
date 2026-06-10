_mybatisMapper.createMapper([_base + '/api/sqlmap/index_sqlmap.xml']);

exports.selectUserLoginCheck = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.selectUserLoginCheck', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}