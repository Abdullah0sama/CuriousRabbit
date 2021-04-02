
function getDiscoverFeed(){
    feedCont = document.getElementById('discoverFeed');
    fetch('/discoverFeed')
        .then(res => res.json())
        .then(data => {
            if(data.status == 'success'){
                data.feed.forEach(question => {

                    let ask;
                    if(question.isAnonymous) ask = '<a class="nav-link px-0" >Anonymous</a>';
                    else ask = `<a href="/u/${question.whoAsked.username}" class="nav-link px-0">${question.whoAsked.username}</a>`;
    
                    feedCont.innerHTML += 
                    `
                    <div class="card text-start my-3 w-75">
                            <div class="card-header">
                                ${ask}
                                <p class="card-text">${question.content}</p>
                            </div>
                            <div class="card-body">
                                <a class="nav-link px-0" href="/u/${question.user.username}">${question.user.username}</a>
                                <p class="card-text">${question.answer}</p>
                            </div>
                    </div>
                    `;
                    
                });
            }
        })
}

function setup(){
    getDiscoverFeed();
}

setup();