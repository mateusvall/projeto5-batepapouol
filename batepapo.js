function getMessages(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(processarResposta);
}

function processarResposta(resposta){
    const all_messages = resposta.data;
    const messageArea = document.querySelector('.message-area');
    messageArea.innerHTML = ""
    for(let index=0;index<all_messages.length;index++){
            
            if(all_messages[index].type == 'status'){
                messageArea.innerHTML += 
                `
                <div class="message-box enter"> 
                    <div class="message-content">
                        <span class="time">(${all_messages[index].time})</span>
                        <span class="user">${all_messages[index].from}</span>
                        ${all_messages[index].text}
                    </div>
                </div>
                `
            }else if(all_messages[index].type == 'message'){
                messageArea.innerHTML += 
                `
                <div class="message-box"> 
                    <div class="message-content">
                        <span class="time">(${all_messages[index].time})</span>
                        <span class="user">${all_messages[index].from}</span>
                        para
                        <span class="user">${all_messages[index].to}:</span>
                        ${all_messages[index].text}
                    </div>
                </div>
                `
            } else if(all_messages[index].type == 'private_message'){
                if(all_messages[index].to === username){
                    messageArea.innerHTML += 
                    `
                    <div class="message-box reserved"> 
                        <div class="message-content">
                            <span class="time">(${all_messages[index].time})</span>
                            <span class="user">${all_messages[index].from}</span>
                            reservadamente para
                            <span class="user">${all_messages[index].to}:</span>
                            ${all_messages[index].text}
                        </div>
                    </div>
                    `
                }
            } 
    }
    const qtyMessages = document.querySelectorAll('.message-content').length;
    const lastMessage = document.querySelectorAll('.message-content')[qtyMessages-1];
    lastMessage.scrollIntoView();
}

let  username = "";

function newUser(){
    username = prompt("Digite o seu lindo nome.")
    const user_posted = {
        name: username
    }
    const request = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', user_posted)

    request.then(enterSucess)
    request.catch(failToenter)

}

function enterSucess(){
    getMessages();
}

function failToenter(error){
    const statusCode = error.response.status;
    if (statusCode == 400){
        alert("O nome já está em uso. Por favor, escolha outro nome");
        newUser();
    }
    
}

function connectionOk(){
    const user_posted ={
        name: username
    }

    const request = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', user_posted);

}

function sendMessage(){
    const message = document.querySelector('.send-message input').value;

    const messageAPI = {
        from: username,
        to: "Todos",
        text: message,
        type: "message"
    }
    const request = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', messageAPI);

    request.then(getMessages)

    document.querySelector('.send-message input').value = '';

}



newUser();
setInterval(connectionOk, 5000);
setInterval(getMessages, 3000);