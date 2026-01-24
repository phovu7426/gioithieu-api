# Tài liệu Tích hợp Public Contact API

Tài liệu này mô tả chi tiết API liên hệ dành cho phía Frontend (FE) tích hợp vào trang public.

## Thông tin Endpoint

*   **URL**: `/public/contacts`
*   **Method**: `POST`
*   **Content-Type**: `application/json`
*   **Mô tả**: Sử dụng để gửi thông tin liên hệ hoặc phản hồi từ khách vãng lai (public users).

## Chi tiết Request Body

Dưới đây là danh sách các trường dữ liệu cần gửi trong body của request:

| Tên trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc (Validation) | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| **`name`** | `string` | **Có** | - Không được để trống<br>- Độ dài tối đa: 255 ký tự | Họ và tên của người liên hệ. |
| **`email`** | `string` | **Có** | - Không được để trống<br>- Phải đúng định dạng email<br>- Độ dài tối đa: 255 ký tự | Địa chỉ email để phản hồi. |
| **`message`** | `string` | **Có** | - Không được để trống | Nội dung chi tiết của lời nhắn/liên hệ. |
| `phone` | `string` | Không | - Độ dài tối đa: 20 ký tự | Số điện thoại liên hệ (tùy chọn). |
| `subject` | `string` | Không | - Độ dài tối đa: 255 ký tự | Tiêu đề của liên hệ (tùy chọn). |

## Ví dụ Request

```json
{
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "phone": "0901234567",
  "subject": "Cần tư vấn dịch vụ",
  "message": "Xin chào, tôi muốn hỏi thêm thông tin về gói dịch vụ X..."
}
```

## Các phản hồi (Response) thường gặp

### 1. Thành công (201 Created)
Server đã ghi nhận liên hệ thành công.
*Response Body (Ví dụ):*
```json
{
  "id": "cm1...",
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "subject": "Cần tư vấn dịch vụ",
  "message": "Xin chào...",
  "phone": "0901234567",
  "status": "new",
  "createdAt": "2024-05-20T10:00:00.000Z"
}
```

### 2. Lỗi dữ liệu (400 Bad Request)
Dữ liệu gửi lên không thỏa mãn các điều kiện validate (ví dụ: thiếu tên, email sai định dạng...).
*Response Body (Ví dụ):*
```json
{
  "message": [
    "email must be an email",
    "name should not be empty"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```
