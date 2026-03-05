// Team Page - Skill Matrix Data and Interactions

document.addEventListener('DOMContentLoaded', function() {
    // Team data from PDF
    const teamData = [
        { name: 'Prateek Dahiya', exp: '10+', certified: true, ontology: 5, workshop: 5, pipeline: 5, coderepos: 5, typescript: 5, aip: 5, dataInteg: 5, overall: 5.0 },
        { name: 'Surya GK', exp: '5+', certified: true, ontology: 5, workshop: 5, pipeline: 5, coderepos: 5, typescript: 5, aip: 5, dataInteg: 5, overall: 5.0 },
        { name: 'Sai Raghav', exp: '4+', certified: true, ontology: 5, workshop: 5, pipeline: 5, coderepos: 5, typescript: 5, aip: 5, dataInteg: 5, overall: 5.0 },
        { name: 'Denis Ovseyenko', exp: '15', certified: true, ontology: 5, workshop: 4, pipeline: 5, coderepos: 5, typescript: 5, aip: 4, dataInteg: 5, overall: 4.8 },
        { name: 'Abhishek Sharma', exp: '2', certified: true, ontology: 4, workshop: 4, pipeline: 4.5, coderepos: 3, typescript: 4, aip: 3.5, dataInteg: 4, overall: 3.86 },
        { name: 'Kuldeep Malviya', exp: '3.5', certified: true, ontology: 4, workshop: 3.5, pipeline: 4, coderepos: 3.5, typescript: 3.5, aip: 4, dataInteg: 4, overall: 3.79 },
        { name: 'Abhishek Chandrashekar', exp: '5', certified: true, ontology: 4.5, workshop: 4, pipeline: 4, coderepos: 3, typescript: 3.5, aip: 3, dataInteg: 4, overall: 3.71 },
        { name: 'Koushik Mashatti', exp: '4', certified: true, ontology: 4, workshop: 4.5, pipeline: 4.5, coderepos: 3, typescript: 3, aip: 3.5, dataInteg: 3.5, overall: 3.71 },
        { name: 'Arun Balhara', exp: '5', certified: true, ontology: 4.5, workshop: 4.5, pipeline: 4, coderepos: 3, typescript: 2.5, aip: 3.5, dataInteg: 4, overall: 3.71 },
        { name: 'Shivam Balki', exp: '4', certified: true, ontology: 4, workshop: 3.5, pipeline: 4, coderepos: 4, typescript: 3.5, aip: 3, dataInteg: 4, overall: 3.71 },
        { name: 'Mithilesh Nayak', exp: '13', certified: true, ontology: 3, workshop: 3, pipeline: 3.5, coderepos: 4, typescript: 4, aip: 3.5, dataInteg: 4.5, overall: 3.64 },
        { name: 'Jagruti Parmar', exp: '3', certified: true, ontology: 3, workshop: 3, pipeline: 4.5, coderepos: 3.5, typescript: 3, aip: 3, dataInteg: 3.5, overall: 3.36 },
        { name: 'Dhruv Menon', exp: '3', certified: true, ontology: 3, workshop: 3, pipeline: 3.5, coderepos: 2, typescript: 2, aip: 2.5, dataInteg: 3, overall: 2.71 },
        { name: 'Sunny Kumrawat', exp: '17', certified: true, ontology: 3, workshop: 3, pipeline: 3.5, coderepos: 1.5, typescript: 1.5, aip: 2, dataInteg: 2.5, overall: 2.43 }
    ];

    const matrixBody = document.getElementById('matrix-body');
    const sortSelect = document.getElementById('sort-select');

    function getRatingClass(value) {
        if (value >= 5) return 'rating-5';
        if (value >= 4) return 'rating-4';
        if (value >= 3) return 'rating-3';
        return 'rating-low';
    }

    function renderMatrix(data) {
        matrixBody.innerHTML = '';
        data.forEach((member, index) => {
            const row = document.createElement('tr');
            row.style.opacity = '0';
            row.style.transform = 'translateY(10px)';
            row.style.transition = `opacity 0.3s ease ${index * 0.03}s, transform 0.3s ease ${index * 0.03}s`;

            row.innerHTML = `
                <td class="member-name">${member.name}<br><span class="member-exp">${member.exp} yrs</span></td>
                <td>${member.exp}</td>
                <td>${member.certified ? '<span class="cert-badge">Certified</span>' : '-'}</td>
                <td class="rating-cell ${getRatingClass(member.ontology)}">${member.ontology}</td>
                <td class="rating-cell ${getRatingClass(member.workshop)}">${member.workshop}</td>
                <td class="rating-cell ${getRatingClass(member.pipeline)}">${member.pipeline}</td>
                <td class="rating-cell ${getRatingClass(member.coderepos)}">${member.coderepos}</td>
                <td class="rating-cell ${getRatingClass(member.typescript)}">${member.typescript}</td>
                <td class="rating-cell ${getRatingClass(member.aip)}">${member.aip}</td>
                <td class="rating-cell ${getRatingClass(member.dataInteg)}">${member.dataInteg}</td>
                <td class="rating-cell overall-cell ${getRatingClass(member.overall)}">${member.overall.toFixed(2)}</td>
            `;

            matrixBody.appendChild(row);

            // Trigger animation
            requestAnimationFrame(() => {
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            });
        });
    }

    function sortData(sortKey) {
        const sorted = [...teamData];
        const [field, direction] = sortKey.split('-');
        const asc = direction === 'asc';

        sorted.sort((a, b) => {
            let valA, valB;

            if (field === 'name') {
                return asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            } else if (field === 'exp') {
                valA = parseFloat(a.exp);
                valB = parseFloat(b.exp);
            } else {
                valA = a[field] || 0;
                valB = b[field] || 0;
            }

            return asc ? valA - valB : valB - valA;
        });

        renderMatrix(sorted);
    }

    // Sort handler
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortData(this.value);
        });
    }

    // Column header click sorting
    const headers = document.querySelectorAll('.skill-matrix th');
    const columnMap = {
        0: 'name-asc',
        1: 'exp-desc',
        3: 'ontology-desc',
        4: 'workshop-desc',
        5: 'pipeline-desc',
        6: 'coderepos-desc',
        7: 'typescript-desc',
        8: 'aip-desc',
        9: 'dataInteg-desc',
        10: 'overall-desc'
    };

    headers.forEach((header, index) => {
        if (columnMap[index]) {
            header.addEventListener('click', function() {
                const sortKey = columnMap[index];
                sortData(sortKey);
                if (sortSelect) sortSelect.value = sortKey;
            });
        }
    });

    // Initial render
    renderMatrix(teamData);
});
