import { Box, Image } from "@chakra-ui/react";
import React from "react";
import access from "../Images/notaccess.svg";

const NotaccessImage = () => {
  return (
    <>
      <Box>
        <Image sizes="20" src={access} alt="You Do Not Have Access Of These" />
      </Box>
    </>
  );
};

export default NotaccessImage;
