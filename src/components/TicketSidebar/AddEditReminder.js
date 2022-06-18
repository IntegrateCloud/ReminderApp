import React, { useState, useEffect, useId } from 'react';
import { Col, Grid, Row } from '@zendeskgarden/react-grid';

// eslint-disable-next-line object-curly-newline
import { Dropdown, Multiselect, Menu, Item, Field as DField, Label as DLabel } from '@zendeskgarden/react-dropdowns';
import { Tag } from '@zendeskgarden/react-tags';
import { Field, Label, MediaInput } from '@zendeskgarden/react-forms';
import { Button } from '@zendeskgarden/react-buttons';

import CalendarIcon from '@zendeskgarden/svg-icons/src/12/calendar-stroke.svg';
import TimeIcon from '@zendeskgarden/svg-icons/src/12/clock-stroke.svg';
import NotificationIcon from '@zendeskgarden/svg-icons/src/12/notification-stroke.svg';

function AddEditReminder({ client, initialFormData }) {
  const formId = useId();

  const [formData, setFormData] = useState(initialFormData);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dropdownValue, setDropdownValue] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [matchingOptions, setMatchingOptions] = useState([]);

  const searchAgents = async (queryKey) => {
    const searchUri = `/api/v2/users/search?per_page=100&query=role:admin,role:agent+${queryKey}`;
    const agentSearch = await client.request(searchUri);
    const matchedOptions = agentSearch.users.reduce((prevItem, nextItem) => {
      const { id, email } = nextItem;
      return [...prevItem, { id, email }];
    }, []);
    setMatchingOptions(matchedOptions);
    setIsSearchLoading(false);
  };

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
  };

  useEffect(() => {
    if (dropdownValue !== '') {
      setIsSearchLoading(true);

      searchAgents(dropdownValue);
    } else {
      setMatchingOptions([]);
    }
  }, [dropdownValue]);

  return (
    <form id={formId} className="u-container add-reminder-form">
      <input type="hidden" name="ticket_id" value={formData.ticket_id} />
      <input type="hidden" name="author_id" value={formData.author_id} />
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
  );
}

export default AddEditReminder;
