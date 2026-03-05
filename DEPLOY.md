# Deploy lên Vercel

## Bước 1: Push code lên GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git branch -M main
git remote add origin https://github.com/username/repo-name.git
git push -u origin main
```

## Bước 2: Import vào Vercel
1. Truy cập https://vercel.com
2. Đăng nhập bằng GitHub
3. Click "Add New" → "Project"
4. Import repository của bạn

## Bước 3: Cấu hình Environment Variables
Trong Vercel Project Settings → Environment Variables, thêm:

- `PORT` = `3000`
- `MONGOOSE_URL` = (MongoDB connection string của bạn)
- `KEY_BOARD_CAT` = (secret key của bạn)

## Bước 4: Deploy
Click "Deploy" và đợi Vercel build xong.

## ⚠️ Lưu ý quan trọng

### File Upload không hoạt động trên Vercel
Vercel là serverless platform, không lưu file persistent. Nếu cần upload ảnh:

**Giải pháp:**
- Dùng Cloudinary (free tier 25GB)
- Dùng AWS S3
- Dùng Firebase Storage

### MongoDB Atlas Network Access
Đảm bảo MongoDB Atlas cho phép IP của Vercel:
- Vào Atlas → Security → Network Access
- Add IP: `0.0.0.0/0` (Allow from anywhere)

## Kiểm tra sau khi deploy
- Truy cập URL Vercel cung cấp
- Test các route `/`, `/products`, `/admin/products`
- Kiểm tra kết nối MongoDB
