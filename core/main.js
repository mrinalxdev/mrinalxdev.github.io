/*
 * Theme
 */

(function () {
  const root = document.documentElement;
  const button = document.getElementById("theme-toggle");

  const media = window.matchMedia(
    "(prefers-color-scheme: dark)"
  );

  function currentTheme() {
    return (
      root.getAttribute("data-theme") ||
      (media.matches ? "dark" : "light")
    );
  }

  function syncThemeButton() {
    const isDark = currentTheme() === "dark";

    button.textContent = isDark
      ? "Light"
      : "Dark";

    button.setAttribute(
      "aria-label",
      isDark
        ? "Switch to light theme"
        : "Switch to dark theme"
    );
  }

  button.addEventListener("click", function () {
    const next =
      currentTheme() === "dark"
        ? "light"
        : "dark";

    root.setAttribute("data-theme", next);

    try {
      localStorage.setItem("theme", next);
    } catch (error) {}

    syncThemeButton();
  });

  media.addEventListener("change", function () {
    let saved = null;

    try {
      saved = localStorage.getItem("theme");
    } catch (error) {}

    if (!saved) {
      syncThemeButton();
    }
  });

  syncThemeButton();
})();


/*
 * Reading progress
 */

(function () {
  const bar =
    document.getElementById("progress-bar");

  let ticking = false;

  function updateProgress() {
    const height =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const progress =
      height > 0
        ? Math.min(
            1,
            Math.max(
              0,
              window.scrollY / height
            )
          )
        : 0;

    bar.style.transform =
      `scaleX(${progress})`;

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;

        requestAnimationFrame(
          updateProgress
        );
      }
    },
    {
      passive: true,
    }
  );

  window.addEventListener(
    "resize",
    updateProgress
  );

  updateProgress();
})();