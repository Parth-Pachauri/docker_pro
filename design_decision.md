📄 Design Decisions Document

1. Architecture Choice
•	Type: Microservices-style with containerized components.
•	Rationale: Separates frontend, backend, and database for scalability, easier maintenance, and isolated deployments using Docker.
2. Frontend (React.js)
•	Chosen Because: Component-based architecture, fast rendering, large ecosystem.
•	Admin Panel: Built with a dedicated tab that opens an order management window.
•	UI/UX Enhancements: Styled with modern CSS animations and responsive design for mobile compatibility.
3. Backend (Flask)
•	Chosen Because: Lightweight, easy to integrate with REST APIs, fast for development.
•	Features:
o	RESTful API to handle orders, products, and admin updates.
o	Connected to PostgreSQL using SQLAlchemy or psycopg2.
o	Status update endpoints for admin panel.
4. Database (PostgreSQL)
•	Chosen Because: Reliable, ACID-compliant, supports complex queries.
•	Schema:
o	users, products, orders, and order_status tables.
o	Indexed for performance on order ID and status fields.
5. Dockerization
•	Frontend, Backend, DB all containerized using Docker Compose.
•	Benefits:
o	Consistent environments across machines.
o	Easy scaling and service isolation.
•	Volumes: Used for persistent PostgreSQL data.
•	Networks: Custom bridge network for service communication.
6. Admin Panel Design
•	Access: Via a secure tab/button on the frontend.
•	Functionality: View orders, update order statuses in real-time via API.
•	Implementation: React page communicating with Flask backend using fetch or Axios.


