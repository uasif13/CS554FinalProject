import { SERVER_ADDRESS } from "./constants";
import axios from "axios";
import { db } from "../firebase/firebaseServer";


export async function sendOneMessage(reciever: string, message: string, userdata: any) {

    if (userdata.rabbitMQ == false) {
        return {status: 200, message: "User not opted in for text"};
    }

    if (userdata.phoneNumber == "1234567890") {
        return {status: 400, message: "Please update your phone number in user settings"};
    }

    let res;
    res = await axios(
        {
            method: "post", 
            url: SERVER_ADDRESS, 
            data: {
                message: message, 
                destination: reciever
            }
        }).then(() => {
            return {status: 200, message: "Success"};
    }).catch(() => {
        console.log("failure");
        return {status: 500, message: "Internal error"};
    });
}

export async function sendMessageBatch(message: string) {
    try {
        await db.ref().child("Users").on("value", (snapshot) =>{
            snapshot.forEach((snap) => {
              let val = snap.val();
              let phone = val.phoneNumber;
              if (phone && phone != "1234567890")
                sendOneMessage(phone, message, val);
            });
          })
    } catch (e) {
        return {status: 500, message: "Internal error"};
    }

    return {status: 200, message: "Batch sent"};
}
