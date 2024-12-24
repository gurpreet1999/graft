import PropTypes from "prop-types";
import { useState } from "react";
import { Collapse, ListItem, ListItemIcon, ListItemText, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import {
  collapseItem,
  collapseIconBox,
  collapseIcon,
  collapseText,
  collapseArrow,
} from "examples/Sidenav/styles/sidenavCollapse";
import { useMaterialUIController } from "context";

function SidenavCollapse({ icon, name, children, active, noCollapse, open, ...rest }) {
  const [controller] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  const [isCollapseOpen, setIsCollapseOpen] = useState(open);

  const handleCollapseToggle = () => {
    setIsCollapseOpen(!isCollapseOpen);
  };

  return (
    <>
      <ListItem component="li">
        <MDBox
          {...rest}
          sx={(theme) =>
            collapseItem(theme, { active, transparentSidenav, whiteSidenav, darkMode })
          }
        >
          <ListItemIcon
            sx={(theme) => collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode })}
          >
            {typeof icon === "string" ? (
              <Icon sx={(theme) => collapseIcon(theme, { active })}>{icon}</Icon>
            ) : (
              icon
            )}
          </ListItemIcon>

          <ListItemText
            primary={name}
            sx={(theme) =>
              collapseText(theme, {
                miniSidenav,
                transparentSidenav,
                whiteSidenav,
                active,
              })
            }
          />

          <Icon
            sx={(theme) =>
              collapseArrow(theme, {
                noCollapse,
                transparentSidenav,
                whiteSidenav,
                miniSidenav,
                open: isCollapseOpen,
                active,
                darkMode,
              })
            }
            onClick={handleCollapseToggle}
          >
            expand_less
          </Icon>
        </MDBox>
      </ListItem>
      {children && (
        <Collapse in={isCollapseOpen} unmountOnExit>
          {children}
        </Collapse>
      )}
    </>
  );
}

SidenavCollapse.defaultProps = {
  active: false,
  noCollapse: false,
  children: false,
  open: false,
};

SidenavCollapse.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  active: PropTypes.bool,
  noCollapse: PropTypes.bool,
  open: PropTypes.bool,
};

export default SidenavCollapse;
