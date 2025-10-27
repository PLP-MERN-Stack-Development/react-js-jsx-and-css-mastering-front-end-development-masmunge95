export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">&copy; {currentYear} Task Manager. All rights reserved.</p>
            </div>
        </footer>
    );
}