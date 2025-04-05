const Joi = require('joi');//schema description language and data validator

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description : Joi.string().required(),
        location :  Joi.string().required(),
        country :  Joi.string().required(),
        category :  Joi.string().required(),
        image :  Joi.string().allow("" , null),
        price :  Joi.number().required().min(0),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment:Joi.string().required(),
        rating : Joi.number().min(1).max(5).required(),
    }).required()
});

