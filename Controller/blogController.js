const axios = require('axios');
const _ = require('lodash');
const CircularJSON = require('circular-json');


function createCachingFunction(fn, cachingPeriod = 3600000) {
    const memoizedFn = _.memoize(fn, (req) => {
        return CircularJSON.stringify(req);
    });

    return async (req, res, next) => {
        try {
            const result = await memoizedFn(req, res, next);
            res.json(result);
        } catch (err) {
            next(err);
        }
    };
}

const cachedBlogStats = createCachingFunction(async (req, res, next) => {
    const response = req.blogs;

    if (!response) {
        const err = new Error('response not found');
        next(err);
    } else {
        const totalBlogs = response;
        // Total number of blogs

        const TotalBlogsLength = _.size(totalBlogs);
        //The title of the longest blog

        const LongestTitle = _.maxBy(totalBlogs, (blog) => blog.title.length);
        // Number of blogs with "privacy" in the title.

        const blogsHavingPrivacy = _.filter(totalBlogs, (blog) =>
            blog.title.toLowerCase().includes('privacy')
        );
        //An array of unique blog titles

        const blogsWithUniqueTitle = _.uniqBy(totalBlogs, 'title');

        return {
            response: {
                TotalBlogsLength: TotalBlogsLength,
                LongestTitle: LongestTitle,
                blogsHavingPrivacy: blogsHavingPrivacy,
                blogsWithUniqueTitle: blogsWithUniqueTitle,
            },
        };
    }
}, 3600000);

const cachedBlogSearch = createCachingFunction((req, res, next) => {
    const totalBlogs = req.blogs;
    const query = req.query.query;

    if (!query) {
        const err = new Error('"query" is required');
        next(err);
    } else {
        const filteredBlogs = totalBlogs.filter((blog) =>
            blog.title.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredBlogs.length === 0) {
            const err = new Error(' "blogs not found');
            next(err);
        } else {
            return {
                blogs: filteredBlogs,
            };
        }
    }
}, 3600000);

module.exports = { blogStats: cachedBlogStats, blogSearch: cachedBlogSearch };
