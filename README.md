# IDX CSS Framework

![Screenshot](screenshot.png)

## Features
- **SASS** (Syntactically Awesome StyleSheets) based **CSS3 framework**
- **Pure CSS**, no Javascript required at runtime.
- **Easy to customize**: start by changing the `theme-constants.scss` to derive your own theme, or add and alter styles to build your custom deviation.
- **Build**: **NPM** build, builds the **minimized CSS**, and can start **live-server** with auto-reload when editing styles.
- **Responsive** classes to style for multiple screen sizes / devices. Uses the same naming conventions (`xl`,`lg`,`md`,`sm`,`xs`) / media break points as Bootstrap.
- **Grid system**: 12-column responsive grid.
- **Cards**: card styles with optional headers, footers, and material design shadows
- **List** components
- **Popup** components, combined with the list components you can easily build **popup menus**.
- **Form field inputs**: modern approach to form styling.
- ...and many more, check out the **Showcase** (included) to learn about all the features.

![Input Fields](input-fields.png)

## Setup (Node and NPM)
This project requires Node.js an NPM (Node Package Manager) for the build process (download 'latest' from https://nodejs.org).

Install node module dependencies:
```
npm i
```

## Build / Run
Build and run local server (accessible on [http://localhost:4000](http://localhost:4000)):
```
npm run start
```
Build only (target folder: `./build`):
```
npm run build
```