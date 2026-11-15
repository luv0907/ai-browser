const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ai", {
  summarize: (text) => ipcRenderer.invoke("summarize", text),
});

contextBridge.exposeInMainWorld("browserData", {
  // history
  historyAdd: (entry) => ipcRenderer.invoke("history:add", entry),
  historyList: () => ipcRenderer.invoke("history:list"),
  historyClear: () => ipcRenderer.invoke("history:clear"),
  historyRemove: (time) => ipcRenderer.invoke("history:remove", time),

  // bookmarks
  bookmarksList: () => ipcRenderer.invoke("bookmarks:list"),
  bookmarksAdd: (entry) => ipcRenderer.invoke("bookmarks:add", entry),
  bookmarksRemove: (url) => ipcRenderer.invoke("bookmarks:remove", url),

  // downloads
  downloadsList: () => ipcRenderer.invoke("downloads:list"),
  downloadsClear: () => ipcRenderer.invoke("downloads:clear"),
  downloadsOpenFolder: (filePath) => ipcRenderer.invoke("downloads:openFolder", filePath),
  downloadsOpenFile: (filePath) => ipcRenderer.invoke("downloads:openFile", filePath),

  // settings
  settingsGet: () => ipcRenderer.invoke("settings:get"),
  settingsSet: (patch) => ipcRenderer.invoke("settings:set", patch),
  settingsClearData: () => ipcRenderer.invoke("settings:clearData"),

  // windows
  openWindow: (type) => ipcRenderer.invoke("open-window", type),
  openNewBrowserWindow: (url) => ipcRenderer.invoke("open-new-browser-window", url),

  // live updates pushed from main.js (so History/Bookmarks/Downloads windows refresh themselves)
  onUpdate: (channel, cb) => ipcRenderer.on(channel, (event, data) => cb(data)),
  onShortcut: (channel, cb) => ipcRenderer.on(channel, () => cb()),
});
