import {
  Accordion,
  AccordionButton,
  // AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import React from "react";

import { AddIcon } from "@chakra-ui/icons";

const FormAccordian = () => {
  return (
    <>
      <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <AccordionButton
            mt={4}
            p={4}
            bgColor={"white"}
            _hover={""}
            borderRadius="xl"
          >
            <Box as="span" flex="1" textAlign="left">
              Commercial Detail
            </Box>
            <AddIcon
              fontSize={"2xl"}
              p={1}
              bgColor={"#D8D8D8"}
              borderRadius={"6px"}
            />
          </AccordionButton>

          <AccordionPanel pb={4} borderRadius="xl">
            <Box>
              <form></form>
            </Box>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton mt={4} p={4} bgColor={"white"} _hover={""}>
            <Box as="span" flex="1" textAlign="left">
              Client Detail
            </Box>
            <AddIcon
              fontSize={"2xl"}
              p={1}
              bgColor={"#D8D8D8"}
              borderRadius={"6px"}
            />
          </AccordionButton>

          <AccordionPanel pb={4}></AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default FormAccordian;
