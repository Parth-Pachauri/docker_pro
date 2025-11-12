# Bakery Management System

This is a Bakery Management System that allows customers to place orders and check the status of their orders. The system also provides an admin panel to manage the orders and update their statuses.

## System Architecture Overview

The system is built using the following technologies:

- **Frontend**: React.js
- **Backend**: Flask
- **Database**: PostgreSQL
- **Messaging**: RabbitMQ (for message queueing)
- **Containerization**: Docker

### Architecture Components

1. **Frontend**:
   - The React-based frontend provides an interface where customers can view products, place orders, and check the status of their orders.
   - The admin panel allows administrators to view and update the status of orders.

2. **Backend**:
   - The Flask backend handles API requests from the frontend, processes the order information, and interacts with the database to store and retrieve order details.
   - It communicates with RabbitMQ for any event-driven updates or processes that require message queuing.

3. **Database**:
   - PostgreSQL is used for data storage, including products, orders, and their statuses.
   - Docker volumes are used to persist the database data between container restarts.

4. **RabbitMQ**:
   - RabbitMQ is used to handle communication for background tasks such as order status updates or other asynchronous tasks.

5. **Docker**:
   - The system is containerized using Docker for easy deployment and scaling. Each component (frontend, backend, database, RabbitMQ) runs in its own container.

**Setup Instructions**:-
Prerequisites
- Docker and Docker Compose installed on your machine.
Steps to Run the System
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/bakery-management-system.git
   cd bakery-management-system
   ```
2. **Build and start the containers**:
   - Run the following command to build and start all services using Docker Compose:
     ```bash
     docker-compose up --build
     ```
3. **Access the system**:
   - **Frontend** will be available at `http://localhost:3000`
   - **Admin Panel** will be accessible at `http://localhost:3000/admin`
   - **Backend API** is accessible on port `5000`.
   - **PostgreSQL Database** is accessible at `localhost:5433` with the credentials:
     - `user: bakery_user`
     - `password: bakery_pass`
     - `database: bakery_db`
   - **RabbitMQ** management interface is available at `http://localhost:15672` with the default username `guest` and password `guest`.
4. **Stop the system**:
   - To stop all running containers, use the following command:
     ```bash
     docker-compose down
     ```

+------------------+         REST         +------------------+         ORM         +------------------+
|  React Frontend  | <------------------> |   Flask Backend  | <-----------------> |   PostgreSQL DB  |
+------------------+                      +------------------+                    +------------------+
                                                 |
                                                 |  Queue Message
                                                 v
                                        +------------------+
                                        |    RabbitMQ      |
                                        +------------------+
                                                 |
                                                 v
                                        +------------------+
                                        |   Python Worker  |
                                        +------------------+

Components:
+------------------+
|  React Frontend  | - Customer-facing UI (Next.js/TypeScript)
+------------------+

+------------------+
|   Flask Backend  | - REST API service (Python)
+------------------+

+------------------+
|   PostgreSQL DB  | - Relational database
+------------------+

+------------------+
|    RabbitMQ      | - Message broker
+------------------+

+------------------+
|   Python Worker  | - Background task processor
+------------------+

Connections:
-------> : REST API calls
<-------> : Bidirectional communication
   |     : Vertical data flow
   v     : Direction of async messages
**API Documentation**
Backend (Flask API)
The backend exposes a REST API that the frontend interacts with. Below is the documentation for the available endpoints.
1. Get Products
Endpoint: GET /products
Description: Fetch all bakery products.
Response:
json
[
  {
    "id": 1,
    "name": "Chocolate Cake",
    "price": 250.00
  },
  {
    "id": 2,
    "name": "Apple Pie",
    "price": 180.00
  }
]
2. Create a New Order
Endpoint: POST /order
Description: Place a new order for a product.
Request Body:
json
{
  "product_id": 1
}
Response:
json
{
  "order_id": "12345",
  "status": "Order Placed"
}
3. Check Order Status
Endpoint: GET /order/{order_id}
Description: Get the status of an order.

URL Parameter:
order_id: The ID of the order.

Response:
json
{
  "status": "In Progress"
}
4. Add a New Product (Admin Panel)
Endpoint: POST /products
Description: Add a new bakery product (admin functionality).
Request Body:
json
{
  "name": "Lemon Tart",
  "price": 150.00
}
Response:

json
{
  "message": "Product added successfully"
}
5. Update Order Status (Admin Panel)
Endpoint: PUT /order/{order_id}/status
Description: Update the status of an order (admin functionality).

URL Parameter:
order_id: The ID of the order.

Request Body:

json
{
  "status": "Shipped"
}
Response:

json
{
  "message": "Order status updated successfully"
}

## 📁 Folder Structure

BakeOps/
├── 📦 backend/                     # Flask backend API
│   ├── 🧠 app.py                   # Main Flask application
│   ├── 📋 requirements.txt         # Backend dependencies
│   └── 🐳 Dockerfile               # Backend Dockerfile
│
├── 💻 frontend/                    # React frontend
│   ├── 📂 src/
│   │   ├── ⚛️ App.js               # Main React app
│   │   ├── 🛠️ Admin.js            # Admin panel
│   │   └── ...
│   ├── 📦 package.json             # Frontend dependencies
│   └── 🐳 Dockerfile               # Frontend Dockerfile
│
├── 🐇 worker/                      # RabbitMQ consumer (optional)
│   ├── 🧩 worker.py
│   └── 📋 requirements.txt
│
├── ⚙️ docker-compose.yml           # Multi-service orchestration
└── 📖 README.md                    # Project documentation



📊 Tech Stack
| Category             | Technologies           |
| -------------------- | ---------------------- |
| **Frontend**         | React.js               |
| **Backend**          | Flask (Python)         |
| **Database**         | PostgreSQL             |
| **Messaging**        | RabbitMQ               |
| **Containerization** | Docker, Docker Compose |
| **Monitoring**       | Prometheus (optional)  |

🧠 Future Enhancements

🔐 Implement JWT-based authentication

☁️ Deploy on AWS ECS or EC2

🧮 Add Redis caching for frequent queries

📊 Create analytics dashboard for admins

⚙️ Integrate CI/CD pipeline using GitHub Actions

💡 Inspiration

BakeOps is designed to simulate a real-world DevOps-ready microservice system, showcasing:

Scalable service design

Asynchronous messaging via RabbitMQ

End-to-end containerized deployment


