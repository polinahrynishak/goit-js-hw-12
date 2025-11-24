import axios from 'axios';

export const getImagesByQuery = q => {
  const requestParams = new URLSearchParams({
    q: q,
    key: '53365400-7139be9e5523c93bff54612dc',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });

  return axios
    .get(`https://pixabay.com/api/?${requestParams}`)
    .then(response => response.data);
};
