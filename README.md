# 🍽️ Smarteg API Backend

<div align="center">

![Smarteg Logo](assets/logo.png)

**API backend server for Smarteg - Empowering Indonesian Warteg with Smart Stock Management**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21+-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)

</div>

## 🌟 About Smarteg

**Smarteg** is a Next.js-based Progressive Web App (PWA) designed to help **Warteg** (small Indonesian food stalls) minimize food waste, optimize stock management, and empower **UMKM** (Usaha Mikro, Kecil, dan Menengah) in sustainable practices.

This repository contains the **API backend server** that powers the Smarteg ecosystem by providing:

- 🔐 **Google OAuth Authentication** with JWT token management
- 🤖 **Google Gemini AI Integration** for ephemeral token generation
- 🍽️ **Menu Management System** with full CRUD operations for menu items
- 📦 **Stock Management System** with real-time inventory tracking
- 💰 **Sales Management** with daily transaction recording
- 📢 **Automated Announcement System** via Telegram channel for freshly made food alerts
- 🗄️ **MongoDB Database Storage** for persistent data management

## 🏗️ Architecture Overview

The MVP architecture leverages:

- **Constant Online Connectivity** for real-time operations
- **Web Speech API** (frontend) for Speech-to-Text (STT) and Text-to-Speech (TTS)
- **Local Predictive Analytics** (frontend) using JavaScript algorithms (weighted moving averages)
- **WebSocket Connection** to this backend server hosting Google Gemini AI for real-time background processing
- **Discrepancy Detection & Stock Validation** powered by AI
- **Automated Customer Communication** via Telegram Bot API for freshly made food announcements

## 🛠️ Tech Stack

### Backend Technologies
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.21+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: 
  - Google OAuth 2.0 (Passport.js)
  - JWT (JSON Web Tokens)
- **AI Integration**: Google Gemini AI (@google/genai)
- **Communication**: Telegram Bot API for automated announcements
- **File Upload**: Multer for multipart/form-data handling
- **Session Management**: Express Session
- **Security**: CORS, Body Parser

### Development & Deployment
- **Development**: Nodemon for hot reloading
- **Containerization**: Docker & Docker Compose
- **Database Management**: MongoDB with Mongo Express GUI
- **API Documentation**: OpenAPI 3.0 specification

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Google Cloud Console access for OAuth setup

### 1. Clone the Repository

```bash
git clone https://github.com/smarteg-app/smarteg-api.git
cd smarteg-api
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.sample .env

# Edit .env with your configuration
vi .env
```

**Required Environment Variables:**
```env
DEBUG=true
PORT=8080
FE_HOST=https://smarteg.app

MONGODB_URI="mongodb://admin:password@localhost:27017/smarteg?authSource=admin"

JWT_SECRET=your-super-secret-jwt-key
JWT_DEFAULT_EXPIRE=1d
SESSION_SECRET=your-session-secret

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_OAUTH_CALLBACK=http://localhost:8080/user/auth/google/callback
GOOGLE_AI_API_KEY=your-google-ai-api-key

TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=@your_channel_username
```

### 3. Start Database Services

```bash
# Start MongoDB and Mongo Express
docker compose up -d mongodb mongo-express
```

Access Mongo Express at: `http://localhost:8081`

### 4. Install Dependencies & Run

```bash
# Install dependencies
npm install

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The API server will be available at: `http://localhost:8080`

## 📋 API Documentation

### Core Endpoints

#### 🔐 Authentication
- `GET /user/auth/google` - Initiate Google OAuth
- `GET /user/auth/google/callback` - OAuth callback handler
- `GET /user/auth/google/failure` - OAuth failure handler
- `GET /user/auth/sign-token` - Generate JWT after OAuth
- `GET /user/auth/refresh-token` - Refresh JWT token
- `GET /user/auth/google/logout` - Logout user

#### 👤 User Profile
- `GET /user/me` - Get authenticated user profile
- `PUT /user/me` - Update user profile

