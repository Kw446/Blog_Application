const commentSchema = require('./commentValidationSchema')

module.exports = {
    createComment: async (req, res, next) => {
        const value = await commentSchema.createComment.validate(req.body, { abortEarly: false })
        if (value.error) {
            return res.status(403).json({
                sucess: false,
                message: value.error.details[0].message
            })
        } else {
            next()
        }
    },
}
