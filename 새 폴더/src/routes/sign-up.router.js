// src/routes/sign-up.router.js

import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';

const router = express.Router();

/** 사용자 회원가입 API 트랜잭션 **/
router.post('/sign-up', async (req, res, next) => {
    try {
        const { nickname, password, usertype } = req.body;

        // 데이터 형식 검사
        if(!nickname || !password){
            return res.status(400).json({message: '데이터 형식이 올바르지 않습니다.'});
        }
        // 닉네임 유효성 검사
        const nicknameRegex = /^[a-zA-Z0-9]{3,15}$/;
        if(!nicknameRegex.test(nickname)){
            return res.status(400).json({message: '닉네임 형식에 일치하지 않습니다.'});
        }

        // 비밀번호 유효성 검사
        if(password.length < 8 || password.length > 20 || password.includes(nickname) ){
            return res.status(400).json({message: '비밀번호 형식에 일치하지 않습니다.'});            
        }

        // 중복된 닉네임 검사
        const isExistNickname = await prisma.users.findFirst({
            where: {nickname},
        });
        if (isExistNickname){
            return res.status(409).json("message: 중복된 닉네임입니다.");
        }
        
        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 생성
        const user = await prisma.users.create({
            data: {
                nickname,
                password: hashedPassword,
                usertype: usertype === 'OWNER' ? 'OWNER' : 'CUSTOMER'
            }
        })
        return res.status(201).json({message: '회원가입이 완료되었습니다.'});
    } catch(err){
        next(err);
    }
  });

  export default router;