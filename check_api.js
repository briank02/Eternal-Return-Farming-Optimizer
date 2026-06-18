require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

async function check() {
    const API_KEY = process.env.ER_API_KEY;
    const res = await axios.get(`https://open-api.bser.io/v1/data/Item`, {
        headers: { 'x-api-key': API_KEY, 'accept': 'application/json' }
    });
    const items = res.data.data;
    
    // Find Scythe (Axe) or Doctor's Gown
    const scythe = items.find(i => i.name === 'Scythe' || i.code === 105404 || i.name === '스퀴테');
    const gown = items.find(i => i.name === "Doctor's Gown" || i.code === 112403 || i.name === '제국의왕관');
    
    fs.writeFileSync('item_sample.json', JSON.stringify({ scythe, gown }, null, 2));
    console.log("Saved to item_sample.json");
}

check().catch(console.error);
