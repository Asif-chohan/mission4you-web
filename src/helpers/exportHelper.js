import { firestore } from '../config/FirebaseManager';
export const getAllPlayers = async (collectionName) => {
  return new Promise(async function (resolve, reject) {
    try {
      const snapshot = await firestore.collection(collectionName).get();
      let jsonArr = [];

      snapshot.forEach((p) => {
        let singleObject = p.data();

        jsonArr.push(singleObject);
      });

      resolve([jsonArr, null]);
    } catch (e) {
      reject(e);
    } finally {
    }
  });
};


