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

Activity 9: Implement JWT Authentication
Professional Boilerplate API
A RESTful API built with Node.js, Express, TypeScript, TypeORM, and
MySQL. This project provides user management, input validation,
centralized error handling, database migrations, seeding, logging, and
JWT-based authentication for protected endpoints.
Features
- JWT authentication (login and token verification)
- Protected user CRUD endpoints
- Password hashing with bcrypt
- Input validation using Joi
- Centralized error handling
- MySQL database with TypeORM migrations
- Seeded sample accounts
- Logging and health check
Technology Stack
- Node.js
- Express
- TypeScript
- MySQL
- TypeORM
- JWT (jsonwebtoken)
- bcrypt
- Joi
- Winston
- tsx
Setup
Prerequisites
Install Node.js, MySQL, and Git.
Installation
1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies:
   npm install
4. Create a MySQL database named boilerplate_db:
   CREATE DATABASE boilerplate_db;
5. Create a .env file in the project root and configure it:
   NODE_ENV=development
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=
   DB_DATABASE=boilerplate_db
   FRONTEND_URL=http://localhost:4200
   JWT_SECRET=replace_with_a_secure_random_secret
   JWT_EXPIRES_IN=86400
   Generate a secure JWT secret with:
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   Keep .env private and do not commit it.
6. Run migrations:
   npx tsx ./node_modules/typeorm/cli.js migration:run -d src/config/data-source.ts
7. Seed sample users:
   npm run seed
8. Start the development server:
   npm run dev
9. Build the project:
   npm run build
Authentication Flow
1. The client submits email and password to the login endpoint.
2. The API finds the user and checks whether the account is active.
3. bcrypt compares the submitted password with the stored password
   hash.
4. If valid, the API signs a JWT containing the user's ID and email.
5. The client stores the token securely and sends it with requests to
   protected routes.
6. Authentication middleware extracts and verifies the token and
   attaches the decoded user information to the request.
7. Requests with missing or invalid tokens are rejected with
   401 Unauthorized.
Getting a Token (Login)
Endpoint: POST /api/auth/login

Request body:
{
  "email": "test@example.com",
  "password": "Test123!"
}
Example response:
{
  "success": true,
  "data": {
    "token": "<JWT_TOKEN>",
    "user": {
      "id": 2,
      "email": "test@example.com",
      "name": "Test User"
    }
  }
}
The response token is illustrative. The API's actual response format may
depend on the controller and response utility implementation.
Using the Token
Include the token in the HTTP Authorization header for protected routes:
Authorization: Bearer <JWT_TOKEN>
In Postman: 1. Open the request's Authorization tab. 2. Select Bearer
Token. 3. Paste the token into the Token field (without quotation marks
or manually adding Bearer). 4. Send the request.
Endpoint Reference
Public endpoints
  Method   Endpoint            Description
  GET      /health           Health check (including database status)
POST     /api/auth/login   Authenticate and obtain a JWT
Protected endpoints
All /api/users routes require a valid JWT, as authMiddleware is
applied to the user router.

  Method   Endpoint           Description
  GET      /api/users       List users (pagination may be supported)
GET      /api/users/:id   Retrieve a user
POST     /api/users       Create a user
PUT      /api/users/:id   Update a user
DELETE   /api/users/:id   Delete a user
Verify the endpoint list against the routes currently mounted in the
application. This README assumes the authentication router is mounted
at /api/auth and provides POST /login.

Testing Authentication in Postman
Login
1. Send POST http://localhost:3000/api/auth/login.
2. Select Body → raw → JSON.
3. Submit the sample credentials.
4. Copy the returned token.
Valid token
1. Send GET http://localhost:3000/api/users.
2. Select Authorization → Bearer Token.
3. Paste the token.
4. Send the request. A successful request should return an appropriate
   success status.
No token
1. Send GET http://localhost:3000/api/users.
2. Select Authorization → No Auth.
3. Send the request. The protected endpoint should reject it with
   401 Unauthorized.
Invalid token
Send a protected request using a random or malformed token. The API
should reject it with 401 Unauthorized.
Seeded Sample Accounts
The seeder previously reported these email addresses:

  Role/Account   Email
  Admin          admin@example.com
Test User      test@example.com

Sample passwords identified from the seeder:

  Email                 Password
  admin@example.com   Admin123!
test@example.com    Test123!

These are development-only credentials. Change or remove them before
deployment.
Reflection
1. Authentication vs. authorization: Authentication verifies who
   you are, while authorization determines what you're allowed to do.
   For example, logging in verifies your identity (authentication),
   while accessing an admin dashboard checks your permissions
   (authorization).
2. Why JWT is stateless: JWT is stateless because the server
   doesn't need to store session data for each user. This helps
   scalability because multiple servers can verify tokens
   independently.
3. Three parts of JWT: Header (token type and algorithm), Payload
   (claims or user information), and Signature (verifies the token's
   integrity and authenticity).
4. Sensitive data in JWT: JWT payloads are encoded, not encrypted
   by default. Anyone holding the token can decode its payload, so
   sensitive information like passwords should never be included.
