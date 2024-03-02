require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
console.log(process.env.FRONTEND_API);
const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', `${process.env.FRONTEND_API}`); // Update the origin to your frontend URL
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
  
    if (req.method === 'OPTIONS') {
        res.sendStatus(204); // Handle preflight requests
    } else {
        next();
    }
});

const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Define a route for login
app.post('/login', (req, res) => {
    // Here, you would typically validate the user's credentials
    console.log(req.body);
    const { username, password } = req.body;

    // For simplicity, let's assume the login is successful
    if (username === 'user' && password === 'password') {
        // Create a JWT with user information
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set the JWT as a cookie
        res.cookie('accessToken', token, { httpOnly: true });

        res.status(200).json({ msg: 'Login Successful' });
    } else {
        res.status(401).json({ msg: 'Invalid credentials' });
    }
});

// Protected route that requires a valid JWT
app.get('/protected', (req, res) => {
  console.log(req.headers);
    const token = req.headers['accesstoken']
    console.log(token);

    if (!token) {
        return res.status(401).json({ msg: 'failure' });
    }

    // Verify the JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ msg: 'failure' });
        }

        // If the token is valid, you can access the decoded information
        console.log('Decoded Token:', decoded);

        res.status(200).json({ msg: 'Success' });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
