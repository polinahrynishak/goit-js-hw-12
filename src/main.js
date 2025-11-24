import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions';

export const refs = {
  searchForm: document.querySelector('.form'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader'),
};

const onSearchFormSubmit = event => {
  event.preventDefault();

  const { target: searchForm } = event;
  const q = searchForm.elements['search-text'].value.trim();

  if (q === '') {
    iziToast.error({
      message: 'Please fill in the search field',
    });

    return;
  }

  clearGallery(refs.gallery);
  showLoader(refs.loader);

  getImagesByQuery(q)
    .then(data => {
      const images = data.hits;

      if (images.length === 0) {
        iziToast.info({
          message: 'Sorry, no images found. Try again!',
          position: 'topRight',
          messageColor: '#fafafb',
          backgroundColor: 'red',
        });
        return;
      }

      createGallery(images, refs.gallery);

      refs.searchForm.elements['search-text'].value = '';
    })
    .catch(error => {
      iziToast.error({
        message: 'Something went wrong',
        position: 'topRight',
        backgroundColor: 'red',
      });
      console.log(error);
    })
    .finally(() => {
      hideLoader(refs.loader);
    });
};

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
