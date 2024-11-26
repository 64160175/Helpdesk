const MemberModel = require('../models/memberModel');
const db = require('../db'); 

class MemberController {
    static getAllMembers(req, res) {
        MemberModel.getAllActiveUsersAndManagers((err, results) => {
            if (err) {
                console.error('Error fetching members:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.render('AdminAllMember', { members: results });
        });
    }

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

    static getAddMemberForm(req, res) {
        MemberModel.getAllSections((err, sections) => {
            if (err) {
                console.error('Error fetching sections:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.render('AdminAddMember', { sections: sections });
        });
    }

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

    static getAdminSectionManage(req, res) {
        MemberModel.getAllSections((err, sections) => {
            if (err) {
                console.error('Error fetching sections:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.render('AdminSectionManage', { sections: sections });
        });
    }

    //เปลี่ยนเป็นอัปเดตข้อมูล DB สำหรับการลบแผนกในนี้แทน
    static deleteSection(req, res) {
        const sectionId = req.body.id_emp_section;
        const query = 'UPDATE tbl_emp_section SET status = ? WHERE id_emp_section = ?';
        db.query(query, ['inactive', sectionId], (err, result) => {
            if (err) {
                console.error('Error updating section status:', err);
                return res.status(500).send('Error updating section status');
            }
            res.send('Section status updated to inactive');
        });
    }

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

    static addSection(req, res) {
        const sectionName = req.body.sectionName;
        MemberModel.addSection(sectionName, (err, result) => {
            if (err) {
                console.error('Error adding section:', err);
                return res.status(500).send('Error adding section');
            }
            res.send('Section added successfully');
        });
    }
}

module.exports = MemberController;