# Task Management API - Temporary README Update

## 📋 Demo Video
Coming soon
---

## **Overview**
Full-stack Task Management application with authentication and task CRUD functionality.

---

## **Backend Setup**
<details>
  <summary> Database Setup </summary>

### **1. Install PostgreSQL**
```bash
brew install postgresql@14
brew services start postgresql@14
```

### **2. Create the Database**
```sql
CREATE DATABASE task_management;
```

### **3. Set up Tables**
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
</details>

---

<details>
  <summary>🚀 Setting up and Running the Backend</summary>

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
```env
DB_USER=your_username
DB_NAME=task_management
JWT_SECRET=your_generated_secret_key
```

### **4. Start the Backend**
```bash
npm run dev
```
</details>

---

<details>
  <summary>🛠 Testing the Backend with cURL</summary>

#### **1. Register a New User**
```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{"username": "newuser", "password": "mypassword"}'
```

#### **2. Log In to Get JWT Token**
```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "newuser", "password": "mypassword"}'
```
_This will return a token to use in subsequent requests._

#### **3. Create a Task (Authenticated Route)**
```bash
curl -X POST http://localhost:3000/tasks \
-H "Authorization: Bearer YOUR_JWT_HERE" \
-H "Content-Type: application/json" \
-d '{"title": "New Task", "description": "Task details"}'
```

#### **4. Retrieve Tasks (Authenticated Route)**
```bash
curl -X GET http://localhost:3000/tasks \
-H "Authorization: Bearer YOUR_JWT_HERE"
```

#### **5. Update a Task**
```bash
curl -X PUT http://localhost:3000/tasks/1 \
-H "Authorization: Bearer YOUR_JWT_HERE" \
-H "Content-Type: application/json" \
-d '{"title": "Updated Task Title", "isComplete": true}'
```

#### **6. Delete a Task**
```bash
curl -X DELETE http://localhost:3000/tasks/1 \
-H "Authorization: Bearer YOUR_JWT_HERE"
```
</details>

---

<details>
  <summary>🎨 Frontend Setup</summary>

### Install Dependencies
```bash
npm install
```

### Create `.env` File
```bash
VITE_API_URL=http://localhost:3000
```
Replace `http://localhost:3000` with your deployed backend URL if needed.

### Start the Frontend
```bash
npm run dev
```
This will start the frontend at `http://localhost:5173`.
</details>

---

<details>
  <summary>Salary Expectation</summary>
I expect $25 an hour x 40 hours a week -> $4000 per month
</details>

---