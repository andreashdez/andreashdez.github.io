(function () {
  var storageKey = "theme";
  var root = document.documentElement;
  var inputId = "theme-toggle";
  var lightThemeColor = "#eff6e0";
  var darkThemeColor = "#01161e";

  function setThemeColor(theme) {
    var themeColorMeta = document.querySelector('meta[name="theme-color"]');

    if (!themeColorMeta) {
      return;
    }

    themeColorMeta.setAttribute(
      "content",
      theme === "dark" ? darkThemeColor : lightThemeColor,
    );
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem(storageKey);
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

  function getPreferredTheme() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return "light";
  }

  function getInitialTheme() {
    var savedTheme = getSavedTheme();

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return getPreferredTheme();
  }

  function setTheme(theme, input) {
    root.dataset.theme = theme;
    setThemeColor(theme);

    if (!input) {
      return;
    }

    var isDark = theme === "dark";
    input.checked = isDark;
    input.setAttribute("aria-checked", isDark ? "true" : "false");
  }

  var initialTheme = getInitialTheme();
  setTheme(initialTheme);

  if (window.matchMedia) {
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    var onPreferenceChange = function (event) {
      var savedTheme = getSavedTheme();

      if (savedTheme === "dark" || savedTheme === "light") {
        return;
      }

      setTheme(event.matches ? "dark" : "light");
    };

    if (typeof prefersDark.addEventListener === "function") {
      prefersDark.addEventListener("change", onPreferenceChange);
    } else if (typeof prefersDark.addListener === "function") {
      prefersDark.addListener(onPreferenceChange);
    }
  }

  window.addEventListener("DOMContentLoaded", function () {
    var input = document.getElementById(inputId);

    if (!input) {
      return;
    }

    if (!input.hasAttribute("aria-labelledby") && input.labels.length === 0) {
      input.setAttribute("aria-label", "Theme");
    }

    setTheme(root.dataset.theme || initialTheme, input);

    input.addEventListener("change", function () {
      var nextTheme = input.checked ? "dark" : "light";
      setTheme(nextTheme, input);
      saveTheme(nextTheme);
    });
  });
})();
