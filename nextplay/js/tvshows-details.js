// FOR RESPONSIVE NAVIGATION HEADER
window.addEventListener("scroll", function () {
    let nav = document.querySelector("nav");
    if (window.scrollY > 50) {
        nav.classList.add("nav-solid"); // Solid color after scrolling down
    } else {
        nav.classList.remove("nav-solid"); // Transparent at the top
    }
});

const apiKey = 'cd70bcb6c58d1e7c3a5324eafa6de36a'; // Your TMDB API Key
const baseUrl = 'https://api.themoviedb.org/3';

// Function to fetch TV shows based on category
const fetchTVShows = async (category, rowId) => {
    try {
        let url = '';
        switch (category) {
            case 'popular':
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&vote_count.gte=10000&vote_average=10&page=1`;
                break;
            case 'trending':
                url = `${baseUrl}/trending/tv/week?api_key=${apiKey}`;
                break;
            case 'mystery':
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&include_adult=true&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&vote_average.gte=8&vote_count.gte=1500&with_genres=9648`;
                break;
            case 'top_rated':
                url = `${baseUrl}/tv/top_rated?api_key=${apiKey}&language=en-US&page=1`;
                break;   
            case 'drama':
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&include_adult=true&language=en-US&page=1&sort_by=popularity.desc&vote_average.gte=6&vote_count.gte=0&with_genres=18&page=1`; // Genre ID 18 is Drama
                break;
            case 'comedy':
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&include_adult=true&language=en-US&page=1&sort_by=popularity.desc&vote_average.gte=5&vote_count.gte=3000&with_genres=35&page=1`; // Genre ID 35 is Comedy
                break;
            case 'romance':
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&include_adult=true&language=en-US&page=1&sort_by=popularity.desc&vote_average.gte=5&vote_count.gte=10&with_genres=10749&page=1`; // Genre ID 10749 is Romance
                break;
            case 'crime':
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&include_adult=true&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&vote_average.gte=8&vote_count.gte=3000&with_genres=80`; // Genre ID 80 is Crime
                break;     
            default:
                console.log('Unknown category');
                return;
        }

        const response = await fetch(url);
        const data = await response.json();
        console.log(data);  // Log data for debugging

        const tvShowCards = document.getElementById(rowId);
        tvShowCards.innerHTML = ''; // Clear existing posters

        if (data.results && data.results.length > 0) {
            data.results.forEach(tvShow => {
    const tvShowCard = document.createElement('div');
    tvShowCard.classList.add('tv-show-card');
    tvShowCard.style.position = 'relative';

    // Create the play button
    const playButton = document.createElement('div');
    playButton.classList.add('play-button');
    playButton.innerHTML = '<i class="fas fa-play"></i>';
                
    // Tv Show poster
    const tvShowPoster = document.createElement('img');
    tvShowPoster.classList.add('row__poster');
    tvShowPoster.src = `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`;
    tvShowPoster.alt = tvShow.name;

    // Star Rating
    const rating = document.createElement('div');
    rating.classList.add('tv-show-rating');
    rating.innerHTML = `<i class="fas fa-star"></i> ${tvShow.vote_average.toFixed(1)}`; // Star icon with rating

    // Append elements to the Tv Show card
    tvShowCard.appendChild(tvShowPoster);
    tvShowCard.appendChild(rating);
    tvShowCard.appendChild(playButton);            

    // Click event to navigate to details page
    tvShowCard.addEventListener('click', () => {
        window.location.href = `tvshows-details.html?id=${tvShow.id}`;
    });

    tvShowCards.appendChild(tvShowCard);
});
        } else {
            console.log(`No results for category: ${category}`);
        }
    } catch (error) {
        console.error('Error fetching TV shows:', error);
    }
};

