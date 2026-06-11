import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderFavoriteContents() {
  const cartItems = getLocalStorage("so-cart");
  console.log(cartItems);
  const htmlItems = cartItems.map((item) => favoriteItemTemplate(item));
  document.querySelector(".fList").innerHTML = htmlItems.join("");
}

function favoriteItemTemplate(item) {
  const entry = ` 
        <li> 
            <h2>${item.title}</h2>
            <p>${item.advice}</p>
        </li>
    `;
  return entry;
}

renderFavoriteContents();
