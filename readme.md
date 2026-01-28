# SharkEyes Client

**Advanced client-side bot detection and form protection**

SharkEyes Client is a lightweight JavaScript solution that protects your forms from automated attacks by analyzing behavioral patterns in real-time. All verification decisions are made server-side to ensure security and prevent bypass attempts.

## Current Version

See [`versions.json`](versions.json) for the latest stable release.

## Quick Start

### Installation

1. Include the SharkEyes client script in your HTML:
```html
<!--Invisible -->
<script src="https://api.sharkeyes.dev/api/v1/widget.js"></script>
```
or
```html
<!-- Visible -->
<script src="https://api.sharkeyes.dev/api/v1/widget_v.js"></script>
```



### Usage Options

SharkEyes offers two verification modes:

#### 1. Invisible Protection (Automatic)

Add the `data-sharkeyes` attribute to any form for seamless, invisible protection:
```html
<form action="/submit" method="POST" data-sharkeyes>
  <input type="email" name="email" placeholder="Email" required>
  <input type="password" name="password" placeholder="Password" required>
  <button type="submit">Sign In</button>
</form>
```

#### 2. Visible CAPTCHA Widget

For explicit user verification with a checkbox interface:
```html
<form action="/submit" method="POST">
  <input type="email" name="email" placeholder="Email" required>
  <input type="password" name="password" placeholder="Password" required>
  
  <!-- SharkEyes CAPTCHA Widget -->
  <div data-sharkeyes-captcha 
       data-theme="auto" 
       data-size="normal"
       data-lang="en"
       data-auto="true"></div>
  
  <button type="submit">Sign In</button>
</form>
```

**Widget Options:**
- `data-theme`: `"light"` | `"dark"` | `"auto"` (default: `"auto"`)
- `data-size`: `"normal"` | `"compact"` (default: `"normal"`)
- `data-lang`: `"en"` | `"ru"` | `"he"` | `"de"` (default: `"en"`)
- `data-auto`: `"true"` | `"false"` - Auto-verify on page load (default: `"true"`)

**Widget Features:**
- Light/Dark theme with auto-detection
- Multi-language support (English, Russian, Hebrew, Deutsch)
- Responsive design for mobile and desktop
- Compact mode for tight spaces
- Auto-verification or manual click-to-verify

## How It Works

This script provides **lightweight bot detection** for form submissions.  
It collects **minimal client-side signals** and sends them to the SharkEyes server for verification.  
All critical bot-detection logic runs **server-side**, so the client **cannot bypass** it.  

### Key Principles
- **Privacy First**: No typed input, no clicked element content, and no personal data is recorded.  
- **Temporary Signals Only**: Events and browser/device signals are sent to the server **without storing anything locally**.  
- **Server Makes the Decision**: Client only reports signals; server returns **ALLOW** or **BLOCK**.  
- **No Tracking or Identifying Users**: Only patterns and environment data are analyzed.

---

## Data Collected (Client-Side Only)

| Category | Data Collected | Purpose | Privacy Note |
|----------|----------------|---------|--------------|
| **Mouse / Click / Scroll / Keyboard / Touch / Paste** | Event type and timestamp (`mousemove`, `click`, `keydown`, `scroll`, `touchstart`, `touchmove`, `touchend`, `paste`, `input`, `focus`, `blur`) | Detect natural human interaction patterns | Only timing and type; **no input or content is recorded** |
| **Browser Info** | `navigator.userAgent`, `navigator.webdriver`, platform, touch support, WebGL vendor/renderer, plugin count, Chrome object presence | Identify browser consistency, detect headless or bot frameworks | Generic properties only; **no personal data** |
| **Automation Detection** | Flags for WebDriver, Playwright, headless browser | Detect automated tools |  Boolean flags only; **does not reveal user actions** |
| **Storage Test** | LocalStorage test key (`sharkeyes_temp_storage_test`) | Check browser storage availability | Temporary only, removed immediately; **existing storage not accessed** |
| **Form Metadata** | Number of input fields, screen width/height, window vs screen size | Analyze form complexity and environment | Counts and dimensions only; **no field content** |
| **Session Timing** | Time on page, event intervals | Detect bots submitting instantly | Duration only; **no personal content** |
| **Client Fingerprints** | Browser engine and brand (`chromium`, `gecko`, `webkit`, `firefox`, `chrome`, `edge`, `brave`, `opera`, `safari`) | Identify browser family and detect spoofing | Generic engine info only |

