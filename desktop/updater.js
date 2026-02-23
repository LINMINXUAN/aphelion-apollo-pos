const { app } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

const CHECK_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 hours
const INITIAL_DELAY_MS = 10 * 1000; // 10 seconds after launch

let updateStatus = {
  state: 'idle', // idle | checking | available | downloading | downloaded | error | not-available
  version: null,
  progress: null,
  error: null,
};

const getStatus = () => ({
  ...updateStatus,
  currentVersion: app.getVersion(),
});

const setupEvents = () => {
  autoUpdater.on('checking-for-update', () => {
    log.info('[Updater] Checking for updates...');
    updateStatus = { state: 'checking', version: null, progress: null, error: null };
  });

  autoUpdater.on('update-available', (info) => {
    log.info(`[Updater] Update available: v${info.version}`);
    updateStatus = { state: 'available', version: info.version, progress: null, error: null };
  });

  autoUpdater.on('update-not-available', (info) => {
    log.info(`[Updater] Already up to date: v${info.version}`);
    updateStatus = { state: 'not-available', version: info.version, progress: null, error: null };
  });

  autoUpdater.on('download-progress', (progress) => {
    log.info(`[Updater] Download progress: ${Math.round(progress.percent)}%`);
    updateStatus = {
      ...updateStatus,
      state: 'downloading',
      progress: Math.round(progress.percent),
    };
  });

  autoUpdater.on('update-downloaded', (info) => {
    log.info(`[Updater] Update downloaded: v${info.version} — will install on quit`);
    updateStatus = { state: 'downloaded', version: info.version, progress: 100, error: null };
  });

  autoUpdater.on('error', (err) => {
    log.error('[Updater] Error:', err.message);
    updateStatus = { state: 'error', version: null, progress: null, error: err.message };
  });
};

const checkForUpdates = () => {
  if (!app.isPackaged) {
    log.info('[Updater] Skipping update check in development mode');
    return;
  }
  autoUpdater.checkForUpdates().catch((err) => {
    log.error('[Updater] Check failed:', err.message);
  });
};

const initUpdater = () => {
  setupEvents();

  setTimeout(() => {
    checkForUpdates();
    setInterval(checkForUpdates, CHECK_INTERVAL_MS);
  }, INITIAL_DELAY_MS);
};

module.exports = { initUpdater, getStatus, checkForUpdates };
