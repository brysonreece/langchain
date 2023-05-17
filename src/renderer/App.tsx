import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/app.scss';
import Home from './pages/Home';
import Playground from './pages/Playground';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}
