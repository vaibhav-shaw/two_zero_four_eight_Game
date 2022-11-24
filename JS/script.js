// game starts with 2 twos and a two is added in each step
var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function () { //  window.onload() event triggers after the web page has been loaded
    setGame(); // calling setGame function
}

function setGame() {
    // initialising board
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div"); // to create <div></div>
            tile.id = r.toString() + "-" + c.toString();// used to set id like <div id="0-0"></div>
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    //creating 2*twos to start the game
    setTwo();
    setTwo();
}

function updateTile(tile, num) {
    tile.innerText = ""; //clearing the tile
    tile.classList.value = ""; //clearing the class, so that tiles dont have multiple values like x2,x4,x8...
    tile.classList.add("tile"); // The classList property(read ony) returns the CSS classnames of an element
    if (num > 0) {
        tile.innerText = num.toString(); // to find the num present in the tile
        if (num <= 4096) {
            tile.classList.add("x" + num.toString()); // to add styleclass according to the num to the tile
        } else {
            tile.classList.add("x8192"); // all above this are of same colour
        }
    }
}

document.addEventListener('keyup', (e) => { //keyup means when a key is released, e is a event
    if (e.code == "ArrowLeft") { //.code represents a physical key in the keyboard
        slideLeft();
        setTwo(); // add two after every slide
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();

    }
    else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }
    document.getElementById("score").innerText = score; // updating score
})

function filterZero(row) {// filters zeros 
    return row.filter(num => num != 0); //{0,2,2,2}->{2,2,2}
}

function slide(row) {
    row = filterZero(row); // removing zeroes
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) { //checking for every alternating 
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i]; // increasing score by the amount updated, NOTE: score is updated in the key-up event
        } //eg {2,2,2}->{4,0,2}
    }
    row = filterZero(row); //removing zeroes ie {4,0,2}->{4,2}

    while (row.length < columns) { //ading all the removed zeroes
        row.push(0);
    }
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) { // traversing via each row, 1 row at a time
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++) { // to make the changes happen in the html file
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num); // updating the tile
        }
    }
}

function slideRight() { // 1.reverse the row-> 2.slide it to the left-> 3.reverse it again-> = slide right
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();                //1
        row = slide(row)              //2
        board[r] = row.reverse();     //3
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]]; //like transpose
        row = slide(row);
        // board[0][c] = row[0]; //transpose back
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3]; //alternatively, below the same thing is done
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r]; // transpose back
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() { // slide right+slide up concepts combined
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function setTwo() {
    if (!hasEmptyTile()) { // if all the tiles are filled then we can't add a two
        return;
    }
    let found = false; // flag to store if any tile is empty in-order to store a two there
    while (!found) {
        let r = Math.floor(Math.random() * rows); // randomly select row and column
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";     // adding two in html file
            tile.classList.add("x2"); //adding two's css
            found = true; // to break out of the while loop
        }
    }
}

function hasEmptyTile() {
    // let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    alert(`Your score is: ${score}`);
    window.location.reload();
    return false;
}