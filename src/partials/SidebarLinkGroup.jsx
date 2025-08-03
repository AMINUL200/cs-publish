import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
// import { ChevronDown } from '../utils/icons';

function SidebarLinkGroup({
  children,
  activecondition,
}) {
  const location = useLocation();
  const [open, setOpen] = React.useState(
    activecondition ? location.pathname.includes(activecondition) : false
  );
  const handleClick = () => {
    setOpen(!open);
  }

  return (
    <li className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${(activecondition && location.pathname.includes(activecondition)) &&
      'from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]'
      }`}>
      {children(handleClick, open)}
    </li>
  );
}

export default SidebarLinkGroup;