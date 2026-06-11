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

exports.selectMasterList = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.selectMasterList', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.insertMaster = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.insertMaster', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.updateMaster = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.updateMaster', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.deleteMaster = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.deleteMaster', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.resetAnswerByMaster = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.resetAnswerByMaster', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}