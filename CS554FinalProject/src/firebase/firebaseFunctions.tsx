import firebase from "firebase";

async function doCreateUserWithEmailandPassword(
  email: string,
  password: string,
  displayName: string
) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    // await firebase.auth().currentUser?.updateProfile({ displayName: displayName });
  } catch (e) {
    console.log(e);
    return e.code;
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

async function createUserData(email: string, password: string, name: string) {
  const UsersListRef = firebase.database().ref("Users");
  const newUserRef = UsersListRef.push();
  newUserRef.set({
    address: {
      city: "",
      state: "",
      street: "",
      zip: "",
    },
    dist: 1,
    email: email,
    firstName: name,
    insurance: {
      group_number: "",
      id: "",
      provider: "",
    },
    isAdmin: false,
    lastName: "Asif Uddin",
    phoneNumber: 1234567890,
    password: password,
    rabbitMQ: false,
  });
  console.log(newUserRef);
}

async function doIncrementVaccines(location: object) {}

async function doDecrementVaccines(location: object) {}

export {
  doCreateUserWithEmailandPassword,
  doChangePassword,
  doSignInWithEmailAndPassword,
  doSocialSignIn,
  doPasswordReset,
  doSignOut,
  doIncrementVaccines,
  doDecrementVaccines,
  createUserData,
};
