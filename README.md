# 📝 Todo App

A full-stack todo application built with React, Node.js, Express, and MongoDB. This application allows users to create, read, update, and delete todo items with a clean and intuitive interface.

## 🚀 Features

- ✅ Create new todo items
- ✏️ Mark todos as completed/uncompleted
- 🗑️ Delete todo items
- 💾 Persistent data storage with MongoDB
- 🐳 Fully containerized with Docker
- 🎨 Responsive UI design
- 🔄 Real-time updates

## 🏗️ Architecture

This application follows a 3-tier architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│   Port: 3000    │    │   Port: 5000    │    │   Port: 27017   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing

### Database
- **MongoDB** - NoSQL database

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Production web server

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Docker](https://www.docker.com/get-started) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)

## 🚀 Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Himejjad/todo-app.git
   cd todo-app
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/todos
   - MongoDB: localhost:27017

4. **Stop the application**
   ```bash
   docker-compose down
   ```

### Manual Setup

#### Backend Setup
```bash
cd backend
npm install
npm start
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

#### MongoDB Setup
Make sure MongoDB is running locally on port 27017, or update the connection string in the backend.

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/todos` | Get all todos | - |
| POST | `/todos` | Create a new todo | `{ "text": "string" }` |
| PUT | `/todos/:id` | Toggle todo completion | - |
| DELETE | `/todos/:id` | Delete a todo | - |

### Example Requests

#### Get all todos
```bash
curl -X GET http://localhost:5000/api/todos
```

#### Create a new todo
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "Learn Docker"}'
```

#### Toggle todo completion
```bash
curl -X PUT http://localhost:5000/api/todos/MONGO_ID
```

#### Delete a todo
```bash
curl -X DELETE http://localhost:5000/api/todos/MONGO_ID
```

## 📁 Project Structure

```
todo-app/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── public/
│   │   ├── index.html
│   │   └── ...
│   └── src/
│       ├── App.js
│       ├── App.css
│       ├── index.js
│       └── ...
├── docker-compose.yml
├── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
MONGO_URI=mongodb://mongo:27017/todo-app
PORT=5000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

## 🚀 Deployment

### Production Build
```bash
# Build all services
docker-compose -f docker-compose.prod.yml up --build

# Or build individually
cd frontend && npm run build
cd backend && npm start
```

### Cloud Deployment
This application can be deployed to various cloud platforms:

- **AWS**: Using ECS, EC2, or Elastic Beanstalk
- **Google Cloud**: Using Cloud Run or Compute Engine
- **Azure**: Using Container Instances or App Service
- **Heroku**: Using container deployment
- **DigitalOcean**: Using App Platform


## 📝 Development Notes

### Future Enhancements
- [ ] User authentication
- [ ] Todo categories/tags
- [ ] Due dates and priorities
- [ ] Search and filter functionality
- [ ] Dark mode theme
- [ ] Progressive Web App (PWA) features
- [ ] Email notifications
- [ ] Drag and drop reordering

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill processes using the ports
   sudo lsof -ti:3000,5000,27017 | xargs kill -9
   ```

2. **MongoDB connection error**
   ```bash
   # Check if MongoDB container is running
   docker-compose ps
   
   # Restart MongoDB service
   docker-compose restart mongo
   ```

3. **Frontend can't connect to backend**
   - Ensure backend is running on port 5000
   - Check CORS configuration
   - Verify API URLs in frontend code


## 👨‍💻 Author

**Himejjad**
- GitHub: [@Himejjad](https://github.com/Himejjad)

---

⭐ **Don't forget to star this repo if you found it helpful!** ⭐