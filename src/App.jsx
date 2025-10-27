import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import { ThemeProvider } from './context/ThemeContext';
import { Routes, Route } from 'react-router-dom';

export default function App(){
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}
