import { useEffect, useState } from "react";
import useAuth from "../../hook/useAuth";
import { sidebar } from "../../router/sidebar";
import $ from "jquery";
import { Link, useNavigate } from "react-router-dom";
import Icons from "../../consts/Icons";
import clsx from "clsx";
import ROUTERS_PATHS from "../../consts/router-paths";
import logo from "../../assets/images/logo.png";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { ACTION_ROLE_CODE } from "../../consts/permission";

const Sidebar = () => {
  const { user } = useAuth();
  const [menu, setMenu] = useState<any>(sidebar);
  const navigate = useNavigate();
  const { permissions } = useSelector((state: any) => state.permission);

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

    if ($("body").hasClass("mini-sidebar") && $("body").hasClass("expand-menu")) {
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

  useEffect(() => {
    const _menu: any = [];
    menu.map((x: any) => {
      if (
        x.href &&
        (permissions || []).some((permission: any) => {
          let hasPermission = false;
          if (typeof x?.role === "string") hasPermission = permission?.resource?.code === x?.role;
          else if (typeof x?.role === "object" && x?.role.length && x?.role.length > 0)
            hasPermission = x?.role.includes(permission?.resource?.code);
          return (
            hasPermission && (permission?.actions || []).some((action: any) => action.code === ACTION_ROLE_CODE.View)
          );
        })
      ) {
        _menu.push(x);
      }
    });
    setMenu(_menu);
  }, [permissions]);
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
            {menu.map((m: any, i: number) => {
              const IconDisplay = m.icon;
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
                    <span>
                      <IconDisplay />
                      {m.title}
                    </span>
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
