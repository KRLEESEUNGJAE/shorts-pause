# Shorts Pause

<p align="center">
  <img src="icons/icon128.png" alt="Shorts Pause Logo" width="128">
</p>

<p align="center">
  <strong>Stop YouTube Shorts from auto-looping</strong><br>
  A simple Chrome extension that pauses Shorts when they end
</p>

## Features

- Automatically pauses video when it reaches the end
- Prevents endless loop playback
- Simple ON/OFF toggle
- Syncs across browser tabs
- Lightweight & no permissions beyond YouTube

## Installation

### Manual Install (Developer Mode)

1. Download or clone this repository
   ```bash
   git clone https://github.com/KRLEESEUNGJAE/shorts-pause.git
   ```

2. Open Chrome and navigate to `chrome://extensions`

3. Enable **Developer mode** (top right toggle)

4. Click **Load unpacked**

5. Select the `shorts-pause` folder

## Usage

1. Go to any YouTube Shorts page
2. Click the extension icon in toolbar
3. Toggle **ON** to enable
4. Videos will now pause at the end instead of looping

## How It Works

The extension monitors video elements on YouTube Shorts pages. When enabled, it:

1. Detects when a video is about to end (within 0.3 seconds)
2. Pauses the video
3. Prevents auto-advancement to next Short
4. Maintains state when scrolling between videos

## Project Structure

```
shorts-pause/
├── manifest.json   # Extension configuration
├── content.js      # Core logic (video control)
├── popup.html      # Popup UI structure
├── popup.css       # Popup styles
├── popup.js        # Popup interactions
└── icons/          # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Tech Stack

- Chrome Extension Manifest V3
- Vanilla JavaScript (ES6+)
- Chrome Storage Sync API
- MutationObserver API

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

[MIT](LICENSE)
