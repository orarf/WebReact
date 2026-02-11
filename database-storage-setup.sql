-- ============================================
-- SQL ตั้งค่า Supabase Storage สำหรับอัพโหลดรูปภาพ
-- ============================================

-- STEP 1: สร้าง Storage Bucket (ถ้ายังไม่มี)
-- ถ้าขึ้น error "duplicate key" แปลว่า bucket มีอยู่แล้ว ให้ข้ามไป STEP 2 ได้เลย
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images', 
  'product-images', 
  true, 
  5242880,  -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;  -- ← ถ้ามีอยู่แล้วให้ข้าม

-- STEP 2: ลบ Policies เก่า (ถ้ามี)
DROP POLICY IF EXISTS "Allow public read images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated all" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update delete" ON storage.objects;

-- STEP 3: สร้าง Policies ใหม่

-- Policy 1: ให้ทุกคนอ่านรูปได้ (ดูรูปสินค้า)
CREATE POLICY "Allow public read images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Policy 2: ให้ทุกคนอัพโหลดได้ (แบบง่าย - ใช้ตอนทดสอบ)
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Policy 3: ให้ทุกคนอัพเดท/ลบได้ (แบบง่าย)
CREATE POLICY "Allow public update delete"
ON storage.objects FOR ALL
USING (bucket_id = 'product-images');

-- ============================================
-- ตรวจสอบว่า Bucket ถูกสร้างแล้ว
-- ============================================
-- SELECT * FROM storage.buckets WHERE id = 'product-images';

-- ============================================
-- ตรวจสอบ Policies
-- ============================================
-- SELECT * FROM storage.policies WHERE bucket_id = 'product-images';

-- ============================================
-- วิธีทดสอบว่าอัพโหลดได้ไหม
-- ============================================
-- 1. ไปที่ Supabase Dashboard > Storage
-- 2. เลือก bucket 'product-images'
-- 3. ลองอัพโหลดไฟล์ผ่านหน้าเว็บ
-- ถ้าอัพโหลดได้ = bucket ถูกต้อง
-- ถ้าอัพโหลดไม่ได้ = ตรวจสอบ policies

-- ============================================
-- แก้ไขปัญหายอดฮิต
-- ============================================

-- ปัญหา: "The resource was not found" 
-- แก้: bucket ยังไม่ถูกสร้าง รัน STEP 1 ใหม่

-- ปัญหา: "new row violates row-level security policy for table objects"
-- แก้: รัน STEP 2 + STEP 3 เพื่อสร้าง policies ใหม่

-- ปัญหา: "Payload too large"
-- แก้: เพิ่ม file_size_limit ใน STEP 1 (ค่าเป็น bytes)

-- ปัญหา: "duplicate key value violates unique constraint"
-- แก้: ไม่ต้องทำอะไร แปลว่า bucket มีอยู่แล้ว รันต่อ STEP 2, 3 ได้เลย
