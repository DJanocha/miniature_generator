const express = require('express')
const imagesAPI = require('./api/images/imagesAPI')
const pagesAPI = require('./api/pages/pagesAPI')
const app = express();

// const path = require('path')

app.use(express.static('public'));


//let's add route responsible for sending html page with input form; 
app.use('/', pagesAPI)
//use the router responsible for handling imageAPI requests(GET, POST) as one of the middlewares
//do it with redirecting every host:port/images request to that api:
// app.use('/images',imagesAPI);
app.use('/', imagesAPI)








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

// app.use((error, req ,res,next)=>{
//     res.status(error.status || 500).json({
//         error,
//     })
// })


module.exports=app;