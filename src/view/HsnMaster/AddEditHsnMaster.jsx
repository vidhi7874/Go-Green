/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import generateFormField from "../../components/Elements/GenerateFormField";
import {
  Box,
  Button,
  Flex,
  Grid,
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
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { addEditFormFields, schema, schema2 } from "./fields";
import { MotionSlideUp } from "../../utils/animation";
import {
  useAddHsnMasterMutation,
  useGetHsnDetailMasterMutation,
  useUpdateHsnMasterMutation,
} from "../../features/master-api-slice";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import CustomInput from "../../components/Elements/CustomInput";
import CustomSwitch from "../../components/Elements/CustomSwitch";
import moment from "moment";
import { BiEditAlt } from "react-icons/bi";
import ROUTE_PATH from "../../constants/ROUTE";

const inputStyle = {
  height: "40px",
  backgroundColor: "white",
  borderRadius: "lg",
  _placeholder: {
    color: "gray.300",
  },
  _hover: {
    borderColor: "primary.700",
    backgroundColor: "primary.200",
  },
  _focus: {
    borderColor: "primary.700",
    backgroundColor: "primary.200",
    boxShadow: "none",
  },
  p: { base: "4" },
  fontWeight: { base: "normal" },
  fontStyle: "normal",
};

function AddEditHsnMaster() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const details = location.state?.details;

  const methods = useForm({
    resolver: yupResolver(details?.id ? schema2 : schema),
    defaultValues: {
      is_active: !details?.id, // Set is_active to true only when adding
    },
  });

  const initialIsActive = details ? details.is_active : true;

  const { setValue, getValues } = methods;

  const [isNewCmRate, setIsNewCmRate] = useState(false);
  const [viewForm, setViewForm] = useState(false);
  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);
  const [getHsnDetailMaster] = useGetHsnDetailMasterMutation();
  const [addHsnMaster, { isLoading: addHsnMasterLoading }] =
    useAddHsnMasterMutation();
  const [updateHsnMaster, { isLoading: updateHsnMasterApiIsLoading }] =
    useUpdateHsnMasterMutation();

  const onSubmit = async (data) => {
    // console.log("data==>", data);

    if (details?.id) {
      await updateData({
        ...data,
        id: details.id,
        is_active: data.is_active === "true" ? true : false,
      });
    } else {
      await addData({
        ...data,
        is_active: data.is_active === "true" ? true : false,
      });
    }
  };

  const getHSNFields = async () => {
    try {
      setAddEditFormFieldsList(
        addEditFormFields.map((field) => {
          return field;
        })
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getHSNFields();
    };

    fetchData();
  }, [details]);

  const clearForm = () => {
    const defaultValues = methods.getValues();
    Object.keys(defaultValues).forEach((key) => {
      if (key !== "hsn" && key !== "is_active")
        setValue(key, "", {
          shouldValidate: true,
        });
    });
    setBankDetail({
      id: null,
      start_date: "",
      end_date: "",
      igst: "",
      sgst: "",
      cgst: "",
    });
    setIsNewCmRate(false);
  };

  const fetchTableData = async () => {
    try {
      const response = await getHsnDetailMaster(details?.id).unwrap();
      // console.log("success here:", response);

      const result = response?.data?.hsn_histroy?.map((item) => {
        return {
          id: item.id,
          start_date: item.start_date,
          end_date: item.end_date,
          igst: item.igst,
          sgst: item.sgst,
          cgst: item.cgst,
        };
      });

      if (details?.id) {
        setIsNewCmRate(true);
        let result = -1;
        let maxId = -1;

        response?.data?.hsn_histroy?.forEach((item, index) => {
          if (item.id === details.id && item.id > maxId) {
            result = index;
            maxId = item.id;
          }
        });

        setBankDetail((old) => ({
          ...old,
          id: details.id,
          start_date: details.start_date,
          end_date: details.end_date,
          igst: details.igst,
          sgst: details.sgst,
          cgst: details.cgst,
        }));

        if (result !== -1) {
          setCurrentBankFlag(result);
        }
      } else {
        setIsNewCmRate(false);
      }

      methods.setValue("hsn", result, { shouldValidate: true });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addData = async (data) => {
    try {
      const response = await addHsnMaster(data).unwrap();
      console.log("add warehouse type master res", response);
      if (response.status === 201) {
        toasterAlert(response);
        // Fetch the updated data from the API
        await fetchTableData();
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_HSN}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data || error?.data?.message || "HSN add Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // useEffect(() => {
  //   const value = methods.getValues("igst") / 2;
  //   if (value) {
  //     methods.setValue("sgst", value, { shouldValidate: true });
  //     methods.setValue("cgst", value, { shouldValidate: true });
  //   } else {
  //     // methods.setValue("sgst", null, { shouldValidate: true });
  //     // methods.setValue("cgst", null, { shouldValidate: true });
  //   }
  // }, [methods.getValues("igst")]);
  useEffect(() => {
    const igstValue = methods.getValues("igst");
    const halfValue = igstValue / 2;
    methods.setValue("sgst", halfValue, { shouldValidate: true });
    methods.setValue("cgst", halfValue, { shouldValidate: true });
  }, [methods, methods.getValues("igst")]);
  

  const updateData = async (data) => {
    try {
      const finalData = data?.hsn?.map((item) =>
        item.id === null
          ? {
            ...item,
            hsn_code: data.hsn_code,
          }
          : { ...item }
      );

      const response = await updateHsnMaster({
        ...data,
        hsn: finalData,
      }).unwrap();
      if (response.status === 200) {
        console.log("update warehouse type master res", response);
        toasterAlert(response);
        // Fetch the updated data from the API
        await fetchTableData();
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_HSN}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data || error?.data?.message || "Hsn update Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  const [bankDetail, setBankDetail] = useState({
    id: null,
    start_date: "",
    end_date: "",
    igst: "",
    sgst: "",
    cgst: "",
  });

  const [bankError, setBankError] = useState({
    start_date: "",
    end_date: "",
    igst: "",
    sgst: "",
    cgst: "",
  });

  const bankErrorMessage = () => {
    setBankError((old) => ({
      start_date: bankDetail.start_date === "" ? "error" : "",
      end_date: bankDetail.end_date === "" ? "error" : "",
      igst: bankDetail.igst === "" ? "error" : "",
      sgst: bankDetail.sgst === "" ? "error" : "",
      cgst: bankDetail.cgst === "" ? "error" : "",
    }));
  };

  const append_new_bank_details = () => {
    if (
      bankDetail.start_date !== "" &&
      bankDetail.end_date !== "" &&
      bankDetail.igst !== "" &&
      bankDetail.cgst !== "" &&
      bankDetail.sgst !== ""
    ) {
      const tempArr = getValues(`hsn`);
      setValue(
        `hsn`,
        [
          ...tempArr,
          {
            id: null,
            start_date: bankDetail.start_date,
            end_date: bankDetail.end_date,
            igst: bankDetail.igst,
            sgst: bankDetail.sgst,
            cgst: bankDetail.cgst,
          },
        ],
        { shouldValidate: true }
      );
      setBankDetail({
        id: null,
        start_date: "",
        end_date: "",
        igst: "",
        sgst: "",
        cgst: "",
      });
    } else {
      bankErrorMessage();
    }
  };

  const [updateBankFlag, setUpdateBankFlag] = useState(null);

  const [currentBankFlag, setCurrentBankFlag] = useState(null);

  const updateBankFlagFunction = (data, id) => {
    setUpdateBankFlag(id);
    setBankDetail({
      id: data.id,
      start_date: data.start_date,
      end_date: data.end_date,
      igst: data.igst,
      sgst: data.sgst,
      cgst: data.cgst,
    });
    setIsNewCmRate(false);
  };

  const UpdateBankDetail = () => {
    if (
      bankDetail.start_date !== "" &&
      bankDetail.end_date !== "" &&
      bankDetail.igst !== "" &&
      bankDetail.cgst !== "" &&
      bankDetail.sgst !== ""
    ) {
      const tempArr = getValues(`hsn`);
      setValue(
        `hsn`,
        [
          ...tempArr?.slice(0, updateBankFlag),
          {
            id: bankDetail.id,
            start_date: bankDetail.start_date,
            end_date: bankDetail.end_date,
            igst: bankDetail.igst,
            sgst: bankDetail.sgst,
            cgst: bankDetail.cgst,
          },
          ...tempArr?.slice(updateBankFlag + 1),
        ],
        { shouldValidate: true }
      );
      setBankDetail({
        id: null,
        start_date: "",
        end_datreceipt_datee: "",
        igst: "",
        sgst: "",
        cgst: "",
      });
      setUpdateBankFlag(null);
    } else {
      bankErrorMessage();
    }
  };

  const CurrentUpdateBankDetail = () => {
    if (
      bankDetail.start_date !== "" &&
      bankDetail.end_date !== "" &&
      bankDetail.igst !== "" &&
      bankDetail.cgst !== "" &&
      bankDetail.sgst !== ""
    ) {
      const tempArr = getValues(`hsn`);

      if (tempArr) {
        setValue(
          `hsn`,
          [
            ...tempArr?.slice(0, currentBankFlag),
            {
              id: bankDetail.id,
              start_date: bankDetail.start_date,
              end_date: bankDetail.end_date,
              igst: bankDetail.igst,
              sgst: bankDetail.sgst,
              cgst: bankDetail.cgst,
            },
            ...tempArr?.slice(currentBankFlag + 1),
          ],
          { shouldValidate: true }
        );
      }
    } else {
      bankErrorMessage();
    }
  };

  useEffect(() => {
    if (isNewCmRate) {
      CurrentUpdateBankDetail();
    }
  }, [bankDetail]);

  useEffect(() => {
    if (details?.id) {
      const fetchData = async () => {
        await fetchTableData();
      };

      fetchData();

      console.log(details, "here");

      const obj = {
        hsn_code: details?.hsn_code,
        igst: details?.igst,
        sgst: details?.sgst,
        cgst: details?.cgst,
        description: details?.description,
        start_date: details?.start_date,
        is_new: false,
        end_date: details?.end_date,
        is_active: details.is_active,
      };

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }
    setViewForm(location?.state?.view || false);
    const breadcrumbArray = [
      // {
      //   title: "Manage Commodity",
      //   link: "/commodity-master/hsn-master",
      // },
      {
        title: "HSN Master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_HSN}`,
      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));

    return () => {
      dispatch(setBreadCrumb([]));
    };
  }, [details]);

  const toasterAlert = (obj) => {
    let msg = obj?.message;
    let status = obj?.status;
    if (status === 400) {
      // ! commented the unused variable ..
      // const errorData = obj.data;
      // let errorMessage = "";

      // Object.keys(errorData).forEach((key) => {
      //   const messages = errorData[key];
      //   if (Array.isArray(messages)) {
      //     messages.forEach((message) => {
      //       errorMessage += `${key} : ${message} \n`;
      //     });
      //   }
      // });
      showToastByStatusCode(status, obj?.data?.message);
      return false;
    }
    showToastByStatusCode(status, msg);
  };

  return (
    <Box bg="white" borderRadius={10} p="10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
            <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
              <Grid
                gap={4}
                templateColumns={"repeat(3, 1fr)"}
                alignItems="center"
              >
                <Text textAlign="right">
                  HSN Code <span style={{ color: "red" }}>*</span>
                </Text>
                <CustomInput

                  name="hsn_code"
                  inputValue={methods.getValues("hsn_code")}
                  placeholder="HSN Code"
                  type="number"
                  label=""
                  style={{
                    mb: 1,
                    mt: 1,
                  }}
                  InputDisabled={viewForm ? true : !!details?.id} // Disable the input if details?.id is truthy
                />
              </Grid>
            </MotionSlideUp>
            <Box>

              {addEditFormFieldsList &&
                addEditFormFieldsList.map((item, i) => (
                  <MotionSlideUp key={i} duration={0.2 * i} delay={0.1 * i}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                    >
                      <Text textAlign="right">
                        {item.label}
                        {item.label === "Active" ? null : (
                          <span style={{ color: "red", marginLeft: "4px" }}>
                            *
                          </span>
                        )}
                      </Text>
                      {generateFormField({
                        ...item,
                        label: "",
                        // options: item.type === "select" && commodityTypeMaster,
                        selectedValue:
                          item.type === "select" &&
                          item?.options?.find(
                            (opt) =>
                              opt.label ===
                              details?.commodity_type?.commodity_type
                          ),
                        selectType: "label",
                        isChecked: details?.is_active,
                        isClearable: false,
                        style: { mb: 1, mt: 1 },
                        inputDisabled: viewForm,
                      })}
                    </Grid>
                  </MotionSlideUp>
                ))}

              <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                >
                  <Text textAlign="right">Active</Text>
                  <CustomSwitch
                    isDisabled={viewForm}
                    name="is_active"
                    // type="switch"
                    label=""
                    style={{
                      mb: 1,
                      mt: 1,
                    }}
                    isChecked={initialIsActive}
                  />
                </Grid>
              </MotionSlideUp>

              {details?.id ? (
                <></>
              ) : (
                <Box>
                  {/* For add data start */}
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                    >
                      <Text textAlign="right">
                        Start Date <span style={{ color: "red" }}>*</span>
                      </Text>
                      <Box>
                        <CustomInput
                          InputDisabled={viewForm}
                          name="start_date"
                          inputValue={methods.getValues("start_date")}
                          onBlur={(e) => {
                            methods.setValue("start_date", e.target.value, {
                              shouldValidate: true,
                            });
                          }}
                          placeholder="Rate"
                          type="date"
                          label=""
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                        />
                        {/* {moment(methods.getValues("start_date")).isBefore(
                          moment()
                        ) ? ( */}
                          <Text
                            color="red"
                            textAlign={"left"}
                            fontSize={"10px"}
                          >
                            You have selected a Past Date that will not be
                            editable in the future.{" "}
                          </Text>
                        {/* ) : (
                          <></>
                        )} */}
                      </Box>
                    </Grid>
                  </MotionSlideUp>

                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                    >
                      <Text textAlign="right">
                        End Date <span style={{ color: "red" }}>*</span>
                      </Text>
                      <CustomInput
                        InputDisabled={viewForm}
                        name="end_date"
                        inputValue={methods.getValues("end_date")}
                        onBlur={(e) => {
                          methods.setValue("end_date", e.target.value, {
                            shouldValidate: true,
                          });
                        }}
                        placeholder="Rate"
                        type="date"
                        label=""
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>

                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                    >
                      <Text textAlign="right">
                        IGST(%) <span style={{ color: "red" }}>*</span>
                      </Text>
                      <CustomInput
                        InputDisabled={viewForm}
                        name="igst"
                        inputValue={methods.getValues("igst")}
                        onChange={(e) => {
                          methods.setValue("igst", e.target.value, {
                            shouldValidate: true,
                          });
                        }}
                        placeholder="Rate"
                        type="number"
                        label=""
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>

                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                    >
                      <Text textAlign="right">
                        SGST(%) <span style={{ color: "red" }}>*</span>
                      </Text>
                      <CustomInput

                        name="sgst"
                        inputValue={methods.getValues("sgst")}
                        onChange={(e) => {
                          methods.setValue("sgst", e.target.value, {
                            shouldValidate: true,
                          });
                        }}
                        placeholder="Rate"
                        type="number"
                        label=""
                        InputDisabled={true}
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>

                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                    >
                      <Text textAlign="right">
                        CGST(%) <span style={{ color: "red" }}>*</span>
                      </Text>
                      <CustomInput
                        name="cgst"
                        inputValue={methods.getValues("cgst")}
                        onChange={(e) => {
                          methods.setValue("cgst", e.target.value, {
                            shouldValidate: true,
                          });
                        }}
                        placeholder="Rate"
                        InputDisabled={true}
                        type="number"
                        label=""
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>
                </Box>
              )}

              {details?.id ? (
                // For Edit code start
                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      mt={3}
                      alignItems="center"
                    >
                      <Text textAlign="right">
                        Start Date <span style={{ color: "red" }}>*</span>
                      </Text>
                      <Box>
                        <Input
                          value={bankDetail.start_date}
                          type="date"
                          isDisabled={
                            viewForm ? true : bankDetail?.id === null
                              ? false
                              : moment(bankDetail.start_date).isBefore(moment())
                          }
                          onChange={(e) => {
                            setBankDetail((old) => ({
                              ...old,
                              start_date: e.target.value,
                              end_date: "",
                            }));
                            setBankError((old) => ({
                              ...old,
                              start_date: "",
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={bankError.start_date ? "red" : "gray.10"}
                        />
                        {moment(bankDetail.start_date).isBefore(moment()) ? (
                          <Text
                            color="red"
                            textAlign={"left"}
                            fontSize={"10px"}
                          >
                            You have selected a Past Date that will not be
                            editable in the future.{" "}
                          </Text>
                        ) : (
                          <></>
                        )}
                      </Box>
                    </Grid>
                  </MotionSlideUp>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      mt={3}
                      alignItems="center"
                    >
                      <Text textAlign="right">
                        End Date <span style={{ color: "red" }}>*</span>
                      </Text>
                      <Input
                        isDisabled={viewForm}
                        value={bankDetail.end_date}
                        type="date"
                        min={bankDetail.start_date}
                        onChange={(e) => {
                          setBankDetail((old) => ({
                            ...old,
                            end_date: e.target.value,
                          }));
                          setBankError((old) => ({
                            ...old,
                            end_date: "",
                          }));
                        }}
                        style={inputStyle}
                        border="1px"
                        borderColor={bankError.end_date ? "red" : "gray.10"}
                      />
                    </Grid>
                  </MotionSlideUp>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt={3}
                    >
                      <Text textAlign="right">
                        IGST(%) <span style={{ color: "red" }}>*</span>
                      </Text>
                      <Input
                        isDisabled={viewForm}
                        value={bankDetail.igst}
                        type="number"
                        onChange={(e) => {
                          setBankDetail((old) => ({
                            ...old,
                            igst: e.target.value,
                            cgst: e?.target?.value ? e?.target?.value / 2 : 0,
                            sgst: e?.target?.value ? e?.target?.value / 2 : 0,
                          }));
                          setBankError((old) => ({
                            ...old,
                            igst: "",
                            cgst: "",
                            sgst: "",
                          }));
                        }}
                        style={inputStyle}
                        border="1px"
                        borderColor={bankError.igst ? "red" : "gray.10"}
                      />
                    </Grid>
                  </MotionSlideUp>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt={3}
                    >
                      <Text textAlign="right">
                        SGST(%) <span style={{ color: "red" }}>*</span>
                      </Text>
                      <Input
                        value={bankDetail.sgst}
                        type="number"
                        onChange={(e) => {
                          setBankDetail((old) => ({
                            ...old,
                            sgst: e.target.value,
                          }));
                          setBankError((old) => ({
                            ...old,
                            sgst: "",
                          }));
                        }}
                        style={inputStyle}
                        isDisabled={true}
                        border="1px"
                        borderColor={bankError.sgst ? "red" : "gray.10"}
                      />
                    </Grid>
                  </MotionSlideUp>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt={3}
                    >
                      <Text textAlign="right">
                        CGST(%) <span style={{ color: "red" }}>*</span>
                      </Text>
                      <Input
                        value={bankDetail.cgst}
                        type="number"
                        onChange={(e) => {
                          setBankDetail((old) => ({
                            ...old,
                            cgst: e.target.value,
                          }));
                          setBankError((old) => ({
                            ...old,
                            cgst: "",
                          }));
                        }}
                        style={inputStyle}
                        isDisabled={true}
                        border="1px"
                        borderColor={bankError.cgst ? "red" : "gray.10"}
                      />
                      <Flex>
                        <Button
                          type="button"
                          // maxWidth="200px"
                          backgroundColor={"white"}
                          isDisabled={viewForm ? true : false}
                          borderWidth={"1px"}
                          borderColor={"#A6CE39"}
                          _hover={{ backgroundColor: "" }}
                          color={"#A6CE39"}
                          borderRadius={"full"}
                          onClick={() => {
                            if (isNewCmRate) {
                              setIsNewCmRate(false);
                              setBankDetail({
                                id: null,
                                start_date: "",
                                end_date: "",
                                igst: "",
                                sgst: "",
                                cgst: "",
                              });
                              setCurrentBankFlag(null);
                            } else {
                              if (updateBankFlag === null) {
                                append_new_bank_details();
                              } else {
                                UpdateBankDetail();
                              }
                            }
                          }}
                        >
                          {isNewCmRate
                            ? "Add New Rate"
                            : updateBankFlag === null
                              ? "Add"
                              : "Update"}
                        </Button>
                      </Flex>
                    </Grid>
                  </MotionSlideUp>
                </Box>
              ) : (
                <></>
              )}
            </Box>

            {details?.id && (
              <Box mt={5}>
                <TableContainer>
                  <Table color="#000">
                    <Thead bg="#dbfff5" border="1px" borderColor="#000">
                      <Tr style={{ color: "#000" }}>
                        <Th color="#000">No.</Th>
                        <Th color="#000">Start date</Th>
                        <Th color="#000">End date</Th>
                        <Th color="#000">IGST(%)</Th>
                        <Th color="#000">SGST(%)</Th>
                        <Th color="#000">CGST(%)</Th>
                        <Th color="#000">Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody style={{ backgroundColor: "#ffffff" }}>
                      {getValues("hsn")?.map((data, index) => (
                        <Tr key={index}>
                          <Td>{index + 1}</Td>
                          <Td>{moment(data.start_date).format("LL")}</Td>
                          <Td>{moment(data.end_date).format("LL")}</Td>
                          <Td>{data.igst}</Td>
                          <Td>{data.sgst}</Td>
                          <Td>{data.cgst}</Td>
                          <Td>
                            <Box color={"primary.700"}>
                              {new Date(data.end_date) > new Date() ? (
                                <BiEditAlt
                                  fontSize="26px"
                                  cursor="pointer"
                                  onClick={() => {
                                    if (viewForm === true) { } else {
                                      updateBankFlagFunction(data, index);
                                    }
                                  }}
                                />
                              ) : (
                                <></>
                              )}
                            </Box>
                          </Td>
                        </Tr>
                      )) || <></>}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            <Box
              display="flex"
              gap={2}
              justifyContent="flex-end"
              mt="10"
              px="0"
            >
              <Button
                type="button"
                backgroundColor={"white"}
                borderWidth={"1px"}
                borderColor={"#F82F2F"}
                _hover={{ backgroundColor: "" }}
                color={"#F82F2F"}
                borderRadius={"full"}
                my={"4"}
                px={"10"}
                onClick={clearForm}
                isDisabled={viewForm ? true : false}
              >
                Clear
              </Button>

              <Button
                type="submit"
                //w="full"
                backgroundColor={"primary.700"}
                _hover={{ backgroundColor: "primary.700" }}
                color={"white"}
                borderRadius={"full"}
                isLoading={addHsnMasterLoading || updateHsnMasterApiIsLoading}
                my={"4"}
                px={"10"}
                isDisabled={viewForm ? true : false}
              >
                {details?.id ? "Update" : "Add"}
              </Button>
            </Box>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}

export default AddEditHsnMaster;

// ! commented the unused function
// const toasterAlert = (obj) => {
//   let msg = obj?.message;
//   let status = obj?.status;
//   if (status === 400) {
//     const errorData = obj.data;
//     let errorMessage = "";

//     Object.keys(errorData).forEach((key) => {
//       const messages = errorData[key];
//       messages.forEach((message) => {
//         errorMessage += `${key} : ${message} \n`;
//       });
//     });
//     showToastByStatusCode(status, errorMessage);
//     return false;
//   }
//   showToastByStatusCode(status, msg);
// };
