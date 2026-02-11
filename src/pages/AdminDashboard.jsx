import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  uploadImage 
} from '../lib/supabase';
import logo from '../assets/Tricomm-logo.png';

function AdminDashboard() {
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPackage, setFilterPackage] = useState('all');
  
  // Form state
  const [formData, setFormData] = useState({
    package_id: 'test1',
    model: '',
    name: '',
    category: '',
    image: '',
    short_spec: '',
    price: '',
    availability: 'มีสินค้า',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // ← เพิ่ม state สำหรับ preview
  const fileInputRef = useRef(null); // ← useRef สำหรับ input file
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // สร้าง preview URL เมื่อเลือกไฟล์ใหม่
  useEffect(() => {
    if (imageFile) {
      const previewUrl = URL.createObjectURL(imageFile);
      setImagePreview(previewUrl);
      
      // Cleanup เมื่อ component unmount หรือเลือกไฟล์ใหม่
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [imageFile]);

  // ข้อมูลแพ็กเกจ
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (!authLoading && user && !isAdmin) {
      alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      loadProducts();
    }
  }, [user, isAdmin]);

  async function loadProducts() {
    try {
      setLoading(true);
      const { products: data } = await getAllProducts(1, 100);
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
      alert('ไม่สามารถโหลดข้อมูลสินค้าได้');
    } finally {
      setLoading(false);
    }
  }

  function handleAddNew() {
    setEditingProduct(null);
    setFormData({
      package_id: 'test1',
      model: '',
      name: '',
      category: '',
      image: '',
      short_spec: '',
      price: '',
      availability: 'มีสินค้า',
    });
    setImageFile(null);
    setImagePreview(null);
    setFormError('');
    setShowModal(true);
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setFormData({
      package_id: product.package_id,
      model: product.model,
      name: product.name,
      category: product.category,
      image: product.image,
      short_spec: product.short_spec || '',
      price: product.price,
      availability: product.availability,
    });
    setImageFile(null);
    setImagePreview(product.image); // แสดงรูปเดิม
    setFormError('');
    setShowModal(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    try {
      let imageUrl = formData.image;

      // อัพโหลดรูปใหม่ถ้ามี
      if (imageFile) {
        console.log('Uploading image:', imageFile.name);
        const fileName = `${Date.now()}_${imageFile.name}`;
        
        try {
          imageUrl = await uploadImage(imageFile, fileName);
          console.log('Image uploaded successfully:', imageUrl);
        } catch (uploadErr) {
          console.error('Upload error:', uploadErr);
          setFormError('อัพโหลดรูปภาพไม่สำเร็จ: ' + uploadErr.message);
          setSaving(false);
          return;
        }
      }

      const productData = {
        ...formData,
        image: imageUrl,
      };

      console.log('=== DEBUG: Saving product ===');
      console.log('Editing product ID:', editingProduct?.id);
      console.log('Product data to save:', productData);
      console.log('Price value:', productData.price);

      if (editingProduct) {
        console.log('Calling updateProduct...');
        const result = await updateProduct(editingProduct.id, productData);
        console.log('Update result:', result);
      } else {
        console.log('Calling createProduct...');
        const result = await createProduct(productData);
        console.log('Create result:', result);
      }

      // Reset form และ close modal
      resetForm();
      setShowModal(false);
      loadProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setFormError('ไม่สามารถบันทึกข้อมูลได้: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setFormData({
      package_id: 'test1',
      model: '',
      name: '',
      category: '',
      image: '',
      short_spec: '',
      price: '',
      availability: 'มีสินค้า',
    });
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // ← Reset input file
    }
  }

  function handleCancel() {
    resetForm();
    setShowModal(false);
  }

  function handleClearImage() {
    setImageFile(null);
    setImagePreview(editingProduct?.image || null);
    setFormData({...formData, image: editingProduct?.image || ''});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function handleDelete(productId) {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) return;

    try {
      await deleteProduct(productId);
      loadProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('ไม่สามารถลบสินค้าได้');
    }
  }

  const filteredProducts = products.filter(product => {
    const matchSearch = 
      product.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchPackage = filterPackage === 'all' || product.package_id === filterPackage;
    
    return matchSearch && matchPackage;
  });

  const stats = {
    total: products.length,
    test1: products.filter(p => p.package_id === 'test1').length,
    test2: products.filter(p => p.package_id === 'test2').length,
    test3: products.filter(p => p.package_id === 'test3').length,
  };

  if (authLoading || !user || !isAdmin) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>กำลังตรวจสอบสิทธิ์...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-brand">
            <img src={logo} alt="Tricomm" />
            <h1>Admin Dashboard</h1>
          </div>
          <div className="admin-user">
            <span>{user.email}</span>
            <button className="btn-logout" onClick={signOut}>
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      <div className="admin-container">
        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">สินค้าทั้งหมด</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.test1}</span>
            <span className="stat-label">Basic (Test1)</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.test2}</span>
            <span className="stat-label">Pro (Test2)</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.test3}</span>
            <span className="stat-label">Enterprise (Test3)</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="search-filter">
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search"
            />
            <select 
              value={filterPackage} 
              onChange={(e) => setFilterPackage(e.target.value)}
              className="admin-filter"
            >
              <option value="all">ทุกแพ็กเกจ</option>
              <option value="test1">Basic (Test1)</option>
              <option value="test2">Pro (Test2)</option>
              <option value="test3">Enterprise (Test3)</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleAddNew}>
            + เพิ่มสินค้าใหม่
          </button>
        </div>

        {/* Products Table */}
        <div className="admin-table-container">
          {loading ? (
            <div className="admin-loading">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>รูป</th>
                  <th>รุ่น</th>
                  <th>ชื่อสินค้า</th>
                  <th>หมวดหมู่</th>
                  <th>แพ็กเกจ</th>
                  <th>ราคา</th>
                  <th>สถานะ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img 
                        src={product.image || 'https://placehold.co/100x100/e8e8ed/999?text=No+Image'} 
                        alt={product.model}
                        className="product-thumb"
                      />
                    </td>
                    <td>{product.model}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>
                      <span className={`package-badge ${product.package_id}`}>
                        {product.package_id}
                      </span>
                    </td>
                    <td>{product.price}</td>
                    <td>
                      <span className={`status-badge ${product.availability === 'มีสินค้า' ? 'in' : 'out'}`}>
                        {product.availability}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEdit(product)}
                        >
                          แก้ไข
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDelete(product.id)}
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {!loading && filteredProducts.length === 0 && (
            <div className="empty-table">
              <p>ไม่พบสินค้า</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
            
            {formError && <div className="form-error">{formError}</div>}
            
            <form onSubmit={handleSave}>
              {/* Debug: แสดงค่า formData */}
              <div style={{fontSize: '12px', color: '#999', marginBottom: '10px'}}>
                Debug: model={formData.model}, name={formData.name}, price={formData.price}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>แบรนด์ / Package</label>
                  <input
                    type="text"
                    value={formData.package_id}
                    onChange={(e) => {
                      console.log('Package changed:', e.target.value);
                      setFormData({...formData, package_id: e.target.value});
                    }}
                    placeholder="viavi"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>รหัสรุ่น (Model)</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => {
                      console.log('Model changed:', e.target.value);
                      setFormData({...formData, model: e.target.value});
                    }}
                    placeholder="FI-100"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>ชื่อสินค้า</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    console.log('Name changed:', e.target.value);
                    setFormData({...formData, name: e.target.value});
                  }}
                  placeholder="Fiber Identifier"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>หมวดหมู่</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="Fiber Tools"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>ราคา</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => {
                      console.log('Price changed:', e.target.value);
                      setFormData({...formData, price: e.target.value});
                    }}
                    placeholder="฿12,500"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>สเปคสั้น</label>
                <input
                  type="text"
                  value={formData.short_spec}
                  onChange={(e) => setFormData({...formData, short_spec: e.target.value})}
                  placeholder="ตรวจจับทิศทางแสง, 800-1700nm"
                />
              </div>

              <div className="form-group">
                <label>สถานะ</label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({...formData, availability: e.target.value})}
                  style={{ width: '100%' }}
                >
                  <option value="มีสินค้า">มีสินค้า</option>
                  <option value="สั่งจอง">สั่งจอง</option>
                  <option value="สั่งผลิต">สั่งผลิต</option>
                  <option value="หมดสต็อก">หมดสต็อก</option>
                </select>
              </div>

              {/* เลือกระหว่างอัพโหลดไฟล์ หรือใส่ URL */}
              <div className="form-group">
                <label>รูปภาพสินค้า</label>
                <div className="image-input-tabs">
                  <button 
                    type="button" 
                    className={`tab-btn ${!formData.image?.startsWith('http') ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, image: ''})}
                  >
                    อัพโหลดไฟล์
                  </button>
                  <button 
                    type="button"
                    className={`tab-btn ${formData.image?.startsWith('http') ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, image: 'https://'})}
                  >
                    ใส่ URL
                  </button>
                </div>

                {/* อัพโหลดไฟล์ */}
                {!formData.image?.startsWith('http') && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      style={{ marginTop: '12px' }}
                    />
                    {imageFile && <span style={{fontSize: '13px', color: '#6e6e73'}}>เลือก: {imageFile.name}</span>}
                  </>
                )}

                {/* ใส่ URL */}
                {formData.image?.startsWith('http') && (
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    style={{ marginTop: '12px' }}
                  />
                )}
              </div>

              {/* Preview รูป */}
              {imagePreview && (
                <div className="image-preview-section">
                  <label>ตัวอย่างรูปภาพ</label>
                  <div className="preview-container">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="image-preview"
                    />
                    <button 
                      type="button" 
                      className="btn-clear-image"
                      onClick={handleClearImage}
                    >
                      ✕ ล้างรูป
                    </button>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
