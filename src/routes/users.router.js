import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const router = express.Router();

router.post('/sign-in', async(req,res,next)=>{
    const {nickname,password} = req.body;
    const user = await prisma.users.findFirst({where: {nickname}})

    if(!user||(!(await bcrypt.compare(password, user.password)))){
        return res.status(400).json({message: '닉네임 또는 패스워드를 확인해주세요.'})
    }

    

    let expires = new Date()
    expires.setDate(expires.getDate() + 1)

    const token = jwt.sign({userId:user.userId,
        usertype:user.usertype},'Secret Key')

    res.cookie('token',`Bearer${token}`,{expires: expires})

    return res.status(200).json({message:'로그인 성공'})
})

export default router;