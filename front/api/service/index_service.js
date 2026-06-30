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

exports.getQuestionList = (req) => {
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            let master_no = req.params.master_no;
            if (!master_no) {
                throw new Error('마스터 번호가 없습니다.');
            }

            connection = await connectionManager.getConnection({ readOnly: true });
            let questions = await indexModule.selectQuestionListByMaster(connection, { master_no: master_no });
            let items = await indexModule.selectQuestionItemListByMaster(connection, { master_no: master_no });

            let itemMap = {};
            items.forEach(function (item) {
                if (!itemMap[item.question_no]) {
                    itemMap[item.question_no] = [];
                }
                itemMap[item.question_no].push(item);
            });

            questions.forEach(function (question) {
                question.items = itemMap[question.question_no] || [];
            });

            resolve({ questions: questions });
        } catch (error) {
            console.log("getQuestionList : ", error);
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

exports.saveAllQuestions = (req) => {
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            let master_no = req.params.master_no;
            let questions = req.body.questions;
            let reg_user = req.user ? req.user.user_no : null;

            if (!master_no) {
                throw new Error('마스터 번호가 없습니다.');
            }

            if (!Array.isArray(questions)) {
                throw new Error('문제 목록 형식이 올바르지 않습니다.');
            }

            questions.forEach(function (question, index) {
                let content = (question.question || '').trim();
                let options = question.options || [];
                let answer = question.answer;

                if (!content) {
                    throw new Error((index + 1) + '번 문제를 입력해주세요.');
                }

                if (options.length < 1) {
                    throw new Error((index + 1) + '번 문제의 문항은 1개 이상 필요합니다.');
                }

                if (answer === null || answer === undefined || String(answer).trim() === '') {
                    throw new Error((index + 1) + '번 문제의 정답을 입력해주세요.');
                }

                let answerNum = answer;
                if (answerNum === null || answerNum === undefined || String(answerNum).trim() === '') {
                    throw new Error((index + 1) + '번 문제의 정답 번호가 문항 범위를 벗어났습니다.');
                }
            });

            connection = await connectionManager.getConnection({ readOnly: false });
            await indexModule.deleteQuestionItemsByMaster(connection, { master_no: master_no });
            await indexModule.deleteQuestionsByMaster(connection, { master_no: master_no });

            for (let i = 0; i < questions.length; i++) {
                let question = questions[i];
                let question_no = await indexModule.insertQuestion(connection, {
                    master_no: master_no,
                    seq: i + 1,
                    content: (question.question || '').trim(),
                    answer: String(question.answer).trim(),
                    reg_user: reg_user
                });

                for (let j = 0; j < question.options.length; j++) {
                    await indexModule.insertQuestionItem(connection, {
                        question_no: question_no,
                        content: question.options[j] || '',
                        reg_user: reg_user
                    });
                }
            }

            await connection.commit();
            resolve({ success: true });
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            console.log("saveAllQuestions : ", error);
            reject(error);
        }
    });
};

exports.getShowQuestion = (req) => {
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            let master_no = req.params.master_no;
            let question_no = Number(req.params.question_no) || 0;

            if (!master_no) {
                throw new Error('마스터 번호가 없습니다.');
            }

            connection = await connectionManager.getConnection({ readOnly: true });

            let questions;
            if (question_no === 0) {
                questions = await indexModule.selectFirstQuestionByMaster(connection, { master_no: master_no });
            } else {
                questions = await indexModule.selectQuestionByMasterAndNo(connection, {
                    master_no: master_no,
                    question_no: question_no
                });
            }

            let question = questions[0];
            if (!question) {
                throw new Error('문제를 찾을 수 없습니다.');
            }

            question.items = await indexModule.selectQuestionItemListByQuestion(connection, {
                question_no: question.question_no
            });

            let [countRow] = await indexModule.selectQuestionCountByMaster(connection, { master_no: master_no });

            let [prevRow] = await indexModule.selectPrevQuestionNoByMaster(connection, {
                master_no: master_no,
                seq: question.seq
            });
            let [nextRow] = await indexModule.selectNextQuestionNoByMaster(connection, {
                master_no: master_no,
                seq: question.seq
            });

            resolve({
                question: question,
                question_count: countRow ? countRow.question_count : 0,
                prev_question_no: prevRow ? prevRow.question_no : null,
                next_question_no: nextRow ? nextRow.question_no : null
            });
        } catch (error) {
            console.log("getShowQuestion : ", error);
            reject(error);
        }
    });
};

