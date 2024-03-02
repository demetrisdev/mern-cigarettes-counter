import { useRef, useEffect } from "react";

import { Login, Register } from "./LoginRegister";
import "./LoginRegisterModal.css";

const LginRegisterModal = ({ openModal, closeModal }) => {
  const dialog = useRef();

  useEffect(() => {
    if (openModal) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [openModal]);

  return (
    <>
    {openModal && (
    <dialog 
      ref={dialog}
      onCancel={closeModal}
      className="login-register-modal"
    >
      <Login />
      <Register />
      <form method="dialog">
        <button onClick={closeModal}>Close</button>
      </form>
    </dialog>
    )}
    </>
  );
};

export default LginRegisterModal;