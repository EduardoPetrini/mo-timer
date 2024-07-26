export const storeGet = key => {
  return window.localStorage.getItem(key);
};
export const storeSet = (key, value) => {
  window.localStorage.setItem(key, value);
};
