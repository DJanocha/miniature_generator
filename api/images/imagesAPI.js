const express = require('express');
const router = express.Router();
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const sharp = require('sharp')

const inputFolder = path.join(__dirname, "..", '..', 'upload')
const outputFolder = path.join(__dirname, '..', '..', 'results')


const availableWidths = [100, 200, 400];
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
    if (!fs.existsSync(path.join(inputFolder, 'original.png')))
        res.redirect('/restart')
    console.log(req.file);
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'download.html'))
})

router.get('/restart', (req, res) => {
    const originalFilename = path.join(inputFolder, 'original.png')
    if (fs.existsSync(originalFilename))
        fs.unlinkSync(originalFilename)
    for (w of availableWidths) {
        const editedFilename = path.join(outputFolder, `${w}.png`)
        if (fs.existsSync(editedFilename))
            fs.unlinkSync(editedFilename)
    }
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'))
})
router.get('/download/:width', async(req, res) => {
    const { width } = req.params;
    const filePath = `${path.join(__dirname, '..', '..', 'results', width)}.png`;
    if (availableWidths.includes(Number(width))) {
        await sharp(path.join(inputFolder, 'original.png')).resize(+width).toFile(path.join(outputFolder, `${width}.png`))
        console.log(filePath);
        res.download(filePath)
    } else
        res.send(`${filePath} doesn't exist`)
})

router.get('/', (req, res) => {
    res.redirect('/restart')
})

module.exports = router;