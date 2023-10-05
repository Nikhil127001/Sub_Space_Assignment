const express = require('express')
const routes = express.Router();
const {blogStats,blogSearch} = require('../Controller/blogController')
const getBlogs = require('../Middleware/getBlogs')

routes.use(getBlogs);
routes.get('/blog-stats', blogStats);
routes.get('/blog-search', blogSearch);
module.exports = routes