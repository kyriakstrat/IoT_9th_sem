const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts'); // Import express-ejs-layouts
const checkSessionMiddleware = require('./middleware/checkSession');
const fetchDataMiddleware = require('./middleware/fetchDataMiddleware');
const cron = require('node-cron');

const cors = require('cors');

const port = 3000;


// Set up view engine (in this case, using EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // Specify the default layout file

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up session middleware
app.use(
    session({
      secret: 'ahoooSecr1ttt', // Change this to a secure secret
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(cors());
  
// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Schedule fetchDataMiddleware to run every minute
cron.schedule('*/1 * * * * *', async () => {
  console.log('Running fetchDataMiddleware...');
  await fetchDataMiddleware();
});
// Use routes

const indexRoutes = require('./routes/index');
const loginRoutes = require('./routes/login');
const profileRoutes = require('./routes/profile');
const logRoutes = require('./routes/logs');


app.use('/login',loginRoutes);
app.use(checkSessionMiddleware);
app.use('/', indexRoutes);
app.use('/profile',profileRoutes);
app.use('/logs',logRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
