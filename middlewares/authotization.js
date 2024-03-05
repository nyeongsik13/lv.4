import jwt from 'jsonwebtoken';

export default function (err, req, res, next) {
    const cookies = req.headers.cookie;
    if (!cookies) {
        return res.status(403).json({
            errorMessage: '로그인이 필요한 기능입니다.',
            });
        }
    const token = cookies.split(' ')[1]

    const decodedToken = jwt.decode(token)

    console.log(decodedToken);

    next(err)

}