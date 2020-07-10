import React from "react";
import Link from "next/link";

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Register", href: "/auth/register" },
    !currentUser && { label: "Login", href: "/auth/login" },
    currentUser && { label: "Sell Tickets", href: "/tickets/create" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && { label: "Logout", href: "/auth/logout" },
  ].filter((a) => a);

  return (
    <nav className={"navbar navbar-dark bg-primary"}>
      <Link href={"/"}>
        <a className={"navbar-brand"}>{"GitTix"}</a>
      </Link>
      <div className={"d-flex justify-content-end"}>
        <ul className="nav d-flex align-items-center">
          {links.map(({ label, href }) => (
            <li key={href} className={"nav-item"}>
              <Link href={href}>
                <a className={"nav-link text-light"}>{label}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export { Header };
