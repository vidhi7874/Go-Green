/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addEditFormFields, schema } from "./fields";
import {
  useAddInsurancePolicyMasterMutation,
  useGetBankMasterMutation,
  useGetClientMasterFreeTypeMutation,
  useGetCommodityMasterMutation,
  useGetEarthQuakeZoneTypeMasterMutation,
  useGetWareHouseFreeMutation,
  // useGetWareHouseOwnerFreeMutation,
  useUpdateInsurancePolicyMasterMutation,
} from "../../features/master-api-slice";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import { Box, Button, Grid, GridItem, Text } from "@chakra-ui/react";
import { MotionSlideUp } from "../../utils/animation";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import generateFormField from "../../components/Elements/GenerateFormField";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import CustomInput from "../../components/Elements/CustomInput";
import CustomSwitch from "../../components/Elements/CustomSwitch";
import { useGetWarehouseUnitTypeMutation } from "../../features/warehouse-proposal.slice";
import FileUploadCmp from "../../components/Elements/FileUploadCmp";
import ROUTE_PATH from "../../constants/ROUTE";
import { toast } from "react-toastify";
import DownloadFilesFromUrl from "../../components/DownloadFileFromUrl";
import { AiFillDelete } from "react-icons/ai";

const AddEditInsurancePolicy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const details = location.state?.details;
  // console.log("details ---> ", details);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_active: !details?.id, // Set is_active to true only when adding
    },
  });
  const templateColumns = {
    base: "repeat(1, 1fr)",
    md: "repeat(3, 2fr)",
    lg: "repeat(3, 1fr)",
  };

  const [viewForm, setViewForm] = useState(false);

  const [formKey, setFormKey] = useState(0);
  const initialIsActive = details ? details.is_active : true;
  const [selectBoxOptions, setSelectBoxOptions] = useState({
    regions: [],
    states: [],
    warehouseOwner: [],

    insuranceType: [
      {
        label: "Fire",
        value: "fire",
      },
      {
        label: "Burglary",
        value: "burglary",
      },
    ],
    unit: [
      {
        label: "Dry",
        value: "dry",
      },
      {
        label: "Cold",
        value: "cold",
      },
      {
        label: "Oil tank",
        value: "oil_tank",
      },
      {
        label: "Silo",
        value: "silo",
      },
      {
        label: "Open Plinth",
        value: "open_plinth",
      },
    ],
    policy: [
      {
        label: "Go green",
        value: "go_green",
      },
      {
        label: "Client",
        value: "client",
      },
      {
        label: "Bank",
        value: "bank",
      },
      // {
      //   label: "Owner",
      //   value: "owner",
      // },
      {
        label: "Warehouse",
        value: "warehouse",
      },
    ],
  });
  const [uploadedInsurancePolicy, setUploadedInsurancePolicy] = useState([]);
  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);
  const {
    setValue,
    getValues,
    formState: { errors },
    // reset,
  } = methods;

  const onSubmit = (data) => {
    console.log("data==>", data);
    const {
      commodity,
      policy_amount,
      hypothecation_with_multiple_bank,
      warehouse_name,
      ...formData
    } = data;

    // Check if details?.id is present and details?.policy_amount is available
    // if (details?.id && details?.policy_amount !== undefined) {
    //   const comesValue = details.policy_amount;

    //   // Your logic here, for example, check if policy_amount is not greater than comesValue
    //   if (policy_amount < comesValue) {
    //     toast.error("You can't lower previously entered 'Insurance Policy Amount'. Please enter previously entered amount or greater than Previous insurnace amount.");
    //     // You can also display an error message to the user or take other appropriate actions
    //     return;
    //   }
    // }

    if (details?.id) {
      if (details?.id && details?.policy_amount !== undefined) {
        const comesValue = details.policy_amount;

        // Your logic here, check if policy_amount is not greater than comesValue
        if (policy_amount < comesValue) {
          toast.error(
            "You can't lower the previously entered 'Insurance Policy Amount'. Please enter an amount greater than the previous insurance amount."
          );
          return;
        }
      }
      let obj =
        (commodity === null ||
          commodity?.length === 0 ||
          commodity === undefined) &&
        (hypothecation_with_multiple_bank === null ||
          hypothecation_with_multiple_bank?.length === 0 ||
          hypothecation_with_multiple_bank === undefined)
          ? {
              ...formData,
              id: details.id,
              hypothecation_with_multiple_bank: [],
              commodity: [],
              warehouse_name: warehouse_name === null ? [] : warehouse_name,
            }
          : commodity === null ||
            commodity?.length === 0 ||
            commodity === undefined
          ? {
              ...formData,
              hypothecation_with_multiple_bank:
                hypothecation_with_multiple_bank,
              id: details.id,
              commodity: [],
              warehouse_name: warehouse_name === null ? [] : warehouse_name,
            }
          : hypothecation_with_multiple_bank === null ||
            hypothecation_with_multiple_bank?.length === 0 ||
            hypothecation_with_multiple_bank === undefined
          ? {
              ...formData,
              commodity: commodity,
              id: details.id,
              hypothecation_with_multiple_bank: [],
              warehouse_name: warehouse_name === null ? [] : warehouse_name,
            }
          : {
              ...data,
              id: details.id,
              warehouse_name: warehouse_name === null ? [] : warehouse_name,
            };
      updateData({
        ...obj,
        insurance_policy: uploadedInsurancePolicy,
        policy_amount,
      });
    } else {
      let obj =
        (commodity === null ||
          commodity?.length === 0 ||
          commodity === undefined) &&
        (hypothecation_with_multiple_bank === null ||
          hypothecation_with_multiple_bank?.length === 0 ||
          hypothecation_with_multiple_bank === undefined)
          ? {
              ...formData,
              warehouse_name: warehouse_name === null ? [] : warehouse_name,
            }
          : commodity === null ||
            commodity?.length === 0 ||
            commodity === undefined
          ? {
              ...formData,
              hypothecation_with_multiple_bank:
                hypothecation_with_multiple_bank,
              warehouse_name: warehouse_name === null ? [] : warehouse_name,
            }
          : hypothecation_with_multiple_bank === null ||
            hypothecation_with_multiple_bank?.length === 0 ||
            hypothecation_with_multiple_bank === undefined
          ? {
              ...formData,
              commodity: commodity,
              warehouse_name: warehouse_name === null ? [] : warehouse_name,
            }
          : {
              ...data,
              warehouse_name: warehouse_name === null ? [] : warehouse_name,
            };
      addData({
        ...obj,
        insurance_policy: uploadedInsurancePolicy,
        policy_amount,
      });
    }
  };
  // for clear data in form
  // const deleteFile = (ind) => {
  //   // const isDisabled = viewForm();
  //   // if (isDisabled) {
  //   //   return false;
  //   // }

  //   let indexToRemove = ind;

  //   if (
  //     indexToRemove > 0 &&
  //     indexToRemove < uploadedInsurancePolicy.length
  //   ) {
  //     uploadedInsurancePolicy.splice(indexToRemove, 1);
  //     setUploadedInsurancePolicy([...uploadedInsurancePolicy]);
  //   } else {
  //     setUploadedInsurancePolicy([]);
  //     setValue("insurance_policy", "", {
  //       shouldValidate: true,
  //     });
  //   }
  //   // clearBagWiseRateDetailsForm();

  //   //uploadedSignedServiceContract
  // };

  const deleteFile = (ind) => {
    let indexToRemove = ind;

    if (indexToRemove >= 0 && indexToRemove < uploadedInsurancePolicy.length) {
      uploadedInsurancePolicy.splice(indexToRemove, 1);
      setUploadedInsurancePolicy([...uploadedInsurancePolicy]); // Note: This might not be necessary
    } else {
      setUploadedInsurancePolicy([]);
      setValue("insurance_policy", "", {
        shouldValidate: true,
      });
    }
  };

  // console.log("form errors --->", errors);

  const clearForm = () => {
    const defaultValues = methods.getValues();
    Object.keys(defaultValues)?.forEach((key) => {
      setValue(key, null, {
        shouldValidate: true,
      });
    });

    setFormKey(formKey + 1); // Trigger re-render
  };

  // Warehouse Unit type code start
  const [
    getWarehouseUnitType,
    // { isLoading: getWarehouseUnitTypeApiIsLoading },
  ] = useGetWarehouseUnitTypeMutation();

  const getWarehouseUnitTypeMasterList = async () => {
    try {
      const response = await getWarehouseUnitType().unwrap();

      const arr = response?.results?.map(({ warehouse_unit_type, id }) => ({
        label: warehouse_unit_type,
        value: id,
      }));

      // console.log("getWarehouseUnitTypeMasterList:", response, arr);

      setSelectBoxOptions((prev) => ({
        ...prev,
        warehouseUnitType: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getWarehouseUnitTypeMasterList();
    // eslint-disable-next-line
  }, []);

  // Warehouse Unit Type code End
  const [
    addInsurancePolicyMaster,
    { isLoading: addInsurancePolicyMasterApiIsLoading },
  ] = useAddInsurancePolicyMasterMutation();

  const [
    updateInsurancePolicyMaster,
    { isLoading: updateInsurancePolicyMasterApiIsLoading },
  ] = useUpdateInsurancePolicyMasterMutation();

  const [
    getEarthquakeZoneTypeMaster,
    { isLoading: getEarthquakeZoneTypeMasterApiIsLoading },
  ] = useGetEarthQuakeZoneTypeMasterMutation();

  const EarthZoneData = async () => {
    try {
      const response = await getEarthquakeZoneTypeMaster().unwrap();
      // console.log("here:", response);
      let onlyActive = response?.results?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.earthquake_zone_type,
        value: item.id,
      }));

      // console.log(arr);

      setSelectBoxOptions((prev) => ({
        ...prev,
        earthZone: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [getCommodityMaster, { isLoading: getCommodityMasterApiIsLoading }] =
    useGetCommodityMasterMutation();

  const CommodityData = async () => {
    try {
      const response = await getCommodityMaster().unwrap();
      // console.log("here:", response);
      let onlyActive = response?.results?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.commodity_name,
        value: item.id,
      }));

      // console.log(arr);

      setSelectBoxOptions((prev) => ({
        ...prev,
        commodity: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [getBankMaster, { isLoading: getBankMasterApiIsLoading }] =
    useGetBankMasterMutation();

  const BankMasterData = async () => {
    try {
      const response = await getBankMaster().unwrap();
      // console.log("here:", response);
      let onlyActive = response?.results?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.bank_name,
        value: item.id,
      }));

      console.log(arr);

      setSelectBoxOptions((prev) => ({
        ...prev,
        bank: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Client Master start

  const [getClientMaster, { isLoading: getClientMasterApiIsLoading }] =
    useGetClientMasterFreeTypeMutation();

  const getClientMasterList = async () => {
    try {
      const response = await getClientMaster().unwrap();
      // console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          client: response?.data?.map(({ name_of_client, id }) => ({
            label: name_of_client,
            value: id,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getClientMasterList();
    // eslint-disable-next-line
  }, []);

  // Client Master end

  // Warehouse Master start

  const [
    getWarehouseMaster,
    //  { isLoading: getWarehouseMasterApiIsLoading }
  ] = useGetWareHouseFreeMutation();

  const getWarehouseMasterList = async (params) => {
    try {
      const response = await getWarehouseMaster(params).unwrap();
      // console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          warehouse: response?.data?.map(
            ({ warehouse_name, id, total_rent_payable }) => ({
              label: warehouse_name,
              value: id,
              rent: total_rent_payable,
            })
          ),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (getValues("earthquake_zone") && getValues("warehouse_unit_type")) {
      let params =
        ("filter=area__earthquake_zone_type__earthquake_zone_type&area__earthquake_zone_type__earthquake_zone_type=" +
          selectBoxOptions?.earthZone?.filter(
            (item) => item.value === getValues("earthquake_zone")
          )?.[0]?.label || "") +
        ("&filter=warehouse_unit_type__warehouse_unit_type&warehouse_unit_type__warehouse_unit_type=" +
          selectBoxOptions?.warehouseUnitType?.filter(
            (item) => item.value === getValues("warehouse_unit_type")
          )?.[0]?.label || "");
      getWarehouseMasterList(params);
    } else if (getValues("earthquake_zone")) {
      let params =
        "filter=area__earthquake_zone_type__earthquake_zone_type&area__earthquake_zone_type__earthquake_zone_type=" +
          selectBoxOptions?.earthZone?.filter(
            (item) => item.value === getValues("earthquake_zone")
          )?.[0]?.label || "";
      getWarehouseMasterList(params);
    } else if (getValues("warehouse_unit_type")) {
      let params =
        "filter=warehouse_unit_type__warehouse_unit_type&warehouse_unit_type__warehouse_unit_type=" +
          selectBoxOptions?.warehouseUnitType?.filter(
            (item) => item.value === getValues("warehouse_unit_type")
          )?.[0]?.label || "";
      getWarehouseMasterList(params);
    } else {
      getWarehouseMasterList();
    }
    // eslint-disable-next-line
  }, [
    getValues("earthquake_zone"),
    getValues("warehouse_unit_type"),
    selectBoxOptions.earthZone,
    selectBoxOptions.warehouseUnitType,
  ]);

  // Warehouse Master end

  const handleFileChange = (url, name) => {
    setValue(name, url, { shouldValidate: true });
  };

  const addData = async (data) => {
    try {
      const response = await addInsurancePolicyMaster(data).unwrap();
      // console.log("add insurance policy master res", response);
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_INSURANCE_POLICY}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        "Insurance Policy Adding is Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  const getInsurancePolicy = async () => {
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

  const updateData = async (data) => {
    console.log(data);
    try {
      const response = await updateInsurancePolicyMaster({
        ...data,
        id: details.id,
      }).unwrap();
      if (response.status === 200) {
        console.log("update insurance policy master res", response);
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_INSURANCE_POLICY}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        "Insurance Policy Updating is Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  useEffect(() => {
    getInsurancePolicy();
    EarthZoneData();
    CommodityData();
    BankMasterData();
    console.log(details, "kkkkk");
    if (details?.id) {
      const tempcommodityArr = details?.commodity?.map((item) => {
        return item.id;
      });
      const tempmultibankArr = details?.hypothecation_with_multiple_bank?.map(
        (item) => {
          return item.id;
        }
      );
      const tempWarehouse = details?.warehouse_name?.map((item) => {
        return item.id;
      });

      console.log(tempWarehouse, "tempWarehouse");

      let obj = {
        policy_number: details?.policy_number,
        insurance_policy_holder_name: details?.insurance_policy_holder_name,
        insurance_company: details?.insurance_company,
        risk_cover_type: details?.risk_cover_type,
        policy_amount: details?.policy_amount,
        policy_start_date: details?.policy_start_date,
        policy_end_date: details?.policy_end_date,
        earthquake_zone: details?.earthquake_zone?.id,
        warehouse_unit_type: details?.warehouse_unit_type?.id,
        warehouse_risk_cover_limit: details?.warehouse_risk_cover_limit,
        commodity: tempcommodityArr,
        policy_by: details?.policy_by,
        client: details?.client?.id,
        //warehouse_owner: details?.warehouse_owner?.id,
        bank: details?.bank?.id,
        warehouse_name: tempWarehouse,
        hypothecation_with_multiple_bank: tempmultibankArr,
        email_attactment: details?.email_attactment,
        insurance_policy: details?.insurance_policy?.[0],
        is_active: details?.is_active,
        remark: details?.remark,
      };

      // setHandleSelectBoxVal

      console.log(details, "details");
      setUploadedInsurancePolicy(details?.insurance_policy || []);
      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }
    setViewForm(location?.state?.view || false);
    const breadcrumbArray = [
      // {
      //   title: "Manage Insurance",
      //   link: "/manage-insurance/insurance-policy-master",
      // },
      {
        title: " Insurance Policy Master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_LOCATION_INSURANCE_POLICY}`,
      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];

    dispatch(setBreadCrumb(breadcrumbArray));
    // eslint-disable-next-line
  }, [details]);

  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
    // eslint-disable-next-line
  }, []);
  const disabledOptions = ["option1", "option2", "option3"];
  return (
    <Box bg="white" key={formKey} borderRadius={10} p="10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
            <Box>
              {/* This is code for the insurance policy number */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      {" "}
                      Policy No{" "}
                      <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      name="policy_number"
                      placeholder="Policy No"
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

              {/* This code for the Insurance Policy holder name */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Insurance Policy holder name{" "}
                      <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      name="insurance_policy_holder_name"
                      placeholder="Insurance Policy Holder Name"
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

              {/* This code for the insurance company */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Insurance Company Name{" "}
                      <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      name="insurance_company"
                      placeholder="Insurance Company"
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

              {/* This is code for the insurance policy  */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Risk Cover Type{" "}
                      <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      // selectDisable={viewForm}
                      selectDisable={viewForm || details?.id}
                      name="risk_cover_type"
                      label=""
                      isLoading={false}
                      options={selectBoxOptions?.insuranceType || []}
                      selectedValue={
                        selectBoxOptions?.insuranceType?.filter(
                          (item) => item.value === getValues("risk_cover_type")
                        )[0] || {}
                      }
                      isClearable={true}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        setValue("risk_cover_type", val?.value, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* {addEditFormFieldsList &&
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
                        showNumberToWord: {
                          isShow: true,
                          showOnly: ["policy_amount"],
                        },
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
                ))} */}

              {/*This is for Policy Amount (Rs)   */}

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Policy Amount (Rs){" "}
                      <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      name="policy_amount"
                      placeholder="Insurance Policy Amount"
                      type="number"
                      label=""
                      showNumberToWord={{
                        isShow: true,
                        showOnly: ["policy_amount"],
                      }}
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
                      Policy Start Date{" "}
                      <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm || details?.id}
                      name="policy_start_date"
                      placeholder="Policy Start Date"
                      type="date"
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
                      Policy End Date{" "}
                      <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm || details?.id}
                      name="policy_end_date"
                      placeholder="Policy End Date"
                      type="date"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* This is code for the earth zone  */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Earthquake zone{" "}
                      {/* <span style={{ color: "red", marginLeft: "4px" }}>*</span> */}
                    </Text>
                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="earthquake_zone"
                      label=""
                      isLoading={getEarthquakeZoneTypeMasterApiIsLoading}
                      options={selectBoxOptions?.earthZone || []}
                      selectedValue={
                        selectBoxOptions?.earthZone?.filter(
                          (item) => item.value === getValues("earthquake_zone")
                        )[0] || {}
                      }
                      isClearable={true}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        setValue("earthquake_zone", val?.value, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* This is code for the Warehouse Unit type  */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Warehouse Unit type{" "}
                      {/* <span style={{ color: "red", marginLeft: "4px" }}>*</span> */}
                    </Text>
                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="warehouse_unit_type"
                      label=""
                      isLoading={false}
                      options={selectBoxOptions?.warehouseUnitType || []}
                      selectedValue={
                        selectBoxOptions?.warehouseUnitType?.filter(
                          (item) =>
                            item.value === getValues("warehouse_unit_type")
                        )[0] || {}
                      }
                      isClearable={true}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        setValue("warehouse_unit_type", val?.value, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* This is code for the Warehouse risk cover limit (rs) */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Warehouse risk cover limit (rs)
                      {/* <span style={{ color: "red", marginLeft: "4px" }}>*</span> */}
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      name="warehouse_risk_cover_limit"
                      placeholder="Warehouse risk cover limit (rs)"
                      type="number"
                      label=""
                      inputValue={getValues("warehouse_risk_cover_limit") || ""}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setValue(
                          "warehouse_risk_cover_limit",
                          e.target.value === "" ? null : e.target.value,
                          {
                            shouldValidate: true,
                          }
                        );
                      }}
                      showNumberToWord={{
                        isShow: true,
                        showOnly: ["warehouse_risk_cover_limit"],
                      }}
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* This is code for the commodity  */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">Commodity </Text>
                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="commodity"
                      label=""
                      isMultipleSelect={true}
                      isLoading={getCommodityMasterApiIsLoading}
                      options={selectBoxOptions?.commodity || []}
                      selectedValue={
                        selectBoxOptions?.commodity?.filter((item) =>
                          getValues("commodity")?.some(
                            (old) => old === item?.value
                          )
                        ) || []
                      }
                      isClearable={true}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        const tempArr = val?.map((item) => {
                          return item.value;
                        });
                        setValue("commodity", tempArr, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* This is code for the Policy by  */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Policy by{" "}
                      <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      // selectDisable={viewForm}
                      selectDisable={viewForm || details?.id}
                      name="policy_by"
                      label=""
                      isLoading={false}
                      options={selectBoxOptions?.policy || []}
                      selectedValue={
                        selectBoxOptions?.policy?.filter(
                          (item) => item.value === getValues("policy_by")
                        )[0] || {}
                      }
                      isClearable={true}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        if (val?.value === "bank") {
                          setValue("hypothecation_with_multiple_bank", null, {
                            shouldValidate: true,
                          });
                        }
                        setValue("policy_by", val?.value, {
                          shouldValidate: true,
                        });
                        setValue("client", null, {
                          shouldValidate: true,
                        });
                        setValue("warehouse_name", null, {
                          shouldValidate: true,
                        });
                        setValue("bank", null, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {getValues("policy_by") === "client" ? (
                <>
                  {/* This is code for the Client Name */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">
                          Client Name{" "}
                          {getValues("policy_by") === "client" ? (
                            <span style={{ color: "red", marginLeft: "4px" }}>
                              *
                            </span>
                          ) : (
                            <></>
                          )}
                        </Text>
                        <ReactCustomSelect
                          name="client"
                          label=""
                          selectDisable={
                            viewForm
                              ? true
                              : getValues("policy_by") === "client"
                              ? false
                              : true
                          }
                          isLoading={getClientMasterApiIsLoading}
                          options={selectBoxOptions?.client || []}
                          selectedValue={
                            selectBoxOptions?.client?.filter(
                              (item) => item.value === getValues("client")
                            )[0] || {}
                          }
                          isClearable={true}
                          selectType="label"
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                          handleOnChange={(val) => {
                            setValue("client", val?.value, {
                              shouldValidate: true,
                            });
                          }}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>
                </>
              ) : (
                <></>
              )}

              <>
                {/* {getValues("policy_by") === "owner" ? (
                <> */}
                {/* This is code for the Warehouse owner name */}
                {/* <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">
                          Warehouse owner name{" "}
                          {getValues("policy_by") === "owner" ? (
                            <span style={{ color: "red", marginLeft: "4px" }}>
                              *
                            </span>
                          ) : (
                            <></>
                          )}
                        </Text>
                        <ReactCustomSelect
                          name="warehouse_owner"
                          label=""
                          isLoading={false}
                          selectDisable={
                            getValues("policy_by") === "owner" ? false : true
                          }
                          options={selectBoxOptions?.warehouseOwner || []}
                          selectedValue={
                            selectBoxOptions?.warehouseOwner?.filter(
                              (item) =>
                                item.value === getValues("warehouse_owner")
                            )[0] || {}
                          }
                          isClearable={true}
                          selectType="label"
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                          handleOnChange={(val) => {
                            setValue("warehouse_owner", val?.value, {
                              shouldValidate: true,
                            });
                          }}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box> */}
                {/* </>
              ) : (
                <></>
              )} */}
              </>

              {getValues("policy_by") === "bank" ? (
                <>
                  {/* This is code for the Bank Name */}
                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">
                          Bank Name{" "}
                          {getValues("policy_by") === "bank" ? (
                            <span style={{ color: "red", marginLeft: "4px" }}>
                              *
                            </span>
                          ) : (
                            <></>
                          )}
                        </Text>
                        <ReactCustomSelect
                          name="bank"
                          label=""
                          selectDisable={
                            viewForm
                              ? true
                              : getValues("policy_by") === "bank"
                              ? false
                              : true
                          }
                          isLoading={getBankMasterApiIsLoading}
                          options={selectBoxOptions?.bank || []}
                          selectedValue={
                            selectBoxOptions?.bank?.filter(
                              (item) => item.value === getValues("bank")
                            )[0] || {}
                          }
                          isClearable={true}
                          selectType="label"
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                          handleOnChange={(val) => {
                            setValue("bank", val?.value, {
                              shouldValidate: true,
                            });
                          }}
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>
                </>
              ) : (
                <></>
              )}

              {/* This is code for the warehouse name  */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      warehouse name{" "}
                      {getValues("policy_by") === "warehouse" ? (
                        <span style={{ color: "red", marginLeft: "4px" }}>
                          *
                        </span>
                      ) : (
                        <></>
                      )}
                      {getValues("earthquake_zone") ? <></> : <></>}{" "}
                    </Text>
                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="warehouse_name"
                      label=""
                      isMultipleSelect={true}
                      isLoading={getCommodityMasterApiIsLoading}
                      options={selectBoxOptions?.warehouse || []}
                      selectedValue={
                        selectBoxOptions?.warehouse?.filter((item) =>
                          getValues("warehouse_name")?.some(
                            (old) => old === item.value
                          )
                        ) || []
                      }
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        const tempArr = val.map((item) => {
                          return item.value;
                        });
                        setValue("warehouse_name", tempArr, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* This is code for the Hypothecation with multiple bank  */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Hypothecation with multiple bank
                    </Text>
                    <ReactCustomSelect
                      name="hypothecation_with_multiple_bank"
                      label=""
                      selectDisable={
                        viewForm
                          ? true
                          : getValues("policy_by") !== "bank"
                          ? false
                          : true
                      }
                      isMultipleSelect={true}
                      isLoading={getBankMasterApiIsLoading}
                      options={selectBoxOptions?.bank || []}
                      selectedValue={
                        selectBoxOptions?.bank?.filter((item) =>
                          getValues("hypothecation_with_multiple_bank")?.some(
                            (old) => old === item.value
                          )
                        ) || []
                      }
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        const tempArr = val.map((item) => {
                          return item.value;
                        });
                        setValue("hypothecation_with_multiple_bank", tempArr, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* This code for the upload document */}
              {/* <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    my="2"
                  >
                    <Text textAlign="right">
                      Policy Upload{" "}
                      <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                    </Text>

                    <FileUploadCmp
                      isDisabled={viewForm}
                      label=""
                      name="insurance_policy"
                      isError={errors?.insurance_policy}
                      type="application/pdf, image/jpeg, image/png, image/jpg"
                      placeholder="Choose a file"
                      fileuplaod_folder_structure={{
                        type: "master",
                        subtype: "Insurance Policy Master",
                      }}
                      allowedTypes={[
                        "application/pdf",
                        "image/jpeg",
                        "image/png",
                        "image/jpg",
                      ]}
                      fileName={getValues("insurance_policy")}
                      clearFileName={getValues("insurance_policy") === ""}
                      value={getValues("insurance_policy")}
                      showDownloadIcon={true}
                      isMultipalUpload={false}
                      maxFileSize={1024 * 1024} // For example, 1MB (1024 bytes * 1024 bytes)
                      onChange={(url) =>
                        handleFileChange(url, "insurance_policy")
                      }
                    />
                  </Grid>
                </MotionSlideUp>
              </Box> */}

              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text>
                    Policy Upload <span style={{ color: "red" }}>*</span>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <FileUploadCmp
                    label=""
                    name="insurance_policy"
                    fileName={getValues("insurance_policy")}
                    isError={errors?.insurance_policy}
                    type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword"
                    defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                    placeholder="Choose a file"
                    allowedTypes={[
                      "application/pdf",
                      "image/jpeg",
                      "image/png",
                      "image/jpg",
                      "application/msword",
                    ]}
                    clearFileName={getValues("insurance_policy") === ""}
                    value={getValues("insurance_policy")}
                    fileuplaod_folder_structure={{
                      type: "master",
                      subtype: "Insurance Policy Master",
                    }}
                    // showDownloadIcon={true}

                    isMultipalUpload={false}
                    isDisabled={viewForm}
                    //  clearFileName={clearFileName}
                    maxFileSize={1024 * 1024} // For example, 1MB (1024 bytes * 1024 bytes)
                    onChange={(url) => {
                      handleFileChange(url, "insurance_policy");
                      setUploadedInsurancePolicy((prev) => [...prev, url]);
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
                  <Box>
                    {uploadedInsurancePolicy.map((url, ind) => (
                      <Box
                        key={ind}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        gap="4"
                        border="1px"
                        borderColor="gray.300"
                        p="1"
                        my="1"
                      >
                        <Box
                          style={{
                            width: "300px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {url?.split("/")[url?.split("/")?.length - 1]}
                        </Box>
                        <Box
                          cursor="pointer"
                          display="flex"
                          gap="2"
                          alignItems="center"
                        >
                          <Button p="1">
                            <DownloadFilesFromUrl
                              details={{
                                paths: [url],
                                fileName: "file_download",
                              }}
                              iconFontSize="20px"
                            />
                          </Button>
                          <Button p="1" onClick={() => deleteFile(ind)}>
                            <AiFillDelete color="red" />
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </GridItem>
              </Grid>

              {/* This code for the upload document */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      E-mail attachment
                      <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                    </Text>

                    <FileUploadCmp
                      isDisabled={viewForm}
                      label=""
                      name="email_attactment"
                      isError={errors?.email_attactment}
                      type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword"
                      defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                      placeholder="Choose a file"
                      allowedTypes={[
                        "application/pdf",
                        "image/jpeg",
                        "image/png",
                        "image/jpg",
                        "application/msword",
                      ]}
                      fileName={getValues("email_attactment")}
                      fileuplaod_folder_structure={{
                        type: "master",
                        subtype: "Insurance Policy Master",
                      }}
                      clearFileName={getValues("email_attactment") === ""}
                      value={getValues("email_attactment")}
                      showDownloadIcon={true}
                      isMultipalUpload={false}
                      maxFileSize={1024 * 1024} // For example, 1MB (1024 bytes * 1024 bytes)
                      onChange={(url) =>
                        handleFileChange(url, "email_attactment")
                      }
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* This code for the remark */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">Remark</Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      name="remark"
                      placeholder="Remark"
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
                onClick={() => clearForm()}
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
                isLoading={
                  addInsurancePolicyMasterApiIsLoading ||
                  updateInsurancePolicyMasterApiIsLoading
                }
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
};

export default AddEditInsurancePolicy;

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
