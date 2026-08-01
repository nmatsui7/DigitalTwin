/* ==========================================================================
   Build Your First AI Companion — script.js
   Minimal vanilla JavaScript:
   - copy buttons + confirmation toast
   - section completion checkboxes with localStorage persistence
   - overall progress indicator + reset
   - back-to-top button
   - starter-kit downloads (individual + bundle, no server needed)
   - session-only feedback notes with download
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
        toast(ok ? "Copied to clipboard." : "Could not copy automatically — please select and copy the text manually.");
      });
    });
  });

  /* ---------- progress tracking ---------- */

  var PROGRESS_KEY = "dt-tutorial-progress";

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
      if (!window.confirm("Reset all completion checkboxes? Your notes and downloaded files are not affected.")) {
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

  /* ---------- starter kit downloads ---------- */

  // The same content that ships in the starter-kit/ folder.
  var STARTER_FILES = {
    "profile.md": "# About Me\n\n\n## Background\n- My work or main activities:\n- My current responsibilities:\n- My experience level:\n\n\n## Interests\n- I enjoy:\n- I am curious about:\n\n\n## Goals\n- I want to learn:\n- I want help with:\n- I want to improve:\n\n\n## Preferences\n- I prefer short or detailed explanations:\n- I learn best through:\n- I do not enjoy:\n\n\n## Boundaries\n- Topics the AI should not make assumptions about:\n- Information I prefer not to share:\n",
    "skill.md": "# How to Work With Me\n\n\n## Communication\n- Give the main answer first.\n- Use clear, everyday language.\n- Explain unfamiliar terms.\n- Use examples when useful.\n\n\n## Reasoning\n- Identify important tradeoffs.\n- Separate facts from assumptions.\n- State uncertainty clearly.\n- Politely challenge weak assumptions.\n\n\n## Recommendations\n- Consider my goals and constraints.\n- Avoid expensive recommendations unless the benefit is clear.\n- Give no more than three strong options unless I request more.\n\n\n## Working Style\n- Break large tasks into manageable steps.\n- Do not overwhelm me with advanced features.\n- End with one practical next action.\n",
    "principles.md": "# My Principles\n\n\n- Prefer simple solutions over complicated ones.\n- Consider long-term cost, not only purchase price.\n- Protect privacy when a convenient alternative exists.\n- Learn through small experiments.\n- Evidence is more useful than confident opinions.\n- Reversible decisions can be made faster than irreversible ones.\n",
    "feedback.md": "# Feedback and Corrections\n\n\n## What Worked Well\n-\n\n\n## What Was Not Helpful\n-\n\n\n## Corrections\n-\n\n\n## New Preferences\n-\n\n\n## Things That Have Changed\n-\n",
    "starter.md": "# AI Companion Starter Instructions\n\n\nUse the information and instructions I provide in the following order:\n\n\n1. Follow skill.md for how to communicate and assist me.\n2. Use profile.md for stable information about me.\n3. Use principles.md when comparing choices or making recommendations.\n4. Use my knowledge files only when relevant.\n5. Use feedback.md to avoid repeating corrected mistakes.\n6. Do not invent personal facts.\n7. Clearly distinguish supplied information, general knowledge, and assumptions.\n8. Ask a clarifying question only when the missing information would materially change the answer.\n9. Do not make personal, medical, legal, financial, or other high-impact decisions on my behalf.\n\n\nFirst, summarize your understanding of me in five concise points.\n\n\nThen list:\n\n\n- any conflicts in the information;\n- important missing information;\n- assumptions you should avoid.\n"
  };

  function downloadTextFile(filename, content) {
    var blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Revoke shortly after, so the download still completes.
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  document.querySelectorAll("[data-download]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var name = btn.dataset.download;
      if (!STARTER_FILES[name]) return;
      downloadTextFile(name, STARTER_FILES[name]);
      toast("Downloaded " + name + ".");
    });
  });

  var downloadAllBtn = document.getElementById("download-all");
  var downloadAllStatus = document.getElementById("download-all-status");
  if (downloadAllBtn) {
    downloadAllBtn.addEventListener("click", async function () {
      // Preferred path: let the user pick a folder (requires a secure context).
      if (window.showDirectoryPicker) {
        try {
          var dir = await window.showDirectoryPicker();
          for (var key in STARTER_FILES) {
            if (!Object.prototype.hasOwnProperty.call(STARTER_FILES, key)) continue;
            var handle = await dir.getFileHandle(key, { create: true });
            var writable = await handle.createWritable();
            await writable.write(STARTER_FILES[key]);
            await writable.close();
          }
          try {
            await dir.getDirectoryHandle("knowledge", { create: true });
          } catch (e) { /* knowledge folder is optional */ }
          toast("Starter kit saved to your chosen folder.");
          if (downloadAllStatus) {
            downloadAllStatus.textContent = "Saved all 5 files plus an empty knowledge/ folder to your chosen folder.";
          }
          return;
        } catch (err) {
          if (err && err.name === "AbortError") return; // user cancelled
          // Fall through to the download path below.
        }
      }
      // Fallback: download all five files individually. Some browsers may
      // ask to allow each download, so the status below explains what happened.
      Object.keys(STARTER_FILES).forEach(function (name, index) {
        setTimeout(function () {
          downloadTextFile(name, STARTER_FILES[name]);
        }, index * 350);
      });
      toast("Downloaded 5 files. Check your downloads folder.");
      if (downloadAllStatus) {
        downloadAllStatus.textContent = "Started 5 downloads (check your downloads folder). If your browser blocked some, click each Download button above, or copy the files directly from the starter-kit/ folder.";
      }
    });
  }

  /* ---------- feedback notes (session only, never uploaded) ---------- */

  var NOTES_KEY = "dt-feedback-notes";
  var notes = document.getElementById("feedback-notes");
  var downloadNotes = document.getElementById("download-notes");

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

    if (downloadNotes) {
      downloadNotes.addEventListener("click", function () {
        var content = notes.value.trim()
          ? notes.value
          : "# Feedback and Corrections\n\n\n## What Worked Well\n-\n\n\n## What Was Not Helpful\n-\n\n\n## Corrections\n-\n\n\n## New Preferences\n-\n\n\n## Things That Have Changed\n-\n";
        downloadTextFile("my-feedback-notes.md", content);
        toast("Downloaded my-feedback-notes.md.");
      });
    }
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
