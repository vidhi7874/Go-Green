import React from "react";
import { Image, chakra, shouldForwardProp } from "@chakra-ui/react";
import { motion, isValidMotionProp } from "framer-motion";
import { Loader_img } from "../assets";
// import { Loader_img } from "../assets";

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const Loader = ({ w, h }) => {
  return (
    <ChakraBox
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: "loop",
      }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      width={w || "70px"}
      height={h || "70px"}
    >
      <Image alt="loader_img" src={Loader_img} />
    </ChakraBox>
  );
};

export default Loader;
