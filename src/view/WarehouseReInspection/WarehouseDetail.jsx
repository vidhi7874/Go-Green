import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Heading,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import ReactSelect from "react-select";
import { BiEditAlt } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";

const WarehouseDetail = () => {
  const [selectedOption1, setSelectedOption1] = useState(null);
  const [selectedOption2, setSelectedOption2] = useState(null);

  const handleSelectChange1 = (selectedOption) => {
    setSelectedOption1(selectedOption);
  };
  const handleSelectChange2 = (selectedOption) => {
    setSelectedOption2(selectedOption);
  };

  const firstoptions = [
    { value: "HDFC Bank", label: "HDFC Bank" },
    { value: "IDBI Bank", label: "IDBI Bank" },
    { value: "GoGreen", label: "GoGreen" },
  ];
  const secondoptions = [
    { value: "BOB Bank", label: "BOB Bank" },
    { value: "SBI Bank", label: "SBI Bank" },
    { value: "GoGreen", label: "GoGreen" },
  ];

  const reactSelectStyle = {
    menu: (base) => ({
      ...base,
      // backgroundColor: "#A6CE39",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#A6CE39" : "white",
      color: state.isFocused ? "green" : "black",
      textAlign: "left",
      "&:hover": {
        //  backgroundColor: "#C2DE8C",
        color: "black",
      },
    }),
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
  return (
    <>
      <Box>
        <Box
          w={{
            base: "100%",
            sm: "100%",
            md: "100%",
            lg: "100%",
            xl: "100%",
          }}
        >
          {/* Warehouse code* */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Warehouse code*</Text>{" "}
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
                  //value={inputValue}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  //  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Warehouse code"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* Standard inspection code*  */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Standard inspection code*</Text>{" "}
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
                  //value={inputValue}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  //  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Standard inspection code "
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/*  Warehouse type*   */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right"> Warehouse type*</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <ReactSelect
                  value={selectedOption1}
                  onChange={handleSelectChange1}
                  options={firstoptions}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      // borderColor: clientError.clientType ? "red" : "#c3c3c3",

                      padding: "1px",
                      textAlign: "left",
                    }),
                    ...reactSelectStyle,
                  }}
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/* Warehouse sub type*  */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Warehouse sub type* </Text>{" "}
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
                  //value={inputValue}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  //  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Warehouse sub type "
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/*  Warehouse unit type */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Warehouse unit type</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <ReactSelect
                  value={selectedOption2}
                  onChange={handleSelectChange2}
                  options={secondoptions}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      // borderColor: clientError.clientType ? "red" : "#c3c3c3",

                      padding: "1px",
                      textAlign: "left",
                    }),
                    ...reactSelectStyle,
                  }}
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/* Warehouse Name*/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Warehouse Name</Text>{" "}
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
                  //value={inputValue}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  //  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Warehouse Name"
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/*  Region */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Region</Text>{" "}
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
                  //value={inputValue}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  //  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Region"
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/* State*/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">State</Text>{" "}
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
                  //value={inputValue}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  //  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="State"
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/* Sub state*/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Sub state</Text>{" "}
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
                  //value={inputValue}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  //  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Sub state"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/*District*/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">District</Text>{" "}
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
                  //value={inputValue}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  //  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="District"
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/*Area*/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Area</Text>{" "}
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
                  //value={inputValue}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  //  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Area"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/*Warehouse address*/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Warehouse address</Text>{" "}
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
                  //value={inputValue}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  //  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Warehouse address"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/*Pin code*/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Pin code</Text>{" "}
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
                  //value={inputValue}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  //  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Pin code"
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/*GPS Location of warehouse */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">GPS Location of warehouse </Text>{" "}
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
                  //value={inputValue}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  //  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="GPS Location of warehouse "
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/*Proposal type */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Proposal type</Text>{" "}
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
                  //value={inputValue}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  //  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="lesed/subleased  "
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/*Total Rent Payable(Per Month) */}
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
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  //value={inputValue}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  //  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Autofill "
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/* show warehouse owner details table start */}
          <TableContainer mt="4">
            <Table color="#000">
              <Thead bg="#dbfff5" border="1px" borderColor="#000">
                <Tr style={{ color: "#000" }}>
                  <Th color="#000">Sr no</Th>
                  <Th color="#000">Owner Name</Th>
                  <Th color="#000">Mobile No</Th>
                  <Th color="#000">Address</Th>
                  <Th color="#000">rent</Th>
                  <Th color="#000">Owner revenue sharing ratio</Th>
                  <Th color="#000">Owner revenue sharing fix amount</Th>
                  <Th color="#000">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {/* {warehouseOwnersDetails &&
                  warehouseOwnersDetails.map((item, i) => ( */}
                <Tr
                  // key={`warehouse_owner_details${i}`}
                  textAlign="center"
                  bg="white"
                  border="1px"
                  borderColor="#000"
                >
                  {/* <Td>{item?.owner_name} </Td>
                  <Td>{item?.owner_address} </Td>
                  <Td>{item?.owner_mobile} </Td>
                  <Td>{item?.owner_rent} </Td> */}
                  {/* <Td>
                    <Box display="flex" alignItems="center" gap="3">
                      <Flex gap="20px" justifyContent="center">
                        <Box color={"primary.700"}>
                          <BiEditAlt
                            // color="#A6CE39"
                            fontSize="26px"
                            cursor="pointer"
                            // onClick={() => warehouseOwnerOnEdit(item, i)}
                          />
                        </Box>
                        <Box color="red">
                          <AiOutlineDelete
                            cursor="pointer"
                            fontSize="26px"
                            // onClick={() => {
                            //   warehouseOwnerRemove(i);
                            // }}
                          />
                        </Box>
                      </Flex>
                    </Box>
                  </Td> */}
                </Tr>
                {/* ))} */}
                {/* {warehouseOwnersDetails.length === 0 && ( */}
                <Tr textAlign="center">
                  <Td colSpan="5" color="#000">
                    No record found
                  </Td>
                </Tr>
                {/* )} */}
              </Tbody>
            </Table>
          </TableContainer>
          {/* show client table end */}

          {/* Chamber details start    */}
          <Box>
            <Box mt="10" bgColor={"#DBFFF5"} padding="20px" borderRadius="10px">
              <Heading as="h5" fontSize="lg" textAlign="left">
                Chamber details
              </Heading>

              <>
                <Box pt="10px">
                  <Grid
                    alignItems="center"
                    my="3"
                    templateColumns="repeat(3, 1fr)"
                    gap={5}
                  >
                    {/* --------------  Chamber number w={{ base: "30%" }} -------------- */}
                    <Box>
                      <Text my={1}>Chamber number</Text>{" "}
                      <Box>
                        <FormControl
                          style={{ w: commonWidth.w }}
                          // isInvalid={
                          //   chamberDetailsFormsMethod.formState.errors?.[
                          //     chamber_details_obj.chamber_number
                          //   ]?.type?.required
                          // }
                        >
                          <Input
                            type="text"
                            // {...chamberDetailsFormsMethod.register(
                            //   chamber_details_obj.chamber_number
                            // )}
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Chamber name"
                          />
                        </FormControl>
                      </Box>
                    </Box>
                    {/* ------ Chamber length------------- */}
                    <Box>
                      <Text my={1}>Chamber length</Text>{" "}
                      <Box>
                        <FormControl
                          style={{ w: commonWidth.w }}
                          // isInvalid={
                          //   chamberDetailsFormsMethod.formState.errors?.[
                          //     chamber_details_obj.chamber_length
                          //   ]?.type?.required
                          // }
                        >
                          <Input
                            type="text"
                            // {...chamberDetailsFormsMethod.register(
                            //   chamber_details_obj.chamber_length
                            // )}
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            //value={inputValue}
                            //  onChange={onChange}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            // isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Client Length"
                          />
                        </FormControl>
                      </Box>
                    </Box>
                    {/* ------ Chamber breadth------------- */}
                    <Box>
                      <Text my={1}>Chamber breadth</Text>{" "}
                      <Box>
                        <FormControl
                          style={{ w: commonWidth.w }}
                          // isInvalid={
                          //   chamberDetailsFormsMethod.formState.errors?.[
                          //     chamber_details_obj.chamber_breadth
                          //   ]?.type?.required
                          // }
                        >
                          <Input
                            type="text"
                            // {...chamberDetailsFormsMethod.register(
                            //   chamber_details_obj.chamber_breadth
                            // )}
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            //value={inputValue}
                            //  onChange={onChange}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            // isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Enter breadth"
                          />
                        </FormControl>
                      </Box>
                    </Box>
                    {/* ------ chamber roof height------------- */}
                    <Box>
                      <Text my={1}>Chamber roof height</Text>{" "}
                      <Box>
                        <FormControl
                          style={{ w: commonWidth.w }}
                          // isInvalid={
                          //   chamberDetailsFormsMethod.formState.errors?.[
                          //     chamber_details_obj.chamber_roof_height
                          //   ]?.type?.required
                          // }
                        >
                          <Input
                            type="text"
                            // {...chamberDetailsFormsMethod.register(
                            //   chamber_details_obj.chamber_roof_height
                            // )}
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            //value={inputValue}
                            //  onChange={onChange}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            // isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Enter roof height"
                          />
                        </FormControl>
                      </Box>
                    </Box>
                    {/* ------ chamber stackable height------------- */}
                    <Box>
                      <Text my={1}>Chamber stackable height</Text>{" "}
                      <Box>
                        <FormControl
                          style={{ w: commonWidth.w }}
                          // isInvalid={
                          //   chamberDetailsFormsMethod.formState.errors?.[
                          //     chamber_details_obj.chamber_stackable_height
                          //   ]?.type?.required
                          // }
                        >
                          <Input
                            type="text"
                            // {...chamberDetailsFormsMethod.register(
                            //   chamber_details_obj.chamber_stackable_height
                            // )}
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            //value={inputValue}
                            //  onChange={onChange}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            // isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Enter stackable height"
                          />
                        </FormControl>
                      </Box>
                    </Box>

                    {/* ------ Total numbers of chambers------------- */}
                    <Box>
                      <Text my={1}>Total numbers of chambers </Text>{" "}
                      <Box>
                        <FormControl style={{ w: commonWidth.w }}>
                          <Input
                            type="number"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Total numbers of chambers"
                          />
                        </FormControl>
                      </Box>
                    </Box>
                    {/* ------ chamber Sq. Ft------------- */}
                    <Box>
                      <Text my={1}>Chamber Sq. Ft</Text>{" "}
                      <Box>
                        <FormControl
                          style={{ w: commonWidth.w }}
                          // isInvalid={
                          //   chamberDetailsFormsMethod.formState.errors?.[
                          //     chamber_details_obj.chamber_sq_ft
                          //   ]?.type?.required
                          // }
                        >
                          <Input
                            type="text"
                            // {...chamberDetailsFormsMethod.register(
                            //   chamber_details_obj.chamber_sq_ft
                            // )}
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            //value={inputValue}
                            //  onChange={onChange}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            // isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Enter Sq.ft"
                          />
                        </FormControl>
                      </Box>
                    </Box>
                    {/* ------ chamber total area Sq.ft------------- */}
                    <Box>
                      <Text my={1}>chamber total area Sq.ft</Text>{" "}
                      <Box>
                        <FormControl
                          style={{ w: commonWidth.w }}
                          // isInvalid={
                          //   chamberDetailsFormsMethod.formState.errors?.[
                          //     chamber_details_obj.chamber_total_area_sq_ft
                          //   ]?.type?.required
                          // }
                        >
                          <Input
                            type="text"
                            // {...chamberDetailsFormsMethod.register(
                            //   chamber_details_obj.chamber_total_area_sq_ft
                            // )}
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            //value={inputValue}
                            //  onChange={onChange}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            // isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Auto filled (length* Breadth)"
                          />
                        </FormControl>
                      </Box>
                    </Box>
                  </Grid>
                </Box>

                {/* ----------------- save button -----------  */}

                <Flex gap="10px" justifyContent="end" alignItems="center">
                  <Button
                    bg="#A6CE39"
                    _hover={{}}
                    color="white"
                    padding="0px 20px"
                    borderRadius={"50px"}
                    type="button"
                    // onClick={() => {
                    //   chamberDetailsOnSubmit();
                    // }}
                  >
                    add
                    {/* {editedFormIndex?.editedChamberDetailsFormEditedIndex === ""
                      ? "Add"
                      : "Update"} */}
                  </Button>
                </Flex>
              </>
            </Box>

            {/* Chamber details table start */}
            <TableContainer mt="4">
              <Table color="#000">
                <Thead bg="#dbfff5" border="1px" borderColor="#000">
                  <Tr style={{ color: "#000" }}>
                    <Th color="#000">Chamber Number</Th>
                    <Th color="#000">Chamber Length</Th>
                    <Th color="#000">Chamber Breadth</Th>
                    <Th color="#000">Chamber Roof Height</Th>
                    <Th color="#000">Chamber Stackable Height</Th>
                    <Th color="#000">Chamber Sq. Ft</Th>
                    <Th color="#000">chamber total Area Sq.ft</Th>
                    <Th color="#000">Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {/* {chamberDetails &&
                    chamberDetails.map((item, i) => ( */}
                  <Tr
                    // key={`chamber_details${i}`}
                    textAlign="center"
                    bg="white"
                    border="1px"
                    borderColor="#000"
                  >
                    {/* <Td>{item?.chamber_number} </Td>
                    <Td>{item?.chamber_length} </Td>
                    <Td>{item?.chamber_breadth} </Td>
                    <Td>{item?.chamber_roof_height} </Td>
                    <Td>{item?.chamber_stackable_height} </Td>
                    <Td>{item?.chamber_sq_ft} </Td>
                    <Td>{item?.chamber_total_area_sq_ft} </Td> */}

                    {/* <Td>
                      <Box display="flex" alignItems="center" gap="3">
                        <Flex gap="20px" justifyContent="center">
                          <Box color={"primary.700"}>
                            <BiEditAlt
                              // color="#A6CE39"
                              fontSize="26px"
                              cursor="pointer"
                              // onClick={() => chamberDetailsOnEdit(item, i)}
                            />
                          </Box>
                          <Box color="red">
                            <AiOutlineDelete
                              cursor="pointer"
                              fontSize="26px"
                              // onClick={() => {
                              //   chamberDetailsRemove(i);
                              // }}
                            />
                          </Box>
                        </Flex>
                      </Box>
                    </Td> */}
                  </Tr>
                  {/* ))} */}
                  {/* {chamberDetails.length === 0 && ( */}
                  <Tr textAlign="center">
                    <Td colSpan="8" color="#000">
                      No record found
                    </Td>
                  </Tr>
                  {/* )} */}
                </Tbody>
              </Table>
            </TableContainer>
            {/* Chamber details table end */}
          </Box>
          {/* Chamber details end    */}

          {/* Oil Tank details start    */}
          <Box>
            <Box mt="10" bgColor={"#DBFFF5"} padding="20px" borderRadius="10px">
              <Heading as="h5" fontSize="lg" textAlign="left">
                Oil Tank details
              </Heading>

              <>
                <Box pt="10px">
                  <Grid
                    alignItems="center"
                    my="3"
                    templateColumns="repeat(3, 1fr)"
                    gap={5}
                  >
                    {/* --------------  Oil tank number w={{ base: "30%" }} -------------- */}
                    <Box>
                      <Text my={1}>Oil tank number</Text>{" "}
                      <Box>
                        <FormControl
                          style={{ w: commonWidth.w }}
                          // isInvalid={
                          //   oilTankDetailsFormsMethod
                          //     .formState.errors?.[
                          //     oil_tank_details_obj.tank_number
                          //   ]?.type?.required
                          // }
                        >
                          <Input
                            type="text"
                            // {...oilTankDetailsFormsMethod.register(
                            //   oil_tank_details_obj.tank_number
                            // )}
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Chamber name"
                          />
                        </FormControl>
                      </Box>
                    </Box>
                    {/* --------------  Diameter w={{ base: "30%" }} -------------- */}
                    <Box>
                      <Text my={1}>Diameter</Text>{" "}
                      <Box>
                        <FormControl
                          style={{ w: commonWidth.w }}
                          // isInvalid={
                          //   oilTankDetailsFormsMethod.formState.errors?.[
                          //     oil_tank_details_obj.diameter
                          //   ]?.type?.required
                          // }
                        >
                          <Input
                            type="text"
                            // {...oilTankDetailsFormsMethod.register(
                            //   oil_tank_details_obj.diameter
                            // )}
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Diameter"
                          />
                        </FormControl>
                      </Box>
                    </Box>
                    {/* --------------  Height(Ft.) w={{ base: "30%" }} -------------- */}
                    <Box>
                      <Text my={1}>Height(Ft.)</Text>{" "}
                      <Box>
                        <FormControl
                          style={{ w: commonWidth.w }}
                          // isInvalid={
                          //   oilTankDetailsFormsMethod.formState.errors?.[
                          //     oil_tank_details_obj.height
                          //   ]?.type?.required
                          // }
                        >
                          <Input
                            type="text"
                            // {...oilTankDetailsFormsMethod.register(
                            //   oil_tank_details_obj.height
                            // )}
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Density"
                          />
                        </FormControl>
                      </Box>
                    </Box>
                    {/* --------------  Density w={{ base: "30%" }} -------------- */}
                    <Box>
                      <Text my={1}>Density</Text>{" "}
                      <Box>
                        <FormControl
                          style={{ w: commonWidth.w }}
                          // isInvalid={
                          //   oilTankDetailsFormsMethod.formState.errors?.[
                          //     oil_tank_details_obj.density
                          //   ]?.type?.required
                          // }
                        >
                          <Input
                            type="text"
                            // {...oilTankDetailsFormsMethod.register(
                            //   oil_tank_details_obj.density
                            // )}
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Density"
                          />
                        </FormControl>
                      </Box>
                    </Box>
                    {/* --------------  Capacity in MT w={{ base: "30%" }} -------------- */}
                    <Box>
                      <Text my={1}>Capacity in MT</Text>{" "}
                      <Box>
                        <FormControl
                          style={{ w: commonWidth.w }}
                          // isInvalid={
                          //   oilTankDetailsFormsMethod.formState.errors?.[
                          //     oil_tank_details_obj.capacity
                          //   ]?.type?.required
                          // }
                        >
                          <Input
                            type="text"
                            // {...oilTankDetailsFormsMethod.register(
                            //   oil_tank_details_obj.capacity
                            // )}
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Capacity in MT"
                          />
                        </FormControl>
                      </Box>
                    </Box>

                    {/* ------ Total numbers of oil tanks------------- */}
                    <Box>
                      <Text my={1}>Total numbers of oil tanks </Text>{" "}
                      <Box>
                        <FormControl style={{ w: commonWidth.w }}>
                          <Input
                            type="number"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Total numbers of oil tanks "
                          />
                        </FormControl>
                      </Box>
                    </Box>
                  </Grid>
                </Box>

                {/* ----------------- save button -----------  */}

                <Flex gap="10px" justifyContent="end" alignItems="center">
                  <Button
                    bg="#A6CE39"
                    _hover={{}}
                    color="white"
                    padding="0px 20px"
                    borderRadius={"50px"}
                    type="button"
                    // onClick={() => {
                    //   oilTankDetailsOnSubmit();
                    // }}
                  >
                    add
                    {/* {editedFormIndex?.editedOilTankDetailsFormEditedIndex === ""
                      ? "Add"
                      : "Update"} */}
                  </Button>
                </Flex>
              </>
            </Box>

            {/* Chamber details table start */}
            <TableContainer mt="4">
              <Table color="#000">
                <Thead bg="#dbfff5" border="1px" borderColor="#000">
                  <Tr style={{ color: "#000" }}>
                    <Th color="#000">Oil tank number</Th>
                    <Th color="#000">Diameter</Th>
                    <Th color="#000">Height(Ft.)</Th>
                    <Th color="#000">Density</Th>
                    <Th color="#000">Capacity in MT</Th>
                    <Th color="#000">Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {/* {oilTankDetails &&
                    oilTankDetails.map((item, i) => ( */}
                  <Tr
                    // key={`chamber_details${i}`}
                    textAlign="center"
                    bg="white"
                    border="1px"
                    borderColor="#000"
                  >
                    {/* <Td>{item?.tank_number} </Td>
                    <Td>{item?.diameter} </Td>
                    <Td>{item?.height} </Td>
                    <Td>{item?.density} </Td>
                    <Td>{item?.capacity} </Td> */}
                    {/* <Td>
                      <Box display="flex" alignItems="center" gap="3">
                        <Flex gap="20px" justifyContent="center">
                          <Box color={"primary.700"}>
                            <BiEditAlt
                              // color="#A6CE39"
                              fontSize="26px"
                              cursor="pointer"
                              // onClick={() => oilTankDetailsOnEdit(item, i)}
                            />
                          </Box>
                          <Box color="red">
                            <AiOutlineDelete
                              cursor="pointer"
                              fontSize="26px"
                              // onClick={() => {
                              //   oilTankDetailsRemove(i);
                              // }}
                            />
                          </Box>
                        </Flex>
                      </Box>
                    </Td> */}
                  </Tr>
                  {/* ))} */}
                  {/* {oilTankDetails.length === 0 && ( */}
                  <Tr textAlign="center">
                    <Td colSpan="6" color="#000">
                      No record found
                    </Td>
                  </Tr>
                  {/* )} */}
                </Tbody>
              </Table>
            </TableContainer>
            {/* Chamber details table end */}
          </Box>
          {/* Oil Tank details end    */}

          {/* Silo details start    */}
          <Box>
            <Box mt="10" bgColor={"#DBFFF5"} padding="20px" borderRadius="10px">
              <Heading as="h5" fontSize="lg" textAlign="left">
                Silo details
              </Heading>

              <>
                <Box pt="10px">
                  <Grid
                    alignItems="center"
                    my="3"
                    templateColumns="repeat(3, 1fr)"
                    gap={5}
                  >
                    {/* --------------  Silo  number w={{ base: "30%" }} -------------- */}
                    <Box>
                      <Text my={1}>Silo number</Text>{" "}
                      <Box>
                        <FormControl
                          style={{ w: commonWidth.w }}
                          // isInvalid={
                          //   siloDetailsFormsMethod.formState.errors?.[
                          //     silo_details_obj.silo_number
                          //   ]?.type?.required
                          // }
                        >
                          <Input
                            type="text"
                            // {...siloDetailsFormsMethod.register(
                            //   silo_details_obj.silo_number
                            // )}
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Silo  number"
                          />
                        </FormControl>
                      </Box>
                    </Box>
                    {/* --------------  Diameter w={{ base: "30%" }} -------------- */}
                    <Box>
                      <Text my={1}>Diameter</Text>{" "}
                      <Box>
                        <FormControl
                          style={{ w: commonWidth.w }}
                          // isInvalid={
                          //   siloDetailsFormsMethod.formState.errors?.[
                          //     silo_details_obj.diameter
                          //   ]?.type?.required
                          // }
                        >
                          <Input
                            type="text"
                            // {...siloDetailsFormsMethod.register(
                            //   silo_details_obj.diameter
                            // )}
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Diameter"
                          />
                        </FormControl>
                      </Box>
                    </Box>
                    {/* --------------  Height(Ft.) w={{ base: "30%" }} -------------- */}
                    <Box>
                      <Text my={1}>Height(Ft.)</Text>{" "}
                      <Box>
                        <FormControl
                          style={{ w: commonWidth.w }}
                          // isInvalid={
                          //   siloDetailsFormsMethod.formState.errors?.[
                          //     silo_details_obj.height
                          //   ]?.type?.required
                          // }
                        >
                          <Input
                            type="text"
                            // {...siloDetailsFormsMethod.register(
                            //   silo_details_obj.height
                            // )}
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Density"
                          />
                        </FormControl>
                      </Box>
                    </Box>
                    {/* --------------  Density w={{ base: "30%" }} -------------- */}
                    <Box>
                      <Text my={1}>Density</Text>{" "}
                      <Box>
                        <FormControl
                          style={{ w: commonWidth.w }}
                          // isInvalid={
                          //   siloDetailsFormsMethod.formState.errors?.[
                          //     silo_details_obj.density
                          //   ]?.type?.required
                          // }
                        >
                          <Input
                            type="text"
                            // {...siloDetailsFormsMethod.register(
                            //   silo_details_obj.density
                            // )}
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Density"
                          />
                        </FormControl>
                      </Box>
                    </Box>
                    {/* --------------  Capacity in MT w={{ base: "30%" }} -------------- */}
                    <Box>
                      <Text my={1}>Capacity in MT</Text>{" "}
                      <Box>
                        <FormControl
                          style={{ w: commonWidth.w }}
                          // isInvalid={
                          //   siloDetailsFormsMethod.formState.errors?.[
                          //     silo_details_obj.capacity
                          //   ]?.type?.required
                          // }
                        >
                          <Input
                            type="text"
                            // {...siloDetailsFormsMethod.register(
                            //   silo_details_obj.capacity
                            // )}
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Capacity in MT"
                          />
                        </FormControl>
                      </Box>
                    </Box>

                    {/* ------ Total numbers of silo------------- */}
                    <Box>
                      <Text my={1}>Total numbers of silo </Text>{" "}
                      <Box>
                        <FormControl style={{ w: commonWidth.w }}>
                          <Input
                            type="number"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Total numbers of silo "
                          />
                        </FormControl>
                      </Box>
                    </Box>
                  </Grid>
                </Box>

                {/* ----------------- save button -----------  */}

                <Flex gap="10px" justifyContent="end" alignItems="center">
                  <Button
                    bg="#A6CE39"
                    _hover={{}}
                    color="white"
                    padding="0px 20px"
                    borderRadius={"50px"}
                    type="button"
                    // onClick={() => {
                    //   siloDetailsOnSubmit();
                    // }}
                  >
                    add
                    {/* {editedFormIndex?.editedSiloDetailsFormEditedIndex === ""
                      ? "Add"
                      : "Update"} */}
                  </Button>
                </Flex>
              </>
            </Box>

            {/* Chamber details table start */}
            <TableContainer mt="4">
              <Table color="#000">
                <Thead bg="#dbfff5" border="1px" borderColor="#000">
                  <Tr style={{ color: "#000" }}>
                    <Th color="#000">Silo number</Th>
                    <Th color="#000">Diameter</Th>
                    <Th color="#000">Height(Ft.)</Th>
                    <Th color="#000">Density</Th>
                    <Th color="#000">Capacity in MT</Th>
                    <Th color="#000">Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {/* {siloDetails &&
                    siloDetails.map((item, i) => ( */}
                  <Tr
                    // key={`chamber_details${i}`}
                    textAlign="center"
                    bg="white"
                    border="1px"
                    borderColor="#000"
                  >
                    {/* <Td>{item?.silo_number} </Td>
                        <Td>{item?.diameter} </Td>
                        <Td>{item?.height} </Td>
                        <Td>{item?.density} </Td>
                        <Td>{item?.capacity} </Td> */}
                    {/* <Td>
                      <Box display="flex" alignItems="center" gap="3">
                        <Flex gap="20px" justifyContent="center">
                          <Box color={"primary.700"}>
                            <BiEditAlt
                              // color="#A6CE39"
                              fontSize="26px"
                              cursor="pointer"
                              // onClick={() => siloDetailsOnEdit(item, i)}
                            />
                          </Box>
                          <Box color="red">
                            <AiOutlineDelete
                              cursor="pointer"
                              fontSize="26px"
                              // onClick={() => {
                              //   siloDetailsRemove(i);
                              // }}
                            />
                          </Box>
                        </Flex>
                      </Box>
                    </Td> */}
                  </Tr>
                  {/* ))} */}
                  {/* {siloDetails.length === 0 && ( */}
                  <Tr textAlign="center">
                    <Td colSpan="6" color="#000">
                      No record found
                    </Td>
                  </Tr>
                  {/* )} */}
                </Tbody>
              </Table>
            </TableContainer>
            {/* Chamber details table end */}
          </Box>
          {/* Silo Tank details end    */}

          <Flex gap="10px" justifyContent="end" alignItems="center">
            <Button
              bg="#A6CE39"
              _hover={{}}
              color="white"
              marginTop={"30px"}
              padding="0px 30px"
              borderRadius={"50px"}
              type="button"
              //   onClick={() => {
              //     saveAsDraftFunction();
              //   }}
            >
              Save As Draft
            </Button>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default WarehouseDetail;
