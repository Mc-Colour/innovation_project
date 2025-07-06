# Equiwelf - Innovation Project

## Features
- User Authentication
- Add, edit, and delete horses
- Weight tracking
- Care reminders with due dates
- Education Zone
- Mobile-first responsive UI
- Node js backend with express

## Getting Started

### 1. Clone the Respository
```bash
git clone https://github.com/mc-colour/innovation_project.git
cd innovation_project
```
or Download the ZIP and extract it.


### 2. Install Dependencies
Install dependencies sperately for teh frontend and backend

#### Backend:
```bash
cd server
npm install
```

#### Frontend:
```bash
cd client
npm install
```

### 3. Set Enviornment Variables
Create a .env file in the server/ folder with the following contents:
```
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SERVER=your_db_server
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
```
Alternatively ensure you are on the University's network to use the packaged .env
If creating new database, use query in 5.

### 4. Run the App
start the backend (port 3001):
```bash
cd server
node index.js
```
Start the frontend (port 3000):
```bash
cd client
npm start
```

### 5. Database Creation Query
```SQL
DROP TABLE IF EXISTS FoodLog;
DROP TABLE IF EXISTS ExerciseLog;
DROP TABLE IF EXISTS CareReminder;
DROP TABLE IF EXISTS WeightHistory;
DROP TABLE IF EXISTS Horse;
DROP TABLE IF EXISTS Users;

-- Users table
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL
);

-- Horse table
CREATE TABLE Horse (
    HorseID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    Name VARCHAR(50) NOT NULL,
    Breed VARCHAR(50),
    Age INT,
    CurrentWeight INT, 
    CONSTRAINT FK_Horse_User FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Weight HIstory Tracking
CREATE TABLE WeightHistory (
    WeightID INT PRIMARY KEY IDENTITY(1,1),
    HorseID INT NOT NULL,
    Weight INT NOT NULL,
    EntryDate DATE NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Weight_Horse FOREIGN KEY (HorseID) REFERENCES Horse(HorseID) ON DELETE CASCADE
);

-- Care Reminders
CREATE TABLE CareReminder (
    ReminderID INT PRIMARY KEY IDENTITY(1,1),
    HorseID INT NOT NULL,
    Type VARCHAR(50) NOT NULL,
    DueDate DATE NOT NULL,
    Completed BIT DEFAULT 0,
    CONSTRAINT FK_Reminder_Horse FOREIGN KEY (HorseID) REFERENCES Horse(HorseID) ON DELETE CASCADE
);

--Exercise Logging
CREATE TABLE ExerciseLog (
    ExerciseID INT PRIMARY KEY IDENTITY(1,1),
    HorseID INT NOT NULL,
    Description VARCHAR(100),
    DurationMinutes INT,
    ExerciseDate DATE,
    CONSTRAINT FK_Exercise_Horse FOREIGN KEY (HorseID) REFERENCES Horse(HorseID) ON DELETE CASCADE
)

-- FOOD Logging
CREATE TABLE FoodLog (
    FoodID INT PRIMARY KEY IDENTITY(1,1),
    HorseID INT NOT NULL,
    Description VARCHAR(100),
    QuantityKg DECIMAL (5,2),
    FoodDate DATE,
    CONSTRAINT FK_Food_Horse FOREIGN KEY (HorseID) REFERENCES Horse(HorseID) ON DELETE CASCADE
```

