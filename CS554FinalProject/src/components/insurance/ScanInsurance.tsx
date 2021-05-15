import React, { useEffect, useState, useContext } from "react";
import { makeStyles, Button, TextField } from "@material-ui/core";
import Tesseract from "tesseract.js";
import Jimp from "jimp";
import { AuthContext } from "../../firebase/firebaseAuth";
import { db } from "../../firebase/firebaseServer";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  button: {
    background: "#3D4CBC",
    color: "white",
  },
  buttonRows: {
    display: "inline-block",
    margin: "10px",
  },
  root: {
    "& > *": {
      margin: "12px",
      width: "25ch",
    },
  },
  fileUploader: {
    width: "25ch",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    position: "relative",
  },
  p: {
    color: "red",
  },
});
interface UpdateObject {
  [key: string]: any;
}
let dummy = {
  "/Users/-M_kW1GoiemugvaidvDC": {
    address: { city: "", state: "", street: "", zip: "" },
    dist: 1,
    email: "uasif13@gmail.com",
    firstName: "Asif Uddin",
    insurance: { group_number: "§18", id: "§18", provider: "" },
    isAdmin: true,
    lastName: "Asif Uddin",
    password: "Test123",
    phoneNumber: 1234567890,
    rabbitMQ: false,
  },
};
const ScanInsurance = () => {
  const { currentUser } = useContext(AuthContext);
  const [updates, setUpdates] = useState<UpdateObject>({});
  const classes = useStyles();

  const [upload, setUpload] = useState("");
  const [extractedText, setExtractedText] = useState<Array<String>>([]);

  const [error, setError] = useState(false);
  const [userUpload, setUserUpload] = useState(true);
  const [progress, setProgress] = useState(false);
  const [finished, setFinished] = useState(false);
  const [JIMPuploading, setJIMPUploading] = useState(false);
  const [reset, setReset] = useState(false);

  const [memberID, setMemberID] = useState("");
  const [groupNum, setGroupNum] = useState("");
  let updateVer: UpdateObject = {};

  useEffect(() => {
    async function fetchData() {
      setProgress(false);
      setUserUpload(false);
      setFinished(false);
      setJIMPUploading(false);
      setExtractedText([]);
      setMemberID("");
      setGroupNum("");
    }
    fetchData();
  }, [reset]);

  const uploadImage = async (picture: any) => {
    console.log("Uploaded Image");
    if (picture.length === 0) {
      setUserUpload(false);
      setExtractedText([]);
      setMemberID("");
      setGroupNum("");
    } else {
      setJIMPUploading(true);
      let url = URL.createObjectURL(picture.target.files[0]);
      await Jimp.read(url)
        .then((image) => {
          return image
            .quality(60)
            .greyscale()
            .getBase64(Jimp.MIME_JPEG, function (err, src) {
              setUpload(src);
              setUserUpload(true);
              setJIMPUploading(false);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const extractInsuranceCard = () => {
    console.log("Extracting Insurance Card");
    if (upload) {
      setProgress(true);
      Tesseract.recognize(upload, "eng", {
        logger: (m) => console.log(m),
      }).then(({ data: { text } }) => {
        let cleanedText = text.replace(/\n/g, " ").split(" ");
        cleanedText = cleanedText.filter(
          (word) => word !== "" && /\d/.test(word)
        );

        setExtractedText(cleanedText);
        setProgress(false);
        setFinished(true);
      });
    } else {
      setError(true);
    }
  };
  const handleSetMemberID = (memberID: string) => {
    console.log("Handling Member ID", memberID);
    setMemberID(memberID);
  };

  const handleSetGroupNumber = (groupNum: string) => {
    console.log("Handling Group Number", groupNum);
    setGroupNum(groupNum);
  };

  const firebaseUpdate = async (userEmail: string) => {
    try {
      db.ref("Users").on("value", (snapshot) => {
        snapshot.forEach((snap) => {
          if (snap.val().email === userEmail) {
            let userData = snap.val();
            let userKey = snap.key;
            console.log("snap key", userKey);
            console.log("snap value", userData);
            userData.insurance.group_number = groupNum;
            userData.insurance.id = memberID;
            console.log("after update", userData);
            updateVer["/Users/" + userKey] = userData;
            console.log("Update Variable", updateVer);
            setUpdates(updateVer);
            console.log("Update State", updates);
          }
        });
      });
    } catch (e) {
      alert(e);
    }
  };
  const pushToFireBase = () => {
    console.log("Push to firebase");
    setReset(true);
    if (currentUser) {
      firebaseUpdate(currentUser.email);
      console.log("Update State", updates);
      return db.ref().update(updates);
    }
    // TODO: call to firebase to upload member id (need user to be logged in)
    // TODO: call to firebase to upload group number (need user to be logged in)
  };

  const clearStates = () => {
    console.log("Clearing States");
    setReset(true);
  };

  const buildButtons = (text: any, index: number, item: number) => {
    return (
      <div className={classes.buttonRows} key={index}>
        <Button
          variant="outlined"
          onClick={() => {
            item === 1 ? handleSetMemberID(text) : handleSetGroupNumber(text);
          }}
        >
          {text}
        </Button>
      </div>
    );
  };

  if (error) {
    return (
      <div>
        <h1>Errors</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Scan Insurance Card</h1>
      <div className="form-card">
        <div className={classes.fileUploader}>
          <Button
            variant="contained"
            component="label"
            className={classes.button}
            disabled={userUpload}
          >
            Upload Card
            <input
              type="file"
              id="fileUploader"
              accept="image/x-png,image/jpeg"
              hidden
              onChange={uploadImage}
            />
          </Button>
        </div>
        <br />
        <div id="JIMPProgress">
          {JIMPuploading ? "...uploading insurance card..." : ""}
        </div>
        <br />
        <div>
          <Button
            variant="contained"
            className={classes.button}
            onClick={extractInsuranceCard}
            classes={{ disabled: classes.button }}
            disabled={!userUpload || (finished && userUpload && !progress)}
          >
            Scan Card
          </Button>
          <br />
          <div id="progress">
            {!finished ? (
              userUpload && progress ? (
                <h6>
                  ...please wait...
                  <br />
                  ...extracting text...
                </h6>
              ) : (
                ""
              )
            ) : (
              <div>
                <br />
                <h6>Completed</h6>
              </div>
            )}
          </div>
          <hr />
          <div>
            <section className="memberID">
              <div>
                <h2>What is your member ID? </h2>
                <div>
                  <form className={classes.root} noValidate autoComplete="off">
                    <TextField
                      id="standard-basicScanMI"
                      required
                      value={memberID}
                      disabled={!finished}
                      aria-disabled="true"
                      label="MemberIDScan"
                    />
                  </form>
                </div>
                {extractedText.map((text, index) => {
                  let item = 1;
                  return buildButtons(text, index, item);
                })}
              </div>
            </section>

            <section className="group plan">
              <div>
                <h2>What is your group number? </h2>
                <div>
                  <form className={classes.root} noValidate autoComplete="off">
                    <TextField
                      id="standard-basicGNScan"
                      required
                      value={groupNum}
                      disabled={!finished}
                      aria-disabled="true"
                      label="GroupNumberScan"
                    />
                  </form>
                </div>
                {extractedText.map((text, index) => {
                  let item = 2;
                  return buildButtons(text, index, item);
                })}
              </div>
            </section>
          </div>
          <br />
          <br />
          <div className={classes.buttonRows}>
            <Button
              variant="contained"
              className={classes.button}
              disabled={!finished}
              onClick={clearStates}
            >
              Reset
            </Button>
            <br />
            <br />
            <Button
              variant="contained"
              className={classes.button}
              disabled={!finished}
              onClick={pushToFireBase}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanInsurance;
