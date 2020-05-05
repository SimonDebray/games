import firebase from "firebase";

// noinspection TypeScriptUMDGlobal, ES6ModulesDependencies
/**
 * @type {firebase.app.App}
 */
export const app = firebase.initializeApp(
    {
        apiKey: 'AIzaSyD-kMF7zwrPbLjvfTV0-8GuhACIdyVPGrk',
        authDomain: `games-276217.firebaseapp.com`,
        databaseURL: `https://games-276217.firebaseio.com/`,
    },
    'games',
);

/**
 *
 * @type {firebase.database.Reference}
 */
export const ref = app.database().ref();

/**
 * Return a Google Auth Provider
 *
 * @param {Array<string>} scopes
 *
 * @return {firebase.auth.GoogleAuthProvider}
 */
export function getGoogleProvider(scopes) {
    if (!scopes || scopes.length === 0) throw new Error(`scopes needed`);
    // noinspection TypeScriptUMDGlobal, ES6ModulesDependencies
    const provider = new firebase.auth.GoogleAuthProvider();

    for (let i = 0; i < scopes.length; i++) {
        provider.addScope(scopes[i]);
    }

    return provider;
}

//</editor-fold>