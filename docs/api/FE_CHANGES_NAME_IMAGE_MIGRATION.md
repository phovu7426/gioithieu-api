# Thay đổi API: Chuyển trường `name` và `image` từ `profiles` sang `users`

## Tổng quan
Trường `name` và `image` đã được chuyển từ bảng `profiles` sang bảng `users` để đơn giản hóa cấu trúc dữ liệu.

## Thay đổi Response Structure

### Trước đây:
```json
{
  "id": 1,
  "username": "user123",
  "email": "user@example.com",
  "profile": {
    "name": "Nguyễn Văn A",
    "image": "/uploads/avatar.jpg",
    "birthday": "1990-01-01",
    "gender": "male",
    "address": "123 Main St",
    "about": "About me"
  }
}
```

### Sau khi thay đổi:
```json
{
  "id": 1,
  "username": "user123",
  "email": "user@example.com",
  "name": "Nguyễn Văn A",        // ← Chuyển từ profile.name
  "image": "/uploads/avatar.jpg", // ← Chuyển từ profile.image
  "profile": {
    "birthday": "1990-01-01",
    "gender": "male",
    "address": "123 Main St",
    "about": "About me"
  }
}
```

## Các API bị ảnh hưởng

### 1. GET `/api/users/me` (Lấy thông tin user hiện tại)
**Response thay đổi:**
- `user.name` thay vì `user.profile.name`
- `user.image` thay vì `user.profile.image`

**Cần sửa:**
```javascript
// Trước
const userName = user.profile?.name;
const userImage = user.profile?.image;

// Sau
const userName = user.name;
const userImage = user.image;
```

### 2. PUT `/api/users/me` (Cập nhật profile)
**Request payload không thay đổi:**
```json
{
  "name": "Nguyễn Văn A",
  "image": "/uploads/avatar.jpg",
  "phone": "0123456789",
  "birthday": "1990-01-01",
  "gender": "male",
  "address": "123 Main St",
  "about": "About me"
}
```

**Response thay đổi:**
- `user.name` thay vì `user.profile.name`
- `user.image` thay vì `user.profile.image`

**Cần sửa:**
```javascript
// Trước
setUserName(user.profile?.name);
setUserImage(user.profile?.image);

// Sau
setUserName(user.name);
setUserImage(user.image);
```

### 3. GET `/api/admin/users` (Danh sách users - Admin)
**Response thay đổi:**
- Mỗi user trong danh sách có `name` và `image` ở root level thay vì trong `profile`

**Cần sửa:**
```javascript
// Trước
users.map(user => ({
  id: user.id,
  name: user.profile?.name,
  image: user.profile?.image,
  email: user.email
}))

// Sau
users.map(user => ({
  id: user.id,
  name: user.name,
  image: user.image,
  email: user.email
}))
```

### 4. GET `/api/admin/users/:id` (Chi tiết user - Admin)
**Response thay đổi:**
- `user.name` thay vì `user.profile.name`
- `user.image` thay vì `user.profile.image`

### 5. POST `/api/admin/users` (Tạo user - Admin)
**Request payload THAY ĐỔI:**
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123",
  "name": "Nguyễn Văn A",              // ← Chuyển ra ngoài profile
  "image": "/uploads/avatar.jpg",      // ← Chuyển ra ngoài profile
  "profile": {
    "birthday": "1990-01-01",
    "gender": "male"
  }
}
```

**Cần sửa:**
```javascript
// Trước
{
  profile: {
    name: "Nguyễn Văn A",
    image: "/uploads/avatar.jpg",
    birthday: "1990-01-01"
  }
}

