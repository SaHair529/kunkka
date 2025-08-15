# Kunkka

## Quickly Save and Restore Your VSCode Workspace State

Kunkka is a Visual Studio Code extension that allows you to **save the current state of your open tabs, cursors, and content** with one click and quickly **restore it** like a "cross" mark on a board.

---

## Features

- Save open files, including unsaved content changes
- Restore open tabs in the exact order
- Restore cursor positions and selections
- Automatically save files after restoring
- Convenient keyboard shortcuts for setting and going to a cross

---

## Installation

1. Open VSCode
2. Go to the Marketplace or run the command `Extensions: Install Extension`
3. Search for `Kunkka` and install it
4. Reload VSCode or open a new session

---

## Usage

- **Set Cross (save workspace state):**  
  Press `Ctrl+Alt+X` or invoke the command `Kunkka: Set Cross` from the command palette

- **Go To Cross (restore workspace state):**  
  Press `Ctrl+Alt+Shift+Y` or invoke the command `Kunkka: Go To Cross`

---

## Keyboard Shortcuts

| Command           | Shortcut               |
|-------------------|------------------------|
| Set Cross         | Ctrl + Alt + X         |
| Go To Cross       | Ctrl + Alt + Shift + Y |

---

## FAQ

**Q:** What if files aren’t saved after restoring?  
**A:** The extension automatically saves files after restoring. If this doesn't work, check that the extension has write permissions for your project.

**Q:** Can I save multiple crosses?  
**A:** The current version supports only one cross. Multi-cross support is planned for future updates.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Thank you for using Kunkka!*
