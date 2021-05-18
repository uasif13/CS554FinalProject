import React, { useRef, useEffect, useCallback } from "react";
import ReactModal from "react-modal";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { makeStyles, Button } from "@material-ui/core";

const useStyles = makeStyles({
  button: {
    background: "#3D4CBC",
    color: "white",
  },
});

ReactModal.setAppElement("#root");
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
  },
};

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWrapper = styled.div`
  width: 800px;
  height: 500px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  color: #000;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  z-index: 10;
  border-radius: 10px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.8;
  color: #141414;
  p {
    margin-bottom: 1rem;
  }
  button {
    padding: 10px 24px;
    background: #141414;
    color: #fff;
    border: none;
  }
`;

function ScheduleModal({
  showScheduleModal,
  setScheduleModal,
  city,
  stateLoc,
  time,
}) {
  const modalRef = useRef();
  const history = useHistory();
  const classes = useStyles();
  let str = " : 00 am";
  if (time > 12) {
    time = time - 12;
    str = " : 00 pm";
  }

  const routeChange = () => {
    let path = `/user`;
    history.push(path);
  };

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setScheduleModal(false);
    }
  };
  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showScheduleModal) {
        setScheduleModal(false);
        console.log("I pressed");
      }
    },
    [setScheduleModal, showScheduleModal]
  );
  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);
  return (
    <>
      {showScheduleModal ? (
        <ReactModal
          name="scheduleModal"
          isOpen={showScheduleModal}
          contentLabel="Appointment Sch"
          style={customStyles}
        >
          <h1>
            You have successfully booked <br />
            an appointment at{" "}
          </h1>
          <p>
            {city}, {stateLoc}
          </p>
          <br />
          <p>
            at {time}
            {str}
          </p>
          <Button className={classes.button} onClick={routeChange}>
            Return to Homepage
          </Button>
        </ReactModal>
      ) : null}
    </>
  );
}

export default ScheduleModal;