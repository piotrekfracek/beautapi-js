export default function(prototype) {
  return function(response) {
    return response.map(function(obj) {
      return new prototype(obj);
    })
  }
}