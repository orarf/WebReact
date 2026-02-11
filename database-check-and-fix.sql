-- ============================================
-- ตรวจสอบและแก้ไขปัญหา Update ไม่เข้า
-- ============================================

-- STEP 1: ดูว่ามี products ไหม
SELECT COUNT(*) as total_products FROM products;

-- STEP 2: ดูตัวอย่าง products (เอา id ไปเทียบ)
SELECT id, model, name, price, package_id 
FROM products 
LIMIT 5;

-- STEP 3: ถ้าต้องการแก้ไขราคาตรงๆ ใน database (แก้ id ให้ตรงกับที่จะแก้)
-- UPDATE products 
-- SET price = '฿15,000' 
-- WHERE id = '869f73d3-b6d6-47d7-b84d-4ae5cc0779f9';

-- STEP 4: ตรวจสอบว่า RLS ปิดอยู่จริงๆ
-- SELECT relname, relrowsecurity, relforcerowsecurity 
-- FROM pg_class 
-- WHERE relname = 'products';

-- ถ้า relrowsecurity = false = ปิดอยู่ (ดีแล้ว)
-- ถ้า relrowsecurity = true = เปิดอยู่ (อาจมีปัญหา)

-- STEP 5: ถ้า RLS เปิดอยู่ ให้ปิด
-- ALTER TABLE products DISABLE ROW LEVEL SECURITY;
