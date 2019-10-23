DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products
(
    item_id INTEGER(11)
    AUTO_INCREMENT NOT NULL,
    product_name VARCHAR
    (50),
    department_name VARCHAR
    (50),
    price INTEGER
    (5),
    stock_quantity INTEGER
    (11),
    PRIMARY KEY
    (item_id)
)

    INSERT TO
    products(product_name,
    department_name,
    price,
    stock_quantity
    )
    VALUES
    ('AMD Ryzen 7 3800X', 'Computer', 399.99, 4),
    ('EVGA GeForce RTX 2080 Ti
', 'Computer', 1,099.99, 15),
    ('GSKILL DDR4 16GB 3200', 'Computer', 109.99, 1),
    ('Fractal Design Meshify C ATX Mid Tower', 'Computer', 89.99, 2),
    ('WD BLACK NVMe 1TB', 'Computer', 209.99, 23),
    ('CORSAIR 1000W', 'Computer', 199.98, 6),
    ('MSI CREATION', 'Computer', 499.99, 10),
    ('Corsair K55
Keyboard,', 'Computer', 49.99, 2),
    ('CORSAIR M55 Mouse', 'Computer', 34.99, 4),
    ('WD Blue
3TB Hard Drive', 'Computer', 73.99, 9);