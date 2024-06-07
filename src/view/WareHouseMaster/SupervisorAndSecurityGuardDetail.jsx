/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Grid,
  GridItem,
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
import { useGetSecurityMutation } from "../../features/masters/warehouseMasterApi.slice.";
import { useLocation } from "react-router-dom";

const SupervisorAndSecurityGuardDetail = ({ warehouseDetailsData }) => {
  const location = useLocation();
  console.log("location", location);
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

  // security   api in warehouse master start
  const [getSecurity] = useGetSecurityMutation();
  const [securityData, setSecurityData] = useState([]);

  const [supervisorData, setSupervisorData] = useState([]);

  let params = {
    warehouse: location?.state?.warehouseId,
  };

  const getSecurityData = async () => {
    try {
      const response = await getSecurity(params).unwrap();
      setSecurityData(
        response?.data?.filter((item) => item.security_guard_name) || []
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getSecurityData();
    // setSupervisorData([...warehouseDetailsData?.supervisor_day_shift]);

    setSupervisorData(
      warehouseDetailsData?.supervisor_history?.filter(
        (item) => item?.supervisor?.employee_name
      )
    );
  }, [warehouseDetailsData]);
  // security and supervisor api in warehouse master End

  return (
    <>
      <Box bg={"White"} py={3}>
        <Box
          w={{
            base: "100%",
            sm: "100%",
            md: "100%",
            lg: "100%",
            xl: "100%",
          }}
        >
          {/* Supervisor for Day shift*/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Supervisor for Day shift</Text>{" "}
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
                    warehouseDetailsData?.supervisor_day_shift?.employee_name ||
                    ""
                  }
                  //value={inputValue}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Supervisor for Day shift"
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/* Supervisor for night shift*/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Supervisor for night shift</Text>{" "}
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
                    warehouseDetailsData?.supervisor_night_shift
                      ?.employee_name || ""
                  }
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Supervisor for night shift"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* Security Guard for day shift */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Security Guard for day shift </Text>{" "}
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
                      ?.security_guard_day_shift?.security_guard_name || ""
                  }
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Security Guard for day shift "
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/* Security Guard for night shift */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Security Guard for night shift </Text>{" "}
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
                      ?.security_guard_night_shift?.security_guard_name || ""
                  }
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Security Guard for night shift"
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/* History of Security Guards :   */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right" color={"#212121"}>
                History of Security Guards :{" "}
              </Text>{" "}
            </GridItem>
          </Grid>

          {/* History of Security Guards :   details table start */}
          <TableContainer mt="4" p={3}>
            <Table color="#000">
              <Thead bg="#dbfff5" border="1px" borderColor="#000">
                <Tr style={{ color: "#000" }}>
                  <Th color="#000">Sr no</Th>
                  <Th color="#000">Security Guard name</Th>
                  <Th color="#000">Shift</Th>

                  <Th color="#000">Start date</Th>
                  <Th color="#000">End date</Th>
                  <Th color="#000">Status</Th>
                </Tr>
              </Thead>

              <Tbody>
                {securityData &&
                  securityData.map((item, id) => (
                    <Tr
                      textAlign="center"
                      bg="white"
                      border="1px"
                      borderColor="#000"
                    >
                      {/* <Td>{id + 1}</Td>
                      <Td>{item?.security_guard_name}</Td>
                      {item?.transfer_history.map((data, i) => (
                        <>
                          <Td>{data?.start_date}</Td>
                          <Td>{data?.end_date}</Td>
                          <Td>{data?.status}</Td>
                        </>
                      ))} */}

                      <Td>{id + 1}</Td>

                      <Td>{item.security_guard_name}</Td>
                      <Td>{item.shift_availability}</Td>

                      <Td>
                        {item.transfer_history &&
                          item.transfer_history?.filter(
                            (item) =>
                              item.warehouse.id === location?.state?.warehouseId
                          )?.[0]?.start_date}
                      </Td>

                      <Td>
                        {(item.transfer_history &&
                          item.transfer_history?.filter(
                            (item) =>
                              item.warehouse.id === location?.state?.warehouseId
                          )?.[0]?.end_date) ||
                          "-"}
                      </Td>

                      <Td>
                        {item.transfer_history &&
                        item.transfer_history?.filter(
                          (item) =>
                            item.warehouse.id === location?.state?.warehouseId
                        )?.[0]?.status
                          ? item.transfer_history?.filter(
                              (item) =>
                                item.warehouse.id ===
                                location?.state?.warehouseId
                            )?.[0]?.status === "transfer close" ||
                            item.transfer_history?.filter(
                              (item) =>
                                item.warehouse.id ===
                                location?.state?.warehouseId
                            )?.[0]?.status === "close"
                            ? "DeActive"
                            : item.transfer_history?.filter(
                                (item) =>
                                  item.warehouse.id ===
                                  location?.state?.warehouseId
                              )?.[0]?.status === "transfer_recieve" ||
                              item.transfer_history?.filter(
                                (item) =>
                                  item.warehouse.id ===
                                  location?.state?.warehouseId
                              )?.[0]?.status === "active"
                            ? "Active"
                            : "Inactive"
                          : "Inactive"}
                      </Td>
                    </Tr>
                  ))}
                {securityData.length === 0 && (
                  <Tr textAlign="center">
                    <Td colSpan="8" color="#000">
                      No record found
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
          {/* History of Security Guards :  table end */}

          {/* History of Supervisor:    */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right" color={"#212121"}>
                History of Supervisor:{" "}
              </Text>{" "}
            </GridItem>
          </Grid>

          {/* History of Supervisor:    details table start */}
          <TableContainer mt="4" p={3}>
            <Table color="#000">
              <Thead bg="#dbfff5" border="1px" borderColor="#000">
                <Tr style={{ color: "#000" }}>
                  <Th color="#000">Sr no</Th>
                  <Th color="#000">Supervisor name</Th>
                  <Th color="#000">Shift</Th>

                  <Th color="#000">Start date</Th>
                  <Th color="#000">End date</Th>
                  <Th color="#000">Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {supervisorData &&
                  supervisorData?.map((item, id) => (
                    <Tr
                      textAlign="center"
                      bg="white"
                      border="1px"
                      borderColor="#000"
                    >
                      <Td>{id + 1}</Td>
                      <Td>{item?.supervisor?.employee_name}</Td>
                      <Td>{item?.shift}</Td>
                      <Td>
                        {item?.start_date?.length > 0
                          ? item?.start_date || "-"
                          : "-"}
                      </Td>
                      <Td>{item?.end_date || "-"}</Td>

                      <Td>
                        {item?.supervisor?.is_active ? "Active" : "Inactive"}
                      </Td>
                    </Tr>
                  ))}

                {supervisorData?.length === 0 && (
                  <Tr textAlign="center">
                    <Td colSpan="8" color="#000">
                      No record found
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
          {/* History of Supervisor:   table end */}
        </Box>
      </Box>
    </>
  );
};

export default SupervisorAndSecurityGuardDetail;
