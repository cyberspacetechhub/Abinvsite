require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const {logger} = require('./middlewares/logEvents');
const errorLogger = require('./middlewares/errorLogger');
const verifyJWT = require('./middlewares/verifyJwt');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/connectDb');
const axios = require('axios');

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const credentials = require('./middlewares/credentials');
const verifyJwt = require('./middlewares/verifyJwt');
const tradeCronJob = require('./jobs/settleTrade');

const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

app.use(logger);

app.use(credentials)
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));

app.get('/admin/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'adminsignup.html'));
});

app.use('/api/register', require('./routes/register'))
app.use('/api/login', require('./routes/login'))
app.use('/api/logout', require('./routes/logout'))
app.use('/api/refresh', require('./routes/refresh'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/investmentplan', require('./routes/investmentplan'))
app.use('/api/email', require('./routes/email'));
app.use('/api/resend', require('./routes/resend'));
// Add logging middleware for trade routes
// Remove trade routes from here - moved to protected section
app.use('/api/inappmessage', require('./routes/inappmessage'))
app.use('/api/user', require('./routes/api/user'))
app.use('/api/messagereq', require('./routes/messagereq'))
app.use('/api/unlock', require('./routes/unlock'))
// Express backend route
app.get('/api/crypto-news', async (req, res) => {
    try {
      const response = await axios.get('https://finnhub.io/api/v1/news?category=crypto&token=d0cb9d1r01ql2j3c256gd0cb9d1r01ql2j3c2570');
    //   console.log(response);
      res.json(response.data);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching news");
    }
  });
  
app.use(verifyJwt);
app.use('/api/client', require('./routes/client'))
app.use('/api/mining-machines', require('./routes/miningMachine'))
app.use('/api/trade', require('./routes/trade'))
app.use('/api/withdrawal', require('./routes/withdrawal'))
app.use('/api/deposit', require('./routes/deposit'))
app.use('/api/depositmethod', require('./routes/depositmethod'))
app.use('/api/withdrawal-account', require('./routes/userWithdrawalAccount'))
app.use('/api/investment', require('./routes/investment'))
app.use('/api/transaction', require('./routes/transactions'))
app.use('/api/kyc', require('./routes/kyc'))
app.use('/api/withdrawal-auth', require('./routes/withdrawalAuth'))
app.use('/api/notifications', require('./routes/notifications'))
app.use('/api/service-requests', require('./routes/serviceRequest'))
app.use('/api/upload', require('./routes/upload'))

app.get('*/', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

app.use(errorLogger);

// AppError handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message || 'Internal Server Error' });
});

mongoose.connection.once('open', async () => {
    // console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});