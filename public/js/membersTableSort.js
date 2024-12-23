window.addEventListener('DOMContentLoaded', event => {
    const membersTable = document.getElementById('membersTable');
    if (membersTable) {
        new simpleDatatables.DataTable(membersTable);
    }
});

// ฟังก์ชันสำหรับการเรียงลำดับตาราง
function sortTable(columnIndex) {
    const table = document.querySelector("table tbody");
    const rows = Array.from(table.rows);

    rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].innerText;
        const cellB = b.cells[columnIndex].innerText;

        if (!isNaN(Date.parse(cellA)) && !isNaN(Date.parse(cellB))) {
            return new Date(cellA) - new Date(cellB);
        }

        return cellA.localeCompare(cellB, 'th', { numeric: true });
    });

    rows.forEach(row => table.appendChild(row));
}