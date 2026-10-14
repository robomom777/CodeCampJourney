const { app, BrowserWindow, Menu, MenuItem } = require('electron');
const path = require('path');

// 🔒 THE SINGLE INSTANCE LOCK: Prevents clones from ever spawning!
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // If a copy of the pet is already running, instantly kill this new attempt!
  app.quit();
} else {
  // Otherwise, if this is the only copy, continue running normally:
  
  let win;

  function createWindow() {
    win = new BrowserWindow({
      width: 300,          
      height: 300,
      transparent: true,   
      frame: false,        
      alwaysOnTop: true,    
      resizable: false,
      
      // 🦄 Your custom taskbar/tray icon fix linked here perfectly!
      icon: path.join(__dirname, 'candy_corn.ico'), 

      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false, 
        sandbox: false
      }
    });

    win.loadFile('index.html');

    // Right-Click Context Menu Options
    const menu = new Menu();
    
    menu.append(new MenuItem({
      label: '✨ Always On Top',
      type: 'checkbox',
      checked: true,
      click: (menuItem) => {
        win.setAlwaysOnTop(menuItem.checked);
      }
    }));

    menu.append(new MenuItem({ type: 'separator' }));

    menu.append(new MenuItem({
      label: '👋 Close Pet',
      click: () => {
        app.quit();
      }
    }));

    win.webContents.on('context-menu', () => {
      menu.popup(win);
    });
  }

  // If you accidentally try to open it a second time, focus on the existing pet instead!
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
