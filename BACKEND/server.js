const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:3000']
  : ['http://localhost:3000'];

const io = socketIO(server, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST'] }
});

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(`✅ MongoDB connected: ${mongoose.connection.name}`))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('   Make sure MongoDB is running: mongod --dbpath <your-db-path>');
  });

// Health check
app.get("/", (req, res) => res.send("Gram Panchayat API Running ✅"));

// Test endpoint
app.get("/api/test-db", async (req, res) => {
  try {
    const Certificate = require('./model/certificate');
    const User = require('./model/user');
    const Tax = require('./model/tax');
    const Complaint = require('./model/complaint');
    const Scheme = require('./model/scheme');
    const Fund = require('./model/fund');
    const counts = {
      users: await User.countDocuments(),
      certificates: await Certificate.countDocuments(),
      taxes: await Tax.countDocuments(),
      complaints: await Complaint.countDocuments(),
      schemes: await Scheme.countDocuments(),
      funds: await Fund.countDocuments()
    };
    res.json({ message: "Database connected", dbName: mongoose.connection.name, collections: counts });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/taxes', require('./routes/taxRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/schemes', require('./routes/schemeRoutes'));
app.use('/api/scheme-applications', require('./routes/schemeApplicationRoutes'));
app.use('/api/funds', require('./routes/fundRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/admin', require('./routes/adminDataRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Socket.IO
io.on('connection', socket => {
  socket.on('disconnect', () => {});
});
app.use((req, res, next) => { req.io = io; next(); });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
