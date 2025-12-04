# 🌐 Browser Support Guide - Selenium Tests

## ✅ Supported Browsers

### Microsoft Edge (Default)
- **Driver**: EdgeDriver (built-in with Windows)
- **Fast and reliable**
- **Default browser** for all tests

### Google Chrome
- **Driver**: ChromeDriver
- **Alternative option**
- **Requires Chrome installed**

---

## 🚀 Quick Commands

### Edge Browser (Default)
```bash
npm run selenium              # All tests with Edge
npm run selenium:demo         # Demo test with Edge
npm run selenium:edge         # All tests (explicit Edge)
npm run selenium:edge:demo    # Demo test (explicit Edge)
```

### Chrome Browser
```bash
npm run selenium:chrome       # All tests with Chrome
npm run selenium:chrome:demo  # Demo test with Chrome
```

### Individual Tests (Edge by default)
```bash
npm run selenium:home         # Home page test
npm run selenium:shop         # Shop page test
npm run selenium:register     # Registration test
npm run selenium:cart         # Cart test
```

---

## ⚙️ Configuration

### Change Default Browser
Edit `selenium-tests/test-config.js`:

```javascript
// Use Edge (default)
browser: 'MicrosoftEdge'

// Or use Chrome
browser: 'chrome'
```

### Use Environment Variable
```bash
# PowerShell
$env:BROWSER='chrome'; npm run selenium:demo

# CMD
set BROWSER=chrome && npm run selenium:demo

# Linux/Mac
BROWSER=chrome npm run selenium:demo
```

---

## 🎯 For Presentation

### Demo with Edge (Fastest)
```bash
npm run selenium:demo
```

### Demo with Chrome
```bash
npm run selenium:chrome:demo
```

**Both run in ~15 seconds with smooth animations!** ⚡

---

## 🔧 Troubleshooting

### Chrome not working?
1. Ensure Chrome is installed
2. ChromeDriver is auto-installed (already done)
3. Try Edge instead: `npm run selenium:demo`

### Edge not working?
1. Edge is built-in on Windows 10/11
2. EdgeDriver is auto-installed (already done)
3. Try Chrome instead: `npm run selenium:chrome:demo`

### Both not working?
Check if application is running:
```bash
# Start app first
npm start

# Then run tests in new terminal
npm run selenium:demo
```

---

## 📊 Performance

Both browsers run at similar speeds:
- **Startup**: 1 second
- **Each step**: 1-1.5 seconds
- **Total demo**: ~15 seconds
- **All tests**: ~1 minute

---

**Choose the browser that works best on your system!** 🚀
