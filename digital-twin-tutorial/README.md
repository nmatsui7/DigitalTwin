# Build Your First Personalized Copilot

This is a static beginner tutorial for personalizing Microsoft Copilot with the built-in Custom Instructions field.

The tutorial guides learners through one mainstream workflow:

1. Decide what Copilot should know.
2. Decide how Copilot should respond.
3. Draft one consolidated instruction block.
4. Open Copilot Chat settings.
5. Select Personalization.
6. Find Custom Instructions.
7. Paste and save the instructions.
8. Test the result in a new conversation.
9. Revise the saved instructions when needed.

## Project Files

| Path | Purpose |
| --- | --- |
| `index.html` | Tutorial content and page structure |
| `styles.css` | Responsive visual design |
| `script.js` | Copy buttons, progress tracking, temporary notes, print behavior |
| `images/` | Tutorial illustrations and the Copilot settings screenshot |

## Local Preview

Open `index.html` directly in a browser, or run a simple local web server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Validation Checklist

Before publishing, check that:

- all lesson navigation links move to valid sections;
- copy buttons work;
- progress checkboxes update the progress bar;
- the Copilot settings screenshot appears in the setup section;
- the page remains readable on desktop and mobile widths;
- no obsolete file-based personalization workflow appears in the tutorial.

## Privacy Position

The tutorial does not send user input to a server. The only persisted browser data is completion progress in `localStorage`. Revision notes are kept in session storage for the current browser session.
