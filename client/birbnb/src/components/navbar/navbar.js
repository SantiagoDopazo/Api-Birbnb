import './navbar.css';
import { Link } from "react-router-dom";
import { NavLink } from 'react-router-dom';



const Navbar = () => {
  return (
    <header className="navbar-bg">
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/">
            <img src="images/logo.png" alt="Logo" width="100" className="logo" />
          </Link>


          <div className="search-bar">
            <input type="text" placeholder="Buscar" />
            <button className="search-icon">🔍</button>
          </div>
        </div>

<div className="navbar-center">
  <NavLink
    to="/busquedaAlojamientos"
    className={({ isActive }) =>
      isActive ? 'nav-link activo' : 'nav-link'
    }
  >
    <div className="nav-item">
      <img src="images/casa.png" alt="Alojamientos" className="icono-nav" />
      <span className="nav-text">Alojamientos</span>
    </div>
  </NavLink>
</div>


        <div className="navbar-right">
          <button className="cart">
            👜
            <span className="cart-count">0</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;