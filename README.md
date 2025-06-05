# Multiplayer Pong

A real-time, full-stack multiplayer Pong game built with Node.js, React, and TypeScript. This project features a server-authoritative architecture where all game logic is handled by the backend, providing a synchronized and cheat-resistant gameplay experience for two players over WebSockets.

## Architecture Diagram

The client-server model is designed to be simple and robust. Clients are responsible for rendering and sending user input, while the server manages the entire game state.

```ascii
+-----------------+                           +-----------------+
|                 |                           |                 |
|   Client 1      |                           |   Client 2      |
| (React App)     |                           | (React App)     |
| localhost:5173  |                           | localhost:5173  |
|                 |                           |                 |
+-------+---------+                           +---------+-------+
        | ▲ "paddleMove" (W/S)                  | ▲ "paddleMove" (↑/↓)
        |                                       |
        +---------------------------------------+
                           |
                   WebSocket (Socket.IO)
                           |
                   +-------v-------+
                   |               |
                   | Backend Server|
                   | (Node.js)     |
                   | localhost:3000|
                   +-------+-------+
                           |
             +-------------+-------------+
             | Game Logic (Authoritative)|
             | - Ball Movement           |
             | - Collision Detection     |
             | - Scoring & State Mgmt    |
             +---------------------------+
                           |
                   WebSocket (Socket.IO)
                           |
        +------------------+------------------+
        | ▼ "gameState" (60 FPS)            | ▼ "gameState" (60 FPS)
        |                                   |
+-------v---------+               +---------v-------+
|                 |               |                 |
|   Client 1      |               |   Client 2      |
| (Canvas Render) |               | (Canvas Render) |
|                 |               |                 |
+-----------------+               +-----------------+
```

## Features

- **Server-Authoritative Logic**: All game physics, collision, and scoring are handled by the server to ensure fairness.
- **Real-Time WebSocket Communication**: Uses Socket.IO for low-latency, bidirectional communication.
- **Automatic Player Matchmaking**: The first two players to join are automatically paired in a game room.
- **Smooth Rendering**: Frontend rendering is decoupled from the game loop using `requestAnimationFrame` for smooth 60 FPS visuals.
- **Complete Game Flow**: Includes a waiting screen, game over detection, and a restart handshake system.
- **Graceful Disconnect Handling**: If one player disconnects, the game ends immediately and the remaining player is notified.

## Gameplay Rules

- **Two players** are matched per game room.
- The first player to score **5 points** wins.
- When a player wins, a "Restart Game" button appears. The game only restarts if **both players** agree.
- **Player 1 Controls**: `W` (up) and `S` (down).
- **Player 2 Controls**: `ArrowUp` (up) and `ArrowDown` (down).

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, Socket.IO
- **Frontend**: React, TypeScript, Vite, Zustand, Socket.IO Client
- **Development**: `ts-node-dev` for backend hot-reloading.

## Folder Structure

The project is organized into a `server` and `client` monorepo structure.

``` bash
multiplayer-pong/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── store/
│       └── types/
└── server/
    └── src/
        ├── game/
        ├── rooms/
        └── server.ts
```

## Local Development Setup

Follow these steps to run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (or yarn/pnpm)

### Instructions

1. **Clone the repository:**

    ```sh
    git clone <your-repo-url>
    cd multiplayer-pong
    ```

2. **Install Backend Dependencies:**

    ```sh
    cd server
    npm install
    ```

3. **Install Frontend Dependencies:**

    ```sh
    cd ../client
    npm install
    ```

4. **Run the Backend Server:**
    Open a terminal, navigate to the `server` directory, and run:

    ```sh
    npm run dev
    ```

    The backend will be running on `http://localhost:3000`.

5. **Run the Frontend Application:**
    Open a **second terminal**, navigate to the `client` directory, and run:

    ```sh
    npm run dev
    ```

    The frontend will be running on `http://localhost:5173`.

6. **Play the Game:**
    - Open two browser tabs and navigate to `http://localhost:5173` in both.
    - Click "Join Game" in the first tab. You will be taken to the waiting screen.
    - Click "Join Game" in the second tab. Both tabs will be redirected to the game screen, and the match will begin.

## Available Scripts

### Server (`/server`)

| Script        | Description                                            |
| ------------- | ------------------------------------------------------ |
| `npm run dev` | Starts the development server with hot-reloading.      |
| `npm build`   | Compiles TypeScript to JavaScript in the `/dist` dir.  |
| `npm start`   | Runs the compiled production build from `/dist`.       |

### Client (`/client`)

| Script          | Description                                      |
| --------------- | ------------------------------------------------ |
| `npm run dev`   | Starts the Vite development server.              |
| `npm run build` | Builds the production-ready static assets.       |
| `npm run lint`  | Lints the project files using ESLint.            |
| `npm preview`   | Serves the production build locally for preview. |
