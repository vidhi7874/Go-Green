import {
  Box,
  Button,
  FormControl,
  Grid,
  GridItem,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MotionSlideUp } from "../../utils/animation";
import generateFormField from "../../components/Elements/GenerateFormField";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { yupResolver } from "@hookform/resolvers/yup";
// import { addEditFormFields, schema } from "../RegionMaster/fields";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ROUTE_PATH from "../../constants/ROUTE";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import {
  useAddRegionMasterMutation,
  useGetChamberFreeMutation,
  useGetClientMasterFreeTypeMutation,
  useGetCommodityFreeMasterMutation,
  useGetRegionByIdMasterMutation,
  useGetStateFreeMasterMutation,
  useGetWareHouseFreeMutation,
  useUpdateRegionMasterMutation,
} from "../../features/master-api-slice";
import ReactSelect from "react-select";
import { useFetchLocationDrillDownFreeMutation } from "../../features/warehouse-proposal.slice";
import { addEditFormFields, backendKeys, schema } from "./field";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import {
  useGetOtherBillingByIdMutation,
  usePostOtherBillingMutation,
} from "../../features/billing.slice";
import { useGetPbpmConfigurationMutation } from "../../features/setting.slice";

const allServiceOptions = [
  { value: "fumigation", label: "Fumigation" },
  { value: "loading", label: "Loading" },
  { value: "unloading", label: "Unloading" },
  { value: "transportation", label: "Transportation" },
  { value: "ghani_bag_purchasing", label: "Ghani Bag Purchasing" },
  { value: "service_charge", label: "Service Charge" },
  { value: "cm_charge", label: "CM Charge" },
  { value: "insurance_charge", label: "Insurance Charge" },
  { value: "rent", label: "Rent" },
  { value: "other", label: "Other" },
];

