const db = require('../db');

class MemberModel {
    static getAllActiveUsersAndManagers(callback) {
        const query = `
            SELECT 
                u.u_name,
                s.section,
                u.u_type
            FROM tbl_user u
            LEFT JOIN tbl_emp_section s ON u.id_emp_section = s.id_emp_section
            WHERE u.u_type IN ('user', 'manager') AND u.u_status = 'active'
            ORDER BY u.u_name
        `;
        db.query(query, callback);
    }
}

module.exports = MemberModel;