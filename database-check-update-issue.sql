-- ============================================
-- ตรวจสอบปัญหา Update ไม่เข้า
-- ============================================

-- STEP 1: เช็คว่ามี products ไหม
SELECT COUNT(*) as total_products FROM products;

-- STEP 2: ดู products ทั้งหมด (เอา id ไปเทียบกับที่ส่งจากเว็บ)
SELECT id, model, name, price, package_id, created_at
FROM products 
ORDER BY created_at DESC
LIMIT 10;

-- STEP 3: เช็คว่า ID ที่ส่งมามีอยู่จริงไหม (แก้ ID ให้ตรงกับที่จะเช็ค)
-- SELECT * FROM products WHERE id = '869f73d3-b6d6-47d7-b84d-4ae5cc0779f9';

-- STEP 4: เช็ค RLS ของ table products
SELECT 
  relname as table_name,
  relrowsecurity as rls_enabled,
  relforcerowsecurity as force_rls
FROM pg_class 
WHERE relname = 'products';

-- ถ้า relrowsecurity = true แปลว่า RLS เปิดอยู่ → ให้ปิด
-- ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- STEP 5: เช็คว่ามี triggers อะไร block ไหม
SELECT * FROM pg_trigger WHERE tgrelid = 'products'::regclass;

-- STEP 6: ลอง update ตรงๆ ดู (แก้ ID และราคาให้ตรง)
-- UPDATE products 
-- SET price = '฿99,999' 
-- WHERE id = '869f73d3-b6d6-47d7-b84d-4ae5cc0779f9'
-- RETURNING *;
