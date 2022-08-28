let userName;

const checkNick = () => {
    const URL = "https://mock-api.driven.com.br/api/v6/uol/participants";
    const user = {name: document.querySelector("#username").value};

    return axios.post(URL, user)
        .then(() => {
            userName = user;
        })
        .catch(err => {
            if (err.response.status === 400) {
                alert("Esse nick já está em uso! Escolha outro.");                
                //checkNick();
            }
            throw err;
        });
};

const pingConnection = () => {
    const URL = "https://mock-api.driven.com.br/api/v6/uol/status";    

    axios.post(URL, userName)
        .then(() => {
            console.log("tô aqui ainda");
        })
        .catch(err => {
            console.log(err);
        });
}

const getMessages = () => {
    const URL = "https://mock-api.driven.com.br/api/v6/uol/messages";
    return axios.get(URL)
        .then(res => {
            document.querySelector(".login").classList.add("hidden");
            document.querySelector(".chat").classList.remove("hidden");
            createMessages(res.data);
            document.querySelector("body").scrollIntoView(false);
        })
        .catch(err => {
            console.log(err);
        });
};

const createMessages = messages => {
    const ul = document.querySelector(".msg");

    messages
    .filter(message => {
        if (message.to !== userName && message.type === "private_message") {
            return false;
        } else {
            return true;
        }
    })
    .forEach(message => {
        const messageType = document.createElement("li");
        
        const timeWrapper = document.createElement("div");
        const timeStamp = document.createElement("p");

        const textWrapper = document.createElement("div");
        const text = document.createElement("p");
        
        if (message.type === "private_message") {
            messageType.classList = "msg__private";

            textWrapper.innerHTML = `
                <p><span>${message.from}</span> reservadamente para ${message.to}: ${message.text}</p>
            `;
        } else if (message.type === "message") {
            messageType.classList = "msg__public";

            textWrapper.innerHTML = `
            <p><span>${message.from}</span> para <span>${message.to}</span>: ${message.text}</p>
            `;
        } else {
            messageType.classList = "msg__notification";

            textWrapper.innerHTML = `
                <p><span>${message.from}</span> ${message.text}</p>
            `;
        }

        timeWrapper.classList = "msg__time";
        timeStamp.textContent = message.time;

        textWrapper.classList = "msg__chat";       
        
        textWrapper.appendChild(text);   
        timeWrapper.appendChild(timeStamp);
        messageType.appendChild(timeWrapper);
        messageType.appendChild(textWrapper);
        ul.appendChild(messageType);
    });
};

const sendPublicMessage = () => {   
    const URL = "https://mock-api.driven.com.br/api/v6/uol/messages";
    let messageContent = document.querySelector("textarea").value;
    let placeholder = document.querySelector("textarea").placeholder;
    
    const message = {
        from: userName.name,
        to: "Todos",
        text: messageContent,
        type: "message",
    }

    axios.post(URL, message)
        .then(() => {
            document.querySelector("textarea").value = "";
            placeholder = "";
        })
        .catch(err => {
            console.log(err);
            window.location.reload();
        });
};

const sendMessagesWithEnter = (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendPublicMessage();
    }
};

const handleSubmit = (e) => {
    e.preventDefault();
    document.querySelector(".login__loading").classList.remove("hidden");
    document.querySelector(".login__form").classList.add("hidden");
    
    checkNick().then(() => {
        getMessages().then(() => {            
            setInterval(getMessages, 3000);
            setInterval(pingConnection, 5000);
        }).catch((err) => console.log(err))
    }).catch(() => {
        document.querySelector(".login__loading").classList.add("hidden");
        document.querySelector(".login__form").classList.remove("hidden");
    });
};

document.querySelector(".login__form button").onclick = handleSubmit;
document.querySelector(".chatbox__button").onclick = sendPublicMessage;
document.querySelector("textarea").onkeydown = sendMessagesWithEnter;