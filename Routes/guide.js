const express = require('express')
const TourGuide = require('../Models/TourGuide')
const router = express.Router()

router.get('/all', async (req, res) => {
    try {
        const guides = await TourGuide.find()
        res.json(guides)

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
        experience: body.experience,
        education: body.education,
        rating: body.rating,
        profilePicture: body.profilePicture,
        salary:body.salary

    }

    const guide = new TourGuide(data)
    try {

        const result = await guide.save()
        res.json(result)

    } catch (err) {
        res.json({ "error": err })
    }

}
)


router.post('/find', async (req, res) => {
    const body = req.body

    try {
        const guide = await TourGuide.find({


            firstName: typeof body.firstName === 'undefined' ? /.*/ : body.firstName,
            lastName: typeof body.lastName === 'undefined' ? /.*/ : body.lastName,
            dateOfBirth: typeof body.dateOfBirth === 'undefined' ? /.*/ : body.dateOfBirth,
            sex: typeof body.sex === 'undefined' ? /.*/ : body.sex,
            nationality: typeof body.nationality === 'undefined' ? /.*/ : body.nationality,
            phoneNumber: typeof body.phoneNumber === 'undefined' ? /.*/ : body.phoneNumber,
            languages: typeof body.languages === 'undefined' ? { $exists: true } : body.languages,
            experience: typeof body.experience === 'undefined' ? /.*/ : body.experience,
            education: typeof body.education === 'undefined' ? /.*/ : body.education,
            rating: typeof body.rating === 'undefined' ? { $exists: true } : body.rating,
            salary: typeof body.salary === 'undefined' ? { $exists: true } : body.salary
        })

        return res.json(guide)

    } catch (err) {

        res.json({ "error": err })
    }

})


router.patch('/update/:phoneNumber', async (req, res) => {
    
    try {
        const existingDocument = await TourGuide.findOne({ phoneNumber: req.params.phoneNumber })
    
        Object.keys(req.body).forEach((key) => {
            existingDocument[key] = req.body[key]
        })

        const updatedDocument = await existingDocument.save()

        res.json(updatedDocument)
    } catch (err) {
        res.json({"error":err})
    }

})


router.delete('/delete/:phoneNumber', async (req, res) => {
    
    try {
        const result = await TourGuide.deleteOne({ phoneNumber: req.params.phoneNumber })

        res.json(({ "result": "Deleted Successfully" }))
    } catch (err) {
        res.json({'error':err})
    }


})


module.exports=router