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