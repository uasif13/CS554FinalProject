import { SERVER_ADDRESS } from "./constants";
import axios from "axios";

export async function sendOneMessage(reciever: string, message: string) {
    let res;
    res = await axios(
        {
            method: "post", 
            url: SERVER_ADDRESS, 
            data: {
                message: message, 
                destination: reciever
            }
        }).then((res: Object) => {
            console.log("success");
            return 0;
    }).catch(() => {
        console.log("failure");
        return -1;
    });
}

export async function sendMessageBatch(recievers: Array<String>, message: string) {
    let res: number = 0;
    for (let i = 0; i < recievers.length; i++) {
        await axios(
            {
                method: "post", 
                url: SERVER_ADDRESS, 
                data: {
                    message: message, 
                    destination: recievers[i]
                }
            }).then(() => {
                res++;
        }).catch(() => {
            res--;
        });
    }
    return res;
}