[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/J0Dv0VMM)
# Exam #1: Gioco dei Meme
## Student: s332134 DADONE LUCA 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

### React Client Application Routes

- **Route `/`**
  - **Page Content**: *`HomePage`*
  - **Purpose**: This is the main landing page of the application. It provides an overview of the app and its features.

- **Route `/game`**
  - **Page Content**: *`GamePage`*
  - **Purpose**: This page is where users can play the meme game. It loads a series of random memes and allows users to interact with them.
  - **Loader**: `memesLoader` - Fetches random memes from the server to be used in the game.

- **Route `/login`**
  - **Page Content**: *`LoginPage`*
  - **Purpose**: This page allows users to log into their accounts. If the user is already logged in, they will be redirected to the HomePage.

- **Route `/profile`**
  - **Page Content**: *`UserProfilePage`*
  - **Purpose**: This page displays the user's profile information and game history. It shows the details of the games played, including the date, total score, and individual rounds with meme images and scores.
  - **Loader**: `gamesHistoryLoader` - Fetches the user's game history from the server.

- **Route `*`**
  - **Page Content**: *`WrongUrlPage`*
  - **Purpose**: This page is displayed when the user navigates to an undefined URL. It informs the user that the page they are looking for does not exist.

- **Route `/error`**
  - **Page Content**: *`ErrorComponent`*
  - **Purpose**: This is a test page used to generate and display errors for **testing purposes**. It helps in checking the error handling capabilities of the application.

- **Error Handling**: errorElement: *`ErrorPage`* - Displays an error page if there is an issue loading any of the valid routes in the application. I

## API Server

- POST `/api/something`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Database Tables

- Table `users` - contains xx yy zz
- Table `something` - contains ww qq ss
- ...

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)
