# Canvas - Whiteboard Collaboration App

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Introduction
Canvas is a collaborative whiteboard application built with Next.js that allows multiple users to interact on a shared whiteboard in real-time. The application leverages WebSocket for simultaneous user collaboration and includes user authentication to ensure secure access. The application is hosted live at [canvas-beryl.vercel.app](https://canvas-beryl.vercel.app).

## Features
- Real-time whiteboard collaboration
- User authentication
- Secure access to whiteboard sessions
- Responsive design for various device sizes

## Technologies
- Next.js
- Prisma
- PostgreSQL
- WebSocket (Server repository: [canvas-socket](https://github.com/harshbansal8705/canvas-socket))
- Vercel (for hosting)

## Installation
To set up this project locally, follow these steps:

### Next.js Application
1. Clone the repository:
    ```bash
    git clone https://github.com/harshbansal8705/canvas.git
    cd canvas
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file and add the following environment variables:
    ```plaintext
    DATABASE_URL = <your-database-url>
    JWT_SECRET = <your-jwt-secret>
    NEXT_PUBLIC_SOCKET_URL = <your-websocket-server-url>
    NEXT_PUBLIC_FRONTEND_URL = <your-frontend-url>
    NODEMAILER_USERNAME = <your-nodemailer-username>
    NODEMAILER_PASSWORD = <your-nodemailer-password>
    ```

4. Run Prisma migrations to set up your database:
    ```bash
    npx prisma migrate dev
    ```

5. Start the development server:
    ```bash
    npm run dev
    ```

### WebSocket Server
For setting up the WebSocket server, head over to the [canvas-socket repository](https://github.com/harshbansal8705/canvas-socket) and follow the instructions provided there.

## Usage
1. Ensure the WebSocket server is running by following the instructions in the [canvas-socket repository](https://github.com/harshbansal8705/canvas-socket).

2. Start the frontend development server:
    ```bash
    npm run dev
    ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to use the application locally.

## Project Structure
```plaintext
canvas/
├── public/
├── src/
│   ├── app/
│   ├── assets/
│   └── components/
├── .env
├── .gitignore
├── package.json
├── README.md
├── next.config.mjs
├── tsconfig.json
└── tailwind.config.js
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License.
