Testimonial, Partner, và Certificate hiện tại trong database (`prisma/schema.prisma`) **chưa có trường `slug`**, nên các repository chưa có hàm `findOne` theo slug.

Các bảng này thường là thông tin dạng danh sách (list item) ít khi có trang chi tiết riêng (detail page) nên thiết kế ban đầu có thể đã bỏ qua `slug`.

Bạn có muốn mình **bổ sung field `slug`** vào 3 bảng này trong schema và update code repository/service để hỗ trợ tìm theo slug không?
