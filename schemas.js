const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');


const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.cargoSchema = Joi.object({
    cargo: Joi.object({
        type: Joi.string().required().escapeHTML(),
        // image: Joi.string().required(),
        weight: Joi.number().required().min(0),
        location: Joi.string().required().escapeHTML(),
        destination: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
    }).required(),
    deleteImages: Joi.array()
})

module.exports.bidSchema = Joi.object({
    bid: Joi.object({
        amount: Joi.number().required().min(10),
        message: Joi.string().required().escapeHTML()
    }).required()
})