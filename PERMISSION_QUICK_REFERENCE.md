# Permission System - Quick Reference

## ✅ Vấn Đề Đã Được Giải Quyết

### 1. Fix Lỗi "Cannot PATCH /admin/roles/create"
- **Nguyên nhân**: Form create.pug sử dụng `?_method=PATCH` thay vì POST
- **Giải pháp**: Đã sửa form create.pug để dùng POST thay vì PATCH

### 2. Chức Năng Phân Quyền
- **Thêm mới**: Hệ thống đầy đủ để quản lý quyền
- **Bao gồm**: 
  - 12 quyền cơ bản (Product, Category, Role)
  - Middleware kiểm tra quyền
  - Helper functions cho role management
  - Views cho quản lý quyền

---

## 📁 Các File Đã Tạo/Sửa

### Đã Tạo
- ✅ `middleware/admin/permission.middleware.js` - Permission check middleware
- ✅ `helper/roleHelper.js` - Role & permission helper functions
- ✅ `PERMISSION_GUIDE.md` - Detailed documentation

### Đã Sửa
- ✅ `controller/admin/role-controller.js` - Thêm permission management
- ✅ `models/role-model.js` - Thêm fields: description, status
- ✅ `routes/admin/role-route.js` - Thêm DELETE & GET permissions routes
- ✅ `views/admin/pages/roles/create.pug` - Fix POST + thêm permission checkboxes
- ✅ `views/admin/pages/roles/edit.pug` - Thêm permission checkboxes
- ✅ `views/admin/pages/roles/index.pug` - Thêm status, permissions display, delete button

---

## 🎯 Các Quyền Có Sẵn

### Sản Phẩm (Product)
- `product_view` - Xem danh sách sản phẩm
- `product_create` - Tạo sản phẩm
- `product_edit` - Chỉnh sửa sản phẩm
- `product_delete` - Xóa sản phẩm

### Danh Mục (Category)
- `category_view` - Xem danh mục
- `category_create` - Tạo danh mục
- `category_edit` - Chỉnh sửa danh mục
- `category_delete` - Xóa danh mục

### Vai Trò (Role)
- `role_view` - Xem vai trò
- `role_create` - Tạo vai trò
- `role_edit` - Chỉnh sửa vai trò
- `role_delete` - Xóa vai trò

---

## 💻 Sử Dụng Nhanh

### Trong Controller
```javascript
const roleHelper = require('../../helper/roleHelper')

// Kiểm tra quyền
if (roleHelper.checkPermission(userRole, 'product_create')) {
    // Cho phép
}
```

### Trong Route
```javascript
const permMiddleware = require('../../middleware/admin/permission.middleware')

router.post('/product', 
    permMiddleware.requirePermission('product_create'),
    controller.create
)
```

### Trong Template (Pug)
```pug
if roleHelper.checkPermission(role, 'product_delete')
    button.btn-danger Xóa
```

---

## 🔧 Để Thêm Quyền Mới

1. Thêm vào `AVAILABLE_PERMISSIONS` trong `role-controller.js` (hoặc `roleHelper.js`):
```javascript
{
    id: 'dashboard_view',
    name: 'Xem dashboard',
    category: 'Dashboard'
}
```

2. Sử dụng ID quyền này trong kiểm tra và middleware

---

## 🚀 Tiếp Theo Cần Làm

1. **Tích hợp User Model**
   - Thêm `roleId` vào User model
   - Khi login, lưu information vào session

2. **Gán quyền mặc định**
   - Tạo seed script để tạo các vai trò mặc định
   - Gán Admin role có tất cả quyền

3. **Sửa các route khác**
   - Thêm permission middleware vào product routes
   - Thêm permission middleware vào category routes

4. **Cập nhật Views**
   - Ẩn/hiện button dựa trên quyền
   - Show thông báo lỗi khi không có quyền

---

## 📝 Các Route Hiện Có

```
GET    /admin/roles              - Danh sách vai trò
GET    /admin/roles/create       - Form tạo vai trò
POST   /admin/roles/create       - Lưu vai trò mới
GET    /admin/roles/edit/:id     - Form chỉnh sửa
PATCH  /admin/roles/edit/:id     - Lưu chỉnh sửa
DELETE /admin/roles/delete/:id   - Xóa vai trò
GET    /admin/roles/permissions  - Danh sách quyền (JSON)
```

---

## ⚠️ Ghi Chú Quan Trọng

1. Sử dụng **Soft Delete** - vai trò có `deletedAt = null` mới là hoạt động
2. Luôn kiểm tra quyền **cả Frontend và Backend**
3. Thêm `roleId` vào User model để gán quyền cho người dùng
4. Session phải lưu `req.user.roleId` để có thể kiểm tra quyền

---

## 🐛 Debugging

```javascript
// Kiểm tra role hiện tại
console.log('User Role:', req.userRole)
console.log('User Permissions:', req.userRole?.permissions)

// Kiểm tra available permissions
const roleHelper = require('../../helper/roleHelper')
console.log(roleHelper.getAvailablePermissions())
```
