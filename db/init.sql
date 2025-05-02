CREATE TABLE bakery_products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES bakery_products(id),
    status VARCHAR(50) DEFAULT 'pending'
);