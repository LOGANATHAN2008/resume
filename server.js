const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const UAParser = require('ua-parser-js');

const app = express();
const PORT = 3000;

app.use(cors());
// Increase payload limit for PDF base64 strings
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const DB_FILE = path.join(__dirname, 'database.json');
const ANALYTICS_FILE = path.join(__dirname, 'analytics.json');
const RESUMES_DIR = path.join(__dirname, 'saved_resumes');
const SETTINGS_FILE = path.join(__dirname, 'settings.json');

// Ensure database and directory exist
if (!fs.existsSync(RESUMES_DIR)) fs.mkdirSync(RESUMES_DIR);
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify([]));
if (!fs.existsSync(ANALYTICS_FILE)) fs.writeFileSync(ANALYTICS_FILE, JSON.stringify([]));
if (!fs.existsSync(SETTINGS_FILE)) fs.writeFileSync(SETTINGS_FILE, JSON.stringify({ maintenance: false, message: "We'll be back soon! Working on something amazing...", backTime: "Tomorrow 9:00" }));

// Helpers
const readDB = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeDB = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// Maintenance middleware
app.use((req, res, next) => {
    // Only intercept the main page (allow admin and api)
    if (req.path === '/' || req.path === '/resume-builder.html' || req.path === '/index.html') {
        const settings = readDB(SETTINGS_FILE);
        if (settings.maintenance) {
            return res.send(`
                <!DOCTYPE html>
                <html><head><title>Under Maintenance</title>
                <style>
                    body { background: #0b0f19; color: white; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; flex-direction: column; }
                    h1 { margin-bottom: 10px; font-size: 1.5rem; font-weight: 600; }
                    p { color: #8b9bb4; font-size: 0.9rem; margin-top: 5px; }
                    .icon { font-size: 2.5rem; color: #00e5ff; margin-bottom: 20px; }
                    .back-time { color: #00e5ff; font-size: 0.85rem; font-weight: 500; margin-top: 15px; display: inline-flex; align-items: center; gap: 6px; }
                    .ig-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color: white; text-decoration: none; padding: 10px 20px; border-radius: 50px; font-weight: 600; font-size: 0.9rem; margin-top: 25px; transition: transform 0.2s; box-shadow: 0 4px 15px rgba(220, 39, 67, 0.4); }
                    .ig-btn:hover { transform: scale(1.05); }
                </style>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                </head><body>
                <div>
                    <div class="icon"><i class="fa-solid fa-wrench"></i></div>
                    <h1>Under Maintenance</h1>
                    <p>${settings.message || "We'll be back soon!"}</p>
                    ${settings.backTime ? `<div class="back-time"><i class="fa-solid fa-clock"></i> ${settings.backTime}</div>` : ''}
                    <br>
                    <a href="https://ig.me/m/loganathanm.in" onclick="navigator.clipboard.writeText('hi!! Under Maintenance\\nresume.loganathanm.in');" class="ig-btn" target="_blank" title="Auto-copies 'hi!! Under Maintenance' to clipboard">
                        <i class="fa-brands fa-instagram" style="font-size: 1.1rem;"></i> Contact on Instagram
                    </a>
                </div>
                </body></html>
            `);
        }
    }
    next();
});

// Serve frontend static files
app.use(express.static(__dirname));

// Route root to the builder page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'resume-builder.html'));
});

// Analytics tracking endpoint
app.post('/api/track-visitor', async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        const parser = new UAParser(userAgent);
        const result = parser.getResult();

        // Default values for localhost or unknown
        let location = { country: 'Local', city: 'Unknown', lat: 0, lon: 0, flag: '🌍' };

        try {
            // Only fetch if it's a real IP
            if (ip && !ip.includes('127.0.0.1') && !ip.includes('::1')) {
                const geoRes = await fetch(`http://ip-api.com/json/${ip.split(',')[0]}`);
                const geo = await geoRes.json();
                if (geo.status === 'success') {
                    location = {
                        country: geo.country,
                        city: geo.city,
                        lat: geo.lat,
                        lon: geo.lon,
                        countryCode: geo.countryCode ? geo.countryCode.toLowerCase() : 'unknown'
                    };
                }
            } else {
                location = { country: 'India', city: 'Bengaluru', lat: 12.9716, lon: 77.5946, countryCode: 'in' }; // Mock local IP to India for testing
            }
        } catch (e) {
            console.error('Geoloc failed', e.message);
        }

        const analytics = readDB(ANALYTICS_FILE);
        const visitor = {
            id: Date.now().toString(),
            ip: ip,
            os: result.os.name || 'Unknown OS',
            browser: result.browser.name || 'Unknown Browser',
            device: result.device.type === 'mobile' ? 'Mobile' : 'Desktop',
            location: location,
            timestamp: new Date().toISOString()
        };

        analytics.push(visitor);
        // Keep last 1000 to prevent bloat
        if (analytics.length > 1000) analytics.shift();
        writeDB(ANALYTICS_FILE, analytics);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Tracking failed' });
    }
});

app.get('/api/admin/analytics', (req, res) => {
    res.json(readDB(ANALYTICS_FILE));
});

// API to save resume
app.post('/api/save-resume', (req, res) => {
    try {
        const { name, email, pdfData } = req.body;
        if (!pdfData) return res.status(400).json({ error: 'No PDF data provided' });

        const timestamp = new Date().toISOString();
        const safeName = (name || 'Unknown').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${safeName}_${Date.now()}.pdf`;
        const filepath = path.join(RESUMES_DIR, filename);

        const base64Data = pdfData.substring(pdfData.indexOf('base64,') + 7);
        fs.writeFileSync(filepath, base64Data, 'base64');

        const db = readDB(DB_FILE);
        db.push({
            id: Date.now().toString(),
            name: name || 'Unknown User',
            email: email || 'No Email',
            filename: filename,
            date: timestamp
        });
        writeDB(DB_FILE, db);

        console.log(`Saved new resume for ${name}: ${filename}`);
        res.json({ success: true, message: 'Resume saved to Admin panel' });

    } catch (error) {
        console.error('Error saving resume:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API to get all downloads for Admin Panel
app.get('/api/admin/downloads', (req, res) => {
    try {
        const db = readDB(DB_FILE);
        db.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(db);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read database' });
    }
});

// API to download a specific PDF
app.get('/api/admin/download-pdf/:filename', (req, res) => {
    const filepath = path.join(RESUMES_DIR, req.params.filename);
    if (fs.existsSync(filepath)) {
        res.sendFile(filepath);
    } else {
        res.status(404).send('File not found');
    }
});

// Settings Endpoints
app.get('/api/admin/settings', (req, res) => {
    try {
        res.json(readDB(SETTINGS_FILE));
    } catch (e) {
        res.status(500).json({ error: 'Failed to read settings' });
    }
});

app.post('/api/admin/settings', (req, res) => {
    try {
        writeDB(SETTINGS_FILE, req.body);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
