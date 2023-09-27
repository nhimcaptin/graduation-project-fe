import { useState } from "react";
import useAuth from "../../hook/useAuth";
import { sidebar } from "../../router/sidebar";
import $ from "jquery";
import { Link, useNavigate } from "react-router-dom";
import Icons from "../../consts/Icons";
import clsx from "clsx";
import ROUTERS_PATHS from "../../consts/router-paths";
import logo from "../../assets/images/logo.png";

const Sidebar = () => {
  const { user } = useAuth();
  const [menu, setMenu] = useState(sidebar);
  const navigate = useNavigate();

  function expandSidebarHover(event: any) {
    event.stopPropagation();
    if ($("body").hasClass("mini-sidebar")) {
      var sidebarTarget = $(event.target).closest(".sidebar").length;
      if (sidebarTarget) {
        $("body").addClass("expand-menu");
        $("body").addClass("overflow-hidden");
        $(".subdrop + ul").slideDown();
      }
      return false;
    }
  }
  function shrinkSidebarHover(event: any) {
    event.stopPropagation();

    if (
      $("body").hasClass("mini-sidebar") &&
      $("body").hasClass("expand-menu")
    ) {
      $("body").removeClass("expand-menu");
      $("body").removeClass("overflow-hidden");
      $(".subdrop + ul").slideUp();
      return false;
    }
  }
  const checkActive = (href: string) => {
    const pathname = location.pathname;
    if (href === "/") {
      return href === pathname;
    } else {
      return pathname.includes(href);
    }
  };
  return (
    <div
      className="sidebar"
      id="sidebar"
      onMouseEnter={(event) => expandSidebarHover(event)}
      onMouseLeave={(event) => shrinkSidebarHover(event)}
    >
      <div className="sidebar-inner">
        <div
          id="logo-company"
          className="logo-company"
          onClick={() => {
            navigate(ROUTERS_PATHS.DASHBOARD);
          }}
        >
          <img src={logo} />
        </div>
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            {menu.map((m, i) => {
              const IconDisplay = m.icon || null;
              return (
                <li
                  key={m.key + i + window.location.pathname}
                  className={clsx({
                    ["submenu"]: m.subMenu && m.subMenu.length > 0,
                  })}
                >
                  <Link
                    key={window.location.pathname}
                    to={m.href}
                    className={clsx({
                      ["active"]: checkActive(m.href),
                    })}
                  >
                    <span>{m.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
