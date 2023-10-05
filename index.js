const express = require('express')
const app = express();
const apiRoutes =  require('./Routes/apiRoutes')
require('dotenv').config();


app.use('/api' , apiRoutes)

app.use((error,req,res,next) => {
    res.json({
        message: error.message
    })
})

const port = process.env.PORT || 8000;

app.listen(port,() =>{
    console.log(`app listining on port ${port}`)
})