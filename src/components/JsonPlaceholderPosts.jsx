import React, { useState, useEffect, useMemo } from 'react';
import { fetchPosts } from '@/api/jsonPlaceholderApi.js';
import Button from '@/components/Button';

const POSTS_PER_PAGE = 4;

export default function JsonPlaceholderPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const { posts: fetchedPosts, totalCount } = await fetchPosts({
                    page: currentPage,
                    limit: POSTS_PER_PAGE,
                });
                setPosts(fetchedPosts);
                setTotalPages(Math.ceil(totalCount / POSTS_PER_PAGE));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, [currentPage]);

    // Memoized filtering for search functionality
    const filteredPosts = useMemo(() => {
        if (!searchTerm) {
            return posts;
        }
        return posts.filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.body.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [posts, searchTerm]);

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-4">Blog Posts from API</h1>
            <p className="text-center mb-8">
                This component demonstrates fetching, searching, and paginating data from a public API.
            </p>

            <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 mb-6 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />

            {loading && <p className="text-center text-gray-600 dark:text-gray-400">Loading posts...</p>}
            {error && <p className="text-center text-red-600 dark:text-red-400">{error}</p>}

            {!loading && !error && (
                <>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredPosts.map(post => (
                            <li key={post.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col">
                                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white transition-colors duration-200">{post.title}</h3>
                                <p className="text-gray-900 dark:text-gray-400 flex-grow">{post.body}</p>
                            </li>
                        ))}
                    </ul>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-8">
                        <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                            Previous
                        </Button>
                        <span >
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
                            Next
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}