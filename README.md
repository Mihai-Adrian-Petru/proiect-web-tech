# Breaking Bad Characters – Web Tech Project

Full-stack web app for browsing and administrating a Breaking Bad characters database.

- **Backend:** Spring Boot (Java 21), Spring Security (session auth), JPA/MySQL
- **Frontend:** React + TypeScript (Vite), Axios, React-Bootstrap
- **Dev runtime:** Docker Compose (backend + frontend + MySQL)

---

## Features

- Public character browsing
  - List all characters
  - View character details
- Admin actions (requires login)
  - Update character
  - Delete character
- Session-based authentication (cookie `JSESSIONID`) with CORS configured for the frontend origin

---

## Project Structure

- `backend/` – Spring Boot API
- `frontend/` – React UI
- `compose.yaml` – Dev Docker Compose (backend, frontend, MySQL)
- `breaking_bad.sql` – DB initialization script (loaded into MySQL container)

---

## Ports

Default ports when running via Docker Compose:

- Frontend (Vite): **5173**
- Backend (Spring Boot): **8080**
- Backend debug (JDWP): **5005**
- MySQL: **3306**

---

## Quickstart (Docker Compose)

### Prerequisites

- Docker Desktop (with Docker Compose)

### Run

From the repo root:

```bash
docker compose up
```

Then open:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

### Stop

```bash
docker compose down
```

> Note: Your last `docker compose up` exit code `130` typically means it was interrupted (Ctrl+C). That’s normal.

---

## Authentication

The backend uses a simple in-memory admin user (configured through environment variables in `compose.yaml`) and stores auth in the HTTP session.

### Default admin credentials (Docker Compose)

- Username: `admin`
- Password: `admin`

Frontend login calls:

- `POST /api/auth/login` (JSON body `{ "username": "...", "password": "..." }`)

After a successful login, the backend sets a session cookie (`JSESSIONID`). Axios is configured to send cookies (`withCredentials = true`).

---

## API Overview

Base URL (local): `http://localhost:8080`

### Auth

- `POST /api/auth/login` – create session
- `GET /api/auth/me` – returns current user (or `401`)
- `POST /api/auth/logout` – logout and invalidate session

### Characters

- `GET /api/characters` – public
- `GET /api/characters/{id}` – public
- `POST /api/characters` – **ADMIN only**
- `PUT /api/characters/{id}` – **ADMIN only**
- `DELETE /api/characters/{id}` – **ADMIN only**

---

## Local Development (without Docker)

You can run the frontend and backend locally, but you must provide a MySQL database (local MySQL or Docker just for DB).

### Backend

**Requirements**

- Java 21
- Maven
- MySQL 8.x

**Required environment variables** (the backend reads these via `application.properties`):

- `SPRING_DATASOURCE_URL` (example: `jdbc:mysql://localhost:3306/breaking_bad`)
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `FRONTEND_URL` (example: `http://localhost:5173`)
- `SECURITY_USER_NAME`
- `SECURITY_USER_PASSWORD`

Run from `backend/`:

```bash
mvn spring-boot:run
```

### Frontend

**Requirements**

- Node.js 22+ (or compatible)

Run from `frontend/`:

```bash
npm install
npm run dev
```

The frontend currently calls the backend at `http://localhost:8080`.

---

## Debugging (backend)

When using Docker Compose, the backend is started with JDWP enabled on port **5005**.

- Attach your IDE debugger to `localhost:5005`

---

## Troubleshooting

- **CORS / cookies not working**: Make sure the frontend origin matches `FRONTEND_URL` (Docker Compose sets it to `http://localhost:5173`). Also ensure requests use `withCredentials`.
- **MySQL not initialized**: The container runs `breaking_bad.sql` on first startup only. If you need to re-seed, remove the volume:
  - `docker compose down -v` (this wipes DB data)
- **Port already in use**: Stop other services using `8080`, `5173`, or `3306`, or change the port mappings in `compose.yaml`.

---

## License

See [LICENSE](LICENSE).
