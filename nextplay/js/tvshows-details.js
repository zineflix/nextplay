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
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&include_adult=true&language=en-US&page=1&sort_by=popularity.desc&vote_average.gte=6&vote_count.gte=0&with_genres=18&page=1`;
                break;
            case 'comedy':
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&include_adult=true&language=en-US&page=1&sort_by=popularity.desc&vote_average.gte=5&vote_count.gte=3000&with_genres=35&page=1`;
                break;
            case 'romance':
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&include_adult=true&language=en-US&page=1&sort_by=popularity.desc&vote_average.gte=5&vote_count.gte=10&with_genres=10749&page=1`;
                break;
            case 'crime':
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&include_adult=true&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&vote_average.gte=8&vote_count.gte=3000&with_genres=80`;
                break;     
            default:
                console.log('Unknown category');
                return;
        }

        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        const tvShowCards = document.getElementById(rowId);
        tvShowCards.innerHTML = '';

        if (data.results && data.results.length > 0) {
            data.results.forEach(tvShow => {
                const tvShowCard = document.createElement('div');
                tvShowCard.classList.add('tv-show-card');
                tvShowCard.style.position = 'relative';

                const playButton = document.createElement('div');
                playButton.classList.add('play-button');
                playButton.innerHTML = '<i class="fas fa-play"></i>';
                        
                const tvShowPoster = document.createElement('img');
                tvShowPoster.classList.add('row__poster');
                tvShowPoster.src = `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`;
                tvShowPoster.alt = tvShow.name;

                const rating = document.createElement('div');
                rating.classList.add('tv-show-rating');
                rating.innerHTML = `<i class="fas fa-star"></i> ${tvShow.vote_average.toFixed(1)}`;

                tvShowCard.appendChild(tvShowPoster);
                tvShowCard.appendChild(rating);
                tvShowCard.appendChild(playButton);            

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
        const url = `${baseUrl}/trending/tv/week?api_key=${apiKey}&language=en-US`;
        const response = await fetch(url);
        const data = await response.json();

        const tvShow = data.results[Math.floor(Math.random() * data.results.length)];
        const banner = document.querySelector('.banner');

        const bannerTitle = document.querySelector('.banner__title');
        bannerTitle.textContent = tvShow.name;

        const bannerDescription = document.querySelector('.banner__description');
        bannerDescription.textContent = tvShow.overview.length > 150 ? tvShow.overview.substring(0, 150) + '...' : tvShow.overview;

        banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})`;

        // Make sure playButton exists before adding event
        const playButton = document.querySelector('.banner .play-button');
        if (playButton) {
            playButton.addEventListener('click', () => {
                window.location.href = `tvshows-details.html?id=${tvShow.id}`;
            });
        }

    } catch (error) {
        console.error('Error fetching banner data:', error);
    }
};

const initArrowNavigation = () => {
    const allRows = document.querySelectorAll('.row__posters');

    allRows.forEach(rowPosters => {
        const prevButton = rowPosters.parentElement.querySelector('.arrow-button.prev');
        const nextButton = rowPosters.parentElement.querySelector('.arrow-button.next');
        let scrollAmount = 0;
        const scrollStep = 220;

        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => {
                if (scrollAmount > 0) {
                    scrollAmount -= scrollStep;
                    rowPosters.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                }
            });

            nextButton.addEventListener('click', () => {
                const maxScroll = rowPosters.scrollWidth - rowPosters.clientWidth;
                if (scrollAmount < maxScroll) {
                    scrollAmount += scrollStep;
                    rowPosters.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                }
            });
        }
    });
};

function toggleSearchBar() {
    const searchBar = document.querySelector('.search-bar');
    searchBar.classList.toggle('show');
}

document.addEventListener('click', function(event) {
    const searchBar = document.querySelector('.search-bar');
    const iconsContainer = document.querySelector('.icons-container');
    if (!searchBar.contains(event.target) && !iconsContainer.contains(event.target)) {
        searchBar.classList.remove('show');
    }
});

function openSearchPage() {
    window.location.href = 'search.html';
}

const SERIES_ENDPOINTS = [
    { url: 'https://vidsrc.cc/v2/embed/tv/', name: 'Server 1' },
    { url: 'https://player.videasy.net/tv/', name: 'Server 2' },
    { url: 'https://vidfast.pro/tv/', name: 'Server 3' },
    { url: 'https://vidsrc.su/embed/tv/', name: 'Server 4' },
    { url: 'https://111movies.com/tv/', name: 'Server 5' },
    { url: 'https://embed.rgshows.me/api/1/tv/?id=', name: 'Server 6' },
    { url: 'https://vidsrc.cc/v3/embed/tv/', name: 'Server 7' },
    { url: 'https://embed.rgshows.me/api/3/tv/?id=', name: 'Server 8' },
    { url: 'https://rivestream.org/embed?type=tv&id=', name: 'Server 9' },
    { url: 'https://vidsrc.rip/embed/tv/', name: 'Server 10' },
    { url: 'https://apimocine.vercel.app/tv/', name: 'Server 11' },
];

const urlParams = new URLSearchParams(window.location.search);
const tvShowId = urlParams.get('id');
let currentServerIndex = 0;
let selectedSeason = null;
let selectedEpisode = null;

window.onload = function () {
  getComments();
};

console.log('TV Show ID:', tvShowId);

const fetchTVShowDetails = async () => {
    try {
        const url = `${baseUrl}/tv/${tvShowId}?api_key=${apiKey}&language=en-US`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const tvShow = await response.json();

        document.getElementById('tv-show-poster').src = `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`;
        document.querySelector('.blurred-background').style.backgroundImage = `none`;
        document.getElementById('tv-show-description').textContent = tvShow.overview;

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

        const genreContainer = document.getElementById('tv-show-genres');
        genreContainer.innerHTML = '';
        tvShow.genres.forEach(genre => {
            const span = document.createElement('span');
            span.classList.add('genre');
            span.textContent = genre.name;
            genreContainer.appendChild(span);
        });

        const videoRes = await fetch(`${baseUrl}/tv/${tvShowId}/videos?api_key=${apiKey}&language=en-US`);
        const videoData = await videoRes.json();
        const trailer = videoData.results.find(v => v.type === "Trailer" && v.site === "YouTube");
        if (trailer) {
            const trailerIframe = document.getElementById('movie-iframe-trailer');
            trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}`;
            document.getElementById('movie-trailer-container').style.display = 'block';
        }

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

    } catch (error) {
        console.error('Error fetching TV show details:', error);
    }
};

