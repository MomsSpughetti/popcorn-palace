
# Popcorn Palace Movie Ticket Booking System

This is a NestJS application that provides a backend API for a movie ticket booking system. It uses PostgreSQL as its database and Prisma for database management. Docker is used to simplify the PostgreSQL setup.

## Prerequisites

* Node.js and npm (or yarn) installed on your system.
* Docker and Docker Compose installed (only needed for PostgreSQL).

## Installation

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/MomsSpughetti/popcorn-palace.git
    cd popcorn-palace
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Start the PostgreSQL Database (Using Docker):**

   This application uses Docker Compose to manage the PostgreSQL database.
   * Use the following link to install Docker Compose: https://docs.docker.com/compose/install/
   * Then run:

   <br>
   
   ```bash
   docker compose up -d
   ```

   This command will start a PostgreSQL container.

   **Note:** If you have PostgreSQL installed locally, you can configure your application to use it directly, but this README focuses on Docker setup.


4.  **Apply Prisma Migrations:**

    **Crucially, this application uses Prisma to manage database migrations. You must run the following command to create the database schema:**

    ```bash
    npx prisma migrate dev --name init
    ```

    Replace `init` with the name of your initial migration, if different.

    **Note:** This command must be run *after* the PostgreSQL database is running.

## Running the Application

To start the NestJS application, run:

```bash
npm run start
```

## Accessing the Application

Once the application is running, it will be accessible at:

```
http://localhost:3000
```

You can use API testing tools like Postman or curl to interact with the API endpoints.

## API Endpoints

* **Movies:**
    * `POST /movies`: Create a new movie.
    * `GET /movies/all`: Get all movies.
    * `POST /movies/update/:title`: Update a movie by title.
    * `DELETE /movies/:title`: Delete a movie by title.
* **Showtimes:**
    * `POST /showtimes`: Create a new showtime.
    * `GET /showtimes/:id`: Get a showtime by ID.
    * `POST /showtimes/update/:id`: Update a showtime.
    * `DELETE /showtimes/:id`: Delete a showtime.
* **Bookings:**
    * `POST /bookings`: Create a new booking.
    * `GET /bookings/all`: Get all bookings.
    * `DELETE /bookings/:id`: Delete a booking.

## Testing

To run the application's tests, use:

* Unit/Integration Tests:

    ```bash
    npm run test
    ```

* End-to-End Tests:

    ```bash
    npm run test:e2e
    ```

## Troubleshooting

* **Database Connection Issues:** Ensure that the PostgreSQL database is running.
* **Prisma Errors:** Make sure that the database is running *before* running Prisma commands.
* **Port Conflicts:** If port 3000 is already in use, check your Docker configuration or other running applications.

