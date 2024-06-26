require('dotenv').config()
const cors = require('cors')
const express = require('express')
const db = require('./models')
const morgan = require('morgan')
const authController = require('./controllers/auth.controller')
const cookieParser = require('cookie-parser')
const { verifyUser } = require('./middlewares/auth')
const app = express()
app.use(cookieParser());

const PORT = process.env.PORT || 8000

db.sequelize.sync()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
}))

app.use(morgan('dev'))


app.post('/api/google-login',authController.googleLogin)
app.post('/api/signup',authController.signUp)
app.post('/api/signin',authController.signIn)
app.use('/api', verifyUser, require('./routes/routes'))




app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})