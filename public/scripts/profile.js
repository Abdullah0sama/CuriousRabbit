
// Gets user answered question and adds them in div with id 'questions'
function getAnsweredQuestions(){
    fetch(userUrl + '/answeredQuestions')
    .then(response => response.json())
    .then( data => {
        if(data.status == 'success'){
                data.questions.forEach(question => {

                    let ask;
                    if(question.isAnonymous) ask = '<a class="nav-link px-0" >Anonymous</a>'
                    else ask = `<a href="/u/${question.whoAsked.username}" class="nav-link px-0">${question.whoAsked.username}</a>`;

                    document.getElementById('answers').innerHTML += `
                    <div class="card text-start my-3">
                        <div class="card-header">
                            ${ask}
                            <p class="card-text">${question.content}</p>
                        </div>
                        <div class="card-body">
                            <a class="nav-link px-0" href="/u/${question.user.username}">${question.user.username}</a>
                            <p class="card-text">${question.answer}</p>

                            <a id="like-${question._id}" class="text-secondary" type="button">
                            <i class="fas fa-heart"></i>   <span id="likesCount-${question._id}">${question.likes}</span>
                            </a>

                        </div>
                    </div>
                    `;
                    if(username) getLikeStatus(question._id);
                });
        }
        })
        .catch( e => console.log(e));   
}

//gets the status of friendship between the visiting user and the visited user
function getFollowStatus(){
    let followBtn = document.getElementById('followBtn');
    if(followBtn == null) return;
    
    fetch(userUrl + '/follow')
        .then(response => response.json())
        .then(data => {
            if(data.status == 'success'){
                
                if(data.isFollowed){
                    followBtn.innerText = 'Followed';
                    followBtn.setAttribute('class', 'btn btn-success unfollow');
                    followBtn.setAttribute('onclick', 'unfollow()');

                    followBtn.addEventListener('mouseover', setTextToUnfollow);
                    followBtn.addEventListener('mouseleave', setTextToFollowed);

                }else{
                    followBtn.innerText = 'Follow';
                    followBtn.setAttribute('class', 'btn btn-light');
                    followBtn.setAttribute('onclick', 'follow()');
                    followBtn.removeEventListener('mouseleave', setTextToFollowed);
                    followBtn.removeEventListener('mouseover', setTextToUnfollow);

                }
            }
        })
}


//get user followers list and adds them and refreshs followers count
function getFollowers(){
    fetch(userUrl + '/followers')
        .then(res => res.json())
        .then(data => {
            if(data.status == 'success'){
                popu('followers', data);
            }
        });
}
function popu (name, data){
    let res = data[name];
                document.getElementById(name + 'Count').innerText = res.count;

                let container = document.getElementById(name + 'Names');
                container.innerHTML = '';

                if(res.count){
                    res.usernames.forEach(username => {
                        container.innerHTML += `<a class="list-group-item" href="/u/${username}">${username}</a>`;
                    });
                }
}
//gets user following list and adds them and refreshes following count
function getFollowings(){
    fetch(userUrl + '/following')
        .then(res => res.json())
        .then(data => {
            if(data.status == 'success'){
                popu('following', data);
            }
        });
}

// follows user and change the status of friendship
function follow(){
    postData(userUrl + '/follow')
    .then(data => {
        if(data.status == 'success') getFollowStatus();
    });
}

// unfollows user and changes the status of friendship
function unfollow(){
    postData(userUrl + '/unfollow')
    .then(data => {
        if(data.status == 'success') getFollowStatus();
    });
}

// Sends a question to user and empties the text area if it is successful
function sendQuestion(event){
    event.preventDefault();
    let formData = new FormData(event.target);
    let sendData = {
        isAnonymous: (formData.get('isAnonymous')) ? true : false ,
        content: formData.get('content')
    };
    if(sendData.content == '') return;
    
    postData(userUrl + '/question', 'content=' + encodeURIComponent(sendData.content) + '&isAnonymous=' + encodeURIComponent(sendData.isAnonymous) )
        .then(res => {
            if(res.status == "success") {
                document.getElementById('questionContent').value = '';
            };
        })
        .catch(err => console.log(err));
}

// helpers for getFollowStatus
function setTextToFollowed(event){
    event.target.innerText = "Followed";
}
function setTextToUnfollow(event){
    event.target.innerText = "Unfollow";
}




function checkAnonymousity(event){
    // console.log(event.originalTarget.checked);
}

// Setups the page at startup
function setup(){
    getFollowStatus();
    getAnsweredQuestions();


    document.getElementById('anonymousToggle').addEventListener('change', checkAnonymousity);
    document.getElementById('questionForm').addEventListener('submit', sendQuestion);
    
    document.getElementById('followersLabel').addEventListener('click', getFollowers);
    document.getElementById('followingsLabel').addEventListener('click', getFollowings);
    
}
setup(); 