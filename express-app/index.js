const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts'); // Import express-ejs-layouts

const port = 3000;

// Set up view engine (in this case, using EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // Specify the default layout file

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
