// Employer Model - CRUD Operations (Nhà Tuyển Dụng)

class Employer {
  constructor() {
    this.employers = [];
    this.nextId = 1;
  }

  /**
   * CREATE - Tạo một nhà tuyển dụng mới
   * @param {Object} employerData - Dữ liệu nhà tuyển dụng
   * @returns {Object} Nhà tuyển dụng vừa được tạo
   */
  create(employerData) {
    if (!employerData.name || !employerData.email) {
      throw new Error('Name and email are required');
    }

    const employer = {
      id: this.nextId++,
      name: employerData.name,
      email: employerData.email,
      phone: employerData.phone || '',
      company: employerData.company || '',
      website: employerData.website || '',
      address: employerData.address || '',
      industry: employerData.industry || '',
      size: employerData.size || '',
      description: employerData.description || '',
      status: employerData.status || 'Active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.employers.push(employer);
    console.log(`✓ Created Employer: ${employer.name}`);
    return employer;
  }

  /**
   * READ - Đọc thông tin nhà tuyển dụng
   * @param {number} id - ID của nhà tuyển dụng
   * @returns {Object|null} Thông tin nhà tuyển dụng hoặc null nếu không tìm thấy
   */
  read(id) {
    const employer = this.employers.find(e => e.id === id);
    if (!employer) {
      console.log(`✗ Employer with ID ${id} not found`);
      return null;
    }
    console.log(`✓ Retrieved Employer: ${employer.name}`);
    return employer;
  }

  /**
   * READ ALL - Đọc tất cả nhà tuyển dụng
   * @returns {Array} Danh sách tất cả nhà tuyển dụng
   */
  readAll() {
    console.log(`✓ Retrieved ${this.employers.length} employers`);
    return this.employers;
  }

  /**
   * UPDATE - Cập nhật thông tin nhà tuyển dụng
   * @param {number} id - ID của nhà tuyển dụng
   * @param {Object} updateData - Dữ liệu cần cập nhật
   * @returns {Object|null} Nhà tuyển dụng đã được cập nhật
   */
  update(id, updateData) {
    const employer = this.employers.find(e => e.id === id);
    if (!employer) {
      console.log(`✗ Employer with ID ${id} not found`);
      return null;
    }

    Object.assign(employer, updateData, { updatedAt: new Date() });
    console.log(`✓ Updated Employer: ${employer.name}`);
    return employer;
  }

  /**
   * DELETE - Xóa nhà tuyển dụng
   * @param {number} id - ID của nhà tuyển dụng
   * @returns {boolean} true nếu xóa thành công, false nếu không tìm thấy
   */
  delete(id) {
    const index = this.employers.findIndex(e => e.id === id);
    if (index === -1) {
      console.log(`✗ Employer with ID ${id} not found`);
      return false;
    }

    const deleted = this.employers.splice(index, 1);
    console.log(`✓ Deleted Employer: ${deleted[0].name}`);
    return true;
  }

  /**
   * SEARCH - Tìm kiếm nhà tuyển dụng theo tên công ty
   * @param {string} company - Tên công ty
   * @returns {Array} Danh sách nhà tuyển dụng từ công ty đó
   */
  searchByCompany(company) {
    return this.employers.filter(e => 
      e.company.toLowerCase().includes(company.toLowerCase())
    );
  }

  /**
   * FILTER - Lọc nhà tuyển dụng theo ngành
   * @param {string} industry - Ngành công nghiệp
   * @returns {Array} Danh sách nhà tuyển dụng theo ngành
   */
  filterByIndustry(industry) {
    return this.employers.filter(e => 
      e.industry.toLowerCase().includes(industry.toLowerCase())
    );
  }

  /**
   * FILTER - Lọc nhà tuyển dụng theo trạng thái
   * @param {string} status - Trạng thái nhà tuyển dụng
   * @returns {Array} Danh sách nhà tuyển dụng theo trạng thái
   */
  filterByStatus(status) {
    return this.employers.filter(e => e.status === status);
  }
}

module.exports = Employer;
