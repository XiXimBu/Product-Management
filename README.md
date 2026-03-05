# Product Management System

Hệ thống quản lý sản phẩm được xây dựng bằng Node.js, Express và MongoDB. Hỗ trợ CRUD sản phẩm, phân trang, tìm kiếm, lọc trạng thái và upload hình ảnh.

## 🚀 Tính năng

### Trang Admin
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Thay đổi trạng thái sản phẩm (active/inactive)
- ✅ Xóa sản phẩm vào thùng rác
- ✅ Khôi phục sản phẩm từ thùng rác
- ✅ Xóa vĩnh viễn sản phẩm
- ✅ Thay đổi hàng loạt (bulk actions)
- ✅ Upload hình ảnh sản phẩm
- ✅ Tìm kiếm sản phẩm theo tên
- ✅ Lọc theo trạng thái
- ✅ Phân trang
- ✅ Flash messages (thông báo thành công/lỗi)

### Trang Client
- ✅ Hiển thị danh sách sản phẩm
- ✅ Xem chi tiết sản phẩm
- ✅ Hiển thị giá sau giảm
- ✅ Badge giảm giá
- ✅ Responsive design

## 🛠️ Công nghệ sử dụng

**Backend:**
- Node.js
- Express.js 5.2
- MongoDB + Mongoose
- Multer (upload files)
- Method Override (PUT/DELETE)
- Express Session
- Express Flash
- Cookie Parser
- Dotenv

**Frontend:**
- Pug (template engine)
- Bootstrap 4.6
- CSS3
- JavaScript

## 📁 Cấu trúc thư mục

```
Product-Management/
├── config/
│   ├── database.js          # Cấu hình kết nối MongoDB
│   └── system.js            # Cấu hình hệ thống (prefix admin)
├── controller/
│   ├── admin/
│   │   ├── dashboard-controller.js
│   │   └── product-controller.js
│   └── client/
│       ├── home-controller.js
│       └── products-controller.js
├── helper/
│   ├── filterStatus.js      # Helper lọc trạng thái
│   ├── paginationHelper.js  # Helper phân trang
│   ├── searchStatus.js      # Helper tìm kiếm
│   └── storageMulter.js     # Cấu hình Multer upload
├── models/
│   └── product-model.js     # Schema sản phẩm
├── public/
│   ├── admin/
│   │   ├── css/
│   │   └── script/
│   ├── css/
│   ├── images/
│   ├── js/
│   └── uploads/             # Ảnh sản phẩm upload
├── routes/
│   ├── admin/
│   │   ├── dashboard-route.js
│   │   ├── index-route.js
│   │   └── product-route.js
│   └── client/
│       ├── home-route.js
│       ├── index-route.js
│       └── product-route.js
├── validate/
│   └── admin/
│       └── product-validate.js
├── views/
│   ├── admin/
│   │   ├── layouts/
│   │   ├── mixins/
│   │   ├── pages/
│   │   └── partials/
│   └── client/
│       ├── layouts/
│       ├── mixins/
│       ├── pages/
│       └── partials/
├── .env                     # Biến môi trường (không commit)
├── .gitignore
├── index.js                 # Entry point
├── package.json
└── vercel.json              # Config Vercel deployment
```

## 📦 Cài đặt

### Yêu cầu
- Node.js >= 18.x
- MongoDB Atlas account hoặc MongoDB local
- Git

### Các bước cài đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd Product-Management
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Tạo file `.env`**
```bash
PORT=3000
MONGOOSE_URL=mongodb://username:password@host1:27017,host2:27017,host3:27017/Database?ssl=true&replicaSet=xxx&authSource=admin&retryWrites=true&w=majority
KEY_BOARD_CAT=your-secret-key-here
```

4. **Chạy ứng dụng**
```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

5. **Truy cập**
- Client: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/dashboard`

## 🗄️ Database Schema

