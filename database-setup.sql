-- ============================================
-- SQL สำหรับสร้าง Table ใน Supabase
-- ไปที่ Supabase Dashboard > SQL Editor > New Query
-- แล้ววางโค้ดนี้แล้วกด Run
-- ============================================

-- สร้าง Table products
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id TEXT NOT NULL,
  model TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  short_spec TEXT,
  price TEXT,
  availability TEXT DEFAULT 'มีสินค้า',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- เพิ่ม Index สำหรับค้นหาเร็วขึ้น
CREATE INDEX IF NOT EXISTS idx_products_package ON products(package_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- เปิดใช้งาน Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- สร้าง Policy ให้ทุกคนอ่านได้ (ไม่ต้อง login)
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- สร้าง Policy ให้เฉพาะ admin แก้ไขได้ (optional)
-- CREATE POLICY "Allow admin write access" ON products
--   FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- ตัวอย่างข้อมูล (Sample Data)
-- ============================================

-- สินค้าสำหรับ Test1 (Basic)
INSERT INTO products (package_id, model, name, category, image, short_spec, price, availability) VALUES
('test1', 'FI-100', 'Fiber Identifier', 'Fiber Tools', 'https://placehold.co/300x200/00A651/ffffff?text=FI-100', 'ตรวจจับทิศทางแสง, 800-1700nm', '฿12,500', 'มีสินค้า'),
('test1', 'OPM-200', 'Optical Power Meter', 'Power Meters', 'https://placehold.co/300x200/00A651/ffffff?text=OPM-200', 'วัดกำลังแสง -70 ถึง +10 dBm', '฿8,900', 'มีสินค้า'),
('test1', 'SmartOTDR Mini', 'Mini OTDR', 'OTDR', 'https://placehold.co/300x200/00A651/ffffff?text=SmartOTDR', '1310/1550nm, 28/26dB dynamic range', '฿89,000', 'สั่งจอง'),
('test1', 'FC-500', 'Fiber Cleaner', 'Cleaning', 'https://placehold.co/300x200/00A651/ffffff?text=FC-500', 'ทำความสะอาดคอนเน็คเตอร์ 500+ ครั้ง', '฿2,500', 'มีสินค้า');

-- สินค้าสำหรับ Test2 (Pro)
INSERT INTO products (package_id, model, name, category, image, short_spec, price, availability) VALUES
('test2', 'MTS-2000', 'Modular Test System', 'OTDR Pro', 'https://placehold.co/300x200/00A651/ffffff?text=MTS-2000', 'Multi-module: OTDR, OSA, CD/PMD', '฿185,000', 'สั่งจอง'),
('test2', 'SmartOTDR Pro', 'Handheld OTDR', 'OTDR Pro', 'https://placehold.co/300x200/00A651/ffffff?text=OTDR+Pro', '1310/1550/1625nm, 37/36/36dB', '฿245,000', 'มีสินค้า'),
('test2', 'OSA-500', 'Optical Spectrum Analyzer', 'Spectrum', 'https://placehold.co/300x200/00A651/ffffff?text=OSA-500', '1250-1650nm, 0.02nm resolution', '฿320,000', 'สั่งจอง'),
('test2', 'ET-100G', '100G Ethernet Tester', 'Ethernet', 'https://placehold.co/300x200/00A651/ffffff?text=ET-100G', '10M-100G, RFC 2544, Y.1564', '฿450,000', 'สั่งจอง');

-- สินค้าสำหรับ Test3 (Enterprise)
INSERT INTO products (package_id, model, name, category, image, short_spec, price, availability) VALUES
('test3', 'LAB-OTDR', 'Laboratory OTDR System', 'Lab Equipment', 'https://placehold.co/300x200/00A651/ffffff?text=LAB-OTDR', 'Ultra-high resolution 0.01m event', 'ติดต่อฝ่ายขาย', 'สั่งผลิต'),
('test3', 'DWDM-Analyzer', 'DWDM Channel Analyzer', 'DWDM', 'https://placehold.co/300x200/00A651/ffffff?text=DWDM-A', '96 ch C+L band, OSNR measurement', 'ติดต่อฝ่ายขาย', 'สั่งผลิต'),
('test3', 'Turnkey-Lab', 'Turnkey Test Lab', 'Solutions', 'https://placehold.co/300x200/00A651/ffffff?text=Turnkey', 'Complete lab setup + training', 'ติดต่อฝ่ายขาย', 'ประเมินราคา');
