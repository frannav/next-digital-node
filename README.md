# ATM API

This is a RESTful API for an ATM system, built with Node.js, Express, and TypeScript, using `bun` as the runtime. It follows a modular monolithic architecture.

## Features

-   **User Management**: Create and manage users.
-   **Account Management**: Create and manage bank accounts for users.
-   **Card Management**: Issue, activate, and manage debit/credit cards.
-   **Transactions**: Perform withdrawals, deposits, and transfers.
-   **Movement History**: Track all transactions for an account.

## Prerequisites

-   [Bun](https://bun.sh/) (v1.0 or higher)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd node-js-api
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables:
    ```
    PORT=3000
    ```

## Usage

### Development

To run the server in development mode with auto-reloading:

```bash
bun run dev
```

The server will be available at `http://localhost:3000`.

### Production

To build and run the server in production mode:

1.  **Build the project:**
    ```bash
    bun run build
    ```

2.  **Start the server:**
    ```bash
    bun run start
    ```

## API Endpoints

All endpoints are prefixed with `/api`.

### Users & Accounts
- `POST /users`: Create a new user.
  - **Body**: `{ "name": "John Doe", "email": "john.doe@example.com", "password": "yourpassword" }`
- `POST /accounts`: Create a new bank account.
  - **Body**: `{ "userId": "user-id", "currency": "USD", "initialBalance": 1000 }`
- `GET /users/:userId/accounts`: Get all accounts for a user.
- `GET /accounts/:accountId`: Get details for a specific account.

### Cards
- `POST /cards`: Create a new card for an account.
  - **Body**: `{ "accountId": "account-id", "type": "debit", "pin": "1234" }`
- `POST /cards/activate`: Activate a card.
  - **Body**: `{ "cardId": "card-id", "pin": "1234" }`
- `PATCH /cards/:cardId/pin`: Change a card's PIN.
  - **Body**: `{ "oldPin": "1234", "newPin": "5678" }`
- `GET /cards/:cardId`: Get details for a specific card.

### Operations
- `GET /accounts/:accountId/movements`: Get all movements for an account.
- `POST /deposits`: Make a deposit to an account.
  - **Body**: `{ "cardId": "card-id", "amount": 200 }`
- `POST /withdrawals`: Make a withdrawal from an account.
  - **Body**: `{ "cardId": "card-id", "amount": 100 }`
- `POST /transfers`: Transfer funds between accounts.
  - **Body**: `{ "fromAccountId": "account-id-1", "toIban": "ES...", "amount": 50 }`

## Project Structure

The project follows a modular, layered architecture:

-   `src/`: Main source code directory.
    -   `adapters/`: Connectors to external systems (e.g., database).
    -   `config/`: Application configuration.
    -   `middleware/`: Express middlewares.
    -   `modules/`: Feature-based modules (e.g., `user`, `account`, `card`). Each module contains its own router, controller, services, schemas, and types.
    -   `routes.ts`: Main API router that aggregates all module routers.
    -   `app.ts`: Express application setup.
    -   `index.ts`: Application entry point.

## TO-DO

-   Implement full business logic for all services.
-   Add robust password hashing with `bcrypt` (dependency already included).
-   Implement proper IBAN validation using the `iban` package (dependency already included).
-   Add unit and integration tests.
-   Set up Swagger for API documentation.
-   Implement a logger (e.g., Pino) (dependencies already included).
-   Create a seeder for initial data.
