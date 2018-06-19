require('dotenv').config();

const api = process.env.REACT_APP_API_ADDRESS;

export const list = async () =>
  fetch(`${api}infoscreen/rooms`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => response.json())
    .catch(error => console.log(error))

export const get = async key => (
  fetch(`${api}infoscreen?populate`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'key': key,
    },
  })
    .then(response => response.json())
    .catch(error => console.log(error))
);

export const put = async (id, postData) => (
  fetch(`${api}infoscreen/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  })
    .then(response => response.json())
    .catch(error => console.log(error))
);