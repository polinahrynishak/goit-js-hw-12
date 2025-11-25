import axios from 'axios';

export const getImagesByQuery = async (q, page) => {
  try {
    const requestParams = new URLSearchParams({
      q: q,
      key: '53365400-7139be9e5523c93bff54612dc',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: 15,
    });

    const response = await axios.get(
      `https://pixabay.com/api/?${requestParams}`
    );
    return response.data;
  } catch (error) {
    console.log('Помилка', error);
  }
};
