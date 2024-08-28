# Pionta

Pionta is a web application designed to help users find and log the prices of pints at various bars in Belfast. The application features a map to locate bars, filter options to narrow down searches, and a logging system for users to add and manage pint prices, as well as add new bars.

## Current Features

- **Map Integration**: View bars on a map with their respective pint prices.
- **Filter Options**: Filter bars based on pint prices, distance, and other criteria.
- **Log Pints**: Users can log the prices of pints they find at different bars.
- **Add Bars**: Users can add new bars to the database.

## Technologies Used

- **Frontend**: React, TypeScript, Material-UI, Mapbox
- **Backend**: Node.js, Express
- **Database**: Supabase, MySQL, Redis

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
    ```sh
   git clone https://github.com/johntoner7/pionta.git
   cd pionta
   ```
2. Install dependencies for both frontend and backend:
    ```sh
    cd web/frontend
    npm install
    cd ../../backend
    npm install
    ```
3. Create a .env file in the backend directory based on the config file in /backend/config.
4.  Open your browser and navigate to http://localhost:3000.


