const axios = require('axios')

const getBlogs = async(req,res,next) => {
    try{
        const url ="https://intent-kit-16.hasura.app/api/rest/blogs" ;
        const config = {
           headers : {
             'x-hasura-admin-secret'  : process.env.API_SECRET
           }
        }
       
        const response  = await axios.get(url,config)
    
        if(!response || response.data.length === 0){
            const err = new Error('api response not found')
            next(err)
        }else{
            const totalBlogs = response.data.blogs
            req.blogs =  totalBlogs;
            console.log(req.blogs)
            next()
        }
     }catch(err){
        next(err)
     }

    
}


module.exports = getBlogs