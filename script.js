// This code waits for the HTML document to fully load and sets up event listeners for interaction.
document.addEventListener('DOMContentLoaded', () => {

    // Get references to fetch button and season info container.
    const fetchButton = document.getElementById('fetchButton');
    const seasonInfoDiv = document.getElementById('seasonInfo');

    // Check if both the fetch button and season info container exist in the document.
    if (fetchButton && seasonInfoDiv) {

        // Attach a click event listener to the fetch button.
        fetchButton.addEventListener('click', fetchSeasonData);

        // Attach click and submit event listeners to the season info container.
        seasonInfoDiv.addEventListener('click', event => {
            if (event.target.classList.contains('like-button')) {
                likeSeason(event);
            }
            if (event.target.classList.contains('star')) {
                updateStarRating(event); 
            }
            if (event.target.classList.contains('submit-star-rating')) {
                submitStarRating(event);
            }
        });

        seasonInfoDiv.addEventListener('submit', event => {
             // Handle comment submission on form submit.
            if (event.target.classList.contains('comment-form')) {
                submitComment(event);
            }
        });

    } else {
        // If either the fetch button or season info container is missing, log an error.
        console.error('Cannot find the fetchButton or seasonInfoDiv element.');
    }
});

// Function to fetch season data from an API.
function fetchSeasonData() {
    try {
        fetch("https://api.tvmaze.com/shows/1/seasons")
            .then(response => response.json())
            .then(data => {
                // Modify the fetched data by adding initial values and display it.
                data.forEach(season => {
                    season.episodes = 10;
                    season.likes = 0;  // Initialize likes for each season
                });
                displaySeasonInfo(data);
            })
            .catch(error => {
                console.error('Error fetching season data:', error);
            });
    } catch (error) {
        console.error('Error fetching season data:', error);
    }
}
// Define descriptions for each season.
const seasonDescriptions = [
    "Rise of the Arachnid Hero: In the first season, we witness the transformation of Peter Parker into the iconic superhero Spider-Man after a fateful encounter with a genetically altered spider. As he grapples with his newfound powers and the responsibility that comes with them, Peter navigates high school life, tackles street-level crime in New York City, and battles against emerging villains like the Vulture and the Green Goblin. This season showcases the growth of Spider-Man's abilities and introduces key characters such as Gwen Stacy, Mary Jane Watson, and J. Jonah Jameson.",
    "Web of Intrigue: The second season delves deeper into Peter Parker's double life as he struggles to balance his responsibilities as Spider-Man with his personal relationships. The emergence of powerful foes like Doctor Octopus, the Lizard, and the symbiote suit challenges Peter both physically and emotionally. Additionally, this season explores the intricate web of conspiracies and connections that threaten not only Peter but the entire city. As Spider-Man faces a growing gallery of adversaries, he must also confront the darker aspects of his own powers.",
    "Ultimate Showdown: In the final season, the stakes reach their peak as Spider-Man faces his greatest adversaries yet, including the Sinister Six led by the enigmatic Master Planner. The secrets of Peter Parker's past and the true extent of his abilities come to light, pushing him to his limits both as a hero and a person. Balancing personal sacrifices and heroism, Spider-Man must make critical decisions that will shape the future of New York and define his legacy. The season culminates in an epic battle that will determine the fate of the city and the hero it needs.Throughout the series, The Spectacular Spider-Man explores themes of heroism, sacrifice, identity, and the burdens of power, offering a thrilling and character-driven narrative that captivates both dedicated fans and newcomers to the Spider-Man saga."
];
// Function to display season information in the HTML document.
function displaySeasonInfo(data) {
    const seasonInfoDiv = document.getElementById('seasonInfo');
    seasonInfoDiv.innerHTML = '';

    data.forEach((season, index) => {
        const seasonElement = document.createElement('div');

        // Add a description paragraph for each season.
        const seasonDescription = document.createElement('p');
        seasonDescription.textContent = seasonDescriptions[index];

// Create a new season element and add it to the season info container.
        const commentsId = `comments-${index + 1}`;
        seasonElement.id = commentsId;
        seasonElement.classList.add('season-element');
        seasonElement.innerHTML += `<h3>Season ${index + 1}</h3>`;

        // Add the description paragraph.
        seasonElement.innerHTML += `<p>${seasonDescriptions[index]}</p>`;
        // Add the rest of the season information.(Information that would have otherwise been in an html file)
        seasonElement.innerHTML += `
        <p>Episodes: ${season.episodes}</p>
        <p>Premiere Date: ${season.premiereDate}</p>
        <p>End Date: ${season.endDate}</p>
        <p class="comments-heading">Comments:</p>
        <ul id="comments-${index + 1}"></ul>
        <form class="comment-form">
        <textarea name="comment" placeholder="Leave a comment"></textarea>
        <button type="submit">Submit</button>
        </form>
        <p class="likes">Likes: <span id="likes-${index}" data-likes="${season.likes}">${season.likes}</span> <button class="like-button">♡</button></p>
        <p> <p class="rating">
        Rating: 
    <button class="star" data-rating="1">☆</button>
    <button class="star" data-rating="2">☆</button>
    <button class="star" data-rating="3">☆</button>
    <button class="star" data-rating="4">☆</button>
    <button class="star" data-rating="5">☆</button>
    <button class="submit-star-rating">Rate</button>
     </p>
    <img class="season-icon" src="images/IP${index + 2}.gif" alt="Season ${index + 3} icon">`;
        seasonInfoDiv.appendChild(seasonElement);
    });
}

