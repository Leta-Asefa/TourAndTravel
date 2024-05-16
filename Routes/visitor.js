const express = require('express')
const Visitor = require('../Models/Visitor')
const router = express.Router()
const {requireAuth}=require('../Middleware/AuthMiddleware')

router.get('/all',requireAuth, async (req, res) => {
    try {
        const visitors = await Visitor.find()
        res.json(visitors)

    } catch (err) {
        res.json({ 'error': err })
    }
})


router.post('/add',requireAuth, async (req, res) => {
    const body = req.body
    const data = {
        firstName: body.firstName,
        lastName: body.lastName,
        siteName: body.siteName,
        dateOfBirth: body.dateOfBirth,
        sex: body.sex,
        nationality: body.nationality,
        phoneNumber: body.phoneNumber,
        languages: body.languages,
        startingDate: body.startingDate,
        endingDate: body.endingDate,
        bookingStatus: body.bookingStatus,
        emergencyContact: body.emergencyContact,
        guidePhoneNumber: body.guidePhoneNumber

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

router.post('/find',requireAuth, async (req, res) => {
    const body = req.body

    try {
        const visitor = await Visitor.find({


            firstName: typeof body.firstName === 'undefined' ? /.*/ : body.firstName,
            lastName: typeof body.lastName === 'undefined' ? /.*/ : body.lastName,
            siteName: typeof body.siteName === 'undefined' ? /.*/ : body.siteName,
            dateOfBirth: typeof body.dateOfBirth === 'undefined' ? /.*/ : body.dateOfBirth,
            sex: typeof body.sex === 'undefined' ? /.*/ : body.sex,
            nationality: typeof body.nationality === 'undefined' ? /.*/ : body.nationality,
            phoneNumber: typeof body.phoneNumber === 'undefined' ? /.*/ : body.phoneNumber,
            languages: typeof body.languages === 'undefined' ? { $exists: true } : body.languages,
            startingDate: typeof body.startingDate === 'undefined' ? /.*/ : body.startingDate,
            endingDate: typeof body.endingDate === 'undefined' ? /.*/ : body.endingDate,
            bookingStatus: typeof body.bookingStatus === 'undefined' ? { $exists: true } : body.bookingStatus,
            emergencyContact: typeof body.emergencyContact === 'undefined' ? { $exists: true } : body.emergencyContact,
            guidePhoneNumber: typeof body.guidePhoneNumber === 'undefined' ? /.*/ : body.guidePhoneNumber
        })

        return res.json(visitor)

    } catch (err) {

        res.json({ "error": err })
    }

})


router.patch('/update/:phoneNumber',requireAuth, async (req, res) => {

    
    try {
       const existingDocument = await Visitor.findOne({ phoneNumber: req.params.phoneNumber })

        Object.keys(req.body).forEach((key) => {
            existingDocument[key] = req.body[key]
        })

        const updatedDocument = await existingDocument.save()

        res.json(updatedDocument)
    }
    catch (err) {
        res.json({"error":err})
    }

    })



router.delete('/delete/:phoneNumber',requireAuth, async (req, res) => {

    try {
        const result = await Visitor.deleteOne({ phoneNumber: req.params.phoneNumber })

        res.json(({ "result": "Deleted Successfully" }))
    } catch (err) {
        res.json({'error':err})
    }


})



module.exports = router