
const userUrl = window.location.pathname;
const username = document.getElementById('username').innerText;
function getQuestions(){
    let questions = document.getElementById('questions');
    console.log(userUrl);
    let questionCont = document.getElementById('questionsCont')
    fetch( '/u/'+ username +'/question')
        .then(res => res.json())
        .then(data => {
            if(data.status == 'success'){
                data.questions.forEach(question => {
                    console.log(question);
                    let ask;
                    if(question.isAnonymous) ask = "<a class='nav-link px-0 '>Anonymous</a>"
                    else ask = `<a href="/u/${question.whoAsked.username}" class='nav-link px-0'>${question.whoAsked.username}</a>`;
                    questionCont.innerHTML += 
                    `
                    <div class="card w-75 text-start my-3" id="question-${question._id}">
                        <div class="card-body">
                            ${ask}
                            <p class="card-text">${question.content}</p>
                            <a class="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#answer-${question._id}" role="button" aria-expanded="true" aria-controls="collapseExample">
                                Answer
                            </a>
                        </div>
                        <div class="card-footer">
                            <div class="collapse" id="answer-${question._id}">
                                    <textarea name="answer my-2" class="form-control" id="answerContent-${question._id}"></textarea>
                                    <button class="btn btn-primary my-2" onclick="submitAnswer('${question._id}')">Submit</button>
                            </div>
                        </div>
                    </div>
                    `;
                });
            }    
        });
}

function submitAnswer(questionId){
    let answerTextArea = document.getElementById(`answerContent-${questionId}`);
    console.log(answerTextArea);
    if(answerTextArea.value == '') return;
    postData(`/u/${username}/question/${questionId}`, `answer=${answerTextArea.value}`)
        .then( res => {
            if(res.status == 'success'){
                document.getElementById(`question-${questionId}`).remove();
            }
        });
}


function setup(){
    getQuestions();
}

setup();