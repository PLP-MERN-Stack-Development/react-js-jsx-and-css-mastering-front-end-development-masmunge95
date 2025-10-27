import TaskManager from '@/components/TaskManager';
import JsonPlaceholderPosts from '@/components/JsonPlaceholderPosts';

export default function HomePage() {
  return (
    <>
      <section id="tasks">
        <TaskManager />
      </section>
      <hr className="my-12 border-gray-700" />
      <section id="blog">
        <JsonPlaceholderPosts />
      </section>
    </>
  );
}