5. How bcrypt works: Bcrypt hashes passwords using a salt and
   configurable rounds. The salt makes hashes unique, while rounds
   increase the computational cost to make brute-force attacks harder.
6. Stolen JWT: Anyone possessing a valid stolen token may
   impersonate its owner. Mitigate this using HTTPS, short token
   expiration, secure storage, and token revocation strategies.
7. Importance of HTTPS: HTTPS encrypts data transmitted between the
   client and server, helping prevent attackers from intercepting JWT
   tokens.
8. Access vs. refresh token: Access tokens are short-lived and used
   to access protected resources. Refresh tokens last longer and are
   used to obtain new access tokens without logging in again.
9. How middleware identifies the user: The middleware extracts the
   JWT from the Authorization header, verifies it, and reads the user
   information (such as userId) from its payload.
10. Role-based authorization: I would add a role field to the User
    entity, include the user's role in the token or retrieve it from the
    database, and create middleware that checks whether the user has the
    required role before allowing access.
Security Notes
- Use HTTPS in production.
- Never commit .env or disclose the JWT signing secret.
- Never include passwords or other sensitive information in JWT
  payloads.
- Use short-lived tokens and consider refresh-token rotation and
  revocation.
- Keep seeded credentials for development only.
- JWT payloads are signed, not inherently encrypted.
Project Structure
src/
├── config/
├── controllers/
├── dto/
├── entities/
├── middleware/
├── migrations/
├── routes/
├── seeds/
├── services/
└── utils/

Activity 10: Email Verification & Password Reset
Professional Boilerplate API
A backend API built with Node.js, TypeScript, Express, TypeORM, and MySQL, featuring authentication, email verification, and password reset functionality.
Features
- User registration
- Email verification with expiring verification tokens
- Login for verified accounts
- JWT-based authentication
- Authenticated user profile endpoint
- Resend email verification
- Forgot-password flow with expiring reset tokens
- Reset password
- Input validation using Joi
- Structured error handling and logging
- MySQL database with TypeORM migrations
Tech Stack
- Node.js
- TypeScript
- Express
- TypeORM
- MySQL
- Joi
- bcrypt
- JSON Web Tokens (JWT)
- Nodemailer
- Ethereal Email (development email testing)
- tsx (development runner)
Requirements
Install the following before running the project:
- Node.js and npm
- MySQL server
- Postman (for API testing)
Installation
1. Clone or download this repository.
2. Open the project folder in a terminal.
3. Install dependencies:
   npm install
4. Configure environment variables in .env (see below).
5. Run the database migrations using the project's migration scripts.
6. Start the development server:
   npm run dev
The API runs at http://localhost:3000 (unless configured otherwise).
Environment Configuration
Create or update .env in the project root. Use the project's existing variable names and values as your template; do not commit real credentials.

Typical settings include:
DB_HOST=localhost
DB_PORT=3308
DB_DATABASE=boilerplate_db
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password

JWT_SECRET=replace_with_a_secure_secret
JWT_EXPIRES_IN=your_existing_jwt_expiration

FRONTEND_URL=http://localhost:4200

SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your_ethereal_username
SMTP_PASS=your_ethereal_password
EMAIL_FROM=your_sender_address
Preserve the actual variable names, port, and other settings used in your project's .env and src/config/env.ts. Never publish your .env file or secrets.

Running the API
Start the development server:
npm run dev
Expected startup messages indicate that the database connection and API server are running. The API is configured to use port 3000 in the current development setup.

Health check:
GET http://localhost:3000/health
Authentication Flow
1. Register
Create an account. The API creates an unverified account and sends a verification email.
POST /api/auth/register
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "Password123",
  "age": 30
}
2. Verify email
Open the verification email and use the token included in the verification link.
GET /api/auth/verify-email?token=YOUR_VERIFICATION_TOKEN
A successful verification activates email verification status for the account. Verification tokens expire (configured for 24 hours) and cannot be reused after successful consumption.
3. Login
Only verified accounts can log in.
POST /api/auth/login
Content-Type: application/json
{
  "email": "john.doe@example.com",
  "password": "Password123"
}
On success, the API returns an authentication token and user information. Use the returned token when accessing protected endpoints.
4. Access your profile
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
Replace YOUR_JWT_TOKEN with the token returned after login.
5. Resend verification email
Request another verification email for an account that needs verification.
POST /api/auth/resend-verification
Content-Type: application/json
{
  "email": "john.doe@example.com"
}
6. Forgot password
Request a password reset link.
POST /api/auth/forgot-password
Content-Type: application/json
{
  "email": "john.doe@example.com"
}
The API returns a generic response to avoid revealing whether an email address is registered.
7. Reset password
Use the reset token from the password-reset email to set a new password.
POST /api/auth/reset-password
Content-Type: application/json
{
  "token": "YOUR_RESET_TOKEN",
  "newPassword": "NewPassword456"
}
Reset tokens expire (configured for 1 hour) and are invalidated after successful use.
8. Log in with the new password
Log in using your new password through POST /api/auth/login.
API Endpoints
All authentication endpoints are prefixed with /api/auth.
Method	Endpoint	Access	Purpose
POST	/api/auth/register	Public	Register and send verification email
GET	/api/auth/verify-email?token=...	Public	Verify an email address
POST	/api/auth/resend-verification	Public	Request another verification email
POST	/api/auth/login	Public	Log in to a verified account
GET	/api/auth/me	Authenticated	Get the current user's profile
POST	/api/auth/forgot-password	Public	Request a password-reset email
POST	/api/auth/reset-password	Public	Set a new password using a reset token


