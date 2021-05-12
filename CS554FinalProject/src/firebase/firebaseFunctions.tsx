import firebase from "firebase";

async function doCreateUserWithEmailandPassword(
  email: string,
  password: string,
  displayName: string
) {
	try{
		await firebase.auth().createUserWithEmailAndPassword(email, password)
		// await firebase.auth().currentUser?.updateProfile({ displayName: displayName });
	
	}catch(e){
		console.log(e)
		return e.code
	}

}

async function doChangePassword(
  email: string,
  oldPassword: string,
  newPassword: string
) {
  let credential = firebase.auth.EmailAuthProvider.credential(
    email,
    oldPassword
  );
  await firebase.auth().currentUser?.reauthenticateWithCredential(credential);
  await firebase.auth().currentUser?.updatePassword(newPassword);
  doSignOut();
}

async function doSignInWithEmailAndPassword(email: string, password: string) {
  await firebase.auth().signInWithEmailAndPassword(email, password);
}

async function doSocialSignIn(provider: string) {
  let socialProvider = null;
  if (provider === "google") {
    socialProvider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(socialProvider);
  } else if (provider === "facebook") {
    socialProvider = new firebase.auth.FacebookAuthProvider();
    await firebase.auth().signInWithPopup(socialProvider);
  }
}

async function doPasswordReset(email: string) {
  await firebase.auth().sendPasswordResetEmail(email);
}

async function doSignOut() {
  await firebase.auth().signOut();
}

async function doIncrementVaccines(location: object) {
  
}

async function doDecrementVaccines(location: object) {

}

export {
  doCreateUserWithEmailandPassword,
  doChangePassword,
  doSignInWithEmailAndPassword,
  doSocialSignIn,
  doPasswordReset,
  doSignOut,
  doIncrementVaccines,
  doDecrementVaccines
};
