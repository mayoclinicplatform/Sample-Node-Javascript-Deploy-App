/**
 * Sample Node.js Express Server
 * 
 * Usage:
 *   npm install
 *   npm start
 * 
 * The app will be available at http://localhost:3000
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (CSS, JS, images, etc.)
app.use('/static', express.static(path.join(__dirname, 'static')));

// Set view engine for template rendering
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'html');

// Custom view engine to serve HTML files without modification
app.engine('html', (filepath, options, callback) => {
  const fs = require('fs');
  fs.readFile(filepath, 'utf-8', (err, content) => {
    if (err) return callback(err);
    return callback(null, content);
  });
});

/**
 * Main route
 * Serves the embedded.html template
 */
app.get('/', (req, res) => {
  res.render('embedded.html');
});

/**
 * Health check endpoint
 * Useful for monitoring/deployment
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Mock inference endpoint (optional)
 * This demonstrates how you could add backend logic
 */
app.get('/inference', (req, res) => {
  const mockData = `
## 🏥 Patient Readmission Risk Report

<span class="risk-score">78%</span><span class="risk-label">High Risk</span>

---

### Model Inputs

| Feature                | Value                |
|------------------------|----------------------|
| **Age**                | 72                   |
| **Sex**                | Female               |
| **Primary Diagnosis**  | Congestive Heart Failure |
| **Comorbidities**      | Hypertension, CKD    |
| **Prior Admissions**   | 3 (past year)        |
`;
  res.type('text/plain').send(mockData);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ Serving static files from /static`);
  console.log(`✓ Health check available at http://localhost:${PORT}/health`);
});
