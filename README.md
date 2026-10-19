# Student Learning Manager

Ứng dụng React Native giúp sinh viên theo dõi môn học, thời khóa biểu, bài tập,
thông tin cá nhân và kết quả học tập. Dữ liệu mẫu được dùng thống nhất giữa các
màn hình; thay đổi trạng thái bài tập và thông tin hồ sơ được giữ trong trạng
thái ứng dụng hiện tại.

## Tính năng

- Điều hướng 5 tab: Tổng quan, Môn học, Lịch học, Bài tập và Cá nhân.
- Mở màn hình chi tiết môn học, buổi học, bài tập và kết quả từ Native Stack.
- Tìm kiếm môn học theo tên; lọc thời khóa biểu theo ngày và bài tập theo trạng thái.
- Cập nhật trạng thái hoàn thành bài tập và chỉnh sửa thông tin liên hệ sinh viên.
- Hiển thị điểm học tập theo môn và điểm trung bình có trọng số tín chỉ.

## Cấu trúc mã nguồn

- `src/data/mockData.ts`: dữ liệu mẫu sinh viên, môn học, lịch và bài tập.
- `src/context/StudentContext.tsx`: trạng thái hồ sơ và bài tập dùng chung.
- `src/components/`: thành phần giao diện tái sử dụng.
- `src/screens/`: màn hình tab và màn hình chi tiết.
- `src/types.ts`: kiểu dữ liệu và tham số điều hướng.

## Chạy ứng dụng

Cài dependencies bằng `npm install`, sau đó khởi động Metro:

```sh
npm start
```

Ở terminal khác, chạy ứng dụng trên Android:

```sh
npm run android
```

Metro và ứng dụng Android mặc định sử dụng cổng `8083`.

Với iOS, cài CocoaPods (`bundle exec pod install`) rồi chạy `npm run ios`.

## Kiểm tra

```sh
npx tsc --noEmit
npm run lint
npm test -- --runInBand
```
