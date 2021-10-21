import { Link, NavLink} from 'react-router-dom';
import AccountItem from './AccountItem';

export default function Navbar(){
    return (
        <nav className="navbar navbar-expand-lg navbar-dark vs-bg-navbar">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img src="/resources/logo.webp" alt="" width="120" height="34"/>
            </Link>
            <button id="test" className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink className="nav-link" exact to="/" activeClassName="active">Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/projects" activeClassName="active">Projects</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/services" activeClassName="active">Services</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/news" activeClassName="active">News</NavLink>
                </li>
              </ul>
              <AccountItem/>
            </div>
          </div>
        </nav>
    );
}