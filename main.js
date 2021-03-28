//player factory
const playerFactory = (name, icon) => {
    this.name = name;
    this.icon = icon;
    this.score = 0;
    return {name, icon, score};
};
  


const StartGame =(() => {
    
    const playerOne = playerFactory(null, 'x');
    const playerTwo = playerFactory(null, 'o');

    function getName(e){
        if(e.currentTarget.id == "player1"){
            var name1 = document.getElementById('name1');
            name1.setAttribute("disabled", "");
            playerOne.name = name1.value;
        }
        if(e.currentTarget.id == "player2"){
            var name1 = document.getElementById('name2');
            name1.setAttribute("disabled", "");
            playerTwo.name = name1.value;
        }
        e.currentTarget.classList.add("disabled");

        if(playerTwo.name !== null && playerOne.name !== null){
            const cells = Array.from(document.querySelectorAll('.cell'));
            cells.forEach(cell => cell.classList.remove('disabled'));    
        }
    }
    
    const nameInput = Array.from(document.querySelectorAll('.name'));
    nameInput.forEach(player => player.addEventListener('click', getName));

    return {playerOne, playerTwo};
})();


//gameboard Module
const gameboard = (() => {
    
    var field = ['','','','','','','','',''];

    //fire this function in background after each turn
    function gameOver(field) {

        //array of all possible straight lines
        const wins = [
            [field[0],field[4],field[8]],
            [field[6],field[4],field[2]],
            [field[0],field[1],field[2]],
            [field[3],field[4],field[5]],
            [field[6],field[7],field[8]],
            [field[0],field[3],field[6]],
            [field[1],field[4],field[7]],
            [field[2],field[5],field[8]],
        ];

        //check for a win
        //check contents of each possible win
        for(var i=0; i < wins.length; i++){
            let playerOneWin = true;
            let playerTwoWin = true;

            //check if somebody has won
            wins[i].map(function(item)  {
                if (item !== 'x') playerOneWin = false;
                if (item !== 'o') playerTwoWin = false;
            });

            if (playerOneWin) {
                //alert("Player 1 have won!");
                displayController.restart(true, true, false);
                return;
            }
            if (playerTwoWin) {
                //alert("Player 2 have won!");
                displayController.restart(true, false, true);
                return;
            }
        }

        //check for a draw
        //if all elements are filled then draw
        let k = 0;    

        for(let i = 0; i < field.length; i++) {
            let row = field[i];
            for(var j = 0; j < row.length; j++) {
                 if (row[j] !== ''){
                    k += 1;
                 }
            }
        }
        if(k === 9) {
            //alert('Game over with a Draw!');
            displayController.restart(true, false, false);   
        }
    } 

    return {field, gameOver};
})();

//display controller module
//all things related to the flow of the game
const displayController = (() => {
    
    let nrOfClicks = 0;

    function doTurn(e) {
        //nrOfClicks is tied to the player and the icon
        nrOfClicks += 1;
        
        let icon = (nrOfClicks%2 == 1) ? StartGame.playerOne.icon : StartGame.playerTwo.icon;

        gameboard.field[e.currentTarget.id] = icon;
        e.currentTarget.innerHTML = icon;
        
        //disable button
        e.currentTarget.classList.add("disabled");

        gameboard.gameOver(gameboard.field);
    }

    function restart(gameOver, playerOneWin, playerTwoWin){
        
        //if called from a button
        if (typeof gameOver.currentTarget !== 'undefined') {
            gameOver = false;
            playerTwoWin = false;
            playerOneWin = false;
        }

        //if gameOver => update score
        if(gameOver){
            if(playerOneWin) {
                StartGame.playerOne.score += 1;
            }
            if(playerTwoWin) {
                StartGame.playerTwo.score += 1; 
            }
            if(!playerOneWin && !playerTwoWin){
                StartGame.playerOne.score += 1;
                StartGame.playerTwo.score += 1;
            }
        } 

        gameboard.field = ['','','','','','','','',''];

        const cells = Array.from(document.querySelectorAll('.cell'));

        cells.forEach(cell => cell.classList.remove('disabled'));
        cells.forEach(cell => cell.innerHTML = "");

        var score1 = document.getElementById("score1");
        score1.innerText = "Score: " + StartGame.playerOne.score;    

        var score2 = document.getElementById("score2");
        score2.innerText = "Score: " + StartGame.playerTwo.score;
    
        nrOfClicks = 0;
    }    

    //events
    const newGame = document.getElementById('restart');
    newGame.addEventListener('click', restart);

    const cells = Array.from(document.querySelectorAll('.cell'));
    cells.forEach(cell => cell.addEventListener('click', doTurn));

    return {doTurn, restart};
})();