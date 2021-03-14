const Joi = require('joi');

module.exports.cargoSchema = Joi.object({
    cargo: Joi.object({
        type: Joi.string().required(),
        // image: Joi.string().required(),
        weight: Joi.number().required().min(0),
        location: Joi.string().required(),
        destination: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
})

module.exports.bidSchema = Joi.object({
    bid: Joi.object({
        amount: Joi.number().required().min(10),
        message: Joi.string().required()
    }).required()
})