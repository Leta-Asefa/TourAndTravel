const mongoose = require('mongoose')
const VisitorSchema = mongoose.Schema({
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
    startingDate: {
        type: String,
        required: true
    },
    endingDate: {
        type: String,
        required: true
    },
    bookingStatus: {
        type: String,
        enum: ['Confirmed', 'Pending', 'Cancelled'],
        required: true
    },
    emergencyContact: {
        name: {
            type: String,
            required: true
        },
        relationship: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        }
    }
})


module.exports = mongoose.model('Visitor', VisitorSchema)
