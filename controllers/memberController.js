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
}

module.exports = MemberController;