
# E-Commerce Project: Backend in Golang and Frontend in Angular

## Project Description

This project is an e-commerce platform with a Go (Golang) backend and an Angular frontend. It provides:
- Customers the ability to browse and purchase spare parts.
- Sellers tools to manage their products.
- Secure user management with JWT authentication.

---

## Technologies Used

### Backend
- **Language**: Golang
- **Database**: MongoDB
- **Web Framework**: Gin

### Frontend
- **Language**: TypeScript
- **Framework**: Angular
- **Styles**: SCSS

---

## Prerequisites

Before getting started, make sure you have the following installed:
- **Node.js** (version 16 or higher)
- **Angular CLI** (`npm install -g @angular/cli`)
- **Golang** (version 1.20 or higher)
- **MongoDB** (locally or via MongoDB Atlas)
- **Git** to clone the project repository

---

## Installation and Setup

### Step 1: Clone the Project

```bash
git clone https://github.com/papaamadousarr/hashtech.git
cd hastech
```

### Step 2: Set Up the Backend

1. Navigate to the backend directory:
   ```bash
   cd e-commerce
   ```

2. Install Go dependencies:
   ```bash
   go mod tidy
   ```

### Step 3: Set Up the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd e-commerce-frontend
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

---

## Running the Project

### Start the Backend Server

Run the following command to start the backend server:
```bash
go run main.go
```

### Start the Frontend Server

Run the following command to start the frontend server:
```bash
ng serve
```

---

## Project Structure

```bash
Hastech/
├── e-commerce/
│   ├── main.go                # Main file
│   ├── controllers/           # Request handlers
│   ├── models/                # Data models
│   ├── routes/                # Route definitions
│   └── Database/              # Database configuration
├── e-commerce-frontend/
│   ├── src/
│   │   ├── app/               # Angular components
│   │   ├── assets/            # Images and resources
│   │   └── environments/      # Angular configurations
└── README.md                  # Documentation
```

---

## Key Features

- Authentication and authorization with JWT
- Product search and display
- Cart management
- Order management
- Responsive and mobile-friendly user interface

---

## Author

- Lead Developper : **Papa Amadou SARR (CTO)**
- 
Copyright HASTECH GROUP 