const fetchBanner = async () => {
    try {
        // Fetch trending TV shows from the API
        const url = `${baseUrl}/trending/tv/week?api_key=${apiKey}&language=en-US`;
        const response = await fetch(url);
        const data = await response.json();

        // Get a random TV show from the list of trending TV shows
        const tvShow = data.results[Math.floor(Math.random() * data.results.length)];

        
        const banner = document.querySelector('.banner');
       

        // ----------------------
        // Update Banner with TV Show Data
        // ----------------------

        // Set the banner title to the selected TV show's name
        const bannerTitle = document.querySelector('.banner__title');
        bannerTitle.textContent = tvShow.name;

        // Shorten the description (limit to 150 characters for brevity)
        const bannerDescription = document.querySelector('.banner__description');
        bannerDescription.textContent = tvShow.overview.length > 150 ? tvShow.overview.substring(0, 150) + '...' : tvShow.overview;

        // Set the background image for the banner using the TV show's backdrop
        banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})`;

        // ----------------------
        // Play Button Functionality
        // ----------------------

        // Add event listener to the Play button to navigate to TV show details
        playButton.addEventListener('click', () => {
            window.location.href = `tvshows-details.html?id=${tvShow.id}`;
        });

    } catch (error) {
        console.error('Error fetching banner data:', error);
    }
};

// Load a random TV show for the banner when the page loads
window.onload = fetchBanner;

const initArrowNavigation = () => {
    // Find all rows of posters (e.g., popularTVShows, topRatedTVShows, etc.)
    const allRows = document.querySelectorAll('.row__posters');

    // Loop over each row and add the scroll functionality
    allRows.forEach(rowPosters => {
        const prevButton = rowPosters.parentElement.querySelector('.arrow-button.prev');
        const nextButton = rowPosters.parentElement.querySelector('.arrow-button.next');
        let scrollAmount = 0;
        const scrollStep = 220; // Adjust scroll step to your preference

        // Check if both buttons exist
        if (prevButton && nextButton) {
            // Scroll left (previous)
            prevButton.addEventListener('click', () => {
                // Ensure we don't scroll past the start
                if (scrollAmount > 0) {
                    scrollAmount -= scrollStep;
                    rowPosters.scrollTo({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }
            });

            // Scroll right (next)
            nextButton.addEventListener('click', () => {
                // Ensure we don't scroll past the end
                const maxScroll = rowPosters.scrollWidth - rowPosters.clientWidth;
                if (scrollAmount < maxScroll) {
                    scrollAmount += scrollStep;
                    rowPosters.scrollTo({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
};

// Toggle the search bar visibility when clicking the search icon
function toggleSearchBar() {
    const searchBar = document.querySelector('.search-bar');
    searchBar.classList.toggle('show');
}

// Close the search bar if clicked outside
document.addEventListener('click', function(event) {
    const searchBar = document.querySelector('.search-bar');
    const searchIcon = document.querySelector('.icon i.fa-search');
    const iconsContainer = document.querySelector('.icons-container');

    // Check if the click was outside the search bar or any of the icons
    if (!searchBar.contains(event.target) && !iconsContainer.contains(event.target)) {
        searchBar.classList.remove('show');
    }
});

function openSearchPage() {
    // Magbukas ug new page
    window.location.href = 'search.html';  // I-replace ang 'search.html' sa URL sa imong gustong page
}

const SERIES_ENDPOINTS = [
    { url: 'https://vidsrc.cc/v2/embed/tv/', name: 'Server 1' },
    { url: 'https://player.videasy.net/tv/', name: 'Server 2' },
    { url: 'https://embed.rgshows.me/api/1/tv/?id=', name: 'Server 3' },
    { url: 'https://vidsrc.cc/v3/embed/tv/', name: 'Server 4' },
    { url: 'https://embed.rgshows.me/api/3/tv/?id=', name: 'Server 5' },
    { url: 'https://rivestream.org/embed?type=tv&id=', name: 'Server 6' },
    { url: 'https://vidsrc.rip/embed/tv/', name: 'Server 7' },
    { url: 'https://apimocine.vercel.app/tv/', name: 'Server 8' },
    { url: 'https://vidfast.pro/tv/', name: 'Server 9' },
    { url: 'https://vidsrc.su/embed/tv/', name: 'Server 10' },
    { url: 'https://111movies.com/tv/', name: 'Server 11' },
    
];

const urlParams = new URLSearchParams(window.location.search);
const tvShowId = urlParams.get('id');
let currentServerIndex = 0;
let selectedSeason = null;
let selectedEpisode = null;

// Fetch comments when the page loads
window.onload = function () {
  getComments(); // Fetch comments when the page loads
};

console.log('TV Show ID:', tvShowId);

const fetchTVShowDetails = async () => {
    try {
        const url = `${baseUrl}/tv/${tvShowId}?api_key=${apiKey}&language=en-US`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tvShow = await response.json();

        // Poster and details
        document.getElementById('tv-show-poster').src = `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`;
        document.querySelector('.blurred-background').style.backgroundImage = `none`;
        document.getElementById('tv-show-description').textContent = tvShow.overview;

        // Rating stars
        const starContainer = document.getElementById('tv-show-rating');
        starContainer.innerHTML = '';
        const filledStars = Math.round(tvShow.vote_average / 2);
        const emptyStars = 5 - filledStars;
        for (let i = 0; i < filledStars; i++) {
            const star = document.createElement('span');
            star.classList.add('star', 'filled');
            starContainer.appendChild(star);
        }
        for (let i = 0; i < emptyStars; i++) {
            const star = document.createElement('span');
            star.classList.add('star', 'empty');
            starContainer.appendChild(star);
        }

        document.getElementById('air-date-text').textContent = `: ${tvShow.first_air_date}`;

        // Genres
        const genreContainer = document.getElementById('tv-show-genres');
        genreContainer.innerHTML = '';
        tvShow.genres.forEach(genre => {
            const span = document.createElement('span');
            span.classList.add('genre');
            span.textContent = genre.name;
            genreContainer.appendChild(span);
        });

        // 🔽 Fetch trailer
        const videoRes = await fetch(`${baseUrl}/tv/${tvShowId}/videos?api_key=${apiKey}&language=en-US`);
        const videoData = await videoRes.json();
        const trailer = videoData.results.find(v => v.type === "Trailer" && v.site === "YouTube");
        if (trailer) {
            const trailerIframe = document.getElementById('movie-iframe-trailer');
            trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}`;
            document.getElementById('movie-trailer-container').style.display = 'block';
        }


        // 🔽 Fetch and display cast
        const castRes = await fetch(`${baseUrl}/tv/${tvShowId}/credits?api_key=${apiKey}&language=en-US`);
        const castData = await castRes.json();
        const castContainer = document.getElementById('movie-cast');
        castContainer.innerHTML = '';
        castData.cast.slice(0, 6).forEach(actor => {
            const member = document.createElement('div');
            member.classList.add('cast-member');

            const img = document.createElement('img');
            img.src = actor.profile_path
                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                : 'https://via.placeholder.com/100x150?text=No+Image';
            member.appendChild(img);

            const name = document.createElement('p');
            name.textContent = actor.name;
            name.style.color = 'white';
            member.appendChild(name);

            castContainer.appendChild(member);
        });

        // 🔽 Seasons
        const seasonsContainer = document.getElementById('seasons-list');
        seasonsContainer.innerHTML = '';
        tvShow.seasons.forEach(season => {
            const li = document.createElement('li');
            const img = document.createElement('img');
            img.src = season.poster_path
                ? `https://image.tmdb.org/t/p/w200${season.poster_path}`
                : 'https://via.placeholder.com/100x150?text=No+Image';
            img.alt = `Season ${season.season_number}`;
            img.style.width = '50px';
            img.style.marginRight = '10px';
            li.appendChild(img);
            li.appendChild(document.createTextNode(`Season ${season.season_number}`));
            li.addEventListener('click', () => {
                selectedSeason = season.season_number;
                loadEpisodes(selectedSeason);
                toggleDropdown('seasons-list');
                document.getElementById('episode-btn').style.display = 'block';
            });
            seasonsContainer.appendChild(li);
        });

        // Functions already defined below...
        // loadEpisodes(seasonNumber), toggleDropdown(), playEpisode()...

    } catch (error) {
        console.error('Error fetching TV show details:', error);
    }
};


