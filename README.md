# TKWedNC-CK

Hệ thống quản lý tuyển dụng (Job Recruitment Management) - REST API với Node.js, Express và MySQL (Aiven).

## Kiến trúc Module

Mỗi module (Auth, Jobs, Applications, Candidates, Users) đều tuân theo cùng một kiến trúc chuẩn:

```
src/{module}/
├── {module}Module.js       // Đăng ký routes vào app
├── {module}Controller.js   // Xử lý HTTP request/response
├── {module}Service.js      // Logic nghiệp vụ + truy vấn DB
├── {module}Entity.js       // Validation & normalize dữ liệu
└── {module}Middleware.js   // (Auth) Middleware kiểm tra session/quyền
```

### Danh sách Module

| Module | Đường dẫn | Chức năng |
|--------|-----------|-----------|
| Auth | `src/auth/` | Xác thực & phân quyền (register, login, logout) |
| Jobs | `src/jobs/` | Quản lý công việc / tin tuyển dụng |
| Applications | `src/applications/` | Quản lý đơn ứng tuyển |
| Candidates | `src/candidates/` | Quản lý hồ sơ ứng viên |
| Users | `src/user/` | Quản lý tài khoản người dùng |

## Lưu đồ thuật toán CRUD (Flowchart)

```mermaid
flowchart TD
    %% Định nghĩa style cho các loại node
    classDef process fill:#bbdefb,stroke:#1565c0,stroke-width:2px,color:#0d47a1;
    classDef decision fill:#fff9c4,stroke:#f9a825,stroke-width:2px,color:#e65100;
    classDef error fill:#ffcdd2,stroke:#c62828,stroke-width:2px,color:#b71c1c;
    classDef success fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px,color:#1b5e20;
    classDef endpoint fill:#e1bee7,stroke:#6a1b9a,stroke-width:2px,color:#4a148c;

    subgraph TIEP_NHAN["Tiếp nhận Request"]
        START(["Request từ Client"]):::process
        ROUTER["Router match endpoint"]:::process
        CONTROLLER["Controller nhận request"]:::process
    end

    subgraph PHAN_NHANH["Phân nhánh theo HTTP Method"]
        CHK_METHOD{"Kiểm tra HTTP Method"}:::decision

        POST_BRANCH["POST / Tạo mới"]:::endpoint
        PUT_BRANCH["PUT / Cập nhật"]:::endpoint

        VALIDATE{"Validation dữ liệu"}:::decision
        VALID_FAIL["Validation thất bại\n400 Bad Request"]:::error
        VALID_OK["Validation thành công"]:::success

        GET_BRANCH["GET / Đọc dữ liệu"]:::endpoint
        CHK_ID{"Có tham số :id?"}:::decision
        GET_LIST["Lấy danh sách"]:::process
        GET_ONE["Lấy chi tiết"]:::process

        DELETE_BRANCH["DELETE / Xoá"]:::endpoint
    end

    subgraph SERVICE_DB["Xử lý Service & Database"]
        SERVICE["Gọi Service.[method]"]:::process
        DB_QUERY["Thực thi SQL query"]:::process
        DB_ERR["Lỗi SQL\n500 Internal Server Error"]:::error
        DB_OK["Truy vấn thành công"]:::success
    end

    subgraph KET_QUA["Xử lý kết quả"]
        NOT_FOUND["Không tìm thấy bản ghi\n404 Not Found"]:::error
        RETURN_CREATED["Trả về bản ghi mới\n201 Created"]:::success
        RETURN_LIST["Trả về danh sách\n200 OK"]:::success
        RETURN_ONE["Trả về chi tiết\n200 OK"]:::success
        RETURN_UPDATED["Thông báo đã cập nhật\n200 OK"]:::success
        RETURN_DELETED["Thông báo đã xoá\n200 OK"]:::success
    end

    END_RESPONSE(["Response về Client"]):::process

    %% Luồng tiếp nhận request
    START --> ROUTER --> CONTROLLER
    CONTROLLER --> CHK_METHOD

    %% Nhánh POST và PUT -> Validation
    CHK_METHOD --> POST_BRANCH
    CHK_METHOD --> PUT_BRANCH
    POST_BRANCH --> VALIDATE
    PUT_BRANCH --> VALIDATE
    VALIDATE -->|"Dữ liệu không hợp lệ"| VALID_FAIL
    VALIDATE -->|"Dữ liệu hợp lệ"| VALID_OK
    VALID_FAIL --> END_RESPONSE

    %% Nhánh GET -> Kiểm tra ID
    CHK_METHOD --> GET_BRANCH
    GET_BRANCH --> CHK_ID
    CHK_ID -->|"Không có :id"| GET_LIST
    CHK_ID -->|"Có :id"| GET_ONE

    %% Nhánh DELETE -> thẳng Service
    CHK_METHOD --> DELETE_BRANCH

    %% Các nhánh đổ vào Service
    VALID_OK --> SERVICE
    GET_LIST --> SERVICE
    GET_ONE --> SERVICE
    DELETE_BRANCH --> SERVICE

    SERVICE --> DB_QUERY

    DB_QUERY -->|"Lỗi SQL"| DB_ERR
    DB_QUERY -->|"Truy vấn thành công"| DB_OK

    DB_ERR --> END_RESPONSE

    DB_OK -->|"Không tìm thấy bản ghi"| NOT_FOUND
    DB_OK -->|"POST - tạo mới"| RETURN_CREATED
    DB_OK -->|"GET / - lấy danh sách"| RETURN_LIST
    DB_OK -->|"GET /:id - lấy chi tiết"| RETURN_ONE
    DB_OK -->|"PUT /:id - cập nhật"| RETURN_UPDATED
    DB_OK -->|"DELETE /:id - xoá"| RETURN_DELETED

    NOT_FOUND --> END_RESPONSE
    RETURN_CREATED --> END_RESPONSE
    RETURN_LIST --> END_RESPONSE
    RETURN_ONE --> END_RESPONSE
    RETURN_UPDATED --> END_RESPONSE
    RETURN_DELETED --> END_RESPONSE

    subgraph LEGEND["Chú thích"]
        L1["Hình chữ nhật xanh dương: Node xử lý chính"]:::process
        L2["Hình thoi vàng: Node rẽ nhánh / quyết định"]:::decision
        L3["Hình chữ nhật đỏ: Node lỗi / ngoại lệ"]:::error
        L4["Hình chữ nhật xanh lá: Node thành công"]:::success
        L5["Hình chữ nhật tím: Endpoint / HTTP Method"]:::endpoint
    end
```

