const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ai", {
  summarize: (text) => ipcRenderer.invoke("summarize", text),
});