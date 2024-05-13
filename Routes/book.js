const express = require('express')
const Book = require('../Models/Book')
const router = express.Router()

router.get('/all', async (req, res) => {
    try {
        const books = await Book.find()
        res.json(books)

    } catch (err) {
        res.json({ 'error': err })
    }
})


router.post('/add', async (req, res) => {
    const body = req.body
    const data = {
        visitors: body.visitors,
        date: body.date,
        isPrivate: body.isPrivate,
        siteName: body.siteName,
        guidePhoneNumber: body.guidePhoneNumber,
        status: body.status
    }

    const book = new Book(data)
    try {

        const result = await book.save()
        res.json(result)

    } catch (err) {
        res.json({ "error": err })
    }

}
)


router.post('/find', async (req, res) => {
    const body = req.body

    try {
        const book = await Book.find({


            date: typeof body.date === 'undefined' ? /.*/ : body.date,
            isPrivate: typeof body.isPrivate === 'undefined' ? { $exists: true } : body.isPrivate,
            siteName: typeof body.siteName === 'undefined' ? /.*/ : body.siteName,
            guidePhoneNumber: typeof body.guidePhoneNumber === 'undefined' ? /.*/ : body.guidePhoneNumber,
            status: typeof body.status === 'undefined' ? /.*/ : body.status
        })

        return res.json(book)

    } catch (err) {

        res.json({ "error": err })
    }

})

router.patch('/update/:id', async (req, res) => {
    let existingDocument
    try {
        existingDocument = await Book.findById(req.params.id)
    } catch (error) {
        return res.json({ "error": "Document not found" })
    }
   



    Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== undefined) {
            existingDocument[key] = req.body[key];
        }
    })

    const updatedDocument = await existingDocument.save()

    res.json(updatedDocument)

})





module.exports = router