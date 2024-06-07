/*eslint-disable*/
// chakra imports
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Image,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import IconBox from "../Icons/IconBox";
import { Separator } from "../Separator/Separator";
import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../Icons/logo.svg";
import { useSelector } from "react-redux";
import DataTableFilter from "../DataTableFilter";
import configuration from "../../config/configuration";

// this function creates the links and collapses that appear in the sidebar (left menu)

const SidebarContent = ({ logoText, routes }) => {
  // to check for active links and opened collapses
  let location = useLocation();
  // this is for the rest of the collapses
  const [state, setState] = React.useState({});

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (allRoute) => {
    // console.log("routeName: ", routeName);
    // console.log("allRoute: 899>>>", allRoute);
    // TO FETCH THE CURRENT URL STATE...
    let pathName = location.pathname;
    // console.log("899pathName: ", pathName);

    const isActive = allRoute?.some((route) => pathName.startsWith(route));

    return isActive ? "active" : "";
  };

  const createLinks = (routes) => {
    // Chakra Color Mode
    // const activeBg = useColorModeValue("white", "gray.700");
    // const inactiveBg = useColorModeValue("white", "gray.700");
    // const activeColor = useColorModeValue("gray.700", "white");
    // const inactiveColor = useColorModeValue("gray.400", "gray.400");

    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.category) {
        var st = {};
        // const [hid, setHid] = useState(false);
        st[prop["state"]] = !state[prop.state];
        return (
          <div key={prop.name}>
            <Accordion allowMultiple>
              <AccordionItem border={"none"}>
                <AccordionButton p="0px" ml={"5px"}>
                  <Flex
                    as="span"
                    flex="1"
                    textAlign="left"
                    alignItems="center"
                    gap="9px"
                    fontWeight="bold"
                    mx="auto"
                    ps={{
                      sm: "0px",
                      xl: "0px",
                    }}
                    py="6px"
                    cursor="pointer"
                  >
                    {typeof prop.icon === "string" ? (
                      <Icon>{prop.icon}</Icon>
                    ) : (
                      <IconBox
                        bg="white"
                        color="gray.800"
                        h="30px"
                        w="30px"
                        ms="12px"
                        // ms="9px"
                      >
                        {prop.icon}
                      </IconBox>
                    )}
                    <Text color={"gray.800"} fontSize="13px" fontWeight={"600"}>
                      {prop.name}
                    </Text>
                  </Flex>
                  <AccordionIcon color={"gray.600"} fontSize="20px" />
                </AccordionButton>
                <AccordionPanel>{createLinks(prop.views)}</AccordionPanel>
              </AccordionItem>
            </Accordion>
          </div>
        );
      }
      return (
        <Box ml={prop.secondaryNavbar ? "0px " : "0px"}>
          <NavLink to={prop.path} key={prop.name}>
            {activeRoute(prop?.subType || []) === "active" ? (
              <Button
                // boxSize="initial"
                justifyContent="flex-start"
                alignItems="center"
                bg={"primary.700"}
                h={"40px"}
                // mb={{
                //   xl: "5px",
                // }}
                // ml={prop.secondaryNavbar ? "30px " : "0px"}
                // maxWidth={prop.secondaryNavbar ? "190px" : "100%"}
                // mx={{
                //   xl: "auto",
                // }}
                // p="8px"
                brorderRadius="15px"
                _hover="none"
                w="100%"
                _active={{
                  bg: "primary.700",
                  transform: "none",
                  borderColor: "transparent",
                }}
                _focus={{
                  boxShadow: "none",
                }}
              >
                <Flex>
                  {prop.secondaryNavbar ? (
                    <></>
                  ) : typeof prop.icon === "string" ? (
                    <Icon>{prop.icon}</Icon>
                  ) : (
                    <IconBox
                      bg="white"
                      color="primary.700"
                      h="30px"
                      w="30px"
                      me="12px"
                    >
                      {prop.icon}
                    </IconBox>
                  )}
                  <Text
                    color={"white"}
                    my="auto"
                    fontSize="13px"
                    fontWeight="700"
                  >
                    {prop.name}
                  </Text>
                </Flex>
              </Button>
            ) : (
              <Button
                // boxSize="initial"
                justifyContent="flex-start"
                alignItems="center"
                bg="transparent"
                h={"40px"}
                // mb={{
                //   xl: "12px",
                // }}
                // ml={prop.secondaryNavbar ? "30px " : "0px"}
                // maxWidth={prop.secondaryNavbar ? "190px" : "100%"}
                // mx={{
                //   xl: "auto",
                // }}
                // px="12px"
                // py="8px"
                borderRadius="15px"
                _hover="none"
                w="100%"
                _active={{
                  bg: "inherit",
                  transform: "none",
                  borderColor: "transparent",
                }}
                _focus={{
                  boxShadow: "none",
                }}
              >
                <Flex>
                  {prop.secondaryNavbar ? (
                    <></>
                  ) : typeof prop.icon === "string" ? (
                    <Icon>{prop.icon}</Icon>
                  ) : (
                    <IconBox
                      bg={""}
                      color="gray.600"
                      h="30px"
                      w="30px"
                      me="12px"
                    >
                      {prop.icon}
                    </IconBox>
                  )}
                  <Text
                    color={"#636363"}
                    fontWeight={prop.secondaryNavbar ? "medium" : "600"}
                    my="auto"
                    fontSize="13px"
                  >
                    {prop.name}
                  </Text>
                </Flex>
              </Button>
            )}
          </NavLink>
        </Box>
      );
    });
  };

  const links = <>{createLinks(routes)}</>;

  const { isShow } = useSelector(
    (state) => state.dataTableFiltersReducer?.filtersFields
  );

  return (
    <>
      <Box pt={"25px"} mb="12px" borderRadius="16px">
        <Link
          href={`${configuration.PUBLIC_URL}`}
          display="flex"
          lineHeight="100%"
          mb="30px"
          fontWeight="bold"
          justifyContent="center"
          alignItems="center"
          fontSize="11px"
        >
          {/* <CreativeTimLogo w="32px" h="32px" me="10px" /> */}
          <Image size="30" width={24} height={24} src={logo} />
          {/* <Text fontSize="sm" mt="3px">
            {logoText}
          </Text> */}
        </Link>
        <Separator></Separator>
      </Box>
      <Stack direction="column" mb="40px">
        <Box
          overflow="auto"
          pr={"10px"}
          h={{
            base: "calc(100vh - 190px)",
            md: "calc(100vh - 210px)",
            lg: "calc(100vh - 260px)",
          }}
        >
          {isShow ? <DataTableFilter /> : links}
        </Box>
      </Stack>
      {/* <SidebarHelp /> */}
    </>
  );
};

export default SidebarContent;
