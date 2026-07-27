# TKWedNC-CK

Hệ thống quản lý tuyển dụng (Job Recruitment Management) - REST API với Node.js (Express 5), MySQL (Aiven).

## Tech Stack

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Node.js** | — | Runtime |
| **Express** | ^5.2.1 | Web framework |
| **mysql2** | ^3.22.5 | MySQL driver với SSL (Aiven) |
| **express-session** | ^1.19.0 | Session-based authentication |
| **bcrypt** | ^6.0.0 | Mã hoá mật khẩu |
| **cookie-parser** | ^1.4.7 | Parse & sign cookies |
| **dotenv** | ^17.4.2 | Biến môi trường |

## Kiến trúc (Layer-based)

Khác với mô hình module-folder thông thường, dự án tổ chức theo **tầng (layer)** — mỗi thư mục là một tầng chứa tất cả module:

```
src/
├── config/
│   └── database.js              // Kết nối MySQL (Aiven, SSL/TLS)
├── controllers/                 // Route handlers (định nghĩa luôn endpoint)
│   ├── auth.js        // POST register, login, logout; GET me
│   ├── employer.js    // CRUD doanh nghiệp
│   ├── job.js         // CRUD tin tuyển dụng
│   ├── application.js // CRUD đơn ứng tuyển
│   ├── candidate.js   // CRUD hồ sơ ứng viên
│   └── user.js        // CRUD tài khoản
├── services/                    // Logic nghiệp vụ
│   ├── auth.js
│   ├── user.js
│   ├── employer.js
│   ├── job.js
│   ├── application.js
│   └── candidate.js
├── models/                      // Truy vấn SQL trực tiếp (callback-based)
│   ├── UserModel.js
│   ├── EmployerModel.js
│   ├── JobModel.js
│   ├── ApplicationModel.js
│   └── CandidateModel.js
├── validators/                  // Validation + normalize dữ liệu đầu vào
│   ├── auth.js         // Login validation
│   ├── user.js         // User registration validation
│   ├── employer.js
│   ├── job.js
│   ├── application.js
│   └── candidate.js
└── middleware/
    └── auth.js                  // requireAuth, requireRole
```

### Luồng xử lý request

```
Client → Express Router → Controller → Validator → Service → Model → MySQL
                                ↓                        ↓
                          Response ← ← ← ← ← ← ← ← ← ← ←
```

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

- **`requireAuth`**: Middleware kiểm tra `req.session.userId` — trả về 401 nếu chưa đăng nhập.
- **`requireRole(...roles)`**: Middleware kiểm tra vai trò (`req.session.role`) — trả về 403 nếu không có quyền.

Tài khoản người dùng được lưu trong bảng `Users` với các vai trò: `Admin`, `Employer`, `Candidate`.

### Luồng đăng nhập

```
POST /auth/login
  → validate username + password
  → authService.login() → UserModel.findUserByUsername() → bcrypt.compare()
  → Lưu userId, username, role vào session
  → Set cookie `connect.sid` (signed)
```

## Cấu hình môi trường (.env)

Tạo file `.env` tại thư mục gốc với các biến sau:

```env
SESSION_KEY=your_session_key_here
COOKIE_SECRET=your_cookie_secret_here
DB_PASSWORD=database-password-here
PORT=3000
```

| Biến | Bắt buộc | Mô tả |
|------|----------|-------|
| `SESSION_KEY` | ✅ | Secret key cho express-session |
| `COOKIE_SECRET` | ✅ | Secret key cho cookie-parser (signed cookies) |
| `DB_PASSWORD` | ✅ | Mật khẩu database Aiven (user: `avnadmin`, db: `JOBRECRUITMENT`) |
| `PORT` | ❌ | Cổng server (mặc định: `3000`) |

> Certificate SSL (`ca.pem`) đã được include sẵn trong project để kết nối Aiven MySQL qua SSL/TLS.

## Schema MySQL

Các bảng hiện có trong database `JOBRECRUITMENT` (Aiven):

| Bảng | Mục đích | Cột chính |
|------|----------|-----------|
| `Users` | Tài khoản đăng nhập | `UserID`, `Username`, `PasswordHash`, `Role` |
| `Employers` | Doanh nghiệp đăng tin | `EmployerID`, `UserID`, `CompanyName`, `Email`, `Phone`, `Address` |
| `Jobs` | Tin tuyển dụng | `JobID`, `JobTitle`, `Salary`, `Location`, `Description`, `EmployerID` |
| `Candidates` | Hồ sơ ứng viên | `CandidateID`, `UserID`, `FullName`, `Email`, `Phone`, `Skills` |
| `Applications` | Đơn ứng tuyển | `ApplicationID`, `CandidateID`, `JobID`, `ApplyDate`, `Status` |

