# React Login App

## Overview
This project is a React-based single-page application that implements a login flow, posts listing, and post detail editing with persistence. It uses modern React practices, including hooks and component-based architecture, to provide a clean and maintainable codebase.
It also demonstrates how modern frontend practices (like controlled forms, local persistence, and contextual user data) can be applied to small-scale projects.

## Features
- **Login Flow**: A form that collects Company Code, Region, Email, and Password. After login, the user is redirected to the posts list.
- **Posts List**: Displays posts fetched from [JSONPlaceholder API](https://jsonplaceholder.typicode.com/posts). The user's email is visible, and a search box allows filtering by title or body.
- **Post Detail**: Allows editing of post details (title and body). Changes are saved locally and persist even after page refresh.
- **Optional Chart**: A pie chart showing the number of posts per user, created using Recharts.
- **Search Feedback**: Shows matching count and handles “no result” cases for better UX.

## Technology Choices
- **React**: Utilizes hooks (useState, useEffect) and component-based architecture.
- **React Router**: Handles navigation and routing.
- **Axios**: Manages API requests centrally.
- **Recharts**: Used for the optional pie chart visualization.
- **CSS Modules**: Ensures style isolation and maintainability.
- **Web Storage API**: Used to persist post edits across refreshes.

## Project Structure
```
react-login-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login/
│   │   │   ├── Login.js
│   │   │   ├── Login.module.css
│   │   │   └── validateLoginForm.js
│   │   ├── PostsList/
│   │   │   ├── PostsList.js
│   │   │   ├── PostsList.module.css
│   │   │   └── Pagination.js
│   │   ├── PostDetail/
│   │   │   ├── PostDetail.js
│   │   │   └── PostDetail.module.css
│   │   └── Navbar/
│   │       ├── Navbar.js
│   │       └── Navbar.module.css
│   ├── context/
│   │   └── AuthContext.js
│   ├── hooks/
│   │   └── useDebounce.js
│   ├── api.js
│   ├── App.js
│   └── index.js
└── package.json
```

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd react-login-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Usage
- **Login**: Enter your credentials to access the posts list.
- **Posts List**: View all posts, search by title or body, and click on a post to view/edit details.
- **Post Detail**: Edit the post title and body. Changes are saved locally and persist after refresh.

## AI Usage
During development, AI was used as a reference tool for:
- Validating regular expressions more efficiently,
- Exploring alternate CSS optimization strategies,
- Cross-checking common patterns for better error feedback.

All decisions, implementations, and integrations were written and adapted manually.

## License
This project is licensed under the MIT License.
