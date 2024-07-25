
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


// const allowlist = ['http://localhost:3000', 'http://example1.com', 'http://example2.com']; // add more domains as needed


const getCorsSettings = () => {
    // const allowlist = [
    //   'https://sales1.heycoach.in',
    //   'https://sales.heycoach.in',
    //   'https://api.heycoach.in',
    //   'https://staging-sales.heycoach.in',
    // ];
  
    /**
     * Origin: true => CORS is allowed
     * Origin: false => CORS is completely removed, and `Same-Origin-Policy` will be invoked.
     *
     * Reference: https://expressjs.com/en/resources/middleware/cors.html#:~:text=for%20all%20routes.-,Configuring%20CORS%20Asynchronously,-var%20express%20%3D
     */
    // const corsOptionsDelegate = (req, callback) => {
    //   const corsOptions = {};
    //   corsOptions.origin = allowlist.indexOf(req.header('Origin')) !== -1;
    //   callback(null, corsOptions);
    // };
  
    // FE server will run on a different port in the development mode
    // if (isDevelopmentMode()) {
      return {
        methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH', 'OPTIONS'],
        credentials: true,
        origin: ['http://localhost:3000', 'http://35.239.201.94:3000'],
      };
    // }
  
    return corsOptionsDelegate;
  };

function isDevelopmentMode() {
    return process.env.ENVIRONMENT == 'DEV';
  }


db.sequelize.sync()
app.use(cors(getCorsSettings()));
const allowedOrigins = ['http://localhost:3000'];
updateCorsIfNecessary().catch(console.error);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({
//     origin: '*', 
//     credentials: true,
//     methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
// }))

// app.use(cors({
//     origin: (origin, callback) => {
//         console.log('origin', origin)
//         console.log('allowedOrigins.includes(origin)', allowedOrigins.includes(origin))
//         console.log('origin', !origin)
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('CORS policy does not allow this origin'), false);
//         }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
// }));



// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;
//   if (allowlist.indexOf(req.header('Origin')) !== -1) {
//     console.log('insied if condition')
//     corsOptions = { origin: true, credentials: true }; // Enable the requested origin and allow credentials
//   } else {
//     corsOptions = { origin: false }; // Disable CORS for this request
//   }
//   console.log('corsOptions', corsOptions)
//   callback(null, corsOptions); // callback expects two parameters: error and options
// }

app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.status(200).send('<body>Welcome</body>');
})
app.post('/api/google-login',authController.googleLogin)
app.post('/api/signup',authController.signUp)
app.post('/api/signin',authController.signIn)
app.get('/  verify-email',  emailController.verifyEmailToken)
app.use('/api', verifyUser, require('./routes/routes'))




app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})