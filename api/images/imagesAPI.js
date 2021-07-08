const express = require('express');
const router = express.Router();
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const sharp = require('sharp')

const inputFolder = path.join(__dirname, "..", '..', 'upload')
const outputFolder = path.join(__dirname, '..', '..', 'results')

//multer configs:
const storageStrategy = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/')
    },
    filename: (req, file, cb) => {
        cb(null, 'original.png')
    }
})

const fileFilterStrategy = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') cb(null, true)
    else cb(null, false);
}

const upload = multer({
    dest: 'upload/',
    storage: storageStrategy,
    fileFilter: fileFilterStrategy,
})


//routes

router.post('/images', upload.single('originalImage'), async(req, res) => {
        const widths = [100, 200, 400];
        console.log(req.file);

        for (width of widths) {
            await sharp(req.file.path).resize(width).toFile(path.join(outputFolder, `${width}.png`))

        }
        fs.unlinkSync(req.file.path)
            // res.status(200).json({ message: "you posted an image" })
        res.sendFile(path.join(__dirname, '..', '..', 'public', 'download.html'))

    })
    // router.get('/download', async(req,res)=>{
    //     res.sendFile(path.join(__dirname, '..','..','public','download.html'))
    // })
router.post('/download/:name', async(req, res) => {
    const name = req.params.name;
    const fullname = path.join(outputFolder, name);
    res.send(name)
    if (name === '100' || name === '200' || name === '400') {
        res.send(fullname)
    } else {
        res.status(500).json({ message: 'could not find given file' })
    }

})

router.get('/', (req, res) => {
    ///////////////////////////////////////////////////////////////////
    //when coming to the new page, remove all the files uploaded before:
    //doesn't work yet :/
    fs.readdirSync(outputFolder, (err, files) => {
        if (err) {
            console.log('-------------------errr---------------------')
            throw err;
        }
        for (file of files) {
            console.log('-----------------------------')
            console.log(file)
            fs.unlink(path.join(outputFolder, file), error => {
                if (error) throw error;
            })
        }
    });
    ///////////////////////////////////////////////
    // console.log(__dirname);
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
})

module.exports = router;