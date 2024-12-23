window.addEventListener('DOMContentLoaded', event => {
    const requestTable = document.getElementById('requestTable');
    if (requestTable) {
        new simpleDatatables.DataTable(requestTable);
    }
});

window.addEventListener('DOMContentLoaded', event => {
    const requestTable1 = document.getElementById('requestTable1');
    if (requestTable1) {
        new simpleDatatables.DataTable(requestTable1);
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