const express = require('express')

const userAuthetication = require('../middleware/authToken');
const blog = require('../controller/blogController')
const blogValidator = require('../validations/blog/blogValidator')

const router = express.Router()

router.post('/createBlog/:id', userAuthetication, blogValidator.createBlog,blog.createBlog)
router.patch('/updateBlog/:id', userAuthetication,blog.updateBlog)
router.delete('/deleteBlog/:id', userAuthetication, blog.deleteBlog)
router.get('/serachBlog/:letter', userAuthetication, blog.blogSearch)
router.get('/detailBlog/:id', userAuthetication, blog.blogDetails)
router.get('/likeBlog/:id', blog.likeBlog)

module.exports = router