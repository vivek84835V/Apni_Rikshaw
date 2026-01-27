# Apni Rikshaw API Documentation

This document outlines the API endpoints for the Apni Rikshaw application.

---

## Base URL

Assuming the server runs on `http://localhost:3000`, and routes are mounted under `/users`.

---

## Endpoints

### 1. Register User

- **Method:** POST
- **Path:** `/users/register`
- **Description:** Registers a new user.

#### Request Body

```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string"
}
```

#### Responses

- **201 Created**
  ```json
  {
    "token": "string",
    "usercreate": {
      "_id": "string",
      "fullname": {
        "firstname": "string",
        "lastname": "string"
      },
      "email": "string"
    }
  }
  ```
- **400 Bad Request** (Validation errors)
  ```json
  {
    "errors": [
      {
        "msg": "string",
        "param": "string",
        "location": "body"
      }
    ]
  }
  ```

### 2. Login User

- **Method:** POST
- **Path:** `/users/login`
- **Description:** Logs in an existing user.

#### Request Body

```json
{
  "email": "string",
  "password": "string"
}
```

#### Responses

- **200 OK**

  ```json
  {
    "token": "string",
    "user": {
      "_id": "string",
      "fullname": {
        "firstname": "string",
        "lastname": "string"
      },
      "email": "string",
      "socketId": "string"
    }
  }
  ```

  - Sets a cookie named `token`.

- **400 Bad Request** (Validation errors)
  ```json
  {
    "errors": [
      {
        "msg": "string",
        "param": "string",
        "location": "body"
      }
    ]
  }
  ```
- **401 Unauthorized**
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

### 3. Get User Profile

- **Method:** GET
- **Path:** `/users/profile`
- **Description:** Retrieves the authenticated user's profile.
- **Authentication:** Required (JWT token in cookie or Authorization header).

#### Responses

- **200 OK**
  ```json
  {
    "_id": "string",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "socketId": "string"
  }
  ```
- **401 Unauthorized** (If not authenticated or token invalid/blacklisted)
  ```json
  {
    "message": "Unauthorized"
  }
  ```

### 4. Logout User

- **Method:** GET
- **Path:** `/users/logout`
- **Description:** Logs out the authenticated user.
- **Authentication:** Required (JWT token in cookie or Authorization header).

#### Responses

- **401 Unauthorized** (Logged out successfully, but status might be misleading)

  ```json
  {
    "message": "Logged Out"
  }
  ```

  - Clears the `token` cookie and blacklists the token.

- **401 Unauthorized** (If not authenticated)
  ```json
  {
    "message": "Unauthorized"
  }
  ```

## Authentication

- JWT tokens are used for authentication.
- Tokens can be sent in cookies (`token`) or Authorization header (`Bearer <token>`).
- Tokens expire in 24 hours.
- Blacklisted tokens are checked on each request.
