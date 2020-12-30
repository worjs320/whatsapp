import React from "react";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar__header">Sidebar Header</div>
      <div className="sidebar__search"></div>
      <div className="sidebar__chats"></div>
    </div>
  );
}

export default Sidebar;
