

import React, { createContext, useContext, useState, useEffect } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setShowModal(true);
    }, 1 * 1000); 

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const hideModal = () => {
    setShowModal(false);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
    </ModalContext.Provider>
  );
};


export const useModal = () => {
  return useContext(ModalContext);
};
