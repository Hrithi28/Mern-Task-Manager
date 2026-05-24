# TaskFlow - MERN Kanban Task Manager

![TaskFlow Header](https://via.placeholder.com/1200x400/0a0a0f/6c63ff?text=TaskFlow+-+MERN+Task+Manager)

A feature-rich, premium Kanban-style task management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). 

TaskFlow helps you organize projects, track progress, and manage tasks with an intuitive drag-and-drop interface and a stunning dark-mode glassmorphism design.

## ✨ Features

- **User Authentication:** Secure JWT-based registration and login system.
- **Project Management:** Create multiple projects, assign custom colors, and track overall project progress.
- **Interactive Kanban Board:** Drag and drop tasks between columns (To Do, In Progress, Review, Done) with real-time UI updates.
- **Task Details:** Set priorities (Low, Medium, High, Critical), add labels, descriptions, and track due dates.
- **Dashboard Analytics:** Visual overview of your tasks with real-time stats across all your active projects.
- **Premium UI/UX:** Built with modern design principles featuring dark mode, glassmorphism components, smooth micro-animations, and responsive layouts.

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Routing:** React Router v6
- **State Management:** React Context API
- **Drag & Drop:** `@hello-pangea/dnd`
- **Styling:** Custom CSS (Design System tokens, CSS variables, animations)
- **Icons:** Lucide React
- **HTTP Client:** Axios (with interceptors)
- **Notifications:** React Hot Toast

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose ORM)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Environment:** dotenv

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or a MongoDB Atlas URI)

### 1. Clone & Install Dependencies

```bash
# Clone the repository (if applicable)
# Navigate to the project directory
cd mern-task-manager

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory and add the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-task-manager
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```
*(Note: If using MongoDB Atlas, replace the `MONGO_URI` with your connection string).*

### 3. Run the Application

You'll need two terminal windows to run the frontend and backend concurrently.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📁 Project Structure

```text
mern-task-manager/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── api/            # Axios instance and API calls
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth and Task React Contexts
│   │   ├── pages/          # Full page views (Dashboard, Board, etc.)
│   │   ├── App.jsx         # App routing and layout
│   │   └── index.css       # Global design system
│   └── vite.config.js
│
└── server/                 # Express Backend
    ├── config/             # DB connection logic
    ├── middleware/         # Custom middlewares (e.g., JWT Auth)
    ├── models/             # Mongoose schemas (User, Task, Project)
    ├── routes/             # API routes
    └── index.js            # Server entry point
```

## 🎨 Design System

The application uses a custom-built design system located in `client/src/index.css`. It features:
- **Glassmorphism:** Cards use `backdrop-filter: blur(16px)` with semi-transparent backgrounds.
- **Color Palette:** Curated violet (`#6c63ff`) and teal (`#00d4aa`) accents on a deep dark background (`#07070f`).
- **Typography:** Uses the 'Inter' font family for a clean, modern look.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
