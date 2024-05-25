const mongoose = require('mongoose')
const TourGuideSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:
    {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique:true
    },
    languages: [{
        language: {
            type: String,
            required: true
        },
        proficiency: {
            type: String,
            required: true
        }
    }],
    experience: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    profilePicture: {
        type: String
    },
    hourlyRate: {
        type: Number,
        required: true
    },
    documents: [{ type: String }],
    status: {
        type:String
    }
})


module.exports=mongoose.model('TourGuide',TourGuideSchema)
