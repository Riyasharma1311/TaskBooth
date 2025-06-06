# 🗂️ TaskBooth – Task Board Application

TaskBooth is a collaborative task board application built with React and TypeScript, designed to help teams efficiently organize, assign, and track tasks using an intuitive drag-and-drop interface.

---

## 🌐 Live Demo

🔗 https://taskbooth.netlify.app/

---

## 🎯 Objective

Build a task board application where users can:

-   Create and manage multiple boards
-   Add columns (To Do, In Progress, Done, etc.)
-   Create, edit, delete, and move tasks
-   Assign tasks to team members
-   Organize tasks by priority and due date
-   Use drag-and-drop for better workflow management

---

## 📸 Screenshots

### 🔹 Board View Page

![Screenshot 2025-06-06 191059](https://github.com/user-attachments/assets/624de135-a8e1-457d-a874-3b40bd422cf9)


### 🔹 Board Detail Page

![Screenshot 2025-06-06 191159](https://github.com/user-attachments/assets/dc1990cf-3757-475e-9a7a-e2096118821a)


### 🔹 Login/Signup

![Screenshot 2025-06-06 191207](https://github.com/user-attachments/assets/4703e1fd-0c80-4998-af90-e988bcb41dbc)

---

## ✅ Features

### Core Features

-   Create a new board
-   View all boards in a table
-   Navigate to board detail view
-   Create, edit, and delete columns
-   Create, edit, and delete tasks
-   Assign tasks to team members
-   Set priority (High / Medium / Low)
-   Due dates & creator info
-   Move tasks across columns
-   Reorder tasks within columns

### Bonus Features Implemented

-   🔁 **Drag-and-drop** reordering and movement (via `react-beautiful-dnd`)
-   🔍 Task **search** by name
-   🏷️ **Priority badges** and filters
-   🌈 **Responsive UI** with TailwindCSS
-   🧠 **Zustand** for state management
-   🛠️ Fully **type-safe** with TypeScript

---

## 🧱 Tech Stack

| Tech | Purpose |
| :----------------------- | :---------------------------------- |
| **React** | UI Library |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Vite** | Build & Dev server |
| **Zustand** | State management |
| **react-beautiful-dnd** | Drag-and-drop functionality |

---

## 🧪 How to Run the Project Locally

### Prerequisites

-   Node.js (v16 or above)
-   npm or yarn

### Steps

1.  **Clone the repository**

    ```bash
    git clone [https://github.com/Riyasharma1311/TaskBooth.git](https://github.com/Riyasharma1311/TaskBooth.git)
    cd TaskBooth
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the development server**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The app will be running at `http://localhost:5173`

4.  **Build for production**

    ```bash
    npm run build
    # or
    yarn build
    ```

5.  **Preview production build locally**

    ```bash
    npm run preview
    # or
    yarn preview
    ```

---

## 📁 Project Structure
TaskBooth/
├── src/
│ ├── components/       # Reusable UI components
│ ├── pages/            # Page-level views
│ ├── context/          # Global state using Context API
│ ├── types/            # TypeScript types/interfaces
│ ├── hooks/            # Custom hooks
│ └── App.tsx           # Root component
├── public/
├── index.html
├── tailwind.config.ts
├── vite.config.ts
└── README.md

---

## 🚀 Deployment

The project is deployed using **Netlify**.

### Steps to deploy manually:

```bash
npm run build
# Upload the contents of the 'dist/' folder to Vercel or Netlify

```
📌 Future Enhancements
User authentication (login/logout)
Real-time updates using WebSockets
Backend with database (e.g., MongoDB)
Markdown in task descriptions
Sort tasks by due date, priority, assignee

🙋‍♀️ About Me
Riya Sharma
🎓 B.Tech IT @ MSIT
💻 Frontend Developer | UI/UX Enthusiast
📫 riyasharma1311@gmail.com
🔗 LinkedIn- https://www.linkedin.com/in/riya-sharma-234196248/

📜 License
This project is for assignment and educational purposes only.
