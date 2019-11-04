DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products
(
    item_id INT
        NOT NULL
    AUTO_INCREMENT,
    product_name VARCHAR
    (50)
    NOT NULL,
    department_name VARCHAR
    (50)
    NOT NULL,
    price DECIMAL
    (10,2)
    NOT NULL,
    stock_quantity INTEGER
    (11)
    NOT NULL,
    PRIMARY KEY
    (item_id)
);
    INSERT INTO products
        (
        product_name,
        department_name,
        price,
        stock_quantity
        )
    VALUES
        ('CPU', 'Computer', 399.99, 4),
        ('VideoCard', 'Computer', 1099.99, 15),
        ('Ram', 'Computer', 109.99, 1),
        ('Case', 'Computer', 89.99, 2),
        ('WCPaper', 'Art Supply', 22.99, 23),
        ('OilPaint', 'Art Supply', 39.99, 6),
        ('Bluray', 'Video', 22.99, 10),
        ('Headphones', 'Electronics', 349.99, 2),
        ('TechBook', 'Books', 27.99, 4),
        ('Shirt', 'Clothes', 15.99, 9);