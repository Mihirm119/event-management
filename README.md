# Event Management API

This is a Node.js-based Event Management API that allows users to manage events, including creating, updating, and deleting events.

## Features
- User authentication and authorization.
- Event management with categories and venues.
- Ticket purchasing and registration system.
- Email notifications using NodeMailer.
- Database integration with MongoDB.
- RESTful API endpoints.

- ### users
- `GET /api/users/read` - Get all events
- `POST /api/users/create` - Create a new event
- `POST /api/users/login` - login a user :- for Authentication
- `GET /api/users/:id` - Get a single event
- `PUT /api/users/update/id` - Update an user
- `DELETE /api/users/delete/:id` - Delete an event

### Events
- `GET /api/events/create` - only admin can create event
- `POST /api/events/read` - read event
- `PUT /api/events/udpate/:id` - only admin can create event
- `DELETE /api/events/delete/:id` - only admin can create event

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Venues
- `GET /api/venues` - Get all venues
- `POST /api/venues` - Create a new venue
- `PUT /api/venues/:id` - Update a venue
- `DELETE /api/venues/:id` - Delete a venue

### Tickets
- `GET /api/tickets` - Get all tickets
- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets/:id` - Get ticket by ID
- `PUT /api/tickets/:id` - Update a ticket
- `DELETE /api/tickets/:id` - Delete a ticket

### Registrations
- `GET /api/registrations` - Get all registrations
- `POST /api/registrations` - Register for an event (Sends confirmation email via NodeMailer)
- `GET /api/registrations/:id` - Get registration by ID

### Ticket Purchases
- `POST /api/purchases` - Purchase tickets
- `GET /api/purchases/:id` - Get purchase details

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- NodeMailer for email notifications

