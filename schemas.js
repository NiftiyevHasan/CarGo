const Joi = require('joi');

module.exports.cargoSchema = Joi.object({
    cargo: Joi.object({
        type: Joi.string().required(),
        image: Joi.string().required(),
        weight: Joi.number().required().min(0),
        location: Joi.string().required(),
        destination: Joi.string().required(),
        description: Joi.string().required(),

    }).required()
})