import Storage from '../helpers/storage';

class Reminder {
  constructor(instanceId) {
    this.baseUrl = '';
    this.localStorageName = 'reminders';
    this.storage = new Storage(instanceId);
  }

  getReminders(parameters) {
    const allReminders = this.storage.get(this.localStorageName);
    allReminders.forEach((reminderKey, reminder) => {
      let display = true;
      parameters.forEach((parameterKey, parameterValue) => {
        if (reminder[parameterKey] !== parameterValue) {
          display = false;
        }
      });

      allReminders[reminderKey].display = display;
    });

    return allReminders;
  }

  addReminder(data) {
    let reminders = this.storage.get(this.localStorageName);
    reminders = reminders ? [...reminders, data] : [data];
    this.storage.set(this.localStorageName, reminders);
  }

  updateReminder(id, data) {
    const reminders = this.storage.get(this.localStorageName);
    reminders[id] = data;
    this.storage.set(this.localStorageName, reminders);
  }
}

export default Reminder;
