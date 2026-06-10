const dbConnection = require(_base + '/common/db/dbConnection.js');

let exportObj = {};

/**
 * readOnly : false - transation
 */
exportObj.getConnection = function (dataObj) {
    return new Promise(
        async (resolve, reject) => {
            try {
                let readOnly = dataObj.readOnly || false;
                
                let conn;
                conn = await dbConnection.dbConfing;
                if (!readOnly) {
                    conn = await conn.transaction();
                }
                if (!conn) {
                    throw new Error('DB 연결 오류');
                }
                resolve(conn);

            } catch (error) {
                reject(error);
            }
        }
    )
}

module.exports = exportObj;