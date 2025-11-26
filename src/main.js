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

const PER_PAGE = 15;

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

    const totalPages = Math.ceil(data.totalHits / PER_PAGE);

    createGallery(images, refs.gallery);

    galleryCardHeight = refs.gallery
      .querySelector('li')
      .getBoundingClientRect().height;

    if (totalPages > 1) {
      showLoadMoreButton(refs.loadmoreBtn);
    }

    searchForm.elements['search-text'].value = '';
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong',
      position: 'topRight',
      backgroundColor: 'red',
    });
  } finally {
    hideLoader(refs.loader);
  }
};

const onLoadmoreBtnClick = async event => {
  try {
    page++;
    hideLoadMoreButton(refs.loadmoreBtn);
    showLoader(refs.loader);

    const data = await getImagesByQuery(q, page);
    const images = data.hits;

    if (images.length > 0) {
      appendToGallery(images, refs.gallery);

      scrollBy({
        top: galleryCardHeight * 2,
        behavior: 'smooth',
      });

      const totalPages = Math.ceil(data.totalHits / PER_PAGE);

      if (page < totalPages) {
        showLoadMoreButton(refs.loadmoreBtn);
      } else {
        iziToast.info({
          message:
            'We are sorry, but you have reached the end of search results.',
          position: 'topRight',
          backgroundColor: 'green',
        });
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    hideLoader(refs.loader);
  }
};

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadmoreBtn.addEventListener('click', onLoadmoreBtnClick);
