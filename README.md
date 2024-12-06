# Project Setup Instructions

## Prerequisites:

Please make sure you docker installed and running, else visit: https://www.docker.com/

1. Create .env file in the project root folder, and add below config

   ```bash
    MONGO_URI=mongodb://mongo:27017/todo_app
    SESSION_SECRET=supersecretkey
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Build and Run the Containers
   Run the following commands to build and start the containers:

   1. Build the Containers:

      ```bash
       docker compose build
      ```

   2. Build the Containers:

      ```bash
       docker compose up
      ```

4. To run the Tests

   ```bash
    yarn test
   ```
