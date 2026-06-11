import {
  renderListWithTemplate,
  getLocalStorage,
  setLocalStorage,
  alertMessage,
} from "./utils.mjs";

function relationshipTemplate(relationship) {
  return `
    <li>
      <h3>${relationship.title}</h3>
      <p>${relationship.advice}</p>
      <button class="favoriteButton" data-id="${relationship.id}">Add to Favorites</button>
    </li>
  `;
}

export default class relationshipList {
  constructor(category, datasource, listElement) {
    this.category = category;
    this.datasource = datasource;
    this.listElement = listElement;
    const heroElement =  document.querySelector("#heroElement");
  }

  async init() {
    const data = await this.datasource.getData();
    console.log("Loaded data:", data);

    // Render hero if you passed a heroElement
    if (heroElement && data.images) {
      heroElement.innerHTML = `
        <div class="hero">
          <img src="${data.images}" alt="${data.title}">
          <h1>${data.title}</h1>
        </div>
      `;
    }

    // Render the list using data.items, not data
    this.renderList(data.items);

    this.listElement.addEventListener("click", async (e) => {
      if (e.target.classList.contains("favoriteButton")) {
        const clickedId = e.target.getAttribute("data-id");
        const favorite = await this.datasource.findProductById(clickedId);
        this.addFavorite(favorite, e.target);
      }
    });
  }

  renderList(list) {
    renderListWithTemplate(relationshipTemplate, this.listElement, list);
  }

  addFavorite(favorite, buttonElement) {
    if (!favorite) {
      alertMessage("Please select a valid item to add to favorites.");
      console.error("No valid favorite data found!");
      return;
    }

    const cartItems = getLocalStorage("so-cart") || [];
    const isAlreadyFavorite = cartItems.some((item) => Number(item.id) === Number(favorite.id));

    if (!isAlreadyFavorite) {
      cartItems.push(favorite);
      setLocalStorage("so-cart", cartItems);
      alertMessage("Added to favorites!");

      if (buttonElement) {
        buttonElement.textContent = "Added";
        buttonElement.disabled = true;
      }
    } else {
      alertMessage("This item is already in your favorites list!");
    }
  } 
}