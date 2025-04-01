# ERP Project

## Overview

This project is a Node.js-based ERP (Enterprise Resource Planning) system designed to manage and streamline business operations. It includes features such as user authentication, booking management, delivery tracking, resource allocation, and customer communication. The system is built with scalability and maintainability in mind, using a modular architecture.

---

## Features

- **Authentication**: Secure user login and session management.
- **Booking Management**: Create, review, and confirm bookings.
- **Delivery Tracking**: Manage inbound and outbound deliveries.
- **Resource Allocation**: Assign resources to tasks efficiently.
- **Customer Communication**: Notify customers at various stages of the process.
- **Status Tracking**: Track the progress of tasks through predefined statuses.

---

## Customer Journey Steps Mapped to Statuses

| **Status**            | **Steps**                                                              |
| --------------------- | ---------------------------------------------------------------------- |
| **DRAFT**             | Enter form, review form.                                               |
| **IN REVIEW**         | Confirm by system.                                                     |
| **CONFIRMED**         | Customer confirmation, appointment date, enter queue, assign resource. |
| **PENDING DELIVERY**  | Contact for delivery, enter delivery, confirm delivery.                |
| **IN QUEUE**          | Await turn in the queue.                                               |
| **IN PROGRESS**       | Technician resolves the issue.                                         |
| **RESOLVED/REJECTED** | Add remarks (resolved or rejected).                                    |
| **OUTBOUND DELIVERY** | Arrange outbound delivery, payment, confirm outbound delivery.         |
| **COMPLETED**         | Confirm receipt by customer.                                           |

---

## Project Structure

```
src/
├── controllers/       # Handles incoming requests
├── services/          # Business logic and service layer
├── dao/               # Data Access Objects for database interactions
├── middleware/        # Middleware for request processing
├── types/             # TypeScript type definitions
├── app.ts             # Main application setup
├── routes.ts          # API route definitions
├── prisma.ts          # Prisma ORM setup
├── swagger.ts         # Swagger API documentation setup
prisma/
├── schema.prisma      # Database schema
├── migrations/        # Database migrations
tests/
├── __tests__/         # Unit and integration tests
```

---

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (or the database configured in `prisma/schema.prisma`)

---

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   - Update the database connection string in the `.env` file.
   - Run migrations:
     ```bash
     npx prisma migrate dev
     ```
   - Push the Prisma schema to the database:
     ```bash
     npx prisma db push
     ```

4. Start the development server:

   ```bash
   npm run dev
   ```

---

## Running Tests

Run unit and integration tests using Jest:

```bash
npm test
```

---

## API Documentation

API documentation is generated using Swagger. Once the application is running, you can access the documentation at:

```
http://localhost:<port>/api-docs
```

---

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

---

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Open a pull request.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

