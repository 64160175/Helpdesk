const MemberModel = require('../models/memberModel');

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

    static addSection(req, res) {
        const { sectionName } = req.body;
        MemberModel.addSection(sectionName, (err, result) => {
            if (err) {
                console.error('Error adding section:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.redirect('/AdminSectionManage');
        });
    }

    static updateSection(req, res) {
        const { id, sectionName, status } = req.body;
        MemberModel.updateSection(id, sectionName, status, (err, result) => {
            if (err) {
                console.error('Error updating section:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.redirect('/AdminSectionManage');
        });
    }

    static deleteSection(req, res) {
        const { id } = req.params;
        MemberModel.deleteSection(id, (err, result) => {
            if (err) {
                console.error('Error deleting section:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.redirect('/AdminSectionManage');
        });
    }
}

module.exports = MemberController;