import React, { useState, useEffect, useContext, useId, useLayoutEffect } from 'react';
import { Spinner } from '@zendeskgarden/react-loaders';
import { XL, LG } from '@zendeskgarden/react-typography';
import { Field, Label, MediaInput, Checkbox } from '@zendeskgarden/react-forms';
import { Dropdown, Multiselect, Menu, Item, Field as DField, Label as DLabel } from '@zendeskgarden/react-dropdowns';
import { Col, Grid, Row } from '@zendeskgarden/react-grid';
import { Tag } from '@zendeskgarden/react-tags';
import { Button, IconButton } from '@zendeskgarden/react-buttons';

import CalendarIcon from '@zendeskgarden/svg-icons/src/12/calendar-stroke.svg';
import TimeIcon from '@zendeskgarden/svg-icons/src/12/clock-stroke.svg';
import NotificationIcon from '@zendeskgarden/svg-icons/src/12/notification-stroke.svg';
import EditIcon from '@zendeskgarden/svg-icons/src/12/pencil-stroke.svg';
import CheckIcon from '@zendeskgarden/svg-icons/src/12/check-lg-fill.svg';

import ZAFContext from '../../context/ZAFContext';
import './style.css';

const MAX_HEIGHT = 500;

function TicketSidebar() {
  const formId = useId();
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

  const [formData, setFormData] = useState(initialFormValue);

  const [currentUser, setCurrentUser] = useState({});
  const [ticketData, setTicketData] = useState({});

  const [selectedItems, setSelectedItems] = useState([]);
  const [dropdownValue, setDropdownValue] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [matchingOptions, setMatchingOptions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const searchAgents = async (queryKey) => {
    const agentSearch = await app.client.request(
      `/api/v2/users/search?per_page=100&query=role:admin,role:agent+${queryKey}`
    );
    const matchedOptions = agentSearch.users.reduce((prevItem, nextItem) => {
      const { id, email } = nextItem;
      return [...prevItem, { id, email }];
    }, []);
    setMatchingOptions(matchedOptions);
    setIsSearchLoading(false);
  };

  // Function that loads on the first mount
  useEffect(() => {
    async function fetchUserAndTicketData() {
      const currentUserData = await app.client.get('currentUser');
      const ticketDetail = await app.client.get('ticket');

      if (currentUserData.currentUser) {
        const { id, email, name } = currentUserData.currentUser;
        setCurrentUser({ id, email, name });
        setSelectedItems([{ id, email }]);
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

  useEffect(() => {
    if (dropdownValue !== '') {
      setIsSearchLoading(true);

      searchAgents(dropdownValue);
    } else {
      setMatchingOptions([]);
    }
  }, [dropdownValue]);

  useLayoutEffect(() => {
    resizeApp();
  }, [currentUser, ticketData, showAddForm]);

  const setFormInputValue = (name, value) => {
    setFormData((prevState) => {
      const newState = {
        ...prevState,
        [name]: value,
      };
      return newState;
    });
  };

  const handleFormInputChange = async (e) => {
    setFormInputValue(e.target.name, e.target.value);
  };

  const renderOptions = () => {
    if (isSearchLoading) {
      return <Item disabled>Loading items...</Item>;
    }

    if (matchingOptions.length === 0) {
      return <Item disabled>No items found</Item>;
    }

    return matchingOptions.map((option) => (
      <Item key={option.id} value={option}>
        <span>{option.email}</span>
      </Item>
    ));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowAddForm(false);
  };

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
          <form id={formId} className={`u-container add-reminder-form ${showAddForm ? '' : 'hidden'}`}>
            <input type="hidden" name="ticket_id" value={ticketData.id} />
            <input type="hidden" name="author_id" value={currentUser.id} />
            <Grid>
              <Row>
                <Col>
                  <Field>
                    <Label hidden>Date</Label>
                    <MediaInput
                      name="date"
                      placeholder="Date"
                      end={<CalendarIcon />}
                      isCompact
                      value={formData.date}
                      onChange={handleFormInputChange}
                    />
                  </Field>
                </Col>
                <Col>
                  <Field>
                    <Label hidden>Time</Label>
                    <MediaInput
                      name="time"
                      placeholder="Time"
                      end={<TimeIcon />}
                      isCompact
                      value={formData.time}
                      onChange={handleFormInputChange}
                    />
                  </Field>
                </Col>
              </Row>
              <Row className="u-mt-sm">
                <Col>
                  <Field>
                    <Label hidden>Reminder</Label>
                    <MediaInput
                      name="reminder"
                      placeholder="Reminder"
                      end={<NotificationIcon />}
                      isCompact
                      value={formData.reminder}
                      onChange={handleFormInputChange}
                    />
                  </Field>
                </Col>
              </Row>
              <Row className="u-mt-sm">
                <Col>
                  <Dropdown
                    inputValue={dropdownValue}
                    selectedItems={selectedItems}
                    onSelect={(items) => setSelectedItems(items)}
                    downshiftProps={{ defaultHighlightedIndex: 0, itemToString: (item) => (item ? item.email : '') }}
                    isCompact
                    onInputValueChange={(value) => setDropdownValue(value)}
                  >
                    <DField>
                      <DLabel hidden>Agents</DLabel>
                      <Multiselect
                        placeholder="Agents"
                        renderItem={({ value, removeValue }) => (
                          <Tag size="small">
                            <span>{value.email}</span>
                            <Tag.Close onClick={() => removeValue()} />
                          </Tag>
                        )}
                      />
                    </DField>
                    <Menu>{renderOptions()}</Menu>
                  </Dropdown>
                </Col>
              </Row>
              <Row className="u-mt-sm">
                <Col textAlign="end">
                  <Button isPrimary size="small" onClick={handleFormSubmit}>
                    Set Reminder
                  </Button>
                </Col>
              </Row>
            </Grid>
          </form>
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
