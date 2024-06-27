[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/J0Dv0VMM)
# Exam #1: Gioco dei Meme
## Student: s332134 DADONE LUCA 

## React Client Application Routes

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

<!--- **Route `/error`**
  - **Page Content**: *`ErrorComponent`*
  - **Purpose**: This is a test page used to generate and display errors for **testing purposes**. It helps in checking the error handling capabilities of the application.
-->
- **Error Handling**: errorElement: *`ErrorPage`* - Displays an error page if there is an issue loading any of the valid routes in the application. It handles also server errors if not handled directly in components.

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


## API Server

- ### __Authenticate User__

  - **URL**: `/api/sessions`

  - **HTTP Method**: POST

  - **Description**: Authenticates a user based on provided credentials.

  - **Request body**:
    ```
    {
      "username": "luca.dadone01@gmail.com",
      "password": "example_password"
    }
    ```

  - **Response**: `201 Created` (success), `401 Unauthorized` (invalid credentials), or `500 Internal Server Error` (generic error).

  - **Response body**:
    ```
    {
      "id": 1,
      "username": "luca.dadone01@gmail.com",
      "name": "Luca Dadone"
    }
    ```


- ### __Get Current User Session__

  - **URL**: `/api/sessions/current`

  - **HTTP Method**: GET

  - **Description**: Retrieves information about the currently authenticated user.

  - **Response**: `200 OK` (success) or `401 Unauthorized` (not authenticated).

  - **Response body**:
    ```
    {
      "id": 1,
      "username": "luca.dadone01@gmail.com",
      "name": "Luca Dadone"
    }
    ```


- ### __Logout Current User Session__

  - **URL**: `/api/sessions/current`

  - **HTTP Method**: DELETE

  - **Description**: Terminates the current user session.

  - **Response**: `200 OK` (success) or `401 Unauthorized` (not authenticated).



- ### __Retrieve Random Memes__

  - **URL**: `/api/memes/random`

  - **HTTP Method**: GET

  - **Description**: Retrieves a random set of memes.

  - **Response**: `200 OK` (success) or `500 Internal Server Error` (generic error).

  - **Response body**:
    ```
    [
        {
            "id": 6,
            "imageUrl": "/images/memes/meme6.jpg",
            "captions": [
                {
                    "id": 35,
                    "caption": "caption example",
                },
                {
                    "id": 32,
                    "caption": "aption example",
                },
                {
                    "id": 30,
                    "caption": "aption example",
                },
                {
                    "id": 7,
                    "caption": "aption example",
                },
                {
                    "id": 26,
                    "caption": "aption example",
                },
                {
                    "id": 39,
                    "caption": "aption example",
                },
                {
                    "id": 28,
                    "caption": "aption example",
                }
            ]
        },
        {
            "id": 3,
            "imageUrl": "/images/memes/meme3.jpg",
            "captions": [
               ...
            ]
        },
        {
            "id": 2,
            "imageUrl": "/images/memes/meme2.jpg",
            "captions": [
               ...
            ]
        }
    ]
    ``


- ### __Check Caption Suitability__

  - **URL**: `/api/memes/is-correct`

  - **HTTP Method**: POST

  - **Description**: Checks if a caption is suitable for a specific meme.

  - **Request body**:
    ```
    {
      "memeId": 1,
      "captionId": 2,
      "allCaptionIds": [1, 2, 3, 4, 5, 6, 7]
    }
    ```

  - **Response**: `200 OK` (success) or `400 Bad Request` (missing parameters) or `500 Internal Server Error` (generic error).

  - **Response body**:
    ```
    {
      "isSuitable": false,
      "suitableCaptions": [3, 4]
    }
    ```



- ### __Save Game Data__

  - **URL**: `/api/games`

  - **HTTP Method**: POST

  - **Description**: Saves game data for a logged-in user.

  - **Request body**:
    ```
      {
        "totalScore": 10,
        "rounds": [
          {
            "roundNumber": 1,
            "memeId": 1,
            "score": 4
          },
          {
            "roundNumber": 2,
            "memeId": 2,
            "score": 3
          },
          {
            "roundNumber": 3,
            "memeId": 3,
            "score": 3
          }
        ]
      }
    ```
  - **Response**: `204 No Content` (success) or `401 Unauthorized` (not authenticated) or `422 Unprocessable Entity` (validation error) or `500 Internal Server Error` (generic error).



- ### __Retrieve User's Game History__

  - **URL**: `/api/user/games-history`

  - **HTTP Method**: GET

  - **Description**: Retrieves the game history for the current logged-in user.

  - **Response**: `200 OK` (success) or `401 Unauthorized` (not authenticated) or `500 Internal Server Error` (generic error).

  - **Response body**:
    ```
      [
        {
          "date": "2024-06-27 18:34:47",
          "totalScore": 5,
          "rounds": [
              {
                  "roundNumber": 0,
                  "score": 0,
                  "imagePath": "/images/memes/meme4.jpg"
              },
              {
                  "roundNumber": 1,
                  "score": 5,
                  "imagePath": "/images/memes/meme10.jpg"
              },
              {
                  "roundNumber": 2,
                  "score": 0,
                  "imagePath": "/images/memes/meme9.jpg"
              }
            ]
        },
        ...
    ]
    ```



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
