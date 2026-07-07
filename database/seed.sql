INSERT INTO categories (name, slug) VALUES 
('Electronics', 'electronics'),
('Clothing', 'clothing'),
('Home & Kitchen', 'home-and-kitchen'),
('Books', 'books')
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES 
('Wireless Noise-Canceling Headphones', 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.', 299.99, 50, 1, 'https://example.com/headphones.jpg'),
('4K Ultra HD Smart TV', '55-inch 4K LED TV with smart functionality and HDR support.', 499.99, 20, 1, 'https://example.com/tv.jpg'),
('Smartphone 5G', 'Latest generation 5G smartphone with 128GB storage and triple camera system.', 799.00, 100, 1, 'https://example.com/smartphone.jpg'),
('Bluetooth Portable Speaker', 'Waterproof portable speaker with deep bass and 12-hour playtime.', 59.99, 75, 1, 'https://example.com/speaker.jpg'),
('Men''s Cotton T-Shirt', 'Classic 100% cotton crew neck t-shirt.', 19.99, 200, 2, 'https://example.com/tshirt.jpg'),
('Women''s Denim Jacket', 'Vintage style blue denim jacket.', 65.00, 40, 2, 'https://example.com/denim-jacket.jpg'),
('Running Shoes', 'Lightweight athletic shoes for running and training.', 89.95, 60, 2, 'https://example.com/shoes.jpg'),
('Winter Beanie', 'Warm knit beanie for cold weather.', 14.99, 150, 2, 'https://example.com/beanie.jpg'),
('Stainless Steel Coffee Maker', 'Programmable 12-cup coffee maker with reusable filter.', 49.99, 30, 3, 'https://example.com/coffeemaker.jpg'),
('Non-Stick Cookware Set', '10-piece aluminum cookware set with glass lids.', 129.99, 25, 3, 'https://example.com/cookware.jpg'),
('Memory Foam Pillow', 'Ergonomic neck support memory foam pillow.', 29.99, 80, 3, 'https://example.com/pillow.jpg'),
('Robot Vacuum Cleaner', 'Smart robot vacuum with Wi-Fi connectivity and self-charging.', 199.99, 15, 3, 'https://example.com/vacuum.jpg'),
('The Great Gatsby', 'Classic novel by F. Scott Fitzgerald.', 9.99, 120, 4, 'https://example.com/gatsby.jpg'),
('Atomic Habits', 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.', 16.99, 90, 4, 'https://example.com/habits.jpg'),
('Clean Code', 'A Handbook of Agile Software Craftsmanship.', 34.50, 45, 4, 'https://example.com/cleancode.jpg'),
('Dune', 'Science fiction masterpiece by Frank Herbert.', 14.95, 70, 4, 'https://example.com/dune.jpg')
ON CONFLICT DO NOTHING;
