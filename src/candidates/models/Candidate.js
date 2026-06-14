class Candidate {
  constructor(id, fullname, email, phone, address, skill, experience, cvUrl) {
    this.id = id;
    this.fullname = fullname;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.skill = skill;
    this.experience = experience;
    this.cvUrl = cvUrl;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

module.exports = Candidate;
