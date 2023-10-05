const express = require('express')
const app = express();
const apiRoutes =  require('./Routes/apiRoutes')
require('dotenv').config();

app.get('/' , (req,res) => {
    res.json({
        message : 'Sub space Api is Working'
    })
})
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
