CREATE DATABASE IF NOT EXISTS campus_crud;
USE campus_crud;

DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(150) NOT NULL,
  category VARCHAR(60),
  brand VARCHAR(80),
  key_spec VARCHAR(200),
  release_year INT,
  price DECIMAL(8,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO products (product_name, category, brand, key_spec, release_year, price) VALUES
('Sony WH-1000XM6', 'Headset', 'Sony', 'Wireless noise-cancelling headphones', 2025, 459.99),
('Meta Quest 3S', 'Headset', 'Meta', 'Standalone VR headset, 128GB', 2024, 349.99),
('iPhone 18 Pro Max', 'Phone', 'Apple', 'A20 Pro chip, 256GB base', 2026, 1299.00),
('Samsung Galaxy S26 Ultra', 'Phone', 'Samsung', '6.9-inch display, 256GB, built-in S Pen', 2026, 1399.99),
('Google Pixel 10 Pro', 'Phone', 'Google', '6.3-inch display, 128GB', 2025, 999.00),
('Xiaomi 17 Ultra', 'Phone', 'Xiaomi', '16GB RAM, 512GB, Leica cameras', 2026, 1769.00),
('Samsung Galaxy Z TriFold', 'Phone', 'Samsung', 'Triple-fold phone and tablet hybrid', 2026, 2899.00),
('Apple iPhone Duo', 'Phone', 'Apple', 'First foldable iPhone, 256GB base', 2026, 1999.00),
('Tecno Camon Slim', 'Phone', 'Tecno', '6.78-inch display, 8GB RAM, 256GB, 6.4mm thin', 2026, 495.00),
('Infinix GT 50 Pro', 'Phone', 'Infinix', '6.78-inch 144Hz AMOLED, Dimensity 8400 Ultimate, 12GB RAM', 2026, 376.00),
('iPad Pro 11-inch (M5)', 'Tablet', 'Apple', 'M5 chip, 11-inch display, 256GB', 2025, 999.00),
('MacBook Neo', 'Laptop', 'Apple', 'A18 Pro chip, 13-inch, 8GB RAM', 2026, 699.00),
('MacBook Air M5', 'Laptop', 'Apple', 'M5 chip, 13-inch', 2026, 1299.00),
('Dell XPS 14 (2026)', 'Laptop', 'Dell', '14-inch OLED, Intel Core Ultra Series 3', 2026, 1849.99),
('Lenovo ThinkPad X1 Carbon Gen 14', 'Laptop', 'Lenovo', '14-inch 2.8K OLED, under 1 kg', 2026, 1999.00),
('ASUS ROG Zephyrus G14 (2026)', 'Laptop', 'ASUS', '14-inch 3K OLED, RTX 5070 Ti, 32GB RAM', 2026, 3599.00),
('Razer Blade 16 (2026)', 'Laptop', 'Razer', '16-inch 240Hz OLED, RTX 50 Series', 2026, 3499.99);