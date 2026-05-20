-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Attractions table
CREATE TABLE IF NOT EXISTS attractions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    image_url TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    attraction_id INTEGER REFERENCES attractions(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Votes table
CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    attraction_id INTEGER REFERENCES attractions(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(10) CHECK (type IN ('like', 'dislike')),
    UNIQUE(attraction_id, user_id)
);

-- Insert some initial data
INSERT INTO attractions (name, description, location, image_url) VALUES
('วัดพระแก้ว', 'วัดพระศรีรัตนศาสดาราม หรือวัดพระแก้ว สถานที่ท่องเที่ยวอันดับหนึ่งที่ต้องมาเยือนในกรุงเทพฯ', 'กรุงเทพมหานคร', 'https://images.unsplash.com/photo-1528181304800-2f143c8c798d?auto=format&fit=crop&w=800&q=80'),
('ย่านเมืองเก่าเชียงใหม่', 'ศูนย์กลางประวัติศาสตร์ที่เต็มไปด้วยวัดวาอารามที่สวยงามและถนนคนเดินที่มีชีวิตชีวา', 'เชียงใหม่', 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=800&q=80'),
('หาดไร่เลย์', 'หาดทรายขาวละเอียดตัดกับหน้าผาหินปูนและน้ำทะเลสีฟ้าใส', 'กระบี่', 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80');