const fetchMoreLikeThis = async (tvShowId) => {
    try {
        const url = `${baseUrl}/tv/${tvShowId}/similar?api_key=${apiKey}&language=en-US`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const similarShowsContainer = document.getElementById('similar-shows-container');
        similarShowsContainer.innerHTML = ''; // Clear previous similar shows

        // Filter out shows with no poster image
        const validShows = data.results.filter(show => show.poster_path);

        // If no valid shows, show a message
        if (validShows.length === 0) {
            similarShowsContainer.innerHTML = '<p>No similar TV shows available.</p>';
            return;
        }

        // Loop through the valid TV shows and create grid items
        validShows.forEach(show => {
            const showItem = document.createElement('div');
            showItem.classList.add('similar-show'); // Add the grid item class

            // Movie Poster Image
            const showImageUrl = `https://image.tmdb.org/t/p/original${show.poster_path}`;
            const showImage = document.createElement('img');
            showImage.src = showImageUrl;
            showImage.alt = show.name || 'No Title';  // Default alt text if no name
            showImage.classList.add('similar-show-img'); // Add the image class

            showItem.appendChild(showImage); // Append the image

            // TV Show Title
            const showTitle = document.createElement('span');
            showTitle.textContent = show.name || 'Untitled TV Show'; // Fallback for title if missing
            showTitle.classList.add('show-title'); // Optional class for styling titles


            // Add click event to redirect to the selected show page
            showItem.addEventListener('click', () => {
                window.location.href = `?id=${show.id}`; // Redirect to the selected TV show
            });

            similarShowsContainer.appendChild(showItem); // Append to the container
        });
    } catch (error) {
        console.error('Error fetching similar TV shows:', error);
    }
};

