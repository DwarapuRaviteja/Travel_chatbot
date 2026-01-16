function sendMessage() {
    const input = document.getElementById("user-input")
    const message = input.value.trim()
    if (message === "") return

    const chatBox = document.getElementById("chat-box")
    chatBox.innerHTML += `<div class="user-msg"><b>You:</b> ${message}</div>`
    input.value = ""

    fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message })
    })
    .then(res => res.json())
    .then(data => {
        chatBox.innerHTML += `<div class="bot-msg"><b>Bot:</b> ${data.reply}</div>`
        chatBox.scrollTop = chatBox.scrollHeight
    })
}