function AddEditOtherBillingComponent() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedClient, setSelectedClient] = useState({});

  const methods = useForm({
    resolver: yupResolver(schema),

    defaultValues: {
      applicability_of_revere_charge: "false", // Set default value to 'true'
    },
  });

  const [getOtherBillingById] = useGetOtherBillingByIdMutation();

  const fetchOtherBillingById = async (id) => {
    try {
      const response = await getOtherBillingById(id).unwrap();
      if (response?.status === 200) {
        console.log(response?.data);
        //setCommodityPullingMasterDetails(response?.data);
      }
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = methods;

  const [formData, setFormData] = useState({
    amount: "",
    tax_percentage: "0",
    cgst: "",
    cgst_amount: "",
    sgst_amount: "",
    tgst_amount: "",
    sgst: "",
    igst: "",
    final_amount: "",
  });

  const [selectBoxOptions, setSelectBoxOptions] = useState({
    regions: [],
    substate: [],
    districts: [],
    states: [],
    areas: [],
    warehouse: [],
    chamber: [],
  });

  const [selectClientBoxOptions, setSelectClientBoxOptions] = useState({
    regions: [],
    substate: [],
    districts: [],
    states: [],
    // areas: [],
    // warehouse: [],
    // chamber: [],
  });
  const details = location.state?.details;

  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);
  const [viewForm, setViewForm] = useState(false);

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

  const templateColumns = {
    base: "repeat(1, 1fr)",
    md: "repeat(3, 2fr)",
    lg: "repeat(3, 1fr)",
  };

  // calculations for cgst, sgst, igst

  const calculateGST_old = (options) => {
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    const { state_name, client_gst_state_name, newAmount, newTaxPercentage } =
      options;

    // state_name === client_gst_state_name cgst and sgst count else igst

    if (state_name === client_gst_state_name) {
      // Intra-state transaction
      cgstAmount = (newAmount * newTaxPercentage) / 2 / 100;
      sgstAmount = (newAmount * newTaxPercentage) / 2 / 100;
    } else {
      // Inter-state transaction
      igstAmount = (newAmount * newTaxPercentage) / 100;
    }

    const newFinalTotalAmount =
      newAmount + cgstAmount + sgstAmount + igstAmount;

    let calculatedObj = {
      tax_percentage: newTaxPercentage,
      cgst:
        getValues("state") === getValues("client_state")
          ? (newTaxPercentage / 2).toFixed(2)
          : "0.00",
      sgst:
        getValues("state") === getValues("client_state")
          ? (newTaxPercentage / 2).toFixed(2)
          : "0.00",
      igst:
        getValues("state") === getValues("client_state")
          ? "0.00"
          : newTaxPercentage.toFixed(2),
      cgst_amount: cgstAmount.toFixed(2),
      sgst_amount: sgstAmount.toFixed(2),
      tgst_amount: igstAmount.toFixed(2),
      final_amount: newFinalTotalAmount.toFixed(2),
      // cgst_amount: cgstAmount.toFixed(2),
    };

    setFormData((prev) => ({
      ...prev,
      ...calculatedObj,
    }));

    Object.keys(calculatedObj).forEach(function (key) {
      console.log(key);
      setValue(key, calculatedObj[key], { shouldValidate: true });
    });

    //return calculatedObj;
  };

  const calculateGST = (options) => {
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    const { state_name, client_gst_state_name, newAmount, newTaxPercentage } =
      options;

    if (state_name === client_gst_state_name) {
      // Intra-state transaction
      cgstAmount = (newAmount * newTaxPercentage) / 2 / 100;
      sgstAmount = (newAmount * newTaxPercentage) / 2 / 100;
    } else {
      // Inter-state transaction
      igstAmount = (newAmount * newTaxPercentage) / 100;
    }

    const newFinalTotalAmount =
      newAmount + cgstAmount + sgstAmount + igstAmount;

    let calculatedObj = {
      tax_percentage: newTaxPercentage,
      cgst:
        state_name === client_gst_state_name
          ? (newTaxPercentage / 2).toFixed(2)
          : "0.00",
      sgst:
        state_name === client_gst_state_name
          ? (newTaxPercentage / 2).toFixed(2)
          : "0.00",
      igst:
        state_name === client_gst_state_name
          ? "0.00"
          : newTaxPercentage.toFixed(2),
      cgst_amount: cgstAmount.toFixed(2),
      sgst_amount: sgstAmount.toFixed(2),
      tgst_amount: igstAmount.toFixed(2), // corrected property name
      final_amount: newFinalTotalAmount.toFixed(2),
    };

    setFormData((prev) => ({
      ...prev,
      ...calculatedObj,
    }));

    Object.keys(calculatedObj).forEach(function (key) {
      console.log(key);
      setValue(key, calculatedObj[key], { shouldValidate: true });
    });

    //return calculatedObj;
  };

  // Form Submit Function Start

  const onSubmit = (data) => {
    // Display alert to confirm the submission is triggered

    // Proceed with form data submission
    addData(data);

    // Log field values and errors
    console.log("Form data submitted:", data);

    if (Object.keys(errors).length > 0) {
      console.log("Form submission failed due to validation errors:");
      Object.keys(errors).forEach((key) => {
        console.log(`Field: ${key}, Error: ${errors[key].message}`);
        console.log(`Value: ${data[key]}`);
      });
    }
  };

  const [
    addOtherBillingDetails,
    { isLoading: addOtherBillingDetailsApiIsLoading },
  ] = usePostOtherBillingMutation();

  const addData = async (data) => {
    try {
      const response = await addOtherBillingDetails(data).unwrap();
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.OTHER_BILLING}`);
      }
    } catch (error) {
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        "Other Billing Adding is Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  const [allStates, setAllStates] = useState([]);
  const [fetchStateFree] = useGetStateFreeMasterMutation();

  const [getPbpmConfiguration] = useGetPbpmConfigurationMutation();

  const getStateList = async () => {
    try {
      const response = await getPbpmConfiguration().unwrap();
      console.log("getStateList", response);
      console.log(response?.data?.default_state?.gstn);

      if (response.status === 200) {
        console.log(response);
        setValue("go_green_gst", response?.data?.default_state?.gstn, {
          shouldValidate: true,
        });

        setValue("state_name", response?.data?.default_state?.state_name, {
          shouldValidate: true,
        });

        
        // let arr = response.data?.map((el) => ({
        //   label: el.state_name,
        //   value: el.id,
        // }));
        // console.log("~~~~~~~~~~~", arr);
        // setAllStates(arr, "hiiii");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // useEffect(() => {
  //   getStateList();
  // }, []);

  // location drill down api hook logic start .....
  const [
    fetchLocationDrillDown,
    { isLoading: fetchLocationDrillDownApiIsLoading },
  ] = useFetchLocationDrillDownFreeMutation();
  const [getWarehouseMaster, { isLoading: getWarehouseMasterApiIsLoading }] =
    useGetWareHouseFreeMutation();

  const [getChamberMaster, { isLoading: getChamberApiIsLoading }] =
    useGetChamberFreeMutation();

  const getRegionMasterList = async () => {
    try {
      const response = await fetchLocationDrillDown().unwrap();
      const arr = response?.region
        ?.filter((item) => item.region_name !== "ALL - Region")
        .map(({ region_name, id }) => ({
          label: region_name,
          value: id,
        }));
      setSelectBoxOptions((prev) => ({
        ...prev,
        regions:
          details?.region?.is_active === false
            ? [
                ...arr,
                {
                  label: details?.region?.region_name,
                  value: details?.region?.id,
                },
              ]
            : arr,
      }));
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

    setValue("substate", null, {
      shouldValidate: false,
    });

    setValue("district", null, {
      shouldValidate: false,
    });

    setValue("area", null, {
      shouldValidate: false,
    });

    const query = {
      region: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();

      const arr = response?.state
        ?.filter((item) => item.state_name !== "All - State")
        .map(({ state_name, id }) => ({
          label: state_name,
          value: id,
        }));

      setSelectBoxOptions((prev) => ({
        ...prev,
        states:
          details?.state?.is_active === false
            ? [
                ...arr,
                {
                  label: details?.state?.state_name,
                  value: details?.state?.id,
                },
              ]
            : arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const clientRegionOnChange = async (val) => {
    // console.log("value --> ", val);
    setValue("client_region", val?.value, {
      shouldValidate: true,
    });
    setValue("client_state", null, {
      shouldValidate: false,
    });

    setValue("client_substate", null, {
      shouldValidate: false,
    });

    setValue("client_district", null, {
      shouldValidate: false,
    });

    const query = {
      region: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();

      const arr = response?.state
        ?.filter((item) => item.state_name !== "All - State")
        .map(({ state_name, id }) => ({
          label: state_name,
          value: id,
        }));

      setSelectClientBoxOptions((prev) => ({
        ...prev,
        states:
          details?.state?.is_active === false
            ? [
                ...arr,
                {
                  label: details?.state?.state_name,
                  value: details?.state?.id,
                },
              ]
            : arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const stateOnChange = async (val) => {
    console.log("value --> ", val);
    setValue("state", val?.value, {
      shouldValidate: true,
    });

    setValue("substate", null, {
      shouldValidate: false,
    });

    setValue("district", null, {
      shouldValidate: false,
    });

    setValue("area", null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues("region"),
      state: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();
      // console.log("fetchLocationDrillDown response :", response);

      console.log(response?.substate);
      const arr = response?.substate
        ?.filter((item) => item.substate_name !== "All - Zone")
        .map(({ substate_name, id, state }) => ({
          label: substate_name,
          value: id,
          state_code: state.state_code,
          go_green_gst: state.gstn,
          state_id: state.id,
          state_name: state.state_name,
        }));

      let res = arr.filter((el) => el.state_id === val.value)[0];
      console.log("!!!!!!!!!", res);

      if (
        res.go_green_gst === "NO GST" ||
        res.go_green_gst === null ||
        res.go_green_gst === ""
      ) {
        getStateList();
      } else {
        setValue("go_green_gst", res.go_green_gst, {
          shouldValidate: true,
        });
      }

      setValue("state_code", res.state_code, {
        shouldValidate: true,
      });
      setValue("state_name", res.state_name, {
        shouldValidate: true,
      });
      setSelectBoxOptions((prev) => ({
        ...prev,
        substate:
          details?.substate?.is_active === false
            ? [
                ...arr,
                {
                  label: details?.substate?.substate_name,
                  value: details?.substate?.id,
                },
              ]
            : arr,
      }));

      const newTaxPercentage = parseFloat(formData.tax_percentage);
      const newAmount = parseFloat(formData.amount);

      let options = {
        state_name: getValues("state_name"),
        client_gst_state_name: getValues("client_gst_state_name"),
        newAmount,
        newTaxPercentage,
      };
      calculateGST(options);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const client_stateOnChange = async (val) => {
    // { label: 'MAHARASHTRA', value: 135 }
    // selectedClient
    console.log(val);
    console.log(selectedClient);

    let matchedData =
      selectedClient.office.filter((el) => el.state.id === val.value)[0] || [];

    console.log("matchedData", matchedData);
    if (matchedData.length === 0) {
      console.log("if");
      matchedData = selectedClient.office.filter(
        (el) => el.is_default === true
      )[0];
    }

    console.log("matchedData", matchedData);

    console.log("value --> ", val);
    setValue("client_state", val?.value, {
      shouldValidate: true,
    });

    setValue("client_substate", null, {
      shouldValidate: false,
    });

    setValue("client_district", null, {
      shouldValidate: false,
    });

    setValue("client_area", null, {
      shouldValidate: false,
    });

    setValue("client_gst_state_name", matchedData?.state?.state_name, {
      shouldValidate: false,
    });

    setValue("client_gst_number", matchedData?.gst_no, {
      shouldValidate: false,
    });
    setValue("client_address", matchedData?.office_address, {
      shouldValidate: true,
    });

    // setValue("client_pan_number", null, {
    //   shouldValidate: false,
    // });

    const query = {
      region: getValues("client_region"),
      state: val?.value,
    };

    console.log(val);

    console.log(selectBoxOptions.client);
    let selected_client_office_details = selectBoxOptions.client?.map((el) => {
      let office_arr = el.office;
      return office_arr.filter((el) => el.state.id === val.value);
    })[0];
    console.log(selected_client_office_details);
    // state:
    // console.log(selected_client_office_details?.[0]?.gst_no) || "";
    let officeAddress = selected_client_office_details?.[0]?.office_address;
    let gst_no = selected_client_office_details?.[0]?.gst_no;
    console.log("gst_no", gst_no);

    if (gst_no) {
      // setValue("client_gst_number", gst_no, { shouldValidate: true });
      // setValue("client_address", officeAddress, { shouldValidate: true });
      //    setValue("client_state",)
    } else {
      // selected_client_office_details

      let arr = selectBoxOptions.client?.map((el) => {
        let office_arr = el.office;
        return office_arr.filter((x) => x.is_default === true);
      })[0];

      const obj = arr?.[0];

      console.log(obj?.gst_no);
      console.log(obj?.office_address);

      // setValue("client_gst_number", obj?.gst_no, { shouldValidate: true });
      // setValue("client_address", obj?.office_address, { shouldValidate: true });

      console.log(arr);
    }

    try {
      const response = await fetchLocationDrillDown(query).unwrap();
      // console.log("fetchLocationDrillDown response :", response);

      console.log(response?.substate);
      const arr = response?.substate
        ?.filter((item) => item.substate_name !== "All - Zone")
        .map(({ substate_name, id, state }) => ({
          label: substate_name,
          value: id,
          state_code: state.state_code,
          state_id: state.id,
          client_gst_state_name: state.state_name,
        }));

      let res = arr.filter((el) => el.state_id === val.value)[0];
      // setValue("client_gst_state_name", res.client_gst_state_name, {
      //   shouldValidate: true,
      // });

      // let res = arr.filter((el) => el.state_id === val.value)[0];

      // setValue("state_code", res.state_code, {
      //   shouldValidate: true,
      // });
      setSelectClientBoxOptions((prev) => ({
        ...prev,
        substate:
          details?.substate?.is_active === false
            ? [
                ...arr,
                {
                  label: details?.substate?.substate_name,
                  value: details?.substate?.id,
                },
              ]
            : arr,
      }));

      const newTaxPercentage = parseFloat(formData.tax_percentage);
      const newAmount = parseFloat(formData.amount);

      let options = {
        state_name: getValues("state_name"),
        client_gst_state_name: getValues("client_gst_state_name"),
        newAmount,
        newTaxPercentage,
      };
      calculateGST(options);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const zoneOnChange = async (val) => {
    // console.log("value --> ", val);
    setValue("substate", val?.value, {
      shouldValidate: true,
    });

    setValue("district", null, {
      shouldValidate: false,
    });

    setValue("area", null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues("region"),
      state: getValues("state"),
      substate: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();
      // console.log("fetchLocationDrillDown response :", response);

      const arr = response?.district
        ?.filter((item) => item.district_name !== "All - District")
        .map(({ district_name, id }) => ({
          label: district_name,
          value: id,
        }));

      setSelectBoxOptions((prev) => ({
        ...prev,
        districts:
          details?.district?.is_active === false
            ? [
                ...arr,
                {
                  label: details?.district?.district_name,
                  value: details?.district?.id,
                },
              ]
            : arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const client_zoneOnChange = async (val) => {
    // console.log("value --> ", val);
    setValue("client_substate", val?.value, {
      shouldValidate: true,
    });

    setValue("client_district", null, {
      shouldValidate: false,
    });

    setValue("client_area", null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues("client_region"),
      state: getValues("client_state"),
      substate: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();
      // console.log("fetchLocationDrillDown response :", response);

      const arr = response?.district
        ?.filter((item) => item.district_name !== "All - District")
        .map(({ district_name, id }) => ({
          label: district_name,
          value: id,
        }));

      setSelectClientBoxOptions((prev) => ({
        ...prev,
        districts:
          details?.district?.is_active === false
            ? [
                ...arr,
                {
                  label: details?.district?.district_name,
                  value: details?.district?.id,
                },
              ]
            : arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const districtOnChange = async (val) => {
    // console.log("value --> ", val);
    setValue("district", val?.value, {
      shouldValidate: true,
    });

    setValue("area", null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues("region"),
      state: getValues("state"),
      substate: getValues("substate"),
      district: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();
      // console.log("fetchLocationDrillDown response :", response);

      const arr = response?.area
        ?.filter((item) => item.area_name !== "All - District")
        .map(({ area_name, id }) => ({
          label: area_name,
          value: id,
        }));
      // //
      setSelectBoxOptions((prev) => ({
        ...prev,
        areas:
          details?.area?.is_active === false
            ? [
                ...arr,
                {
                  label: details?.area?.area_name,
                  value: details?.area?.id,
                },
              ]
            : arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const areaOnChange = async (val) => {
    setValue("area", val?.value, {
      shouldValidate: true,
    });

    const query = {
      filter: "area__id",
      area__id: val?.value,
    };

    try {
      const response = await getWarehouseMaster(query).unwrap();
      console.log("Success:", response);

      if (response.status === 200) {
        // Filter the data based on is_block=false
        const unblockedData = response?.data?.filter((item) => !item?.is_block);

        // Map the filtered data to the warehouse array
        setSelectBoxOptions((prev) => ({
          ...prev,
          warehouse: unblockedData?.map(({ warehouse_name, id }) => ({
            label: warehouse_name,
            value: id,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // function // resetDropdownList(currentIndex) {
  //   for (let i = currentIndex + 1; i <= 10; i++) {
  //     setValue(`${DROP_DOWN_KEY_NAME_FOR_RESET[i]}`, "");
  //   }
  //   if (currentIndex !== 10) {
  //     resetTables();
  //   }
  // }
  useEffect(() => {
    getRegionMasterList();
  }, []);

  // Warehouse Master start

  //const getWarehouseMasterList = async () => {

  // useEffect(() => {
  //   getWarehouseMasterList();
  //   // eslint-disable-next-line
  // }, []);

  useEffect(() => {
    getChamberMasterList();
    // eslint-disable-next-line
  }, [getValues("warehouse")]);
  const today = new Date().toISOString().split("T")[0];

  // Warehouse Master end

  // Chamber Master start

  const getChamberMasterList = async () => {
    try {
      const response = await getChamberMaster().unwrap();
      // if (response.status === 200) {
      const chamberMasterArray = response?.data || response || [];
      setSelectBoxOptions((prev) => ({
        ...prev,
        chamber: chamberMasterArray?.map(
          ({ chamber_number, id, warehouse }) => ({
            label: chamber_number,
            value: id,
            warehouse: warehouse?.id,
          })
        ),
      }));
      // }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Client Master Start
  const [getClientMaster, { isLoading: getClientMasterApiIsLoading }] =
    useGetClientMasterFreeTypeMutation();

  const getClientMasterList = async () => {
    try {
      const response = await getClientMaster().unwrap();
      // "?filter=servicecontract__contractwarehousechamber__warehouse__id&servicecontract__contractwarehousechamber__warehouse__id=" +
      //   getValues("warehouse") +
      //   "&filter=servicecontract__contractwarehousechamber__chamber__id&servicecontract__contractwarehousechamber__chamber__id=" +
      //   getValues("chamber") +
      //   "&filter=servicecontract__status__status_code&servicecontract__status__status_code=6"
      console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          client: response?.data?.map(
            ({ name_of_client, kyc, office, id }) => ({
              label: name_of_client,
              value: id,
              pan_details: {
                number: kyc[0]?.document_number,
                id: kyc[0]?.id,
              },
              office: office,
            })
          ),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // useEffect(() => {
  //   if (getValues("warehouse") && getValues("chamber")) {
  //     getClientMasterList();
  //   }
  //   // eslint-disable-next-line
  // }, [getValues("warehouse"), getValues("chamber")]);

  useEffect(() => {
    getClientMasterList();

    // eslint-disable-next-line
  }, []);

  // Chamber Master end
  //

  // Commodity Master start

  const [getCommodityMaster, { isLoading: getCommodityMasterApiIsLoading }] =
    useGetCommodityFreeMasterMutation();

  const getCommodityMasterList = async () => {
    try {
      const response = await getCommodityMaster().unwrap();
      // "?filter=contractcommodity__service_contract__contractwarehousechamber__warehouse__id&contractcommodity__service_contract__contractwarehousechamber__warehouse__id=" +
      //   getValues("warehouse") +
      //   "&filter=contractcommodity__service_contract__contractwarehousechamber__chamber__id&contractcommodity__service_contract__contractwarehousechamber__chamber__id=" +
      //   getValues("chamber") +
      //   "&filter=contractcommodity__service_contract__client__id&contractcommodity__service_contract__client__id=" +
      //   getValues("client")
      console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          community: response?.data?.map(
            ({ commodity_name, id, quality_parameter }) => ({
              label: commodity_name,
              value: id,
              quality_parameter: quality_parameter,
            })
          ),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (getValues("warehouse") && getValues("chamber") && getValues("client")) {
      getCommodityMasterList();
    }
  }, [getValues("warehouse"), getValues("chamber"), getValues("client")]);

  // Commodity Master end

  //Edit Form Fill Logic Start
  useEffect(() => {
    setAddEditFormFieldsList(addEditFormFields);
    // if (details?.id) {
    //   detailsFill();
    // }

    // set breadcrumbArray
    const breadcrumbArray = [
      {
        title: "Other Billing",
        link: `${ROUTE_PATH.OTHER_BILLING}`,
      },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
  }, [details]);

  console.log("errors ---> ", errors);
  console.log("All form values  ---> ", getValues());

  //Edit Form Fill Logic End

  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "amount") {
      console.log(name);
      const newTaxPercentage = parseFloat(formData.tax_percentage);
      const newAmount = parseFloat(value);

      if (!isNaN(newTaxPercentage)) {
        let options = {
          state_name: getValues("state_name"),
          client_gst_state_name: getValues("client_gst_state_name"),
          newAmount,
          newTaxPercentage,
        };

        calculateGST(options);
      }
    }

    if (name === "tax_percentage") {
      console.log(name);
      const newTaxPercentage = parseFloat(value);
      const newAmount = parseFloat(formData.amount);

      if (!isNaN(newTaxPercentage)) {
        let options = {
          state_name: getValues("state_name"),
          client_gst_state_name: getValues("client_gst_state_name"),
          newAmount,
          newTaxPercentage,
        };

        calculateGST(options);
      }
    }
    
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });

  //   if (name === 'taxPercentage') {
  //     const newTaxPercentage = parseFloat(value);
  //     const newAmount = parseFloat(formData.amount);

  //     if (!isNaN(newTaxPercentage)) {
  //       const cgstAmount = (newAmount * (newTaxPercentage / 2)) / 100;
  //       const sgstAmount = (newAmount * (newTaxPercentage / 2)) / 100;
  //       const igstAmount = (newAmount * newTaxPercentage) / 100;
  //       const newFinalTotalAmount = newAmount + cgstAmount + sgstAmount;

  //       setFormData({
  //         ...formData,
  //         taxPercentage: newTaxPercentage,
  //         cgst: cgstAmount.toFixed(2),
  //         sgst: sgstAmount.toFixed(2),
  //         igst: igstAmount.toFixed(2),
  //         finalTotalAmount: newFinalTotalAmount.toFixed(2)
  //       });
  //     }
  //   }
  // };

  // const handleTaxPercentageChange = (e) => {
  //   const taxPercentage = parseFloat(e.target.value);
  //   const amount = parseFloat(getValues(backendKeys.amount));

  //   const cgstAmount = (amount * taxPercentage / 2) / 100;
  //   const sgstAmount = (amount * taxPercentage / 2) / 100;
  //   const igstAmount = (amount * taxPercentage) / 100;
  //   const finalTotalAmount = amount + cgstAmount + sgstAmount;

  //   // Update the autocalculated fields
  //   setValueLotForm(lot_details_schema.cgst, cgstAmount, { shouldValidate: true });
  //   setValueLotForm(lot_details_schema.sgst, sgstAmount, { shouldValidate: true });
  //   setValueLotForm(lot_details_schema.igst, igstAmount, { shouldValidate: true });
  //   setValueLotForm(lot_details_schema.final_total_amount, finalTotalAmount, { shouldValidate: true });
  // }

  useEffect(() => {
    if (details?.id) {
      fetchOtherBillingById(details?.id);
      setViewForm(location?.state?.view || false);
      regionOnChange({
        value: details?.region?.id,
      });
      stateOnChange({ value: details?.state?.id });
      zoneOnChange({ value: details?.substate?.id });
      districtOnChange({ value: details?.district?.id });
      areaOnChange({ value: details?.area?.id });

      clientRegionOnChange({ value: details?.client_region?.id });
      client_stateOnChange({ value: details?.client_state?.id });
      // client_zoneOnChange({value:details?.client_substate?.id})

      console.log("details", details);
      console.log(details.cgst_amount, "hii");
      let obj = {
        amount: details?.amount,
        invoice_no: details?.invoice_number,
        invoice_date: details?.invoice_date,
        region: details?.region?.id,
        state: details?.state?.id,
        state_code: details?.state?.state_code,
        substate: details?.substate?.id,
        district: details?.district?.id,
        area: details?.area?.id,
        final_amount: details?.final_amount,
        cgst_amount: details?.cgst_amount,
        warehouse: details?.warehouse?.id,
        chamber: details?.chamber?.id,
        client: details?.client?.id,
        client_pan_number: details?.client_pan_number,
        client_gst_number: details?.client_gst_number,
        client_region: details?.client_region?.id,
        client_state: details?.client_state?.id,
        client_address: details?.client_address,
        //client_substate:details?.client_substate?.id,
        //client_district:details?.client_district?.id,
        commodity: details?.commodity?.id,
        service_type: details?.service_type,
        hsn_code: details?.hsn_code,
        narration: details?.narration,

        tax_percentage: details?.tax_percentage,
        cgst: details?.cgst,
        // cgst_amount: details?.cgst_amount,
        sgst_amount: details?.sgst_amount,
        tgst_amount: details?.tgst_amount,
        sgst: details?.sgst,
        igst: details?.igst,
        // final_amount: details?.final_amount,

        //applicability_of_revere_charge: details?.applicability_of_revere_charge,
      };

      setFormData({
        amount: details?.amount,
        tax_percentage: details?.tax_percentage,
        cgst: details?.cgst,
        cgst_amount: details?.cgst_amount,
        sgst_amount: details?.sgst_amount,
        tgst_amount: details?.tgst_amount,
        sgst: details?.sgst,
        igst: details?.igst,
        final_amount: details?.final_amount,
      });

      // amount: "",
      // tax_percentage: "",
      // cgst: "",
      // cgst_amount: "",
      // sgst_amount: "",
      // tgst_amount: "",
      // sgst: "",
      // igst: "",
      // final_amount: "",

      console.log(obj);

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }
  }, []);

  // useEffect(() => {
  //   // getCommodityVarityList();
  //  // getCommodityMasterList();

  //   // console.log(details);

  //   if (details?.id) {
  //     fetchOtherBillingById(details?.id);
  //   }
  //   setViewForm(location?.state?.view || false);
  //   const breadcrumbArray = [
  //     // {
  //     //   title: "Manage Commodity",
  //     //   link: "/commodity-master/price-pulling-master",
  //     // },
  //     {
  //       title: "Commodity Price Pulling Master",
  //       link: `${ROUTE_PATH.ALL_MASTER_MANAGE_COMMODITY_PRICE_PULLING}`,
  //     },
  //     // {
  //     //   title: details?.id ? "Edit" : "Add",
  //     // },
  //   ];
  //   dispatch(setBreadCrumb(breadcrumbArray));
  //   // eslint-disable-next-line
  // }, [details]);

  return (
    <Box bg="white" borderRadius={10} maxHeight="calc(100vh - 250px)">
      <Box bg="white" borderRadius={10} p="10">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
              <Box>
                {/* invoice no */}
                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                    >
                      <Text textAlign="right">Invoice no</Text>
                      <Input
                        type="text"
                        border="1px"
                        borderColor="gray.10"
                        backgroundColor={"white"}
                        height={"15px "}
                        isDisabled={true}
                        borderRadius={"lg"}
                        value={getValues(backendKeys.invoice_no)}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Auto generate"
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>
                </Box>

                {/* invoice Date */}
                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt="10px"
                    >
                      <Text textAlign="right">Invoice Date</Text>
                      <Input
                        {...register(backendKeys?.invoice_date)}
                        type="date"
                        border="1px"
                        borderColor={
                          errors[backendKeys.invoice_date] ? "red" : "gray.10"
                        } // Check if there's an error for this field
                        backgroundColor={"white"}
                        height={"15px "}
                        borderRadius={"lg"}
                        isDisabled={viewForm}
                        defaultValue={today} // Set the default value to today's date
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Invoice Date"
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
                        Warehouse Region <span style={{ color: "red" }}>*</span>
                      </Text>
                      <ReactCustomSelect
                        // selectDisable={viewForm}
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
                        selectDisable={viewForm}
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
                        Warehouse State <span style={{ color: "red" }}>*</span>
                      </Text>
                      <ReactCustomSelect
                        // selectDisable={viewForm}
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
                        selectDisable={viewForm}
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

                {/* State code */}
                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt="10px"
                    >
                      <Text textAlign="right">State code</Text>
                      <Input
                        {...register("state_code")}
                        type="text"
                        border="1px"
                        borderColor="gray.10"
                        backgroundColor={"white"}
                        height={"15px "}
                        borderRadius={"lg"}
                        isDisabled={true}
                        //value={getValues(backendKeys.state_code)}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Auto Filled"
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>
                </Box>
                {/* Go Green GST Number */}
                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt="10px"
                    >
                      <Text textAlign="right">GO Green GST State</Text>
                      <Input
                        {...register("state_name")}
                        type="text"
                        border="1px"
                        borderColor="gray.10"
                        backgroundColor={"white"}
                        height={"15px "}
                        borderRadius={"lg"}
                        isDisabled={true}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Auto Filled"
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>
                </Box>

                {/* Go Green GST Number */}
                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt="10px"
                    >
                      <Text textAlign="right">GO Green GST Number</Text>
                      <Input
                        {...register("go_green_gst")}
                        type="text"
                        border="1px"
                        borderColor="gray.10"
                        backgroundColor={"white"}
                        height={"15px "}
                        borderRadius={"lg"}
                        isDisabled={true}
                        //value={getValues(backendKeys.state_code)}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Auto Filled"
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
                      <Text textAlign="right">Warehouse Sub State </Text>
                      <ReactCustomSelect
                        // selectDisable={viewForm}
                        name="substate"
                        label=""
                        selectDisable={viewForm}
                        isLoading={fetchLocationDrillDownApiIsLoading}
                        options={selectBoxOptions?.substate || []}
                        selectedValue={
                          selectBoxOptions?.substate?.filter(
                            (item) => item.value === getValues("substate")
                          )[0] || {}
                        }
                        isClearable={false}
                        selectType="label"
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                        handleOnChange={(val) => {
                          zoneOnChange(val);
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
                      <Text textAlign="right">Warehouse District </Text>{" "}
                      <ReactCustomSelect
                        //selectDisable={viewForm}
                        name="district"
                        label=""
                        selectDisable={viewForm}
                        isLoading={fetchLocationDrillDownApiIsLoading}
                        options={selectBoxOptions?.districts || []}
                        selectedValue={
                          selectBoxOptions?.districts?.filter(
                            (item) => item.value === getValues("district")
                          )[0] || {}
                        }
                        isClearable={false}
                        selectType="label"
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                        handleOnChange={(val) => {
                          districtOnChange(val);
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>{" "}
                </Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">Warehouse Area</Text>{" "}
                    <ReactCustomSelect
                      //  selectDisable={viewForm}
                      name="area"
                      label=""
                      selectDisable={viewForm}
                      isLoading={fetchLocationDrillDownApiIsLoading}
                      options={selectBoxOptions?.areas || []}
                      selectedValue={
                        selectBoxOptions?.areas?.filter(
                          (item) => item.value === getValues("area")
                        )[0] || {}
                      }
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        areaOnChange(val);
                      }}
                    />
                  </Grid>
                </MotionSlideUp>

                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt="10px"
                    >
                      <Text textAlign="right">Warehouse Name </Text>

                      <ReactCustomSelect
                        name="warehouse"
                        options={selectBoxOptions?.warehouse || []}
                        selectedValue={
                          selectBoxOptions?.warehouse?.filter(
                            (item) => item.value === getValues("warehouse")
                          )[0] || {}
                        }
                        selectDisable={viewForm}
                        //  selectDisable={isFormDisabled()}
                        isLoading={getWarehouseMasterApiIsLoading}
                        handleOnChange={(val) => {
                          setValue("warehouse", val.value, {
                            shouldValidate: true,
                          });
                          // console.log(
                          //   "weighbridge_name value:",
                          //   val.weighbridge_name
                          // );
                          // setValue(
                          //   "weighbridge_name",
                          //   val.weighbridge_name || "",
                          //   {
                          //     shouldValidate: !!val.weighbridge_name, // Set shouldValidate to false when the value is an empty string
                          //   }
                          // );
                          setValue("chamber", null, {
                            shouldValidate: true,
                          });
                          setValue("client", null, {
                            shouldValidate: true,
                          });
                          // setValue("commodity_variety", null, {
                          //   shouldValidate: true,
                          // });

                          // setValue("commodity", null, {
                          //   shouldValidate: true,
                          // });

                          // setValue("client", null, {
                          //   shouldValidate: true,
                          // });

                          // setValue(
                          //   "service_contract",
                          //   val.service_contract || "",
                          //   {
                          //     shouldValidate: !!val.service_contract, // Set shouldValidate to false when the value is an empty string
                          //   }
                          // );

                          // setValue("gate_pass_stack_details", [], {
                          //   shouldValidate: true,
                          // });
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
                      mt="10px"
                    >
                      <Text textAlign="right">Chamber Name </Text>

                      <ReactCustomSelect
                        name="chamber"
                        selectDisable={viewForm}
                        options={
                          selectBoxOptions?.chamber?.filter(
                            (item) => item.warehouse === getValues("warehouse")
                          ) || []
                        }
                        selectedValue={
                          selectBoxOptions?.chamber?.filter(
                            (item) => item.value === getValues("chamber")
                          )[0] || {}
                        }
                        //    selectDisable={isFormDisabled()}
                        isLoading={getChamberApiIsLoading}
                        handleOnChange={(val) => {
                          setValue("chamber", val.value, {
                            shouldValidate: true,
                          });
                          // setValue("client", null, {
                          //   shouldValidate: true,
                          // });

                          // setValue("commodity_variety", null, {
                          //   shouldValidate: true,
                          // });

                          // setValue("commodity", null, {
                          //   shouldValidate: true,
                          // });

                          // setValue(
                          //   "service_contract",
                          //   val.service_contract || "",
                          //   {
                          //     shouldValidate: !!val.service_contract, // Set shouldValidate to false when the value is an empty string
                          //   }
                          // );
                          // setValue("gate_pass_stack_details", [], {
                          //   shouldValidate: true,
                          // });
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
                      mt="10px"
                    >
                      <Text textAlign="right">
                        Client name{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>

                      <ReactCustomSelect
                        name="client"
                        options={selectBoxOptions?.client || []}
                        selectedValue={
                          selectBoxOptions?.client?.filter(
                            (item) => item.value === getValues("client")
                          )[0] || {}
                        }
                        selectDisable={viewForm}
                        // selectDisable={isFormDisabled()}
                        isLoading={getClientMasterApiIsLoading}
                        handleOnChange={(val) => {
                          setSelectedClient(val);
                          setValue("client_gst_number", "", {
                            shouldValidate: true,
                          });
                          console.log(val);
                          setValue("client", val.value, {
                            shouldValidate: true,
                          });
                          setValue("client_address", "", {
                            shouldValidate: true,
                          });

                          setValue("client_gst_state_name", "", {
                            shouldValidate: false,
                          });

                          setValue(
                            "client_pan_number",
                            val?.pan_details?.number,
                            {
                              shouldValidate: true,
                            }
                          );

                          setValue("commodity", "", {
                            shouldValidate: false,
                          });
                          setValue("client_region", "", {
                            shouldValidate: true,
                          });
                          setValue("client_state", "", {
                            shouldValidate: true,
                          });

                          // setValue("commodity_variety", null, {
                          //   shouldValidate: true,
                          // });

                          //  setValue(
                          //   "service_contract",
                          //   val.service_contract || "",
                          //   {
                          //     shouldValidate: !!val.service_contract, // Set shouldValidate to false when the value is an empty string
                          //   }
                          // );
                          // setValue("gate_pass_stack_details", [], {
                          //   shouldValidate: true,
                          // });
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>
                </Box>

                {/* Client's region */}
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Client's Region <span style={{ color: "red" }}>*</span>
                    </Text>

                    <ReactCustomSelect
                      name="client_region"
                      selectDisable={viewForm}
                      // options={selectBoxOptions?.chamber || []}
                      options={selectBoxOptions?.regions || []}
                      handleOnChange={(val) => {
                        clientRegionOnChange(val);
                        // resetDropdownList(7);
                      }}
                      selectedValue={
                        selectBoxOptions?.regions?.filter(
                          (item) => item.value === getValues("client_region")
                        )[0] || {}
                      }
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      // isLoading={getChamberApiIsLoading}
                    />
                  </Grid>
                </MotionSlideUp>

                {/* Client's State */}
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Client's State <span style={{ color: "red" }}>*</span>
                    </Text>

                    <ReactCustomSelect
                      name="client_state"
                      selectDisable={viewForm}
                      options={selectClientBoxOptions?.states || []}
                      handleOnChange={(val) => {
                        client_stateOnChange(val);
                      }}
                      selectedValue={
                        selectClientBoxOptions?.states?.filter(
                          (item) => item.value === getValues("client_state")
                        )[0] || {}
                      }
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      // isLoading={getChamberApiIsLoading}
                    />
                  </Grid>
                </MotionSlideUp>

                {/* Client's Sub State */}
                {/* <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Client's Sub State <span style={{ color: "red" }}>*</span>
                    </Text>

                    <ReactCustomSelect
                      name="client_substate"
                      selectDisable={viewForm}
                      options={selectClientBoxOptions?.substate || []}
                      handleOnChange={(val) => {
                        client_zoneOnChange(val);
                      }}
                      selectedValue={
                        selectClientBoxOptions?.substate?.filter(
                          (item) => item.value === getValues("client_substate")
                        )[0] || {}
                      }
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      // isLoading={getChamberApiIsLoading}
                    />
                  </Grid>
                </MotionSlideUp> */}

                {/* Client's District  */}
                {/* <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Client's District<span style={{ color: "red" }}>*</span>
                    </Text>

                    <ReactCustomSelect
                    name={"client_district"}
                    selectDisable={viewForm}
                      options={selectClientBoxOptions?.districts || []}
                      handleOnChange={(e) => {
                        setValue("client_district", e?.value, {
                          shouldValidate: true,
                        });
                      }}
                      selectedValue={
                        selectClientBoxOptions?.districts?.filter(
                          (item) => item.value === getValues("client_district")
                        )[0] || {}
                      }
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      // isLoading={getChamberApiIsLoading}
                    />
                  </Grid>
                </MotionSlideUp> */}
                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt="10px"
                    >
                      <Text textAlign="right">Client Address</Text>
                      <Textarea
                        {...register(backendKeys.client_address)}
                        type="text"
                        isDisabled={true}
                        border="1px"
                        borderColor={
                          errors[backendKeys.client_address] ? "red" : "gray.10"
                        } // Check if there's an error for this field
                        height={"15px "}
                        borderRadius={"lg"}
                        // value={getValues(backendKeys.narration)}
                        _placeholder={commonStyle.placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Client Address"
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>
                </Box>

                {/* Client’s PAN no*/}
                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt="10px"
                    >
                      <Text textAlign="right">Client’s PAN no</Text>
                      <Input
                        name="client_pan_number"
                        {...register("client_pan_number")}
                        type="text"
                        isDisabled={true}
                        border="1px"
                        borderColor={
                          errors["client_pan_number"] ? "red" : "gray.10"
                        }
                        backgroundColor={"white"}
                        height={"15px "}
                        borderRadius={"lg"}
                        // value={getValues(backendKeys.client_pan_card)}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Auto Filled"
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>
                </Box>

                {/*Client's GST STate */}
                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt="10px"
                    >
                      <Text textAlign="right">Client's GST State</Text>
                      <Input
                        {...register("client_gst_state_name")}
                        type="text"
                        border="1px"
                        borderColor="gray.10"
                        backgroundColor={"white"}
                        height={"15px "}
                        borderRadius={"lg"}
                        isDisabled={true}
                      //  value={"Maharastra"}
                        //value={getValues(backendKeys.state_code)}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Auto Filled"
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>
                </Box>

                {/* Client’s Gst no */}
                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt="10px"
                    >
                      <Text textAlign="right">Client’s Gst no</Text>
                      <Input
                        {...register("client_gst_number")}
                        name="client_gst_number"
                        type="text"
                        border="1px"
                        isDisabled={true}
                        borderColor="gray.10"
                        backgroundColor={"white"}
                        height={"15px "}
                        borderRadius={"lg"}
                        //value={getValues(backendKeys.client_gst_number)}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Auto Filled"
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>
                </Box>

                {/* Commodity Name*/}
                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt="10px"
                    >
                      <Text textAlign="right">Commodity name</Text>

                      <ReactCustomSelect
                        name="commodity"
                        selectDisable={viewForm}
                        options={selectBoxOptions?.community || []}
                        selectedValue={
                          selectBoxOptions?.community?.filter(
                            (item) => item.value === getValues("commodity")
                          )[0] || {}
                        }
                        //  selectDisable={isReadOnly}
                        isLoading={getCommodityMasterApiIsLoading}
                        handleOnChange={(val) => {
                          setValue("commodity", val.value, {
                            shouldValidate: true,
                          });
                          // setValue("commodity_variety", null, {
                          //   shouldValidate: true,
                          // });
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>
                </Box>

                {/*Service Type*/}
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Service Type<span style={{ color: "red" }}>*</span>
                    </Text>

                    <ReactCustomSelect
                      name="service_type"
                      selectDisable={viewForm}
                      options={allServiceOptions}
                      handleOnChange={(e) => {
                        setValue(backendKeys.service_type, e?.value, {
                          shouldValidate: true,
                        });
                      }}
                      selectedValue={
                        allServiceOptions.find(
                          (item) =>
                            item.value === getValues(backendKeys.service_type)
                        ) || {}
                      }
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                  </Grid>
                </MotionSlideUp>

                {/* Hsn/Sac Code */}
                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt="10px"
                    >
                      <Text textAlign="right">Hsn/Sac Code</Text>
                      <Input
                        {...register(backendKeys.hsn_code)}
                        type="text"
                        border="1px"
                        isDisabled={viewForm}
                        borderColor={
                          errors[backendKeys.hsn_code] ? "red" : "gray.10"
                        } // Check if there's an error for this field
                        backgroundColor={"white"}
                        height={"15px "}
                        borderRadius={"lg"}
                        //value={getValues(backendKeys.hsn_code)}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Hsn/Sac Code"
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>
                </Box>

                {/* Amount(Rs) */}
                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt="10px"
                    >
                      <Text textAlign="right">Amount(Rs)</Text>
                      <Input
                        {...register("amount")}
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        //                        onChange={(e) => {
                        //   handleChange(e);
                        //   setValue("taxPercentage", null, { shouldValidate: false });
                        //   console.log("Form data after setting taxPercentage:", getValues());
                        // }}
                        type="number"
                        isDisabled={viewForm}
                        border="1px"
                        borderColor={
                          errors[backendKeys.amount] ? "red" : "gray.10"
                        } // Check if there's an error for this field
                        backgroundColor={"white"}
                        height={"15px "}
                        borderRadius={"lg"}
                        //value={getValues(backendKeys.amount)}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Enter Amount(Rs)"
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>
                </Box>

                {/* Amount details* Form* ..................................*/}
                <FormProvider>
                  <form>
                    <Box
                      bgColor={"#DBFFF5"}
                      padding={"4"}
                      borderRadius={"md"}
                      mt="25px"
                    >
                      <Text fontWeight="bold" textAlign="left">
                        Amount Details*
                      </Text>
                      <Grid
                        templateColumns={{
                          base: "repeat(1, 1fr)",
                          md: "repeat(2, 1fr)",
                          lg: "repeat(2, 1fr)",
                          xl: "repeat(3,1fr)",
                        }}
                        spacing="5"
                        gap={5}
                        mt="10px"
                      >
                        {/* Tax Percentage */}
                        <FormControl>
                          <Text fontWeight="bold" textAlign="left">
                            Tax Percentage
                          </Text>
                          <Input
                            {...register("tax_percentage")}
                            name="tax_percentage"
                            value={formData.tax_percentage}
                            onChange={handleChange}
                            // name={[lot_details_schema.average_bag_size]}
                            // value={getValueLotForm(
                            //   lot_details_schema.average_bag_size
                            // )}
                            placeholder="Enter Tax Percentage"
                            type="text"
                            isDisabled={viewForm}
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}

                            // onChange={handleTaxPercentageChange}
                          />
                        </FormControl>

                        {/* CGST % */}
                        <FormControl>
                          <Text fontWeight="bold" textAlign="left">
                            CGST %
                          </Text>
                          <Input
                            // name={[lot_details_schema.remaining_bag_for_do]}
                            // value={getValueLotForm([
                            //   lot_details_schema.remaining_bag_for_do,
                            // ])}
                            {...register("cgst")}
                            name="cgst"
                            value={formData.cgst}
                            placeholder="Autocalculated"
                            isDisabled={true}
                            type="number"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            onChange={(e) => {
                              // setValueLotForm(
                              //   lot_details_schema.remaining_bag_for_do,
                              //   e.target.value,
                              //   { shouldValidate: true }
                              // );
                            }}
                          />
                        </FormControl>

                        {/* SGST % */}
                        <FormControl>
                          <Text fontWeight="bold" textAlign="left">
                            SGST %
                          </Text>
                          <Input
                            // name={[lot_details_schema.remaining_mt_for_do]}
                            // value={getValueLotForm([
                            //   lot_details_schema.remaining_mt_for_do,
                            // ])}
                            {...register("sgst")}
                            name="sgst"
                            value={formData.sgst}
                            placeholder="Autocalculated"
                            isDisabled={true}
                            type="number"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            onChange={(e) => {
                              // setValueLotForm(
                              //   lot_details_schema.remaining_mt_for_do,
                              //   e.target.value,
                              //   { shouldValidate: true }
                              // );
                            }}
                          />
                        </FormControl>

                        {/*IGST % */}
                        <FormControl>
                          <Text fontWeight="bold" textAlign="left">
                            IGST %
                          </Text>
                          <Input
                            // ])}
                            {...register("igst")}
                            name="igst"
                            value={formData.igst}
                            // name={[lot_details_schema.currently_removing_bag]}
                            placeholder="Autocalculated"
                            type="text"
                            border="1px"
                            // value={formData.igstPercentage}
                            isDisabled={true}
                            borderColor="gray.10"
                            // borderColor={
                            //   errorslotDetailsForm?.[
                            //     lot_details_schema.currently_removing_bag
                            //   ]
                            //     ? "red"
                            //     : "gray.10"
                            // }
                            backgroundColor={"white"}
                            // value={getValueLotForm([
                            //   lot_details_schema.currently_removing_bag,
                            // ])}
                            //

                            // onChange={(e) => {
                            //   setValueLotForm(
                            //     lot_details_schema.currently_removing_bag,
                            //     Number(e.target.value),
                            //     { shouldValidate: true }
                            //   );
                            //   // set the value of the currently removing mt = average bag * currently removing bag /1000 .....
                            //   setValueLotForm(
                            //     lot_details_schema.currently_removing_mt,
                            //     (getValueLotForm([
                            //       lot_details_schema.average_bag_size,
                            //     ]) *
                            //       Number(e.target.value)) /
                            //       1000,
                            //     { shouldValidate: true }
                            //   );
                            // }}
                          />
                        </FormControl>

                        {/* CGST amt  */}
                        <FormControl>
                          <Text fontWeight="bold" textAlign="left">
                            CGST amt
                          </Text>
                          <Input
                            {...register("cgst_amount")}
                            name="cgst_amount"
                            // name={[lot_details_schema.currently_removing_mt]}
                            // value={getValueLotForm([
                            //   lot_details_schema.currently_removing_mt,
                            // ])}
                            placeholder="Autocalculated"
                            value={formData.cgst_amount}
                            isDisabled={true}
                            type="text"
                            border="1px"
                            borderColor="gray.10"
                            // borderColor={
                            //   errorslotDetailsForm?.[
                            //     lot_details_schema.currently_removing_mt
                            //   ]
                            //     ? "red"
                            //     : "gray.10"
                            // }
                            backgroundColor={"white"}
                            onChange={(e) => {
                              // setValueLotForm(
                              //   lot_details_schema.currently_removing_mt,
                              //   e.target.value,
                              //   { shouldValidate: true }
                              // );
                            }}
                          />
                        </FormControl>

                        {/* SGST amt  */}
                        <FormControl>
                          <Text fontWeight="bold" textAlign="left">
                            SGST amt
                          </Text>
                          <Input
                            // name={[lot_details_schema.currently_removing_mt]}
                            // value={getValueLotForm([
                            //   lot_details_schema.currently_removing_mt,
                            // ])}
                            {...register("sgst_amount")}
                            name="sgst_amount"
                            placeholder="Autocalculated"
                            type="text"
                            isDisabled={true}
                            value={formData.sgst_amount}
                            border="1px"
                            borderColor="gray.10"
                            // borderColor={
                            //   errorslotDetailsForm?.[
                            //     lot_details_schema.currently_removing_mt
                            //   ]
                            //     ? "red"
                            //     : "gray.10"
                            // }
                            backgroundColor={"white"}
                            onChange={(e) => {
                              // setValueLotForm(
                              //   lot_details_schema.currently_removing_mt,
                              //   e.target.value,
                              //   { shouldValidate: true }
                              // );
                            }}
                          />
                        </FormControl>

                        {/* TGST amt */}
                        <FormControl>
                          <Text fontWeight="bold" textAlign="left">
                            IGST amt
                          </Text>
                          <Input
                            // name={[lot_details_schema.currently_removing_mt]}
                            // value={getValueLotForm([
                            //   lot_details_schema.currently_removing_mt,
                            // ])}
                            {...register("tgst_amount")}
                            name="tgst_amount"
                            placeholder="Autocalculated"
                            type="text"
                            isDisabled={true}
                            value={formData.tgst_amount}
                            border="1px"
                            borderColor="gray.10"
                            // borderColor={
                            //   errorslotDetailsForm?.[
                            //     lot_details_schema.currently_removing_mt
                            //   ]
                            //     ? "red"
                            //     : "gray.10"
                            // }
                            backgroundColor={"white"}
                            onChange={(e) => {
                              // setValueLotForm(
                              //   lot_details_schema.currently_removing_mt,
                              //   e.target.value,
                              //   { shouldValidate: true }
                              // );
                            }}
                          />
                        </FormControl>

                        {/* final Total amount */}
                        <FormControl>
                          <Text fontWeight="bold" textAlign="left">
                            final Total amount
                          </Text>
                          <Input
                            // name={[lot_details_schema.currently_removing_mt]}
                            // value={getValueLotForm([
                            //   lot_details_schema.currently_removing_mt,
                            // ])}
                            //  {...register("amount")}
                            // {...register("amount")}
                            // name="amount"

                            {...register("final_amount")}
                            name="final_amount"
                            value={formData.final_amount}
                            placeholder="Autocalculated"
                            type="text"
                            isDisabled={true}
                            border="1px"
                            borderColor="gray.10"
                            // borderColor={
                            //   errorslotDetailsForm?.[
                            //     lot_details_schema.currently_removing_mt
                            //   ]
                            //     ? "red"
                            //     : "gray.10"
                            // }
                            backgroundColor={"white"}
                            onChange={(e) => {
                              // setValueLotForm(
                              //   lot_details_schema.currently_removing_mt,
                              //   e.target.value,
                              //   { shouldValidate: true }
                              // );
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Box>
                  </form>
                </FormProvider>

                {/* Applicability of revere charge(y/n) */}
                <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right">
                      Applicability of revere charge(y/n)
                    </Text>{" "}
                  </GridItem>
                  <GridItem colSpan={{ base: 1 }}>
                    <FormControl style={{ w: commonWidth.w }}>
                      <RadioGroup
                        defaultValue="2"
                        isDisabled={viewForm}
                        value={getValues(
                          backendKeys.applicability_of_revere_charge
                        )}
                        name="applicability_of_revere_charge"
                        onChange={(e) => {
                          setValue(
                            backendKeys.applicability_of_revere_charge,
                            e,
                            {
                              shouldValidate: true,
                            }
                          );
                        }}
                      >
                        <Stack spacing={5} direction="row">
                          <Radio colorScheme="radioBoxPrimary" value="true">
                            Yes
                          </Radio>
                          <Radio colorScheme="radioBoxPrimary" value="false">
                            No
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                  </GridItem>
                </Grid>

                {/* Narration */}
                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt="10px"
                    >
                      <Text textAlign="right">
                        Narration<span style={{ color: "red" }}>*</span>
                      </Text>
                      <Textarea
                        {...register(backendKeys.narration)}
                        type="text"
                        isDisabled={viewForm}
                        border="1px"
                        borderColor={
                          errors[backendKeys.narration] ? "red" : "gray.10"
                        } // Check if there's an error for this field
                        height={"15px "}
                        borderRadius={"lg"}
                        // value={getValues(backendKeys.narration)}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Narration"
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                    </Grid>
                  </MotionSlideUp>
                </Box>

                {/* Submit button */}
              </Box>
              <Box
                display="flex"
                gap={2}
                justifyContent="flex-end"
                mt="10"
                px="0"
              >
                <Button
                  type="submit"
                  //w="full"
                  isLoading={addOtherBillingDetailsApiIsLoading}
                  isDisabled={viewForm}
                  // isDisabled={pageView}
                  backgroundColor={"primary.700"}
                  _hover={{ backgroundColor: "primary.700" }}
                  color={"white"}
                  borderRadius={"full"}
                  // my={"4"}
                  px={"10"}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Box>
  );
}

export default AddEditOtherBillingComponent;

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

// [
//   {
//     id: 405,
//     office_address: "sss",
//     email_addresses: "ss@gmail.com",
//     mobile_no: "+917219948671",
//     gst_no: "08AXKPK7581K1ZR",
//     upload_gst_certificate:
//       "media/docs/2023-2024/master/Warehouse Client Master/Screenshot from 2023-12-30 14-27-40_12:48:40.png",
//     is_default: true,
//     client: {
//       id: 167,
//       name_of_client: "GAURAV KUMAR",
//       client_type: "Retail",
//       name_of_company: "ARORA TRADING COMPANY /PILIBANGAN",
//       pan_card_type: "individual",
//       upload_pan_card: null,
//       mode_of_operations: "Any one can sign",
//       client_sourced_by: "GOGREEN",
//       authorised_person_name: null,
//       authorised_person_birth_date: null,
//       authorised_person_so_or_wo: null,
//       authorised_person_designation: null,
//       authorised_person_aadhaar_number: null,
//       authorised_person_upload_aadhaar_card: null,
//       authorised_person_pan_card_number: null,
//       l2_reasons: "",
//       l3_reasons: "",
//       is_active: true,
//       creation_date: "2024-02-08T12:11:06.146603+05:30",
//       last_update_date: "2024-02-14T15:28:54.249511+05:30",
//       authorised_person_upload_pan_card: null,
//       sales_person: 364,
//       constitution_of_client: 14,
//       l1_user: 364,
//       l2_user: 377,
//       l3_user: 390,
//       status: 57,
//       created_user: 364,
//       last_updated_user: 2,
//     },
//     state: {
//       id: 135,
//       state_name: "MAHARASHTRA",
//       state_code: "27",
//       tin_no: "AHMG08214D",
//       gstn: "27AACCF7185N1Z0",
//       nav_code: null,
//       state_india_office_addr:
//         "MOTHI UMARI, AWASTHI LAYOUT, NEAR DNYANDEEP CONVENT, UMRI, AKOLA, Mumbai, Maharashtra, 444005",
//       state_overhead: 10,
//       ho_overhead: 0,
//       is_active: true,
//       created_at: "2024-01-25",
//       updated_at: "2024-02-14",
//       region: 63,
//       created_user: 2,
//       last_updated_user: 2,
//     },
//     last_updated_user: {
//       id: 2,
//       employee_name: "Mayur",
//       phone: "+918306776883",
//       address: "sdfdsfdsf",
//       pin_code: 650012,
//       email: "admin@gmail.com",
//       password:
//         "pbkdf2_sha256$600000$pkHYeDFffFbitbclxYIScn$bUcH+MPZXqjgbdoVE+dWqOYewzIODOKT09/xRu1kHPU=",
//       employee_id: "2",
//       last_login: "2024-02-15T15:34:54.335162+05:30",
//       is_active: true,
//       created_at: "2023-06-09T11:39:10.712007+05:30",
//       updated_at: "2024-02-15T15:30:18.742453+05:30",
//       is_superuser: true,
//       is_staff: true,
//       fcm_token: "test",
//       last_working_date: "2023-11-15",
//       reporting_manager: 2,
//       designation: 1,
//       created_user: null,
//       last_updated_user: 2,
//       user_role:
//         Array(27)[
//           (125,
//           123,
//           122,
//           121,
//           119,
//           115,
//           107,
//           106,
//           105,
//           104,
//           103,
//           97,
//           96,
//           95,
//           78,
//           77,
//           76,
//           72,
//           71,
//           70,
//           67,
//           66,
//           59,
//           58,
//           32,
//           31,
//           4)
//         ],
//     },
//   },
// ];