---

### Summary
- **We do NOT collect or store any typed text or clicks on content.**  
- **All event data is ephemeral** and sent securely to the server for verification.  
- **No cookies, localStorage content, or personal identifiers** are read or saved.  
- Client-side collection is **minimal**; server performs all scoring and final decisions.  
- Designed to **prevent bots** while fully preserving user privacy.


### Privacy & Data Handling

**We prioritize your privacy:**

- ✅ **Temporary Analysis Only** - Data is analyzed in real-time and immediately discarded
- ✅ **No Storage** - Nothing is saved to databases or log files after verification
- ✅ **No Tracking** - We don't create user profiles or track individuals across sessions
- ✅ **No Sharing** - Data is never shared with third parties or used for any other purpose
- ✅ **Stateless Process** - Each verification is independent; no historical data is retained
- ✅ **Bot Detection Only** - Data is used solely to distinguish bots from humans, not to identify users

**What we DON'T do:**
- Store personal information
- Track users across websites
- Create persistent fingerprints
- Build user profiles
- Sell or share data
- Use data for advertising

The verification process is completely stateless—once the API returns a result (ALLOW/BLOCK), all data is immediately discarded.

## Features

### Invisible Mode
- Zero user friction
- Automatic verification on form submit
- Background behavioral analysis
- Seamless integration
- No additional user interaction required

### Visible CAPTCHA Mode
- "I'm not a robot" checkbox interface
- Real-time verification feedback
- Customizable appearance and behavior
- Multiple language support (English, Russian, Hebrew, Deutsch)
- Dark/Light theme with auto-detection
- Auto-verification or manual click-to-verify options

### Bot Detection Capabilities
- **Automation Framework Detection**: Identifies Puppeteer, Playwright, Selenium, and custom automation tools
- **Headless Browser Detection**: Detects browsers running without a UI
- **Behavioral Analysis**: Distinguishes human interaction patterns from scripted behavior
- **Timing Analysis**: Identifies suspiciously fast or perfectly timed actions
- **Pattern Recognition**: Detects repetitive or mechanical interaction patterns

### Browser Compatibility
- **Chromium family**: Chrome, Edge, Opera, Brave
- **Gecko engine**: Firefox
- **WebKit engine**: Safari
- Works across all modern browsers and devices



## Configuration

### Invisible Mode
Zero configuration required. Simply add `data-sharkeyes` attribute.

### Visible CAPTCHA Widget
Customize with data attributes:
```html
<div data-sharkeyes-captcha 
     data-theme="dark"          <!-- Theme: light/dark/auto -->
     data-size="compact"        <!-- Size: normal/compact -->
     data-lang="de"             <!-- Language: en/ru/he/de -->
     data-auto="false">         <!-- Auto-verify: true/false -->
</div>
```

### Custom Error Handling

When verification fails, you can handle the response:

**Invisible Mode**: Displays a modal with Sky ID and confidence score

**Visible Widget**: Shows error state in the checkbox with option to retry

## Browser Support

- Chrome/Chromium 
- Firefox 
- Safari 
- Edge 
- Opera 
- Mobile browsers (iOS Safari, Chrome Mobile)

## Widget Customization Examples

### Dark Theme with Manual Verification
```html
<div data-sharkeyes-captcha 
     data-theme="dark"
     data-auto="false">
</div>
```

### Compact Light Theme (Deutsch)
```html
<div data-sharkeyes-captcha 
     data-theme="light"
     data-size="compact"
     data-lang="de">
</div>
```

### Auto-detect Theme (Hebrew)
```html
<div data-sharkeyes-captcha 
     data-theme="auto"
     data-lang="he">
</div>
```

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

See [LICENSE](LICENSE) file for details.

## Links

- [Official Website](https://sharkeyes.dev/)
- [API Documentation](https://sharkeyes.dev/docs/)
- [Report Issues](https://github.com/Ananas1kexe/SharkEyes-Client/issues)

## Support

For questions or support, contact us at
[sharkeyes.dev/feedback/](link:support@sharkeyes.dev)

---

**Made in Israel by the SharkEyes Team**
