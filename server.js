const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db.js');
const complaintRoutes = require('./routes/complaintRoutes.js');
const app = express();

app.use(express.json());

// Routes
app.use('/api/complaints', complaintRoutes);

// Root Endpoint Check
app.get('/', (req, res) => {
  res.send({ message: 'Campus Complaint Tracker API is running...' });
});

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Endpoint Not Found' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error(`database connection error: ${error.message}`);
  process.exitCode = 1;
});