(function () {
  var storageKey = "theme";
  var root = document.documentElement;
  var inputId = "theme-toggle";
  var themeColors = { light: "#eff6e0", dark: "#01161e" };
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function getSavedTheme() {
    try {
      var savedTheme = localStorage.getItem(storageKey);
      return savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : null;
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      return;
    }
  }

  function setTheme(theme) {
    root.dataset.theme = theme;

    var themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", themeColors[theme]);
    }

    var input = document.getElementById(inputId);
    if (input) {
      input.checked = theme === "dark";
    }
  }

  setTheme(getSavedTheme() || (prefersDark.matches ? "dark" : "light"));

  prefersDark.addEventListener("change", function (event) {
    if (!getSavedTheme()) {
      setTheme(event.matches ? "dark" : "light");
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    var input = document.getElementById(inputId);

    if (!input) {
      return;
    }

    setTheme(root.dataset.theme);

    input.addEventListener("change", function () {
      var nextTheme = input.checked ? "dark" : "light";
      setTheme(nextTheme);
      saveTheme(nextTheme);
    });
  });
})();
