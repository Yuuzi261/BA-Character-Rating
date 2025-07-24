<p>
  English | 
  <a href="../README.md">繁體中文</a> | 
  <a href="./README.zh-CN.md">简体中文</a> | 
</p>

# BA Character Rating

<p align="left">
  <a href="https://vuejs.org/"><img alt="Vue.js" src="https://img.shields.io/badge/Vue.js-3-4FC08D?style=flat-square"></a>
  <a href="https://vitejs.dev/"><img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square"></a>
  <a href="https://opensource.org/licenses/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square"></a>
</p>

This is an integrated website for character ratings and information inquiry designed for players of the mobile game "Blue Archive". The project is built with Vue 3 and Vite, providing a clean, fast, and responsive interface to help players quickly look up character data, ratings, equipment, skills, and other information. The website's data is sourced from the CyberNeko guide team's character evaluation data (with their permission).

**[➡️ Click here to visit the website](https://ba-character-rating.pages.dev/)**

![Project Preview](https://raw.githubusercontent.com/Yuuzi261/BA-Character-Rating/refs/heads/main/public/og_image.webp)

---

## ✨ Key Features

*   **Character Ratings**: Integrates character evaluation information from the CyberNeko guide team for a better query experience.
*   **Multi-language Support**: Built-in switching between Simplified Chinese (`zh-cn`) and Traditional Chinese (`zh-tw`).
*   **Filtering and Sorting**: Allows filtering characters by various criteria such as school, attack type, and defense type.
*   **Responsive Design**: Provides a good viewing experience on both desktop and mobile devices.
*   **PWA Support**: Supports Progressive Web Apps, allowing the site to be "installed" on the desktop or home screen for more convenient access.

## 🛠️ Main Frameworks & Packages

*   **Frontend Framework**: [Vue 3](https://vuejs.org/) (Composition API)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **State Management**: [Pinia](https://pinia.vuejs.org/)
*   **Code Style**: [Prettier](https://prettier.io/)
*   **Code Linting**: [ESLint](https://eslint.org/)
*   **Deployment Platform**: [CloudFlare](https://www.cloudflare.com/)

## 🚀 Local Development

Please ensure you have [Node.js](https://nodejs.org/) (version 18.x or higher recommended) installed.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Yuuzi/BA-Character-Rating.git
    ```

2.  **Navigate to the project directory**
    ```bash
    cd BA-Character-Rating
    ```

3.  **Install dependencies**
    ```bash
    npm install
    ```

4.  **Start the development server**
    ```bash
    npm run dev
    ```
    The browser will automatically open to `http://localhost:5173`.

5.  **Build the project**
    To build the files for a production environment, run:
    ```bash
    npm run build
    ```
    The built files will be located in the `dist` directory.

### Project Scripts
 
| Command | Description |
| :--- | :--- |
| `npm install` | Installs all project dependencies. |
| `npm run dev` | Starts the local development server with hot-reloading. |
| `npm run build` | Bundles the project into the `dist` folder and minifies JSON files. |
| `npm run preview` | Previews the production build. |
| `npm run format` | Formats all code using Prettier. |
| `npm run lint` | Checks and fixes code style issues with ESLint. |
| `npm run analyze` | Runs a bundle analysis and generates a `stats.html` report. |

## 📁 Project Structure

```
BA-Character-Rating/
├── public/            # Public assets, not processed by Vite
├── src/
│   ├── assets/        # Static assets like images, fonts, and data JSONs
│   ├── components/    # Reusable Vue components
│   ├── composables/   # Composable functions (Hooks)
│   ├── locales/       # i18n language files
│   ├── store/         # Pinia state management
│   ├── style/         # Global styles
│   ├── utils/         # Shared utility functions
│   ├── App.vue        # Root component
│   └── main.js        # Application entry point
├── .eslintrc.cjs      # ESLint configuration file
├── package.json       # Project dependencies and scripts
└── vite.config.js     # Vite configuration file
```

## 🤝 Contributing & Assistance

This project warmly welcomes community contributions, whether it's helping with character rating data updates, providing suggestions, or reporting bugs.

You can help us by:

*   Opening issues and suggestions in [Issues](https://github.com/Yuuzi261/BA-Character-Rating/issues).
*   Submitting missing character rating data or code modifications via [Pull Requests](https://github.com/Yuuzi261/BA-Character-Rating/pulls).

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## 🙏 Acknowledgements

*   Thanks to all co-developers.
*   Special thanks to the CyberNeko guide team for providing the character rating data.
*   All game data and images on this site are the copyright of their original owners.
