# 🚀 PokeDex-Legends: A Modern Pokémon App

Welcome to PokeDex-Legends! This is a comprehensive Pokémon application built with Next.js, featuring a full PokeDex, a Memory Game, and an epic Battle Game.

## ✨ Features

-   **Framework**: Built with [Next.js](https://nextjs.org/) for fast, server-rendered React applications.
-   **Language**: Fully written in [TypeScript](https://www.typescriptlang.org/).
-   **Styling**: Styled with [SCSS](https://sass-lang.com/) for powerful and organized CSS.
-   **PokeDex**: Browse all 151 original Pokémon with detailed information.
-   **Memory Game**: Test your memory with a fun, Pokémon-themed card game.
-   **Battle Game**: Assemble a team and fight in an endless battle mode!
-   **Mobile & Tablet Support** The web app is optimized for use on smartphones and tablets. The user interface automatically adapts to different screen sizes, ensuring a smooth experience on any device.
-   **Docker Support**: Ready for easy deployment in any containerized environment.

## 📦 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Thyrail/rock-paper-scissors-app.git

cd pokedex-legends
``` 
### 2️⃣ Install Dependencies

This project uses pnpm as the package manager.

```bash
pnpm install
```

### 3️⃣ Run the Development Server
```bash
pnpm dev
```

Open http://localhost:3000 with your browser to see the result.

## 🐳 Running with Docker

### 1️⃣ Build the Docker Image
Build the image and tag it for Docker Hub.

```bash
docker build -t thyrail/pokedex-legends .
```

### 2️⃣ Run the Container Locally
To test the container on your local machine:

```bash
docker run -d -p 3201:3201 --name pokedex-legends-container thyrail/pokedex-legends
```

The app will be accessible at http://localhost:3201.

### 3️⃣ Push to Docker Hub
After logging in to Docker Hub (docker login), you can push your image.

```bash
docker push thyrail/pokedex-legends:latest
```

### 4️⃣ Using Docker Compose
For easy management on your server, you can use the provided docker-compose.yml file.

Start the Container:

```bash
docker compose up -d
```

Stop the Container:

```bash
docker compose down
```

## Enjoy your PokeDex-Legends! 🚀