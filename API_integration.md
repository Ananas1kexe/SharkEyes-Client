# SharkEyes API Integration Guide

This guide provides instructions for integrating SharkEyes protection into your web application.

## Table of Contents

- [Visible CAPTCHA Widget](#visible-captcha-widget)
- [Proof of Work (PoW) Protection](#proof-of-work-pow-protection)
- [Invisible Widget](#invisible-widget)
- [Configuration Options](#configuration-options)
- [Troubleshooting](#troubleshooting)

---

## Visible CAPTCHA Widget

The visible CAPTCHA widget provides an interactive challenge for users to complete.

### Installation

1. Add the preconnect link and script to your `<head>` section:

```html
<head>
  <link rel="preconnect" href="https://edge.sharkeyes.dev">
  <script src="https://edge.sharkeyes.dev/api/v1/widget_v.js" async defer></script>
</head>
```

2. Add the CAPTCHA container div inside your `<form>` element:

```html
<body>
  <form>
    <!-- Your form fields -->
    
    <div data-sharkeyes-captcha></div>
    
    <!-- Submit button -->
  </form>
</body>
```

### Configuration Options

Customize the widget behavior by adding data attributes:

```html
<div data-sharkeyes-captcha 
     data-theme="dark"          <!-- Theme: light/dark/auto -->
     data-size="compact"        <!-- Size: normal/compact -->
     data-lang="de"             <!-- Language: en/ru/he/de -->
     data-auto="false">         <!-- Auto-verify: true/false -->
</div>
```

**Available Options:**

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `data-theme` | `light`, `dark`, `auto` | `light` | Widget color theme |
| `data-size` | `normal`, `compact` | `normal` | Widget display size |
| `data-lang` | `en`, `ru`, `he`, `de` | `en` | Interface language |
| `data-auto` | `true`, `false` | `true` | Enable auto-verification |

---

## Proof of Work (PoW) Protection

PoW protection provides computational challenge-based verification without user interaction.

### Installation

1. Add the preconnect link and PoW script to your `<head>` section:

```html
<head>
  <link rel="preconnect" href="https://edge.sharkeyes.dev">
  <script src="https://edge.sharkeyes.dev/api/v1/pow.js" async defer></script>
</head>
```

2. Add the PoW container div to your `<body>`:

```html
<body>
  <div data-pow-protected></div>
  
  <!-- Your content -->
</body>
```

---

## Invisible Widget

The invisible widget provides seamless protection without visible interface elements.

### Installation

1. Add the preconnect link and invisible widget script to your `<head>` section:

```html
<head>
  <link rel="preconnect" href="https://edge.sharkeyes.dev">
  <script src="https://edge.sharkeyes.dev/api/v1/widget.js" async defer></script>
</head>
```

2. Add the widget container div to your `<body>`:

```html
<body>
  <div data-sharkeyes></div>
  
  <!-- Your content -->
</body>
```

---

## Troubleshooting

### Slow Script Loading

If the scripts are loading slowly or timing out, try these alternatives:

#### Option 1: Use Alternative CDN

Replace `https://edge.sharkeyes.dev` with `https://api.sharkeyes.dev`:

```html
<head>
  <link rel="preconnect" href="https://api.sharkeyes.dev">
  <script src="https://api.sharkeyes.dev/api/v1/widget_v.js" async defer></script>
</head>
```

#### Option 2: Use Minified Version

Add `.min.js` to the script path for smaller file size:

```html
<!-- Visible Widget (minified) -->
<script src="https://api.sharkeyes.dev/api/v1/widget_v.min.js" async defer></script>

<!-- PoW Protection (minified) -->
<script src="https://api.sharkeyes.dev/api/v1/pow.min.js" async defer></script>

<!-- Invisible Widget (minified) -->
<script src="https://api.sharkeyes.dev/api/v1/widget.min.js" async defer></script>
```

### Script Reference Table

| Widget Type | Edge CDN | API CDN | Minified |
|-------------|----------|---------|----------|
| **Visible Widget** | `edge.sharkeyes.dev/api/v1/widget_v.js` | `api.sharkeyes.dev/api/v1/widget_v.js` | `*.min.js` |
| **PoW Protection** | `edge.sharkeyes.dev/api/v1/pow.js` | `api.sharkeyes.dev/api/v1/pow.js` | `*.min.js` |
| **Invisible Widget** | `edge.sharkeyes.dev/api/v1/widget.js` | `api.sharkeyes.dev/api/v1/widget.js` | `*.min.js` |

---

## Complete Example

Here's a complete implementation example using the visible CAPTCHA widget:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SharkEyes Integration Example</title>
  
  <!-- SharkEyes Integration -->
  <link rel="preconnect" href="https://edge.sharkeyes.dev">
  <script src="https://edge.sharkeyes.dev/api/v1/widget_v.js" async defer></script>
</head>
<body>
  <form action="/submit" method="POST">
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
    
    <label for="message">Message:</label>
    <textarea id="message" name="message" required></textarea>
    
    <!-- SharkEyes CAPTCHA -->
    <div data-sharkeyes-captcha 
         data-theme="auto"
         data-size="normal"
         data-lang="en"
         data-auto="true">
    </div>
    
    <button type="submit">Submit</button>
  </form>
</body>
</html>
```

---

## Support

For issues, questions, or contributions, please visit the [SharkEyes GitHub repository](https://github.com/Ananas1kexe/SharkEyes-Client).

## License

See the [LICENSE](LICENSE) file for details.