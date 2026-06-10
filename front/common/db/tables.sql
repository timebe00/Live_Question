-- ==========================
-- 유저
-- ==========================
CREATE TABLE tb_user (
    user_no BIGINT AUTO_INCREMENT PRIMARY key COMMENT '회원 번호',
    user_id VARCHAR(50) NOT NULL unique COMMENT '아이디',
    user_pw VARCHAR(1000) NOT null COMMENT '비밀번호',
    user_role VARCHAR(20) NOT NULL DEFAULT '01' COMMENT '권한',
    reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일',
    upd_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일'
) COMMENT = '회원 정보'
;

-- ==========================
-- 문제 마스터
-- ==========================
CREATE TABLE tb_question_master (
    master_no BIGINT AUTO_INCREMENT PRIMARY key COMMENT '문제 마스터 번호',
    title VARCHAR(500) NOT null COMMENT '문제 마스터 제목',
    use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '사용 여부',
    reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일',
    upd_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일'
) COMMENT = '문제 마스터';

-- ==========================
-- 문제 내용
-- ==========================
CREATE TABLE tb_question (
    question_no BIGINT AUTO_INCREMENT PRIMARY key COMMENT '문제 번호',
    master_no BIGINT NOT null COMMENT '문제 마스터 번호',
    seq INT NOT null COMMENT '문제 순서',
    content TEXT NOT null COMMENT '문제 내용',
    use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '사용 여부',
    answer VARCHAR(1000) COMMENT '답안',

    reg_user bigint COMMENT '등록자',
    reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일',

    upd_user bigint COMMENT '수정자',
    upd_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',

    CONSTRAINT fk_question_master
        FOREIGN KEY (master_no)
        REFERENCES tb_question_master(master_no)
) COMMENT = '문제 내용';

-- ==========================
-- 문제 문항
-- ==========================
CREATE TABLE tb_question_item (
    item_no BIGINT AUTO_INCREMENT PRIMARY key COMMENT '문제 문항 번호',
    question_no BIGINT NOT null COMMENT '문제 번호',
    content VARCHAR(1000) NOT null COMMENT '문제 내용',
    use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '사용 여부',
    reg_user bigint COMMENT '등록자',

    CONSTRAINT fk_item_question
        FOREIGN KEY (question_no)
        REFERENCES tb_question(question_no)
) COMMENT = '문제 문항';

-- ==========================
-- 입력값
-- ==========================
CREATE TABLE tb_answer (
    answer_no BIGINT AUTO_INCREMENT PRIMARY key COMMENT '답안 번호',
    question_no BIGINT NOT null COMMENT '문제 번호',
    uuid VARCHAR(50) NOT null COMMENT '입력자 uuid',
    answer TEXT COMMENT '입력 답안',
    use_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '사용 여부',
    reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일',

    CONSTRAINT fk_answer_question
        FOREIGN KEY (question_no)
        REFERENCES tb_question(question_no)
) COMMENT = '입력값';