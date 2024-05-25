const express = require('express')
const TourGuide = require('../Models/TourGuide')
const multer = require('multer');
const fs = require('fs')
const path = require('path');
const { requireAuth } = require('../Middleware/AuthMiddleware')

const router = express.Router()



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

const uploadDocuments=multer({storage:storage}).array('images', 10)


router.get('/all', async (req, res) => {
    try {
        const guides = await TourGuide.find()
        res.json(guides)

    } catch (err) {
        res.json({ 'error': err })
    }
})

router.get('/getIntro', async (req, res) => {
   
    try {
        const guides = await TourGuide.find({status:'approved'}).select('firstName lastName rating profilePicture experience education phoneNumber')
       
        for (const guide of guides) {
            if (guide.profilePicture) {
                const image = guide.profilePicture;
                const base64Image = await fetchBase64Image(image); // Fetch base64 data for the first image
                guide.profilePicture = base64Image; 
            }
        }

        res.json(guides)

    } catch (err) {
        console.log(err)
        res.send(err)
    }

})

router.get('/waitingIntro', async (req, res) => {
   
    try {
        const guides = await TourGuide.find({status:'waiting'}).select('firstName lastName rating profilePicture experience education phoneNumber')
       
        for (const guide of guides) {
            if (guide.profilePicture) {
                const image = guide.profilePicture;
                const base64Image = await fetchBase64Image(image); // Fetch base64 data for the first image
                guide.profilePicture = base64Image; 
            }
        }

        res.json(guides)

    } catch (err) {
        console.log(err)
        res.send(err)
    }

})



router.get('/waitingguides', async (req, res) => {
    try {
        const guides = await TourGuide.find({ status: 'waiting' });
        
        // Process each guide asynchronously and collect them into an array
        const processedGuides = await Promise.all(guides.map(async (guide) => {
            guide.profilePicture = await fetchBase64Image(guide.profilePicture);
            guide.documents = await fetchBase64Images(guide.documents);
            return guide;
        }));
        
        res.json(processedGuides);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});




router.get('/get/:phoneNumber', async (req, res) => {
    
    try {
        const guide = await TourGuide.findOne({ phoneNumber: req.params.phoneNumber })
        guide.profilePicture = await fetchBase64Image(guide.profilePicture)
        guide.documents=await fetchBase64Images(guide.documents)
        res.json(guide)

    } catch (err) {
        console.log(err)
        res.send(err)
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
        hourlyRate: body.hourlyRate,
        status:body.status

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
            hourlyRate: typeof body.hourlyRate === 'undefined' ? { $exists: true } : body.hourlyRate
        })

        return res.json(guide)

    } catch (err) {

        res.json({ "error": err })
    }

})


router.patch('/update/:phoneNumber', requireAuth, async (req, res) => {

    try {
        const existingDocument = await TourGuide.findOne({ phoneNumber: req.params.phoneNumber })

        Object.keys(req.body).forEach((key) => {
            existingDocument[key] = req.body[key]
        })

        const updatedDocument = await existingDocument.save()

        res.json(updatedDocument)
    } catch (err) {
        res.json({ "error": err })
    }

})

router.patch('/addProfilePic/:phoneNumber', requireAuth, upload.single('image'), async (req, res) => {

    console.log("ProfilePic ",req.file.filename)

    try {
        imagepath = `Images/${req.file.filename}`
        const guide = await TourGuide.findOne({ phoneNumber: req.params.phoneNumber })
        guide["profilePicture"] = imagepath
        const updatedGuide = await guide.save()
        res.json(updatedGuide)
    } catch (err) {
        console.log(err)
        res.json({ error: err })
    }

})



router.get('/getProfilePic/:phoneNumber', async (req, res) => {
    const guide = await TourGuide.findOne({ phoneNumber: req.params.phoneNumber }).select("profilePicture")
    try {

        const filePath = path.join(__dirname, '../', guide.profilePicture);
        const image = fs.readFileSync(filePath);
        const base64Image = Buffer.from(image).toString('base64');
        res.json({ profilePicture: base64Image });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.delete('/delete/:phoneNumber', requireAuth, async (req, res) => {

    try {
        const result = await TourGuide.deleteOne({ phoneNumber: req.params.phoneNumber })

        res.json(({ "result": "Deleted Successfully" }))
    } catch (err) {
        res.json({ 'error': err })
    }


})


router.patch('/addDocuments/:phoneNumber',requireAuth, (req, res) => {
    console.log(' Images entered')
    uploadDocuments(req, res, async (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to upload documents' });
        } else {
            try {
                imagepaths = req.files.map(file => `Images/${file.filename}`);
                console.log(imagepaths)
                const guide = await TourGuide.findOne({ phoneNumber: req.params.phoneNumber })
                guide["documents"].push(...imagepaths)
                const updatedGuide = await guide.save()
                res.json(updatedGuide)
            } catch (err) {
                res.json({error:err})
            }
        }
    })
    

}
    
)



async function fetchBase64Image(imagePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                reject(err); // If there's an error, reject the promise
            } else {
                // Convert the image data to base64 format
                const base64Image = Buffer.from(data).toString('base64');
                resolve(base64Image); // Resolve with the base64 image data
            }
        });
    });
}


async function fetchBase64Images(imagePaths) {
    try {
        if (!Array.isArray(imagePaths)) {
            throw new Error('imagePaths must be an array');
        }

        // Map over the array of image paths and fetch each image asynchronously
        const base64Images = [];
        for (const imagePath of imagePaths) {
            console.log(imagePath)
            const data =await  fs.promises.readFile(imagePath);
            const base64Image = Buffer.from(data).toString('base64');
            base64Images.push(base64Image);
        }

        return base64Images; // Return the array of base64 images
    } catch (error) {
        throw error; // Throw any errors that occurred during the process
    }
}


module.exports = router