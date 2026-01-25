# Tài liệu Tích hợp API Thông tin Cá nhân (User Profile)

Tài liệu này cung cấp chi tiết về các endpoint tích hợp cho phép người dùng xem, cập nhật thông tin cá nhân và thay đổi mật khẩu.

## 1. Thông tin chung
- **Base URL**: `{{domain}}/api`
- **Authentication**: Yêu cầu Bearer Token trong header `Authorization`.
  - Header: `Authorization: Bearer <access_token>`

---

## 2. Danh sách API

### 2.1. Lấy thông tin tài khoản hiện tại
Dùng để lấy thông tin chi tiết của người dùng đang đăng nhập.

- **Endpoint**: `/user/profile`
- **Method**: `GET`
- **Authentication**: Có

#### Ví dụ Response (Thành công - 200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "hoangmanh",
    "email": "manh@example.com",
    "phone": "0987654321",
    "status": "active",
    "profile": {
      "name": "Mạnh Hoàng",
      "image": "/uploads/avatars/user-1.jpg",
      "birthday": "1995-01-01",
      "gender": "male",
      "address": "Hà Nội, Việt Nam",
      "about": "Lập trình viên đam mê công nghệ."
    },
    "created_at": "2024-01-20T10:00:00.000Z",
    "updated_at": "2024-01-25T08:00:00.000Z"
  }
}
```

---

### 2.2. Cập nhật thông tin tài khoản
Dùng để thay đổi các thông tin cơ bản của profile.

- **Endpoint**: `/user/profile`
- **Method**: `PATCH`
- **Authentication**: Có
- **Content-Type**: `application/json`

#### Request Body:
| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **`name`** | `string` | Không | Họ và tên hiển thị. |
| **`image`** | `string` | Không | URL ảnh đại diện. |
| **`birthday`** | `string` | Không | Ngày sinh (định dạng YYYY-MM-DD). |
| **`gender`** | `string` | Không | Giới tính (ví dụ: male, female, other). |
| **`address`** | `string` | Không | Địa chỉ liên hệ. |
| **`about`** | `string` | Không | Giới thiệu bản thân. |

**Lưu ý:** Tất cả các trường đều gửi ở cấp độ gốc (flat structure), không cần nhóm vào object `profile`.

#### Ví dụ Request Body:
```json
{
  "name": "Lê Mạnh Hoàng",
  "birthday": "1990-01-15",
  "gender": "male",
  "address": "Hà Nội, Việt Nam",
  "about": "Đã cập nhật giới thiệu mới."
}
```

#### Ví dụ Response (Thành công - 200 OK):
```json
{
  "success": true,
  "message": "Cập nhật thông tin thành công.",
  "data": {
    "id": 1,
    "name": "Lê Mạnh Hoàng",
    "email": "manh@example.com",
    "profile": {
        "birthday": "1990-01-15",
        "gender": "male",
        "address": "Hà Nội, Việt Nam",
        "about": "Đã cập nhật giới thiệu mới."
    }
  }
}
```

---

### 2.3. Đổi mật khẩu
Dùng để người dùng tự thay đổi mật khẩu của mình.

- **Endpoint**: `/user/profile/change-password`
- **Method**: `PATCH`
- **Authentication**: Có
- **Content-Type**: `application/json`

#### Request Body:
| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc |
| :--- | :--- | :--- | :--- |
| **`old_password`** | `string` | **Có** | Mật khẩu hiện tại của người dùng. |
| **`password`** | `string` | **Có** | Mật khẩu mới, tối thiểu 6 ký tự. |
| **`password_confirmation`** | `string` | **Có** | Phải khớp với mật khẩu mới. |

#### Ví dụ Request Body:
```json
{
  "old_password": "currentpassword123",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

#### Các lỗi thường gặp:
- **400 Bad Request**: Mật khẩu cũ không chính xác, hoặc mật khẩu xác nhận không khớp.
- **401 Unauthorized**: Token hết hạn hoặc không hợp lệ.

---

## 3. Mã lỗi (Error Codes) chung
Hệ thống sử dụng các mã lỗi chuẩn HTTP:
- `200`: Thành công.
- `400`: Dữ liệu gửi lên không hợp lệ (Validation Error).
- `401`: Chưa đăng nhập hoặc Token không hợp lệ.
- `403`: Không có quyền truy cập.
- `404`: Không tìm thấy tài nguyên.
- `500`: Lỗi server nội bộ.
