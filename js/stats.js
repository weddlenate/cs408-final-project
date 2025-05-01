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
    //Get the node for the table body we want to add to
    const table = document.getElementById("statsTableBody");

    //Clear table
    table.innerHTML = "";

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

            table.appendChild(timeRow);
            table.appendChild(linesRow);
            table.appendChild(scoreRow);
            table.appendChild(singlesRow);
            table.appendChild(doublesRow);
            table.appendChild(triplesRow);
            table.appendChild(tetrisesRow);
        } 
        // //Create new elements to be appended on to the table body
        // const dataRow = document.createElement("tr");
        // const dataID = document.createElement("td");
        // const dataName = document.createElement("td");
        // const dataPrice = document.createElement("td");

        // //Delete button
        // const dataAction = document.createElement("td");
        // dataAction.id = "deleteData";
        // const deleteButton = document.createElement("button");
        // deleteButton.id = "deleteButton"
        // deleteButton.textContent = "Delete";

        // //Delete button event listener to delete item from database
        // deleteButton.addEventListener("click", (event) => {
        //     let xhr = new XMLHttpRequest();
        //     const url = "https://62no40vw1g.execute-api.us-east-2.amazonaws.com/items/" + item.id;
        //     xhr.open("DELETE", url);
        //     xhr.setRequestHeader("Content-Type", "application/json");
        //     xhr.send();

        //     let lambda = document.getElementById("lambda-info");
        //     lambda.textContent = "Click \"Load Data\" to refresh table";
        // })

        // //Assign each part of the new row with the corresponding information from the database
        // dataID.textContent = item.id;
        // dataName.textContent = item.name;
        // dataPrice.textContent = item.price;
        // dataAction.appendChild(deleteButton);

        // //Append the table data to the table row
        // dataRow.appendChild(dataID);
        // dataRow.appendChild(dataName);
        // dataRow.appendChild(dataPrice);
        // dataRow.appendChild(dataAction);

        // //Append the table row to the table body
        // table.appendChild(dataRow);
    }
}