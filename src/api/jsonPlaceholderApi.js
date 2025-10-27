const API_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Fetches posts from JSONPlaceholder with pagination.
 * @param {Object} options
 * @param {number} options.page - The current page number.
 * @param {number} options.limit - The number of posts per page.
 * @returns {Promise<{posts: Array, totalCount: number}>} A promise that resolves to the posts and total count.
 */
export const fetchPosts = async ({ page = 1, limit = 5 }) => {
    const response = await fetch(`${API_URL}/posts?_page=${page}&_limit=${limit}`);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const posts = await response.json();
    const totalCount = Number(response.headers.get('X-Total-Count'));

    return { posts, totalCount };
};