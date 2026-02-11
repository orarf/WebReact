-- ============================================
-- SQL สำหรับตั้งค่าระบบ Admin
-- ============================================

-- ============================================
-- ทางเลือกที่ 1: ง่าย (RLS ปิด) - ใช้ตอนทดสอบ
-- ============================================
-- ข้อดี: ทำงานได้ทันที ไม่มีปัญหา
-- ข้อเสีย: ใครก็มองเห็นใครเป็น Admin ได้ (ตอน production ไม่ควรใช้)

-- ปิด RLS (ถ้ายังไม่ได้ปิด)
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- ตรวจสอบว่า RLS ปิดอยู่
-- SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'admins';
-- ถ้า relrowsecurity = f (false) แปลว่าปิดอยู่

-- ============================================
-- ทางเลือกที่ 2: ปลอดภัย (RLS เปิด) - ใช้ตอน production
-- ============================================
-- ข้อดี: ปลอดภัย ซ่อนข้อมูล Admin จาก public
-- ข้อเสีย: ต้องตั้งค่าให้ถูกต้อง

-- ถ้าต้องการเปิด RLS ให้รันส่วนนี้ (ลบ -- ออกทั้งหมดก่อนรัน):

/*
-- เปิด RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- ลบ policy เก่าทั้งหมด
DROP POLICY IF EXISTS "Allow public read" ON admins;
DROP POLICY IF EXISTS "Allow admin manage" ON admins;
DROP POLICY IF EXISTS "Allow insert own user_id" ON admins;
DROP POLICY IF EXISTS "Allow authenticated read" ON admins;
DROP POLICY IF EXISTS "Allow update own record" ON admins;
DROP POLICY IF EXISTS "Allow delete own record" ON admins;
DROP POLICY IF EXISTS "Allow all for admins" ON admins;

-- สร้าง Policy ที่ถูกต้อง
-- Policy 1: ให้ทุกคนอ่านเฉพาะ user_id ของตัวเอง (เพื่อตรวจสอบสิทธิ์)
CREATE POLICY "Allow read own record" ON admins
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy 2: ให้ authenticated user insert ได้ (สำหรับการสร้าง Admin คนแรก)
CREATE POLICY "Allow insert for authenticated" ON admins
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: ให้ update ข้อมูลตัวเองได้
CREATE POLICY "Allow update own record" ON admins
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy 4: ให้ delete ข้อมูลตัวเองได้
CREATE POLICY "Allow delete own record" ON admins
  FOR DELETE 
  USING (auth.uid() = user_id);
*/

-- ============================================
-- STEP: เพิ่ม Admin (แก้ไข email ตรงนี้)
-- ============================================

-- แก้ 'admin@yourdomain.com' เป็น email ที่คุณสมัครไว้
INSERT INTO admins (user_id, email)
SELECT id, email 
FROM auth.users 
WHERE email = 'admin@yourdomain.com'
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- ตรวจสอบสถานะ
-- ============================================

-- ดูว่า RLS เปิดหรือปิด
-- SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'admins';
-- relrowsecurity = t (true) = เปิดอยู่
-- relrowsecurity = f (false) = ปิดอยู่

-- ดูรายชื่อ Admin
-- SELECT * FROM admins;

-- ดู Policies ทั้งหมด
-- SELECT * FROM pg_policies WHERE tablename = 'admins';

-- ============================================
-- วิธีสลับระหว่าง RLS เปิด/ปิด
-- ============================================

-- ปิด RLS (ทางง่าย)
-- ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- เปิด RLS (ทางปลอดภัย)
-- ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Storage Bucket สำหรับเก็บรูปภาพ
-- ============================================

-- สร้าง bucket (ถ้ายังไม่มี)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- ลบ policy เก่า
DROP POLICY IF EXISTS "Allow public read images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;

-- Policy ให้ทุกคนอ่านรูปได้
CREATE POLICY IF NOT EXISTS "Allow public read images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Policy ให้ authenticated user อัพโหลดได้ (ไม่ต้อง check admin ซ้ำ)
CREATE POLICY IF NOT EXISTS "Allow authenticated uploads" ON storage.objects
  FOR INSERT TO authenticated 
  WITH CHECK (bucket_id = 'product-images');
