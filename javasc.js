const columns = 7;
const rows = 6;
const ytoken = "🟡";
const rtoken = "🔴";
const connectN = 4;
let playerCount = 1;
let winner = false

// init empty board
function getBoard(rows, columns) {
    let jsArr = new Array(rows + 1);
    for (let i = 0; i < rows + 1; i++) {
        const grid = document.getElementById("grid");
        const row = document.createElement('div')
        row.id = "row-" + i
        row.className = "row row-md-12"
        grid.prepend(row)
        jsArr[i] = new Array(columns);
        jsArr[i].fill(null);
        for (let j = 0; j < columns; j++) {
            // set row of buttons
            if (i === 0) {
                let button = document.createElement("button")
                button.id = "button-" + j
                button.innerText = "🖖"
                button.className = "btn btn-primary btn-lg myButtons column"
                document.getElementById('row-0').appendChild(button)
                button.addEventListener("click", boardClick);
            }
            // set bord elements
            else {
                let column = document.createElement("div")
                column.className = "column"
                column.id = 'row-' + i + '-col-' + j
                column.innerText = "⚪"
                document.getElementById('row-' + i).appendChild(column)
            }
        }
    }
    return jsArr
}

// redefine board
function resetBoard(event) {
    console.log('reset Clicked')
    winner = false
    for (let i = 1; i < rows + 1; i++) {
        for (let j = 0; j < columns; j++) {
            let gridCell = document.getElementById("row-" + i + '-col-' + j)
            gridCell.innerText = "⚪"
            jsArr[i][j] = null
        }
    }
}

// check for winner
function CheckWinner(onRow, onCol, jsArr) {

    // check vertical win 
    let connectCount = 1
    for (let i = 1; i < rows; i++) {
        if (jsArr[i][onCol] === null) {
            winner = false
            break
        }
        else if (jsArr[i][onCol] === jsArr[i + 1][onCol]) {
            connectCount++
        }
        else {
            connectCount = 1 // if same as peice above add 1
        }
        if (connectCount === connectN) {
            winner = true
            break
        }
    }
    return winner
}

// click function: update tokens
function boardClick(event) {
    if (winner === false){ // execute if in-play
        let colClicked = event.target.id.split('-')[1];
        console.log(playerCount % 2)
        console.log("_______ i have been clicked on " + colClicked);
        for (let i = 1; i < rows + 1; i++) {
            if (jsArr[i][colClicked] === null) {
                let buttonClick = document.getElementById('row-' + i + '-col-' + colClicked)
                if (playerCount % 2 === 0) {
                    buttonClick.innerText = ytoken
                }
                else {
                    buttonClick.innerText = rtoken
                }
                jsArr[i][colClicked] = (playerCount % 2) + 1
                winner = CheckWinner(i, colClicked, jsArr)
                // if win do something update score count and display win messgae
                playerCount++;
                break
            }
        }
        // if else, prompt to reset board
    }

    else if (winner){
        console.log("winner...")
        $("p").append("Some appended text.");
    }



}


jsArr = getBoard(rows, columns)
let reset = document.getElementById("reset")
reset.addEventListener("click", resetBoard)