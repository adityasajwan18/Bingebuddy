# 🎬 BingeBuddy

**BingeBuddy** is a real-time watch party web application that allows multiple users to watch YouTube videos together in perfect sync.  
Users can create or join rooms using a **room code or shareable link**, chat in real time, and enjoy synchronized playback with **host-only controls**.

---

## ✨ Features

- 🎥 **Synchronized YouTube Playback**
- 🏠 **Room System**
  - Join via room code
  - Join via shareable room link
- 👑 **Host-only Controls**
  - Play / Pause
  - Seek video
  - Change video
- 💬 **Real-time Chat System**
- ✍️ **Typing indicators in chat**
- 👥 **Live User List**
- ⏱️ **Auto-sync New Users**
- 🌙 **Dark Mode UI**
- ⚡ **Real-time communication using WebSockets**
- 🎨 **Modern UI with React + Tailwind CSS**

---

## 🧠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- YouTube IFrame API
- Socket.IO Client

### Backend
- Node.js
- Express.js
- Socket.IO

---

## 🏗️ System Architecture

Client (React)
├── YouTube Player
├── Chat System
├── User List
└── Host Controls
↓
Socket.IO Server
├── Room Management
├── User State
├── Video State Sync
└── Real-time Events

---

## 📁 Project Structure

BingeBuddy/
│
├── server/
│ └── index.js
│
└── client/
├── src/
│ ├── components/
│ │ ├── Player.jsx
│ │ ├── Chat.jsx
│ │ ├── UserList.jsx
│ ├── socket.js
│ ├── App.jsx
│
└── tailwind.config.js

yaml
Copy code

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- A modern web browser

---

### 🔧 Backend Setup

```
cd server
npm install
node index.js
Server will start on:

http://localhost:3000
🎨 Frontend Setup


cd client
npm install
npm run dev
Frontend will start on:


http://localhost:5173
```
🏠 How Rooms Work
A user creates or joins a room

The first user becomes the host

Host controls video playback

All users receive real-time updates

New users auto-sync to:

Current video

Current timestamp

Play/Pause state

🌙 Dark Mode
BingeBuddy supports dark mode using Tailwind CSS.

js
```
document.documentElement.classList.toggle("dark");
```
🔐 Host Permissions
Only the host can:

Control playback

Seek the video

Change the video URL

This ensures smooth synchronization for all users.

📌 Future Enhancements
🔐 Authentication (JWT / OAuth)

📱 Mobile Responsive UI

🔊 Volume sync

🎭 Emoji reactions

🧑‍🤝‍🧑 Friend system

📺 Support for platforms beyond YouTube

🤝 Contributing
Contributions are welcome!

Fork the repository

Create a new branch (feature/your-feature)

Commit your changes

Push to your fork

Open a Pull Request


🙌 Acknowledgements
YouTube IFrame API

Socket.IO

React

Tailwind CSS

⭐ Show Your Support
If you like this project, please give it a ⭐ on GitHub — it helps a lot!



---
