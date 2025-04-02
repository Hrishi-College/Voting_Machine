let voteChart; // Chart instance

async function fetchVotes() {
    const response = await fetch("/get_results");
    const data = await response.json();
    console.log(data); // Log the data for debugging
    updateTables(data);
    updateChart(data);
}

function updateTables(data) {
    let totalVotes = Object.values(data).reduce((sum, v) => sum + v, 0);
    const tableA = document.getElementById("tableA");
    const tableB = document.getElementById("tableB");
    const tableTotal = document.getElementById("tableTotal");

    tableA.innerHTML = "<tr><th>Candidate</th><th>Votes</th><th>Percentage</th></tr>";
    tableB.innerHTML = "<tr><th>Candidate</th><th>Votes</th><th>Percentage</th></tr>";
    tableTotal.innerHTML = "<tr><th>Candidate</th><th>Votes</th><th>Percentage</th></tr>";

    for (let i = 1; i <= 5; i++) {
        let votesA = data[`A${i}`] || 0;
        let votesB = data[`B${i}`] || 0;
        let totalVotesForCandidate = data[`Total${i}`] || 0;

        let percentageA = totalVotes > 0 ? ((votesA / totalVotes) * 100).toFixed(2) + "%" : "0%";
        let percentageB = totalVotes > 0 ? ((votesB / totalVotes) * 100).toFixed(2) + "%" : "0%";
        let totalPercentage = totalVotes > 0 ? ((totalVotesForCandidate / totalVotes) * 100).toFixed(2) + "%" : "0%";

        let rowA = `<tr><td>Candidate ${i}</td><td>${votesA}</td><td>${percentageA}</td></tr>`;
        let rowB = `<tr><td>Candidate ${i}</td><td>${votesB}</td><td>${percentageB}</td></tr>`;
        let rowTotal = `<tr><td>Candidate ${i}</td><td>${totalVotesForCandidate}</td><td>${totalPercentage}</td></tr>`;

        tableA.innerHTML += rowA;
        tableB.innerHTML += rowB;
        tableTotal.innerHTML += rowTotal;
    }
}


function updateChart(data) {
    let candidates = ["Candidate 1", "Candidate 2", "Candidate 3", "Candidate 4", "Candidate 5"];
    let votesA = [], votesB = [], totalVotes = [];

    for (let i = 1; i <= 5; i++) {
        let votesAI = data[`A${i}`] || 0;
        let votesBI = data[`B${i}`] || 0;
        votesA.push(votesAI);
        votesB.push(votesBI);
        totalVotes.push(votesAI + votesBI);
    }

    if (!voteChart) {
        let ctx = document.getElementById("voteChart").getContext("2d");
        voteChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: candidates,
                datasets: [
                    {
                        label: "Machine A Votes",
                        data: votesA,
                        backgroundColor: "rgba(255, 99, 132, 0.6)",
                        borderColor: "rgba(255, 99, 132, 1)",
                        borderWidth: 1
                    },
                    {
                        label: "Machine B Votes",
                        data: votesB,
                        backgroundColor: "rgba(54, 162, 235, 0.6)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1
                    },
                    {
                        label: "Total Votes",
                        data: totalVotes,
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    } else {
        voteChart.data.datasets[0].data = votesA;
        voteChart.data.datasets[1].data = votesB;
        voteChart.data.datasets[2].data = totalVotes;
        voteChart.update();
    }
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

setInterval(fetchVotes, 3000);
fetchVotes();