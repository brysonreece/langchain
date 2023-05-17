import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/app.scss';

function Placeholder() {
  return (
    <div className="w-full h-full min-h-screen inline-flex flex-col items-center justify-center bg-gray-100">
      <h3 className="text-sm font-semibold text-gray-900">Welcome!</h3>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Placeholder />} />
      </Routes>
    </Router>
  );
}
