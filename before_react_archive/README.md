# My Express App

This project is a simple Express application that serves static files and provides routes for saving and retrieving mindmap data using Firebase as the database.

## Project Structure

```
my-express-app
├── src
│   ├── index.js                # Entry point of the application
│   ├── controllers             # Contains controllers for handling requests
│   │   └── mindmapController.js # Controller for mindmap operations
│   ├── routes                  # Contains route definitions
│   │   └── mindmapRoutes.js    # Routes for mindmap operations
│   └── types                   # Type definitions for data structures
│       └── index.js            # Exports types/interfaces
├── package.json                 # NPM configuration file
├── firebaseConfig.js            # Firebase configuration and initialization
└── README.md                    # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd my-express-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Set up Firebase:
   - Create a Firebase project in the Firebase console.
   - Obtain your Firebase configuration and add it to `firebaseConfig.js`.

5. Start the server:
   ```
   npm start
   ```

6. Access the application:
   Open your browser and go to `http://localhost:3000`.

## Usage

- The application serves static files from the `public` directory.
- You can access the mindmap functionality at the `/mindmap` route.
- Use the MindmapController to save and retrieve mindmap data from the Firebase database.

## License

This project is licensed under the MIT License.