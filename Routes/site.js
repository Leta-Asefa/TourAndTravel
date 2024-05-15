const express = require('express')
const Site = require('../Models/Site')
const multer = require('multer');
const fs=require('fs')
const path = require('path');

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'Images')
    },
    filename: (req, file, cb) => {
        cb(null,Date.now()+path.extname(file.originalname))
    }
})
const upload=multer({storage:storage}).array('images', 10)


router.get('/all', async (req, res) => {

    console.log("redirected")
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
                location: req.body.location,
                distance: req.body.distance,
                openingHours: req.body.openingHours,
                categories: req.body.categories,
                facilitiesAvailable: req.body.facilitiesAvailable,
                rating: req.body.rating,
                videos: req.body.videos,
                transportations: req.body.transportations
        
            }
        
            const site = new Site(data)
        
            try {
                const result = await site.save()
                res.json(result)
        
            } catch (err) {
                res.json({ "error": err })
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
    
    try {
        const existingDocument = await Site.findOne({ siteName: req.params.siteName })
   
        Object.keys(req.body).forEach((key) => {
            existingDocument[key] = req.body[key]
        })

        const updatedDocument = await existingDocument.save()

        res.json(updatedDocument)
    } catch (err) {
        res.json({"error":err})
    }

})

router.patch('/addImages/:siteName', (req, res) => {

    upload(req, res, async (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to upload images' });
        } else {
            //ensure there in no duplicated images, appending on the existing images, deleteing images ....

            try {
                imagepaths = req.files.map(file => `Images/${file.filename}`);
                const site = await Site.findOne({ siteName: req.params.siteName })
                site["images"].push(...imagepaths)
                const updatedSite = await site.save()
                res.json(updatedSite)
            } catch (err) {
                res.json({error:err})
            }
        }
    })
    

}
    
)

router.get('/getImages/:siteName', async(req, res) => {
    const {images:imagepaths} = await Site.findOne({ siteName: req.params.siteName }).select("images")
    try {
        
        const images = [];

        for (const fileName of imagepaths) {
            const filePath = path.join(__dirname, '../', fileName);
            const image = fs.readFileSync(filePath);
            const base64Image = Buffer.from(image).toString('base64');
            images.push(base64Image);
        }

        res.json({ images: images });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.patch('/addVideos/:siteName', (req, res) => {


    upload(req, res, async (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to upload Videos' });
        } else {

            try {
                videopaths = req.files.map(file => `Images/${file.filename}`);
                const site = await Site.findOne({ siteName: req.params.siteName })
                site["videos"].push(...videopaths)
                const updatedSite = await site.save()
                res.json(updatedSite)
            } catch (err) {
                res.json({error:err})
            }
        }
    })
    

}
    
)

router.get('/getVideos/:siteName', async(req, res) => {
    const {videos:videopaths} = await Site.findOne({ siteName: req.params.siteName }).select("videos")
    try {
        
        const videos = [];

        for (const fileName of videopaths) {
            const filePath = path.join(__dirname, '../', fileName);
            const video = fs.readFileSync(filePath);
            const base64Image = Buffer.from(video).toString('base64');
            videos.push(base64Image);
        }

        res.json({ videos: videos });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


router.delete('/delete/:siteName', async (req, res) => {
    try {
        const result = await Site.deleteOne({ siteName: req.params.siteName })

        res.json(({ "result": "Deleted Successfully" }))
    } catch (err) {
        res.json({"error":err})
    }


})





module.exports = router