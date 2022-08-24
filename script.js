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