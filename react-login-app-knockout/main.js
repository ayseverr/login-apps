// This is the main ViewModel for our KnockoutJS app.
// I use observables to track the current view and form fields.
// The login function is a mock that simulates a delay and then redirects to the posts view.

(function() {
  // Main ViewModel
  function AppViewModel() {
    // I always start on the login view and make sure no modal is open initially.
    this.currentView = ko.observable('login');
    this.selectedPost = ko.observable(null);

    // Login form observables
    this.companyCode = ko.observable('');
    this.region = ko.observable('');
    // I want to persist the email in localStorage so the user doesn't have to re-enter it after a reload.
    this.email = ko.observable(localStorage.getItem('loggedInEmail') || '');
    this.password = ko.observable('');
    this.loading = ko.observable(false);

    // I keep all posts and users fetched from the API here.
    this.posts = ko.observableArray([]);
    this.users = ko.observableArray([]);
    // This observable is for the search input.
    this.searchQuery = ko.observable('');
    this.currentPage = ko.observable(1);
    this.pageSize = 9; // I want 9 posts per page for a balanced grid.

    this.editTitle = ko.observable('');
    this.editBody = ko.observable('');
    this.showSuccess = ko.observable(false);

    let pieChart = null;
    // I chose this color palette to match the React version and keep the UI consistent.
    const chartColors = [
      '#a78bfa', '#f9a8d4', '#fbbf24', '#7dd3fc', '#f472b6', '#818cf8', '#facc15', '#34d399', '#f87171', '#6366f1'
    ];

    // I compute the number of posts per user for the chart.
    this.userPostCounts = ko.computed(() => {
      const counts = {};
      this.users().forEach(u => { counts[u.id] = 0; });
      this.posts().forEach(p => { if (counts[p.userId] !== undefined) counts[p.userId]++; });
      return this.users().map(u => ({ name: u.name, count: counts[u.id] }));
    });

    // I render or update the pie chart whenever the data changes.
    this.updatePieChart = () => {
      const ctx = document.getElementById('postsPieChart');
      if (!ctx) return;
      const data = this.userPostCounts();
      const labels = data.map(d => d.name);
      const values = data.map(d => d.count);
      if (pieChart) pieChart.destroy();
      pieChart = new window.Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: chartColors,
            borderWidth: 1,
            borderColor: '#fff'
          }]
        },
        options: {
          cutout: '72%',
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: '#a78bfa',
                font: { size: 13, weight: '400', family: 'inherit' },
                boxWidth: 14,
                padding: 8
              }
            }
          }
        }
      });
    };

    // I want the chart to update only when both posts and users are loaded and the posts view is active.
    ko.computed(() => {
      if (this.currentView() === 'posts' && this.users().length && this.posts().length) {
        setTimeout(this.updatePieChart, 0);
      }
    });

    // This observable holds validation errors for the edit form.
    this.validationError = ko.observable('');
    // I save changes to a post and persist them in localStorage so edits are not lost on reload.
    this.savePost = () => {
      const post = this.selectedPost();
      if (!post) return;
      if (!this.editTitle().trim() || !this.editBody().trim()) {
        this.validationError('Title and body cannot be empty.');
        return;
      }
      this.validationError('');
      const updated = {
        ...post,
        title: this.editTitle(),
        body: this.editBody(),
      };
      localStorage.setItem('post_' + post.id, JSON.stringify(updated));
      const idx = this.posts().findIndex(p => p.id === post.id);
      if (idx !== -1) {
        const newPosts = [...this.posts()];
        newPosts[idx] = updated;
        this.posts(newPosts);
      }
      this.showSuccess(true);
      setTimeout(() => {
        this.showSuccess(false);
        this.closeDetail();
      }, 1200);
    };

    // I fetch posts and users from the JSONPlaceholder API. If a post was edited, I load the local version instead.
    this.fetchPostsAndUsers = async () => {
      try {
        const [usersRes, postsRes] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/users'),
          fetch('https://jsonplaceholder.typicode.com/posts')
        ]);
        const users = await usersRes.json();
        let posts = await postsRes.json();
        posts = posts.map(post => {
          const local = localStorage.getItem('post_' + post.id);
          return local ? JSON.parse(local) : post;
        });
        this.users(users);
        this.posts(posts);
      } catch (err) {
        alert('Failed to fetch posts or users. Please try again later.');
      }
    };

    // I use a debounced observable for search to avoid filtering on every keystroke.
    this.debouncedQuery = ko.observable('');
    let debounceTimeout = null;
    this.searchQuery.subscribe(q => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        this.debouncedQuery(q);
      }, 350); // 350ms debounce feels responsive but not too aggressive.
    });
    // I filter posts by title or body based on the debounced search query.
    this.filteredPosts = ko.computed(() => {
      const q = this.debouncedQuery().toLowerCase();
      if (!q) return this.posts();
      return this.posts().filter(post =>
        post.title.toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q)
      );
    });
    // I update the search info and no-results message in the DOM for better UX.
    ko.computed(() => {
      const infoEl = document.querySelector('.search-info');
      const noResEl = document.querySelector('.no-results');
      if (infoEl) {
        if (this.debouncedQuery()) {
          infoEl.innerHTML = `Found <span>${this.filteredPosts().length}</span> results | Search term: <span class="search-term">${this.debouncedQuery()}</span>`;
        } else {
          infoEl.innerHTML = '';
        }
      }
      if (noResEl) {
        if (this.debouncedQuery() && this.filteredPosts().length === 0) {
          noResEl.textContent = 'No posts match this criteria. Try searching for something else in the title or body.';
        } else {
          noResEl.textContent = '';
        }
      }
    });

    // I paginate the filtered posts for the current page.
    this.paginatedPosts = ko.computed(() => {
      const start = (this.currentPage() - 1) * this.pageSize;
      return this.filteredPosts().slice(start, start + this.pageSize);
    });

    this.totalPages = ko.computed(() => {
      return Math.ceil(this.filteredPosts().length / this.pageSize) || 1;
    });

    // I handle page changes and scroll to the top of the posts list for better UX.
    this.goToPage = (page) => {
      if (page >= 1 && page <= this.totalPages()) {
        this.currentPage(page);
        setTimeout(() => {
          const postsView = document.getElementById('posts-view');
          if (postsView) postsView.scrollIntoView({ behavior: 'smooth' });
        }, 0);
      }
    };

    //  get the user's name by their userId. This is used to display the author on each post card.
    this.getUserName = (userId) => {
      const user = this.users().find(u => u.id === userId);
      return user ? user.name : '';
    };

    // open the post detail modal for editing. If the post was edited before, I load the local version.
    this.selectPost = (post) => {
      const local = localStorage.getItem('post_' + post.id);
      const postData = local ? JSON.parse(local) : post;
      this.selectedPost(postData);
      this.editTitle(postData.title);
      this.editBody(postData.body);
      this.currentView('detail');
    };

    this.closeDetail = () => {
      this.selectedPost(null);
      this.editTitle('');
      this.editBody('');
      this.currentView('posts');
    };

    // This is a mock login function. I set the email observable from the input and persist it in localStorage.
    this.login = function() {
      this.loading(true);
      // I grab the value from the email input and update the observable.
      var emailInput = document.getElementById('email');
      if (emailInput) this.email(emailInput.value);
      setTimeout(async () => {
        localStorage.setItem('loggedInEmail', this.email());
        localStorage.setItem('view', 'posts');
        await this.fetchPostsAndUsers();
        this.selectedPost(null);
        this.loading(false);
        this.currentView('posts');
      }, 900);
    };

    this.goToPosts = () => {
      this.currentView('posts');
    };
    this.goToStats = () => {
      this.currentView('stats'); // This is a placeholder. I left it here in case I want to implement a stats view later.
    };
    this.logout = () => {
      localStorage.removeItem('loggedInEmail');
      localStorage.removeItem('view');
      this.companyCode('');
      this.region('');
      this.email('');
      this.password('');
      this.selectedPost(null);
      this.editTitle('');
      this.editBody('');
      this.currentPage(1);
      this.currentView('login');
    };

    // This observable was used for modal testing during development.
    this.showTestModal = ko.observable(true);

    // I used this function to test if KO bindings were working.
    this.testAlert = function() {
      alert('KO binding is working!');
    };

    // I want to make sure the navbar is never visible on the login screen.
    ko.computed(() => {
      const nav = document.querySelector('.navbar');
      if (!nav) return;
      if (this.currentView() === 'login') {
        nav.style.display = 'none';
      } else {
        nav.style.display = '';
      }
    });

    // I use a computed to generate a compact pagination array with ellipsis if there are more than 5 pages.
    this.paginationPages = ko.computed(() => {
      const total = this.totalPages();
      const current = this.currentPage();
      if (total <= 5) {
        return Array.from({length: total}, (_, i) => i + 1);
      }
      const pages = [];
      if (current <= 3) {
        pages.push(1, 2, 3, 4, '...', total);
      } else if (current >= total - 2) {
        pages.push(1, '...', total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
      }
      return pages;
    });
  }

  // I apply KO bindings when the DOM is fully loaded.
  document.addEventListener('DOMContentLoaded', function() {
    ko.applyBindings(new AppViewModel(), document.getElementById('app'));
  });
})();
