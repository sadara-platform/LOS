const fs = require('fs');
const path = require('path');

// Matches are saved in the xo-engine root directory for easy access
const DB_FILE = path.join(__dirname, '../../../matches.json');

class DatabaseService {
    constructor() {
        if (!fs.existsSync(DB_FILE)) {
            fs.writeFileSync(DB_FILE, JSON.stringify([]));
        }
    }

    async saveMatch(matchRecord) {
        try {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            const matches = JSON.parse(data);
            matches.push({ ...matchRecord, timestamp: Date.now() });
            fs.writeFileSync(DB_FILE, JSON.stringify(matches, null, 2));
            console.log('Match saved to DB:', matchRecord.matchId);
        } catch (error) {
            console.error('Error saving match:', error);
        }
    }

    async getMatches() {
        try {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading matches:', error);
            return [];
        }
    }
}

module.exports = new DatabaseService();
