# Project Management App

A full-stack project management application built with Next.js 16 (App Router) and Express.js, featuring role-based access control, Kanban-style task management, and real-time analytics.

[![Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://ph-project-management-app.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Development](#development)
- [Demo Accounts](#demo-accounts)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Features

### Authentication & Authorization

- **Email & Password Authentication**: Secure login and registration system
- **Role-Based Access Control (RBAC)**: Three user roles with granular permissions
  - **Project Manager**: Full CRUD operations on projects and tasks
  - **Team Member**: Can only update assigned tasks
  - **Admin**: Full system access
- **Session Management**: JWT tokens stored in HTTP-only cookies

### Project Management

- Create, read, update, and delete projects
- Project tracking with completion percentage
- Status management: Active, Completed, On Hold
- Deadline tracking with overdue notifications
- Project members management

### Task Management

- Kanban-style drag-and-drop board using dnd-kit
- Task status tracking: Todo, In Progress, Completed
- Priority levels: Low, Medium, High
- Task assignment to team members
- Due date tracking with overdue detection
- Search and filter capabilities

### Analytics & Dashboard

- Real-time statistics dashboard
- Task progress charts
- Project completion percentage visualization
- Team productivity overview
- Recent activity log

### Team Collaboration

- Add team members to projects
- Assign tasks to specific team members
- Workload summary per team member
- Member-wise task lists

## Tech Stack

### Frontend (Client)

| Technology      | Version             |
| --------------- | ------------------- |
| Next.js         | 16.2.7 (App Router) |
| React           | 19.2.4              |
| TypeScript      | 5.x                 |
| Tailwind CSS    | 4.x                 |
| HeroUI          | 3.2.2               |
| TanStack Query  | 5.101.0             |
| React Hook Form | 7.77.0              |
| Zod             | 4.4.3               |
| dnd-kit         | 6.3.1               |
| Lucide Icons    | 1.17.0              |
| Phosphor Icons  | 2.1.10              |

### Backend (Server)

| Technology      | Version |
| --------------- | ------- |
| Node.js         | -       |
| Express.js      | 5.2.1   |
| TypeScript      | 6.0.3   |
| Prisma ORM      | 7.8.0   |
| PostgreSQL      | -       |
| bcrypt          | 5.1.1   |
| JSON Web Tokens | 9.0.3   |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT (Next.js App Router)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  src/app/                    src/modules/         src/actions/   │
│  ├─ layout.tsx              ├─ Dashboard/       ├─ auth/        │
│  ├─ (auth)/                 │  ├─ Analytics/     │  ├─ login.ts  │
│  │  ├─ login/page.tsx       │  ├─ Task/         │  ├─ register.ts│
│  │  └─ signup/page.tsx      │  ├─ Project/      │  └─ logout.ts │
│  ├─ (dashboard)/            │  └─ Theme/        ├─ Project/     │
│  │  ├─ layout.tsx          ├─ components/     │  ├─ create.ts │
│  │  └─ dashboard/          │  └─ ui/           │  ├─ update.ts │
│  │     └─ page.tsx         │                  │  └─ delete.ts │
│  └─ globals.css                              ├─ Tasks/         │
│                                              │  ├─ create.ts   │
│                                              │  ├─ get.ts      │
│                                              │  ├─ update.ts   │
│                                              │  └─ delete.ts   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVER (Express.js)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  src/                                                           │
│  ├─ app.ts              ├─ modules/                             │
│  ├─ server.ts           │  ├─ auth/                             │
│  ├─ app/lib/            │  │  ├─ auth.service.ts                │
│  │  └─ prisma.ts       │  ├─ projects/                          │
│  ├─ app/utils/          │  │  ├─ projects.service.ts            │
│  │  └─ catch-async.ts  │  ├─ Tasks/                           │
│  └─ middleware/         │  │  └─ tasks.service.ts               │
│                                              └─ Team-member/     │
│                                                └─ team-member.* │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Prisma Client
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                         │
└─────────────────────────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites

- **Node.js**: Version 18.x or higher
- **npm** or **yarn** or **pnpm**
- **PostgreSQL**: Version 14.x or higher
- **Prisma CLI**: (installed via npm)

### Installation

#### Clone the repository

```bash
git clone https://github.com/shaonexplorer/PH-Project-Management-App.git
cd PH-Project-Management-App
```

#### Install client dependencies

```bash
cd client/ph_project_management_app_client
npm install
# or
yarn install
# or
pnpm install
```

#### Install server dependencies

```bash
cd ../../server/server-Project-management-app
npm install
# or
yarn install
# or
pnpm install
```

### Environment Variables

#### Client (.env.local)

```bash
# API URL - Use local server during development, production URL in production
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Production URLs (uncomment and use as needed)
# NEXT_PUBLIC_API_URL=https://ph-project-management-app.vercel.app/api/v1
# NEXT_PUBLIC_API_URL=https://ph-project-management-app-server.onrender.com/api/v1
```

#### Server (.env)

```bash
# Server Port
PORT=5000

# PostgreSQL Database Connection
DATABASE_URL="postgresql://postgres:password@host:port/database?schema=public"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=24h
```

### Database Setup

1. **Create a PostgreSQL database**

2. **Run Prisma migrations** (on server directory)

```bash
npx prisma migrate dev --name init
npx prisma generate
```

3. **Seed the database** (optional - creates demo users)

```bash
npx prisma db seed
```

### Development

#### Start the Server

```bash
# In server directory
npm run dev
# Runs at http://localhost:5000
```

#### Start the Client

```bash
# In client directory
npm run dev
# Runs at http://localhost:3000
```

#### Run Linting

```bash
# Client
npm run lint

# Server
npm run lint  # if configured
```

## Demo Accounts

The application includes pre-configured demo accounts for testing:

### Project Manager Account

| Field    | Value            |
| -------- | ---------------- |
| Email    | `abir@gmail.com` |
| Password | `123456789`      |
| Role     | Project Manager  |

### Team Member Account

| Field    | Value             |
| -------- | ----------------- |
| Email    | `zabir@gmail.com` |
| Password | `123456`          |
| Role     | Team Member       |

> **Note**: These demo accounts are for evaluation purposes. In production, users must register through the signup form.

## API Documentation

### Authentication Endpoints

| Method | Endpoint              | Description           | Auth Required |
| ------ | --------------------- | --------------------- | ------------- |
| POST   | `/api/v1/auth/signup` | Register new user     | No            |
| POST   | `/api/v1/auth/login`  | Login and receive JWT | No            |
| POST   | `/api/v1/auth/logout` | Clear auth cookies    | No            |

### Projects Endpoints

| Method | Endpoint                                   | Description         | Auth Required |
| ------ | ------------------------------------------ | ------------------- | ------------- |
| GET    | `/api/v1/projects`                         | Get all projects    | No            |
| GET    | `/api/v1/projects/my`                      | Get user's projects | Yes           |
| GET    | `/api/v1/projects/:id`                     | Get single project  | Yes           |
| GET    | `/api/v1/projects/:id/completion`          | Get completion %    | Yes           |
| POST   | `/api/v1/projects/create`                  | Create new project  | Yes           |
| PUT    | `/api/v1/projects/:id`                     | Update project      | Yes           |
| DELETE | `/api/v1/projects/:id`                     | Delete project      | Yes           |
| POST   | `/api/v1/projects/:projectId/members`      | Invite new member   | Yes           |
| POST   | `/api/v1/projects/:projectId/members/user` | Add existing user   | Yes           |

### Tasks Endpoints

| Method | Endpoint                           | Description        | Auth Required |
| ------ | ---------------------------------- | ------------------ | ------------- |
| GET    | `/api/v1/tasks`                    | Get all tasks      | Yes           |
| GET    | `/api/v1/tasks/user/:userId`       | Get user's tasks   | Yes           |
| GET    | `/api/v1/tasks/project/:projectId` | Get project tasks  | Yes           |
| GET    | `/api/v1/tasks/team/:userId`       | Get assigned tasks | Yes           |
| POST   | `/api/v1/tasks/create`             | Create new task    | Yes           |
| PUT    | `/api/v1/tasks/:id`                | Update task        | Yes           |
| DELETE | `/api/v1/tasks/:id`                | Delete task        | Yes           |

### Response Format

All responses follow a consistent format:

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "message": "Operation successful"
}
```

## Deployment

### Frontend (Vercel - Recommended)

1. **Connect your GitHub repository to Vercel**
2. **Configure environment variables**:
   - `NEXT_PUBLIC_API_URL`: Your deployed server URL

3. **Deploy settings**:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Backend (Render - Recommended)

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure environment variables**:
   - `PORT`: 5000 (or auto-detect)
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Secure random string
   - `JWT_EXPIRATION`: 24h

4. **Build settings**:
   - Build Command: `npm run build`
   - Start Command: `npm start`

### Environment Variables for Production

#### Client

```bash
NEXT_PUBLIC_API_URL=https://your-deployed-server.onrender.com/api/v1
```

#### Server

```bash
PORT=5000
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=<secure-random-string>
JWT_EXPIRATION=24h
```

## Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/              # Authentication routes
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── globals.css         # Global styles
│   │   └── layout.tsx          # Root layout
│   ├── components/             # Reusable UI components
│   ├── modules/                # Feature modules (Dashboard, Analytics, etc.)
│   ├── actions/                # Server actions
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   └── styles/                 # Additional styles
├── public/                     # Static assets
├── package.json
└── README.md

server/
├── src/
│   ├── app.ts                  # Express app configuration
│   ├── server.ts               # Server entry point
│   ├── app/
│   │   ├── lib/prisma.ts       # Prisma client
│   │   └── utils/              # Utility functions
│   └── modules/                # Feature modules (Auth, Projects, Tasks)
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [HeroUI](https://heroui.com/) - React UI components
- [Prisma](https://prisma.io/) - Database toolkit
- [dnd-kit](https://dndkit.com/) - Drag and drop toolkit
- [shadcn/ui](https://ui.shadcn.com/) - Component library inspiration

---

<p align="center">
  <em>Built with ❤️ using Next.js 16 and Express.js</em>
</p>
