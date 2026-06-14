# TKWedNC-CK - Candidate & Employer CRUD System

## 📋 Mục Tiêu Dự Án (Project Objectives)

Xây dựng hệ thống quản lý Ứng viên (Candidate) và Nhà tuyển dụng (Employer) với đầy đủ các chức năng CRUD cơ bản.

## 🎯 Yêu Cầu Chức Năng (Requirements)

### 1. CANDIDATE (Ứng Viên) - 4 điểm
- **Create (Tạo)** - 1 điểm: Tạo hồ sơ ứng viên mới với các thông tin: tên, email, số điện thoại, địa chỉ, kỹ năng, kinh nghiệm, học vấn
- **Read (Đọc)** - 1 điểm: Lấy thông tin chi tiết một ứng viên hoặc danh sách tất cả ứng viên
- **Update (Cập nhật)** - 1 điểm: Cập nhật thông tin ứng viên và timestamp
- **Delete (Xóa)** - 1 điểm: Xóa ứng viên khỏi hệ thống

### 2. EMPLOYER (Nhà Tuyển Dụng) - 4 điểm
- **Create (Tạo)** - 1 điểm: Tạo tài khoản nhà tuyển dụng mới với các thông tin: tên, email, số điện thoại, công ty, website, ngành, quy mô
- **Read (Đọc)** - 1 điểm: Lấy thông tin chi tiết nhà tuyển dụng hoặc danh sách tất cả
- **Update (Cập nhật)** - 1 điểm: Cập nhật thông tin nhà tuyển dụng
- **Delete (Xóa)** - 1 điểm: Xóa nhà tuyển dụng khỏi hệ thống

### 3. JOB (Công Việc) - 4 điểm
- **Create (Tạo)** - 1 điểm: Tạo bài đăng công việc mới với các thông tin: tiêu đề, mô tả, nhà tuyển dụng, mức lương, vị trí, loại công việc, kỹ năng yêu cầu
- **Read (Đọc)** - 1 điểm: Lấy thông tin chi tiết công việc hoặc danh sách tất cả công việc
- **Update (Cập nhật)** - 1 điểm: Cập nhật thông tin công việc
- **Delete (Xóa)** - 1 điểm: Xóa bài đăng công việc

### 4. Activity Diagram - 2 điểm
- Vẽ lưu đồ thuật toán (Activity Diagram) mô tả quy trình CRUD của cả ba đối tượng
- File: `/diagrams/CRUD_Activity_Diagram.puml`

## 📁 Cấu Trúc Dự Án (Project Structure)

```
TKWedNC-CK/
├── src/
│   ├── models/
│   │   ├── Candidate.js          # Model Ứng viên (CRUD)
│   │   ├── Employer.js           # Model Nhà tuyển dụng (CRUD)
│   │   └── Job.js                # Model Công việc (CRUD)
│   └── controllers/              # Controllers (tùy chọn)
├── test/
│   └── crud.test.js              # File test CRUD operations
├── diagrams/
│   └── CRUD_Activity_Diagram.puml # Activity Diagram (PlantUML)
└── README.md                       # Tài liệu dự án

```

## 🚀 Hướng Dẫn Sử Dụng (Usage Guide)

### Installation
```bash
# Không cần cài đặt dependencies phức tạp
# Các file JavaScript có thể chạy trực tiếp trên Node.js
node test/crud.test.js
```

### Candidate Model Example
```javascript
const Candidate = require('./src/models/Candidate');

const candidateDB = new Candidate();

// CREATE - Tạo ứng viên mới
const newCandidate = candidateDB.create({
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@email.com',
  phone: '0901234567',
  skills: ['JavaScript', 'React'],
  experience: 3
});

// READ - Lấy thông tin ứng viên
const candidate = candidateDB.read(1);

// READ ALL - Lấy tất cả ứng viên
const allCandidates = candidateDB.readAll();

// UPDATE - Cập nhật ứng viên
candidateDB.update(1, { phone: '0909999999', experience: 4 });

// DELETE - Xóa ứng viên
candidateDB.delete(1);

// SEARCH - Tìm kiếm theo tên
const results = candidateDB.searchByName('Nguyễn');

// FILTER - Lọc theo kỹ năng
const jsDevs = candidateDB.filterBySkill('JavaScript');
```

### Employer Model Example
```javascript
const Employer = require('./src/models/Employer');

const employerDB = new Employer();

// CREATE - Tạo nhà tuyển dụng mới
const newEmployer = employerDB.create({
  name: 'Lê Minh Tuan',
  email: 'leeminhtuan@techcorp.com',
  company: 'Tech Corporation',
  industry: 'Information Technology'
});

// READ - Lấy thông tin nhà tuyển dụng
const employer = employerDB.read(1);

// READ ALL - Lấy tất cả nhà tuyển dụng
const allEmployers = employerDB.readAll();

// UPDATE - Cập nhật nhà tuyển dụng
employerDB.update(1, { phone: '0987654321', size: '1000+ employees' });

// DELETE - Xóa nhà tuyển dụng
employerDB.delete(1);

// SEARCH - Tìm kiếm theo tên công ty
const techCompanies = employerDB.searchByCompany('Tech');

// FILTER - Lọc theo ngành
const itEmployers = employerDB.filterByIndustry('Information Technology');
```

