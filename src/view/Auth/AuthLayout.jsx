import { Box, Flex, Image } from "@chakra-ui/react";
import React from "react";
import Auth_Pages_IMG from "../../assets/Images/Authentication_Pages_IMG.svg";
import logoImg from "../../components/Icons/logo.svg";

function AuthLayout({ children }) {
  return (
    <>
      <Flex
        p={"32px 32px 32px 70px"}
        flexDir={{ base: "column", md: "row" }}
        gap="70px"
      >
        <Box width={{ base: "100%", md: "45%" }}>
          {/* <Image src={logoImg} alt="logo" width={{ base: "30%" }} mb="30px" /> */}
          <Flex justifyContent="center" flexDirection="column">
            <Box width="65%">
              <Image
                src={logoImg}
                alt="logo"
                width={{ base: "30%" }}
                mb="30px"
              />
            </Box>
            <Box width="80%">{children}</Box>
          </Flex>
        </Box>
        <Box width={{ base: "100%", md: "55%" }}>
          <Image
            src={Auth_Pages_IMG}
            size="xl"
            objectFit="cover"
            alt="Authentication image"
            width={"100%"}
            h={"calc(100vh - 64px)"}
            borderRadius={"3xl"}
          />
        </Box>
      </Flex>
    </>
  );
}

export default AuthLayout;
