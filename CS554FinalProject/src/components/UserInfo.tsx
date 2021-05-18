import Header from "../components/Header";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../firebase/firebaseAuth";
import { Redirect, useHistory } from "react-router-dom";
import { retrieveUserData } from "../firebase/firebaseFunctions";
const myStyle={

  color: "#767676",
  backgroundColor: "#ffffff"
};

const UserInfo = () => {
  const { currentUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [memberID, setMemberID] = useState("");
  const [groupID, setGroupID] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (currentUser) {
        setName(currentUser.displayName);
        setEmail(currentUser.email);
        await retrieveUserData(currentUser.email).then((data) => {
          setMemberID(data.insurance.id);
          setGroupID(data.insurance.group_number);
          setPhoneNumber(data.phoneNumber);
        });
      }
    }

    fetchData();
    return () => {
      console.log("clean up");
    };
  });

  if (currentUser.email === "admin@stevens.edu") {
    return <Redirect to="/admin" />;
  } else {
    return (
      <div>
        <br />
        <Header
          doesGoToProfile={false}
          doesGoToScheduler={true}
          doesSignOut={true}
          doesEdit={true}
        />
        <h1>Hi {name}</h1>
        <div className="form-card">
          <h2>Here's your information</h2>

          <p style={myStyle}>Email: {email} </p>
          <p style={myStyle}>Phone Number: {phoneNumber}</p>
          <hr />
          <h3>Insurance</h3>
          <p style={myStyle}>Member ID: {memberID} </p>
          <p style={myStyle}>Group Number: {groupID}</p>
        </div>
      </div>
    );
  }
};

export default UserInfo;
