const express = require('express')
const Visitor = require('../Models/Visitor')
const router = express.Router()

router.get('/all', async (req, res) => {
    try {
        const visitors = await Visitor.find()
        res.json(visitors)

    } catch (err) {
        res.json({ 'error': err })
    }
})


router.post('/add', async (req, res) => {
    const body = req.body
    const data = {
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: body.dateOfBirth,
        sex: body.sex,
        nationality: body.nationality,
        phoneNumber: body.phoneNumber,
        languages: body.languages,
        startingDate: body.startingDate,
        endingDate: body.endingDate,
        bookingStatus: body.bookingStatus,
        emergencyContact: body.emergencyContact

    }

    const visitor = new Visitor(data)
    try {

        const result = await visitor.save()
        res.json(result)

    } catch (err) {
        res.json({ "error": err })
    }

}
)

router.post('/find', async (req, res) => {
    const body = req.body

    try {
        const visitor = await Visitor.find({


            firstName: typeof body.firstName === 'undefined' ? /.*/ : body.firstName,
            lastName: typeof body.lastName === 'undefined' ? /.*/ : body.lastName,
            dateOfBirth: typeof body.dateOfBirth === 'undefined' ? /.*/ : body.dateOfBirth,
            sex: typeof body.sex === 'undefined' ? /.*/ : body.sex,
            nationality: typeof body.nationality === 'undefined' ? /.*/ : body.nationality,
            phoneNumber: typeof body.phoneNumber === 'undefined' ? /.*/ : body.phoneNumber,
            languages: typeof body.languages === 'undefined' ? { $exists: true } : body.languages,
            startingDate: typeof body.startingDate === 'undefined' ? /.*/ : body.startingDate,
            endingDate: typeof body.endingDate === 'undefined' ? /.*/ : body.endingDate,
            bookingStatus: typeof body.bookingStatus === 'undefined' ? { $exists: true } : body.bookingStatus,
            emergencyContact: typeof body.emergencyContact === 'undefined' ? { $exists: true } : body.emergencyContact
        })

        return res.json(visitor)

    } catch (err) {

        res.json({ "error": err })
    }

})


router.patch('/update/:phoneNumber', async (req, res) => {
    
    const existingDocument = await Visitor.findOne({ phoneNumber: req.params.phoneNumber })
    if (!existingDocument) {
        return res.status(404).json({ "error": 'Document not found' })
    }


    Object.keys(req.body).forEach((key) => {
        existingDocument[key] = req.body[key]
    })

    const updatedDocument = await existingDocument.save()

    res.json(updatedDocument)

})



router.delete('/delete/:phoneNumber', async (req, res) => {
    
    const result = await Visitor.deleteOne({ phoneNumber: req.params.phoneNumber })

    if (result.deletedCount === 0)
        res.json({ "error": "Not Found" })

    res.json(({ "result": "Deleted Successfully" }))



})



module.exports = router