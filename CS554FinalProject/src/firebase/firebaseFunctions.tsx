import firebase from "firebase";
import { db } from "./firebaseServer";
import { sendOneMessage } from "../messaging/message";

async function doCreateUserWithEmailandPassword(
  email: string,
  password: string,
  displayName: string
) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    await firebase
      .auth()
      .currentUser?.updateProfile({ displayName: displayName });
  } catch (e) {
    console.log(e);
    return e;
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
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  } catch (e) {
    console.log(e);
    return e;
  }
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

async function doUpdateVaccineCount(location: string, numVaccine: number) {
  console.log('updating the vaccine count:');
  try{
    let foundID: any;
    // go through and find the specific email 
    await db.ref().child("Locations").on("value", (snapshot) =>{
      snapshot.forEach((snap) => {
        let id = snap.key;
        let val = snap.val();
        if (val.address.city === location){
          console.log("found address", val.address.city)
          console.log(typeof id)
          foundID = id;
        }	
        return foundID
      });
    })
    console.log(foundID);
    if(foundID === undefined){
      throw Error("ID not found")
    }else{
    await db.ref('Locations/' + foundID).update({
      numVaccines: numVaccine
      }
    )};
}catch(e)
{
  console.log(e);
  return e 
}}
  

async function doPasswordReset(email: string) {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
  } catch (e) {
    console.log(e);
    return e;
  }
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
    lastName: name,
    phoneNumber: 1234567890,
    password: password,
    rabbitMQ: false,
  });
}

async function doUpdateUserPhoneAndDist(
  phoneNum: string,
  dist: string,
  optIn: boolean
) {
  try {
    let uid = await firebase.auth().currentUser?.uid;
    if (uid == null) {
      return { status: 500, message: "user not logged in" };
    }

    let data: any = {};
    await db.ref("Users/" + uid).on("value", (snap) => {
      data = snap.val();
    });

    if (data == {}) {
      return { status: 500, message: "no user found in db with that id" };
    }

    let obj = {
      address: {
        city: data.address.city,
        state: data.address.state,
        street: data.address.street,
        zip: data.address.zip,
      },
      dist: dist,
      email: data.email,
      firstName: data.firstName,
      insurance: {
        group_number: data.group_number,
        id: data.id,
        provider: data.provider,
      },
      isAdmin: data.isAdmin,
      lastName: data.lastName,
      phoneNumber: phoneNum,
      rabbitMQ: optIn,
    };

    let newPostKey = db.ref().child("Users").push().key;
    let updates: any = {};
    updates["/Users/" + newPostKey] = obj;
    updates["/Users/" + uid + "/" + newPostKey] = obj;

    await db.ref().update(updates);
  } catch (e) {
    return { status: 500, message: e.message };
  }

  if (optIn == true) {
    await sendOneMessage(
      phoneNum,
      "Vaccine Scheduler: Congrats! You have successfuly opted in for text messaging. We will update you if vaccines become available in your area."
    );
  }

  return { status: 200, message: "success" };
}

async function getCurrUserData() {
  let uid = await firebase.auth().currentUser?.uid;
  if (uid == null) {
    return { status: 500, message: "user not logged in" };
  }

  let data: any = {};
  await db.ref("Users/" + uid).on("value", (snap) => {
    data = snap.val();
  });

  return data;
}

export {
  doCreateUserWithEmailandPassword,
  doChangePassword,
  doSignInWithEmailAndPassword,
  doSocialSignIn,
  doPasswordReset,
  doSignOut,
  doUpdateVaccineCount,
  doUpdateUserPhoneAndDist,
  getCurrUserData,
  createUserData,
};

