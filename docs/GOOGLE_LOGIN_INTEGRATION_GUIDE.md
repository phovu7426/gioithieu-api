# Hướng dẫn Tích hợp Google Login (Frontend Integration Guide)

Tài liệu này hướng dẫn đội Frontend tích hợp tính năng Đăng nhập bằng Google thông qua Backend API.

## 1. Tổng quan Flow

Hệ thống sử dụng cơ chế **Server-Side Authorization Code Flow**.
Frontend **không** sử dụng Google SDK để lấy token trực tiếp. Thay vào đó, Frontend sẽ chuyển hướng người dùng đến Backend để thực hiện quy trình đăng nhập.

**Luồng dữ liệu:**
1. User click "Login with Google" trên Frontend.
2. Frontend chuyển hướng (redirect) browser đến Endpoint của Backend.
3. Backend chuyển hướng user sang trang đăng nhập của Google.
4. User đăng nhập thành công, Google redirect về Backend (`/api/auth/google/callback`).
5. Backend xử lý, tạo JWT Token.
6. Backend chuyển hướng (redirect) ngược lại về **Frontend** kèm theo Token trên URL.

## 2. Các bước tích hợp

### Bước 1: Redirect User
Khi người dùng bấm nút "Đăng nhập bằng Google", Frontend thực hiện chuyển hướng toàn bộ trang (full page redirect) tới URL sau:

```
[API_URL]/api/auth/google
```

Ví dụ nếu API chạy local: `http://localhost:8000/api/auth/google`

### Bước 2: Xử lý Callback ở Frontend
Frontend cần chuẩn bị một Route (Page) để đón user quay lại sau khi đăng nhập thành công.
Ví dụ: `http://localhost:3000/auth/google/callback`

(Lưu ý: URL này cần được cấu hình trong Backend qua biến môi trường `GOOGLE_FRONTEND_URL`. Hãy báo cho Backend biết URL chính xác mà Frontend muốn sử dụng).

Backend sẽ redirect về URL này với các query params sau:

- **token**: Access Token (JWT) dùng để gọi các API khác.
- **refreshToken**: Token dùng để lấy Access Token mới khi hết hạn.
- **expiresIn**: Thời gian hết hạn của Access Token (giây).

**Ví dụ URL trả về:**
```
http://localhost:3000/auth/google/callback?token=eyJhbG...&refreshToken=def56...&expiresIn=3600
```

### Bước 3: Lưu Token & Điều hướng
Tại trang Callback của Frontend:
1. Lấy thông tin từ URL Query Params.
2. Lưu `token` và `refreshToken` vào Storage (LocalStorage hoặc Cookies).
3. Chuyển hướng user về trang chủ hoặc trang Dashboard.

**Code mẫu (React/Next.js):**

```javascript
// useEffect tại trang /auth/google/callback
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const refreshToken = params.get('refreshToken');

  if (token) {
    // 1. Lưu token
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);

    // 2. Cập nhật state Authentication Context (nếu có)
    authContext.login(token);

    // 3. Redirect user vào app
    router.push('/dashboard');
  } else {
    // Xử lý lỗi
    router.push('/login?error=google_failed');
  }
}, []);
```

## 3. Xử lý Lỗi
Nếu đăng nhập thất bại, Backend sẽ redirect về Frontend kèm query param error:
`[FRONTEND_URL]/login?error=auth_failed`

Frontend có thể hiển thị thông báo lỗi dựa trên param này.

## 4. Cấu hình Backend (Dành cho Dev Backend)
Để flow này hoạt động, Backend cần cấu hình biến môi trường `GOOGLE_FRONTEND_URL` trỏ về domain của Frontend.

```env
# .env file của Backend
GOOGLE_FRONTEND_URL=http://localhost:3000
# hoặc production
# GOOGLE_FRONTEND_URL=https://my-app.com
```

---
**Tóm tắt cho FE:**
1. Link nút Google Login tới: `[API_BASE]/auth/google`
2. Tạo trang đón: `/auth/google/callback` (hoặc báo route khác để BE config)
3. Parse token từ URL và lưu lại.
