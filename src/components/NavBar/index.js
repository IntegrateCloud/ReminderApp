import React, { useState, useEffect, useContext } from 'react';
import { Tabs, TabList, Tab } from '@zendeskgarden/react-tabs';
import './style.css';
// eslint-disable-next-line object-curly-newline
import { Body, Cell, Head, HeaderCell, HeaderRow, Row, Table } from '@zendeskgarden/react-tables';
import { Field, Checkbox, Label } from '@zendeskgarden/react-forms';
import { Anchor } from '@zendeskgarden/react-buttons';

import ZAFContext from '../../context/ZAFContext';

function NavBar() {
  const app = useContext(ZAFContext);

  const [selectedTab, setSelectedTab] = useState('recent');
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    function fetchReminders(reminderType) {
      let reminderResponse = [];

      if (reminderType === 'recent') {
        reminderResponse = [
          {
            id: 6,
            ticket_id: 131,
            datetime: '2022-06-01 11:15',
            description: 'Test reminder 6',
          },
          {
            id: 7,
            ticket_id: 139,
            datetime: '2022-06-01 11:35',
            description: 'Test reminder 7',
          },
        ];
      } else if (reminderType === 'upcoming') {
        reminderResponse = [
          {
            id: 5,
            ticket_id: 162,
            datetime: '2022-06-01 10:45',
            description: 'Test reminder 5',
          },
          {
            id: 4,
            ticket_id: 180,
            datetime: '2022-06-01 10:15',
            description: 'Test reminder 4',
          },
        ];
      } else if (reminderType === 'completed') {
        reminderResponse = [
          {
            id: 1,
            ticket_id: 110,
            datetime: '2022-06-01 9:15',
            description: 'Test reminder 1',
          },
        ];
      }

      setReminders(reminderResponse);
    }
    fetchReminders(selectedTab);
  }, [selectedTab]);

  const goToTicket = (e) => {
    e.preventDefault();
    app.client.invoke('routeTo', 'ticket', e.target.getAttribute('data-id'));
  };

  return (
    <>
      <Tabs selectedItem={selectedTab} onChange={setSelectedTab}>
        <TabList>
          <Tab item="recent">Recent</Tab>
          <Tab item="upcoming">Upcoming</Tab>
          <Tab item="completed">Completed</Tab>
        </TabList>
      </Tabs>
      {reminders.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <Table style={{ minWidth: 500 }}>
            <Head>
              <HeaderRow>
                <HeaderCell isMinimum />
                <HeaderCell width="100px">Ticket</HeaderCell>
                <HeaderCell width="250px">When</HeaderCell>
                <HeaderCell>What</HeaderCell>
              </HeaderRow>
            </Head>
            <Body>
              {reminders.map((reminder) => (
                <Row key={reminder.ticket_id}>
                  <Cell isMinimum>
                    <Field>
                      <Checkbox>
                        <Label hidden>{`Complete ${reminder.id}`}</Label>
                      </Checkbox>
                    </Field>
                  </Cell>
                  <Cell width="100px">
                    <Anchor data-id={reminder.ticket_id} onClick={goToTicket}>
                      {`#${reminder.ticket_id}`}
                    </Anchor>
                  </Cell>
                  <Cell width="250px">{reminder.datetime}</Cell>
                  <Cell>{reminder.description}</Cell>
                </Row>
              ))}
            </Body>
          </Table>
        </div>
      )}
    </>
  );
}

export default NavBar;
