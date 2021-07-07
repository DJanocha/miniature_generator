const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: "you received all the images" })
})
router.get('/:id', (req, res) => {
    const id = req.params.id; // it's still a string, not a number
    if (id === "100" || id === "200" || id === "400") {
        res.status(200).json({ message: `you received image of ${id}px width` })
    } else {
        res.status(404).json({message: "width not found"})
    }
})
router.post('/', (req, res) => {
    res.status(200).json({ message: "you posted an image" })
})

module.exports = router;