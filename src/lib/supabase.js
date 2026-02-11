import { createClient } from '@supabase/supabase-js';

// ============================================
// Supabase Configuration
// ============================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

// ============================================
// AUTH FUNCTIONS
// ============================================

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function isUserAdmin(userId) {
  if (!userId) return false;
  
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return !!data && !error;
}

// ============================================
// PRODUCT CRUD FUNCTIONS (สำหรับ Admin)
// ============================================

/**
 * ดึงสินค้าทั้งหมด (สำหรับแสดงในเว็บ)
 */
export async function getProductsByPackage(packageId) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('package_id', packageId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * ดึงสินค้าทั้งหมด (สำหรับ Admin - มี pagination)
 */
export async function getAllProducts(page = 1, limit = 20) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { products: data || [], count };
}

/**
 * ดึงสินค้าตาม ID
 */
export async function getProductById(productId) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * สร้างสินค้าใหม่ (Admin only)
 */
export async function createProduct(productData) {
  const { data, error } = await supabase
    .from('products')
    .insert([{
      package_id: productData.package_id,
      model: productData.model,
      name: productData.name,
      category: productData.category,
      image: productData.image,
      short_spec: productData.short_spec,
      price: productData.price,
      availability: productData.availability || 'มีสินค้า',
    }])
    .select();

  if (error) throw error;
  // data เป็น array ให้ return ตัวแรก หรือ return null ถ้าไม่มีข้อมูล
  return data && data.length > 0 ? data[0] : null;
}

/**
 * อัพเดทสินค้า (Admin only)
 */
export async function updateProduct(productId, updates) {
  console.log('=== Supabase: updateProduct ===');
  console.log('Product ID:', productId);
  console.log('Product ID type:', typeof productId);
  console.log('Updates:', updates);

  // ตรวจสอบก่อนว่ามี product นี้อยู่ไหม
  const { data: existing, error: checkError } = await supabase
    .from('products')
    .select('id, model, name')
    .eq('id', productId);
  
  console.log('Check existing product:', { existing, checkError });

  // ทำการ update
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .select();

  console.log('Supabase update response:', { data, error });

  if (error) {
    console.error('Supabase update error:', error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    console.warn('Update returned no data. This might mean:');
    console.warn('1. No row matches this ID');
    console.warn('2. RLS is blocking the update');
    console.warn('3. The ID format is incorrect');
  }
  
  // data เป็น array ให้ return ตัวแรก หรือ return null ถ้าไม่มีข้อมูล
  return data && data.length > 0 ? data[0] : null;
}

/**
 * ลบสินค้า (Admin only)
 */
export async function deleteProduct(productId) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) throw error;
  return true;
}

/**
 * ดึงหมวดหมู่ทั้งหมด
 */
export async function getCategories(packageId) {
  const { data, error } = await supabase
    .from('products')
    .select('category');

  if (error) throw error;
  
  const categories = [...new Set(data?.map(item => item.category))];
  return categories;
}

/**
 * ค้นหาสินค้า
 */
export async function searchProducts(query) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,model.ilike.%${query}%,category.ilike.%${query}%`);

  if (error) throw error;
  return data || [];
}

/**
 * อัพโหลดรูปภาพ (ใช้ Supabase Storage)
 */
export async function uploadImage(file, fileName) {
  console.log('Starting upload to Supabase Storage...', fileName);
  
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(`products/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error('Supabase storage upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
  
  console.log('Upload successful:', data);
  
  // ได้ URL ของรูป
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(`products/${fileName}`);
  
  console.log('Public URL:', publicUrl);
  return publicUrl;
}
