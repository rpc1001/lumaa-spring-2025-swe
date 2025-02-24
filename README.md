# Task Management Application
##  Demo Video
[ Video Here](https://drive.google.com/file/d/1i6DzIFzC1w1UmbPgfHgpeTK_G3Oq2xU_/view?usp=sharing)

## Database Setup

#### **1. Install PostgreSQL**
```bash
brew install postgresql@14
brew services start postgresql@14
psql -U postgres
CREATE USER your_username;
ALTER USER your_username CREATEDB;
```

###  **Automatic Database Setup**

The backend **automatically creates the database and tables** if they do not exist.  

### **Manual Setup (Optional)**
If you prefer to manually configure PostgreSQL, follow these steps:

#### **1. Create the Database**
```sql
CREATE DATABASE task_management;
```

#### **2. Set up Tables**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    isComplete BOOLEAN DEFAULT FALSE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
```

## Setting up and Running the Backend

### **1. Clone the Repository**
```bash
git clone https://github.com/rpc1001/lumaa-spring-2025-swe
cd lumaa-spring-2025-swe
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Create `.env` File**
Create a `.env` file inside the `backend/` folder with the following content:
```env
DB_USER=your_username
DB_NAME=task_management
JWT_SECRET=your_generated_secret_key
PORT=3000
```

### **4. Start the Backend**
```bash
npm run dev
```
This starts the backend at `http://localhost:3000`.

## Frontend Setup

### **1. Install Dependencies**
```bash
npm install
```

### **2. Create `.env` File**
Create a `.env` file inside the `frontend/` folder with the following content:
```env
VITE_API_URL=http://localhost:3000
```
Replace `http://localhost:3000` with your deployed backend URL if needed.

### **3. Start the Frontend**
```bash
npm run dev
```
This will start the frontend at `http://localhost:5173`.

## API Endpoints (For Testing)

### **1. Register a New User**
```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{"username": "newuser", "password": "mypassword"}'
```

### **2. Log In to Get JWT Token**
```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "newuser", "password": "mypassword"}'
```
_This returns a token to use in requests._

### **3. Create a Task (Authenticated Route)**
```bash
curl -X POST http://localhost:3000/tasks \
-H "Authorization: Bearer YOUR_JWT_HERE" \
-H "Content-Type: application/json" \
-d '{"title": "New Task", "description": "Task details"}'
```

### **4. Retrieve Tasks (Authenticated Route)**
```bash
curl -X GET http://localhost:3000/tasks \
-H "Authorization: Bearer YOUR_JWT_HERE"
```

### **5. Update a Task**
```bash
curl -X PUT http://localhost:3000/tasks/1 \
-H "Authorization: Bearer YOUR_JWT_HERE" \
-H "Content-Type: application/json" \
-d '{"title": "Updated Task Title", "isComplete": true}'
```

### **6. Delete a Task**
```bash
curl -X DELETE http://localhost:3000/tasks/1 \
-H "Authorization: Bearer YOUR_JWT_HERE"
```

## Pay and Demo

- **Salary Expectation:** I expect **$25/hour** × **40 hours/week** → **$4000 per month**.

