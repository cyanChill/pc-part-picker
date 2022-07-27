const tggleBtn = document.getElementById("theme_toggle_btn");

const DARK_THEME = "dark";
const LIGHT_THEME = "light";

const getCurrTheme = () => {
  const theme = localStorage.getItem(`${window.location.host}-theme`);
  return theme === DARK_THEME ? DARK_THEME : LIGHT_THEME;
};

const setTheme = (theme) => {
  const newTheme = theme === DARK_THEME ? DARK_THEME : LIGHT_THEME;
  localStorage.setItem(`${window.location.host}-theme`, newTheme);

  if (newTheme === DARK_THEME) {
    document.body.classList.add(DARK_THEME);
    tggleBtn.setAttribute("data-theme", DARK_THEME);
  } else {
    document.body.classList.remove(DARK_THEME);
    tggleBtn.removeAttribute("data-theme");
  }
};

const toggleTheme = () => {
  const currTheme = getCurrTheme();
  setTheme(currTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME);
};

// On Load:
(function loadTheme() {
  const currTheme = getCurrTheme();
  setTheme(currTheme);

  setTimeout(() => {
    // Prevent the transition from occur when we switch pages due to
    // this javascript code running everytime we enter a new page
    tggleBtn.classList.add("transitions");
  }, 1);
})();