// Sau
{
  name: "Nguyễn Văn A",        // ← Ra ngoài
  image: "/uploads/avatar.jpg", // ← Ra ngoài
  profile: {
    birthday: "1990-01-01"
  }
}
```

**Response thay đổi:**
- `user.name` thay vì `user.profile.name`
- `user.image` thay vì `user.profile.image`

### 6. PUT `/api/admin/users/:id` (Cập nhật user - Admin)
**Request payload THAY ĐỔI:**
```json
{
  "username": "user123",
  "email": "user@example.com",
  "name": "Nguyễn Văn A",              // ← Chuyển ra ngoài profile
  "image": "/uploads/avatar.jpg",      // ← Chuyển ra ngoài profile
  "profile": {
    "birthday": "1990-01-01"
  }
}
```

**Cần sửa:**
```javascript
// Trước
{
  profile: {
    name: "Nguyễn Văn A",
    image: "/uploads/avatar.jpg",
    birthday: "1990-01-01"
  }
}

// Sau
{
  name: "Nguyễn Văn A",        // ← Ra ngoài
  image: "/uploads/avatar.jpg", // ← Ra ngoài
  profile: {
    birthday: "1990-01-01"
  }
}
```

**Response thay đổi:**
- `user.name` thay vì `user.profile.name`
- `user.image` thay vì `user.profile.image`

### 7. POST `/api/auth/register` (Đăng ký)
**Request payload không thay đổi:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response thay đổi:**
- `user.name` có sẵn ở root level (không cần trong profile)

### 8. GET `/api/auth/me` (Lấy thông tin user sau khi đăng nhập)
**Response thay đổi:**
- `user.name` thay vì `user.profile.name`
- `user.image` thay vì `user.profile.image`

## Checklist cho FE Team

- [ ] Tìm tất cả các nơi sử dụng `user.profile.name` → đổi thành `user.name`
- [ ] Tìm tất cả các nơi sử dụng `user.profile.image` → đổi thành `user.image`
- [ ] Kiểm tra các component hiển thị thông tin user (avatar, name)
- [ ] Kiểm tra các form cập nhật profile
- [ ] Kiểm tra các API call và response handling
- [ ] Test lại các màn hình:
  - [ ] Profile page
  - [ ] User list (Admin)
  - [ ] User detail (Admin)
  - [ ] User create/edit (Admin)
  - [ ] Register page
  - [ ] Login/me page

## Lưu ý

1. **Request payload THAY ĐỔI**: 
   - **Admin APIs** (`POST /api/admin/users`, `PUT /api/admin/users/:id`): Phải gửi `name` và `image` ở root level, KHÔNG gửi trong `profile` nữa
   - **User APIs** (`PUT /api/users/me`): Vẫn gửi `name` và `image` ở root level như cũ (không thay đổi)

2. **Backward compatibility**: Nếu có code cũ vẫn truy cập `user.profile.name` hoặc `user.profile.image`, sẽ trả về `undefined`. Cần update ngay.

3. **Profile object vẫn tồn tại**: Object `profile` vẫn còn trong response, chỉ không có `name` và `image` nữa. Các trường khác như `birthday`, `gender`, `address`, `about` vẫn ở trong `profile`.

4. **Null/undefined handling**: Cần xử lý trường hợp `user.name` hoặc `user.image` có thể là `null` hoặc `undefined`.

## Ví dụ code update

### React/TypeScript
```typescript
// Trước
interface User {
  id: number;
  email: string;
  profile?: {
    name?: string;
    image?: string;
    birthday?: string;
    gender?: string;
  };
}

// Sau
interface User {
  id: number;
  email: string;
  name?: string;      // ← Chuyển lên đây
  image?: string;     // ← Chuyển lên đây
  profile?: {
    birthday?: string;
    gender?: string;
    address?: string;
    about?: string;
  };
}

// Sử dụng
const UserCard = ({ user }: { user: User }) => {
  return (
    <div>
      <img src={user.image || '/default-avatar.jpg'} alt={user.name} />
      <h3>{user.name || 'No name'}</h3>
    </div>
  );
};
```

### Vue.js
```vue
<template>
  <div>
    <img :src="user.image || '/default-avatar.jpg'" :alt="user.name" />
    <h3>{{ user.name || 'No name' }}</h3>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>
```

## Timeline

- **Migration date**: Sau khi backend deploy migration
- **FE update deadline**: Nên update ngay sau khi backend deploy để tránh lỗi hiển thị

## Liên hệ

Nếu có thắc mắc hoặc vấn đề, vui lòng liên hệ backend team.

