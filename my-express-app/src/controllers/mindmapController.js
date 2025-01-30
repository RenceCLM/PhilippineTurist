class MindmapController {
    constructor(db) {
        this.db = db;
    }

    async saveMindmap(data) {
        try {
            const newMindmapRef = this.db.ref('mindmaps').push();
            await newMindmapRef.set(data);
            return newMindmapRef.key;
        } catch (error) {
            throw new Error('Error saving mindmap: ' + error.message);
        }
    }

    async getMindmaps() {
        try {
            const snapshot = await this.db.ref('mindmaps').once('value');
            return snapshot.val() || {};
        } catch (error) {
            throw new Error('Error retrieving mindmaps: ' + error.message);
        }
    }
}

module.exports = MindmapController;