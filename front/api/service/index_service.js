const connectionManager = require(_base + '/common/db/connectionManager.js');

const indexModule = require(_base + "/api/modules/index_module.js");

exports.getLoginCheck = (req) => {
    return new Promise(async (resolve, reject) => {
        let result = {};
        let connection;
        try {
            let user_id = req.body.user_id;
            let user_pw = req.body.user_pw;

            connection = await connectionManager.getConnection({ readOnly: true });
            let user = await indexModule.selectUserLoginCheck(connection, { user_id: user_id, user_pw: user_pw });

            console.log(user[0].user_no)

            

            resolve(result);
        } catch (error) {
            console.log("getOrders : ", error);
            reject(error); // <- 여기 수정
        }
    });
};