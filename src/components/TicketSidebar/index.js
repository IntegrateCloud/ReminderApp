import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { Spinner } from '@zendeskgarden/react-loaders';
import { XL, LG } from '@zendeskgarden/react-typography';
import { Field, Label, Checkbox } from '@zendeskgarden/react-forms';
import { Col, Grid, Row } from '@zendeskgarden/react-grid';
import { Button, IconButton } from '@zendeskgarden/react-buttons';

import CalendarIcon from '@zendeskgarden/svg-icons/src/12/calendar-stroke.svg';
import TimeIcon from '@zendeskgarden/svg-icons/src/12/clock-stroke.svg';
import NotificationIcon from '@zendeskgarden/svg-icons/src/12/notification-stroke.svg';
import EditIcon from '@zendeskgarden/svg-icons/src/12/pencil-stroke.svg';
import CheckIcon from '@zendeskgarden/svg-icons/src/12/check-lg-fill.svg';

import ZAFContext from '../../context/ZAFContext';
import AddEditReminder from './AddEditReminder';

import './style.css';

const MAX_HEIGHT = 500;

function TicketSidebar() {
  const app = useContext(ZAFContext);

  const resizeApp = () => {
    const newHeight = Math.min(document.body.clientHeight, MAX_HEIGHT);
    return app.client.invoke('resize', { height: newHeight });
  };

  // State to manage the loading state of the data
  const [isLoading, setIsLoading] = useState({
    status: true,
    message: 'Loading...',
    subMessage: null,
  });

  const initialFormValue = {
    date: '',
    time: '',
    reminder: '',
  };

  const [currentUser, setCurrentUser] = useState({});
  const [ticketData, setTicketData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);

  // Function that loads on the first mount
  useEffect(() => {
    async function fetchUserAndTicketData() {
      const currentUserData = await app.client.get('currentUser');
      const ticketDetail = await app.client.get('ticket');

      if (currentUserData.currentUser) {
        const { id, email, name } = currentUserData.currentUser;
        setCurrentUser({ id, email, name });
      }

      if (ticketDetail.ticket) {
        const { id, subject } = ticketDetail.ticket;
        setTicketData({ id, subject });
      }
    }
    fetchUserAndTicketData();
  }, []);

  useEffect(() => {
    if (currentUser.id && ticketData.id) {
      setIsLoading({
        status: false,
        message: '',
        subMessage: null,
      });
    }
  }, [currentUser, ticketData]);

  useLayoutEffect(() => {
    resizeApp();
  }, [currentUser, ticketData, showAddForm]);

  return (
    <div className="App">
      {isLoading.status === true && (
        <div className="loading-div">
          <Spinner size="128" />
          <XL>{isLoading.message}</XL>
          {isLoading.subMessage && <LG>{isLoading.subMessage}</LG>}
        </div>
      )}
      {currentUser.id && ticketData.id && (
        <>
          <div className="reminder-list">
            <Grid>
              <Row className="single-reminder u-container">
                <Col size={10}>
                  <Row>
                    <Col size={8}>
                      <CalendarIcon className="u-mr-sm" />
                      16 July 2022
                    </Col>
                    <Col size={4}>
                      <TimeIcon className="u-mr-sm" />
                      00:00
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <LG>{ticketData.subject}</LG>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <ul>
                        <li>
                          <NotificationIcon className="u-mr-sm" />
                          test@example.com
                        </li>
                        <li>
                          <NotificationIcon className="u-mr-sm" />
                          test1@example.com
                        </li>
                        <li>
                          <CheckIcon className="u-mr-sm" />
                          test2@example.com
                        </li>
                      </ul>
                    </Col>
                  </Row>
                </Col>
                <Col size={2} textAlign="center">
                  <Field>
                    <Checkbox width={30}>
                      <Label hidden>Complete Reminder</Label>
                    </Checkbox>
                  </Field>
                  <IconButton focusInset={false} aria-label="edit">
                    <EditIcon />
                  </IconButton>
                </Col>
              </Row>
            </Grid>
          </div>
          <div className={showAddForm ? '' : 'hidden'}>
            <AddEditReminder
              client={app.client}
              initialFormData={{
                ...initialFormValue,
                ticket_id: ticketData.id,
                author_id: currentUser.id,
              }}
            />
          </div>
          <div className={`u-mt-sm ${showAddForm ? 'hidden' : ''}`}>
            <Button isDanger onClick={() => setShowAddForm(true)}>
              Add Reminder
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default TicketSidebar;
