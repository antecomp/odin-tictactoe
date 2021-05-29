// Use strict is to prevent me from doing something stupid
"use strict";

function playerGen(name, marker) {
    return {name, marker}
}

// Maybe add a form or some sort of async magic to ask for player names
// before initializing.
const PlayerOne = playerGen(prompt("Player Ones Name?"),"X")
const PlayerTwo = playerGen(prompt("Player Twos Name?"), "O")

// Im making this global because I was getting errors up the ass inside the game scope
// lord help me
let currentPlayer = PlayerOne;

// Status can be used by both board and game
let status = document.querySelector("#status")


// IIFE to return gameboard object.
const gameboard = (function(){
    // Internal Scope Gameboard, returns as an array with 9 tiles
    let boardArray = new Array(9).fill("")

    // Generate Gameboard in DOM
    // Container element for the board squares
    let boardCon = document.querySelector("#boardcon")
    // Draw The Board
    boardArray.forEach((item, index) => {
        const tile = document.createElement("div")
        tile.className = "tile"
        tile.setAttribute("id", `tile-${index}`)
        // Idkk why I cant just pass the function
        tile.addEventListener("click", function () { tileClick(index); })
        boardCon.appendChild(tile);
    })

    // Function to handle tileclick
    function tileClick(index) {
        // Gaurd Clause, return early if tile already set.
        if(boardArray[index] != "") return;
        boardArray[index] = currentPlayer.marker
        let selectedTile = document.getElementById(`tile-${index}`);
        selectedTile.textContent = currentPlayer.marker;
        selectedTile.style.cursor = "default"
        game.tilesLeft -= 1
        if (game.tilesLeft == 0) {
            console.log("No tiles left")
            if(game.determineWinner()){
                console.log("Temp: Woo Someone Won On Last Tile")
            } else {
                game.handleTie();
            }
            return;
        }
        // Check for winner after every move.
        // The determine winner will return true of there is a winner
        // in that case we return early since we dont want to alternate players
        if(game.determineWinner()) return;
        game.alternatePlayers();
    }
    // Function to wipe array
    function arrayWipe () {
        boardArray.forEach((item, index) => {
            boardArray[index] = "";
        })
    }
    function newGame () {
        let children = document.querySelectorAll(".tile");
        children.forEach((child) => {
            child.textContent = ""
            child.style.cursor = "pointer"
        })
        game.tilesLeft = 9;
        arrayWipe();
        currentPlayer = PlayerOne;
        game.displayPlayer();
        // Reset the pointer events defined in gameOver()
        gameboard.boardCon.style.pointerEvents = "all";
    }
    return {newGame, boardArray, boardCon}
})()

// Game logic IIFE object generator
const game = (function (){
    let tilesLeft = 9

    function displayPlayer() {
        status.textContent = (`${currentPlayer.name}'s turn`)
    }

    function alternatePlayers() {
        if (currentPlayer == PlayerOne) {
             currentPlayer = PlayerTwo
        } else {
            currentPlayer = PlayerOne 
        }
        displayPlayer();
    };

    function determineWinner() {
        const winIndex = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6],
        ];

        for(let winningSet of winIndex) {
            if (
                gameboard.boardArray[winningSet[0]] == currentPlayer.marker
                && gameboard.boardArray[winningSet[1]] == currentPlayer.marker
                && gameboard.boardArray[winningSet[2]] == currentPlayer.marker
            ){ // if someone won
                gameOver(currentPlayer.name);
                // Return true to exit loop and to invoke anything outside this loop
                // if they use an if condition
                return true;
            }
        }

    };

    function handleTie() {
        gameOver("Nobody")
    }
    
    function gameOver(winner) {
        status.textContent = (`${winner} Won, Press New Game`)
        // Setting this prevents user from interacting with the board
        gameboard.boardCon.style.pointerEvents = "none";
        currentPlayer = PlayerOne
    }
    return {alternatePlayers, tilesLeft, determineWinner, handleTie, displayPlayer}
})()

game.displayPlayer();