### Job Model Example
```javascript
const Job = require('./src/models/Job');

const jobDB = new Job();

// CREATE - Tạo công việc mới
const newJob = jobDB.create({
  title: 'Senior JavaScript Developer',
  description: 'Looking for a senior developer with 5+ years experience',
  employerId: 1,
  salary: 1500,
  location: 'TP. Hồ Chí Minh',
  skills: ['JavaScript', 'React', 'Node.js'],
  type: 'Full-time'
});

// READ - Lấy thông tin công việc
const job = jobDB.read(1);

// READ ALL - Lấy tất cả công việc
const allJobs = jobDB.readAll();

// UPDATE - Cập nhật công việc
jobDB.update(1, { salary: 1800, status: 'Closed' });

// DELETE - Xóa công việc
jobDB.delete(1);

// SEARCH - Tìm kiếm theo tiêu đề
const devJobs = jobDB.search('Developer');

// FILTER - Lọc theo nhà tuyển dụng
const employer1Jobs = jobDB.filterByEmployer(1);

// FILTER - Lọc theo loại công việc
const fullTimeJobs = jobDB.filterByType('Full-time');

// FILTER - Lọc theo vị trí
const hcmJobs = jobDB.filterByLocation('TP. Hồ Chí Minh');

// FILTER - Lọc theo kỹ năng
const jsJobs = jobDB.filterBySkill('JavaScript');

// FILTER - Lọc theo mức lương
const mediumSalaryJobs = jobDB.filterBySalaryRange(1000, 1500);
```

## 📊 Entities Schema

### Candidate Entity
| Field | Type | Description |
|-------|------|-------------|
| id | Number | Unique identifier |
| name | String | Tên ứng viên |
| email | String | Email liên hệ |
| phone | String | Số điện thoại |
| address | String | Địa chỉ |
| skills | Array | Mảng kỹ năng |
| experience | Number | Năm kinh nghiệm |
| education | String | Học vấn |
| resume | String | CV |
| status | String | Trạng thái (Active/Inactive) |
| createdAt | Date | Thời gian tạo |
| updatedAt | Date | Thời gian cập nhật |

### Employer Entity
| Field | Type | Description |
|-------|------|-------------|
| id | Number | Unique identifier |
| name | String | Tên nhà tuyển dụng |
| email | String | Email liên hệ |
| phone | String | Số điện thoại |
| company | String | Tên công ty |
| website | String | Website công ty |
| address | String | Địa chỉ |
| industry | String | Ngành công nghiệp |
| size | String | Quy mô công ty |
| description | String | Mô tả công ty |
| status | String | Trạng thái (Active/Inactive) |
| createdAt | Date | Thời gian tạo |
| updatedAt | Date | Thời gian cập nhật |

### Job Entity
| Field | Type | Description |
|-------|------|-------------|
| id | Number | Unique identifier |
| title | String | Tiêu đề công việc |
| description | String | Mô tả công việc |
| employerId | Number | ID nhà tuyển dụng |
| salary | Number | Mức lương |
| location | String | Vị trí công việc |
| experience | String | Yêu cầu kinh nghiệm |
| type | String | Loại công việc (Full-time/Part-time/Internship) |
| skills | Array | Mảng kỹ năng yêu cầu |
| requirements | String | Yêu cầu chi tiết |
| benefits | String | Phúc lợi công việc |
| deadline | String | Hạn chót ứng tuyển |
| status | String | Trạng thái (Active/Closed) |
| createdAt | Date | Thời gian tạo |
| updatedAt | Date | Thời gian cập nhật |

## ✅ Các Chức Năng Hỗ Trợ (Additional Features)

### Candidate
- `searchByName(name)` - Tìm kiếm theo tên
- `filterByStatus(status)` - Lọc theo trạng thái
- `filterBySkill(skill)` - Lọc theo kỹ năng

### Employer
- `searchByCompany(company)` - Tìm kiếm theo tên công ty
- `filterByIndustry(industry)` - Lọc theo ngành
- `filterByStatus(status)` - Lọc theo trạng thái

### Job
- `search(keyword)` - Tìm kiếm theo tiêu đề
- `filterByEmployer(employerId)` - Lọc theo nhà tuyển dụng
- `filterByType(type)` - Lọc theo loại công việc
- `filterByStatus(status)` - Lọc theo trạng thái
- `filterByLocation(location)` - Lọc theo vị trí
- `filterBySkill(skill)` - Lọc theo kỹ năng yêu cầu
- `filterBySalaryRange(minSalary, maxSalary)` - Lọc theo mức lương

## 📈 Điểm Số (Scoring)

| Mục | Điểm |
|-----|------|
| Candidate CRUD | 4 |
| Employer CRUD | 4 |
| Job CRUD | 4 |
| Activity Diagram | 2 |
| **Tổng** | **14** |

## 🔗 Tài Liệu (Documentation)

- **Activity Diagram**: `/diagrams/CRUD_Activity_Diagram.puml` (PlantUML format)
- **Models**: `/src/models/`
- **Test Cases**: `/test/crud.test.js`

## 👥 Nhóm Sinh Viên (Group Information)

This project is a classroom assignment for a group of students learning CRUD operations and system design.

## 📝 Ghi Chú (Notes)

- Tất cả các chức năng CRUD đều có validate dữ liệu
- Hỗ trợ tìm kiếm và lọc dữ liệu
- Có timestamp cho mỗi bản ghi
- Logging console cho mỗi hoạt động