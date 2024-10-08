document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('storyForm');
    const comicContainer = document.getElementById('comicContainer');
    const storyElement = document.getElementById('story');
    const visualSummaryElement = document.getElementById('visualSummary');
    const generateButton = document.getElementById('generateButton');
    const resultsContainer = document.getElementById('results');

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            generateStory();
        });
    } else {
        console.error('Story form not found');
    }

    function generateStory() {
        const circumstance = document.getElementById('circumstance').value;
        const protagonist = document.getElementById('protagonist').value;

        if (!circumstance || !protagonist) {
            alert('Please enter a circumstance and select a protagonist.');
            return;
        }

        comicContainer.innerHTML = '';
        storyElement.textContent = 'Generating...';
        visualSummaryElement.textContent = '';
        generateButton.disabled = true;
        resultsContainer.style.display = 'none';

        fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'circumstance': circumstance,
                'protagonist': protagonist
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.comic_url) {
                const img = document.createElement('img');
                img.src = data.comic_url;
                img.alt = 'Generated Comic';
                img.className = 'comic-image';
                comicContainer.appendChild(img);
            }
            if (data.side_profile_url) {
                const sideProfileImg = document.createElement('img');
                sideProfileImg.src = data.side_profile_url;
                sideProfileImg.alt = 'Character Side Profile';
                sideProfileImg.className = 'character-image';
                comicContainer.appendChild(sideProfileImg);
            }
            if (data.headshot_url) {
                const headshotImg = document.createElement('img');
                headshotImg.src = data.headshot_url;
                headshotImg.alt = 'Character Headshot';
                headshotImg.className = 'character-image';
                comicContainer.appendChild(headshotImg);
            }
            if (data.story) {
                storyElement.textContent = data.story;
            }
            if (data.visual_summary) {
                visualSummaryElement.textContent = data.visual_summary;
            }
            generateButton.disabled = false;
            resultsContainer.style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
            storyElement.textContent = `An error occurred: ${error.message}. Please try again.`;
            generateButton.disabled = false;
        });
    }
});

console.log('Script loaded');