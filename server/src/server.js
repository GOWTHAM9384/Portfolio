const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/contact', contactRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API is running' });
});


const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
