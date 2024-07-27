document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from the JSON file
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Log data to check if it's fetched correctly
            window.travelData = data; // Store data globally for later use
        })
        .catch(error => console.error('Error fetching data:', error));

    document.getElementById('search-button').addEventListener('click', searchRecommendations);
    document.getElementById('reset-button').addEventListener('click', resetRecommendations);
});

function searchRecommendations() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const recommendations = [];

    if (searchTerm.includes('beach')) {
        recommendations.push(...getRecommendations('beaches'));
    } else if (searchTerm.includes('temple')) {
        recommendations.push(...getRecommendations('temples'));
    } else if (searchTerm.includes('country') || searchTerm.includes('countries')) {
        recommendations.push(...getRecommendations('countries', searchTerm));
    }

    displayRecommendations(recommendations);
}

function getRecommendations(type, searchTerm = '') {
    const data = window.travelData[type] || window.travelData.countries;

    if (type === 'countries') {
        return data.flatMap(country => 
            country.name.toLowerCase().includes(searchTerm) || 
            country.cities.some(city => city.name.toLowerCase().includes(searchTerm)) 
                ? [{ name: country.name, imageUrl: '', description: '', ...country }, ...country.cities] 
                : []
        );
    }

    return data;
}

function displayRecommendations(recommendations) {
    const recommendationList = document.getElementById('recommendation-list');
    recommendationList.innerHTML = '';

    recommendations.forEach(item => {
        const recommendationDiv = document.createElement('div');
        recommendationDiv.classList.add('recommendation');

        const image = document.createElement('img');
        image.src = item.imageUrl;
        image.alt = item.name;
        recommendationDiv.appendChild(image);

        const name = document.createElement('h4');
        name.textContent = item.name;
        recommendationDiv.appendChild(name);

        const description = document.createElement('p');
        description.textContent = item.description;
        recommendationDiv.appendChild(description);

        const visitButton = document.createElement('button');
        visitButton.textContent = 'Visit';
        recommendationDiv.appendChild(visitButton);

        recommendationList.appendChild(recommendationDiv);
    });

    document.getElementById('results').style.display = 'block';
}

function resetRecommendations() {
    document.getElementById('search-bar').value = '';
    document.getElementById('recommendation-list').innerHTML = '';
    document.getElementById('results').style.display = 'none';
}
