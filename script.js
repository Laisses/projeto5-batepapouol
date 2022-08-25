const joinChatRoom = () => {
    const URL = "https://mock-api.driven.com.br/api/v6/uol/participants";    
    const name = prompt("Qual o seu nome?");
    
    const dado = {
        name,
    };
    
    axios.post(URL, dado)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            if (err.response.status === 400) {
                alert("Esse nick já está em uso! Escolha outro.");
                joinChatRoom();
            }
        });
};



const getMessages = () => {
    const URL = "https://mock-api.driven.com.br/api/v6/uol/messages";
    axios.get(URL)
        .then(res => {
            createMessages(res.data);
            document.querySelector("body").scrollIntoView(false);
            console.log("oi");
        })
        .catch(err => {
            console.log(err);
        });
};
//setInterval(getMessages, 3000);

const createMessages = messages => {
    const ul = document.querySelector(".msg");

    messages.forEach(message => {
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



