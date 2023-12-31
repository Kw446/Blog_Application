const blogSchema = require('../models/blogSchema');
const commentSchema = require('../models/commentSchema');
const userSchema = require('../models/userSchema');
const blogLogger = require('../utils/blogLogger');
const { mailOptions } = require('../services/emailService');

module.exports = {
    createBlog: async (req, res) => {
        try {
            const userId = req.params.id
            const blogData = new blogSchema(req.body);
            const userData = await userSchema.findById(userId);
            blogData.userId = userId
            await mailOptions(userData.userEmail, 1);
            await blogData.save();
            userSchema.log('info',"Blog Created Successfully .")
            res.status(201).send({
                success: true,
                message: "Blog Created Successfully ."
            });
        } catch (error) {
            blogLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error Occurs .",
                error: error.message
            });
        }
    },

    updateBlog: async (req, res) => {
        try {
            const blogID = req.params.id;
            const blogData = await blogSchema.findByIdAndUpdate(blogID, req.body, {
                new: true,
            });
            blogLogger.log('info',"Your blog updated Successfully .")
            res.status(200).send({
                success: true,
                message: 'Your blog updated Successfully .'
            })
        }
        catch (error) {
            blogLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error",
                error: error.message
            })
        }
    },

    deleteBlog: async (req, res) => {
        try {
            const blogID = req.params.id;
            const blogData = await blogSchema.findByIdAndDelete(blogID);
            blogLogger.log('info',"Your blog Deleted Successfully .")
            res.status(200).send({
                success: true,
                message: 'Your blog Deleted Successfully .'
            })
        }
        catch {
            blogLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error",
                error: error.message
            })
        }
    },

    blogSearch: async (req, res) => {
        try {
            const letter = req.params.letter;
            const blogSearch = await blogSchema.find({ blogTopic: { $regex: `^${letter}`, $options: "i" } })
            .select('blogTopic');
            blogLogger.log('info',"Blogs Founded.")
            res.status(200).json({
                success: true,
                message: 'Blogs Which Found.',
                blogTopic: blogSearch
            });
        } catch (err) {
            blogLogger.log('error', `Error: ${err.message}`)
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },

    blogDetails: async (req, res) => {
        const id = req.params.id;
        try {
            const blogData = await blogSchema.findById(id).select("blogTopic blogDescription blogLikes")
                .populate({ path: "userId", select: "userName" });
            if (!blogData) {
                return res.status(404).json({
                    success: false,
                    message: 'Blog not found'
                });
            }
            const commentData = await commentSchema
                .find({ blogId: id })
                .populate({ path: "userId", select: "userName" });
            blogLogger.log('info',"Blog Detail.")
            res.status(200).json({
                success: true,
                message: 'Blog Detail.',
                blog: blogData,
                comments: commentData
            });
        } catch (err) {
            blogLogger.log('error', `Error: ${err.message}`)
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: err.message
            });
        }
    },

    likeBlog: async (req, res) => {
        try {
            const blogId = req.params.id;
            const blogData = await blogSchema.findById(blogId)
            blogData.blogLikes++;
            await blogData.save();
            blogLogger.log('info',"You liked the blog!")
            res.status(200).send({
                success: true,
                message: "You liked the blog!"
            });

        } catch (error) {
            blogLogger.log('error', `Error: ${error.message}`)
            res.status(500).json({
                success: false,
                error: `Error occurred: ${error.message}`,
            });
        }
    }
}
