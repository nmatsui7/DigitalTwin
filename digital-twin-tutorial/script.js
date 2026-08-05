/* ==========================================================================
   Build Your First Personalized Copilot - script.js
   Minimal vanilla JavaScript:
   - copy buttons + confirmation toast
   - section completion checkboxes with localStorage persistence
   - overall progress indicator + reset
   - back-to-top button
   - session-only revision notes
   - print handling (expands example answers for printing)

   No framework. No API calls. No personal data is ever uploaded or stored
   in localStorage (only checkbox completion state is persisted there).
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- helpers ---------- */

  function safeStorage(kind) {
    // Guard against browsers that disable storage (e.g. private mode).
    try {
      var storage = kind === "local" ? window.localStorage : window.sessionStorage;
      var test = "__dt_test__";
      storage.setItem(test, "1");
      storage.removeItem(test);
      return storage;
    } catch (e) {
      return null;
    }
  }

  var local = safeStorage("local");
  var session = safeStorage("session");

  /* ---------- toast ---------- */

  var toastEl = document.getElementById("toast");
  var toastTimer = null;

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 2200);
  }

  /* ---------- copy buttons ---------- */

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(
        function () { return true; },
        function () { return fallbackCopy(text); }
      );
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  document.querySelectorAll(".btn-copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var block = btn.closest(".copy-block");
      var target = block ? block.querySelector(".copy-text") : null;
      if (!target) return;
      var label = "Copied!";
      copyText(target.textContent).then(function (ok) {
        var original = btn.textContent;
        btn.textContent = ok ? label : "Copy failed";
        setTimeout(function () { btn.textContent = original; }, 1600);
        toast(ok ? "Copied to clipboard." : "Could not copy automatically - please select and copy the text manually.");
      });
    });
  });

  /* ---------- progress tracking ---------- */

  var PROGRESS_KEY = "copilot-custom-instructions-progress";

  function getCompleted() {
    if (!local) return {};
    try {
      var raw = JSON.parse(local.getItem(PROGRESS_KEY)) || {};
      return typeof raw === "object" ? raw : {};
    } catch (e) {
      return {};
    }
  }

  function saveCompleted(state) {
    if (!local) return;
    try {
      local.setItem(PROGRESS_KEY, JSON.stringify(state));
    } catch (e) {
      /* ignore quota/private-mode errors */
    }
  }

  var progressBoxes = document.querySelectorAll('input[data-progress]');
  var progressText = document.getElementById("progress-text");
  var progressBar = document.getElementById("progress-bar");
  var TOTAL = progressBoxes.length;

  function renderProgress() {
    var state = getCompleted();
    var count = 0;
    progressBoxes.forEach(function (box) {
      var done = !!state[box.dataset.progress];
      box.checked = done;
      if (done) count += 1;
    });
    if (progressText) {
      progressText.textContent = count + " of " + TOTAL + " steps complete";
    }
    if (progressBar) {
      var pct = TOTAL ? Math.round((count / TOTAL) * 100) : 0;
      progressBar.style.width = pct + "%";
    }
  }

  progressBoxes.forEach(function (box) {
    box.addEventListener("change", function () {
      var state = getCompleted();
      state[box.dataset.progress] = box.checked;
      saveCompleted(state);
      renderProgress();
      if (box.checked) {
        toast("Section marked complete.");
      }
    });
  });

  var resetBtn = document.getElementById("reset-progress");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (!window.confirm("Reset all completion checkboxes? Your temporary notes are not affected.")) {
        return;
      }
      if (local) {
        try { local.removeItem(PROGRESS_KEY); } catch (e) {}
      }
      renderProgress();
      toast("Progress reset.");
    });
  }

  renderProgress();

  /* ---------- back to top ---------- */

  var backToTop = document.getElementById("back-to-top");

  function onScroll() {
    if (!backToTop) return;
    if (window.scrollY > 600) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }

  /* ---------- revision notes (session only, never uploaded) ---------- */

  var NOTES_KEY = "copilot-revision-notes";
  var notes = document.getElementById("feedback-notes");

  if (notes) {
    if (session) {
      try {
        var savedNotes = session.getItem(NOTES_KEY);
        if (savedNotes) notes.value = savedNotes;
      } catch (e) {}
    }

    notes.addEventListener("input", function () {
      if (session) {
        try { session.setItem(NOTES_KEY, notes.value); } catch (e) {}
      }
    });

  }

  /* ---------- print: expand example answers while printing ---------- */

  var openOnPrint = [];

  function expandAllDetails() {
    document.querySelectorAll("details").forEach(function (d) {
      if (!d.open) {
        openOnPrint.push(d);
        d.open = true;
      }
    });
  }

  function restoreDetails() {
    openOnPrint.forEach(function (d) { d.open = false; });
    openOnPrint = [];
  }

  window.addEventListener("beforeprint", expandAllDetails);
  window.addEventListener("afterprint", restoreDetails);

  // Older Safari may not fire beforeprint; use a matchMedia fallback.
  if (window.matchMedia) {
    var printQuery = window.matchMedia("print");
    printQuery.addEventListener("change", function (e) {
      if (e.matches) expandAllDetails();
      else restoreDetails();
    });
  }
})();
