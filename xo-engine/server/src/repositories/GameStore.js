class GameStore {
    constructor() {
        this.matches = new Map();
    }

    getMatch(matchId) {
        return this.matches.get(matchId);
    }

    createMatch(matchId, matchState) {
        this.matches.set(matchId, matchState);
        return matchState;
    }

    updateMatch(matchId, updates) {
        if (!this.matches.has(matchId)) return null;
        const current = this.matches.get(matchId);
        const updated = { ...current, ...updates };
        this.matches.set(matchId, updated);
        return updated;
    }

    deleteMatch(matchId) {
        this.matches.delete(matchId);
    }
}

module.exports = new GameStore();
