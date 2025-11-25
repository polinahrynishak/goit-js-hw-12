import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  appendToGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

export const refs = {
  searchForm: document.querySelector('.form'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader'),
  loadmoreBtn: document.querySelector('.loadmore-btn'),
};

let page = 1;
let q = null;
let galleryCardHeight = null;

const onSearchFormSubmit = async event => {
  try {
    event.preventDefault();

    const { target: searchForm } = event;
    q = searchForm.elements['search-text'].value.trim();

    if (q === '') {
      iziToast.error({
        message: 'Please fill in the search field',
      });

      return;
    }

    clearGallery(refs.gallery);
    showLoader(refs.loader);
    hideLoadMoreButton(refs.loadmoreBtn);
    page = 1;

    const data = await getImagesByQuery(q, page);
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

    const totalPages = Math.ceil(data.totalHits / 15);

    if (totalPages > 1) {
      showLoadMoreButton(refs.loadmoreBtn);
      refs.loadmoreBtn.addEventListener('click', onLoadmoreBtnClick);
    }

    createGallery(images, refs.gallery);

    galleryCardHeight = refs.gallery
      .querySelector('li')
      .getBoundingClientRect().height;

    showLoadMoreButton(refs.loadmoreBtn);

    searchForm.elements['search-text'].value = '';
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong',
      position: 'topRight',
      backgroundColor: 'red',
    });
    console.log(error);
  } finally {
    hideLoader(refs.loader);
  }
};

const onLoadmoreBtnClick = async event => {
  try {
    page++;
    showLoader(refs.loader);

    const data = await getImagesByQuery(q, page);
    const images = data.hits;

    appendToGallery(images, refs.gallery);

    scrollBy({
      top: galleryCardHeight * 2,
      behavior: 'smooth',
    });

    const totalPages = Math.ceil(data.totalHits / 15);

    if (page >= totalPages) {
      hideLoadMoreButton(refs.loadmoreBtn);
      refs.loadmoreBtn.removeEventListener('click', onLoadmoreBtnClick);
      iziToast.error({
        message:
          'We are sorry, but you have reached the end of search results.',
        position: 'topRight',
        backgroundColor: 'green',
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    hideLoader(refs.loader);
  }
};

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
