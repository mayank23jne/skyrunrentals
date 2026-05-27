# Skyrun Rentals

Short description about the project.

Example:

A full-stack web application built using React, NestJS, Prisma, and MySQL.

---

## Tech Stack

### Frontend
- React
- Vite (if used)
- TypeScript
- Tailwind CSS (if used)

### Backend
- NestJS
- Prisma ORM
- MySQL
- JWT Authentication (if used)

### Deployment
- AWS EC2
- CloudPanel
- PM2
- Nginx

---

## Features

- User authentication
- Dashboard
- CRUD operations
- API integration
- File upload (if available)
- Role-based access (if available)

---

## Project Structure

```txt
project/
├── frontend/
├── backend/
├── prisma/
└── README.md
```

---

## Installation

Clone repository:

```bash
git clone https://github.com/your-username/project-name.git
```

Move into project:

```bash
cd project-name
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```txt
http://localhost:5173
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create `.env`

Example:

```env
DATABASE_URL="mysql://username:password@localhost:3306/dbname"

JWT_SECRET=your_secret

PORT=3000
```

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate deploy
```

Start server:

```bash
npm run start:dev
```

Runs on:

```txt
http://localhost:3000
```

---

## Database

Using:

```txt
MySQL + Prisma ORM
```

Prisma commands:

Generate:

```bash
npx prisma generate
```

Migration:

```bash
npx prisma migrate dev
```

Push schema:

```bash
npx prisma db push
```

---

## Build

Frontend:

```bash
npm run build
```

Backend:

```bash
npm run build
```

---

## Deployment

Deployed using:

- AWS EC2
- CloudPanel
- PM2
- Nginx
- SSL

---

## Environment Variables

Frontend:

```env
VITE_API_URL=
```

Backend:

```env
DATABASE_URL=
JWT_SECRET=
PORT=
```

---

## API Documentation

Add API docs link if available.

Example:

```txt
http://localhost:3000/api
```

---

## Contributing

1. Fork repository
2. Create branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added feature"
```

4. Push

```bash
git push origin feature-name
```

5. Create Pull Request

---

## License

MIT License

---
