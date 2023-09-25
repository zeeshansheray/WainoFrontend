import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutContext } from "../context/layout.context";

const Navbar = () => {
  const [active, setActive] = useState(false);
  const layout = useContext(LayoutContext);

  const handleClick = () => {
    setActive(!active);
  };

  const menuItems = [
    {
      title: "Home",
      url: "",
      cName: "nav-links"
    },
    {
      title: "Waino Explorer",
      url: "waino-explorer",
      cName: "nav-links"
    },
    {
      title: "About",
      url: "about",
      cName: "nav-links"
    },
    {
        title: "Profile",
        url: "profile",
        cName: "nav-links"
      }
  ];

  return (
    <nav className="navbar" style={{background : layout?.state?.isHome ? '#000000' : '#F6F8FA'}}>
      <h1 className="navbar-logo" style={{color : layout?.state?.isHome ? '#ffffff' : '#000000 '}}>
        Waino
      </h1>
      <div className="menu-icon" onClick={handleClick}>
        <i className={active ? "fas fa-times" : "fas fa-bars"}></i>
      </div>
      <ul className={active ? "nav-menu active" : "nav-menu"} style={{color : layout?.state?.isHome ? '#ffffff' : '#000000', background : layout?.state?.isHome ? '#000000' : '#F5F7F8'}}>
        {menuItems.map((item, index) => {
          return (
            <li key={index}>
              <Link to={item.url} className={item.cName} style={{color : layout?.state?.isHome ? '#ffffff' : '#000000'}}>
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