// ✅ Added missing functions
const loadEpisodes = async (seasonNumber) => {
    try {
        const url = `${baseUrl}/tv/${tvShowId}/season/${seasonNumber}?api_key=${apiKey}&language=en-US`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const seasonData = await response.json();

        const episodesContainer = document.getElementById('episodes-list');
        episodesContainer.innerHTML = '';
        seasonData.episodes.forEach(episode => {
            const li = document.createElement('li');
            li.textContent = `Episode ${episode.episode_number}: ${episode.name}`;
            li.addEventListener('click', () => {
                selectedEpisode = episode.episode_number;
                playEpisode(selectedSeason, selectedEpisode);
                toggleDropdown('episodes-list');
            });
            episodesContainer.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching episodes:', error);
    }
};

function toggleDropdown(listId) {
    const list = document.getElementById(listId);
    list.classList.toggle('show');
}

function playEpisode(seasonNumber, episodeNumber) {
    const iframe = document.getElementById('movie-iframe');
    const server = SERIES_ENDPOINTS[currentServerIndex].url;
    iframe.src = `${server}${tvShowId}?season=${seasonNumber}&episode=${episodeNumber}`;
}

// Rest of your calls
fetchTVShowDetails();
fetchTVShows('popular', 'popularTVShows');
fetchTVShows('trending', 'trendingTVShows');
fetchTVShows('top_rated', 'topRatedTVShows');
fetchTVShows('mystery', 'mysteryTVShows');
fetchTVShows('drama', 'dramaTVShows');
fetchTVShows('comedy', 'comedyTVShows');
fetchTVShows('romance', 'romanceTVShows');
fetchTVShows('crime', 'crimeTVShows');
fetchBanner();
document.addEventListener('DOMContentLoaded', initArrowNavigation);

const closeButton = document.getElementById('close-button');
closeButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});

window.addEventListener("load", function() {
    setTimeout(function() {
        document.getElementById("loading-screen").style.display = "none";
    }, 1000);
});

document.getElementById("menu-btn").addEventListener("click", function() {
    document.getElementById("menu").classList.toggle("active");
});

function closeMessage() {
    document.getElementById("floating-message").style.display = "none";
}
function redirectToV2() {
    window.location.href = "https://netplex-v2.pages.dev";
}

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
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(error => console.log("Orientation lock failed:", error));
    }  
}
