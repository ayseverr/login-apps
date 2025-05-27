# KnockoutJS Login App

## Overview
This project is a KnockoutJS-based single-page application that replicates the features and user experience of the React version. It demonstrates how modern frontend patterns (such as data-binding, local persistence, and responsive design) can be implemented using KnockoutJS observables and bindings.

## Features
- **Login Flow**: A form that collects Company Code, Region, Email, and Password. After login, the user is redirected to the posts list. (Mock Data)
- **Posts List**: Displays posts fetched from [JSONPlaceholder API](https://jsonplaceholder.typicode.com/posts). The user's email is visible, and a search box allows filtering by title or body.
- **Post Detail**: Allows editing of post details (title and body). Changes are saved locally (using localStorage) and persist even after page refresh.
- **Optional Chart**: A doughnut chart showing the number of posts per user, created using Chart.js.
- **Search Feedback**: Shows matching count and handles "no result" cases for better UX.

## Technology Choices
- **KnockoutJS**: Used for data-binding and UI reactivity via observables and computed observables.
- **Chart.js**: Used for the optional doughnut chart visualization.
- **Web Storage API**: Used to persist post edits across refreshes.
- **Vanilla CSS**: For responsive and modern UI styling.

## Project Structure
```
knockout-login-app/
├── index.html
├── styles.css
└── main.js
```

## Installation & Usage
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd knockout-login-app
   ```
2. Open `index.html` directly in your browser (no build step required).

## Usage
- **Login**: Enter your credentials to access the posts list.
- **Posts List**: View all posts, search by title or body, and click on a post to view/edit details.
- **Post Detail**: Edit the post title and body. Changes are saved locally and persist after refresh.

## AI & External Help
Since I had limited prior experience with KnockoutJS, I used the following resources:
- **Official KnockoutJS documentation** for understanding core concepts and best practices,
- **Community tutorials and forums** for troubleshooting specific issues,
- **AI-based code assistants (such as ChatGPT)** to help translate React patterns into KnockoutJS idioms and to debug binding/state issues. (only as a guide, not for full-code generation)

All code and design decisions were made and adapted manually, with AI used as a reference and learning tool.

## License
This project is licensed under the MIT License. 