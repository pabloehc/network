let showPosts = [];
let firstIndex = 0;

document.addEventListener('DOMContentLoaded', function () {
    
    const username = document.querySelector("#username");
    const followButton = document.querySelector('#follow');
    const unfollowButton = document.querySelector('#unfollow');
    const allPosts = document.querySelector('#all-posts');
    const followingPosts = document.querySelector('#following-page');
    const paginationElement = document.querySelector('.pagination');
    const nextButton = document.querySelector('#next');
    const previousButton = document.querySelector('#previous');

    if (followButton) {
        followButton.addEventListener('click', () => follow(username.innerHTML, 'true'));
    }
    if (unfollowButton) {
        unfollowButton.addEventListener('click', () => follow(username.innerHTML, 'false'));
    }

    if (username) {
        load_posts(username.innerHTML)
        nextButton.addEventListener('click', () => pagination('#user-posts', 'next'));
        previousButton.addEventListener('click', () => pagination('#user-posts', 'previous'));
    } else if (allPosts) {
        load_posts('all');
        previousButton.addEventListener('click', () => pagination('#all-posts', 'previous'));
        nextButton.addEventListener('click', () => pagination('#all-posts', 'next'));
    } else if (followingPosts) {
        load_posts('current');
        previousButton.addEventListener('click', () => pagination('#user-posts', 'previous'));
        nextButton.addEventListener('click', () => pagination('#user-posts', 'next'));
    } else {
        paginationElement.style.display = 'none';
    }
});

function load_posts(filter) {

    fetch(`/${filter}`)
    .then(response => response.json())
    .then(posts => {
        
        posts.forEach(post => {

            // Create elements
            const div = document.createElement('div');
            div.className = 'hide post rounded';
            
            const anchor = document.createElement('a');
            anchor.href = `/user/${post.user}`;

            const username = document.createElement('div');
            username.innerHTML = post.user;
            username.className = 'post-username';

            const timestamp = document.createElement('div');
            timestamp.innerHTML = post.timestamp;
            timestamp.className = 'timestamp';

            const content = document.createElement('div');
            content.innerHTML = post.content;

            const icon = document.createElement('i');
            icon.className = 'fa fa-heart-o';
            icon.innerHTML = ' ' + post.likes;

            anchor.append(username);
            div.append(anchor);
            div.append(content);
            div.append(icon);
            div.append(timestamp);
            
            showPosts.push(div);
        })

        if (filter === "all") {
            pagination('#all-posts', 'none');
            //document.querySelector('#all-posts').append(div);
        } else { 
            pagination('#user-posts', 'none');
            //document.querySelector('#user-posts').append(div);
        }  
    })
}

function follow(username, change) {
    fetch(`/user/${username}`, {
        method: 'PUT',
        body: JSON.stringify({
            follow: `${change}`
        })
      })
}

function pagination(appendHere, action) {
    
    if (action === 'next'){
        firstIndex += 10;
    } else if (action === 'previous') {
        firstIndex -= 10
    }

    let lastIndex = firstIndex +10
    const previousPosts = document.querySelectorAll('.hide')

    if (firstIndex === 0) {
        document.querySelector('#previous').style.display = 'none';
    } else if (lastIndex >= showPosts.length) {
        document.querySelector('#next').style.display = 'none';
        
    } else {
        document.querySelector('#next').style.display = 'block';
        document.querySelector('#previous').style.display = 'block';
    }

    if (previousPosts) {
        previousPosts.forEach( post => {
            post.style.display = 'none';
        })
    }

    for (let i = firstIndex; (i < showPosts.length) && (i < lastIndex); i++) {
        showPosts[i].style.display = 'block';
        document.querySelector(appendHere).append(showPosts[i]);
    }

}