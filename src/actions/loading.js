// KEY
const LOADING_CLASS = `bG9hZGluZwdc2819cea95b44372a535d1ba3`;

/**
 * Mở dialog Loading
 */
export function openLoading() {
  document
    .getElementById(`${process.env.REACT_APP_ID_LOADING}`)
    .classList.add(LOADING_CLASS);
}

/**
 * Đóng dialog Loading
 */
export function closeLoading() {
  document
    .getElementById(`${process.env.REACT_APP_ID_LOADING}`)
    .classList.remove(LOADING_CLASS);
}
