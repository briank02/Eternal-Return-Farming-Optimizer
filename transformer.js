const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf8');

// Remove express, cors, rate-limit, and app initialization
code = code.replace(/const express[\s\S]*?const API_KEY = process.env.ER_API_KEY;/m, "const fs = require('fs');\nconst path = require('path');\nconst API_KEY = process.env.ER_API_KEY;");

// Replace the app.get('/api/data', ...) with a simple function call to buildData() and write to file
code = code.replace(/app\.get\('\/api\/data'[\s\S]*/m, `buildData().then(data => {
    fs.writeFileSync(path.join(__dirname, 'docs', 'data.json'), JSON.stringify(data, null, 2));
    console.log('Successfully wrote docs/data.json!');
}).catch(err => {
    console.error('Error:', err);
});`);

fs.writeFileSync('build-data.js', code);
console.log('build-data.js created successfully.');
