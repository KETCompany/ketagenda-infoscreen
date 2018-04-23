export const get = async id => (
  fetch(`http://35.195.86.51:8080/api/rooms/${id}`)
    .then(resp => resp.json())
    .then(json => (json.length === 0 ? json[0] : []))
);