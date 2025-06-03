import './navbar.css';

const Navbar = () => {
  return (
    <header className="navbar-bg">
      <nav className="navbar">
        <div className="navbar-left">
          <input type = "image" src = "images/logo.png" alt = "boton" width = "100" className='logo'></input>
          <div className="search-bar">
            <input type="text" placeholder="Buscar" />
            <button className="search-icon">🔍</button>
          </div>
        </div>

        <div className="navbar-center">
          <div className="brand">
            <h1 className="brand-text"> 🍀 ESTO ES HAPPY NEW YEAR</h1>
          </div>
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