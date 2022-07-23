import { NavLink } from "react-router-dom";

export function NavigationLink({ className, activeClassName, to, text }) {
    return (
      <NavLink className={({ isActive }) => isActive ? `${className} ${activeClassName}` : className } to={to}> { text } </NavLink>
    );
  }