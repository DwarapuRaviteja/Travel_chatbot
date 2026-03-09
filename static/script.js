function sendMessage() {

    const input = document.getElementById("user-input")
    const message = input.value.trim()

    if (message === "") return

    const chatBox = document.getElementById("chat-box")

    // show user message
    chatBox.innerHTML += `<div class="user-msg"><b>You:</b> ${message}</div>`

    input.value = ""

    fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: message })
    })

    .then(res => res.json())

    .then(data => {

        let reply = data.reply

        // remove markdown symbols
        reply = reply.replace(/\*\*/g, "")
        reply = reply.replace(/\*/g, "")

        // split text into lines
        const lines = reply.split("\n")

        let formattedReply = ""

        lines.forEach(line => {
            if(line.trim() !== ""){
                formattedReply += `<div>${line}</div>`
            }
        })

        chatBox.innerHTML += `<div class="bot-msg"><b>Bot:</b>${formattedReply}</div>`

        chatBox.scrollTop = chatBox.scrollHeight
    })
}
document.getElementById("user-input").addEventListener("keypress", function(e) {

    if (e.key === "Enter") {
        e.preventDefault()
        sendMessage()
    }

})

