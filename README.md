# 🏆 3D Chess Application

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.163.0-000000?logo=three.js)](https://threejs.org/)
[![AWS Amplify](https://img.shields.io/badge/AWS-Amplify-FF9900?logo=amazon-aws)](https://aws.amazon.com/amplify/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.9.1-764ABC?logo=redux)](https://redux-toolkit.js.org/)

> **Live Demo**: [Deployed on AWS Amplify](https://your-amplify-url.amplifyapp.com) | **Backend**: [Neural Chess Engine](https://github.com/kshoker12/Chess-Engine)

A production-grade 3D chess application built with modern web technologies, featuring real-time gameplay, AI integration, and cloud deployment. Demonstrates expertise in full-stack development, 3D graphics programming, and cloud architecture.

## 🚀 Technical Highlights

### Frontend Architecture
- **React 18 + TypeScript** with strict typing and modern hooks
- **Three.js/React Three Fiber** for immersive 3D rendering and physics
- **Redux Toolkit** for predictable state management with optimized selectors
- **Custom chess logic** with chess.js integration for move validation
- **Tailwind CSS** for responsive, utility-first styling

### Key Features
- 🎮 **Real-time 3D chess board** with physics-based piece animations
- 🤖 **AI vs Human gameplay** with neural network-powered chess engine
- 👥 **Pass-and-play mode** for local multiplayer
- ✅ **Legal move validation** with visual highlighting
- 📊 **Move history tracking** and game state management
- ⏱️ **Timer system** with checkmate/stalemate detection
- ♟️ **Complete chess rules** including promotion, castling, and en passant

### Performance Optimizations
- **Memoized components** preventing unnecessary re-renders
- **Piece-specific selectors** for granular Redux updates
- **Lazy loading** and code splitting for optimal bundle size
- **Spring-based animations** with React Spring for smooth transitions

## 🔗 Backend Integration

Seamlessly integrated with a custom neural chess engine featuring:
- **RESTful API** communication with environment-based configuration
- **Axios HTTP client** with comprehensive error handling
- **Hybrid AI evaluation** combining neural networks with classical algorithms
- **Serverless deployment** on AWS Lambda with ARM64 optimization

> **Backend Repository**: [Neural Chess Engine](https://github.com/kshoker12/Chess-Engine) - A production-grade chess engine with machine learning evaluation and alpha-beta search algorithms.

## ☁️ AWS Amplify Deployment

### CI/CD Pipeline
- **Automated builds** triggered on git push to main branch
- **TypeScript compilation** with strict type checking
- **Production optimizations** via Vite bundler
- **Environment variable management** for API configuration

### Infrastructure
- **Static site hosting** on AWS Amplify
- **Global CDN distribution** for optimal performance
- **HTTPS by default** with automatic SSL certificates
- **Custom domain support** for professional deployment

### Build Configuration
- **pnpm package manager** for efficient dependency management
- **Multi-stage build process**: `tsc && vite build`
- **Production asset optimization** and minification
- **TypeScript strict mode** ensuring code quality

## 🛠️ Development Workflow

### Local Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run with hot reload on localhost:5173
```

### Production Build
```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Configure API endpoint
# VITE_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/prod/move
```

## 📊 Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend Framework** | React 18.2.0 | Component-based UI |
| **Type Safety** | TypeScript 5.9.3 | Static type checking |
| **3D Graphics** | Three.js 0.163.0 | 3D rendering engine |
| **3D Framework** | React Three Fiber | React integration |
| **State Management** | Redux Toolkit 2.9.1 | Predictable state |
| **Build Tool** | Vite 5.2.0 | Fast development & builds |
| **Styling** | Tailwind CSS 3.4.18 | Utility-first CSS |
| **Animations** | React Spring | Smooth transitions |
| **Chess Logic** | chess.js 1.4.0 | Game rules & validation |
| **HTTP Client** | Axios 1.12.2 | API communication |
| **Backend API** | Custom Neural Engine | AI-powered moves |
| **Cloud Hosting** | AWS Amplify | Serverless deployment |

## 🏗️ Project Architecture

### 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Board.tsx       # 3D chess board
│   ├── Piece.tsx       # Individual chess pieces
│   ├── GameUI.tsx      # Game interface
│   └── GameModeMenu.tsx # Game mode selection
├── store/              # Redux store
│   ├── slices/         # Redux slices
│   ├── selectors/      # Optimized selectors
│   └── api/            # API integration
├── types/              # TypeScript definitions
├── utils/              # Helper functions
└── context/            # React context (legacy)
```

### Redux Store Structure
- **boardSlice**: Board state, piece positions, legal moves
- **gameSlice**: Game history, move validation, AI integration
- **uiSlice**: UI state, timers, game modes, player settings

### Helper Utilities
- **ChessHelper**: Board creation, move application, legal move generation
- **FEN parsing**: Standard chess notation handling
- **API integration**: Bot move fetching and error handling

## 🎯 Key Engineering Decisions

- **React Three Fiber** over vanilla Three.js for seamless React integration
- **Redux Toolkit** for predictable state management and developer experience
- **TypeScript** for type safety, better IDE support, and reduced runtime errors
- **AWS Amplify** for serverless hosting with automatic CI/CD
- **Environment variables** for flexible API configuration across environments

## 🔮 Future Enhancements

- **Multiplayer support** via WebSockets for online gameplay
- **Game analysis features** with move evaluation and suggestions
- **Opening book integration** for enhanced AI gameplay
- **ELO rating system** for player skill tracking
- **Tournament mode** with bracket management
- **Mobile responsiveness** optimization for touch devices

## 🏆 What This Demonstrates

This project showcases expertise in:
- **Full-stack development** with modern React and TypeScript
- **3D graphics programming** using WebGL and Three.js
- **State management architecture** with Redux Toolkit
- **Cloud deployment** and CI/CD with AWS Amplify
- **API integration** with custom backend services
- **Production-grade engineering** with proper error handling and optimization
- **Modern development practices** including TypeScript, ESLint, and Prettier

---