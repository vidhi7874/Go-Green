/*eslint-disable*/
// chakra imports
import { Box, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import SidebarContent from "./SidebarContent";

// FUNCTIONS

function Sidebar(props) {
  // to check for active links and opened collapses
  const mainPanel = React.useRef();
  let variantChange = "0.2s linear";

  const { routes, sidebarVariant } = props;
  console.log("routes: >>> form props >> ", routes);

  //  BRAND
  //  Chakra Color Mode
  let sidebarBg = "none";
  let sidebarRadius = "0px";
  let sidebarMargins = "0px";
  if (sidebarVariant === "opaque") {
    sidebarBg = useColorModeValue("white", "gray.700");
    sidebarRadius = "16px";
    sidebarMargins = "16px 0px 16px 16px";
  }

  // SIDEBAR
  return (
    <Box
      w="300px"
      bg="white"
      borderRadius="16px"
      p="10px 12px"
      minH={{
        base: "calc(100vh - 40px)",
        md: "calc(100vh - 60px)",
        lg: "calc(100vh - 90px)",
      }}
      h={{
        base: "calc(100vh - 40px)",
        md: "calc(100vh - 60px)",
        lg: "calc(100vh - 90px)",
      }}
      overflow="hidden"
    >
      <Box>
        <SidebarContent
          routes={routes}
          logoText={"GO Green"}
          display="none"
          sidebarVariant={sidebarVariant}
        />
      </Box>
    </Box>
  );
}

export default Sidebar;
