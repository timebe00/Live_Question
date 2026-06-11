# API 만들기 가이드

이 프로젝트의 API는 **Route → Service → Module → SQLMap** 4단계로 구성됩니다.

```
[클라이언트] → routes/*.js → api/service/*_service.js → api/modules/*_module.js → api/sqlmap/*_sqlmap.xml → DB
```

---

## 디렉터리 구조

| 경로 | 역할 |
|------|------|
| `routes/` | URL 매핑, 요청/응답 처리 |
| `api/service/` | 비즈니스 로직, 파라미터 검증, 트랜잭션 |
| `api/modules/` | SQL 실행 (mybatis-mapper + knex raw) |
| `api/sqlmap/` | SQL 쿼리 정의 (XML) |
| `common/db/connectionManager.js` | DB 연결 / 트랜잭션 |
| `common/common.js` | JWT 인증, 쿠키 관리 |

---

## 1. SQLMap 작성 (`api/sqlmap/index_sqlmap.xml`)

쿼리 ID 형식: `{namespace}.{id}`

```xml
<mapper namespace="index">

    <!-- 조회 -->
    <select id="index.selectMasterList">
        select master_no
             , title
        from tb_question_master
        where use_yn = 'Y'
    </select>

    <!-- 등록 -->
    <insert id="index.insertMaster">
        insert into tb_question_master (title, use_yn, reg_date, upd_date)
        values (#{title}, 'Y', now(), now())
    </insert>

    <!-- 수정 -->
    <update id="index.updateMaster">
        update tb_question_master
           set title = #{title}
             , upd_date = now()
         where master_no = #{master_no}
           and use_yn = 'Y'
    </update>

    <!-- 삭제 (소프트 삭제) -->
    <update id="index.deleteMaster">
        update tb_question_master
           set use_yn = 'N'
             , upd_date = now()
         where master_no = #{master_no}
           and use_yn = 'Y'
    </update>

</mapper>
```

### 파라미터 바인딩

- `#{파라미터명}` 형식으로 바인딩
- Service/Module에서 넘긴 객체 키와 이름을 맞춤

```javascript
// { title: '제목' } → #{title}
// { master_no: 1, title: '제목' } → #{master_no}, #{title}
```

### 컬럼 작성 규칙

- 기본값이 있어도 INSERT 시 컬럼을 명시적으로 작성
- 삭제는 물리 삭제 대신 `use_yn = 'N'` 소프트 삭제 사용

---

## 2. Module 작성 (`api/modules/index_module.js`)

SQLMap의 쿼리를 실행하는 함수를 추가합니다.

```javascript
_mybatisMapper.createMapper([_base + '/api/sqlmap/index_sqlmap.xml']);

exports.selectMasterList = (connection, sqlParamObj) => {
    return new Promise(async (resolve, reject) => {
        try {
            var sql = _mybatisMapper.getStatement('index', 'index.selectMasterList', sqlParamObj);
            console.log(sql);
            let [result] = await connection.raw(sql);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
}
```

### 규칙

| 항목 | 내용 |
|------|------|
| 함수명 | `select*`, `insert*`, `update*`, `delete*` 접두사 |
| 인자 | `(connection, sqlParamObj)` |
| SQL 생성 | `_mybatisMapper.getStatement('index', 'index.쿼리ID', sqlParamObj)` |
| 실행 | `connection.raw(sql)` |
| SELECT 결과 | 배열 반환 (`let [result] = await connection.raw(sql)`) |

---

## 3. Service 작성 (`api/service/index_service.js`)

비즈니스 로직과 DB 트랜잭션을 처리합니다.

### 조회 (readOnly)

```javascript
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
```

### 등록 / 수정 / 삭제 (트랜잭션)

```javascript
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
```

### DB 연결 옵션

| 옵션 | 용도 |
|------|------|
| `{ readOnly: true }` | SELECT 전용 (트랜잭션 없음) |
| `{ readOnly: false }` | INSERT / UPDATE / DELETE (트랜잭션) |

