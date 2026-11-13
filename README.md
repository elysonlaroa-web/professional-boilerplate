Professional Boilerplate API
A reusable REST API starter built with Node.js, Express, TypeScript,
TypeORM, and MySQL. It provides a structured foundation for developing
backend applications, with user CRUD operations, request validation,
centralized error handling, database migrations, seed data, security
middleware, and structured logging.
Features
- TypeScript and Express for a typed, maintainable REST API.
- TypeORM and MySQL for database access and entity management.
- Database migrations to version and apply schema changes safely.
- Seeders to populate the database with initial sample users.
- Joi request validation for request bodies, route parameters, and
  query parameters.
- Centralized error handling for consistent API error responses.
- Winston logging with timestamps, log levels, and contextual
  metadata.
- Security middleware including Helmet, CORS, and rate limiting.
- Pagination for listing users.
- Reusable response utilities for consistent success and paginated
  responses.
- Health-check endpoint that checks application and database
  availability.
Tech Stack
- Node.js
- TypeScript
- Express
- TypeORM
- MySQL
- Joi
- Winston
- Helmet
- CORS
- tsx for development and TypeScript command execution
Prerequisites
Install the following before setting up the project:
- Node.js and npm
- MySQL Server
- Git (optional)
- Postman or another API client (recommended)
Getting Started
1. Clone or open the project
git clone <repository-url>
cd professional-boilerplate
If you already have the project locally, open its folder in your
terminal.
2. Install dependencies
npm install
Ensure the development runner is installed:
npm install --save-dev tsx
3. Create the MySQL database
Create the database in MySQL:
CREATE DATABASE boilerplate_db;
The database name must match DB_DATABASE in your .env file.
4. Configure environment variables
Create a .env file in the project root. Use the following as a
starting point:
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=boilerplate_db

FRONTEND_URL=http://localhost:4200
Use the actual host, port, username, and password configured for your
MySQL installation. Do not commit .env or production secrets to source
control.
5. Build the project
npm run build
6. Run database migrations
Generate a migration after making entity changes:
npx tsx ./node_modules/typeorm/cli.js migration:generate src/migrations/InitialSchema -d src/config/data-source.ts
Run pending migrations:
npx tsx ./node_modules/typeorm/cli.js migration:run -d src/config/data-source.ts
The initial migration creates the database tables defined by the
entities. The database itself must already exist.
7. Run seeders
npm run seed
The current seed script inserts sample users, including:
- admin@example.com
- test@example.com
Check src/seeds for the seed implementation and any configured sample
credentials. Do not assume or use a default password unless it is
explicitly defined in the seeder.
8. Start the development server
npm run dev
The API runs at:
http://localhost:3000
The development command uses tsx watch to restart the application when
source files change.
Environment Variables
  Variable          Description       Default / Example         Required
  NODE_ENV        Application       development             No
environment:
development,
production, or
test                                      

  PORT            Port used by the  3000                    No
Express server                              

  DB_HOST         MySQL server      localhost               Yes
hostname                                    

  DB_PORT         MySQL server port 3306                    No

  DB_USERNAME     MySQL username    root                    Yes

  DB_PASSWORD     MySQL password;   Empty                     No
an empty value is
allowed by the
current Joi
schema                                      

  DB_DATABASE     Name of the       boilerplate_db          Yes
application
database                                    
FRONTEND_URL    Allowed frontend  http://localhost:4200   No
origin for CORS
The values shown are examples. Configure them to match your local or
deployment environment.
API Endpoints
Base URL:
http://localhost:3000
Health Check
  Method                  Endpoint                Description
  GET                   /health               Returns application
uptime, status,
timestamp, and database
connectivity
Example successful response:
{
  "success": true,
  "data": {
    "uptime": 123.45,
    "status": "OK",
    "timestamp": 1790000000000,
    "database": "connected"
  }
}
Users
  Method     Endpoint           Description
  GET      /api/users       Get a paginated list of users
