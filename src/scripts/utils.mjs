// for dynamic header and footer loading
async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}
// to get data from local storage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

//to get a specific relationship object ID and category from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const category = urlParams.get(param);
  return category;
}

// to load header and footer templates and render them to the page
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");

  const footerTemplate = await loadTemplate("../partials/footer.html");

  const headerElement = document.querySelector("#main-header");

  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

// to render templates with data and optional callback for additional processing after rendering
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}

// to render a list of items using a template function that generates HTML for each item, and insert it into the DOM at a specified position, with an option to clear existing content before rendering the new list.

export function renderListWithTemplate(
  template,
  parentListElement,
  list,
  position = "afterbegin",
  clear = true
) {
  //  The .map() method is a Higher-Order Function. This means it has a strict rule: the thing you put inside its parentheses must be a function (a set of instructions) that it can execute on every loop.

  // When you write list.map(template) or list.map(item => template(item)), it works because template is a function blueprint.
  const htmlStrings = list.map((item) => template(item));
  // if clear is true we need clear parent element before inserting new content
  if (clear) {
    parentListElement.innerHTML = "";
  }
  parentListElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function alertMessage(message, scroll = true, duration = 3000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span class="alert_close">X</span>`;

  alert.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("alert_close") ||
      e.target.tagName === "SPAN"
    ) {
      main.removeChild(this);
    }
  });
  const main = document.querySelector("main");
  main.prepend(alert);
  // make sure they see the alert by scrolling to the top of the window
  //we may not always want to do this...so default to scroll=true, but allow it to be passed in and overridden.
  if (scroll) window.scrollTo(0, 0);

  // left this here to show how you could remove the alert automatically after a certain amount of time.
  // setTimeout(function () {
  //   main.removeChild(alert);
  // }, duration);
}
// check for vulgarity and relevance in relationship advice text
export function isValidRelationshipAdvice(text) {
  // Keywords that match your site's target audience
  const RELATIONSHIP_KEYWORDS = [
    "love",
    "relationship",
    "partner",
    "marry",
    "marriage",
    "date",
    "dating",
    "parent",
    "child",
    "children",
    "friend",
    "family",
    "talk",
    "communicate",
    "argue",
    "trust",
    "feel",
    "listen",
    "together",
    "someone",
  ];

  // Words you want to strictly prohibit on your platform
  const VULGAR_BLACKLIST = [
    "bitch",
    "shit",
    "fuck",
    "asshole",
    "bastard", // Add any specific words you want to block
  ];

  const lowerText = text.toLowerCase();

  // 1. Check for vulgarity: If it contains ANY blacklisted word, reject it immediately
  const hasVulgarity = VULGAR_BLACKLIST.some((word) =>
    lowerText.includes(word)
  );
  if (hasVulgarity) return false;

  // 2. Check for relevance: Does it contain at least one relationship keyword?
  const isRelevant = RELATIONSHIP_KEYWORDS.some((keyword) =>
    lowerText.includes(keyword)
  );

  return isRelevant;
}
