const VISIBLE_CLASS = "visible";

const settings = document.getElementById("settings");
const settingsGear = document.getElementById("gear-container");

settingsGear.addEventListener("click", (event) => {
   settings.classList.toggle(VISIBLE_CLASS);
});

