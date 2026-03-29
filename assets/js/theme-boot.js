(function () {
  var storageKey = "theme";
  var root = document.documentElement;
  var lightThemeColor = "#eff6e0";
  var darkThemeColor = "#01161e";
  var savedTheme = null;

  try {
    savedTheme = localStorage.getItem(storageKey);
  } catch (error) {
    savedTheme = null;
  }

  var theme =
    savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

  root.dataset.theme = theme;

  var themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute(
      "content",
      theme === "dark" ? darkThemeColor : lightThemeColor,
    );
  }
})();
