# Tài liệu API Admin Post Comment

Tài liệu này cung cấp các endpoint dành cho trang quản trị (Admin) để quản lý bình luận của các bài viết.

**Base URL:** `/api/admin/post-comments`
**Yêu cầu:** Token quản trị trong Header `Authorization: Bearer <token>`
**Quyền hạn:** Cần permission `post.manage`.

---

## 1. Lấy danh sách bình luận
*   **Endpoint:** `GET /admin/post-comments`
*   **Query Parameters:**
    *   `page` (number): Trang hiện tại (mặc định: `1`).
    *   `limit` (number): Số bản ghi/trang (mặc định: `10`).
    *   `post_id` (string): Lọc bình luận theo ID bài viết.
    *   `status` (string): `visible` hoặc `hidden`.
    *   `search` (string): Tìm kiếm nội dung bình luận.
    *   `sort` (string): Sắp xếp (mặc định: `created_at:DESC`).
*   **Phản hồi:**
```json
{
  "success": true,
  "data": [
    {
      "id": "100",
      "post_id": "1",
      "user_id": "20",
      "guest_name": null,
      "guest_email": null,
      "parent_id": null,
      "content": "Bình luận này cần được duyệt",
      "status": "visible",
      "created_at": "2024-01-20T11:00:00.000Z",
      "post": {
        "id": "1",
        "name": "Tiêu đề bài viết",
        "slug": "tieu-de-bai-viet"
      },
      "user": {
        "id": "20",
        "name": "Nguyễn Văn A",
        "email": "vana@example.com"
      }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "lastPage": 1
  }
}
```

---

## 2. Cập nhật trạng thái bình luận (Ẩn/Hiện)
*   **Endpoint:** `PATCH /admin/post-comments/:id/status`
*   **Mô tả:** Dùng để duyệt bình luận hoặc ẩn các bình luận vi phạm.
*   **Path Parameters:**
    *   `id`: ID của bình luận.
*   **Body:**
```json
{
  "status": "hidden" // hoặc "visible"
}
```
*   **Phản hồi:** Trả về object bình luận sau khi cập nhật.

---

## 3. Xoá bình luận
*   **Endpoint:** `DELETE /admin/post-comments/:id`
*   **Mô tả:** Xoá mềm bình luận khỏi hệ thống.
*   **Path Parameters:**
    *   `id`: ID của bình luận cần xoá.
*   **Phản hồi:**
```json
{
  "success": true,
  "message": "Deleted",
  "data": null
}
```

---

## Lưu ý cho FE:
1.  **Xử lý ID:** Tất cả các trường ID (`id`, `post_id`, `user_id`) đều trả về dạng `string` để tránh lỗi tràn số BigInt.
2.  **Trạng thái:** Bình luận sẽ có 2 trạng thái chính: `visible` (hiển thị công khai) và `hidden` (chỉ admin thấy).
3.  **Dữ liệu liên quan:** Mỗi bình luận đều đi kèm thông tin cơ bản của `post` (để biết comment đó ở bài nào) và `user` (để biết ai comment). Nếu `user_id` là null, hãy kiểm tra `guest_name` và `guest_email`.
