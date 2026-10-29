/* ==========================================================
   site.js — shared by index.html and now.html
   ========================================================== */

/*
 * Theme toggle
 */
(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;

  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function current() {
    return root.getAttribute("data-theme") || (media.matches ? "dark" : "light");
  }

  function sync() {
    var isDark = current() === "dark";
    btn.textContent = isDark ? "Light" : "Dark";
    btn.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  btn.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
    sync();
  });

  media.addEventListener("change", function () {
    var saved = null;
    try {
      saved = localStorage.getItem("theme");
    } catch (e) {}
    if (!saved) sync();
  });

  sync();
})();

/*
 * Writing: tag filter (fill + wires). Runs only where #writing exists.
 */
(function () {
  var wrap = document.getElementById("writing");
  var svg = document.getElementById("wires");
  if (!wrap || !svg) return;

  var posts = Array.prototype.slice.call(wrap.querySelectorAll(".posts a"));
  var tags = Array.prototype.slice.call(wrap.querySelectorAll(".tag"));
  var NS = "http://www.w3.org/2000/svg";
  var active = null;

  function hasTag(post, tag) {
    return (post.getAttribute("data-tags") || "").split(/\s+/).indexOf(tag) !== -1;
  }

  // post counts next to each tag
  tags.forEach(function (t) {
    var n = posts.filter(function (p) {
      return hasTag(p, t.dataset.tag);
    }).length;
    t.querySelector(".count").textContent = n;
  });

  function drawWires(animate) {
    svg.innerHTML = "";
    if (!active || getComputedStyle(svg).display === "none") return;

    var box = wrap.getBoundingClientRect();
    var tagEl = wrap.querySelector('.tag[data-tag="' + active + '"]');
    var tb = tagEl.getBoundingClientRect();
    var x1 = tb.left - box.left + 3.5;
    var y1 = tb.top - box.top + tb.height / 2;

    var i = 0;
    posts.forEach(function (p) {
      if (!hasTag(p, active)) return;
      var pb = p.getBoundingClientRect();
      var x2 = pb.right - box.left + 14; // just past the fill's right edge
      var y2 = pb.top - box.top + pb.height / 2;
      var mid = (x1 + x2) / 2;
      var delay = animate ? i * 90 : 0;

      var path = document.createElementNS(NS, "path");
      path.setAttribute(
        "d",
        "M" + x1 + " " + y1 + " C" + mid + " " + y1 + " " + mid + " " + y2 + " " + x2 + " " + y2
      );
      path.setAttribute("pathLength", "1");
      path.setAttribute("class", "wire");
      path.style.setProperty("--wire-delay", delay + "ms");
      if (!animate) {
        path.style.animation = "none";
        path.style.strokeDashoffset = "0";
      }
      svg.appendChild(path);

      var dot = document.createElementNS(NS, "circle");
      dot.setAttribute("cx", x2);
      dot.setAttribute("cy", y2);
      dot.setAttribute("r", "2.5");
      dot.setAttribute("class", "wire-end");
      dot.style.setProperty("--wire-delay", delay + "ms");
      if (!animate) {
        dot.style.animation = "none";
        dot.style.opacity = "0.85";
      }
      svg.appendChild(dot);
      i++;
    });
  }

  function select(tag) {
    active = active === tag ? null : tag; // click again to clear
    tags.forEach(function (t) {
      t.setAttribute("aria-pressed", String(t.dataset.tag === active));
    });
    var i = 0;
    posts.forEach(function (p) {
      var on = !!active && hasTag(p, active);
      p.style.setProperty("--fill-delay", on ? i * 90 + "ms" : "0ms");
      p.classList.toggle("lit", on);
      if (on) i++;
    });
    drawWires(true);
  }

  tags.forEach(function (t) {
    t.addEventListener("click", function () {
      select(t.dataset.tag);
    });
  });

  var raf;
  window.addEventListener("resize", function () {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () {
      drawWires(false);
    });
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      drawWires(false);
    });
  }
})();