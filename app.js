const express = require('express')
const mongoose = require('mongoose')
const cookieParser=require('cookie-parser')
const app = express()
const DBURL = 'mongodb://localhost:27017/TourAndTravelAgency'
const PORT = 4000
// const DBURL='mongodb+srv://root:0991@cluster0.dkanjkl.mongodb.net/TourAndTravelAgency' //for remote database access
mongoose.connect(DBURL)
const connection = mongoose.connection
connection.on('open', () => console.log('Database Connection Established...'))

app.listen(PORT, () => console.log('Server started on port ' + PORT))
app.use(express.json())
app.use(cookieParser())

const authRouter = require('./Routes/auth.js')
app.use('/auth', authRouter)


const siteRouter = require('./Routes/site.js')
app.use('/site', siteRouter)


const visitorRouter = require('./Routes/visitor.js')
app.use('/visitor', visitorRouter)

const guideRouter = require('./Routes/guide.js')
app.use('/guide', guideRouter)

const bookRouter = require('./Routes/book.js')
app.use('/book', bookRouter)


const adminRouter = require('./Routes/admin.js')
app.use('/admin', adminRouter)












