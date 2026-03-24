require('dotenv').config();
const express = require('express');
const Mailjet = require('node-mailjet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('./')); // Serve index.html at http://localhost:3000

// ── Mailjet Connection
let mailjet;
try {
    if (process.env.MAILJET_API && process.env.MAILJET_SECRET) {
        mailjet = Mailjet.apiConnect(process.env.MAILJET_API, process.env.MAILJET_SECRET);
    } else {
        console.warn('Mailjet API keys not found in environment variables.');
    }
} catch (error) {
    console.warn('Initial Mailjet connection failed:', error.message);
}



app.listen(PORT, () => {
    console.log(`\n  CodeNiti server running at http://localhost:${PORT}\n`);
});
