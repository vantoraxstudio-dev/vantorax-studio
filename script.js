/* ==========================================================
   >>> PASTE YOUR GOOGLE FORM URL BELOW (between the quotes) <<<
   Keep the quotes. Example: googleFormUrl: "https://forms.gle/xxxxxxxx"

   Suggested Google Form fields: Name; Email; Phone (optional); Roofing
   company name; Current website (optional); Selected package
   (Essential / Growth / Advanced); Services required; Project details;
   Preferred contact method.

   Setup: forms.google.com > create form > add fields > Responses tab
   (turn on "Accepting responses"; optionally "Link to Sheets") >
   Send > Link icon > copy URL > paste it below.
   ========================================================== */
const SITE_CONFIG = {
  googleFormUrl: "https://forms.gle/uvT12VstUaMAZjcA6",
  // OPTIONAL package prefill. Leave "" to skip. Needs the full
  // https://docs.google.com/forms/.../viewform link (not forms.gle).
  // Form editor: three-dot menu > "Get pre-filled link", pick a package,
  // "Get link", copy the number after "entry." (e.g. 1234567890).
  // The form question must offer options exactly: Essential, Growth, Advanced.
  // Test it before relying on it. If left empty, visitors choose in the form.
  packageEntryId: ""
};

(function () {
  "use strict";

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile menu
  var btn = document.getElementById("menu-btn");
  var nav = document.getElementById("site-nav");
  function setMenu(open) {
    if (!btn || !nav) return;
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? "Close" : "Menu";
  }
  if (btn && nav) {
    btn.addEventListener("click", function () {
      setMenu(btn.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        btn.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 980) setMenu(false);
    });
  }

  // Quote buttons (all use SITE_CONFIG.googleFormUrl)
  var url = SITE_CONFIG.googleFormUrl;
  var configured = /^https:\/\//i.test(url);
  var notice = document.getElementById("quote-notice");
  var close = document.getElementById("notice-close");

  function buildUrl(pkg) {
    try {
      var u = new URL(url);
      if (pkg && SITE_CONFIG.packageEntryId && u.hostname === "docs.google.com") {
        u.searchParams.set("usp", "pp_url");
        u.searchParams.set("entry." + SITE_CONFIG.packageEntryId, pkg);
      }
      return u.toString();
    } catch (err) { return url; }
  }

  document.querySelectorAll(".js-quote").forEach(function (link) {
    if (configured) {
      link.href = buildUrl(link.dataset.package);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", link.textContent.trim() + " (opens in a new tab)");
    } else {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        if (!notice) { window.location.href = "mailto:vantoraxstudio.dev@gmail.com"; return; }
        notice.hidden = false;
        var c = document.getElementById("contact");
        if (c) c.scrollIntoView();
        notice.setAttribute("tabindex", "-1");
        notice.focus();
      });
    }
  });
  if (close && notice) close.addEventListener("click", function () { notice.hidden = true; });

  // FAQ: one answer open at a time (native details keeps keyboard support)
  var faqs = document.querySelectorAll(".faq details");
  faqs.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  // Subtle reveal on scroll (skipped for reduced motion)
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !still) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".card, .steps li, .flow li").forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }
})();
