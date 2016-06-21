export default function(prototype) {
  return function(response) {
    return new prototype(response);
  }
}