## API Endpoints

> Các endpoint `/employers`, `/jobs`, `/applications`, `/candidates`, `/users` yêu cầu **xác thực** (session cookie).  
> Endpoint `/auth/register` và `/auth/login` là public.

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| `POST` | `/auth/register` | ❌ | Đăng ký tài khoản mới |
| `POST` | `/auth/login` | ❌ | Đăng nhập |
| `POST` | `/auth/logout` | ✅ | Đăng xuất (huỷ session) |
| `GET` | `/auth/me` | ✅ | Lấy thông tin user hiện tại |
| `POST` | `/employers` | ✅ | Tạo doanh nghiệp |
| `GET` | `/employers` | ✅ | Lấy danh sách doanh nghiệp |
| `GET` | `/employers/:id` | ✅ | Lấy doanh nghiệp theo ID |
| `PUT` | `/employers/:id` | ✅ | Cập nhật doanh nghiệp |
| `DELETE` | `/employers/:id` | ✅ | Xoá doanh nghiệp |
| `POST` | `/jobs` | ✅ | Tạo job mới |
| `GET` | `/jobs` | ✅ | Lấy danh sách jobs |
| `GET` | `/jobs/:id` | ✅ | Lấy job theo ID |
| `PUT` | `/jobs/:id` | ✅ | Cập nhật job |
| `DELETE` | `/jobs/:id` | ✅ | Xoá job |
| `POST` | `/applications` | ✅ | Tạo application mới |
| `GET` | `/applications` | ✅ | Lấy danh sách applications |
| `GET` | `/applications/:id` | ✅ | Lấy application theo ID |
| `PUT` | `/applications/:id` | ✅ | Cập nhật application |
| `DELETE` | `/applications/:id` | ✅ | Xoá application |
| `POST` | `/candidates` | ✅ | Tạo candidate mới |
| `GET` | `/candidates` | ✅ | Lấy danh sách candidates |
| `GET` | `/candidates/:id` | ✅ | Lấy candidate theo ID |
| `PUT` | `/candidates/:id` | ✅ | Cập nhật candidate |
| `DELETE` | `/candidates/:id` | ✅ | Xoá candidate |
| `POST` | `/users` | ✅ | Tạo user mới |
| `GET` | `/users` | ✅ | Lấy danh sách users |
| `GET` | `/users/:id` | ✅ | Lấy user theo ID |
| `PUT` | `/users/:id` | ✅ | Cập nhật user |
| `DELETE` | `/users/:id` | ✅ | Xoá user |

> **Lưu ý:** Sau khi đăng nhập thành công, server set session cookie (`connect.sid`). Cookie này được gửi kèm tự động bởi HTTP client.

## Test nhanh bằng Postman / curl

### 1. Đăng ký

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"NGB123","password":"123456","role":"Candidate"}'
```

Phản hồi: `201 Created` — tự động đăng nhập sau khi đăng ký.

### 2. Đăng nhập

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"NGB123","password":"123456"}'
```

Phản hồi: `200 OK` — session cookie được set.

### 3. Tạo doanh nghiệp (yêu cầu auth)

```json
POST /employers
{
    "companyName": "Acme Corp",
    "email": "acme@example.com",
    "phone": "0123456789",
    "address": "HCMC"
}
```

### 4. Tạo job (yêu cầu auth)

```json
POST /jobs
{
    "title": "Backend Developer",
    "employerId": 1,
    "location": "Remote",
    "salary": "2500",
    "description": "Node.js role"
}
```

### 5. Tạo candidate (yêu cầu auth)

```json
POST /candidates
{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "0987654321",
    "skills": "Node.js, MySQL"
}
```

### 6. Tạo application (yêu cầu auth)

```json
POST /applications
{
    "candidateId": 1,
    "jobId": 1,
    "status": "Pending"
}
```

> `status` mặc định là `"Pending"` nếu không truyền.

### Route utility (không yêu cầu auth)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/visits` | Đếm số lần truy cập (demo session) |
| `GET` | `/set-cookie` | Set signed cookie để test |
| `GET` | `/read-cookie` | Đọc cookie + signed cookie |

## Cách chạy

```bash
# 1. Cài dependencies
npm install

# 2. Tạo file .env (xem cấu hình ở trên)
cp .env.example .env
# Sửa DB_PASSWORD, SESSION_KEY, COOKIE_SECRET trong .env

# 3. Khởi động server (development — hot reload)
npm run dev

# Hoặc production
npm start
```

Server chạy tại `http://localhost:3000` (mặc định).
