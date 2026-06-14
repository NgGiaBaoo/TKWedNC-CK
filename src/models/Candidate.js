// Candidate Model - CRUD Operations (Ứng Viên)

class Candidate {
  constructor() {
    this.candidates = [];
    this.nextId = 1;
  }

  /**
   * CREATE - Tạo một ứng viên mới
   * @param {Object} candidateData - Dữ liệu ứng viên
   * @returns {Object} Ứng viên vừa được tạo
   */
  create(candidateData) {
    if (!candidateData.name || !candidateData.email) {
      throw new Error('Name and email are required');
    }

    const candidate = {
      id: this.nextId++,
      name: candidateData.name,
      email: candidateData.email,
      phone: candidateData.phone || '',
      address: candidateData.address || '',
      skills: candidateData.skills || [],
      experience: candidateData.experience || 0,
      education: candidateData.education || '',
      resume: candidateData.resume || '',
      status: candidateData.status || 'Active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.candidates.push(candidate);
    console.log(`✓ Created Candidate: ${candidate.name}`);
    return candidate;
  }

  /**
   * READ - Đọc thông tin ứng viên
   * @param {number} id - ID của ứng viên
   * @returns {Object|null} Thông tin ứng viên hoặc null nếu không tìm thấy
   */
  read(id) {
    const candidate = this.candidates.find(c => c.id === id);
    if (!candidate) {
      console.log(`✗ Candidate with ID ${id} not found`);
      return null;
    }
    console.log(`✓ Retrieved Candidate: ${candidate.name}`);
    return candidate;
  }

  /**
   * READ ALL - Đọc tất cả ứng viên
   * @returns {Array} Danh sách tất cả ứng viên
   */
  readAll() {
    console.log(`✓ Retrieved ${this.candidates.length} candidates`);
    return this.candidates;
  }

  /**
   * UPDATE - Cập nhật thông tin ứng viên
   * @param {number} id - ID của ứng viên
   * @param {Object} updateData - Dữ liệu cần cập nhật
   * @returns {Object|null} Ứng viên đã được cập nhật
   */
  update(id, updateData) {
    const candidate = this.candidates.find(c => c.id === id);
    if (!candidate) {
      console.log(`✗ Candidate with ID ${id} not found`);
      return null;
    }

    Object.assign(candidate, updateData, { updatedAt: new Date() });
    console.log(`✓ Updated Candidate: ${candidate.name}`);
    return candidate;
  }

  /**
   * DELETE - Xóa ứng viên
   * @param {number} id - ID của ứng viên
   * @returns {boolean} true nếu xóa thành công, false nếu không tìm thấy
   */
  delete(id) {
    const index = this.candidates.findIndex(c => c.id === id);
    if (index === -1) {
      console.log(`✗ Candidate with ID ${id} not found`);
      return false;
    }

    const deleted = this.candidates.splice(index, 1);
    console.log(`✓ Deleted Candidate: ${deleted[0].name}`);
    return true;
  }

  /**
   * SEARCH - Tìm kiếm ứng viên theo tên
   * @param {string} name - Tên ứng viên
   * @returns {Array} Danh sách ứng viên phù hợp
   */
  searchByName(name) {
    return this.candidates.filter(c => 
      c.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  /**
   * FILTER - Lọc ứng viên theo trạng thái
   * @param {string} status - Trạng thái ứng viên
   * @returns {Array} Danh sách ứng viên theo trạng thái
   */
  filterByStatus(status) {
    return this.candidates.filter(c => c.status === status);
  }

  /**
   * FILTER - Lọc ứng viên theo kỹ năng
   * @param {string} skill - Kỹ năng cần tìm
   * @returns {Array} Danh sách ứng viên có kỹ năng đó
   */
  filterBySkill(skill) {
    return this.candidates.filter(c => 
      c.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    );
  }
}

module.exports = Candidate;
