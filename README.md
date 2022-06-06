# Integrate Cloud Reminder App

An App that sends the reminder associated to the ticket in the email and also through the Zendesk Notifications 

## Setup

- Clone the Repo ``
- Go to the project folder and run command `npm install`
- To Upgrade packages to latest run `npm install -g npm-check-updates && ncu -u`

## Run code in development

- First run the command `npm run watch`
- After the build is created by webpack in another tab run `npm run start`

## Build and make package

- Stop the dev command if it is running in other tab
- Then run `npm run build:package`

## Important files

- File to begin with Nav Bar App `src/nav_bar.js`
- File to begin with Ticket Sidebar App `src/ticket_sidebar.js`
- Zendesk Manifest `dist/manifest.json`
- Logos and other assets folder `dist/assets`
- React Components folder `src/components`
