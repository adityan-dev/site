document.addEventListener('DOMContentLoaded', () => {

    const blogPostsContainer = document.getElementById('blog-posts-container');
    const searchInput = document.getElementById('search'); // Your existing search bar
    const blogLinks = document.querySelectorAll('.org-ul li a');
    
    let allPosts = []; // This will store all our fetched blog post data

    /**
     * Fetches and parses all blog posts from the initial list.
     */
    async function fetchAllPosts() {
	// These constants define the mapping for snippet length.
	// Feel free to tweak them to your liking!
	const MIN_SNIPPET_LENGTH = 150; // The snippet length for the shortest articles
	const MAX_SNIPPET_LENGTH = 800; // The snippet length for the longest articles
	const MIN_ARTICLE_LENGTH = 400; // An assumed "short" article character count
	const MAX_ARTICLE_LENGTH = 5000; // An assumed "long" article character count

	const postsPromises = Array.from(blogLinks).map(async (link) => {
            try {
		const response = await fetch(link.href);
		if (!response.ok) throw new Error(`Failed to fetch ${link.href}`);
		
		const htmlText = await response.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlText, 'text/html');
		
		const title = doc.querySelector('.title')?.textContent || 'Untitled Post';
		const firstParagraph = doc.querySelector('p')?.textContent || '';
            
		// --- New Proportional Logic ---
		const fullContentLength = doc.body.textContent?.length || 0;
		
		// Calculate how far the article's length is between our min and max
		let proportion = (fullContentLength - MIN_ARTICLE_LENGTH) / (MAX_ARTICLE_LENGTH - MIN_ARTICLE_LENGTH);
		// Clamp the proportion between 0 (for short articles) and 1 (for long articles)
		proportion = Math.max(0, Math.min(1, proportion)); 
		
		// Calculate the final snippet length based on this proportion
		const proportionalLength = Math.floor(MIN_SNIPPET_LENGTH + proportion * (MAX_SNIPPET_LENGTH - MIN_SNIPPET_LENGTH));
		
		const snippet = firstParagraph.substring(0, proportionalLength).trim() + '...';
		// -----------------------------

		return {
                    title: title,
                    snippet: snippet,
                    url: link.href,
		};
            } catch (error) {
		console.error('Error fetching post:', error);
		return null;
        }
	});
	
	allPosts = (await Promise.all(postsPromises)).filter(post => post !== null);
	renderPosts(allPosts);
    }
    
    /**
     * Renders an array of post objects to the DOM.
     * @param {Array<Object>} posts - The array of posts to display.
     */
    function renderPosts(posts) {
        blogPostsContainer.innerHTML = ''; // Clear existing posts

        if (posts.length === 0) {
            blogPostsContainer.innerHTML = '<p>No matching posts found.</p>';
            return;
        }

        posts.forEach(post => {
            const postCard = document.createElement('article');
            postCard.className = 'blog-post-card';
            postCard.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.snippet}</p>
                <a href="${post.url}">Read more...</a>
            `;
            blogPostsContainer.appendChild(postCard);
        });
	handleColumnEndings();
    }

    /**
     * Handles the search input, filters posts, and re-renders them.
     */
    function handleSearch() {
        const query = searchInput.value.toLowerCase().trim();

        if (!query) {
            renderPosts(allPosts); // If search is empty, show all posts
            return;
        }

        // A better search: splits query into keywords and checks if all are present
        const searchKeywords = query.split(' ').filter(k => k);

        const filteredPosts = allPosts.filter(post => {
            const postText = (post.title + ' ' + post.snippet).toLowerCase();
            return searchKeywords.every(keyword => postText.includes(keyword));
        });

        renderPosts(filteredPosts);
    }

     /**
     * Finds the last card in each visual column and adds a class to hide its separator line.
     */
    function handleColumnEndings() {
        const cards = document.querySelectorAll('.blog-post-card');
        if (cards.length === 0) return;
    
        // Clear any existing classes first
        cards.forEach(card => card.classList.remove('is-last-in-column'));
    
        // Group cards by their horizontal position (i.e., by column)
        const columns = new Map();
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const leftPos = Math.round(rect.left);
            if (!columns.has(leftPos)) {
                columns.set(leftPos, []);
            }
            columns.get(leftPos).push(card);
        });
    
        // Find the bottom-most card in each column
        columns.forEach(columnCards => {
            let lastCard = columnCards[0];
            for (const card of columnCards) {
                if (card.getBoundingClientRect().top > lastCard.getBoundingClientRect().top) {
                    lastCard = card;
                }
            }
            lastCard.classList.add('is-last-in-column');
        });
    }

    // Debouncer to prevent the resize function from firing too often
    let resizeTimeout;
    function debouncedHandleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleColumnEndings, 100);
    }
    window.addEventListener('resize', debouncedHandleResize);


    // --- Initialize ---
    fetchAllPosts();
    searchInput.addEventListener('input', handleSearch);

});
