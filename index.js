const path = require("path")
const express = require("express")
const bodyParser = require("body-parser")

const app = express()

var d1 = 2
var d2 = 0
var appleX = 5
var appleY = 5
var score1 = 1
var score2 = 1
var player1Lose = false
var player2Lose = false
const xPositions1 = new Array(20).fill(1)
const yPositions1 = new Array(20).fill(1)
const xPositions2 = new Array(20).fill(18)
const yPositions2 = new Array(20).fill(18)
var player1Exists = false
var player2Exists = false
var prevTick = 0

function updateApple() {
    if (xPositions1[0] == appleX && yPositions1[0] == appleY) {
        generateApple()
        score1 += 1
    }
    
    if (xPositions2[0] == appleX && yPositions2[0] == appleY) {
        generateApple()
        score2 += 1
    }
}

function generateApple() {
    var overlapApple = true
    while (overlapApple) {
        overlapApple = false
        appleX = Math.floor(Math.random() * 20)
        appleY = Math.floor(Math.random() * 20)
        for (let i = 0; i < score1; i++) {
            if (xPositions1[i] == appleX && yPositions1[i] == appleY) {
                overlapApple = true
            }
        }
        for (let j = 0; j < score1; j++) {
            if (xPositions2[j] == appleX && yPositions2[j] == appleY) {
                overlapApple = true
            }
        }
    }
}

function moveBody1() {
    for (let i = score1 - 1; i > 0; i--) {
        xPositions1[i] = xPositions1[i-1]
        yPositions1[i] = yPositions1[i-1]
    }
}

function moveBody2() {
    for (let i = score2 - 1; i > 0; i--) {
        xPositions2[i] = xPositions2[i-1]
        yPositions2[i] = yPositions2[i-1]
    }
}

function detectCollisions() {
    for (let i = 1; i < score1; i++) {
        if(xPositions1[0] == xPositions1[i] && yPositions1[0] == yPositions1[i]) {
            player1Lose = true
            score1 = 1
        }
    }
    
    for (let j = 0; j < score2; j++) {
        if(xPositions1[0] == xPositions2[j] && yPositions1[0] == yPositions2[j]) {
            player1Lose = true
            score1 = 1
        }
    }
    
    for (let k = 1; k < score2; k++) {
        if(xPositions2[0] == xPositions2[k] && yPositions2[0] == yPositions2[k]) {
            player2Lose = true
            score2 = 1
        }
    }
    
    for (let l = 0; l < score1; l++) {
        if(xPositions2[0] == xPositions1[l] && yPositions2[0] == yPositions1[l]) {
            player2Lose = true
            score2 = 1
        }
    }
}

app.use(bodyParser.json())

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "snakegame.html"))
})

app.get("/snakegame.js", (req, res) => {
  res.sendFile(path.join(__dirname, "snakegame.js"))
})

app.post("/reset", (req, res) => {
    d1 = 2
    d2 = 0
    appleX = 5
    appleY = 5
    score1 = 1
    score2 = 1
    player1Lose = false
    player2Lose = false
    xPositions1[0] = 1
    yPositions1[0] = 1
    xPositions2[0] = 18
    yPositions2[0] = 18
    player1Exists = false
    player2Exists = false
    generateApple()

    res.send()
})

app.get("/player", (req, res) => {
    var playerNum = 0
    if (player1Exists == false) {
        player1Exists = true
        playerNum = 1
    } else if (player2Exists == false) {
        player2Exists = true
        playerNum = 2
    }

    res.send({
        player: playerNum
    })
})

app.post("/bye", (req, res) => {
    const { player } = req.body
    if (player == 1) {
        player1Exists = false
    } else if (player == 2) {
        player2Exists = false
    }
    res.send()
})

app.post("/frame", (req, res) => {
    const { direction, player } = req.body

    if (Date.now() - prevTick > 300) {
        prevTick = Date.now()

        updateApple()
        
        var newX1;
        var newY1;
        if (player1Lose == false) {
            switch (d1) {
                case 0:
                    newX1 = xPositions1[0]
                    newY1 = yPositions1[0] - 1 // up
                    break
                case 1:
                    newX1 = xPositions1[0] - 1 // left
                    newY1 = yPositions1[0]
                    break
                case 2:
                    newX1 = xPositions1[0]
                    newY1 = yPositions1[0] + 1 // down
                    break
                case 3:
                    newX1 = xPositions1[0] + 1
                    newY1 = yPositions1[0]     // right
                    break
            }

            moveBody1();
            newX1 = Math.min(Math.max(newX1, 0), 19)
            newY1 = Math.min(Math.max(newY1, 0), 19)
            xPositions1[0] = newX1;
            yPositions1[0] = newY1;
        }

        var newX2;
        var newY2;
        if (player2Lose == false) {
            switch (d2) {
                case 0:
                    newX2 = xPositions2[0]
                    newY2 = yPositions2[0] - 1 // up
                    break
                case 1:
                    newX2 = xPositions2[0] - 1 // left
                    newY2 = yPositions2[0]
                    break
                case 2:
                    newX2 = xPositions2[0]
                    newY2 = yPositions2[0] + 1 // down
                    break
                case 3:
                    newX2 = xPositions2[0] + 1
                    newY2 = yPositions2[0]     // right
                    break
            }

            moveBody2();
            newX2 = Math.min(Math.max(newX2, 0), 19)
            newY2 = Math.min(Math.max(newY2, 0), 19)
            xPositions2[0] = newX2;
            yPositions2[0] = newY2;
        }

        detectCollisions()
    }

    if (player == 1) {
        d1 = direction
    } else if (player == 2) {
        d2 = direction
    }

    res.send({
        x1: xPositions1,
        y1: yPositions1,
        x2: xPositions2,
        y2: yPositions2,
        aX: appleX,
        aY: appleY,
        s1: score1,
        s2: score2
    })
})

const server = app.listen(process.env.PORT || 3000, () => console.log(`App available on http://localhost:3000`))

server.keepAliveTimeout = 0