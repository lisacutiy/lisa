/* =========================================
   ELEMENTS
========================================= */

const messageForm =
    document.getElementById("messageForm");

const nameInput =
    document.getElementById("name");

const messageInput =
    document.getElementById("message");

const anonymousInput =
    document.getElementById("anonymous");

const characterCount =
    document.getElementById("characterCount");

const sendButton =
    document.getElementById("sendButton");

const formStatus =
    document.getElementById("formStatus");

const messagesList =
    document.getElementById("messagesList");

const emptyState =
    document.getElementById("emptyState");

const liveStatus =
    document.getElementById("liveStatus");


/* =========================================
   CHARACTER COUNT
========================================= */

messageInput.addEventListener(
    "input",
    function () {

        const length =
            messageInput.value.length;

        characterCount.textContent =
            `${length} / 1000`;

    }
);


/* =========================================
   ANONYMOUS MODE
========================================= */

anonymousInput.addEventListener(
    "change",
    function () {

        if (anonymousInput.checked) {

            nameInput.value = "";

            nameInput.disabled = true;

            nameInput.placeholder =
                "Anonymous";

        } else {

            nameInput.disabled = false;

            nameInput.placeholder =
                "ନାମ ଲେଖନ୍ତୁ...";

        }

    }
);


/* =========================================
   STATUS
========================================= */

function showStatus(
    message,
    type
) {

    formStatus.textContent =
        message;

    formStatus.className =
        `form-status ${type}`;

}


/* =========================================
   BUTTON LOADING
========================================= */

function setLoading(
    loading
) {

    sendButton.disabled =
        loading;

    sendButton.classList.toggle(
        "loading",
        loading
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(
    value
) {

    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(
    dateString
) {

    const date =
        new Date(dateString);

    const now =
        new Date();

    const diff =
        Math.floor(
            (now - date) / 1000
        );


    if (diff < 60) {

        return "ଏବେ";

    }


    if (diff < 3600) {

        const minutes =
            Math.floor(diff / 60);

        return `${minutes} min ago`;

    }


    if (diff < 86400) {

        const hours =
            Math.floor(diff / 3600);

        return `${hours} hr ago`;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================
   CREATE MESSAGE CARD
========================================= */

function createMessageCard(
    message
) {

    const card =
        document.createElement("article");

    card.className =
        "message-card";

    const safeName =
        escapeHTML(
            message.name || "Anonymous"
        );

    const safeMessage =
        escapeHTML(
            message.message
        );

    card.innerHTML = `

        <div class="message-meta">

            <span class="message-author">
                ${safeName}
            </span>

            <span class="message-time">
                ${formatDate(message.created_at)}
            </span>

        </div>

        <p class="message-body">
            ${safeMessage}
        </p>

    `;

    return card;

}


/* =========================================
   RENDER MESSAGES
========================================= */

function renderMessages(
    messages
) {

    messagesList.innerHTML = "";


    if (!messages || messages.length === 0) {

        emptyState.hidden = false;

        return;

    }


    emptyState.hidden = true;


    messages.forEach(
        function (message) {

            messagesList.appendChild(
                createMessageCard(message)
            );

        }
    );

}


/* =========================================
   LOAD MESSAGES
========================================= */

async function loadMessages() {

    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("messages")

            .select(
                "id,name,message,created_at"
            )

            .eq(
                "approved",
                true
            )

            .order(
                "created_at",
                {
                    ascending: false
                }
            )

            .limit(100);


        if (error) {

            console.error(
                "Load messages error:",
                error
            );

            messagesList.innerHTML = "";

            showStatus(
                "Messages load ହେଇପାରିଲା ନାହିଁ।",
                "error"
            );

            return;

        }


        renderMessages(data);

    }

    catch (error) {

        console.error(error);

        messagesList.innerHTML = "";

        showStatus(
            "Internet connection check କରନ୍ତୁ।",
            "error"
        );

    }

}


/* =========================================
   SEND MESSAGE
========================================= */

messageForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const message = messageInput.value.trim();

    if (!message) {
        showStatus(
            "ଦୟାକରି କିଛି ଲେଖନ୍ତୁ।",
            "error"
        );

        messageInput.focus();
        return;
    }

    let name = "Anonymous";

    if (!anonymousInput.checked) {
        name = nameInput.value.trim() || "Anonymous";
    }

    setLoading(true);
    showStatus("", "");

    console.log("Sending message...");

    try {

        const { error } = await supabaseClient
            .from("messages")
            .insert({
                name: name,
                message: message
            });

        /* --------------------------------
           SUPABASE ERROR
        -------------------------------- */

        if (error) {

            console.error(
                "SUPABASE ERROR:",
                error
            );

            console.error(
                "Code:",
                error.code
            );

            console.error(
                "Message:",
                error.message
            );

            console.error(
                "Details:",
                error.details
            );

            console.error(
                "Hint:",
                error.hint
            );

            showStatus(
                "Message ପଠାଇହେଲା ନାହିଁ।",
                "error"
            );

            return;
        }


        /* --------------------------------
           SUCCESS
        -------------------------------- */

        console.log(
            "Message successfully sent."
        );


        /* Clear message */

        messageInput.value = "";

        if (nameInput) {
            nameInput.value = "";
        }


        /* Reset character counter */

        if (characterCount) {
            characterCount.textContent =
                "0 / 1000";
        }


        /* Success message */

        showStatus(
            "ଆପଣଙ୍କ କଥା ପହଞ୍ଚିଗଲା ❤️",
            "success"
        );


    } catch (error) {

        console.error(
            "JAVASCRIPT ERROR:",
            error
        );

        showStatus(
            "Something went wrong.",
            "error"
        );

    } finally {

        setLoading(false);

    }

});

/* =========================================
   REALTIME
========================================= */

function subscribeToMessages() {

    const channel =
        supabaseClient

            .channel(
                "public-messages"
            )

            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: "approved=eq.true"
                },
                function (payload) {

                    const newMessage =
                        payload.new;


                    /*
                     * Add the new message
                     * immediately to the UI.
                     */

                    const card =
                        createMessageCard(
                            newMessage
                        );


                    emptyState.hidden = true;


                    messagesList.prepend(
                        card
                    );


                    /*
                     * Keep list manageable.
                     */

                    const cards =
                        messagesList.querySelectorAll(
                            ".message-card"
                        );


                    if (cards.length > 100) {

                        cards[cards.length - 1]
                            .remove();

                    }

                }
            )

            .subscribe(
                function (status) {

                    if (
                        status === "SUBSCRIBED"
                    ) {

                        liveStatus.innerHTML = `
                            <span></span>
                            Live
                        `;

                    }

                }
            );


    return channel;

}


/* =========================================
   INITIALIZE
========================================= */

async function initializeChat() {

    await loadMessages();

    subscribeToMessages();

}


initializeChat();
