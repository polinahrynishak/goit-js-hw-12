import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export const lightbox = new SimpleLightbox('.gallery a');

export const createGalleryCardTemplate = images => {
  return `<li class="gallery-card">
  <a class="img-link" href="${images.largeImageURL}">           <img class="img" src="${images.webformatURL}" alt="${images.tags}"title="${images.tags}"/></a>
  <div class="gallery-info">
  <p class="info-item">Likes <span>${images.likes}</span></p>
  <p class="info-item">Views <span>${images.views}</span></p>          
  <p class="info-item">Comments <span>${images.comments}</span></p>
  <p class="info-item">Downloads <span>${images.downloads}</span></p>
  </div>
  </li>`;
};

export function createGallery(images, galleryEl) {
  const markup = images.map(image => createGalleryCardTemplate(image)).join('');
  galleryEl.innerHTML = markup;
  lightbox.refresh();
}

export function appendToGallery(images, galleryEl) {
  const markup = images.map(createGalleryCardTemplate).join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery(galleryEl) {
  galleryEl.innerHTML = '';
}

export function showLoader(loaderEl) {
  loaderEl.classList.remove('hidden');
}

export function hideLoader(loaderEl) {
  loaderEl.classList.add('hidden');
}

export function showLoadMoreButton(loadmoreBtn) {
  loadmoreBtn.classList.remove('hidden');
}

export function hideLoadMoreButton(loadmoreBtn) {
  loadmoreBtn.classList.add('hidden');
}
