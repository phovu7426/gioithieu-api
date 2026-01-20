# Tài liệu API Public Post

Tài liệu này cung cấp các endpoint công khai (public) dành cho Frontend để tích hợp các tính năng liên quan đến bài viết, danh mục, thẻ và bình luận.

**Base URL:** `/api`

---

## 1. Bài viết (Posts)

### 1.1. Lấy danh sách bài viết
*   **Endpoint:** `GET /public/posts`
*   **Mô tả:** Lấy danh sách các bài viết đã được xuất bản (`status: published`).
*   **Query Parameters:** (như trên)
*   **Response Example:**
```json
{
  "data": [
    {
      "id": "1",
      "name": "Hướng dẫn sử dụng API",
      "slug": "huong-dan-su-dung-api",
      "excerpt": "Tóm tắt ngắn gọn về nội dung bài viết hướng dẫn...",
      "image": "/uploads/posts/thumb.jpg",
      "cover_image": "/uploads/posts/cover.jpg",
      "published_at": "2024-01-20T10:00:00Z",
      "view_count": "1250",
      "created_at": "2024-01-20T08:00:00Z",
      "primary_category": {
        "id": "5",
        "name": "Công nghệ",
        "slug": "cong-nghe",
        "description": "Tin tức công nghệ mới nhất"
      },
      "categories": [
        { "id": "5", "name": "Công nghệ", "slug": "cong-nghe" }
      ],
      "tags": [
        { "id": "10", "name": "API", "slug": "api" },
        { "id": "11", "name": "Tutorial", "slug": "tutorial" }
      ]
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "lastPage": 5
  }
}
```

### 1.2. Lấy danh sách bài viết nổi bật
*   **Endpoint:** `GET /public/posts/featured`
*   **Response Example:** Tương tự mảng `data` của API lấy danh sách bài viết.

### 1.3. Lấy chi tiết bài viết theo Slug
*   **Endpoint:** `GET /public/posts/:slug`
*   **Response Example:**
```json
{
  "id": "1",
  "name": "Hướng dẫn sử dụng API",
  "slug": "huong-dan-su-dung-api",
  "excerpt": "Tóm tắt ngắn gọn...",
  "content": "<h1>Nội dung chi tiết bài viết</h1><p>Đây là nội dung đầy đủ...</p>",
  "image": "/uploads/posts/thumb.jpg",
  "cover_image": "/uploads/posts/cover.jpg",
  "published_at": "2024-01-20T10:00:00.000Z",
  "view_count": "1250",
  "created_at": "2024-01-20T08:00:00.000Z",
  "primary_category": {
    "id": "5",
    "name": "Công nghệ",
    "slug": "cong-nghe"
  },
  "categories": [...],
  "tags": [...]
}
```

---

## 2. Danh mục & Thẻ (Categories & Tags)

### 2.1. Danh sách danh mục
*   **Endpoint:** `GET /public/post-categories`
*   **Response Example:**
```json
{
  "data": [
    {
      "id": "5",
      "name": "Công nghệ",
      "slug": "cong-nghe",
      "description": "Tin tức công nghệ",
      "status": "active"
    }
  ],
  "meta": { ... }
}
```

### 2.2. Danh sách thẻ
*   **Endpoint:** `GET /public/post-tags`
*   **Response Example:** Tương tự danh sách danh mục.

---

## 3. Bình luận (Comments)

### 3.1. Lấy danh sách bình luận của bài viết
*   **Endpoint:** `GET /public/posts/:postId/comments`
*   **Response Example:**
```json
{
  "data": [
    {
      "id": "100",
      "post_id": "1",
      "user_id": "20",
      "content": "Bài viết rất hay!",
      "status": "visible",
      "created_at": "2024-01-20T11:00:00.000Z",
      "user": {
        "id": "20",
        "name": "Nguyễn Văn A",
        "image": "/uploads/avatars/user-a.png"
      },
      "replies": [
        {
          "id": "101",
          "parent_id": "100",
          "content": "Cảm ơn bạn đã quan tâm",
          "user": { "id": "1", "name": "Admin", "image": null },
          "replies": []
        }
      ]
    }
  ],
  "meta": { ... }
}
```

### 3.2. Tạo bình luận mới
*   **Endpoint:** `POST /public/posts/:postId/comments`
*   **Response Example:** (Trả về object bình luận vừa tạo bao gồm thông tin user).

---

## 4. Cấu trúc dữ liệu phản hồi chung

- **ID & BigInt:** Tất cả các trường ID (`id`, `post_id`, `user_id`, `parent_id`) và `view_count` được trả về dưới dạng `string` để tránh lỗi tràn số (overflow) trên trình duyệt/FE.
- **Trạng thái:** Chỉ những bản ghi có trạng thái hợp lệ (`published` cho bài viết, `visible` cho bình luận, `active` cho danh mục/thẻ) mới được hiển thị.
- **Phân trang:** Trả về đầy đủ thông tin `meta` để FE xử lý UI phân trang.
