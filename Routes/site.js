const express = require('express')
const Site = require('../Models/Site')
const router = express.Router()

router.get('/all', async (req, res) => {
    try {
        const sites = await Site.find()
        res.json(sites)

    } catch (err) {
        res.send(err)
    }
})


router.post('/add', async (req, res) => {
    const data = {
        siteName: req.body.siteName,
        description: req.body.description,
        location: {
            address: req.body.location.address,
            coordinates: req.body.location.coordinates
        },
        distance: req.body.distance,
        openingHours: req.body.openingHours,
        categories: req.body.categories,
        facilitiesAvailable: req.body.facilitiesAvailable,
        rating: req.body.rating,
        images: req.body.images,
        videos: req.body.videos,
        transportations: req.body.transportations

    }

    const site = new Site(data)

    try {
        const result = await site.save()
        res.json(result)

    } catch (err) {
        const errmsg = err.errorResponse.errmsg
        console.log(errmsg)
        res.json({ "error": errmsg })
    }

}
)

router.post('/find', async (req, res) => {
    const body = req.body

    try {
        const site = await Site.find({


            siteName: typeof body.siteName === 'undefined' ? /.*/ : body.siteName,
            description: typeof body.description === 'undefined' ? /.*/ : body.description,
            distance: typeof body.distance === 'undefined' ? { $exists: true } : body.distance,
            openingHours: typeof body.openingHours === 'undefined' ? /.*/ : body.openingHours,
            categories: typeof body.categories === 'undefined' ? /.*/ : body.categories,
            location: typeof body.location === 'undefined' ? { $exists: true } : body.location,
            facilitiesAvailable: typeof body.facilitiesAvailable === 'undefined' ? { $exists: true } : body.facilitiesAvailable,
            rating: typeof body.rating === 'undefined' ? { $exists: true } : body.rating,
            transportations: typeof body.transportations === 'undefined' ? { $exists: true } : body.transportations
        })

        return res.json(site)

    } catch (err) {

        res.json({ "error": err })
    }

    //preceed the above with req.body.stieName...==null set it {}


})

router.patch('/update/:siteName', async (req, res) => {
    
    const existingDocument = await Site.findOne({ siteName: req.params.siteName })
    if (!existingDocument) {
        return res.json({ "error": 'Document not found' })
    }


    Object.keys(req.body).forEach((key) => {
        existingDocument[key] = req.body[key]
    })

    const updatedDocument = await existingDocument.save()

    res.json(updatedDocument)

})


router.delete('/delete/:siteName', async (req, res) => {
    const result = await Site.deleteOne({ siteName: req.params.siteName })

    if (result.deletedCount === 0)
        res.status(404).json({ "error": "Not Found" })

    res.json(({ "result": "Deleted Successfully" }))



})





module.exports = router