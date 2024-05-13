const mongoose = require('mongoose')
const BookSchema = mongoose.Schema({
    
    visitors: [{
        type: String,
        required:true
    }],
    date: {
        type: String,
        required: true
    },
    isPrivate: {
        type: Boolean,
        required: true
    },
    siteName: {
        type: String,
        required: true
    },
    guidePhoneNumber: {
          type: String,
          required: true
       
    },
    status: {
        type: String,
        enum:['Shceduled','Completed'],
        required:true
    }
})


module.exports = mongoose.model('Book', BookSchema)