Example endpoint URLs
- Register: http://localhost:3000/api/auth/register
- Verify email: http://localhost:3000/api/auth/verify-email?token=YOUR_VERIFICATION_TOKEN
- Resend verification: http://localhost:3000/api/auth/resend-verification
- Login: http://localhost:3000/api/auth/login
- Current user: http://localhost:3000/api/auth/me
- Forgot password: http://localhost:3000/api/auth/forgot-password
- Reset password: http://localhost:3000/api/auth/reset-password
Testing Emails with Ethereal
Ethereal Email provides test inboxes for development. Messages are captured for preview and are not delivered to real recipients.
1. Register a user or request a password reset in Postman.
2. Keep the API terminal open.
3. Look for the logged Ethereal preview URL after the email is sent.
4. Open the preview URL in your browser to inspect the message.
5. Use the verification or reset link/token in your API testing.
Notes
- The email service logs preview URLs in development.
- Ethereal is for testing, not production email delivery.
- Keep SMTP credentials private.
Security Features
- Email verification: accounts must verify their email before login.
- Expiring verification tokens: verification tokens have a limited lifetime.
- Single-use verification tokens: tokens are invalidated after successful verification.
- Password reset tokens: reset tokens have a limited lifetime.
- Single-use reset tokens: reset tokens are invalidated after successful password reset.
- Password hashing: passwords are hashed with bcrypt before storage.
- JWT authentication: protected endpoints require a valid bearer token.
- Input validation: request data is validated using Joi schemas.
- Email enumeration protection: forgot-password responses are generic for known and unknown email addresses.
- Duplicate registration protection: registering an already-used email is rejected.
- Token fields protected from default entity selection: sensitive token fields are configured not to be selected by default.
Testing with Postman
For requests with JSON bodies:
1. Select the request method and endpoint.
2. Open Body.
3. Select raw.
4. Select JSON.
5. Paste the example JSON.
6. Click Send.
For authenticated requests, use the Authorization tab, select Bearer Token, and paste the JWT.
Development Scripts
Use the scripts available in your package.json. In the current setup:
npm run dev
Migration commands depend on the scripts configured in package.json; use those project scripts to generate, run, or revert migrations.
Suggested Security Practices
- Do not commit .env files or credentials.
- Use a strong, unique JWT secret.
- Use HTTPS in production.
- Configure production email delivery before deployment.
- Review environment settings and error logging before deploying.
- Keep dependencies updated.

Reflection
1. Why is email verification important for security? What problems does it prevent?
It confirms that the user owns the email address. It helps prevent fake accounts, mistyped emails, and unauthorized use of someone else's email.

2. Explain the "always return success" pattern in forgot password. Why is it a security best practice?
It returns the same response whether the email exists or not. This prevents attackers from discovering registered email addresses.

3. What's the difference between a verification token and a reset token? Why do they have different expiration times?
A verification token confirms email ownership, while a reset token allows changing a password. Verification tokens last 24 hours, while reset tokens last 1 hour because password-reset tokens grant more sensitive access.

4. Why do we use crypto.randomBytes(32) instead of Math.random() or Date.now() for token generation?
crypto.randomBytes(32) generates cryptographically secure random values that are difficult to predict, making tokens safer against guessing attacks.

5. What happens if a user never verifies their email? How does your system handle this?
The user cannot log in until their email is verified. They can request another verification email to complete the process.

6. Explain why tokens are cleared after use. What security risk does this prevent?
Tokens are cleared after use to prevent them from being reused. This protects against replay attacks and unauthorized repeated actions.

7. What is email enumeration and how does your implementation prevent it?
Email enumeration is discovering whether an email address is registered. Our forgot-password endpoint returns the same generic message regardless of whether the email exists.

8. If you had to implement two-factor authentication (2FA) on top of this system, how would you approach it?
I would add a second verification step after login, such as a time-based OTP from an authenticator app. The user would need both their password and the OTP to access the account.

9. What are the trade-offs between using Ethereal (test service) vs. SendGrid (production service)?
Ethereal is free and useful for testing because it lets us preview emails without delivering them to real users. SendGrid is designed for real email delivery, scalability, and production use, but may require payment and configuration.

10. How would you handle a situation where a user's email provider marks your emails as spam?
I would configure SPF, DKIM, and DMARC, use a trusted email service, avoid spam-like content, and ask users to check their spam folder.