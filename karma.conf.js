const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

// Resolve Playwright's Chromium as a fallback when Google Chrome is not installed
function resolveChromeBin() {
  if (process.env['CHROME_BIN']) return process.env['CHROME_BIN'];
  const playwrightCache = path.join(os.homedir(), 'Library/Caches/ms-playwright');
  try {
    const dirs = require('fs').readdirSync(playwrightCache).filter(d => d.startsWith('chromium-'));
    if (dirs.length) {
      const candidate = path.join(
        playwrightCache, dirs[0],
        'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
      );
      if (require('fs').existsSync(candidate)) return candidate;
    }
  } catch (_) {}
  return undefined;
}

const chromeBin = resolveChromeBin();
if (chromeBin) process.env['CHROME_BIN'] = chromeBin;

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {},
      clearContext: false,
    },
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    coverageReporter: {
      dir: path.join(__dirname, './coverage/jk-portfolio'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    restartOnFileChange: true,
  });
};
