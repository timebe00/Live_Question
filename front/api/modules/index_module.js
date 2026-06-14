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

exports.selectQuestionListByMaster = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.selectQuestionListByMaster', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.selectQuestionItemListByMaster = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.selectQuestionItemListByMaster', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.selectQuestionCountByMaster = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.selectQuestionCountByMaster', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.selectQuestionByMasterAndNo = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.selectQuestionByMasterAndNo', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.selectFirstQuestionByMaster = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.selectFirstQuestionByMaster', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.selectQuestionItemListByQuestion = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.selectQuestionItemListByQuestion', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.selectPrevQuestionNoByMaster = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.selectPrevQuestionNoByMaster', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.selectNextQuestionNoByMaster = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.selectNextQuestionNoByMaster', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.selectAnswerCountByQuestion = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.selectAnswerCountByQuestion', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.selectAnswerTotalCountByQuestion = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.selectAnswerTotalCountByQuestion', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.selectAnswerByQuestionAndUuid = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.selectAnswerByQuestionAndUuid', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.selectLatestAnswerByUuid = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.selectLatestAnswerByUuid', sqlParamObj);
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

exports.insertAnswer = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.insertAnswer', sqlParamObj);
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

exports.deleteQuestionItemsByMaster = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.deleteQuestionItemsByMaster', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.deleteQuestionsByMaster = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.deleteQuestionsByMaster', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.insertQuestion = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.insertQuestion', sqlParamObj);
                console.log(sql);
                await connection.raw(sql);
                let [rows] = await connection.raw("select LAST_INSERT_ID() as question_no");
                resolve(rows[0].question_no);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.insertQuestionItem = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.insertQuestionItem', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.deleteAnswerByQuestion = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.deleteAnswerByQuestion', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.deleteQuestionItemsByQuestion = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.deleteQuestionItemsByQuestion', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}

exports.deleteQuestion = (connection, sqlParamObj) => {
    return new Promise(
        async (resolve, reject) => {
            try {
                var sql = _mybatisMapper.getStatement('index', 'index.deleteQuestion', sqlParamObj);
                console.log(sql);
                let [result] = await connection.raw(sql);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
    )
}