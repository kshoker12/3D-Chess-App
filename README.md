# 🏆 3D Chess Application

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.163.0-000000?logo=three.js)](https://threejs.org/)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-222222?logo=github)](https://pages.github.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.9.1-764ABC?logo=redux)](https://redux-toolkit.js.org/)

> **Live Demo**: [kshoker12.github.io/3D-Chess-App](https://kshoker12.github.io/3D-Chess-App/) | **Backend**: [Neural Chess Engine](https://github.com/kshoker12/Chess-Engine)

A production-grade 3D chess application built with modern web technologies, featuring real-time gameplay, AI integration, and automated deployment to GitHub Pages.

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
  - **Adjustable difficulty levels**: Easy, Medium, and Hard bot settings
  - **Customizable AI strength** with configurable search depth
- 👥 **Pass-and-play mode** for local multiplayer
- ✅ **Legal move validation** with visual highlighting
- 📊 **Move history tracking** and game state management
- ⏱️ **Timer system** with checkmate/stalemate detection
- ♟️ **Complete chess rules** including promotion, castling, and en passant
- 📱 **Responsive design** optimized for desktop and mobile devices

### Performance Optimizations
- **Memoized components** preventing unnecessary re-renders
- **Piece-specific selectors** for granular Redux updates
- **Spring-based animations** with React Spring for smooth transitions

## 🎮 Gameplay Modes

### Pass & Play Mode
- **Two players** take turns on the same device
- Perfect for local multiplayer games
- Real-time timer for each player
- Full chess rules support

### VS Bot Mode
- **Challenge AI opponent** with adjustable difficulty
- **Difficulty Selection**:
  - **Easy**: Transformer-based move selection
  - **Medium**: Alpha-beta search (default)
  - **Hard**: Monte Carlo tree search
- **Color Selection**: Choose to play as White or Black
- Bot automatically makes first move if you choose Black
- Real-time game state updates

## 🔗 Backend Integration

The frontend talks to a chess AI backend via **RunPod** (default) or a **local dev server**:

| Difficulty | RunPod endpoint | Local endpoint |
|------------|-----------------|----------------|
| Easy | `transformer-move` | `POST /v1/api/transformer-move` |
| Medium | `alphabeta-eval` | `POST /v1/api/alphabeta-eval` |
| Hard | `mcts-3` | `POST /v1/api/mcts-3` |

- **RunPod serverless API** for production (async job submit + poll)
- **Local backend** at `http://localhost:8001` when `VITE_USE_RUNPOD=false`
- **Axios HTTP client** with error handling and timeout retries

> **Backend Repository**: [Neural Chess Engine](https://github.com/kshoker12/Chess-Engine) — machine learning evaluation, alpha-beta search, and MCTS.

## ☁️ GitHub Pages Deployment

The app deploys automatically via GitHub Actions on every push to `main`.

### Live URL
**https://kshoker12.github.io/3D-Chess-App/**

### CI/CD Pipeline
- **Trigger**: push to `main` or manual `workflow_dispatch`
- **Build**: `tsc && vite build` with `VITE_BASE_PATH=/3D-Chess-App/`
- **Deploy**: GitHub Pages artifact upload via `actions/deploy-pages`

### One-time setup
1. In the repo, go to **Settings → Pages**
2. Set **Source** to **GitHub Actions**
3. Add a repository secret: `VITE_RUNPOD_API_KEY` (required for bot mode in production)

### Workflow file
`.github/workflows/deploy.yml`

## 🛠️ Development Workflow

### Local Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
# → http://localhost:5173
```

### Production Build
```bash
# Standard build (served from root)
pnpm build
pnpm preview

# Preview the GitHub Pages build locally
VITE_BASE_PATH=/3D-Chess-App/ pnpm build
pnpm preview --base /3D-Chess-App/
```

### Environment Setup
```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_RUNPOD_API_KEY` | RunPod API key (required for bot mode in production) |
| `VITE_USE_RUNPOD` | Set to `false` to use local backend at `localhost:8001` |
| `VITE_BASE_PATH` | Asset base path; set to `/3D-Chess-App/` for GitHub Pages preview |

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
| **AI Backend** | RunPod serverless | Bot move generation |
| **Hosting** | GitHub Pages | Static site deployment |

## 🏗️ Project Architecture

### 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Board.tsx        # 3D chess board
│   ├── Piece.tsx        # Individual chess pieces
│   ├── GameUI.tsx       # Game interface
│   ├── GameModeMenu.tsx # Game mode & difficulty selection
│   ├── Square.tsx       # Chess board squares
│   └── Table.tsx        # 3D table environment
├── store/               # Redux store
│   ├── slices/          # Redux slices
│   ├── selectors/       # Optimized selectors
│   └── api/             # Bot API (RunPod / local)
├── types/               # TypeScript definitions
└── utils/               # Helpers (ChessHelper, assets, FEN)
public/
├── models/              # GLB piece models
└── textures/            # Board and environment images
```

### Redux Store Structure
- **boardSlice**: Board state, piece positions, legal moves, last move tracking
- **gameSlice**: Game history, move validation, AI integration
- **uiSlice**: UI state, timers, game modes, player settings, bot difficulty selection

### Helper Utilities
- **ChessHelper**: Board creation, move application, legal move generation
- **assets**: Resolves public asset paths for GitHub Pages subpath deployment
- **FEN parsing**: Standard chess notation handling
- **botApi**: RunPod job submission/polling and local backend fallbacks

## 🎯 Key Engineering Decisions

- **React Three Fiber** over vanilla Three.js for seamless React integration
- **Redux Toolkit** for predictable state management and developer experience
- **TypeScript** for type safety, better IDE support, and reduced runtime errors
- **GitHub Pages + Actions** for zero-cost static hosting with automated CI/CD
- **RunPod** for serverless AI inference without managing GPU infrastructure
- **Environment variables** for flexible API configuration across local and production

## 🔮 Future Enhancements

- **Multiplayer support** via WebSockets for online gameplay
- **Game analysis features** with move evaluation and suggestions
- **Opening book integration** for enhanced AI gameplay
- **ELO rating system** for player skill tracking
- **Tournament mode** with bracket management

## 🏆 What This Demonstrates

This project showcases expertise in:
- **Full-stack development** with modern React and TypeScript
- **3D graphics programming** using WebGL and Three.js
- **State management architecture** with Redux Toolkit
- **CI/CD deployment** with GitHub Actions and GitHub Pages
- **Serverless AI integration** via RunPod
- **Production-grade engineering** with proper error handling and optimization

---
