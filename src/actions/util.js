/**
 * Lấy giá trị từ thẻ Meta tag theo Key truyền vào
 * @param {String} key meta cần lấy
 */
export function getContentMetaTag(key) {
  return `${document
    .querySelector(`meta[name="${key}"]`)
    .getAttribute("content")}`;
}
