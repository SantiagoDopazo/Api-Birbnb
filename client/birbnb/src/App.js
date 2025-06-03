// import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router';
import { Routes, Route } from 'react-router-dom';
import Layout from './features/layout/layout';

function App() {
  return (
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<Layout  />} >
      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;