#### 🤖 Gemini AI Service
- `GET /service/gemini/token` - Get ephemeral Gemini AI token

#### 🍽️ Menu Management
- `GET /service/menu/read` - Get user menu items
- `POST /service/menu/create` - Create new menu items
- `PUT /service/menu/update` - Update existing menu items
- `DELETE /service/menu/remove` - Remove menu item

#### 📦 Stock Management
- `GET /service/stock/daily` - Get today's stock
- `GET /service/stock/daily/{date}` - Get stock for specific date
- `GET /service/stock/weekly` - Get past week stock data
- `GET /service/stock/monthly` - Get past month stock data
- `PUT /service/stock/add` - Add new stock items

#### 💰 Sales Management
- `GET /service/sales/daily` - Get today's sales
- `GET /service/sales/daily/{date}` - Get sales for specific date
- `GET /service/sales/weekly` - Get past week sales data
- `GET /service/sales/monthly` - Get past month sales data
- `PUT /service/sales/add` - Record sales transactions

#### 📢 Announcement Service
- `POST /service/post/telegram-channel` - Send photo with announcement to Telegram channel (automated food freshness alerts)

### Interactive API Documentation

- **OpenAPI Spec**: `/openapi.yaml`
- **Postman Collection**: `/postman.json`

## 🏭 Production Deployment

### Using Docker

```bash
# Build and run with Docker Compose
docker compose up --build
```

### Environment-Specific Configuration

**Production Environment Variables:**
```env
DEBUG=false
PORT=8080
FE_HOST=https://smarteg.app
MONGODB_URI=mongodb://your-production-mongodb-uri
# ... other production configs
```

## 📊 Data Models

### User Profile
```json
{
  "name": "Faiz",
  "email": "m@faiz.at",
  "picture": "https://lh3.googleusercontent.com/a/example"
}
```

### Menu Item
```json
{
  "name": "Ayam Bakar",
  "icon": "🍗",
  "capital": 5000,
  "price": 10000
}
```

### Stock Item
```json
{
  "name": "Ayam Goreng Serundeng",
  "price": 10000,
  "counts": 17
}
```

### Daily Stock
```json
{
  "items": [/* StockItem array */],
  "date": "2025-01-24"
}
```

### Sales Record
```json
{
  "sales": 150000,
  "items": [/* Array of sold items */],
  "date": "2025-01-24"
}
```

### Sale Request
```json
{
  "name": "Ayam Goreng Serundeng",
  "counts": 5
}
```

### Telegram Announcement Request
```
Content-Type: multipart/form-data

photo: [image file] (required, max 10MB)
caption: "🍗 Ayam Goreng Serundeng freshly taken out of fryer, ready to serve!"
```

### Telegram Response
```json
{
  "status": "success",
  "message": "Photo sent to Telegram channel successfully",
  "data": {
    "message_id": 123456,
    "chat_id": -1001234567890,
    "date": 1735043924
  }
}
```

## 🔧 Development

### Project Structure

```
smarteg-api/
├── app/
│   ├── configs/database/     # Database configurations
│   ├── domains/             # Business logic domains
│   │   ├── services/        # Core services (menu, stock, sales, gemini)
│   │   └── users/          # User management & auth
│   ├── middlewares/         # Custom middlewares
│   ├── utils/              # Utility functions
│   └── templates/          # HTML templates
├── assets/                 # Static assets
├── compose.yml            # Docker Compose configuration
├── Dockerfile            # Docker image definition
└── openapi.yaml          # API documentation
```

### Adding New Features

1. Create domain-specific controllers in `app/domains/`
2. Define routes in corresponding router files
3. Update OpenAPI specification
4. Add tests and documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Smarteg Developers** - [dev@smarteg.app](mailto:dev@smarteg.app)

<div align="center">

**Made with ❤️ for Indonesian Warteg and UMKM community**

[🌐 Website](https://smarteg.app) • [📧 Contact](mailto:contact@smarteg.app) • [📚 Documentation](openapi.yaml)

</div>