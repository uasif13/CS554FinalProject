import React, { useEffect, useState, useContext } from "react";
import { makeStyles, Button, TextField, Divider} from '@material-ui/core'; 
import CircularProgress, { CircularProgressProps } from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Tesseract from 'tesseract.js';
import Jimp from 'jimp';
import {updateInsurance} from '../../firebase/firebaseFunctions';
import { AuthContext } from "../../firebase/firebaseAuth";
import { useHistory } from "react-router-dom";

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

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
	return (
	  <Box position="relative" display="inline-flex">
		<CircularProgress variant="determinate" {...props} />
		<Box
		  top={0}
		  left={0}
		  bottom={0}
		  right={0}
		  position="absolute"
		  display="flex"
		  alignItems="center"
		  justifyContent="center"
		>
		  <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
			props.value,
		  )}%`}</Typography>
		</Box>
	  </Box>
	);
  }

const ScanInsurance =() =>{
    const classes = useStyles();
    const [upload, setUpload] = useState(""); 
    const [extractedText, setExtractedText] = useState<Array<String>>([]);
    const [error, setError] = useState(""); 
    const [userUpload, setUserUpload] = useState(true); 
    const [progress, setProgress] = useState(false);
    const [finished, setFinished] = useState(false)
    const [JIMPuploading, setJIMPUploading] = useState(false)
    const [reset, setReset] = useState(false);
	const { currentUser } = useContext(AuthContext);
    const [memberID, setMemberID] = useState(""); 
    const [groupNum, setGroupNum] = useState(""); 
	const [progressCircle, setProgressCircle] = useState(0)
	const history = useHistory();

    useEffect(() =>{
        async function fetchData(){
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

    
    const uploadImage = async (picture: any) =>{
        console.log("Uploaded Image"); 
        if (picture.length === 0){
            setUserUpload(false); 
            setExtractedText([]);
            setMemberID(""); 
            setGroupNum("");
        }else{
            setJIMPUploading(true); 
            let url = URL.createObjectURL(picture.target.files[0])
            await Jimp.read(url)
                        .then(image =>{
                            return image
                            .quality(60)                 
                            .greyscale()              
                            .getBase64(Jimp.MIME_JPEG, function (err, src) {
                                setUpload(src); 
                                setUserUpload(true); 
                                setJIMPUploading(false); 
                        });
                        }).catch(err => {
                            console.log(err); 
                        });
        }
    };

    const extractInsuranceCard = () =>{
        console.log("Extracting Insurance Card");
        if (upload){
            setProgress(true); 
            Tesseract.recognize(
                upload,
                'eng',
                { logger: m => {
					console.log(m) 
					if(m.status === "recognizing text"){
						let val = m.progress * 100; 
						console.log(val);
						setProgressCircle(val)
					}
				}
				}
              ).then(({ data: { text } }) => {

                    let cleanedText = text.replace(/[-\\n/\\^$*+%?.()|[\]{}\n]/g, ' ').split(' ');
                    cleanedText = cleanedText.filter( word => (word !== "" && /\d/.test(word) && word.length > 3));
                    setExtractedText(cleanedText);
                    setProgress(false);
                    setFinished(true); 
              });
        }else{
            setError("Extracting Error");
        }      
    };
    const handleSetMemberID = (memberID: string) => {
        console.log("Handling Member ID", memberID);
        setMemberID(memberID); 

    };

    const handleSetGroupNumber = (groupNum: string) =>{
        console.log("Handling Group Number", groupNum); 
        setGroupNum(groupNum);

    };

    const pushToFireBase = async() =>{
        console.log("Push to firebase")

        // setReset(true); 
		console.log("memberID", memberID);
		console.log("groupID", groupNum);

		if (currentUser){
			console.log("email", currentUser.email);

			let response = await updateInsurance(currentUser.email, memberID, groupNum);

			if (response){
				console.log("We have errors");
				setError(response.message);
			}else{
				console.log("success");
				setError("");
				history.push("/user");
			}
		}
    }

    const clearStates = () =>{
        console.log("Clearing States")
        setReset(true); 

    }

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
            <div className="form-card-sm">
			<h1>Scan Insurance Card</h1>
			<p>Please upload a bright image</p>
            <div className={classes.fileUploader}>
            <Button
                variant="contained"
                component="label"
                className={classes.button}
                disabled={userUpload}>
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
            <br/>
            <div id="JIMPProgress">
                {(JIMPuploading) ? "...uploading insurance card..." : ""}
            </div>
            <br/>
            <div>
                <Button variant="contained" 
                        className={classes.button} 
                        onClick={extractInsuranceCard}
                        classes={{disabled: classes.button}}
                        disabled={!userUpload || (finished && (userUpload && !progress))}>
                        Scan Card
                </Button>  
                <br/>
                <div id="progress">
                    {!(finished) ? 
                        (userUpload && progress) ? 
						<div>
							<h6>...please wait...<br/>
                            ...extracting text...</h6> 
							<CircularProgressWithLabel value={progressCircle} />
						</div>

							: 
                            "" : 
                            <div><br/>
                            <h6>Completed</h6></div>} 
                </div>
                <hr/>
                <div>
                    <section className="memberID">
                        <div>
                            <h2>What is your member ID?  </h2>
                            <div>
                                <form className={classes.root} noValidate autoComplete="off">
                                    <TextField id="standard-basicScanMI" 
                                        required 
                                        value={memberID} 
                                        disabled={!finished}
                                        aria-disabled="true"
                                        label="Member ID" />
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
                            <h2>What is your group number? </h2>
                            <div>
                                <form className={classes.root} noValidate autoComplete="off">
                                    <TextField id="standard-basicGNScan" 
                                    required 
                                    value={groupNum}
                                    disabled={!finished}
                                    aria-disabled="true"
                                    label="Group Number" />
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
                <div className={classes.buttonRows}>
                <Button variant="contained" 
                    className={classes.button} 
                    disabled={!finished}
                    onClick={clearStates}>
                    Reset
                </Button> 
                <br/>
                <br/>
                <Button variant="contained" 
                    className={classes.button} 
                    disabled={!finished}
                    onClick={pushToFireBase}>
                    Submit
                </Button> 
                </div>

            </div>
            </div>
           
        </div>
    )
}; 

export default ScanInsurance; 