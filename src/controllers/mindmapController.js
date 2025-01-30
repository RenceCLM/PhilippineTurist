const { collection, addDoc, getDoc, doc } = require('firebase/firestore');
const db = require('../firebaseConfig');

class MindmapController {
    async saveMindmap(data) {
        try {
            const docRef = await addDoc(collection(db, 'mindmaps'), data);
            return docRef.id;
        } catch (error) {
            throw new Error('Error saving mindmap: ' + error.message);
        }
    }

    async getMindmap(id) {
        try {
            const docRef = doc(db, 'mindmaps', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                throw new Error('No such document!');
            }
        } catch (error) {
            throw new Error('Error getting mindmap: ' + error.message);
        }
    }
}

module.exports = MindmapController;