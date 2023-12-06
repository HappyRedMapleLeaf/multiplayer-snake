var pressingDirection = 0
var lastDraw = 0
const canvas = document.getElementById('canvas')
animationFrameId = window.requestAnimationFrame(tryRender)
const ctx = canvas.getContext('2d')

var playerNum = 0

function init() {
    fetch("/player", {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        const {
            player
        } = data
        playerNum = player
        if (playerNum == 0) {
            document.getElementById("playerNotif").innerText = "Game is full! Reload when one player has left."
        } else {
            document.getElementById("playerNotif").innerText = "You are player " + playerNum + "."
        }
    })
}

function resetGame() {
    fetch("/reset", {method: "POST"})
}

function resetConnections() {
    fetch("/resetConnections", {method: "POST"})
}

function tryRender() {
    if (performance.now() - lastDraw > 1000 / 10) { // 10 fps
        lastDraw = performance.now()
        
        fetch("/frame", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({direction: pressingDirection, player: playerNum})
        })
        .then(res => res.json())
        .then(data => {
            const {
                x1,
                y1,
                x2,
                y2,
                aX,
                aY,
                s1,
                s2
            } = data            
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

            ctx.fillStyle = "#FF0000"
            ctx.fillRect(aX * 20, aY * 20, 20, 20)

            ctx.fillStyle = "#00FF00"
            for (let i = 0; i < s1; i++) {
                ctx.fillRect(x1[i] * 20, y1[i] * 20, 20, 20)
            }

            ctx.fillStyle = "#0000FF"
            for (let j = 0; j < s2; j++) {
                ctx.fillRect(x2[j] * 20, y2[j] * 20, 20, 20)
            }

            // ctx.fillStyle = "#FFFFFF"
            // ctx.font = "16px Consolas"
            // ctx.fillText("x1: " + x1, 2, 16)
            // ctx.fillText("y1: " + y1, 2, 32)
            // ctx.fillText("x2: " + x2, 2, 48)
            // ctx.fillText("y2: " + y2, 2, 64)
        })
    }

    animationFrameId = window.requestAnimationFrame(tryRender)
}

window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return // Do nothing if the event was already processed
    }

    switch (event.key) {
        case "ArrowUp":
            pressingDirection = 0
            break
        case "ArrowLeft":
            pressingDirection = 1
            break
        case "ArrowDown":
            pressingDirection = 2
            break
        case "ArrowRight":
            pressingDirection = 3
            break
        default:
            return // Quit when this doesn't handle the key event
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault()
}, true)
// the last option (true?) dispatches the event to the listener first,
// then dispatches event to window
//https://stackoverflow.com/questions/4416505/how-to-take-keyboard-input-in-javascript

window.addEventListener("beforeunload", (event) => {
    fetch("/bye", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({player: playerNum})
    })
    event.returnValue = null
});