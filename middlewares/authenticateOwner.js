import jwt from "jsonwebtoken";
import { prisma } from '../src/utils/prisma/index.js';

export const authenticateOwner = async (req, res, next) => {
    try {
        const token = req.cookies["token"];
        if (!token) {
            return res.status(401).json({ message: "로그인이 필요합니다." });
        }

        const [tokenType, tokenValue] = token.split(' ');
        if (tokenType !== 'Bearer') {
            res.clearCookie(); // 인증에 실패하였을 경우 Cookie를 삭제합니다.
            return res.status(403).json({
                errorMessage: '전달된 쿠키에서 오류가 발생하였습니다.',
            });
        }

        const { userId, usertype } = jwt.verify(tokenValue, 'Secret Key');
        req.user = { userId, usertype };

        if (usertype !== 'OWNER') {
            return res.status(403).json({ message: '권한이 없습니다.' });
        }

        next();
    } catch (error) {
        res.clearCookie(); // 인증에 실패하였을 경우 Cookie를 삭제합니다.
        console.error(error);
        return res.status(403).json({ errorMessage: '로그인이 필요한 기능입니다.' });
    }
};

export default authenticateOwner;