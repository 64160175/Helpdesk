const db = require('../db');

class MemberModel {
    static getAllActiveUsersAndManagers(callback) {
        const query = `
            SELECT 
                u.id_user,
                u.u_name,
                s.section,
                u.u_type,
                u.email
            FROM tbl_user u
            LEFT JOIN tbl_emp_section s ON u.id_emp_section = s.id_emp_section
            WHERE u.u_type IN ('user', 'manager') AND u.u_status = 'active'
            ORDER BY u.u_name
        `;
        db.query(query, callback);
    }

    static deactivateUser(userId, callback) {
        const query = 'UPDATE tbl_user SET u_status = ? WHERE id_user = ?';
        db.query(query, ['inactive', userId], callback);
    }

    static getAllSections(callback) {
        const query = 'SELECT id_emp_section, section FROM tbl_emp_section';
        db.query(query, callback);
    }

    static addMember(userData, callback) {
        // ก่อนอื่น เราจะหา id ที่มากที่สุดในตาราง
        const findMaxIdQuery = 'SELECT MAX(id_user) as maxId FROM tbl_user';
        db.query(findMaxIdQuery, (err, result) => {
            if (err) {
                return callback(err);
            }
    
            const maxId = result[0].maxId || 0;
            const newId = maxId + 1;
    
            const insertQuery = `
                INSERT INTO tbl_user 
                (id_user, u_name, u_pass, id_emp_section, u_type, f_name, l_name, email) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [
                newId,
                userData.username,
                userData.password,
                userData.section,
                userData.role,
                userData.f_name || null,
                userData.l_name || null,
                userData.email || null
            ];
            
            db.query(insertQuery, values, (error, results) => {
                if (error) {
                    // ตรวจสอบว่าเป็น error เกี่ยวกับ duplicate entry หรือไม่
                    if (error.code === 'ER_DUP_ENTRY') {
                        return callback(new Error('ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว'));
                    }
                    return callback(error);
                }
                callback(null, results);
            });
        });
    }







    static getAllSections(callback) {
        const query = `
            SELECT 
                id_emp_section,
                section,
                'ใช้งาน' AS status
            FROM tbl_emp_section
            WHERE status = 'active'
            ORDER BY section
        `;
        db.query(query, callback);
    }

}

module.exports = MemberModel;