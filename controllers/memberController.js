const MemberModel = require('../models/memberModel');
const db = require('../db');

class MemberController {
    // แสดงหน้า Home ของผู้ใช้งาน โดยดึงข้อมูลคำสั่งซื้อของผู้ใช้งานที่ล็อกอินอยู่ #อยู่หน้า UserHome
    static getAllMembers(req, res) {
        MemberModel.getAllActiveUsersAndManagers((err, results) => {
            if (err) {
                console.error('Error fetching members:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.render('AdminAllMember', { members: results });
        });
    }

    // แสดงหน้าแก้ไขข้อมูลสมาชิก  #อยู่หน้า AdminEditMember
    static deleteUser(req, res) {
        const userId = req.body.userId;
        MemberModel.deactivateUser(userId, (err, result) => {
            if (err) {
                console.error('Error deactivating user:', err);
                return res.status(500).json({ success: false });
            }
            res.json({ success: true });
        });
    }
    // เพิ่มสมาชิกใหม่ พร้อมส่งข้อมูลไปยัง template #อยู่หน้า AdminAllMember
    static getAddMemberForm(req, res) {
        MemberModel.getAllSections((err, sections) => {
            if (err) {
                console.error('Error fetching sections:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.render('AdminAddMember', { sections: sections });
        });
    }
    // เพิ่มสมาชิกใหม่ลงในระบบ พร้อมบันทึกข้อมูลและเปลี่ยนเส้นทางกลับไปยังหน้า AdminAllMember #อยู่หน้า AdminAddMember
    static addMember(req, res) {
        const userData = req.body;
        MemberModel.addMember(userData, (err, result) => {
            if (err) {
                console.error('Error adding member:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.redirect('/AdminAllMember');
        });
    }

    // ลบข้อมูลแผนก (เปลี่ยนสถานะเป็น inactive) และส่งข้อความแจ้งผลการดำเนินการกลับ #อยู่หน้า AdminAllMember
    static getAdminSectionManage(req, res) {
        MemberModel.getAllSections((err, sections) => {
            if (err) {
                console.error('Error fetching sections:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.render('AdminSectionManage', { sections: sections });
        });
    }

    // แก้ไขข้อมูลแผนก พร้อมส่งข้อมูลไปยัง template #อยู่หน้า AdminSectionManage
    static deleteSection(req, res) {
        const sectionId = req.body.id_emp_section;
        const query = 'UPDATE tbl_emp_section SET status = ? WHERE id_emp_section = ?';
        db.query(query, ['inactive', sectionId], (err, result) => {
            if (err) {
                console.error('Error updating section status:', err);
                return res.status(500).send('Error updating section status');
            }
            res.send('ลบข้อมูลแผนกสำเร็จ');
        });
    }

    // แก้ไขข้อมูลแผนก พร้อมส่งข้อมูลไปยัง template #อยู่หน้า AdminSectionManage
    static updateSection(req, res) {
        const { id_emp_section, sectionName } = req.body;
        MemberModel.updateSection(id_emp_section, sectionName, (err, result) => {
            if (err) {
                console.error('Error updating section:', err);
                return res.status(500).send('Error updating section');
            }
            res.send('อัปเดตข้อมูลแผนกสำเร็จ');
        });
    }

    // เพิ่มข้อมูลแผนกใหม่ พร้อมส่งข้อมูลไปยัง template #อยู่หน้า AdminSectionManage
    static addSection(req, res) {
        const sectionName = req.body.sectionName;
        MemberModel.addSection(sectionName, (err, result) => {
            if (err) {
                console.error('Error adding section:', err);
                return res.status(500).send('Error adding section');
            }
            res.send('เพิ่มข้อมูลแผนกใหม่สำเร็จ');
        });
    }
}

module.exports = MemberController;