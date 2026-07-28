require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const bcrypt = require('bcrypt');
const db = require('./config/database');
const SALT_ROUNDS = 10;

async function seed() {
  const force = process.argv.includes('--force');
  const conn = db.promise();

  try {
    await conn.beginTransaction();

    if (force) {
      console.log('Dropping existing data...');
      await conn.query('DELETE FROM Applications');
      await conn.query('DELETE FROM Jobs');
      await conn.query('DELETE FROM Candidates');
      await conn.query('DELETE FROM Employers');
      await conn.query('DELETE FROM Users');
      console.log('Existing data cleared.\n');
    }

    // ── Users ──
    console.log('Inserting Users...');
    const adminHash = await bcrypt.hash('admin123', SALT_ROUNDS);
    const empHash = await bcrypt.hash('emp12345', SALT_ROUNDS);
    const candHash = await bcrypt.hash('cand1234', SALT_ROUNDS);

    const [userResult] = await conn.query(
      'INSERT INTO Users (Username, PasswordHash, Role) VALUES ?',
      [[
        ['admin',      adminHash, 'Admin'],
        ['employer1',  empHash,   'Employer'],
        ['employer2',  empHash,   'Employer'],
        ['candidate1', candHash,  'Candidate'],
        ['candidate2', candHash,  'Candidate'],
        ['candidate3', candHash,  'Candidate'],
      ]]
    );
    // userResult.insertId is the first auto-inc ID
    const uid = userResult.insertId; // admin=uid, employer1=uid+1, ...
    const usersInserted = userResult.affectedRows;

    // ── Employers ──
    console.log('Inserting Employers...');
    const [empResult] = await conn.query(
      'INSERT INTO Employers (UserID, CompanyName, Email, Phone, Address) VALUES ?',
      [[
        [uid + 1, 'FPT Software',  'hr@fptsoftware.com',      '02873007300',  '123 Lê Duẩn, Quận 1, TP.HCM'],
        [uid + 2, 'VNG Corporation', 'tuyendung@vng.com.vn',   '02839115588',  'Số 1, đường số 9, KCN Sóng Thần, Dĩ An, Bình Dương'],
      ]]
    );
    const eid = empResult.insertId;
    const employersInserted = empResult.affectedRows;

    // ── Candidates ──
    console.log('Inserting Candidates...');
    const [candResult] = await conn.query(
      'INSERT INTO Candidates (UserID, FullName, Email, Phone, Skills) VALUES ?',
      [[
        [uid + 3, 'Nguyễn Văn An',   'nguyenvanan@gmail.com',   '0909123456', 'Node.js, React, MySQL, Docker'],
        [uid + 4, 'Trần Thị Bích',   'tranthibich@gmail.com',   '0918987654', 'Java, Spring Boot, PostgreSQL, AWS'],
        [uid + 5, 'Lê Hoàng Minh',   'lehoangminh@gmail.com',   '0933777888', 'Python, Django, JavaScript, MongoDB, Redis'],
      ]]
    );
    const cid = candResult.insertId;
    const candidatesInserted = candResult.affectedRows;

    // ── Jobs ──
    console.log('Inserting Jobs...');
    const [jobResult] = await conn.query(
      'INSERT INTO Jobs (JobTitle, Salary, Location, Description, EmployerID) VALUES ?',
      [[
        ['Senior Node.js Developer', 2500, 'TP.HCM',    'Phát triển hệ thống backend sử dụng Node.js, Express, MySQL. Yêu cầu 3 năm kinh nghiệm.',           eid],
        ['React Frontend Developer', 2000, 'Hà Nội',    'Xây dựng giao diện người dùng với React, Tailwind CSS. Yêu cầu 2 năm kinh nghiệm.',                      eid],
        ['Java Backend Developer',   3000, 'Bình Dương', 'Phát triển microservices với Java Spring Boot. Yêu cầu 4 năm kinh nghiệm.',                              eid + 1],
        ['DevOps Engineer',          2800, 'TP.HCM',    'Quản lý CI/CD, Docker, Kubernetes, AWS. Yêu cầu 2 năm kinh nghiệm.',                                      eid + 1],
      ]]
    );
    const jid = jobResult.insertId;
    const jobsInserted = jobResult.affectedRows;

    // ── Applications ──
    console.log('Inserting Applications...');
    await conn.query(
      'INSERT INTO Applications (CandidateID, JobID, ApplyDate, Status) VALUES ?',
      [[
        [cid,     jid,     '2026-07-01 09:00:00', 'Accepted'],
        [cid,     jid + 2, '2026-07-05 10:30:00', 'Pending'],
        [cid + 1, jid + 2, '2026-07-10 14:00:00', 'Reviewed'],
        [cid + 1, jid + 3, '2026-07-12 08:45:00', 'Rejected'],
        [cid + 2, jid + 1, '2026-07-15 16:20:00', 'Pending'],
      ]]
    );
    const applicationsInserted = 5;

    await conn.commit();

    console.log('\n=== SEED COMPLETE ===');
    console.log(`Users:        ${usersInserted} inserted`);
    console.log(`Employers:    ${employersInserted} inserted`);
    console.log(`Candidates:   ${candidatesInserted} inserted`);
    console.log(`Jobs:         ${jobsInserted} inserted`);
    console.log(`Applications: ${applicationsInserted} inserted`);

    process.exit(0);
  } catch (err) {
    await conn.rollback();
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
