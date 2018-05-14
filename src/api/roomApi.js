require('dotenv').config();

const api = process.env.REACT_APP_API_ADDRESS;

export const get = async key => (
  fetch(`${api}rooms/infoscreen/${key}`)
      .then((response) => {
          console.log(response);
          if (!response.ok) {
              throw Error(response.statusText);
          }
          return response;
      })
      .then(resp => resp.json())
      .then(json => (json.length > 0 ? json[0] : []))
      .catch(error => console.log(error))
);