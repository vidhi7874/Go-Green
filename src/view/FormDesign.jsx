import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Image,
  Text,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import plusIcon from "../assets/Images/plus.svg";

function FormDesign() {
  return (
    <Accordion allowMultiple>
      <AccordionItem border={"none"} marginBottom={"6"}>
        <h2>
          <AccordionButton
            backgroundColor={"white"}
            _hover={{ backgroundColor: "white" }}
            borderRadius={"xl"}
            padding={{ base: "4" }}
          >
            <Box
              as="span"
              flex="1"
              textAlign="left"
              color={"black"}
              fontWeight={"medium"}
            >
              Warehouse Details
            </Box>
            <Box width={"6"}>
              <Image src={plusIcon} alt="plusIcon" />
            </Box>
          </AccordionButton>
        </h2>
        <AccordionPanel
          pb={4}
          backgroundColor={"white"}
          _hover={{ backgroundColor: "white" }}
          borderRadius={"xl"}
          marginTop={"6"}
          padding={{ base: "5" }}
        >
          <Box>
            <Text color={"gray.900"} fontWeight={"semibold"}>
              PWH Warehouse Details
            </Text>
            <form>
              <FormLabel>Warehouse name</FormLabel>
              <Input />
            </form>
          </Box>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem border={"none"}>
        <h2>
          <AccordionButton
            backgroundColor={"white"}
            _hover={{ backgroundColor: "white" }}
            borderRadius={"xl"}
            padding={{ base: "4" }}
          >
            <Box
              as="span"
              flex="1"
              textAlign="left"
              color={"black"}
              fontWeight={"medium"}
            >
              Commodity Detail
            </Box>
            <Box width={"6"}>
              <Image src={plusIcon} alt="plusIcon" />
            </Box>
          </AccordionButton>
        </h2>
        <AccordionPanel
          pb={4}
          backgroundColor={"white"}
          _hover={{ backgroundColor: "white" }}
          borderRadius={"xl"}
          marginTop={"6"}
          padding={{ base: "5" }}
        >
          <Box>
            <Text color={"gray.900"} fontWeight={"semibold"}>
              PWH Commodity Details
            </Text>
            <form></form>
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export default FormDesign;
