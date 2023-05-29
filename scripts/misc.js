const VISIBLE_CLASS = "visible";

const settings = document.getElementById("settings");
const settingsGear = document.getElementById("gear-container");

settingsGear.addEventListener("click", () => {
   settings.classList.toggle(VISIBLE_CLASS);
});

