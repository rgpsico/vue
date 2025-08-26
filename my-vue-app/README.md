# My Vue App

This project is a Vue.js application that allows users to view and edit their profile information. It includes a main profile page and a modal for editing user data.

## Project Structure

```
my-vue-app
├── src
│   ├── assets
│   │   └── styles
│   │       └── main.css        # Main styles for the application
│   ├── components
│   │   ├── Profile.vue         # Component for displaying user profile
│   │   └── ProfileEditModal.vue # Component for editing user profile
│   ├── pages
│   │   └── Profile.vue         # Page component for user profile
│   ├── App.vue                 # Root component of the application
│   └── main.ts                 # Entry point of the application
├── package.json                 # npm configuration file
├── tsconfig.json               # TypeScript configuration file
└── README.md                   # Documentation for the project
```

## Features

- View user profile information
- Edit user profile data through a modal
- Responsive design

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd my-vue-app
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

To run the application, use the following command:
```
npm run serve
```

Open your browser and go to `http://localhost:8080` to view the application.

## License

This project is licensed under the MIT License.