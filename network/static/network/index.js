document.addEventListener('DOMContentLoaded', function () {
    
    load_posts();

});

function load_posts() {
    fetch("/posts")
    .then(response => response.json())
    .then(posts => {
        
        posts.forEach(post => {

            // Create elements
            const div = document.createElement('div');
            div.className = 'post rounded';
            
            const username = document.createElement('div');
            username.innerHTML = post.user;
            username.className = 'username';

            const timestamp = document.createElement('div');
            timestamp.innerHTML = post.timestamp;
            timestamp.className = 'timestamp';

            const content = document.createElement('div');
            content.innerHTML = post.content;

            div.append(username);
            div.append(content);
            div.append(timestamp);
            
            document.querySelector('.body').append(div);
        })
    })
}