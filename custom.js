// Initialize Swiper
const swiper = new Swiper(".swiper-container", {
  loop: true, // Enable continuous loop mode
  autoplay: {
    delay: 5000, // Slide change delay in milliseconds
    disableOnInteraction: false, // Continue autoplay after user interactions
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true, // Make pagination bullets clickable
  },
  effect: "fade", // Optional: Add fade effect for smooth transitions
  fadeEffect: {
    crossFade: true,
  },
});

// Existing Movie Database Functionality

const API_KEY = "74b14366"; // Use your API key directly
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const movieList = document.getElementById("movie-list");
const movieDetails = document.getElementById("movie-details");

// Fetch movie data based on user query
const fetchMovies = async (query) => {
  try {
    movieList.innerHTML = "<p>Loading...</p>";
    const response = await fetch(`${BASE_URL}&s=${encodeURIComponent(query)}`);
    const data = await response.json();
    if (data.Response === "True") {
      displayMovies(data.Search);
      scrollToResults(); // Scroll to results after displaying
    } else {
      movieList.innerHTML = `<p>No results found for "${query}"</p>`;
    }
  } catch (error) {
    movieList.innerHTML = `<p>Error fetching data. Please try again later.</p>`;
    console.error(error);
  }
};

// Displays list of movies
const displayMovies = (movies) => {
  movieList.innerHTML = "";
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    // Handle missing poster
    const poster =
      movie.Poster !== "N/A" ? movie.Poster : "images/no-image-available.png";

    movieCard.innerHTML = `
            <img src="${poster}" alt="${movie.Title}">
            <div class="movie-info">
                <div>
                    <h3>${movie.Title}</h3>
                    <p>${movie.Year}</p>
                </div>
                <button onclick="fetchMovieDetails('${movie.imdbID}')">Details</button>
            </div>
        `;
    movieList.appendChild(movieCard);
  });
};

// Fetches detailed movie information
const fetchMovieDetails = async (id) => {
  try {
    movieDetails.classList.remove("hidden");
    const response = await fetch(`${BASE_URL}&i=${id}&plot=full`);
    const movie = await response.json();
    if (movie.Response === "True") {
      displayMovieDetails(movie);
    } else {
      movieDetails.innerHTML = `<p>Movie details not found.</p><button onclick="closeMovieDetails()">Close</button>`;
    }
  } catch (error) {
    movieDetails.innerHTML = `<p>Error fetching movie details. Please try again later.</p><button onclick="closeMovieDetails()">Close</button>`;
    console.error(error);
  }
};

// Displays movie details
const displayMovieDetails = (movie) => {
  const poster =
    movie.Poster !== "N/A" ? movie.Poster : "images/no-image-available.png";
  movieDetails.innerHTML = `
        <h2>${movie.Title} (${movie.Year})</h2>
        <img src="${poster}" alt="${movie.Title}">
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        <p><strong>Cast:</strong> ${movie.Actors}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Runtime:</strong> ${movie.Runtime}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Ratings:</strong></p>
        <ul>
            ${movie.Ratings.map(
              (rating) => `<li>${rating.Source}: ${rating.Value}</li>`
            ).join("")}
        </ul>
        <button onclick="closeMovieDetails()">Close</button>
    `;
};

// Close movie details view
const closeMovieDetails = () => {
  movieDetails.classList.add("hidden");
  movieDetails.innerHTML = "";
};

// Scroll to the movie list results
const scrollToResults = () => {
  const resultsSection = document.getElementById("movie-list");
  resultsSection.scrollIntoView({ behavior: "smooth" });
};

// Close modal when clicking outside the details
window.addEventListener("click", (e) => {
  if (e.target === movieDetails) {
    closeMovieDetails();
  }
});

searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchMovies(query);
  }
});

// Allow search on Enter key press
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    searchButton.click();
  }
});
