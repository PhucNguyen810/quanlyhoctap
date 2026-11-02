# Student Learning Manager

Ứng dụng React Native theo dõi môn học, thời khóa biểu, bài tập, thông tin sinh viên và kết quả học tập. Dữ liệu được lấy từ REST API; cache và hàng đợi thao tác giúp các màn hình vẫn dùng được khi offline.

## Chạy mock API

Cài dependencies bằng `npm install`, sau đó khởi động json-server:

```sh
npm run mock-api
```

Server chạy tại cổng `3000`, có độ trễ phản hồi giả lập 800 ms. File `db.json` có tối thiểu 5 bản ghi cho mỗi tài nguyên và có thể được chỉnh sửa để kiểm thử.

## Cấu hình địa chỉ API

`src/config.ts` chứa `BASE_URL` và timeout. Giá trị mặc định `http://10.0.2.2:3000` dùng cho Android Emulator. Với iOS Simulator, đổi thành `http://localhost:3000`; với điện thoại thật, đổi thành `http://<IP-LAN-của-máy-tính>:3000` và kết nối cùng Wi-Fi.

## Chạy ứng dụng

Giữ mock API đang chạy, mở terminal khác:

```sh
npm start
```

Ở terminal thứ ba, chạy ứng dụng:

```sh
npm run android
```

Hoặc chạy iOS sau khi cài CocoaPods (`bundle exec pod install`):

```sh
npm run ios
```

## Luồng dữ liệu và offline

```text
Màn hình → AppDataContext / useCachedQuery → Service → Cache (AsyncStorage) / API
                                      ↘ Outbox (AsyncStorage) → đồng bộ tuần tự khi online
```

- Mỗi GET hiển thị cache trước rồi tải bản mới từ API. Khi offline, màn hình giữ dữ liệu cache và hiển thị thời điểm cập nhật.
- Thay đổi trạng thái bài tập, thêm bài tập và sửa hồ sơ được áp dụng ngay. Nếu không có mạng, thao tác được thêm vào outbox và hiện nhãn “Chưa đồng bộ”.
- Khi mạng trở lại, outbox phát lại theo đúng thứ tự thêm; thao tác chỉ bị xóa sau khi thành công. Nếu máy chủ trả lỗi, thao tác lỗi và các thao tác phía sau được giữ lại để thử lại.
- Xung đột hồ sơ được giải quyết bằng `updatedAt`: lúc phát lại thao tác sửa hồ sơ, ứng dụng tải phiên bản máy chủ. Nếu `updatedAt` trên máy chủ mới hơn thời điểm sửa offline, máy chủ được ưu tiên, thao tác trong outbox bị bỏ và người dùng được thông báo; nếu không, bản sửa offline được gửi lên.

## Kiểm tra

```sh
npx tsc --noEmit
npm run lint
npm test -- --runInBand
```

### Kịch bản demo offline

1. Tắt json-server và mở ứng dụng lần đầu: xuất hiện lỗi thân thiện cùng nút thử lại.
2. Mở ứng dụng khi server hoạt động để tạo cache; tắt mạng và khởi động lại để xác nhận dữ liệu cache cùng banner offline.
3. Khi offline, đổi trạng thái hai bài tập, thêm bài tập và sửa hồ sơ; xác nhận các thao tác vẫn hiển thị và có nhãn chờ đồng bộ.
4. Bật mạng, xác nhận hàng đợi được gửi tuần tự và `db.json` được cập nhật.
5. Khi offline sửa hồ sơ; trước khi kết nối lại, cập nhật `students[0].updatedAt` trong `db.json` thành thời điểm mới hơn thao tác offline. Bật mạng và xác nhận dữ liệu server được ưu tiên cùng thông báo xung đột.
6. Tìm môn không tồn tại hoặc chọn học kỳ không có dữ liệu để kiểm tra trạng thái rỗng.
7. Kéo xuống ở các danh sách để tải mới.
