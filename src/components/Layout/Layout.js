import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import Sidebar from "../Sidebar";
import Header from "../Header/Header";
import SidebarList from "../../routes/SidebarList";
import { useSelector } from "react-redux";
import { setSidebarVisibility } from "../../features/filter.slice";

function Layout({ variant, title, children }) {
  // const [sidebarVisibility, setSidebarVisibility] = useState(true);

  // const dispatch = useDispatch();
  const sidebarVisibility = useSelector(
    (state) => state.dataTableFiltersReducer?.sidebarVisibility
  );

  return (
    <Flex
      p={{ base: "20px", md: "30px 20px", lg: "45px 30px" }}
      gap={{ base: "0px", md: sidebarVisibility ? "35px" : "0px" }}
    >
      <Box
        flex="none"
        // width="250px"
        width={sidebarVisibility ? "300px" : 0}
        transition="width 0.5s ease-in-out"
        opacity={sidebarVisibility ? 1 : 0}
        display={{ base: "none", lg: "block" }}
      >
        <Box
          position="fixed"
          top={{ base: "20px", md: "30px", lg: "45px" }}
          transition="opacity 1.5s ease-in-out"
          opacity={sidebarVisibility ? 1 : 0}
        >
          <Sidebar routes={SidebarList} />
        </Box>
      </Box>
      <Box width="100%" transition="opacity width 0.9s ease-in-out">
        <Header
          variant={variant}
          title={title}
          sidebarVisibility={sidebarVisibility}
          setSidebarVisibility={setSidebarVisibility}
        />
        <Box
          width={{
            base: "calc(100vw - 40px)",
            md: "calc(100vw - 40px)",
            lg: sidebarVisibility
              ? "calc(100vw - 395px)"
              : "calc(100vw - 60px)",
          }}
        >
          {children}
        </Box>
      </Box>
    </Flex>
  );
}

export default Layout;
