# Payment Terminal Frontend

This is the frontend interface for the Black Rock Payment Terminal system. It provides a web-based UI for merchants to process card payments, view transaction history, and manage payouts.

## Features

- Merchant authentication (login and registration)
- Card payment processing with manual entry
- Protocol selection for different transaction types
- Approval code entry (4 or 6 digit numeric codes)
- Transaction history viewing
- MTI notification display
- Payout credential viewing
- Payout processing to bank accounts or cryptocurrency wallets

## Components

- `Login.js` - Authentication interface
- `PaymentTerminal.js` - Main payment processing interface
- `TransactionHistory.js` - Transaction history viewer
- `Notifications.js` - MTI message notifications
- `PayoutCredentials.js` - Payout credential display and processing

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Build for production:
   ```
   npm run build
   ```

## Environment Variables

- `REACT_APP_API_URL` - URL of the backend API service

## Deployment

This frontend is configured for deployment on Render as a static site. To deploy:

1. Create a new Render static site
2. Connect it to this repository
3. Set the build command to `npm install && npm run build`
4. Set the publish directory to `build`
5. Add the environment variable `REACT_APP_API_URL` with your backend URL
6. Deploy!

## Dependencies

- React
- React Router DOM
- Axios