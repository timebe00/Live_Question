const jwt = require('jsonwebtoken');

/**
 * JWT 토큰 발급 / 검증 / 쿠키 관리
 *
 * - 액세스 토큰 : API 인증용 (짧은 만료)
 * - 리프레시 토큰 : 액세스 만료 시 재발급용 (긴 만료, 로그인 시에만 발급)
 */
const common = {
    // 액세스 토큰 JWT 문자열 생성
    signAccessToken: async (payload) => {
        return jwt.sign(
            { ...payload, type: 'access' },
            _props.JWT.ACCESS_SECRET,
            { expiresIn: _props.JWT.ACCESS_EXPIRES_IN }
        );
    },
    // 리프레시 토큰 JWT 문자열 생성 (로그인 시에만 사용)
    signRefreshToken: async (payload) => {
        return jwt.sign(
            { ...payload, type: 'refresh' },
            _props.JWT.REFRESH_SECRET,
            { expiresIn: _props.JWT.REFRESH_EXPIRES_IN }
        );
    },
    // 액세스 토큰을 httpOnly 쿠키(question_access)에 저장
    setAccessCookie: (res, accessToken) => {
        res.cookie(_props.JWT.ACCESS_COOKIE_NAME, accessToken, {
            httpOnly: true,
            maxAge: _props.JWT.ACCESS_COOKIE_MAX_AGE,
            path: '/'
        });
    },
    // 리프레시 토큰을 httpOnly 쿠키(question_refresh)에 저장
    setRefreshCookie: (res, refreshToken) => {
        res.cookie(_props.JWT.REFRESH_COOKIE_NAME, refreshToken, {
            httpOnly: true,
            maxAge: _props.JWT.REFRESH_COOKIE_MAX_AGE,
            path: '/'
        });
    },
    // 로그인 성공 시 액세스 + 리프레시 쿠키 한번에 저장
    setLoginCookies: (res, accessToken, refreshToken) => {
        common.setAccessCookie(res, accessToken);
        common.setRefreshCookie(res, refreshToken);
    },
    // 로그아웃 시 액세스 + 리프레시 쿠키 삭제
    clearLoginCookies: (res) => {
        res.clearCookie(_props.JWT.ACCESS_COOKIE_NAME, { path: '/' });
        res.clearCookie(_props.JWT.REFRESH_COOKIE_NAME, { path: '/' });
    },
    // 액세스 토큰 검증 후 payload(user_no, user_id) 반환
    verifyAccessToken: async (token) => {
        let decoded = jwt.verify(token, _props.JWT.ACCESS_SECRET);
        if (decoded.type !== 'access') {
            throw new Error('유효하지 않은 액세스 토큰입니다.');
        }
        return decoded;
    },
    // 리프레시 토큰 검증 후 payload(user_no, user_id) 반환
    verifyRefreshToken: async (token) => {
        let decoded = jwt.verify(token, _props.JWT.REFRESH_SECRET);
        if (decoded.type !== 'refresh') {
            throw new Error('유효하지 않은 리프레시 토큰입니다.');
        }
        return decoded;
    },
    // 쿠키에서 사용자 정보 확인 (실패 시 null)
    resolveUser: async (req, res) => {
        try {
            let accessToken = req.cookies[_props.JWT.ACCESS_COOKIE_NAME];
            if (accessToken) {
                try {
                    return await common.verifyAccessToken(accessToken);
                } catch (error) {
                    // 액세스 토큰 만료
                }
            }

            let refreshToken = req.cookies[_props.JWT.REFRESH_COOKIE_NAME];
            if (!refreshToken) {
                return null;
            }

            let decoded = await common.verifyRefreshToken(refreshToken);
            let newAccessToken = await common.signAccessToken({
                user_no: decoded.user_no,
                user_id: decoded.user_id
            });
            common.setAccessCookie(res, newAccessToken);
            return decoded;
        } catch (error) {
            return null;
        }
    },
    // Express 미들웨어 : 쿠키의 액세스 토큰 검증, 만료 시 리프레시로 재발급
    verifyToken: async (req, res, next) => {
        try {
            req.user = await common.resolveUser(req, res);
            if (!req.user) {
                throw new Error('인증이 필요합니다.');
            }
            next();
        } catch (error) {
            console.log("error", error)
            error.code = -99;
            next(error);
        }
    },
}

module.exports = common;
