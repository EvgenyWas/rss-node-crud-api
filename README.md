# Simple CRUD API

## Description
This is a lightweight CRUD (Create, Read, Update, Delete) API that utilizes an in-memory database for rapid data access, making it ideal for development and testing environments. **Note**: Since data is stored in memory, it will be lost when the server restarts.

## Installation

1. **Fork the Repository**  
   Start by forking this repository to your GitHub account.

2. **Clone the Repository**  
   Clone the forked repository to your local machine:
   ```bash
   git clone <your-repository-url>
   cd <repository-name>
   ```

3. **Install Dependencies**  
   To install the required dependencies, run:
   ```bash
   npm install
   ```

4. **Environment Setup**  
   Create a `.env` file in the project root with the following content:
   ```
   PORT={PORT_NUMBER}
   ```
   Replace `{PORT_NUMBER}` with the desired port number (e.g., `4000`).

## Usage Guide

The API can be started in different modes to suit various environments:

1. **Development Mode**  
   Start a single process in development mode:
   ```bash
   npm run start:dev
   ```

2. **Production Mode**  
   Start a single process in production mode:
   ```bash
   npm run start:prod
   ```

3. **Horizontal Scaling**  
   To enable horizontal scaling, use the `start:multi` command. This starts multiple instances of the application using the Node.js Cluster API, with each instance listening on `PORT + n`, where `n` is the instance number. The application uses a round-robin load balancer to distribute requests evenly across instances.  
     ```bash
     npm run start:multi
     ```

4. **Run Tests**  
   To execute the test suite and verify application functionality, use:
   ```bash
   npm run test
   ```

## API Endpoints

1. **Get All Users**  
   `GET /api/users`  
   Retrieves an array of all users.

2. **Get User by ID**  
   `GET /api/users/{userId}`  
   Fetches details of a specific user if they exist.

3. **Create a User**  
   `POST /api/users`  
   Adds a new user to the in-memory database.

4. **Update a User**  
   `PUT /api/users/{userId}`  
   Updates details of an existing user.

5. **Delete a User**  
   `DELETE /api/users/{userId}`  
   Removes a user from the in-memory database.

### Data Model

Each user object in the database has the following structure:
```json
[
  {
    "id": "string",         // Unique identifier (UUID) generated by the server
    "username": "string",   // User's name (required)
    "age": "number",        // User's age (required)
    "hobbies": ["string"]   // User's hobbies, as an array of strings (required)
  },
  ...
]
```