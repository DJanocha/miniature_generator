const express = require('express')
const imagesAPI = require('./api/images/imagesAPI')
const app = express();


//use the router responsible for handling imageAPI requests(GET, POST) as one of the middlewares
//do it with redirecting every host:port/images request to that api:
app.use('/images',imagesAPI);


//throw an error if the request could not be handled by any of our middlewares
app.use((req,res, next)=>{
    const err = new Error("could not handle the request")
    res.status(404).json({
        error:{
            message: err.message,
            status: err.status,
        }
    })
    next(err);
})

//handle any incoming errors including ours (created right above):

app.use((error, req,res,next)=>{
    res.status(500).json({
        error,
    })
})
module.exports=app;