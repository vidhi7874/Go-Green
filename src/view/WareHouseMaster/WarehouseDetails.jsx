/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  FormControl,
  Grid,
  GridItem,
  Input,
  Text,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  HStack,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import ROUTE_PATH from "../../constants/ROUTE";
function WarehouseDetails({ warehouseDetailsData }) {
  const templateColumns = {
    base: "repeat(1, 1fr)",
    md: "repeat(3, 2fr)",
    lg: "repeat(3, 1fr)",
  };

  const commonWidth = {
    mt: 2,
    w: {
      base: "100%",
      sm: "80%",
      md: "60%",
      lg: "55%",
    },
    comm_details_style: {
      w: "90%",
    },
  };

  const commonStyle = {
    _placeholder: { color: "gray.300" },
    _hover: {
      borderColor: "primary.700",
      backgroundColor: "primary.200",
    },
    _focus: {
      borderColor: "primary.700",
      backgroundColor: "primary.200",
      boxShadow: "none",
    },
  };

  const dispatch = useDispatch();

  useEffect(() => {
    // set breadcrumbArray
    const breadcrumbArray = [
      {
        title: "Warehouse Master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE}`,
      },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
  }, []);
  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
  }, []);

  return (
    <Box>
      <Box>
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Warehouse Number*</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="text"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={warehouseDetailsData?.warehouse_number || ""}
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="Warehouse Number"
              />
            </FormControl>
          </GridItem>
        </Grid>
        {/* warehouse type */}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Warehouse Type*</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="text"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={
                  warehouseDetailsData?.warehouse_type?.warehouse_type_name ||
                  ""
                }
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="warehouse type "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* warehouse Subtype */}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Warehouse sub type*</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="text"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={
                  warehouseDetailsData?.warehouse_sub_type?.warehouse_subtype ||
                  ""
                }
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="Warehouse sub type "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* Warehouse unit type* */}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Warehouse unit type*</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="text"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={
                  warehouseDetailsData?.warehouse_unit_type
                    ?.warehouse_unit_type || ""
                }
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="Warehouse unit type "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* Warehouse Name */}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Warehouse Name*</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Textarea
                type="text"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                s
                borderRadius={"lg"}
                value={warehouseDetailsData?.warehouse_name || ""}
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="Warehouse Name"
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* Region* */}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Region*</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="text"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={warehouseDetailsData?.region?.region_name || ""}
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="Region "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* State**/}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">State* </Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="text"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={warehouseDetailsData?.state?.state_name || ""}
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder=" State "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* Sub state */}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Sub state*</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="text"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={warehouseDetailsData?.substate?.substate_name || ""}
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="Sub state "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* District */}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">District*</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="text"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={warehouseDetailsData?.district?.district_name || ""}
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="District "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* Area */}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Area*</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="text"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={warehouseDetailsData?.area?.area_name || ""}
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="Area "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* Warehouse address */}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Warehouse address*</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Textarea
                type="text"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={warehouseDetailsData?.warehouse_address || ""}
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="Warehouse address "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* Pin code */}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Pin code*</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="number"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={warehouseDetailsData?.warehouse_pincode || ""}
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="Pin code "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* GPS Location of warehouse*/}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">GPS Location of warehouse* </Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="text"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={warehouseDetailsData?.geo_location_of_warehouse || ""}
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="GPS Location of warehouse "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/*Total Rent Payable(Per Month)* */}

        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Total Rent Payable(Per Month)* </Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="number"
                border="1px"
                borderColor="gray.10"
                // name="total_rent_payable"
                backgroundColor={"white"}
                //  {...register("total_rent_payable")}
                height={"15px "}
                borderRadius={"lg"}
                value={warehouseDetailsData?.total_rent_payable}
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="Total Rent Payable(Per Month) "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* proposal type */}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Proposal Type*</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="text"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={
                  warehouseDetailsData?.lessee_details &&
                  warehouseDetailsData?.lessee_details.length > 0
                    ? "Sub Leased"
                    : " Leased"
                }
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder=" Proposal Type"
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* Warehouse Owner details table If WH Subtype selected as leased/Subleased/Triparty*/}
        <Box padding={"4"}>
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Warehouse owner details*</Text>{" "}
            </GridItem>
          </Grid>
          <TableContainer mt="4">
            <Table color="#000">
              <Thead bg="#dbfff5" border="1px" borderColor="#000">
                <Tr style={{ color: "#000" }}>
                  <Th color="#000">Sr No</Th>
                  <Th color="#000">Owner Name</Th>
                  <Th color="#000">Mobile No</Th>
                  <Th color="#000">Address</Th>
                  <Th color="#000">Rent</Th>
                  <Th color="#000">Min Fixed Amount</Th>
                  <Th color="#000">Revenue sharing</Th>
                </Tr>
              </Thead>
              <Tbody>
                {warehouseDetailsData?.owner_list ? (
                  warehouseDetailsData?.owner_list.map((item, index) => (
                    <Tr
                      textAlign="center"
                      bg="white"
                      border="1px"
                      borderColor="#000"
                      key={index}
                    >
                      <Td>{index + 1}</Td>
                      <Td>{item.warehouse_owner.warehouse_owner_name}</Td>
                      <Td>{item.warehouse_owner.warehouse_owner_contact_no}</Td>
                      <Td>{item.warehouse_owner.warehouse_owner_address}</Td>
                      <Td textAlign="center" bg="white">
                        {item?.rent_amount || "-"}
                      </Td>
                      <Td textAlign="center" bg="white">
                        {item?.revenue_sharing_fix_amt || "-"}
                      </Td>
                      <Td textAlign="center" bg="white">
                        {item?.revenue_sharing_ratio || "-"}
                      </Td>

                      {/* {item?.warehouse_owner_mapping?.map((subitem, i) => (
                        <>
                          <Td key={i} textAlign="center" bg="white">
                            {subitem?.rent_amount || "-"}
                          </Td>
                          <Td textAlign="center" bg="white">
                            {subitem?.revenue_sharing_fix_amt || "-"}
                          </Td>
                          <Td textAlign="center" bg="white">
                            {subitem?.revenue_sharing_ratio || "-"}
                          </Td>
                        </>
                      ))} */}
                    </Tr>
                  ))
                ) : (
                  <Tr
                    textAlign="center"
                    bg="white"
                    border="1px"
                    borderColor="#000"
                  >
                    <Td colSpan="5">No Record Found</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {/* Tri party details* */}
        {false ? (
          <Box p={"8"}>
            <Text>Tri party details*</Text>
            {/* First party  */}
            <HStack spacing="24px" my={"10"}>
              <Box w={"14"} h="40px">
                <Text>Sr No</Text>
                <Input
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  p={{ base: "4" }}
                  placeholder="Sr No"
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                />
              </Box>
              <Box w={"48"} h="40px">
                <Text>First party name</Text>
                <Input
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  p={{ base: "4" }}
                  placeholder="First party name"
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                />
              </Box>
              <Box w={"96"} h="40px">
                <Text>First party Address</Text>
                <Input
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  p={{ base: "4" }}
                  placeholder="First party Address"
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                />
              </Box>
            </HStack>

            {/* Second party  */}
            <HStack spacing="24px" my={"10"}>
              <Box w={"14"} h="40px">
                <Text>Sr No</Text>
                <Input
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  p={{ base: "4" }}
                  placeholder="Sr No"
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                />
              </Box>
              <Box w={"48"} h="40px">
                <Text>Second party name</Text>
                <Input
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  p={{ base: "4" }}
                  placeholder="Second party name"
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                />
              </Box>
              <Box w={"96"} h="40px">
                <Text>Second party Address</Text>
                <Input
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  p={{ base: "4" }}
                  placeholder="Second party Address"
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                />
              </Box>
            </HStack>

            {/* Third party */}
            <HStack spacing="24px" my={"10"}>
              <Box w={"14"} h="40px">
                <Text>Sr No</Text>
                <Input
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  p={{ base: "4" }}
                  placeholder="Sr No"
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                />
              </Box>
              <Box w={"48"} h="40px">
                <Text>Third party name</Text>
                <Input
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  p={{ base: "4" }}
                  placeholder="Third party name"
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                />
              </Box>
              <Box w={"96"} h="40px">
                <Text>Third party Address</Text>
                <Input
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  p={{ base: "4" }}
                  placeholder="Third party Address"
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                />
              </Box>
            </HStack>
          </Box>
        ) : (
          <></>
        )}
        {/* Warehouse owned by* */}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Warehouse owned by*</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="text"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={
                  warehouseDetailsData?.warehouse_sub_detail
                    ?.warehouse_owned_by || ""
                }
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="Warehouse owned by "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* Remark */}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Remark</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="text"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={
                  warehouseDetailsData?.warehouse_sub_detail
                    ?.funded_by_bank_remarks || ""
                }
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="Remark "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* Hypothecation of Warehouse* */}
        <Grid
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Hypothecation of Warehouse*</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
              {warehouseDetailsData?.warehouse_sub_detail
                ?.hypothecation_of_warehouse === true
                ? "Yes"
                : "No"}
            </FormControl>
          </GridItem>
        </Grid>

        {/* Account no */}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Account no</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="number"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={
                  warehouseDetailsData?.warehouse_sub_detail?.account_name || ""
                }
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="Account no "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* bank name */}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Bank name</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="text"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={
                  warehouseDetailsData?.warehouse_sub_detail?.bank?.bank_name ||
                  ""
                }
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="Bank name "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* Credit limit */}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Credit limit*</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="number"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={warehouseDetailsData?.warehouse_sub_detail?.credit_limit}
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="Credit limit "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* Outstanding */}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">
              Outstanding{" "}
              <span
                style={{
                  color: "red",
                  marginLeft: "4px",
                }}
              >
                *
              </span>
            </Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="number"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={warehouseDetailsData?.warehouse_sub_detail?.outstanding}
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="Outstanding "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* Account health */}
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right">Account health</Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <FormControl style={{ w: commonWidth.w }}>
              <Input
                type="text"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={
                  warehouseDetailsData?.warehouse_sub_detail?.account_health ||
                  ""
                }
                //  onChange={onChange}
                _placeholder={commonStyle._placeholder}
                _hover={commonStyle._hover}
                _focus={commonStyle._focus}
                isDisabled={true}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder="Account health "
              />
            </FormControl>
          </GridItem>
        </Grid>

        {warehouseDetailsData?.warehouse_unit_type?.warehouse_unit_type ===
        "Oil Tank" ? (
          <>
            <Box padding={"4"}>
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right"> Oil tank details*</Text>{" "}
                </GridItem>
              </Grid>
              <TableContainer mt="4">
                <Table color="#000">
                  <Thead bg="#dbfff5" border="1px" borderColor="#000">
                    <Tr style={{ color: "#000" }}>
                      <Th color="#000">Sr no</Th>
                      <Th color="#000">Oil tank number</Th>
                      <Th color="#000">Diameter</Th>
                      <Th color="#000">Height</Th>
                      <Th color="#000">Density</Th>
                      <Th color="#000">Capacity in MT</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {warehouseDetailsData?.chamber_list ? (
                      warehouseDetailsData?.chamber_list.map((item, index) => (
                        <Tr
                          textAlign="center"
                          bg="white"
                          border="1px"
                          borderColor="#000"
                          key={index}
                        >
                          <Td>{index + 1}</Td>
                          <Td>{item?.chamber_number} </Td>
                          <Td>{item?.diameter} </Td>
                          <Td>{item?.height} </Td>
                          <Td>{item?.density} </Td>
                          <Td>{item?.capacity} </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr
                        textAlign="center"
                        bg="white"
                        border="1px"
                        borderColor="#000"
                      >
                        <Td colSpan="8">No Record Found</Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </>
        ) : warehouseDetailsData?.warehouse_unit_type?.warehouse_unit_type ===
          "Silo" ? (
          <>
            <Box padding={"4"}>
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right"> Silo details*</Text>{" "}
                </GridItem>
              </Grid>
              <TableContainer mt="4">
                <Table color="#000">
                  <Thead bg="#dbfff5" border="1px" borderColor="#000">
                    <Tr style={{ color: "#000" }}>
                      <Th color="#000">Sr no</Th>
                      <Th color="#000">silo tank number</Th>
                      <Th color="#000">Diameter</Th>
                      <Th color="#000">Height</Th>
                      <Th color="#000">Density</Th>
                      <Th color="#000">Capacity in MT</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {warehouseDetailsData?.chamber_list ? (
                      warehouseDetailsData?.chamber_list.map((item, index) => (
                        <Tr
                          textAlign="center"
                          bg="white"
                          border="1px"
                          borderColor="#000"
                          key={index}
                        >
                          <Td>{index + 1}</Td>
                          <Td>{item?.chamber_number} </Td>
                          <Td>{item?.diameter} </Td>
                          <Td>{item?.height} </Td>
                          <Td>{item?.density} </Td>
                          <Td>{item?.capacity} </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr
                        textAlign="center"
                        bg="white"
                        border="1px"
                        borderColor="#000"
                      >
                        <Td colSpan="8">No Record Found</Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </>
        ) : (
          <>
            {/* Chamber details* */}

            <Box padding={"4"}>
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right"> Chamber details*</Text>{" "}
                </GridItem>
              </Grid>
              <TableContainer mt="4">
                <Table color="#000">
                  <Thead bg="#dbfff5" border="1px" borderColor="#000">
                    <Tr style={{ color: "#000" }}>
                      <Th color="#000">Sr no</Th>
                      <Th color="#000">Chamber number</Th>
                      <Th color="#000">Chamber length</Th>
                      <Th color="#000">Chamber breadth</Th>
                      <Th color="#000">Chamber roof height</Th>
                      <Th color="#000">Chamber stackable height</Th>
                      <Th color="#000">Chamber Sq.ft</Th>
                      <Th color="#000">Chamber total area sq. ft</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {warehouseDetailsData?.chamber_list ? (
                      warehouseDetailsData?.chamber_list.map((item, index) => (
                        <Tr
                          textAlign="center"
                          bg="white"
                          border="1px"
                          borderColor="#000"
                          key={index}
                        >
                          <Td>{index + 1}</Td>
                          <Td>{item?.chamber_number} </Td>
                          <Td>{item?.chamber_length} </Td>
                          <Td>{item?.chamber_breadth} </Td>
                          <Td>{item?.roof_height} </Td>
                          <Td>{item?.stackble_height} </Td>
                          <Td>{item?.sq_feet?.toFixed(2) || "-"} </Td>
                          <Td>{item?.total_area?.toFixed(2) || "-"} </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr
                        textAlign="center"
                        bg="white"
                        border="1px"
                        borderColor="#000"
                      >
                        <Td colSpan="8">No Record Found</Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default WarehouseDetails;
