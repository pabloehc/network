document.addEventListener('DOMContentLoaded', function () {
    
    const username = document.querySelector("#username");
    if (username) {
        load_posts(username.innerHTML)

    } else {
        load_posts('all');
    }
});

function load_posts(filter) {
    fetch(`/${filter}`)
    .then(response => response.json())
    .then(posts => {
        
        posts.forEach(post => {

            // Create elements
            const div = document.createElement('div');
            div.className = 'post rounded';
            
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
            
            if (filter === "all") {
                document.querySelector('#all-posts').append(div);
            } else {
                document.querySelector('#user-posts').append(div);
            }
        })
    })
}