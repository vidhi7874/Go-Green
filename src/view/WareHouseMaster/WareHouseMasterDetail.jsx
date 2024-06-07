/* eslint-disable react-hooks/exhaustive-deps */
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

import WarehouseDetails from "./WarehouseDetails";
import OtherDetail from "./OtherDetail";
import SupervisorAndSecurityGuardDetail from "./SupervisorAndSecurityGuardDetail";
import FacilitiesAtWarehouse from "./FacilitiesAtWarehouse";
import WarehousesubDetail from "./WarehousesubDetail";
import { useGetWareHouseByIdMutation } from "../../features/master-api-slice";

function WareHouseMasterDetail() {
  const [getWarehouseDetails] = useGetWareHouseByIdMutation();

  const [warehouseDetailsData, setWarehouseDetailsData] = useState({});

  async function WarehouseDetailsApiFunction() {
    try {
      const warehouseId = window.location.pathname.split("/")[2] || 0;

      const response = await getWarehouseDetails({ id: warehouseId }).unwrap();

      setWarehouseDetailsData(response?.data || {});
      console.log("response?.data", response?.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    WarehouseDetailsApiFunction();
  }, []);

  return (
    <>
      <Box borderRadius={10} my={4}>
        <Accordion allowMultiple>
          {/* Warehouse Details Accordian Code Start  */}
          <AccordionItem p={2} bg="white">
            {({ isExpanded }) => (
              <>
                <AccordionButton>
                  <Box as="span" fontWeight="bold" flex="1" textAlign="left">
                    Warehouse Details
                  </Box>
                  {isExpanded ? (
                    <MinusIcon fontSize="12px" />
                  ) : (
                    <AddIcon fontSize="12px" />
                  )}
                </AccordionButton>

                <AccordionPanel pb={4}>
                  <WarehouseDetails
                    warehouseDetailsData={warehouseDetailsData}
                  />
                </AccordionPanel>
              </>
            )}
          </AccordionItem>

          {/* Warehouse sub Details accordian code start */}
          <AccordionItem p={2} bg="white" my={2}>
            {({ isExpanded }) => (
              <>
                <AccordionButton>
                  <Box as="span" fontWeight="bold" flex="1" textAlign="left">
                    Warehouse Sub Details
                  </Box>
                  {isExpanded ? (
                    <MinusIcon fontSize="12px" />
                  ) : (
                    <AddIcon fontSize="12px" />
                  )}
                </AccordionButton>

                <AccordionPanel pb={4}>
                  <WarehousesubDetail
                    warehouseDetailsData={warehouseDetailsData}
                  />
                </AccordionPanel>
              </>
            )}
          </AccordionItem>

          {/* Facilities at warehouse Accordian Code Start */}
          <AccordionItem p={2} bg="white" my={2}>
            {({ isExpanded }) => (
              <>
                <AccordionButton>
                  <Box as="span" fontWeight="bold" flex="1" textAlign="left">
                    Facilities at warehouse
                  </Box>
                  {isExpanded ? (
                    <MinusIcon fontSize="12px" />
                  ) : (
                    <AddIcon fontSize="12px" />
                  )}
                </AccordionButton>

                <AccordionPanel pb={4}>
                  <FacilitiesAtWarehouse
                    warehouseDetailsData={warehouseDetailsData}
                  />
                </AccordionPanel>
              </>
            )}
          </AccordionItem>

          {/* Security Arrangements Accordian Code Start  */}
          <AccordionItem p={2} bg="white" my={2}>
            {({ isExpanded }) => (
              <>
                <AccordionButton>
                  <Box as="span" fontWeight="bold" flex="1" textAlign="left">
                   Supervisor And Security Related Details
                  </Box>
                  {isExpanded ? (
                    <MinusIcon fontSize="12px" />
                  ) : (
                    <AddIcon fontSize="12px" />
                  )}
                </AccordionButton>

                <AccordionPanel pb={4}>
                  <SupervisorAndSecurityGuardDetail
                    warehouseDetailsData={warehouseDetailsData}
                  />
                </AccordionPanel>
              </>
            )}
          </AccordionItem>

          {/* Other details Accordian Code Start */}
          <AccordionItem p={2} bg="white" my={2}>
            {({ isExpanded }) => (
              <>
                <AccordionButton>
                  <Box as="span" fontWeight="bold" flex="1" textAlign="left">
                    Other details
                  </Box>
                  {isExpanded ? (
                    <MinusIcon fontSize="12px" />
                  ) : (
                    <AddIcon fontSize="12px" />
                  )}
                </AccordionButton>

                <AccordionPanel pb={4}>
                  <OtherDetail warehouseDetailsData={warehouseDetailsData} />
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        </Accordion>
      </Box>
    </>
  );
}

export default WareHouseMasterDetail;
