const userUrl = window.location.pathname;
const usernameDisplay = document.getElementById('username');
const username = (usernameDisplay == null) ? null : usernameDisplay.innerText;

// Posts a request using data as body 
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            // 'Content-Type': 'application/json'
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: (data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

function getLikeStatus(questionId){
    fetch(userUrl + '/question/' + questionId + '/like')
        .then(res => res.json())
        .then(data => {
            if(data.status == 'success'){
                let likeBtn = document.getElementById('like-' + questionId);
                if(data.likeStatus.isLiked == true){
                    likeBtn.setAttribute('class', 'text-primary');
                    likeBtn.addEventListener('click', unlike(questionId));
                }else{
                    likeBtn.setAttribute('class', 'text-secondary');
                    likeBtn.addEventListener('click', like(questionId));
                }
                document.getElementById('likesCount-' + questionId).innerText = data.likeStatus.count;
            }
        })
}
function like(questionId){
    return function handler(){
        postData(userUrl + "/question/" + questionId + '/like')
        getLikeStatus(questionId);
        this.removeEventListener('click', handler);
    }
}
function unlike(questionId){
    return function handler(){
        postData(userUrl + "/question/" + questionId + '/unlike');
        getLikeStatus(questionId);
        this.removeEventListener('click', handler);
    }

}