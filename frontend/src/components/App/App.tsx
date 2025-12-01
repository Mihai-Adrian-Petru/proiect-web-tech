import { Container, Button } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router';
import { useUser } from '../../context/UserContext';
import LoginPage from '../LoginPage';
import CharacterListPage from '../../pages/CharacterListPage';
import CharacterDetailPage from '../../pages/CharacterDetailPage';

function Layout() {
  const { isAuthenticated, logout, user } = useUser();
  const navigate = useNavigate();

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-center mb-0">
            <Link to="/" className="text-decoration-none text-dark">Breaking Bad Characters</Link>
        </h1>
        <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
                <>
                    <span>Welcome, {user?.username}</span>
                    <Button variant="outline-danger" onClick={logout}>Logout</Button>
                </>
            ) : (
                <Button variant="primary" onClick={() => navigate('/login')}>Login</Button>
            )}
        </div>
      </div>

      <Routes>
        <Route path="/" element={<CharacterListPage />} />
        <Route path="/characters/:id" element={<CharacterDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Container>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