## Authentication

Hệ thống sử dụng **session-based authentication** với `express-session` và `cookie-parser`.

### API Endpoints

| Method | Endpoint | Mô tả | 
|--------|----------|-------|
| `POST` | `/auth/register` | Đăng ký tài khoản mới |
| `POST` | `/auth/login` | Đăng nhập |
| `POST` | `/auth/logout` | Đăng xuất |
| `GET` | `/auth/me` | Lấy thông tin user hiện tại |
| `POST` | `/jobs` | Tạo job mới |
| `GET` | `/jobs` | Lấy danh sách jobs |
| `GET` | `/jobs/:id` | Lấy job theo ID |
| `PUT` | `/jobs/:id` | Cập nhật job |
| `DELETE` | `/jobs/:id` | Xoá job |
| `POST` | `/applications` | Tạo application mới |
| `GET` | `/applications` | Lấy danh sách applications |
| `GET` | `/applications/:id` | Lấy application theo ID |
| `PUT` | `/applications/:id` | Cập nhật application |
| `DELETE` | `/applications/:id` | Xoá application |
| `POST` | `/candidates` | Tạo candidate mới |
| `GET` | `/candidates` | Lấy danh sách candidates |
| `GET` | `/candidates/:id` | Lấy candidate theo ID |
| `PUT` | `/candidates/:id` | Cập nhật candidate |
| `DELETE` | `/candidates/:id` | Xoá candidate |
| `POST` | `/users` | Tạo user mới |
| `GET` | `/users` | Lấy danh sách users |
| `GET` | `/users/:id` | Lấy user theo ID |
| `PUT` | `/users/:id` | Cập nhật user |
| `DELETE` | `/users/:id` | Xoá user |

> **Lưu ý:** Sau khi đăng ký hoặc đăng nhập thành công, server sẽ set session cookie. Cookie này cần được gửi kèm trong các request tới protected endpoints.

## Cách chạy

```bash
# Cài dependencies
npm install

# Cấu hình database (tạo file .env)
# DB_PASSWORD=your_password_here

# Khởi động server
npm run dev
```
