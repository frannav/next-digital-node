# ATM API Backend

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

## Running with Docker

You can also run the application using Docker and Docker Compose.

1.  **Build and run with Docker Compose (recommended):**
    ```bash
    docker-compose up -d
    ```
    This command builds the image and starts the container in the background. The API will be available at `http://localhost:3000`. The `db.json` file is mounted as a volume to persist data across container restarts.

2.  **Manual build and run with Docker:**
    -   **Build the image:**
        ```bash
        docker build -t node-js-api .
        ```
    -   **Run the container:**
        ```bash
        docker run -p 3000:3000 -v ./db.json:/app/db.json --env-file ./.env node-js-api
        ```

## API Endpoints

All endpoints are prefixed with `/api`.

### Testing with Bruno

This project includes a [Bruno](https://www.usebruno.com/) collection located in the `http-request-collection/` directory. Bruno is an open-source API client, similar to Postman, that allows you to test the API endpoints easily.

To use it:
1.  Download and install Bruno from their official website.
2.  Open Bruno and click on "Open Collection".
3.  Navigate to the `http-request-collection/` folder in this project and select it.
4.  The collection with all the API requests will be loaded, ready for you to use.

### Users & Accounts
- `POST /api/users`: Create a new user.
  - **Body**: `{ "name": "John Doe", "email": "john.doe@example.com", "password": "yourpassword" }`
- `POST /api/accounts`: Create a new bank account.
  - **Body**: `{ "userId": "user-id", "currency": "USD", "initialBalance": 1000 }`
- `GET /api/accounts/user/:userId`: Get all accounts for a user.
- `GET /api/accounts/:accountId`: Get details for a specific account.

### Cards
- `POST /api/cards`: Create a new card for an account.
  - **Body**: `{ "accountId": "account-id", "type": "debit", "pin": "1234" }`
- `GET /api/cards/:cardId`: Get details for a specific card.
- `POST /api/cards/activate`: Activate a card.
  - **Body**: `{ "cardId": "card-id", "pin": "1234" }`
- `PATCH /api/cards/:cardId/pin`: Change a card's PIN.
  - **Body**: `{ "oldPin": "1234", "newPin": "5678" }`

### Operations
- `GET /accounts/:accountId/movements`: Get all movements for an account. **(Note: This route is currently disabled in `src/routes.ts`)**
- `POST /api/deposits`: Make a deposit to an account.
  - **Body**: `{ "cardId": "card-id", "amount": 200 }`
- `POST /api/withdrawals`: Make a withdrawal from an account.
  - **Body**: `{ "cardId": "card-id", "amount": 100 }`
- `POST /api/transfers`: Transfer funds between accounts.
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

## Tests Statement

A client in the financial sector has asked us to develop the API that will be used by their own ATMs as well as those of other banks. Fortunately, we don’t need to build any UI, so this is a pure back-end task.

---

## 📋 Specifications

### 1. View Account Activity

* **Endpoint:** `GET /accounts/{accountId}/transactions`
* **Functionality:**

  * Customers can view transactions on any of their accounts by specifying the `accountId`.
  * Transactions include:

    * Cash **deposits** and **withdrawals**
    * **Fees** charged
    * **Incoming** and **outgoing** **transfers**
  * Each transaction record must include a `type` field indicating its category (e.g., `withdrawal`, `deposit`, `transfer`, `fee`).

### 2. Withdraw Cash

* **Endpoint:** `POST /accounts/{accountId}/withdraw`
* **Functionality:**

  * Only withdraw from the account linked to the inserted card.
  * **Debit cards:** Restricted by available balance.
  * **Credit cards:** Can withdraw up to the credit limit (but not beyond).
  * **All cards:** Cannot exceed the per-card withdrawal limit.
  * **Interbank ATMs:** Apply external-bank fees when applicable.

### 3. Deposit Cash

* **Endpoint:** `POST /accounts/{accountId}/deposit`
* **Functionality:**

  * Only deposit into the account linked to the inserted card.
  * **Allowed only at our bank’s ATMs.** Deposits at other banks’ ATMs must be rejected.

### 4. Make Transfers

* **Endpoint:** `POST /transfers`
* **Functionality:**

  * Transfer funds to accounts at:

    * Our bank
    * Other banks
  * **Validations:**

    1. Ensure the destination IBAN is well-formed.
    2. Apply interbank transfer fees where applicable.

### 5. Activate Card

* **Endpoint:** `POST /cards/{cardId}/activate`
* **Functionality:**

  * First-time card usage requires activation before any other operations.

### 6. Change PIN

* **Endpoint:** `PUT /cards/{cardId}/pin`
* **Functionality:**

  * Customers can change their PIN at any time.
  * **Mandatory** PIN change immediately after initial activation.

---

## 🔧 Technical Considerations

* **Version Control**

  * Use **Git** with **Git Flow** methodology.
  * Make **frequent, meaningful commits**; the bank’s team will review the code regularly.

* **Testing**

  * Implement both **unit tests** and **integration tests**.

* **Security**

  * Treat the **PIN** as sensitive data; **never store it in plain text**.

* **CI/CD**

  * Preferably set up **GitLab CI**, **GitHub Actions**, or **Jenkins** to:

    * Run tests
    * Build the application
    * Deploy automatically


