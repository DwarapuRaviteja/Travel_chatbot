const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

const loadingContainer =
    document.getElementById("loadingContainer");

const historyBtn =
    document.getElementById("historyBtn");

const historyPanel =
    document.getElementById("historyPanel");

const historyList =
    document.getElementById("historyList");

const themeBtn =
    document.getElementById("themeBtn");

const userTemplate =
    document.getElementById("userMessageTemplate");

const botTemplate =
    document.getElementById("botMessageTemplate");

let searchHistory = [];


// ======================
// SEND MESSAGE
// ======================

async function sendMessage() {

    const message =
        userInput.value.trim();

    if (!message) return;

    addUserMessage(message);

    addToHistory(message);

    userInput.value = "";

    showLoading();

    try {

        const response =
            await fetch("/chat", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    message: message
                })
            });

        const data =
            await response.json();

        hideLoading();

        addBotMessage(
            data.reply ||
            "No response received."
        );

    } catch (error) {

        hideLoading();

        addBotMessage(
            "⚠️ Error connecting to server."
        );

        console.error(error);
    }
}


// ======================
// USER MESSAGE
// ======================

function addUserMessage(text) {

    const clone =
        userTemplate.content.cloneNode(true);

    clone.querySelector(
        ".message-content"
    ).textContent = text;

    const row =
        clone.querySelector(
            ".message-row"
        );

    row.id =
        "msg-" + Date.now();

    chatContainer.appendChild(clone);

    scrollToBottom();
}


// ======================
// BOT MESSAGE
// ======================

function addBotMessage(text) {

    const clone =
        botTemplate.content.cloneNode(true);

    clone.querySelector(
        ".message-content"
    ).textContent = text;

    const copyBtn =
        clone.querySelector(".copy-btn");

    copyBtn.addEventListener(
        "click",
        () => {

            navigator.clipboard
                .writeText(text);

            copyBtn.innerHTML =
                '<i class="fa-solid fa-check"></i>';

            setTimeout(() => {

                copyBtn.innerHTML =
                    '<i class="fa-regular fa-copy"></i>';

            }, 1500);

        });

    chatContainer.appendChild(clone);

    scrollToBottom();
}


// ======================
// LOADING
// ======================

function showLoading() {

    loadingContainer.classList
        .remove("hidden");
}

function hideLoading() {

    loadingContainer.classList
        .add("hidden");
}


// ======================
// SCROLL
// ======================

function scrollToBottom() {

    setTimeout(() => {

        chatContainer.scrollTop =
            chatContainer.scrollHeight;

    }, 100);
}


// ======================
// ENTER KEY
// ======================

userInput.addEventListener(
    "keydown",
    (e) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            sendMessage();
        }
    });


// ======================
// SEND BUTTON
// ======================

sendBtn.addEventListener(
    "click",
    sendMessage
);


// ======================
// AUTO TEXTAREA HEIGHT
// ======================

userInput.addEventListener(
    "input",
    () => {

        userInput.style.height =
            "auto";

        userInput.style.height =
            userInput.scrollHeight +
            "px";
    });


// ======================
// DARK MODE
// ======================

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList
            .toggle("dark-mode");

        const icon =
            themeBtn.querySelector("i");

        if (
            document.body.classList
                .contains("dark-mode")
        ) {

            icon.className =
                "fa-solid fa-sun";

        } else {

            icon.className =
                "fa-solid fa-moon";
        }
    });


// ======================
// HISTORY
// ======================

function addToHistory(query) {

    searchHistory.push({

        text: query,

        id:
        "history-" +
        Date.now()
    });

    renderHistory();
}


function renderHistory() {

    historyList.innerHTML = "";

    if (
        searchHistory.length === 0
    ) {

        historyList.innerHTML = `
            <p class="empty-history">
                No searches yet...
            </p>
        `;

        return;
    }

    searchHistory
        .slice()
        .reverse()
        .forEach((item) => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "history-item";

            div.textContent =
                item.text;

            div.addEventListener(
                "click",
                () => {

                    jumpToQuestion(
                        item.text
                    );

                    historyPanel
                        .classList
                        .add(
                            "hidden"
                        );
                });

            historyList
                .appendChild(div);
        });
}


// ======================
// JUMP TO QUESTION
// ======================

function jumpToQuestion(text) {

    const messages =
        document.querySelectorAll(
            ".user-message .message-content"
        );

    for (
        let msg of messages
    ) {

        if (
            msg.textContent === text
        ) {

            msg.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "center"
            });

            break;
        }
    }
}


// ======================
// HISTORY PANEL
// ======================

historyBtn.addEventListener(
    "click",
    (e) => {

        e.stopPropagation();

        historyPanel.classList
            .toggle("hidden");
    });


// CLOSE OUTSIDE

document.addEventListener(
    "click",
    (e) => {

        if (
            !historyPanel.contains(
                e.target
            ) &&
            !historyBtn.contains(
                e.target
            )
        ) {

            historyPanel.classList
                .add("hidden");
        }
    });


// ======================
// SUGGESTION BUTTONS
// ======================

document
.querySelectorAll(
    ".suggestion-btn"
)
.forEach(btn => {

    btn.addEventListener(
        "click",
        () => {

            userInput.value =
                btn.textContent.trim();

            sendMessage();
        });
});


// ======================
// INITIAL SCROLL
// ======================

scrollToBottom();

