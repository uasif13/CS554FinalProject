import React, {useEffect, useState} from 'react'; 
import { makeStyles, Button, TextField, FormControl,FormControlLabel, FormLabel, RadioGroup, Radio } from '@material-ui/core'; 
import Tesseract from 'tesseract.js';
import ImageUploader from 'react-images-upload';
import "../components.css";


const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    button:{
      background: '#3D4CBC',
      color: 'white'
    }, 
    buttonRows:{
        display: 'inline-block',
        margin: '10px'
    }, 
    root: {
        '& > *': {
          margin: '12px',
          width: '25ch',
        },
    },
    fileUploader:{
        width: '25ch',
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'center',
        margin: 'auto', 
        position: 'relative'
    },
    p:{
        color: 'red'
    }

});

const ScanInsurance =() =>{
    const classes = useStyles();

    const [upload, setUpload] = useState(""); 
    const [extractedText, setExtractedText] = useState<Array<String>>([]);
    
    const [error, setError] = useState(false); 
    const [userUpload, setUserUpload] = useState(true); 
    const [progress, setProgress] = useState(false);
    const [finished, setFinished] = useState(false)

    const [memberID, setMemberID] = useState(""); 
    const [groupNum, setGroupNum] = useState(""); 


    useEffect(() =>{
        async function fetchData(){
            setProgress(false); 
            setUserUpload(false); 
            setFinished(false); 
        }
        fetchData();
    }, []);

    
    const uploadImage = (picture: any) =>{
        console.log("Uploaded Image"); 
        console.log("Image: ", picture)
        if (picture.length === 0){
            setUserUpload(false); 
            setExtractedText([]);
            setMemberID(""); 
            setGroupNum("");
        }else{

            // TODO Convert Image to BW 

            setUserUpload(true); 
            setUpload(picture[0]); 
        }
    };

    const extractInsuranceCard = () =>{
        console.log("Extracting Insurance Card");
        if (upload){
            setProgress(true); 
            Tesseract.recognize(
                upload,
                'eng',
                { logger: m => console.log(m) }
              ).then(({ data: { text } }) => {

                    let cleanedText = text.replace(/\n/g,' ').split(' ');
                    cleanedText = cleanedText.filter( word => (word !== "" && /\d/.test(word)));

                    setExtractedText(cleanedText);
                    setProgress(false);
                    setFinished(true); 
              });
        }else{
            setError(true);
        }      
    };
    const handleSetMemberID = (memberID: string) => {
        console.log("Handling Member ID", memberID);
        setMemberID(memberID); 
        // TODO: call to firebase to upload member id (need user to be logged in)
    };

    const handleSetGroupNumber = (groupNum: string) =>{
        console.log("Handling Group Number", groupNum); 
        setGroupNum(groupNum);
        // TODO: call to firebase to upload group number (need user to be logged in)
    };

    const buildButtons = (text: any, index: number, item: number) =>{
        return(
                <div className= {classes.buttonRows} key={index}>
                     <Button 
                        variant="outlined" 
                        onClick ={ () => {
                            (item === 1) ?  
                                handleSetMemberID(text) : 
                                handleSetGroupNumber(text) }}>
                        {text}
                    </Button> 
                </div>            
        );
    };

    if (error){
        return(
            <div>
                <h1>Errors</h1>
            </div>
        )
    }

    return(
        <div>
            <h1>Scan Insurance Card</h1>
            <div className="form-card">
                <h6>*only works with black/white images*</h6>
            <div className={classes.fileUploader}>
                <ImageUploader 
                    withIcon = {true}
                    withPreview = {true}
                    buttonText="Choose Image"
                    onChange={uploadImage}
                    imgExtension={[".jpg", ".png"]}
                    maxFileSize={5242880}/>
            </div>

            <div>
                <Button variant="contained" 
                        className={classes.button} 
                        onClick={extractInsuranceCard}
                        disabled={!userUpload}>
                        Scan Card
                </Button>  
                <div id="progress">
                    {!(finished) ? 
                        (userUpload && progress) ? 
                            <h6>...please wait...<br/>
                            ...extracting text..."</h6> : 
                            <h6 className="required">*Upload Image*</h6> : 
                            "Completed"} 
                </div>
                <hr/>
                <div>
                    <section className="memberID">
                        <div>
                            <h4>What is your member ID?  </h4>
                            <div>
                                <form className={classes.root} noValidate autoComplete="off">
                                    <TextField id="standard-basic" required value={memberID} disabled={!finished}label="Member ID" />
                                </form>
                            </div>
                            {extractedText.map((text, index) =>{
                                let item = 1; 
                                return buildButtons(text, index, item);
                            })}
                        </div>
                    </section>

                    <section className="group plan">
                        <div>
                            <h4>What is your group number? </h4>
                            <div>
                                <form className={classes.root} noValidate autoComplete="off">
                                    <TextField id="standard-basic" required value={groupNum}disabled={!finished}label="Group Number" />
                                </form>
                            </div>
                            {extractedText.map((text, index) =>{
                                    let item = 2; 
                                    return buildButtons(text, index, item);
                            })}
                        </div>
                    </section>
                </div>
                <br/>
                <br/>
                <Button variant="contained" 
                    className={classes.button} 
                    disabled={!finished}>
                    Submit
                </Button> 
            </div>
            </div>
           
        </div>
    )
}; 

export default ScanInsurance; 