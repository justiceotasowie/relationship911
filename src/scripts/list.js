import { loadHeaderFooter, getParam, setLocalStorage, getLocalStorage } from "./utils.mjs";
import relationshipdata from "./relationshipdata.mjs";
import relationshipList from "./relationshipList.mjs";

// Load shared layout first
loadHeaderFooter();

// --------------- Dialog / Form Logic - only run if elements exist
const openForm = document.querySelector("#openForm");
const myDialog = document.querySelector("#myDialog");
const closeDialog = document.querySelector("#closeDialog");
const submitButton = document.querySelector("#submitButton");
const input = myDialog ? myDialog.querySelector("div input") : null;

if (openForm && myDialog) {
  openForm.addEventListener("click", () => {
    myDialog.showModal();
  });
}

if (closeDialog && myDialog) {
  closeDialog.addEventListener("click", () => {
    myDialog.close();
  });
}

if (submitButton && input) {
  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    
    const value = input.value.trim();
    if (!value) {
      input.setCustomValidity("Please enter a comment");
      input.reportValidity();
      return;
    }
    
    try {
      setLocalStorage("userComment", value);
      window.location.href = "comment.html";
    } catch (err) {
      console.error("Failed to save comment:", err);
      alert("Could not save comment. Storage may be disabled.");
    }
  });
}

// --------------- Comment Display Logic - only run on comment.html
const commentSpan = document.querySelector(".comment span");
if (commentSpan) {
  try {
    const savedComment = getLocalStorage("userComment");
    commentSpan.textContent = savedComment || "No comment yet";
  } catch (err) {
    console.error("Failed to load comment:", err);
    commentSpan.textContent = "Error loading comment";
  }
}

// --------------- List Logic - only run if list container exists
const listElement = document.querySelector(".categoryList");
if (listElement) {
  const category = getParam("category");
  const datasource = new relationshipdata(category);
  const list = new relationshipList(category, datasource, listElement);
  list.init();
}