import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import { Spinner } from '@zendeskgarden/react-loaders';
import { XL, LG } from '@zendeskgarden/react-typography';
import LeafIcon from '@zendeskgarden/svg-icons/src/16/leaf-stroke.svg';

import ZAFContext from '../../context/ZAFContext';

function NavBar() {
  const app = useContext(ZAFContext);

  // State to manage the loading state of the data
  const [isLoading, setIsLoading] = useState({
    status: true,
    message: 'Loading...',
    subMessage: null,
  });

  const [currentUser, setCurrentUser] = useState({});

  // Function that loads on the first mount
  useEffect(() => {
    async function fetchUser() {
      const currentUserData = await app.client.get('currentUser');

      if (currentUserData.currentUser) {
        setCurrentUser(currentUserData.currentUser);
      } else {
        throw new Error('Current User Cannot be set');
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (currentUser.id) {
      setIsLoading({
        status: false,
        message: '',
        subMessage: null,
      });
    }
  }, [currentUser]);

  return (
    <div className="App">
      {isLoading.status === true && (
        <div className="loading-div">
          <Spinner size="128" />
          <XL>{isLoading.message}</XL>
          {isLoading.subMessage && <LG>{isLoading.subMessage}</LG>}
        </div>
      )}
      {currentUser.id && (
        <XL>
          <LeafIcon />
          {`Welcome to the app in subdomain ${app.subdomain} ${currentUser.name}`}
        </XL>
      )}
    </div>
  );
}

export default NavBar;
