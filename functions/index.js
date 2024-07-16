const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

exports.deleteUser = functions.https.onCall(async (data, context) => {
  const userId = data.userId;

  try {
    // Firestore'dan kullanıcıyı sil
    await admin.firestore().collection('users').doc(userId).delete();

    // Authentication'dan kullanıcıyı sil
    await admin.auth().deleteUser(userId);

    return { message: 'User deleted successfully' };
  } catch (error) {
    console.error("Error deleting user: ", error);
    throw new functions.https.HttpsError('internal', 'Error deleting user');
  }
});

exports.listAllUsers = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const listUsersResult = await admin.auth().listUsers(1000);
      res.set('Access-Control-Allow-Origin', '*'); // CORS için başlık ekleyin
      res.status(200).send({ users: listUsersResult.users });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
});
