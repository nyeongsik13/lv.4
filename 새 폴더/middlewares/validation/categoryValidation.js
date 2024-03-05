import joi from 'joi';

export const createCategorySchema = joi.object({
    name: joi.string().min(1).max(10).required().messages({
        'string.empty': '제목을 입력해주세요.',
        'string.min': '제목은 최소 1글자 이상이어야 합니다.',
        'string.max': '제목은 최대 10글자를 초과할 수 없습니다.',
    }),
});
