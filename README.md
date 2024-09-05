# User Authentication Service

This project is a user authentication service built with Node.js, Express, and PostgreSQL. It provides essential features for user registration, login, and profile management, ensuring secure authentication and efficient session management.

## Features
- **User Registration**: Allows users to sign up with their email, name, and password. Passwords are hashed using bcrypt before storage.
- **User Login**: Authenticates users with email and password, issuing a JWT token for secure session management.
- **Profile Management**: Authenticated users can access their profile information using JWT tokens.
- **Token-Based Authentication**: Uses JWT for secure access to protected routes.
- **Password Security**: Employs bcrypt for secure password hashing.

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: bcrypt, JWT
- **Middleware**: Express middleware for token verification and error handling

## API Endpoints
- `POST /register`: Registers a new user. Expects `email`, `name`, and `password` in the request body.
- `POST /login`: Authenticates a user and returns a JWT token. Expects `email` and `password` in the request body.
- `GET /userInfo`: Retrieves user inf
