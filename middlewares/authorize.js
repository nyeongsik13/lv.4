const authorize = (allowedUserTypes) => (req, res, next) => {
    if (!allowedUserTypes.includes(req.user.usertype)) {
        return res.status(403).json({ message: "사장님만 사용할 수 있는 API입니다." });
    }
    next();
};

export default authorize;