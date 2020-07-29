document.addEventListener('DOMContentLoaded', function () {
    
    load_posts();

});

function load_posts() {
    fetch("/posts")
    .then(response => response.json())
    .then(posts => {
        
        posts.forEach(post => {
            const user = post.user;
            const content = post.content;
            const timestamp = post.timestamp;

            const div = document.createElement('div');
            div.className = 'post';
            div.innerHTML = `<p>${user}</p>
                            <p>${timestamp}</p>
                            <p>${content}</p>`;
            document.querySelector('.body').append(div);
        })
    })
}