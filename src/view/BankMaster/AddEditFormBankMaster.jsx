/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import generateFormField from "../../components/Elements/GenerateFormField";
import {
  useAddBankMasterMutation,
  useGetBankMasterDetailsByIdMutation,
  useGetBankMasterSectorMutation,
  useUpdateBankMasterMutation,
} from "../../features/master-api-slice";
import { addEditFormFields, schema, schema2 } from "./fields";
import { MotionSlideUp } from "../../utils/animation";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";

import CustomSwitch from "../../components/Elements/CustomSwitch";
import CustomTextArea from "../../components/Elements/CustomTextArea";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import { useFetchLocationDrillDownFreeMutation } from "../../features/warehouse-proposal.slice";

import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import CustomInput from "../../components/Elements/CustomInput";
import CustomFileInput from "../../components/Elements/CustomFileInput";
import { BiDownload, BiEditAlt } from "react-icons/bi";
import moment from "moment";
import ROUTE_PATH from "../../constants/ROUTE";
import configuration from "../../config/configuration";

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

function AddEditFormBankMaster() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const details = location.state?.details;
  const [viewForm, setViewForm] = useState(false);
  const methods = useForm({
    resolver: yupResolver(details?.id ? schema2 : schema),
    defaultValues: {
      is_active: !details?.id, // Set is_active to true only when adding
    },
  });
  const initialIsActive = details ? details.is_active : true;
  const [selectBoxOptions, setSelectBoxOptions] = useState({
    regions: [],
    states: [],
    sector: [],
  });

  // Form Submit Function Start
  const onSubmit = (data) => {
    console.log("data==>", data);

    if (details?.id) {
      if (isNewCmRate) {
        if (
          bankDetail.rate === "" ||
          bankDetail.rate === null ||
          bankDetail.start_date === "" ||
          bankDetail.end_date === "" ||
          bankDetail.agreement === ""
        ) {
          toasterAlert({
            message: "Please Enter Bank Rate.",
            status: 440,
          });
        } else {
          updateData({
            ...data,
            id: details?.id,
          });
        }
      } else {
        updateData({
          ...data,
          id: details?.id,
        });
      }
    } else {
      addData({ ...data });
    }
  };
  // Form Submit Function End

  // Form Clear Function Start
  const clearForm = () => {
    const defaultValues = methods.getValues();
    if (details?.id) {
      Object.keys(defaultValues).forEach((key) => {
        // Check if the field key is not 'is_active' before clearing it
        if (key === "is_active" || key === "cm_rate") {
        } else {
          console.log(key);
          setValue(key, "", {
            shouldValidate: true,
          });
        }
      });
    } else {
      Object.keys(defaultValues).forEach((key) => {
        // Check if the field key is not 'is_active' before clearing it
        if (key === "is_active") {
        } else {
          console.log(key);
          setValue(key, "", {
            shouldValidate: true,
          });
        }
      });
    }
  };
  // Form Clear Function End

  // Define a state variable to hold the table data
  const [isNewCmRate, setIsNewCmRate] = useState(false);

  const [getBankMasterDetailsById] = useGetBankMasterDetailsByIdMutation();

  const [getBankMasterSector] = useGetBankMasterSectorMutation();

  const { setValue, getValues, formState } = methods;

  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);

  // console.log("details ---> ", details);

  const fetchBankMasterDetails = async () => {
    try {
      // console.log("details ---> ", details);
      const response = await getBankMasterDetailsById(details?.id).unwrap();
      // console.log(response, "here");
      if (response?.status === 200) {
        const result = response?.data?.cm?.map((item) => {
          return {
            cm_rate_id: item?.id,
            agreement_start_date: item?.agreement_start_date,
            agreement_end_date: item?.agreement_end_date,
            cm_rate: item?.cm_rate,
            agreement_path: item?.agreement_path,
          };
        });

        methods.setValue("cm_rate", result, { shouldValidate: true });

        // console.log(result, "here");
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };

  // Add Bank Api Start
  const [addBankMaster, { isLoading: addBankMasterApiIsLoading }] =
    useAddBankMasterMutation();

  const addData = async (data) => {
    try {
      const response = await addBankMaster(data).unwrap();
      // console.log("add bank master res", response);
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_BANKS_BANK}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data || error?.data?.message || "Bank Updating is Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };
  // Add Bank Api End

  // Update Bank Api Start
  const [updateBankMaster, { isLoading: updateBankMasterApiIsLoading }] =
    useUpdateBankMasterMutation();

  const updateData = async (data) => {
    try {
      const response = await updateBankMaster(data).unwrap();
      // console.log(response, "here");
      if (response.status === 200) {
        // console.log("update bank master res", response);
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_BANKS_BANK}`);
      }
    } catch (error) {
      console.log(error.data, "hii");
      let errorMessage =
        error?.data?.data || error?.data?.message || "Bank Updating is Failed";
      console.error("Error:", error);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };
  // Update Bank Api End

  // location drill down api hook
  const [
    fetchLocationDrillDown,
    { isLoading: fetchLocationDrillDownApiIsLoading },
  ] = useFetchLocationDrillDownFreeMutation();

  const getRegionMasterList = async () => {
    try {
      const response = await fetchLocationDrillDown().unwrap();
      // console.log("getRegionMasterList:", response);

      const arr = response?.region
        ?.filter((item) => item.region_name !== "ALL - Region")
        .map(({ region_name, id }) => ({
          label: region_name,
          value: id,
        }));

      if (details?.region?.is_active === false) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          regions: [
            ...arr,
            {
              label: details?.region?.region_name,
              value: details?.region?.id,
            },
          ],
        }));
      } else {
        setSelectBoxOptions((prev) => ({
          ...prev,
          regions: arr,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // const getRegionMasterList = async () => {
  //   try {
  //     const response = await fetchLocationDrillDown().unwrap();
  //     // console.log("getRegionMasterList:", response);
  //     setSelectBoxOptions((prev) => ({
  //       ...prev,
  //       regions: response?.region?.map(({ region_name, id }) => ({
  //         label: region_name,
  //         value: id,
  //       })),
  //     }));
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  const getBankMasterSectorList = async () => {
    try {
      const response = await getBankMasterSector().unwrap();
      // console.log("getBankMasterSectorList", response);

      const arr = response?.results
        ?.filter((item) => item.name !== "ALL - Region")
        .map(({ name, id }) => ({
          label: name,
          value: id,
        }));

      if (details?.bank_sector?.is_active === false) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          sector: [
            ...arr,
            {
              label: details?.bank_sector,
              value: details?.bank_sector?.id,
            },
          ],
        }));
      } else {
        setSelectBoxOptions((prev) => ({
          ...prev,
          sector: arr,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const regionOnChange = async (val) => {
    // console.log("value --> ", val);
    setValue("region", val?.value, {
      shouldValidate: true,
    });

    setValue("state", null, {
      shouldValidate: false,
    });

    const query = {
      region: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();
      // console.log("fetchLocationDrillDown response :", response);

      const arr = response?.state
        ?.filter((item) => item.state_name !== "All - State")
        .map(({ state_name, id }) => ({
          label: state_name,
          value: id,
        }));

      if (details?.state?.is_active === false) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          states: [
            ...arr,
            {
              label: details?.state?.state_name,
              value: details?.state?.id,
            },
          ],
        }));
      } else {
        setSelectBoxOptions((prev) => ({
          ...prev,
          states: arr,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const stateOnChange = async (val) => {
    // console.log("value --> ", val);
    setValue("state", val?.value, {
      shouldValidate: true,
    });
  };

  // Region State  Zone District Area  onChange drill down api end //

  const [bankDetail, setBankDetail] = useState({
    id: null,
    rate: "",
    start_date: "",
    end_date: "",
    agreement: "",
  });

  const [bankError, setBankError] = useState({
    rate: "",
    start_date: "",
    end_date: "",
    agreement: "",
  });

  const bankErrorMessage = () => {
    setBankError((old) => ({
      rate: bankDetail.rate === "" ? "error" : "",
      start_date: bankDetail.start_date === "" ? "error" : "",
      end_date: bankDetail.end_date === "" ? "error" : "",
      agreement: bankDetail.agreement === "" ? "error" : "",
    }));
  };

  const append_new_bank_details = () => {
    if (
      bankDetail.rate !== "" &&
      bankDetail.rate > 0 &&
      bankDetail.start_date !== "" &&
      bankDetail.end_date !== "" &&
      bankDetail.agreement !== ""
    ) {
      const tempArr = getValues(`cm_rate`);
      setValue(
        `cm_rate`,
        [
          ...tempArr,
          {
            cm_rate_id: null,
            agreement_start_date: bankDetail?.start_date,
            agreement_end_date: bankDetail?.end_date,
            cm_rate: bankDetail.rate,
            agreement_path: bankDetail.agreement,
          },
        ],
        { shouldValidate: true }
      );
      setBankDetail({
        id: null,
        rate: "",
        start_date: "",
        end_date: "",
        agreement: "",
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
      id: data?.cm_rate_id,
      rate: data?.cm_rate,
      start_date: data?.agreement_start_date,
      end_date: data?.agreement_end_date,
      agreement: data?.agreement_path,
    });
    setIsNewCmRate(false);
  };

  const UpdateBankDetail = () => {
    if (
      bankDetail.rate !== "" &&
      bankDetail.rate > 0 &&
      bankDetail.start_date !== "" &&
      bankDetail.end_date !== "" &&
      bankDetail.agreement !== ""
    ) {
      const tempArr = getValues(`cm_rate`);
      setValue(
        `cm_rate`,
        [
          ...tempArr?.slice(0, updateBankFlag),
          {
            cm_rate_id: bankDetail.id,
            agreement_start_date: bankDetail?.start_date,
            agreement_end_date: bankDetail?.end_date,
            cm_rate: bankDetail?.rate,
            agreement_path: bankDetail?.agreement,
          },
          ...tempArr?.slice(updateBankFlag + 1),
        ],
        { shouldValidate: true }
      );
      setBankDetail({
        id: null,
        rate: "",
        start_date: "",
        end_date: "",
        agreement: "",
      });
      setUpdateBankFlag(null);
    } else {
      bankErrorMessage();
    }
  };

  const CurrentUpdateBankDetail = () => {
    if (
      bankDetail.rate !== "" &&
      bankDetail.start_date !== "" &&
      bankDetail.end_date !== "" &&
      bankDetail.agreement !== ""
    ) {
      const tempArr = getValues(`cm_rate`);
      if (tempArr) {
        setValue(
          `cm_rate`,
          [
            ...tempArr?.slice(0, currentBankFlag),
            {
              cm_rate_id: bankDetail?.id,
              agreement_start_date: bankDetail?.start_date,
              agreement_end_date: bankDetail?.end_date,
              cm_rate: bankDetail?.rate,
              agreement_path: bankDetail?.agreement,
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
    // eslint-disable-next-line
  }, [bankDetail]);

  // Edit Form Fill Logic Start
  useEffect(() => {
    getBankMasterSectorList();
    if (details?.id) {
      // console.log("detail s", details);
      fetchBankMasterDetails();
      regionOnChange({ value: details.region?.id });
      let obj = {
        bank_name: details?.bank_name,
        region: details?.region?.id,
        state: details?.state?.id,
        bank_address: details?.bank_address,
        // cm_rate: details?.current_cm?.cm_rate,
        // agreement_path: details?.current_cm?.agreement_path,
        // agreement_end_date: details?.current_cm?.agreement_end_date,
        // agreement_start_date: details?.current_cm?.agreement_start_date,
        is_active: details.is_active,
        bank_sector: details?.bank_sector?.id,
      };
      // console.log("details", details);
      // console.log("obj here", obj, details);

      if (details?.current_cm?.id) {
        setIsNewCmRate(true);
        let result = -1;
        let maxId = -1;

        details?.cm?.forEach((item, index) => {
          if (item.id === details?.current_cm?.id && item.id > maxId) {
            result = index;
            maxId = item.id;
          }
        });

        setBankDetail((old) => ({
          ...old,
          id: details?.current_cm?.id,
          rate: details?.current_cm?.cm_rate,
          agreement: details?.current_cm?.agreement_path,
          start_date: details?.current_cm?.agreement_start_date,
          end_date: details?.current_cm?.agreement_end_date,
        }));

        if (result !== -1) {
          setCurrentBankFlag(result);
        }
      } else {
        setIsNewCmRate(false);
      }

      Object.keys(obj).forEach(function (key) {
        // console.log("key value test : " + key + " : " + obj[key]);
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }

    setAddEditFormFieldsList(
      addEditFormFields.map((field) => {
        return field;
      })
    );
    getRegionMasterList();

    setViewForm(location?.state?.view || false);

    const breadcrumbArray = [
      // {
      //   title: "Manage Banks",
      //   link: "/bank-master/bank-master",
      // },
      {
        title: "Bank Master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_BANKS_BANK}`,
      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];

    dispatch(setBreadCrumb(breadcrumbArray));
    // eslint-disable-next-line
  }, [details]);
  // Edit Form Fill Logic End

  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Box bg="white" borderRadius={10} p="10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
            <Box>
              {/* for the sector code */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Sector <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="bank_sector"
                      label=""
                      selectDisable={viewForm}
                      isLoading={false}
                      options={selectBoxOptions?.sector || []}
                      selectedValue={
                        selectBoxOptions?.sector?.filter(
                          (item) => item.value === getValues("bank_sector")
                        )[0] || {}
                      }
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        setValue("bank_sector", val.value, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {addEditFormFieldsList &&
                addEditFormFieldsList.map((item, i) => (
                  <MotionSlideUp key={i} duration={0.2 * i} delay={0.1 * i}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                    >
                      <Text textAlign="right">
                        {item.label} <span style={{ color: "red" }}>*</span>
                      </Text>
                      {generateFormField({
                        ...item,
                        label: "",
                        // options: item.type === "select" && commodityTypeMaster,
                        isChecked: details?.is_active,
                        style: { mb: 1, mt: 1 },
                        inputDisabled: viewForm,
                      })}
                    </Grid>
                  </MotionSlideUp>
                ))}

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Region <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="region"
                      label=""
                      isLoading={fetchLocationDrillDownApiIsLoading}
                      options={selectBoxOptions?.regions || []}
                      selectedValue={
                        selectBoxOptions?.regions?.filter(
                          (item) => item.value === getValues("region")
                        )[0] || {}
                      }
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        regionOnChange(val);
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      State <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="state"
                      label=""
                      isLoading={fetchLocationDrillDownApiIsLoading}
                      options={selectBoxOptions?.states || []}
                      selectedValue={
                        selectBoxOptions?.states?.filter(
                          (item) => item.value === getValues("state")
                        )[0] || {}
                      }
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        stateOnChange(val);
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Bank Address <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomTextArea
                      InputDisable={viewForm}
                      name="bank_address"
                      placeholder="bank address"
                      type="text"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              <Box>
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
              </Box>
            </Box>

            {details?.id ? (
              <></>
            ) : (
              // These is for add
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      CM Rate <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      name={"cm_rate"}
                      placeholder="Rate"
                      inputValue={getValues("cm_rate")}
                      onChange={(e) => {
                        setValue("cm_rate", e.target.value, {
                          shouldValidate: true,
                        });
                      }}
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
                      Agreement Start Date{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <Box>
                      <CustomInput
                        type="date"
                        InputDisabled={viewForm}
                        name="agreement_start_date"
                        placeholder="Agreement Start Date"
                        inputValue={getValues("agreement_start_date") || ""}
                        onBlur={(e) => {
                          setValue("agreement_start_date", e.target.value, {
                            shouldValidate: true,
                          });
                        }}
                        label=""
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                     
                        <Text color="red" textAlign={"left"} fontSize={"10px"}>
                          You have selected a Past Date that will not be
                          editable in the future.{" "}
                        </Text>
                     
                    </Box>
                  </Grid>
                </MotionSlideUp>

                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                    >
                      <Text textAlign="right">
                        Agreement End Date{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Text>
                      <CustomInput
                        InputDisabled={viewForm}
                        name={"agreement_end_date"}
                        placeholder="Agreement End Date"
                        type="date"
                        inputValue={getValues("agreement_end_date")}
                        onBlur={(e) => {
                          const value = e.target.value || null;
                          setValue("agreement_end_date", value, {
                            shouldValidate: true,
                          });
                        }}
                        label=""
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>
                </Box>

                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                    >
                      <Text textAlign="right">
                        Upload agreement
                        <span style={{ color: "red" }}>*</span>
                      </Text>
                      <CustomFileInput
                        InputDisabled={viewForm}
                        name={"agreement_path"}
                        placeholder="Agreement upload"
                        label=""
                        type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                        defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                        onChange={(e) => {
                          setValue("agreement_path", e, {
                            shouldValidate: true,
                          });
                        }}
                        fileuplaod_folder_structure={{
                          type: "master",
                          subtype: "Bank Master",
                        }}
                        value={getValues("agreement_path") || ""}
                        showErr={
                          formState?.errors?.agreement_path ? true : false
                        }
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>
                </Box>
              </Box>
            )}

            {console.log(bankError, "here")}

            {details?.id ? (
              // These is for edit
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt={3}
                  >
                    <Text textAlign="right">
                      CM Rate <span style={{ color: "red" }}>*</span>
                    </Text>
                    <Input
                      value={bankDetail.rate}
                      type="number"
                      onChange={(e) => {
                        setBankDetail((old) => ({
                          ...old,
                          rate: e.target.value,
                        }));
                        setBankError((old) => ({
                          ...old,
                          rate: "",
                        }));
                      }}
                      isDisabled={viewForm}
                      style={inputStyle}
                      border="1px"
                      borderColor={bankError.rate ? "red" : "gray.10"}
                    />
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
                      Agreement Start Date{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <Box>
                      <Input
                        value={bankDetail.start_date}
                        type="date"
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
                        isDisabled={
                          bankDetail?.id === null
                            ? false
                            : moment(bankDetail.start_date).isBefore(moment())
                        }
                        style={inputStyle}
                        border="1px"
                        borderColor={bankError.start_date ? "red" : "gray.10"}
                      />
                      {moment(bankDetail.start_date).isBefore(moment()) ? (
                        <Text color="red" textAlign={"left"} fontSize={"10px"}>
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
                      Agreement End Date <span style={{ color: "red" }}>*</span>
                    </Text>
                    <Input
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
                      isDisabled={viewForm}
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
                    mt={3}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Upload agreement <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomFileInput
                      InputDisabled={viewForm}
                      name={"agreement_path"}
                      placeholder="Agreement upload"
                      type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                      defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                      label=""
                      onChange={(e) => {
                        setBankDetail((old) => ({
                          ...old,
                          agreement: e,
                        }));
                        setBankError((old) => ({
                          ...old,
                          agreement: "",
                        }));
                      }}
                      fileuplaod_folder_structure={{
                        type: "master",
                        subtype: "Bank Master",
                      }}
                      value={bankDetail.agreement}
                      showErr={formState?.errors?.agreement_path ? true : false}
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                    <Flex>
                      <Button
                        type="button"
                        // maxWidth="200px"
                        backgroundColor={"white"}
                        borderWidth={"1px"}
                        borderColor={"#A6CE39"}
                        _hover={{ backgroundColor: "" }}
                        color={"#A6CE39"}
                        borderRadius={"full"}
                        isDisabled={viewForm ? true : false}
                        onClick={() => {
                          if (isNewCmRate) {
                            setIsNewCmRate(false);
                            setBankDetail({
                              id: null,
                              rate: "",
                              start_date: "",
                              end_date: "",
                              agreement: "",
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

            {/* This is for the table code  */}
            {details?.id ? (
              <Box mt={5}>
                <TableContainer>
                  <Table color="#000">
                    <Thead bg="#dbfff5" border="1px" borderColor="#000">
                      <Tr style={{ color: "#000" }}>
                        <Th color="#000">No. </Th>
                        <Th color="#000">Start Date </Th>
                        <Th color="#000">End date</Th>
                        <Th color="#000">CM Rate</Th>
                        <Th color="#000">View</Th>
                        <Th color="#000">Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody style={{ backgroundColor: "#ffffff" }}>
                      {getValues("cm_rate") &&
                        getValues("cm_rate").map((data, index) => (
                          <Tr key={index}>
                            <Td>{index + 1}</Td>
                            {console.log(data, "data")}
                            <Td>
                              {moment(data?.agreement_start_date).format("LL")}
                            </Td>
                            <Td>
                              {moment(data?.agreement_end_date).format("LL")}
                            </Td>
                            <Td>{data.cm_rate}</Td>
                            <Td>
                              <Box color={"primary.700"}>
                                <BiDownload
                                  fontSize="26px"
                                  cursor="pointer"
                                  onClick={() => {
                                    window.open(
                                      `${configuration.BASE_URL}${
                                        data?.agreement_path || ""
                                      }`,
                                      "_blank"
                                    );
                                  }}
                                />
                                {/* <DownloadFilesFromUrl
                                  details={{
                                    paths: [data?.agreement_path],
                                    fileName: "",
                                  }}
                                /> */}
                              </Box>
                            </Td>
                            <Td>
                              <Box color={"primary.700"}>
                                {new Date(data.agreement_end_date) >
                                new Date() ? (
                                  <BiEditAlt
                                    fontSize="26px"
                                    cursor="pointer"
                                    onClick={() => {
                                      if (viewForm === true) {
                                      } else {
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
                        ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <></>
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
                isDisabled={viewForm ? true : false}
                // onClick={clearForm}
                onClick={clearForm}
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
                isDisabled={
                  viewForm ? true : updateBankFlag === null ? false : true
                }
                isLoading={
                  addBankMasterApiIsLoading || updateBankMasterApiIsLoading
                }
                my={"4"}
                px={"10"}
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

export default AddEditFormBankMaster;
const toasterAlert = (obj) => {
  let msg = obj?.message;
  let status = obj?.status;
  if (status === 400) {
    const errorData = obj.data;
    let errorMessage = "";

    Object.keys(errorData).forEach((key) => {
      const messages = errorData[key];
      messages.forEach((message) => {
        errorMessage += `${key} : ${message} \n`;
      });
    });
    showToastByStatusCode(status, errorMessage);
    return false;
  }
  showToastByStatusCode(status, msg);
};
