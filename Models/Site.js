const mongoose = require('mongoose')
const SiteSchema = mongoose.Schema({
    siteName: {
        type: String,
        required: true,
        unique:true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        address: {
            type: String,
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        } // [longitude, latitude]
    },
    distance: {
        type: Number
    },
    openingHours: {
        type: String
    },
    categories: {
        type: String,
        required: true
    },
    facilitiesAvailable: [{ type: String }],
    rating: { type: Number },
    images: [{ type: String }], // Array of image URLs
    videos: [{ type: String }], // Array of video URLs
    transportations: [{ type: String }]


})




module.exports = mongoose.model('Site', SiteSchema)