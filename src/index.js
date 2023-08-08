// script.js
import notiflix from './notiflix.js';
const { Notiflix, Notify, Report, Confirm, Loading, Block } = notiflix;



const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchQueryInput = form.elements.searchQuery;

const API_KEY = '38626899-515234956be965e38487a76e6';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 20;

let page = 1;
let searchQuery = '';

async function fetchImages() {
  try {
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    return null;
  }
}

function renderImages(images) {
  const cardsHtml = images.map((image) => {
    return `
      <div class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${image.likes}</p>
          <p class="info-item"><b>Views:</b> ${image.views}</p>
          <p class="info-item"><b>Comments:</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
      </div>
    `;
  });

  gallery.insertAdjacentHTML('beforeend', cardsHtml.join(''));
}

function clearGallery() {
  gallery.innerHTML = '';
}

function showNoResultsMessage() {
  notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function showEndOfResultsMessage() {
  notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}

async function searchImages(event) {
  event.preventDefault();
  searchQuery = searchQueryInput.value.trim();
  if (!searchQuery) return;

  page = 1;
  clearGallery();

  const images = await fetchImages();

  if (images && images.hits.length > 0) {
    renderImages(images.hits);
    loadMoreBtn.style.display = 'block';
    notiflix.Notify.success(`Found ${images.totalHits} images matching your search query.`);
  } else {
    showNoResultsMessage();
  }
}

async function loadMoreImages() {
  page++;
  const images = await fetchImages();

  if (images && images.hits.length > 0) {
    renderImages(images.hits);
    notiflix.Notify.success(`Loaded ${images.hits.length} more images.`);
  } else {
    loadMoreBtn.style.display = 'none';
    showEndOfResultsMessage();
  }
}

form.addEventListener('submit', searchImages);
loadMoreBtn.addEventListener('click', loadMoreImages);