### Product Model
```javascript
{
  title: String,              // Tên sản phẩm
  description: String,        // Mô tả
  price: Number,             // Giá gốc
  discountPercentage: Number, // % giảm giá
  stock: Number,             // Số lượng tồn kho
  thumbnail: String,         // Đường dẫn ảnh
  status: String,            // 'active' | 'inactive'
  position: Number,          // Vị trí sắp xếp
  deleted: Boolean,          // Đã xóa chưa
  slug: String,              // URL-friendly slug (auto)
  deletedAt: Date,           // Thời gian xóa
  createdAt: Date,           // Ngày tạo (auto)
  updatedAt: Date            // Ngày cập nhật (auto)
}
```

## 🔐 Bảo mật

- ✅ `.env` file được ignore bởi Git
- ✅ MongoDB URI được lưu trong biến môi trường
- ✅ Session secret được lưu trong biến môi trường
- ⚠️ MongoDB Network Access: cho phép `0.0.0.0/0` (chỉ dùng dev/test)

## 🚀 Deploy lên Vercel

1. **Push code lên GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

2. **Import vào Vercel**
- Truy cập https://vercel.com
- Click "Add New" → "Project"
- Import repository

3. **Thêm Environment Variables trong Vercel**
- `MONGOOSE_URL`: MongoDB connection string
- `KEY_BOARD_CAT`: Session secret key

4. **Deploy**

### ⚠️ Lưu ý khi deploy Vercel
- File upload **KHÔNG hoạt động** trên Vercel (serverless)
- Cần dùng cloud storage: Cloudinary, AWS S3, hoặc Firebase Storage
- Hoặc deploy lên Render/Railway (có filesystem)

## 📝 API Routes

### Admin Routes
| Method | Route | Mô tả |
|--------|-------|-------|
| GET | `/admin/products` | Danh sách sản phẩm |
| GET | `/admin/products/create` | Form tạo sản phẩm |
| POST | `/admin/products/create` | Tạo sản phẩm mới |
| GET | `/admin/products/edit/:id` | Form sửa sản phẩm |
| PATCH | `/admin/products/edit/:id` | Cập nhật sản phẩm |
| GET | `/admin/products/detail/:id` | Chi tiết sản phẩm |
| DELETE | `/admin/products/delete/:id` | Xóa vào thùng rác |
| PATCH | `/admin/products/change-status/:status/:id` | Đổi trạng thái |
| PATCH | `/admin/products/change-multi` | Thay đổi hàng loạt |
| GET | `/admin/products/trash` | Thùng rác |
| PATCH | `/admin/products/restore/:id` | Khôi phục sản phẩm |
| DELETE | `/admin/products/delete-permanent/:id` | Xóa vĩnh viễn |

### Client Routes
| Method | Route | Mô tả |
|--------|-------|-------|
| GET | `/` | Trang chủ |
| GET | `/products` | Danh sách sản phẩm |
| GET | `/products/:slug` | Chi tiết sản phẩm |

## 🎨 Features nổi bật

### Pagination Helper
Tự động tính toán phân trang với limit/skip

### Filter Helper
Lọc sản phẩm theo trạng thái (Tất cả, Hoạt động, Không hoạt động)

### Search Helper
Tìm kiếm sản phẩm theo tên (regex, case-insensitive)

### Multer Upload
- Tự động tạo thư mục `public/uploads` nếu chưa có
- Đặt tên file unique với timestamp
- Lưu path vào MongoDB

### Flash Messages
Hiển thị thông báo thành công/lỗi sau mỗi hành động

## 🐛 Troubleshooting

### Lỗi kết nối MongoDB
```
Error: querySrv ECONNREFUSED
```
**Giải pháp:** Đổi từ `mongodb+srv://...` sang `mongodb://host1,host2,host3/...`

### Database rỗng
**Kiểm tra:**
- Database name trong URI có đúng không?
- Collection name có đúng `products` không?
- Network Access có cho phép IP không?

### Upload file không hoạt động
**Kiểm tra:**
- Thư mục `public/uploads` đã tồn tại chưa?
- Form có `enctype="multipart/form-data"` chưa?
- Multer middleware có được add vào route chưa?

## 📄 License

ISC

## 👨‍💻 Author

Hung - Product Management System

---

⭐ **Nếu project hữu ích, hãy cho 1 star!**
