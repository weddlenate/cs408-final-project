//Updates the table using the populateTable() function

let xhr = new XMLHttpRequest();
xhr.addEventListener("load", function () {
    const dataText = xhr.response;
    const data = JSON.parse(dataText);

    populateTable(data);
});
xhr.open("GET", "https://7p6ec3iwhf.execute-api.us-east-2.amazonaws.com/items");
xhr.send();

function populateTable (obj) {
    //Setup the top of the table
    const table = document.getElementById("statsTable");

    //Clear table
    table.innerHTML = "";

    //Make top of table 
    const tableHead = document.createElement("thead")
    const tableHeadRow = document.createElement("tr");
    const tableHeadStat = document.createElement("th");
    tableHeadStat.textContent = "Stat";
    const tableHeadTotal = document.createElement("th");
    tableHeadTotal.textContent = "Total";

    tableHeadRow.appendChild(tableHeadStat);
    tableHeadRow.appendChild(tableHeadTotal);
    tableHead.appendChild(tableHeadRow);
    table.appendChild(tableHead);

    //Get the node for the table body we want to add to
    const tableBody = document.createElement("tbody");
    tableBody.id = "statsTableBody";

    //Get current user
    const username = JSON.parse(localStorage.getItem('username'));
    //Iterate through each item currently in the database
    for (const item of obj) {
        if (item.id == username) {
            const timeRow = document.createElement("tr");
            const timeID = document.createElement("td");
            const timeData = document.createElement("td");
            timeID.textContent = "Best Time";
            timeData.textContent = item.time;
            timeRow.appendChild(timeID);
            timeRow.appendChild(timeData);

            const linesRow = document.createElement("tr");
            const linesID = document.createElement("td");
            const linesData = document.createElement("td");
            linesID.textContent = "Most Lines";
            linesData.textContent = item.lines;
            linesRow.appendChild(linesID);
            linesRow.appendChild(linesData);

            const scoreRow = document.createElement("tr");
            const scoreID = document.createElement("td");
            const scoreData = document.createElement("td");
            scoreID.textContent = "Highest Score";
            scoreData.textContent = item.score;
            scoreRow.appendChild(scoreID);
            scoreRow.appendChild(scoreData);

            const singlesRow = document.createElement("tr");
            const singlesID = document.createElement("td");
            const singlesData = document.createElement("td");
            singlesID.textContent = "Career Singles";
            singlesData.textContent = item.singles;
            singlesRow.appendChild(singlesID);
            singlesRow.appendChild(singlesData);

            const doublesRow = document.createElement("tr");
            const doublesID = document.createElement("td");
            const doublesData = document.createElement("td");
            doublesID.textContent = "Career Doubles";
            doublesData.textContent = item.doubles;
            doublesRow.appendChild(doublesID);
            doublesRow.appendChild(doublesData);

            const triplesRow = document.createElement("tr");
            const triplesID = document.createElement("td");
            const triplesData = document.createElement("td");
            triplesID.textContent = "Career Triples";
            triplesData.textContent = item.triples;
            triplesRow.appendChild(triplesID);
            triplesRow.appendChild(triplesData);

            const tetrisesRow = document.createElement("tr");
            const tetrisesID = document.createElement("td");
            const tetrisesData = document.createElement("td");
            tetrisesID.textContent = "Career Tetrises";
            tetrisesData.textContent = item.tetrises;
            tetrisesRow.appendChild(tetrisesID);
            tetrisesRow.appendChild(tetrisesData);

            tableBody.appendChild(timeRow);
            tableBody.appendChild(linesRow);
            tableBody.appendChild(scoreRow);
            tableBody.appendChild(singlesRow);
            tableBody.appendChild(doublesRow);
            tableBody.appendChild(triplesRow);
            tableBody.appendChild(tetrisesRow);

            table.appendChild(tableBody);
        } 
    }
}