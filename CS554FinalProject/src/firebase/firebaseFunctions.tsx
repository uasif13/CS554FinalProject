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
  console.log("updating the vaccine count:");
  try {
    let foundID: any;
    // go through and find the specific email
    await db
      .ref()
      .child("Locations")
      .on("value", (snapshot) => {
        snapshot.forEach((snap) => {
          let id = snap.key;
          let val = snap.val();
          if (val.address.city === location) {
            console.log("found address", val.address.city);
            console.log(typeof id);
            foundID = id;
          }
          return foundID;
        });
      });
    console.log(foundID);
    if (foundID === undefined) {
      throw Error("ID not found");
    } else {
      await db.ref("Locations/" + foundID).update({
        numVaccines: numVaccine,
      });
    }
  } catch (e) {
    console.log(e);
    return e;
  }
}

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
  let uid = await firebase.auth().currentUser?.uid;
  const UsersListRef = firebase.database().ref("Users/" + uid);
  UsersListRef.set({
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
    appointments: {
      booked: false,
      location: "",
    },
    isAdmin: false,
    lastName: name,
    phoneNumber: 1234567890,
    password: password,
    rabbitMQ: false,
  });
}
async function appointmentBooked(city: any) {
  try {
    let uid = await firebase.auth().currentUser?.uid;
    if (uid == null) {
      return { status: 500, message: "user not logged in" };
    }

    await db.ref("Users/" + uid).update({
      appointments: {
        booked: true,
        location: city,
      },
    });
  } catch (e) {
    console.log(e);
    return e;
  }
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

    db.ref("Users/" + uid).update({
      phoneNumber: phoneNum,
      rabbitMQ: optIn,
      dist: dist,
    });
  } catch (e) {
    return { status: 500, message: e.message };
  }

  if (optIn == true) {
    try {
      let data = await getCurrUserData();
      await sendOneMessage(
        phoneNum,
        "Vaccine Scheduler: Congrats! You have successfuly opted in for text messaging. We will update you if vaccines become available in your area.",
        data
      );
    } catch (e) {
      return { status: 500, message: "Internal message error" };
    }
  }

  return { status: 200, message: "User updated" };
}

async function getCurrUserData() {
  let uid = await firebase.auth().currentUser?.uid;
  if (uid == null) {
    return { status: 500, message: "user not logged in" };
  }

  let data: any = {};
  data = db
    .ref("Users/" + uid)
    .once("value")
    .then((snap) => {
      return snap.val();
    });

  return data;
}

async function updateInsurance(
  email: string,
  memberID: string,
  groupID: string
) {
  try {
    let uid = await firebase.auth().currentUser?.uid;
    if (uid == null) {
      return { status: 500, message: "user not logged in" };
    }

    await db.ref("Users/" + uid).update({
      insurance: {
        group_number: groupID,
        id: memberID,
      },
    });
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function helper(data: object) {
  console.log("in helper", data);
  return data;
}

async function retrieveUserData(email: string) {
  try {
    let eventResponse = await db.ref().child("Users");
    const snapshot = await eventResponse.once("value");
    let UserData: any;
    snapshot.forEach((snap) => {
      let val = snap.val();
      if (val.email === email) {
        console.log("We Found Email", val.email);
        UserData = val;
      }
    });
    return UserData;
  } catch (e) {
    console.log(e);
    return e;
  }
}

export {
  doCreateUserWithEmailandPassword,
  doChangePassword,
  doSignInWithEmailAndPassword,
  doSocialSignIn,
  doPasswordReset,
  helper,
  doSignOut,
  doUpdateVaccineCount,
  doUpdateUserPhoneAndDist,
  getCurrUserData,
  createUserData,
  updateInsurance,
  retrieveUserData,
  appointmentBooked,
};
