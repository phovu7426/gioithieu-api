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

---

# Tài liệu API Thống kê Bài viết

## 1. Lấy thống kê lượt xem theo ngày
*   **Endpoint:** `GET /admin/posts/:id/stats`
*   **Mô tả:** Lấy thống kê lượt xem của một bài viết theo từng ngày trong khoảng thời gian chỉ định.
*   **Path Parameters:**
    *   `id`: ID của bài viết cần xem thống kê.
*   **Query Parameters:**
    *   `start_date` (string, optional): Ngày bắt đầu (định dạng: `YYYY-MM-DD`). Mặc định: 30 ngày trước.
    *   `end_date` (string, optional): Ngày kết thúc (định dạng: `YYYY-MM-DD`). Mặc định: hôm nay.
*   **Ví dụ:** `GET /admin/posts/1/stats?start_date=2024-01-01&end_date=2024-01-31`
*   **Phản hồi:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "post_id": "1",
      "view_date": "2024-01-20",
      "view_count": 150,
      "updated_at": "2024-01-20T23:59:59.000Z"
    },
    {
      "id": "2",
      "post_id": "1",
      "view_date": "2024-01-21",
      "view_count": 203,
      "updated_at": "2024-01-21T23:59:59.000Z"
    }
  ],
  "meta": {}
}
```

### Lưu ý:
- Dữ liệu được sắp xếp theo `view_date` tăng dần (từ cũ đến mới).
- Mỗi bản ghi thể hiện tổng số lượt xem trong một ngày cụ thể.
- FE có thể dùng dữ liệu này để vẽ biểu đồ line chart hoặc bar chart thống kê lượt xem theo thời gian.
- Nếu không truyền `start_date` và `end_date`, hệ thống sẽ tự động lấy thống kê 30 ngày gần nhất.

---

## 2. Lấy thống kê tổng quan hệ thống
*   **Endpoint:** `GET /admin/posts/statistics/overview`
*   **Mô tả:** Lấy các chỉ số thống kê tổng quan của toàn bộ hệ thống bài viết.
*   **Phản hồi:**
```json
{
  "success": true,
  "data": {
    "total_posts": 150,
    "published_posts": 120,
    "draft_posts": 25,
    "scheduled_posts": 5,
    "total_comments": 450,
    "pending_comments": 12,
    "total_views_last_30_days": 15230,
    "top_viewed_posts": [
      {
        "id": "1",
        "name": "Bài viết hot nhất",
        "slug": "bai-viet-hot-nhat",
        "view_count": "2500",
        "published_at": "2024-01-15T10:00:00.000Z"
      },
      {
        "id": "2",
        "name": "Bài viết thứ 2",
        "slug": "bai-viet-thu-2",
        "view_count": "1800",
        "published_at": "2024-01-18T14:30:00.000Z"
      }
    ]
  },
  "meta": {}
}
```

### Các chỉ số thống kê:
- **total_posts:** Tổng số bài viết trong hệ thống (không tính bài đã xóa).
- **published_posts:** Số bài viết đã xuất bản.
- **draft_posts:** Số bài viết nháp.
- **scheduled_posts:** Số bài viết đã lên lịch.
- **total_comments:** Tổng số bình luận.
- **pending_comments:** Số bình luận chờ duyệt (status: hidden).
- **total_views_last_30_days:** Tổng lượt xem trong 30 ngày gần nhất.
- **top_viewed_posts:** Top 10 bài viết có lượt xem cao nhất.

### Lưu ý:
- API này phù hợp để hiển thị trên Dashboard/Trang tổng quan.
- Dữ liệu được tính toán real-time từ database.
- FE có thể dùng để tạo các widget thống kê, biểu đồ tròn (pie chart) cho tỷ lệ bài viết theo trạng thái.
