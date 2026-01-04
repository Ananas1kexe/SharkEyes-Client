# 🦈 SharkEyes Client

**Advanced client-side bot detection and form protection**

SharkEyes Client is a lightweight JavaScript solution that protects your forms from automated attacks by analyzing behavioral patterns in real-time. All verification decisions are made server-side to ensure security and prevent bypass attempts.

## 📦 Current Version

See [`versions.json`](versions.json) for the latest stable release.

## 🚀 Quick Start

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
<form action="/submit" method="POST" data-sharkeyes>
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
- `data-lang`: `"en"` | `"ru"` | `"he"` (default: `"en"`)
- `data-auto`: `"true"` | `"false"` - Auto-verify on page load (default: `"true"`)

**Widget Features:**
- 🎨 Light/Dark theme with auto-detection
- 🌍 Multi-language support (English, Russian, Hebrew)
- 📱 Responsive design for mobile and desktop
- ♿ Accessible with keyboard navigation
- 🎯 Compact mode for tight spaces
- ⚡ Auto-verification or manual click-to-verify

## 🔍 How It Works

### Client-Side (Behavioral Analysis)
1. **Interaction Monitoring**: Observes natural user interactions during the session
2. **Behavior Patterns**: Analyzes timing, movement patterns, and interaction sequences
3. **Anomaly Detection**: Identifies suspicious patterns typical of automation tools
4. **Secure Transmission**: Sends behavioral signals to SharkEyes API for verification

### Server-Side (Verification & Decision)
5. **Pattern Analysis**: Advanced algorithms evaluate behavioral characteristics
6. **Bot Detection**: Identifies automation signatures (headless browsers, scripting tools, bot frameworks)
7. **Risk Scoring**: Calculates likelihood of automated activity
8. **Decision**: Server returns **ALLOW** or **BLOCK** decision
9. **Response**: Form submission proceeds or is blocked based on server decision

**⚠️ Important:** All verification logic runs server-side. The client never makes the final decision, preventing bypass attempts through browser manipulation or script modification.

## 📊 What We Analyze

SharkEyes analyzes behavioral signals to detect automated activity, **NOT to track or identify individual users**:

| Signal Type | What We Check | Why It Matters |
|-------------|---------------|----------------|
| **Interaction Patterns** | Natural mouse movements, click timing, scroll behavior | Bots move in straight lines or perfectly timed patterns; humans are organic and variable |
| **Session Behavior** | Time spent on page, interaction frequency, event sequences | Bots submit forms instantly; humans browse, read, and interact naturally |
| **Browser Consistency** | Basic browser information consistency | Bots often have mismatched or spoofed browser configurations |
| **Automation Indicators** | Presence of automation tool signatures | Detects Puppeteer, Playwright, Selenium, and other bot frameworks |
| **Environment Anomalies** | Headless browser detection, missing browser features | Automated tools lack normal browser capabilities |

### 🔒 Privacy & Data Handling

**We prioritize your privacy:**

- ✅ **Temporary Analysis Only** - Data is analyzed in real-time and immediately discarded
- ✅ **No Storage** - Nothing is saved to databases or log files after verification
- ✅ **No Tracking** - We don't create user profiles or track individuals across sessions
- ✅ **No Sharing** - Data is never shared with third parties or used for any other purpose
- ✅ **Stateless Process** - Each verification is independent; no historical data is retained
- ✅ **Bot Detection Only** - Data is used solely to distinguish bots from humans, not to identify users

**What we DON'T do:**
- ❌ Store personal information
- ❌ Track users across websites
- ❌ Create persistent fingerprints
- ❌ Build user profiles
- ❌ Sell or share data
- ❌ Use data for advertising

The verification process is completely stateless—once the API returns a result (ALLOW/BLOCK), all data is immediately discarded.

## 🎯 Features

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
- Multiple language support (English, Russian, Hebrew)
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

## 🛡️ API Endpoints

- **Token Request**: `https://api.sharkeyes.dev/api/v1/token`
  - Returns a server-generated session token
  - Sets HttpOnly security cookie

- **Verification**: `https://api.sharkeyes.dev/api/v1/verify`
  - Analyzes behavioral signals **server-side**
  - Returns verification result: **ALLOW** or **BLOCK**
  - Includes Sky ID (session identifier) and confidence score

## ⚙️ Configuration

### Invisible Mode
Zero configuration required. Simply add `data-sharkeyes` attribute.

### Visible CAPTCHA Widget
Customize with data attributes:
```html
<div data-sharkeyes-captcha 
     data-theme="dark"          <!-- Theme: light/dark/auto -->
     data-size="compact"        <!-- Size: normal/compact -->
     data-lang="ru"             <!-- Language: en/ru/he -->
     data-auto="false">         <!-- Auto-verify: true/false -->
</div>
```

### Custom Error Handling

When verification fails, you can handle the response:

**Invisible Mode**: Displays a modal with Sky ID and confidence score

**Visible Widget**: Shows error state in the checkbox with option to retry

## 🔧 Browser Support

- ✅ Chrome/Chromium 
- ✅ Firefox 
- ✅ Safari 
- ✅ Edge 
- ✅ Opera 
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Widget Customization Examples

### Dark Theme with Manual Verification
```html
<div data-sharkeyes-captcha 
     data-theme="dark"
     data-auto="false">
</div>
```

### Compact Light Theme (Russian)
```html
<div data-sharkeyes-captcha 
     data-theme="light"
     data-size="compact"
     data-lang="ru">
</div>
```

### Auto-detect Theme (Hebrew)
```html
<div data-sharkeyes-captcha 
     data-theme="auto"
     data-lang="he">
</div>
```

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

See [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Official Website](https://sharkeyes.dev/)
- [API Documentation](https://docs.sharkeyes.dev/)
- [Report Issues](https://github.com/sharkeyes/sharkeyes-client/issues)

## 💬 Support

For questions or support, contact us at [support@sharkeyes.dev](mailto:support@sharkeyes.dev)

---

**Made with 🦈 by the SharkEyes Team**