// Function to handle liking a season.
function likeSeason(event) {
    const likeButton = event.target;
    const likeSpan = likeButton.parentElement.querySelector('span');
    if (likeSpan) {
        const currentLikes = parseInt(likeSpan.getAttribute('data-likes'));
        const seasonIndex = parseInt(likeSpan.id.split('-')[1]);

        if (likeButton.textContent === '♡') {
            likeButton.textContent = '♥';
            likeButton.classList.add('clicked');
            likeSpan.textContent = currentLikes + 1;
        } else {
            likeButton.textContent = '♡';
            likeButton.classList.remove('clicked');
            likeSpan.textContent = currentLikes - 1;
        }

        likeSpan.setAttribute('data-likes', parseInt(likeSpan.textContent));
    }
}

// Function to update the star rating of a season.
function updateStarRating(event) {
    const star = event.target;
    const rating = parseInt(star.getAttribute('data-rating'));
    const parentDiv = event.target.closest('.season-element');

    if (parentDiv) {
        const stars = parentDiv.querySelectorAll('.star');

        // Update the rating of all the stars.
        stars.forEach(star => {
            if (parseInt(star.getAttribute('data-rating')) <= rating) {
                star.classList.add('clicked');
                star.textContent = '★';
            } else {
                star.classList.remove('clicked');
                star.textContent = '☆';
            }
        });

        // Store the new selected rating.
        parentDiv.setAttribute('data-selected-rating', rating);
    }
}
// Function to submit star rating for a season.
function submitStarRating(event) {
    const parentDiv = event.target.closest('.season-element');
    if (parentDiv) {
        const starRating = parseInt(parentDiv.getAttribute('data-selected-rating'));
        const seasonIndex = parseInt(parentDiv.id.split('-')[1], 10) - 1;

        // console.log('Star Rating Submitted:', starRating);
        // console.log('Season Index:', seasonIndex);
    }
}

// Function to handle the submission of comments.
function submitComment(event) {
    // Prevent the default form submission behavior.
    event.preventDefault();

    // Get the target element (the form).
    const target = event.target;

    // Find the closest ancestor of the form with the class 'season-element'.
    const parentDiv = target.closest('.season-element');

    // Check if the parent div is valid and has an id that starts with 'comments-'.
    if (!parentDiv) {
        console.error('Parent div not found for the target element.');
        return;
    }
     
    const parentDivId = parentDiv.id;
    if (!parentDivId || !parentDivId.startsWith('comments-')) {
        console.error(`Invalid parent div id for the target element: ${parentDivId}`);
        return;
    }

    // Extract the season index from the parent div's id.
    const seasonIndex = parseInt(parentDivId.split('-')[1], 10) - 1;

    // Check if the season index is valid.
    if (!isNaN(seasonIndex) && seasonIndex >= 0) {
        // Get the comment text from the form's textarea.
        const commentTextArea = target.querySelector('textarea[name="comment"]');
        const commentText = commentTextArea.value;

         // Assuming you have an existing comments list element (ul) in your HTML.
         const commentsList = parentDiv.querySelector('ul');
         const commentListItem = document.createElement('li');
         commentListItem.textContent = commentText;

         // Add CSS classes for styling (italic and custom color).
        commentListItem.classList.add('comment-item');

         // Append the comment list item to the comments list.
        commentsList.appendChild(commentListItem);
         // Clear the textarea after submitting.
         commentTextArea.value = '';
        
        // Log or send the comment text and star rating for submission.
        // console.log('Comment:', commentText);
        // console.log('Season Index:', seasonIndex);

        
    } else {
        console.error('Invalid season index.');
    }
}