### 트랜잭션 규칙

- 쓰기 작업: `getConnection({ readOnly: false })` → 작업 → `commit()`
- 오류 시: `rollback()` 후 `reject(error)`
- 파라미터 검증은 Service에서 처리

---

## 4. Route 작성 (`routes/index.js`)

Express 라우터에서 Service를 호출합니다.

### JSON API (인증 필요)

```javascript
router.post('/master', common.verifyToken, async function(req, res, next) {
  try {
    let result = await indexService.saveMaster(req);
    res.json({ data: result });
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});
```

### 페이지 렌더링 (인증 필요)

```javascript
router.get('/master', common.verifyToken, async function(req, res, next) {
  try {
    let result = await indexService.getMasterList(req);
    res.render('Master', { masters: result });
  } catch (error) {
    console.log("error", error)
    next(error);
  }
});
```

### 인증 미들웨어

| 미들웨어 | 설명 |
|----------|------|
| `common.verifyToken` | JWT 쿠키 검증, 실패 시 로그인 페이지로 리다이렉트 |
| 없음 | 로그인 등 공개 API |

인증 성공 시 `req.user`에 `{ user_no, user_id }` 저장됩니다.

### 응답 형식

JSON API는 `{ data: result }` 형식으로 통일합니다.

---

## 5. 프론트엔드 호출 (`public/js/common/common.js`)

```javascript
await common.send("/master", "POST", { title })
  .then((response) => response.json())
  .then((res) => {
    if (res.data && res.data.success) {
      location.href = "/master";
    }
  });
```

| 항목 | 내용 |
|------|------|
| `common.send(url, method, params)` | fetch 래퍼 |
| `credentials: 'include'` | 쿠키(JWT) 자동 전송 |
| Content-Type | `application/json` |

---

## API 추가 체크리스트

새 API를 만들 때 아래 순서대로 작업합니다.

1. [ ] `api/sqlmap/index_sqlmap.xml` — SQL 쿼리 추가
2. [ ] `api/modules/index_module.js` — Module 함수 추가
3. [ ] `api/service/index_service.js` — Service 함수 추가 (검증 + 트랜잭션)
4. [ ] `routes/index.js` — Route 추가
5. [ ] `views/*.ejs` 또는 JS — 클라이언트 연동

---

## 실제 구현 예시

### 문제 마스터 등록

| 단계 | 파일 | 내용 |
|------|------|------|
| SQL | `index_sqlmap.xml` | `index.insertMaster` |
| Module | `index_module.js` | `insertMaster()` |
| Service | `index_service.js` | `saveMaster()` |
| Route | `index.js` | `POST /master` |
| View | `Master.ejs` | 저장 버튼 → `common.send("/master", "POST", { title })` |

### 문제 마스터 수정

| Route | Method | Body |
|-------|--------|------|
| `/master` | PUT | `{ master_no, title }` |

### 문제 마스터 삭제

| Route | Method | Body |
|-------|--------|------|
| `/master` | DELETE | `{ master_no }` |

> 마스터 삭제는 `tb_question_master.use_yn = 'N'` 처리만 수행합니다.

### 답안 초기화

| Route | Method | Body |
|-------|--------|------|
| `/master/reset-answers` | POST | `{ master_no }` |

> 해당 마스터 하위 문제의 `tb_answer.use_yn = 'N'` 처리

---

## 에러 처리

- Route의 `catch`에서 `next(error)` 호출
- 인증 실패(`error.code === -99`): 쿠키 삭제 후 `/` 리다이렉트 (`app.js`)
- 그 외: `error.ejs` 렌더링

---

## 참고

- DB 테이블 스키마: `common/db/tables.sql`
- JWT 설정: `config/{환경}/property.js`
- 글로벌 변수: `_base`, `_props`, `_mybatisMapper` (`app.js`에서 설정)
