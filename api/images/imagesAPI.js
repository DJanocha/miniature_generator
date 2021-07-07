const express = require('express');
const router = express.Router();
const path = require('path')
const multer = require('multer')


//multer configs:
const storageStrategy = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/')
    },
    filename: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg')
            cb(null, file.originalname)
        else cb(null, false)
    }
})

// const fileFilterStrategy = (req, file, cb) => {
//     if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') cb(null, true)
//     else cb(null, false);
// }

const upload = multer({ dest: 'upload', storage: storageStrategy })





router.get('/', (req, res) => {
    res.status(200).json({ message: "you received all the images" })
})
router.get('/:id', (req, res) => {
    const id = req.params.id; // it's still a string, not a number
    if (id === "100" || id === "200" || id === "400") {
        res.status(200).json({ message: `you received image of ${id}px width` })
    } else {
        res.status(404).json({ message: "width not found" })
    }
})
router.post('/', upload.single('originalImage'), (req, res) => {
    console.log(req.file);

    res.status(200).json({ message: "you posted an image" })

})
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
})

module.exports = router;