fetchTVShowDetails();

// Fetch data for different TV show categories
fetchTVShows('popular', 'popularTVShows');
fetchTVShows('trending', 'trendingTVShows');
fetchTVShows('top_rated', 'topRatedTVShows');
fetchTVShows('mystery', 'mysteryTVShows');
fetchTVShows('drama', 'dramaTVShows');
fetchTVShows('comedy', 'comedyTVShows');
fetchTVShows('romance', 'romanceTVShows');
fetchTVShows('crime', 'crimeTVShows');

// Fetch banner details for TV Shows
fetchBanner();

// Initialize arrow buttons functionality after fetching the TV show data
document.addEventListener('DOMContentLoaded', initArrowNavigation);

// Close Button Logic: Redirect to tvshows-details.html
const closeButton = document.getElementById('close-button');

closeButton.addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirects to the tvshows-details page
});

window.addEventListener("load", function() {
    setTimeout(function() {
        document.getElementById("loading-screen").style.display = "none";
    }, 1000); // 3000ms = 3 seconds
});


// For sticky header when scrolling
    window.addEventListener("scroll", function () {
      let nav = document.querySelector("nav");
      if (window.scrollY > 50) {
        nav.classList.add("nav-solid"); // Add solid background when scrolled
      } else {
        nav.classList.remove("nav-solid"); // Remove solid background at top
      }
    });

    // Toggle menu visibility when menu button is clicked
document.getElementById("menu-btn").addEventListener("click", function() {
    document.getElementById("menu").classList.toggle("active");
});



// For Floating Message Close Function Start
function closeMessage() {
        document.getElementById("floating-message").style.display = "none";
    }
function redirectToV2() {
    window.location.href = "https://netplex-v2.pages.dev";
}
// For Floating Message Close Function End


// Fullscreen Button Movie Start //
function toggleFullscreen() {
  const iframe = document.querySelector('iframe');
  if (iframe.requestFullscreen) {
    iframe.requestFullscreen();
  } else if (iframe.mozRequestFullScreen) {
    iframe.mozRequestFullScreen();
  } else if (iframe.webkitRequestFullscreen) {
    iframe.webkitRequestFullscreen();
  } else if (iframe.msRequestFullscreen) {
    iframe.msRequestFullscreen();
  }
  // Rotate the screen to landscape mode (Only works on mobile browsers)
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(error => console.log("Orientation lock failed:", error));
    }  
}
// Fullscreen Button Movie End //









