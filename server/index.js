
const cors = require('cors')
const express = require('express')
const db = require('./models')
const morgan = require('morgan')
const authController = require('./controllers/auth.controller')
const emailController = require('./controllers/email.controller')

const cookieParser = require('cookie-parser')
const { verifyUser } = require('./middlewares/auth')
const app = express()
const { updateCorsIfNecessary } = require('./updateCors'); 
const {allowlist} = require('./utils/constants')
app.use(cookieParser());
console.log('testing console logansfkndsakfnkdsnfkdsfnjdsnfjndsnf')
console.log('process env', process.env)
const PORT = process.env.PORT || 8000



const getCorsSettings = () => {
    return {
      methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH', 'OPTIONS'],
      credentials: true,
      origin: ['http://localhost:3000', 'https://voicequant.com'],
    };
  };
  
  app.use(cors(getCorsSettings()));





db.sequelize.sync()
updateCorsIfNecessary().catch(console.error);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'))


app.post('/api/google-login',authController.googleLogin)
app.post('/api/signup',authController.signUp)
app.post('/api/signin',authController.signIn)
app.get('/api/verify-email',  emailController.verifyEmailToken)
app.use('/api', verifyUser, require('./routes/routes'))




app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})