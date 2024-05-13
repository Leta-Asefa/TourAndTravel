const express = require('express')
const router = express.Router()

router.get('/all', (req, res) => {
    console.log('return all admins info')
})




module.exports=router