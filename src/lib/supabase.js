import { createClient } from '@supabase/supabase-js';

// ============================================
// วิธีตั้งค่า Supabase
// ============================================
// 1. ไปที่ https://supabase.com และสร้าง Project ใหม่
// 2. ไปที่ Project Settings > API หรือ Settings > API
// 3. คัดลอก URL และ anon/public key
// 4. สร้างไฟล์ .env ใน root project (ข้างๆ package.json):
//    VITE_SUPABASE_URL=https://your-project.supabase.co
//    VITE_SUPABASE_ANON_KEY=your-anon-key
// ============================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ถ้ายังไม่มี env ให้ใช้ค่าว่าง (จะไม่ทำงานจนกว่าจะตั้งค่า)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

// ============================================
// ฟังก์ชั่นสำหรับดึงข้อมูลสินค้า
// ============================================

/**
 * ดึงสินค้าทั้งหมดตาม package_id
 * @param {string} packageId - 'test1', 'test2', 'test3'
 * @returns {Promise<Array>} รายการสินค้า
 * 
 * ตัวอย่างโครงสร้าง Table ใน Supabase:
 * 
 * Table: products
 * - id (uuid, primary key)
 * - package_id (text) - 'test1', 'test2', 'test3'
 * - model (text) - รหัสรุ่น เช่น 'FI-100'
 * - name (text) - ชื่อสินค้า
 * - category (text) - หมวดหมู่
 * - image (text) - URL รูปภาพ
 * - short_spec (text) - สเปคสั้น
 * - price (text) - ราคาแสดง
 * - availability (text) - 'มีสินค้า', 'สั่งจอง', 'สั่งผลิต'
 * - created_at (timestamp)
 */
export async function getProductsByPackage(packageId) {
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    console.warn('⚠️ Supabase ยังไม่ได้ตั้งค่า กรุณาเพิ่ม VITE_SUPABASE_URL ใน .env');
    return [];
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('package_id', packageId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return data || [];
}

/**
 * ดึงสินค้าตามหมวดหมู่
 * @param {string} packageId 
 * @param {string} category 
 * @returns {Promise<Array>}
 */
export async function getProductsByCategory(packageId, category) {
  if (!supabaseUrl?.includes('http')) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('package_id', packageId)
    .eq('category', category);

  if (error) throw error;
  return data || [];
}

/**
 * ดึงสินค้าตาม ID
 * @param {string} productId 
 * @returns {Promise<Object>}
 */
export async function getProductById(productId) {
  if (!supabaseUrl?.includes('http')) return null;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * ดึงหมวดหมู่ทั้งหมดที่มีใน package
 * @param {string} packageId 
 * @returns {Promise<Array>}
 */
export async function getCategories(packageId) {
  if (!supabaseUrl?.includes('http')) return [];

  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('package_id', packageId);

  if (error) throw error;
  
  // กรองเอา unique categories
  const categories = [...new Set(data?.map(item => item.category))];
  return categories;
}

/**
 * ค้นหาสินค้า (Search)
 * @param {string} query - คำค้นหา
 * @param {string} packageId - optional
 * @returns {Promise<Array>}
 */
export async function searchProducts(query, packageId = null) {
  if (!supabaseUrl?.includes('http')) return [];

  let queryBuilder = supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,model.ilike.%${query}%,category.ilike.%${query}%`);
  
  if (packageId) {
    queryBuilder = queryBuilder.eq('package_id', packageId);
  }

  const { data, error } = await queryBuilder;

  if (error) throw error;
  return data || [];
}
