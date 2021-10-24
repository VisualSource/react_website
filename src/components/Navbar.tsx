import { Link, NavLink} from 'react-router-dom';
import AccountItem from './AccountItem';


function NavItem(props: {
  route: string;
  title: string;
  exact?: boolean;
}) {
  return (
    <li className="nav-item">
      <NavLink className="nav-link" exact={props.exact ?? false} to={props.route} activeClassName="active">{props.title}</NavLink>
    </li>
  );
}

export default function Navbar(){
    return (
        <nav className="navbar navbar-expand-lg navbar-dark vs-bg-navbar">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img src="/resources/logo.webp" alt="" width="120" height="34"/>
            </Link>
            <button id="nav-menu" className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <NavItem route="/" exact title="Home"/>
                <NavItem route="/projects" title="Projects"/>
                <NavItem route="/games" title="Games"/>
                <NavItem route="/services" title="Services"/>
                <NavItem route="/news" title="News"/>
              </ul>
              <AccountItem/>
            </div>
          </div>
        </nav>
    );
}