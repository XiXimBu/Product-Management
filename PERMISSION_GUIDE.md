# Hướng Dẫn Sử Dụng Hệ Thống Phân Quyền

## Tổng Quan

Hệ thống phân quyền cho phép bạn:
1. Tạo và quản lý các vai trò (roles)
2. Gán quyền (permissions) cho từng vai trò
3. Kiểm tra quyền trước khi thực hiện các hành động
4. Xóa mềm (soft delete) các vai trò

## Các Quyền Có Sẵn

### Sản phẩm (Product)
- `product_view` - Xem danh sách sản phẩm
- `product_create` - Tạo sản phẩm
- `product_edit` - Chỉnh sửa sản phẩm
- `product_delete` - Xóa sản phẩm

### Danh mục (Category)
- `category_view` - Xem danh mục
- `category_create` - Tạo danh mục
- `category_edit` - Chỉnh sửa danh mục
- `category_delete` - Xóa danh mục

### Vai trò (Role)
- `role_view` - Xem vai trò
- `role_create` - Tạo vai trò
- `role_edit` - Chỉnh sửa vai trò
- `role_delete` - Xóa vai trò

## Sử Dụng Trong Controllers

### Kiểm tra quyền của người dùng

```javascript
const roleHelper = require('../../helper/roleHelper')

// Lấy vai trò của người dùng
const userRole = await roleHelper.getRoleById(req.user.roleId)

// Kiểm tra quyền cụ thể
if (roleHelper.checkPermission(userRole, 'product_create')) {
    // Người dùng có quyền tạo sản phẩm
}

// Kiểm tra nếu có bất kỳ quyền nào
if (roleHelper.hasAnyPermission(userRole, ['product_create', 'product_edit'])) {
    // Người dùng có ít nhất một trong các quyền này
}

// Kiểm tra nếu có tất cả quyền
if (roleHelper.hasAllPermissions(userRole, ['product_create', 'product_edit'])) {
    // Người dùng có cả hai quyền
}
```

## Sử Dụng Middleware Cho Tuyến Đường (Routes)

### Middleware Kiểm tra Quyền

```javascript
const permissionMiddleware = require('../../middleware/admin/permission.middleware')

// Kiểm tra một quyền cụ thể
router.post('/products', 
    permissionMiddleware.requirePermission('product_create'),
    productController.create
)

// Kiểm tra nếu có bất kỳ quyền nào
router.get('/reports',
    permissionMiddleware.requireAnyPermission(['product_view', 'category_view']),
    dashboardController.reports
)

// Kiểm tra nếu có tất cả quyền
router.delete('/products/:id',
    permissionMiddleware.requireAllPermissions(['product_view', 'product_delete']),
    productController.delete
)
```

## Sử Dụng Trong Giao Diện (Templates)

### Thêm Middleware Vào Views

Trước tiên, cấu hình trong `index.js`:

```javascript
const roleHelper = require('./helper/roleHelper')
app.locals.roleHelper = roleHelper
```

### Trong Pug Templates

```pug
//- Kiểm tra quyền
- const userRole = { permissions: ['product_view', 'product_edit'] }

if roleHelper.checkPermission(userRole, 'product_delete')
  button.btn.btn-danger Xóa sản phẩm
else
  button.btn.btn-danger(disabled) Xóa sản phẩm

//- Sử dụng trong vòng lặp
each role in roles
  .card
    .card-body
      h5= role.name
      if roleHelper.hasPermissions(role, ['product_create', 'product_edit'], 'any')
        p Có quyền quản lý sản phẩm
```

## Quản Lý Vai Trò

### Tạo Vai Trò

```javascript
const roleHelper = require('../../helper/roleHelper')

const newRole = await roleHelper.createRole({
    name: 'Nhân viên',
    description: 'Nhân viên bán hàng',
    permissions: ['product_view', 'category_view']
})
```

### Cập Nhật Vai Trò

```javascript
const updatedRole = await roleHelper.updateRole(roleId, {
    permissions: ['product_view', 'product_edit', 'category_view']
})
```

### Xóa Vai Trò (Soft Delete)

```javascript
await roleHelper.deleteRole(roleId)
```

### Khôi Phục Vai Trò

```javascript
await roleHelper.restoreRole(roleId)
```

## API Endpoints

### Xem danh sách vai trò
```
GET /admin/roles
```

### Tạo vai trò
```
GET /admin/roles/create  (form)
POST /admin/roles/create
```

### Chỉnh sửa vai trò
```
GET /admin/roles/edit/:id  (form)
PATCH /admin/roles/edit/:id
```

### Xóa vai trò
```
DELETE /admin/roles/delete/:id
```

### Lấy danh sách quyền
```
GET /admin/roles/permissions
```

## Lỗi Thường Gặp và Cách Khắc Phục

### Lỗi: "Cannot PATCH /admin/roles/create"
**Nguyên nhân**: Form create.pug đang sử dụng `?_method=PATCH`
**Khắc phục**: Đã được sửa - form create.pug giờ chỉ dùng POST

### Lỗi: Quyền không được nhận diện
**Nguyên nhân**: Permission ID không chính xác hoặc không tồn tại
**Khắc phục**: Kiểm tra danh sách các permission có sẵn ở trên

### Lỗi: Middleware không được kích hoạt
**Nguyên nhân**: Route chưa được cấu hình với middleware
**Khắc phục**: Thêm middleware vào route definition

## Mở Rộng Hệ Thống

### Thêm Quyền Mới

Chỉnh sửa `AVAILABLE_PERMISSIONS` trong `role-controller.js`:

```javascript
const AVAILABLE_PERMISSIONS = [
    {
        id: 'dashboard_view',
        name: 'Xem dashboard',
        category: 'Dashboard'
    },
    // ... các quyền khác
]
```

Hoặc sử dụng `getAvailablePermissions()` từ `roleHelper.js`

### Gán Quyền Mặc Định Cho Vai Trò

```javascript
const adminRole = await roleHelper.createRole({
    name: 'Quản trị viên',
    description: 'Quản trị viên hệ thống',
    permissions: roleHelper.getAvailablePermissions().map(p => p.id)
})
```

## Best Practices

1. **Luôn kiểm tra quyền trước khi thực hiện hành động quan trọng**
   - Kiểm tra cả ở phía Backend (middleware/controller)
   - Kiểm tra cả ở phía Frontend (ẩn nút, vô hiệu hóa chức năng)

2. **Sử dụng soft delete cho vai trò**
   - Không bao giờ xóa vĩnh viễn (hard delete) vai trò
   - Luôn thêm điều kiện `deletedAt: null` khi query

3. **Ghi log các thay đổi quyền**
   - Ghi lại khi quyền được cấp hoặc thu hồi
   - Ghi lại khi vai trò được xóa

4. **Cập nhật danh sách permissions định kỳ**
   - Thêm quyền mới khi có tính năng mới
   - Xóa quyền cũ không còn sử dụng

## Debugging

### Kiểm tra quyền của người dùng

```javascript
console.log('User Role:', req.userRole)
console.log('Permissions:', req.userRole?.permissions)
```

### Kiểm tra quyền cụ thể

```javascript
const roleHelper = require('../../helper/roleHelper')
console.log('Has permission:', roleHelper.checkPermission(role, 'product_create'))
console.log('Available permissions:', roleHelper.getAvailablePermissions())
```

## Hỗ Trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Vai trò của người dùng có tồn tại không
2. Vai trò có bị xóa (deletedAt khác null) không
3. Quyền có trong danh sách AVAILABLE_PERMISSIONS không
4. Middleware có được áp dụng cho route không
