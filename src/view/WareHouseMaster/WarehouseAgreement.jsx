/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

import * as Yup from "yup";
import { BiEditAlt } from "react-icons/bi";
import { BsDownload } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useFetchWarehouseAgreementDetailsByIdMutation,
  useGetWareHouseByIdMutation,
  useUpdateAgreementDetailsByIdMutation,
  useGetAgreementStartDateMutation,
} from "../../features/master-api-slice";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import toasterAlert from "../../services/toasterAlert";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import { useDispatch } from "react-redux";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import CustomFileInput from "../../components/Elements/CustomFileInput";
import ROUTE_PATH from "../../constants/ROUTE";
import configuration from "../../config/configuration";

// Define validation schema for the entire form
const validationSchema = Yup.object().shape({});

const WarehouseAgreement = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {},
  });

  const {
    setValue,
    getValues,
    handleSubmit,
    // formState,
  } = methods;
  const dispatch = useDispatch();

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

  // Warehouse Details Api Start

  const [agreementStartDate, setAgreementStartDate] = useState("");

  const [getWarehouseDetails] = useGetWareHouseByIdMutation();
  const [getAgreementStartDate] = useGetAgreementStartDateMutation();

  const [warehouseDetailsData, setWarehouseDetailsData] = useState({});

  console.log("location", location?.state);

  async function fetchAgreementStartDate() {
    try {
      const warehouseId = location?.state?.id || 0;

      const response = await getAgreementStartDate({
        warehouse_id: warehouseId,
      }).unwrap();

      if (response?.status === 200) {
        console.log(response);

        setAgreementDetails((prev) => ({
          ...prev,
          agreement_start_date: response?.agreement_start_date,
        }));
        setAgreementStartDate(response?.agreement_start_date);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function WarehouseDetailsApiFunction() {
    try {
      const warehouseId = location?.state?.id || 0;

      const response = await getWarehouseDetails({ id: warehouseId }).unwrap();

      setWarehouseDetailsData(response?.data || {});
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    WarehouseDetailsApiFunction();
    fetchAgreementStartDate();
  }, []);

  console.log(warehouseDetailsData, "warehouseDetailsData");

  // Warehouse Details Api End

  // Warehouse Agreement Details Api Start

  const [fetchWarehouseAgreementDetailsById] =
    useFetchWarehouseAgreementDetailsByIdMutation();

  const [tempAgre, setTempAgre] = useState([]);

  const getWareHouseAgreementDetails = async () => {
    try {
      const id = location?.state?.id || 0;
      const response = await fetchWarehouseAgreementDetailsById(id).unwrap();
      if (response?.status === 200) {
        const data = response?.data;
        setValue("agreement_history", data?.agreement_history || [], {
          shouldValidate: true,
        });
        setTempAgre(data?.agreement_history || []);
      }
      console.log("getRegionMasterList:", response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getWareHouseAgreementDetails();
  }, []);

  // Warehouse Agreement Details Api End

  // Agreement Logic Start

  const [agreementDetails, setAgreementDetails] = useState({
    id: null,
    agreement_start_date: null,
    agreement_end_date: null,
    agreement_upload_path: null,
  });

  const [agreementError, setAgreementError] = useState({
    agreement_start_date: "",
    agreement_end_date: "",
    agreement_upload_path: "",
  });

  const [agreementArray, setAgreementArray] = useState([]);

  const [updateAgreementId, setUpdateAgreementId] = useState(null);

  const [updateAgreementIndex, setUpdateAgreementIndex] = useState(null);

  const AgreementCondition = () => {
    return (
      agreementDetails.agreement_start_date !== null &&
      agreementDetails.agreement_end_date !== null &&
      agreementDetails.agreement_upload_path !== null
    );
  };

  const AgreementError = () => {
    setAgreementError({
      agreement_start_date:
        agreementDetails.agreement_start_date !== null ? "" : "error",
      agreement_end_date:
        agreementDetails.agreement_end_date !== null ? "" : "error",
      agreement_upload_path:
        agreementDetails.agreement_upload_path !== null ? "" : "error",
    });
  };

  const AddAgreementDetails = () => {
    if (AgreementCondition()) {
      setAgreementArray([agreementDetails]);
      setAgreementError({
        agreement_start_date: "",
        agreement_end_date: "",
        agreement_upload_path: "",
      });
      setAgreementDetails({
        id: null,
        agreement_start_date: null,
        agreement_end_date: null,
        agreement_upload_path: null,
      });
    } else {
      AgreementError();
    }
  };

  const UpdateAgreement = (data, index) => {
    setAgreementDetails({
      id: data.id,
      agreement_start_date: data.agreement_start_date,
      agreement_end_date: data.agreement_end_date,
      agreement_upload_path: data.agreement_upload_path,
    });
    setUpdateAgreementId(data.id);
    setUpdateAgreementIndex(index);
  };

  const EditAgreementDetails = () => {
    if (AgreementCondition()) {
      if (updateAgreementId === null) {
        setAgreementArray([agreementDetails]);
      } else {
        const testAgreement =
          getValues("agreement_history")[updateAgreementIndex] || {};

        setValue(
          "agreement_history",
          [
            ...getValues("agreement_history")?.slice(0, updateAgreementIndex),
            { ...testAgreement, ...agreementDetails },
            ...getValues("agreement_history")?.slice(updateAgreementIndex + 1),
          ],
          {
            shouldValidate: true,
          }
        );
      }
      setAgreementError({
        agreement_start_date: "",
        agreement_end_date: "",
        agreement_upload_path: "",
      });
      setAgreementDetails({
        id: null,
        agreement_start_date: null,
        agreement_end_date: null,
        agreement_upload_path: null,
      });
      setUpdateAgreementId(null);
      setUpdateAgreementIndex(null);
    } else {
      AgreementError();
    }
  };

  // Agreement Logic End

  // Warehouse Agreement Submit Start

  const [
    updateAgreementDetailsById,
    { isLoading: updateAgreementDetailsByIdIsLoading },
  ] = useUpdateAgreementDetailsByIdMutation();

  const onSubmit = async () => {
    console.log("tesing Agreement");
    const testHistory =
      getValues("agreement_history")?.map((item) => ({
        id: item.id,
        agreement_start_date: item.agreement_start_date,
        agreement_end_date: item.agreement_end_date,
        agreement_upload_path: item.agreement_upload_path,
      })) || [];

    const data = [...testHistory, ...agreementArray];

    if (!location?.state?.view && agreementArray?.length === 0) {
      showToastByStatusCode(400, "Add New Agreement");
      return false;
    }

    try {
      if (data?.length > 0) {
        const response = await updateAgreementDetailsById({
          id: location?.state?.id || 0,
          data: data,
        }).unwrap();
        console.log("response --->", response);
        if (response.status === 200) {
          showToastByStatusCode(200, response?.message);

          navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE}`);
        }
      } else {
        toasterAlert({
          message: "Agreement Details Are Necessary.",
          status: 440,
        });
      }
    } catch (error) {
      console.log(error);
      let errObj = {
        message:
          error?.data?.message ||
          error?.data?.data ||
          error?.data ||
          "Warehouse Agreement Request Failed",
        status: error?.data?.status || 440,
      };
      console.log(errObj);
      toasterAlert(errObj);
    }
  };

  // Warehouse Agreement Submit End

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
    <>
      <Box bg={"white"} p={4} borderRadius={"sm"}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              w={{
                base: "100%",
                sm: "100%",
                md: "100%",
                lg: "100%",
                xl: "100%",
              }}
            >
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
                  <Textarea
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    value={warehouseDetailsData?.warehouse_name}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    //  isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Warehouse Name"
                    isDisabled={true}
                  />
                </GridItem>
              </Grid>

              {/* Warehouse Address*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Warehouse Address</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <Textarea
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    value={warehouseDetailsData?.warehouse_address}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    //  isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Warehouse Address"
                    isDisabled={true}
                  />
                </GridItem>
              </Grid>

              {/*Warehouse owner details: */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Warehouse owner details:</Text>{" "}
                </GridItem>
              </Grid>

              {/* Warehouse owner details: table start */}
              <TableContainer mt="4">
                <Table color="#000">
                  <Thead bg="#dbfff5" border="1px" borderColor="#000">
                    <Tr style={{ color: "#000" }}>
                      <Th color="#000">Sr no</Th>
                      <Th color="#000">Owner name</Th>
                      <Th color="#000">Owner mobile no</Th>
                      <Th color="#000">Owner rent</Th>
                      <Th color="#000">Owner Revenue Sharing</Th>
                      <Th color="#000">Owner Revenue Sharing Fix Amount </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {warehouseDetailsData?.owner_list?.length > 0 ? (
                      warehouseDetailsData?.owner_list?.map((owner, index) => (
                        <Tr
                          key={index}
                          textAlign="center"
                          bg="white"
                          border="1px"
                          borderColor="#000"
                        >
                          <Td>{index + 1}</Td>
                          <Td>
                            {owner?.warehouse_owner?.warehouse_owner_name}
                          </Td>
                          <Td>
                            {owner?.warehouse_owner?.warehouse_owner_contact_no}
                          </Td>
                          <Td>{owner?.rent_amount || "-"}</Td>
                          <Td>{owner?.revenue_sharing_ratio || "-"}</Td>
                          <Td>{owner?.revenue_sharing_fix_amt || "-"}</Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr textAlign="center">
                        <Td colSpan="5" color="#000">
                          No record found
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
              {/* Warehouse owner details: table end */}

              {/* Total Rent Payable*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Total Rent Payable</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <Input
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    value={warehouseDetailsData?.total_rent_payable}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    //  isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Total Rent Payable"
                    isDisabled={true}
                  />
                </GridItem>
              </Grid>

              <Box>
                {/*Warehouse agreement details :: */}
                <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right">Warehouse agreement details :</Text>{" "}
                  </GridItem>
                </Grid>

                {/*Agreement Start Date*/}
                <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right">Agreement Start Date</Text>{" "}
                  </GridItem>
                  <GridItem colSpan={{ base: 1 }}>
                    <Input
                      //type="date"
                      border="1px"
                      borderColor={
                        agreementError.agreement_start_date ? "red" : "gray.10"
                      }
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      value={moment(
                        agreementDetails.agreement_start_date || ""
                      ).format("DD/MM/YYYY")}
                      isDisabled={true}
                      // isDisabled={
                      //   agreementDetails?.id === null
                      //     ? false
                      //     : moment(
                      //         agreementDetails.agreement_start_date
                      //       ).isBefore(moment())
                      // }
                      onChange={(e) => {
                        setAgreementDetails((old) => ({
                          ...old,
                          agreement_start_date: e.target.value,
                        }));
                      }}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Agreement Start Date"
                    />
                    {/* {moment(agreementDetails.agreement_start_date).isBefore(
                      moment()
                    ) ? (
                      <Text color="red" textAlign={"left"} fontSize={"10px"}>
                        You have selected a Past Date that will not be editable
                        in the future.{" "}
                      </Text>
                    ) : (
                      <></>
                    )} */}
                  </GridItem>
                </Grid>

                {/*Agreement End Date*/}
                <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right">Agreement End Date</Text>{" "}
                  </GridItem>
                  <GridItem colSpan={{ base: 1 }}>
                    <Input
                      type="date"
                      border="1px"
                      borderColor={
                        agreementError.agreement_end_date ? "red" : "gray.10"
                      }
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      min={
                        updateAgreementIndex === null
                          ? moment(agreementDetails.agreement_start_date)
                              .add(1, "days")
                              .format("YYYY-MM-DD") || ""
                          : moment(
                              tempAgre?.[updateAgreementIndex]
                                ?.agreement_end_date
                            )
                              .add(1, "days")
                              .format("YYYY-MM-DD") ||
                            "" ||
                            ""
                      }
                      value={agreementDetails.agreement_end_date || ""}
                      onChange={(e) => {
                        setAgreementDetails((old) => ({
                          ...old,
                          agreement_end_date: e.target.value,
                        }));
                      }}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Agreement Start Date"
                    />
                  </GridItem>
                </Grid>

                {/*Upload Agreement*/}
                <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right">Upload Agreement</Text>{" "}
                  </GridItem>
                  <GridItem colSpan={{ base: 1 }} textAlign={"left"}>
                    <CustomFileInput
                      placeholder="Agreement upload"
                      name={""}
                      value={agreementDetails.agreement_upload_path || ""}
                      onChange={(e) => {
                        setAgreementDetails((old) => ({
                          ...old,
                          agreement_upload_path: e,
                        }));
                      }}
                      fileuplaod_folder_structure={{
                        type: "Warehouse",
                        subtype: "Agreement",
                      }}
                      label=""
                      type=""
                      showErr={
                        agreementError.agreement_upload_path ? true : false
                      }
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </GridItem>
                </Grid>

                <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}></GridItem>
                  <GridItem colSpan={{ base: 1 }}>
                    <Button
                      bg="#A6CE39"
                      _hover={{}}
                      color="white"
                      padding="0px 30px"
                      borderRadius={"50px"}
                      type="button"
                      isDisabled={
                        updateAgreementIndex === null
                          ? location?.state?.view === false
                            ? false
                            : true
                          : false
                      }
                      onClick={() => {
                        if (updateAgreementIndex === null) {
                          if (location?.state?.view === false) {
                            AddAgreementDetails();
                          }
                        } else {
                          EditAgreementDetails();
                        }
                      }}
                    >
                      {updateAgreementIndex === null ? "Add" : "Edit"}
                    </Button>
                  </GridItem>
                </Grid>
              </Box>

              {/*Agreement history : */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right" color={"#212121"}>
                    Agreement history :
                  </Text>{" "}
                </GridItem>
              </Grid>

              {/* Agreement History Table Starts */}
              <TableContainer mt="4">
                <Table color="#000">
                  <Thead bg="#dbfff5" border="1px" borderColor="#000">
                    <Tr style={{ color: "#000" }}>
                      <Th color="#000">Sr no</Th>
                      <Th color="#000">Agreement start date</Th>
                      <Th color="#000">Agreement end date</Th>
                      <Th color="#000">Owner name</Th>
                      <Th color="#000">Owner mo no</Th>
                      <Th color="#000">Rent</Th>
                      <Th color="#000">Revenue sharing ratio</Th>
                      <Th color="#000">Revenue sharing Fixed Amount</Th>
                      <Th color="#000">Agreement Document</Th>
                      <Th color="#000">Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {/* {data.map((item, index) => ( */}
                    {getValues("agreement_history")?.length > 0 ||
                    agreementArray?.length > 0 ? (
                      <>
                        {agreementArray?.map((item, index) => (
                          <Tr key={`agreement_${index}`}>
                            <Td>{index + 1}</Td>
                            <Td>
                              {moment(item?.agreement_start_date).format(
                                "DD/MM/YYYY"
                              )}
                            </Td>

                            <Td>
                              {moment(item?.agreement_end_date).format(
                                "DD/MM/YYYY"
                              )}
                            </Td>
                            <Td>{"-"}</Td>
                            <Td>{"-"}</Td>
                            <Td>{"-"}</Td>
                            <Td textAlign="center">{"-"}</Td>
                            <Td textAlign="center">{"-"}</Td>
                            <Td>
                              <Flex gap={2} color="primary.700">
                                <BsDownload
                                  onClick={() => {
                                    window.open(
                                      `${configuration.BASE_URL}${
                                        item.agreement_upload_path || ""
                                      }`,
                                      "_blank"
                                    );
                                  }}
                                  fontSize="26px"
                                  cursor="pointer"
                                />
                              </Flex>
                            </Td>
                            <Td>
                              <BiEditAlt
                                onClick={() => UpdateAgreement(item, index)}
                                fontSize="26px"
                                cursor="pointer"
                              />
                            </Td>
                          </Tr>
                        ))}
                        {getValues("agreement_history")?.map((item, index) => (
                          <Tr key={`agreement_${index}`}>
                            <Td>{index + 1}</Td>
                            <Td>
                              {moment(item?.agreement_start_date).format(
                                "DD/MM/YYYY"
                              )}
                            </Td>
                            <Td>
                              {moment(item?.agreement_end_date).format(
                                "DD/MM/YYYY"
                              )}
                            </Td>
                            <Td p={0}>
                              {item?.current_owner_details?.map(
                                (item2, index2) => (
                                  <Text
                                    //className="global-text"

                                    key={index2}
                                    pb={2}
                                    pt={2}
                                    style={{ textAlign: "center" }}
                                    borderBottom={
                                      item?.current_owner_details?.length -
                                        1 ===
                                      index2
                                        ? "none"
                                        : "1px solid #c3c3c3"
                                    }
                                  >
                                    {item2.warehouse_owner_name || "-"}
                                  </Text>
                                )
                              )}
                            </Td>
                            <Td p={0}>
                              {item?.current_owner_details?.map(
                                (item2, index2) => (
                                  <Text
                                    key={index2}
                                    pb={2}
                                    pt={2}
                                    style={{ textAlign: "center" }}
                                    borderBottom={
                                      item?.current_owner_details?.length -
                                        1 ===
                                      index2
                                        ? "none"
                                        : "1px solid #c3c3c3"
                                    }
                                  >
                                    {item2.warehouse_owner_contact_no || "-"}
                                  </Text>
                                )
                              )}
                            </Td>
                            <Td p={0}>
                              {item?.current_owner_details?.map(
                                (item2, index2) => (
                                  <Text
                                    key={index2}
                                    pb={2}
                                    pt={2}
                                    style={{ textAlign: "center" }}
                                    borderBottom={
                                      item?.current_owner_details?.length -
                                        1 ===
                                      index2
                                        ? "none"
                                        : "1px solid #c3c3c3"
                                    }
                                  >
                                    {item2.rent_amount || "-"}
                                  </Text>
                                )
                              )}
                            </Td>
                            <Td p={0} textAlign="center">
                              {item?.current_owner_details?.map(
                                (item2, index2) => (
                                  <Text
                                    key={index2}
                                    pb={2}
                                    pt={2}
                                    style={{ textAlign: "center" }}
                                    borderBottom={
                                      item?.current_owner_details?.length -
                                        1 ===
                                      index2
                                        ? "none"
                                        : "1px solid #c3c3c3"
                                    }
                                  >
                                    {item2.revenue_sharing_ratio || "-"}
                                  </Text>
                                )
                              )}
                            </Td>
                            <Td p={0} textAlign="center">
                              {item?.current_owner_details?.map(
                                (item2, index2) => (
                                  <Text
                                    key={index2}
                                    pb={2}
                                    pt={2}
                                    style={{ textAlign: "center" }}
                                    borderBottom={
                                      item?.current_owner_details?.length -
                                        1 ===
                                      index2
                                        ? "none"
                                        : "1px solid #c3c3c3"
                                    }
                                  >
                                    {item2.revenue_sharing_fix_amt || "-"}
                                  </Text>
                                )
                              )}
                            </Td>
                            <Td>
                              <Flex gap={2} color="primary.700">
                                <BsDownload
                                  onClick={() => {
                                    window.open(
                                      `${configuration.BASE_URL}${
                                        item.agreement_upload_path || ""
                                      }`,
                                      "_blank"
                                    );
                                  }}
                                  fontSize="26px"
                                  cursor="pointer"
                                />
                              </Flex>
                            </Td>
                            <Td>
                              {moment(item.agreement_end_date).isAfter(
                                moment()
                              ) && (
                                <BiEditAlt
                                  onClick={() => UpdateAgreement(item, index)}
                                  fontSize="26px"
                                  cursor="pointer"
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </>
                    ) : (
                      <Tr>
                        <Td colSpan={10}>No record </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
              {/* Agreement History Table Ends */}

              <Flex gap="10px" justifyContent="end" alignItems="center">
                <Button
                  bg="#A6CE39"
                  _hover={{}}
                  color="white"
                  marginTop={"30px"}
                  padding="0px 30px"
                  borderRadius={"50px"}
                  type="submit"
                  isLoading={updateAgreementDetailsByIdIsLoading}
                  //   onClick={() => {
                  //     saveAsDraftFunction();
                  //   }}
                >
                  Submit
                </Button>
              </Flex>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </>
  );
};

export default WarehouseAgreement;
