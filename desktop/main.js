const { app, BrowserWindow, Menu, session, shell } = require("electron");
const fs = require("fs");
const path = require("path");

const HOME = "https://ravenpbx.com/app";
let appOrigin = "https://ravenpbx.com";

function isAppUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "data:") return true;
    if (parsed.origin !== appOrigin) return false;
    return parsed.pathname === "/app" || parsed.pathname === "/app/" || /^\/account\/[0-9a-f-]{36}\/phone\/?$/i.test(parsed.pathname);
  } catch {
    return false;
  }
}

function startUrl() {
  const dir = process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(process.execPath);
  try {
    const text = fs.readFileSync(path.join(dir, "url.txt"), "utf8").trim();
    if (/^https:\/\//.test(text)) {
      appOrigin = new URL(text).origin;
      return text;
    }
  } catch {
    /* use the live phone sign-in */
  }
  return HOME;
}

function offlinePage(message) {
  const safe = String(message)
    .replace(/&/g, "&" + "amp;")
    .replace(/</g, "&" + "lt;")
    .replace(/>/g, "&" + "gt;");
  return `data:text/html;charset=utf-8,${encodeURIComponent(`<!doctype html>
<html><head><meta charset="utf-8"><title>Raven Phone</title></head>
<body style="margin:0;height:100vh;display:grid;place-items:center;background:#050505;color:#fff;font:16px/1.4 Segoe UI,sans-serif">
  <div style="max-width:28rem;padding:2rem">
    <h1 style="font-size:1.6rem;margin:0 0 .5rem">Raven Phone is offline</h1>
    <p style="margin:0 0 1rem">${safe}</p>
    <button onclick="location.reload()" style="border:2px solid #111;background:#111;color:#fff;font-weight:700;padding:.6rem 1rem">Try again</button>
  </div>
</body></html>`)}`;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    title: "Raven Phone",
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#050505",
    icon: path.join(__dirname, "icon.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.once("ready-to-show", () => win.show());
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("did-fail-load", (_event, code, description, url) => {
    if (code === -3 || url.startsWith("data:")) return;
    win.loadURL(offlinePage(description || "Check the internet connection, then try again."));
  });
  win.webContents.on("will-navigate", (event, url) => {
    if (!isAppUrl(url)) event.preventDefault();
  });
  win.webContents.on("will-redirect", (event, url) => {
    if (!isAppUrl(url)) event.preventDefault();
  });
  win.loadURL(startUrl());
}

const media = new Set(["media", "display-capture", "mediaKeySystem", "notifications", "fullscreen", "pointerLock", "clipboard-sanitized-write"]);

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => {
    callback(media.has(permission));
  });
  session.defaultSession.setPermissionCheckHandler((_wc, permission) => media.has(permission));
  createWindow();
});

app.on("window-all-closed", () => app.quit());
