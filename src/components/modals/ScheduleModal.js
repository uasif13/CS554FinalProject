import React, { useState } from 'react';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    border: '1px solid #28547a',
    borderRadius: '4px'
  }
};

// function ScheduleModal(props:any){
//   const[showScheduleModal, setScheduleModal] =useState(props.isOpen);
//   const [date, setDate]= useState(props.date);
//   const[city, setCity] =useState(props.city);
//   const [stateLoc, setStateLoc] = useState(props.stateLoc);
//   const [zipcode, setZipCode] = useState(props.zip);
//   const [street, setStreet] = useState(props.street);

//   const handleCloseEditModal = () => {
//     setScheduleModal(false);
//     setDate(null);
//     setCity(null);
//     setStateLoc(null);
//     setZipCode(null);
//     setStreet(null);

//     props.handleClose();
//   };
  
// }

 function ScheduleModal ({showScheduleModal, setScheduleModal}) {
  return (
    <div>
    {showScheduleModal ? <div>Modal </div> : null}
    </div>
  )
}

export default ScheduleModal ;