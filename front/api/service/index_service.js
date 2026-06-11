const connectionManager = require(_base + '/common/db/connectionManager.js');
const common = require(_base + '/common/common.js');
const indexModule = require(_base + "/api/modules/index_module.js");

exports.getLoginCheck = (req) => {
    return new Promise(async (resolve, reject) => {
        let result = {};
        let connection;
        try {
            let user_id = req.body.user_id;
            let user_pw = req.body.user_pw;

            connection = await connectionManager.getConnection({ readOnly: true });
            let [user] = await indexModule.selectUserLoginCheck(connection, { user_id: user_id, user_pw: user_pw });

            if (user && user.user_no > 0) {
                let tokenPayload = { user_no: user.user_no, user_id: user_id };
                result.accessToken = await common.signAccessToken(tokenPayload);
                result.refreshToken = await common.signRefreshToken(tokenPayload);
                result.user_no = user.user_no;
            }

            resolve(result);
        } catch (error) {
            console.log("getLoginCheck : ", error);
            reject(error);
        }
    });
};

exports.getMasterList = (req) => {
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await connectionManager.getConnection({ readOnly: true });
            let result = await indexModule.selectMasterList(connection, {});
            resolve(result);
        } catch (error) {
            console.log("getMasterList : ", error);
            reject(error);
        }
    });
};

exports.saveMaster = (req) => {
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            let title = (req.body.title || '').trim();
            if (!title) {
                throw new Error('제목을 입력해주세요.');
            }

            connection = await connectionManager.getConnection({ readOnly: false });
            await indexModule.insertMaster(connection, { title: title });
            await connection.commit();

            resolve({ success: true });
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            console.log("saveMaster : ", error);
            reject(error);
        }
    });
};

exports.updateMaster = (req) => {
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            let master_no = req.body.master_no;
            let title = (req.body.title || '').trim();
            if (!master_no) {
                throw new Error('마스터 번호가 없습니다.');
            }
            if (!title) {
                throw new Error('제목을 입력해주세요.');
            }

            connection = await connectionManager.getConnection({ readOnly: false });
            await indexModule.updateMaster(connection, { master_no: master_no, title: title });
            await connection.commit();

            resolve({ success: true });
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            console.log("updateMaster : ", error);
            reject(error);
        }
    });
};

exports.deleteMaster = (req) => {
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            let master_no = req.body.master_no;
            if (!master_no) {
                throw new Error('마스터 번호가 없습니다.');
            }

            connection = await connectionManager.getConnection({ readOnly: false });
            await indexModule.deleteMaster(connection, { master_no: master_no });
            await connection.commit();

            resolve({ success: true });
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            console.log("deleteMaster : ", error);
            reject(error);
        }
    });
};

exports.resetMasterAnswers = (req) => {
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            let master_no = req.body.master_no;
            if (!master_no) {
                throw new Error('마스터 번호가 없습니다.');
            }

            connection = await connectionManager.getConnection({ readOnly: false });
            await indexModule.resetAnswerByMaster(connection, { master_no: master_no });
            await connection.commit();

            resolve({ success: true });
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            console.log("resetMasterAnswers : ", error);
            reject(error);
        }
    });
};