exports.getShowQuestionResult = (req) => {
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            let question_no = req.params.question_no;

            if (!question_no) {
                throw new Error('질문 번호가 없습니다.');
            }

            connection = await connectionManager.getConnection({ readOnly: true });

            let items = await indexModule.selectAnswerCountByQuestion(connection, {
                question_no: question_no
            });

            let totalCount = 0; 
            for(let item of items) { 
                totalCount += Number(item.answer_cnt); 
            }

            resolve({
                items: items,
                total_count: totalCount
            });
        } catch (error) {
            console.log("getShowQuestionResult : ", error);
            reject(error);
        }
    });
};

exports.getAnswerPage = (req) => {
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            let master_no = req.params.master_no;
            let question_no = Number(req.params.question_no) || 0;
            let uuid = req.cookies.user;

            if (!master_no) {
                throw new Error('마스터 번호가 없습니다.');
            }

            if (!uuid) {
                throw new Error('사용자 정보가 없습니다.');
            }

            connection = await connectionManager.getConnection({ readOnly: true });

            let questions;
            if (question_no === 0) {
                questions = await indexModule.selectFirstQuestionByMaster(connection, { master_no: master_no });
            } else {
                questions = await indexModule.selectQuestionByMasterAndNo(connection, {
                    master_no: master_no,
                    question_no: question_no
                });
            }

            let question = questions[0];
            if (!question) {
                throw new Error('문제를 찾을 수 없습니다.');
            }

            let [answerRow] = await indexModule.selectAnswerByQuestionAndUuid(connection, {
                question_no: question.question_no,
                uuid: uuid
            });

            if (answerRow && answerRow.answer_no) {
                resolve({ alreadyAnswered: true });
                return;
            }

            question.items = await indexModule.selectQuestionItemListByQuestion(connection, {
                question_no: question.question_no
            });
            delete question.answer;

            resolve({
                alreadyAnswered: false,
                question: question
            });
        } catch (error) {
            console.log("getAnswerPage : ", error);
            reject(error);
        }
    });
};

exports.saveAnswer = (req) => {
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            let uuid = req.cookies.user;
            let question_no = req.body.question_no;
            let item_no = req.body.item_no;

            if (!uuid) {
                throw new Error('사용자 정보가 없습니다.');
            }

            if (!question_no) {
                throw new Error('문제 번호가 없습니다.');
            }

            if (!item_no) {
                throw new Error('답안을 선택해주세요.');
            }

            connection = await connectionManager.getConnection({ readOnly: false });

            let [answerRow] = await indexModule.selectAnswerByQuestionAndUuid(connection, {
                question_no: question_no,
                uuid: uuid
            });

            if (answerRow && answerRow.answer_no) {
                throw new Error('이미 답안을 제출했습니다.');
            }

            let items = await indexModule.selectQuestionItemListByQuestion(connection, {
                question_no: question_no
            });
            let selectedItem = items.find(function (item) {
                return String(item.item_no) === String(item_no);
            });

            if (!selectedItem) {
                throw new Error('선택한 문항을 찾을 수 없습니다.');
            }

            await indexModule.insertAnswer(connection, {
                question_no: question_no,
                item_no: item_no,
                uuid: uuid,
                answer: String(item_no)
            });

            await connection.commit();
            resolve({ success: true });
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            console.log("saveAnswer : ", error);
            reject(error);
        }
    });
};

exports.deleteQuestion = (req) => {
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            let master_no = req.body.master_no;
            let question_no = req.body.question_no;

            if (!master_no) {
                throw new Error('마스터 번호가 없습니다.');
            }

            if (!question_no) {
                throw new Error('문제 번호가 없습니다.');
            }

            connection = await connectionManager.getConnection({ readOnly: false });
            await indexModule.deleteAnswerByQuestion(connection, { question_no: question_no });
            await indexModule.deleteQuestionItemsByQuestion(connection, { question_no: question_no });
            await indexModule.deleteQuestion(connection, { master_no: master_no, question_no: question_no });
            await connection.commit();

            resolve({ success: true });
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            console.log("deleteQuestion : ", error);
            reject(error);
        }
    });
};
