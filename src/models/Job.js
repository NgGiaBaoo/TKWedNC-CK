// Job Model - CRUD Operations (Công Việc)

class Job {
  constructor() {
    this.jobs = [];
    this.nextId = 1;
  }

  /**
   * CREATE - Tạo một công việc mới
   * @param {Object} jobData - Dữ liệu công việc
   * @returns {Object} Công việc vừa được tạo
   */
  create(jobData) {
    if (!jobData.title || !jobData.description || !jobData.employerId) {
      throw new Error('Title, description, and employerId are required');
    }

    const job = {
      id: this.nextId++,
      title: jobData.title,
      description: jobData.description,
      employerId: jobData.employerId,
      salary: jobData.salary || 0,
      location: jobData.location || '',
      experience: jobData.experience || '',
      type: jobData.type || 'Full-time',
      skills: jobData.skills || [],
      requirements: jobData.requirements || '',
      benefits: jobData.benefits || '',
      deadline: jobData.deadline || '',
      status: jobData.status || 'Active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.jobs.push(job);
    console.log(`✓ Created Job: ${job.title}`);
    return job;
  }

  /**
   * READ - Đọc thông tin công việc
   * @param {number} id - ID của công việc
   * @returns {Object|null} Thông tin công việc hoặc null nếu không tìm thấy
   */
  read(id) {
    const job = this.jobs.find(j => j.id === id);
    if (!job) {
      console.log(`✗ Job with ID ${id} not found`);
      return null;
    }
    console.log(`✓ Retrieved Job: ${job.title}`);
    return job;
  }

  /**
   * READ ALL - Đọc tất cả công việc
   * @returns {Array} Danh sách tất cả công việc
   */
  readAll() {
    console.log(`✓ Retrieved ${this.jobs.length} jobs`);
    return this.jobs;
  }

  /**
   * UPDATE - Cập nhật thông tin công việc
   * @param {number} id - ID của công việc
   * @param {Object} updateData - Dữ liệu cần cập nhật
   * @returns {Object|null} Công việc đã được cập nhật
   */
  update(id, updateData) {
    const job = this.jobs.find(j => j.id === id);
    if (!job) {
      console.log(`✗ Job with ID ${id} not found`);
      return null;
    }

    Object.assign(job, updateData, { updatedAt: new Date() });
    console.log(`✓ Updated Job: ${job.title}`);
    return job;
  }

  /**
   * DELETE - Xóa công việc
   * @param {number} id - ID của công việc
   * @returns {boolean} true nếu xóa thành công, false nếu không tìm thấy
   */
  delete(id) {
    const index = this.jobs.findIndex(j => j.id === id);
    if (index === -1) {
      console.log(`✗ Job with ID ${id} not found`);
      return false;
    }

    const deleted = this.jobs.splice(index, 1);
    console.log(`✓ Deleted Job: ${deleted[0].title}`);
    return true;
  }

  /**
   * SEARCH - Tìm kiếm công việc theo tiêu đề
   * @param {string} keyword - Từ khóa tìm kiếm
   * @returns {Array} Danh sách công việc phù hợp
   */
  search(keyword) {
    return this.jobs.filter(j => 
      j.title.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /**
   * FILTER - Lọc công việc theo ID nhà tuyển dụng
   * @param {number} employerId - ID của nhà tuyển dụng
   * @returns {Array} Danh sách công việc của nhà tuyển dụng
   */
  filterByEmployer(employerId) {
    return this.jobs.filter(j => j.employerId === employerId);
  }

  /**
   * FILTER - Lọc công việc theo loại (Full-time, Part-time, Contract)
   * @param {string} type - Loại công việc
   * @returns {Array} Danh sách công việc theo loại
   */
  filterByType(type) {
    return this.jobs.filter(j => j.type === type);
  }

  /**
   * FILTER - Lọc công việc theo trạng thái
   * @param {string} status - Trạng thái công việc
   * @returns {Array} Danh sách công việc theo trạng thái
   */
  filterByStatus(status) {
    return this.jobs.filter(j => j.status === status);
  }

  /**
   * FILTER - Lọc công việc theo vị trí
   * @param {string} location - Vị trí công việc
   * @returns {Array} Danh sách công việc theo vị trí
   */
  filterByLocation(location) {
    return this.jobs.filter(j => 
      j.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  /**
   * FILTER - Lọc công việc theo kỹ năng yêu cầu
   * @param {string} skill - Kỹ năng
   * @returns {Array} Danh sách công việc yêu cầu kỹ năng đó
   */
  filterBySkill(skill) {
    return this.jobs.filter(j => 
      j.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    );
  }

  /**
   * FILTER - Lọc công việc theo mức lương
   * @param {number} minSalary - Lương tối thiểu
   * @param {number} maxSalary - Lương tối đa
   * @returns {Array} Danh sách công việc trong khoảng lương
   */
  filterBySalaryRange(minSalary, maxSalary) {
    return this.jobs.filter(j => 
      j.salary >= minSalary && j.salary <= maxSalary
    );
  }
}

module.exports = Job;
