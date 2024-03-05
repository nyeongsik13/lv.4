import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { createMenuSchema } from '../../middlewares/validation/menuValidation.js';
import authenticate from '../../middlewares/authenticate.js'; 

const router = express.Router();

// 메뉴 등록 API
router.post('/categories/:categoryId/menus', authenticate, async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const { name, description, image, price } = req.body;

        if (price <= 0) {
            return res.status(400).json({ message: "메뉴 가격은 0보다 작을 수 없습니다." });
        }

        const category = await prisma.categories.findUnique({
            where: { id: +categoryId },
        });

        if (!category) {
            return res.status(404).json({ message: '존재하지 않는 카테고리입니다.' });
        }

        const order = await prisma.menus.count({
            where: { categoryId: +categoryId },
        });

        const menu = await prisma.menus.create({
            data: {
                name,
                description,
                image,
                price,
                order: order + 1,
                categoryId: +categoryId,
                status: 'FOR_SALE', 
            },
        });

        return res.status(201).json({ message: '메뉴를 등록하였습니다.', menu });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
});

// 카테고리별 메뉴 조회 API
router.get('/categories/:categoryId/menus', async (req, res, next) => {
    const { categoryId } = req.params;

    const category = await prisma.categories.findFirst({
        where: { categoryId: +categoryId },
    });
    if (!categoryId) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }

    if (!category) {
        return res.status(404).json({ message: '존재하지 않는 카테고리입니다.' });
    }
    const menus = await prisma.menus.findMany({
        where: { categoryId: +categoryId },
        select: {
            menuId: true,
            name: true,
            image: true,
            price: true,
            order: true,
            status: true,
        },
        orderBy: {
            order: 'desc',
        },
    });
    return res.status(200).json({ data: menus });
});

//메뉴 상세조회
router.get('/categories/:categoryId/menus/:menuId', async (req, res) => {
    const { categoryId, menuId } = req.params;
    const category = await prisma.categories.findUnique({
        where: {
            categoryId: +categoryId,
        },
    });
    if (!category) {
        res.status(404).json({ message: '존재하지 않는 카테고리 입니다.' });
    }
    const menu = await prisma.menus.findUnique({
        where: {
            menuId: +menuId,
        },
    });
    if (!menu) {
        res.status(404).json({ message: '존재하지 않는 메뉴 입니다.' });
    }

    const categoryMenus = await prisma.menus.findUnique({
        where: {
            categoryId: +categoryId,
            menuId: +menuId,
        },
    });
    return res.status(200).json({ data: categoryMenus });
});

// 메뉴 수정 API
router.patch('/categories/:categoryId/menus/:menuId', authenticate, async (req, res, next) => {
    try {
        const { categoryId, menuId } = req.params;
        const { name, description, image, price, order, status } = req.body;

        if (price <= 0) {
            return res.status(400).json({ message: "메뉴 가격은 0보다 작을 수 없습니다." });
        }

        const menuExists = await prisma.menus.findUnique({
            where: {
                id: +menuId,
            },
        });

        if (!menuExists) {
            return res.status(404).json({ message: '존재하지 않는 메뉴입니다.' });
        }

        const updatedMenu = await prisma.menus.update({
            where: {
                id: +menuId,
            },
            data: {
                name,
                description,
                image,
                price,
                order,
                status,
            },
        });

        return res.status(200).json({ message: '메뉴를 수정하였습니다.', menu: updatedMenu });
    } catch (error) {
        next(error);
    }
});

// 메뉴 삭제 API
router.delete('/categories/:categoryId/menus/:menuId', authenticate, async (req, res, next) => {
    try {
        const { categoryId, menuId } = req.params;

        const menuExists = await prisma.menus.findUnique({
            where: {
                id: +menuId,
            },
        });

        if (!menuExists) {
            return res.status(404).json({ message: '존재하지 않는 메뉴입니다.' });
        }

        await prisma.menus.delete({
            where: {
                id: +menuId,
            },
        });

        return res.status(200).json({ message: '메뉴 삭제 완료' });
    } catch (error) {
        next(error);
    }
});

export default router;
