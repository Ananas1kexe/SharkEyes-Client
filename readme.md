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

## 🔬 Technical Details: What Data Points We Check

Below is a detailed breakdown of **what specific browser properties we check** and **why each is important for bot detection**. We emphasize that we **do not read, store, or access any personal content**—we only check for the **presence and consistency** of browser features.

### Browser Environment Checks

| Data Point | What We Check | Purpose | Privacy Note |
|------------|---------------|---------|--------------|
| **User Agent** | Browser identification string | Verify browser consistency and detect spoofed identities | Standard browser info, not personal data |
| **Platform** | Operating system name | Cross-check with other signals for consistency | Generic OS info (e.g., "Win32", "MacIntel") |
| **Languages** | Browser language preferences | Verify natural browser configuration | Language settings only, not content |
| **Timezone** | System timezone setting | Detect timezone/location mismatches typical of bots | Timezone identifier only (e.g., "America/New_York") |
| **Vendor** | Browser vendor string | Identify browser manufacturer | Public browser property |

### Hardware & Capability Checks

| Data Point | What We Check | Purpose | Privacy Note |
|------------|---------------|---------|--------------|
| **Hardware Concurrency** | Number of CPU cores | Detect virtual environments and emulators | Hardware spec only, no personal data |
| **Device Memory** | RAM available to browser | Identify virtual machines and automation environments | Memory amount only, no usage data |
| **Screen Resolution** | Display width/height | Detect headless browsers with fake resolutions | Screen size only, not screen content |
| **Pixel Ratio** | Display pixel density | Verify device consistency | Display property only |
| **Touch Support** | Touch capability detection | Verify mobile device authenticity | Boolean check only |
| **Window vs Screen Size** | Browser window dimensions vs screen | Detect automation tools running in hidden windows | Dimensions only, not window content |

### Browser Feature Checks

| Data Point | What We Check | Purpose | Privacy Note |
|------------|---------------|---------|--------------|
| **Cookie Enabled** | Whether cookies can be used | Bots often disable cookies; we check **availability only** | ✅ We check IF cookies work, **NOT cookie content** |
| **Storage Test** | LocalStorage functionality | Verify browser has normal storage capabilities | ✅ We test with a temporary test value, **NOT read existing data** |
| **WebGL Info** | Graphics renderer details | Detect headless browsers and virtual environments | GPU info only, used for consistency checks |
| **Plugins Length** | Number of browser plugins | Headless browsers typically have 0 plugins | ✅ Plugin count only, **NOT plugin names or data** |
| **Window.Chrome** | Presence of Chrome object | Verify Chromium-based browser authenticity | Boolean presence check |

### Automation Detection

| Data Point | What We Check | Purpose | Privacy Note |
|------------|---------------|---------|--------------|
| **navigator.webdriver** | WebDriver automation flag | Directly indicates Selenium/WebDriver usage | Standard automation detection flag |
| **Playwright Detection** | Playwright framework signatures | Detect Playwright automation tool | Checks for framework-specific properties |
| **Browser Type Detection** | Browser engine and brand | Identify browser family and detect spoofing | Browser identification only |

### Permission API Checks

| Data Point | What We Check | Purpose | Privacy Note |
|------------|---------------|---------|--------------|
| **Permissions State** | Camera, microphone, geolocation, notifications permission status | Verify browser has functional Permission API | ✅ We check permission **state** (granted/denied/prompt), **NOT access actual devices or location** |

### Behavioral Event Tracking

| Event Type | What We Record | Purpose | Privacy Note |
|------------|----------------|---------|--------------|
| **Mouse Move** | Coordinates and timestamp | Detect natural human movement patterns | ✅ Movement patterns only, **NOT what you're clicking on** |
| **Click** | Coordinates and timestamp | Analyze click patterns and timing | ✅ Click timing only, **NOT what elements you click** |
| **Scroll** | Timestamp only | Verify natural scrolling behavior | ✅ Scroll timing only, **NOT page content** |
| **Keyboard** | Timestamp only | Detect natural typing patterns | ✅ Timing only, **NOT what you type** |
| **Touch Events** | Touch coordinates and timestamp | Mobile device interaction verification | ✅ Touch patterns only, **NOT touched content** |
| **Focus/Blur** | Timestamp only | Track window focus patterns | ✅ Timing only, **NOT focused content** |
| **Input** | Timestamp only | Detect form interaction | ✅ Timing only, **NOT input values** |
| **Paste** | Timestamp only | Identify paste actions | ✅ Event timing only, **NOT pasted content** |

### Session Metadata

| Data Point | What We Check | Purpose | Privacy Note |
|------------|---------------|---------|--------------|
| **Time on Page** | Duration since page load | Bots submit forms instantly | Time duration only |
| **Input Count** | Number of form fields | Form complexity analysis | Field count only, not field content |
| **Headless Flag** | Headless browser detection | Identify automation environments | Boolean flag |


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