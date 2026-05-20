# ShopEase

ShopEase is a full-stack e-commerce project with a Spring Boot backend, React frontend, PostgreSQL database, Docker setup, Kubernetes manifests, and AWS deployment helpers.

## Features

- User registration and login with JWT authentication
- Product browsing, details, and category support
- Shopping cart management
- Checkout and order history flows
- Product image upload support through AWS S3
- PostgreSQL persistence with Spring Data JPA
- Containerized local setup with Docker Compose
- Kubernetes manifests for production-style deployment
- GitHub Actions workflow for deployment automation

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, Redux Toolkit, React Router, Axios |
| Backend | Java 17, Spring Boot 3, Jersey JAX-RS, Spring Security, Spring Data JPA |
| Database | PostgreSQL |
| Storage | AWS S3 |
| DevOps | Docker, Docker Compose, Kubernetes, AWS ECR/EC2, GitHub Actions |

## Project Structure

```text
shopease/
├── aws/                    # AWS setup and deployment helper scripts
├── backend/                # Spring Boot API service
├── docker/                 # Dockerfiles and nginx config
├── frontend/               # React Vite application
├── k8s/                    # Kubernetes manifests
├── docker-compose.yml      # Local full-stack Docker environment
└── docker-compose.prod.yml # Production Docker Compose setup
```

## Prerequisites

- Java 17
- Maven
- Node.js 18 or newer
- Docker and Docker Compose
- PostgreSQL, if running the backend outside Docker

## Local Development

### Run With Docker Compose

```bash
docker compose up --build
```

The application will run at:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- PostgreSQL: `localhost:5432`

### Run Backend Manually

```bash
cd backend
mvn spring-boot:run
```

Default backend configuration uses:

- Database: `shopease`
- Username: `shopuser`
- Password: `shoppass`
- Port: `8080`

### Run Frontend Manually

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:3000` by default.

## Environment Variables

When using Docker Compose, these values can be provided through the shell or an `.env` file:

```env
JWT_SECRET=replace-with-a-secure-secret
JWT_EXPIRATION=86400000
AWS_REGION=us-east-1
AWS_ACCESS_KEY=replace-with-access-key
AWS_SECRET_KEY=replace-with-secret-key
AWS_S3_BUCKET=shopease-images
```

Do not commit real secrets to version control.

## API Areas

The backend is organized around these resource groups:

- `AuthResource` for authentication
- `ProductResource` for products
- `CategoryResource` for categories
- `CartResource` for cart operations
- `OrderResource` for orders

## Deployment

This project includes multiple deployment options:

- `docker-compose.prod.yml` for production-style Docker Compose deployment
- `k8s/` manifests for Kubernetes deployments, services, ingress, secrets, config maps, and autoscaling
- `aws/` helper scripts for ECR and EC2 deployment setup
- `.github/workflows/deploy.yml` for CI/CD automation

Before deploying, update secrets, AWS credentials, image names, domains, and environment-specific configuration.

## Useful Commands

```bash
# Build backend
cd backend && mvn clean package

# Build frontend
cd frontend && npm run build

# Start the complete stack
docker compose up --build

# Stop the stack
docker compose down
```

## License

This project is currently unlicensed. Add a license before publishing it for public reuse.
