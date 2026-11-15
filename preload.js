const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ai", {
  summarize: (text) => ipcRenderer.invoke("summarize", text),
});

contextBridge.exposeInMainWorld("profiles", {
  list: () => ipcRenderer.invoke("profiles:list"),
  create: (p) => ipcRenderer.invoke("profiles:create", p),
  delete: (id) => ipcRenderer.invoke("profiles:delete", id),
  select: (id) => ipcRenderer.invoke("profiles:select", id),
  switchProfile: () => ipcRenderer.invoke("profiles:switch"),
  current: () => ipcRenderer.invoke("profiles:current"),
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

  // my search engine (crawler + ranked index)
  searchAddSite: (url) => ipcRenderer.invoke("search:addSite", url),
  searchList: () => ipcRenderer.invoke("search:list"),
  searchRemoveSite: (hostname) => ipcRenderer.invoke("search:removeSite", hostname),
  searchClear: () => ipcRenderer.invoke("search:clear"),
  searchQuery: (q) => ipcRenderer.invoke("search:query", q),

  // live updates pushed from main.js
  onUpdate: (channel, cb) => ipcRenderer.on(channel, (event, data) => cb(data)),
  onShortcut: (channel, cb) => ipcRenderer.on(channel, () => cb()),
});