GET      /api/users/:id   Get a user by ID
POST     /api/users       Create a user
PUT      /api/users/:id   Update a user
DELETE   /api/users/:id   Delete a user
List users
GET /api/users?page=1&limit=10&sort=createdAt&order=DESC
Pagination query parameters:
- page: page number
- limit: number of records per page
- sort: permitted sort field defined by the application
- order: ASC or DESC
Get one user
GET /api/users/1
Create a user
POST /api/users
Content-Type: application/json
Example request body:
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Use-A-Strong-Password",
  "age": 22
}
Update a user
PUT /api/users/1
Content-Type: application/json
Example request body:
{
  "name": "Updated User",
  "age": 23
}
The exact accepted fields and validation rules are defined in
src/dto/user.dto.ts.
Delete a user
DELETE /api/users/1
A successful deletion returns HTTP 204 No Content.
Response Format
Successful responses generally use the following structure:
{
  "success": true,
  "data": {}
}
Paginated responses include a meta object with the total count,
current page, page size, total pages, and previous/next page indicators.

Error responses use a consistent structure:
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Description of the error"
  }
}
In development, the error handler may also include a stack trace.
Database Migrations and Seeders
Generate a migration
After changing an entity, generate a migration:
npx tsx ./node_modules/typeorm/cli.js migration:generate src/migrations/DescribeYourChange -d src/config/data-source.ts
Review the generated migration before applying it.
Apply pending migrations
npx tsx ./node_modules/typeorm/cli.js migration:run -d src/config/data-source.ts
Run seeders
npm run seed
The seeder currently creates sample users. Review the seeder code before
running it against a database containing important data.
Important database note
The TypeORM data source is configured with synchronize: false. Keep it
disabled in production and use reviewed migrations to make database
schema changes. Migrations are version-controlled and should be applied
in a controlled deployment process.
Project Structure
professional-boilerplate/
├── src/
│   ├── config/          # Environment and TypeORM configuration
│   ├── controllers/     # Request handlers
│   ├── decorator/       # Custom decorators, if used
│   ├── dto/             # Joi schemas and request DTOs
│   ├── entities/        # TypeORM entities
│   ├── middleware/      # Validation, security, logging, and errors
│   ├── migrations/      # Versioned database migrations
│   ├── routes/          # API route definitions
│   ├── seeds/           # Database seed scripts
│   ├── services/        # Business logic and database operations
│   ├── utils/           # Logging, errors, and response helpers
│   └── index.ts         # Application entry point
├── .env                 # Local environment variables (do not commit)
├── package.json
└── tsconfig.json
The exact folders may vary as the project evolves.
Development Notes
- Keep business logic in services rather than placing it directly in
  route definitions.
- Validate incoming request data before it reaches controllers.
- Use the centralized error handler for consistent error responses.
- Use Winston for application logs instead of relying only on
  console.log.
- Create and review migrations whenever entity definitions change.
- Never commit passwords, API keys, or other secrets.
- Confirm that seed data and credentials are appropriate before using
  them outside development.

Reflection
1. What was the most challenging part of building this boilerplate? How did you overcome it?
The most challenging part was configuring TypeORM, database migrations, and TypeScript compatibility. I overcame these issues by troubleshooting errors, updating dependencies, and testing each component step by step until the database connection and migrations worked.
2. How does this boilerplate differ from your Midterm project? What specific improvements did you make?
Unlike my Midterm project, which focused mainly on basic CRUD operations, this boilerplate has a more organized and reusable structure. I added centralized error handling, Joi validation, Winston logging, database migrations, security middleware, and reusable response utilities.
3. Why is centralized error handling better than try-catch in every controller?
Centralized error handling reduces repetitive code and makes error responses consistent. It also makes the application easier to maintain because errors can be managed in one place.
4. How does request validation with Joi improve security and code quality?
Joi validates incoming data before it reaches the business logic. It helps prevent invalid or unexpected inputs, reduces errors, and ensures that the application receives data in the expected format.
5. What's the difference between synchronize: true and migrations? Why are migrations essential for production?
synchronize: true automatically updates database tables based on entity changes, while migrations apply controlled and versioned database changes.

Migrations are essential in production because they provide a safer, predictable way to update database structures without relying on automatic synchronization.
6. How does structured logging (Winston) help in production debugging compared to console.log?
Winston provides organized logs with timestamps, severity levels, and contextual information. Unlike basic console.log, it supports different log files and log levels, making it easier to track and investigate production issues.
7. If you had to add a new feature (e.g., Product CRUD), how would you use this boilerplate? What would you need to add?
I would follow the existing User CRUD structure. I would add a Product entity, DTO validation schemas, service, controller, routes, and a database migration. This allows me to reuse the existing middleware, error handling, and response utilities.
8. What additional features would you add to make this boilerplate even more production-ready?
I would add automated unit and integration testing, API documentation using Swagger, authentication and role-based authorization, rate limiting improvements, automated backups, and CI/CD deployment workflows