import React, { useEffect, useMemo, useState } from "react";
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
import * as yup from "yup";
import { BiEditAlt } from "react-icons/bi";
import { AiFillDelete, AiOutlineDelete } from "react-icons/ai";
import { useFetchLocationDrillDownFreeMutation } from "../../../features/warehouse-proposal.slice";
import ReactCustomSelect from "../../../components/Elements/CommonFielsElement/ReactCustomSelect";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { chamberDetailsSchema, schema } from "./fields";
import { useLocation, useNavigate } from "react-router-dom";
import FileUploadCmp from "../../../components/Elements/FileUploadCmp";
import {
  useAssignServiceContractMutation,
  useFetchBagWiseDetailsMutation,
  useGetAllClientsMutation,
  usePostServiceContractMutation,
  useUpdateServiceContractMutation,
  useGetServiceContractByIdMutation,
} from "../../../features/service-contract-api.slice";
import {
  useGetChamberFreeMutation,
  useGetWareHouseFreeMutation,
  useGetCommodityFreeMasterMutation,
  useGetBankMasterFreeMutation,
  useGetCommodityBagFreeMasterMutation,
} from "../../../features/master-api-slice";
import moment from "moment";
import { showToastByStatusCode } from "../../../services/showToastByStatusCode";
import {
  CommonToasterAlert,
  createQueryParams,
  scrollToElement,
} from "../../../services/common.service";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../../features/manage-breadcrumb.slice";
import DownloadFilesFromUrl from "../../../components/DownloadFileFromUrl";
import ROUTE_PATH from "../../../constants/ROUTE";
import { localStorageService } from "../../../services/localStorge.service";

const tableHeaders = [
  "Reservation Type",
  "Reservation MT",
  "Reservation Bag Size",
  "Reserved no of bags",
  "Start date",
  "End date",
  "pbpm rate",
  "Reservation Rate",
  "Billing cycle",
  "Action",
];

const Fumigation_by_go_green = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const insurance_by = [
  { value: "Go Green", label: "Go Green" },
  { value: "Client", label: "Client" },
  { value: "WH Owner", label: "WH Owner" },
  { value: "Bank", label: "Bank" },
];
const QC_charges_by_go_green = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];
const Excess_Billing_Cycle = [
  { value: "Daily", label: "Daily" },
  { value: "Weekly", label: "Weekly" },
  { value: "Fortnightly", label: "Fortnightly" },
  { value: "Monthly", label: "Monthly" },
];
const Storage_rate_on = [
  { value: "Bag", label: "Bag" },
  { value: "MT", label: "MT" },
];
const RESERVATION = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const Post_Reservation_Billing_Cycle = [
  { value: "Daily", label: "Daily" },
  { value: "Weekly", label: "Weekly" },
  { value: "Fortnightly", label: "Fortnightly" },
  { value: "Monthly", label: "Monthly" },
];

function isBagSizeAlreadyExists(obj, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i]?.bag_size?.value === obj?.bag_size?.value) {
      return true; // bag_size already exists
    }
  }
  return false; // bag_size does not exist
}

function isChamberNumberAlreadyExists(obj, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i]?.chamber?.value === obj?.chamber?.value) {
      return true; // chamber already exists
    }
  }
  return false; // chamber does not exist
}

const AddEditServiceContractPwh = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [details, setDetails] = useState(location.state?.details);
  // const pageView = location?.state?.view;
  const pageView = location?.state?.isViewOnly;
  //console.log("location: ", location);
  //  let details = location.state?.details;
  const isRenewingServiceContract =
    location.state?.isRenewingServiceContract || false;

  const [
    addServiceContractData,
    { isLoading: addServiceContractDataApiIsLoading },
  ] = usePostServiceContractMutation();

  const [
    updateServiceContractData,
    { isLoading: updateServiceContractDataApiIsLoading },
  ] = useUpdateServiceContractMutation();

  const [
    getCommodityBagFreeMaster,
    // { isLoading: getCommodityBagFreeMasterApiIsLoading },
  ] = useGetCommodityBagFreeMasterMutation();

  const [
    fetchBagWiseDetails,
    //  { isLoading: fetchBagWiseDetailsApiIsLoading }
  ] = useFetchBagWiseDetailsMutation();

  const [
    getServiceContractById,
    // { isLoading: getServiceContractByIdApiIsLoading },
  ] = useGetServiceContractByIdMutation();

  const methods = useForm({
    resolver: yupResolver(schema),
    // resolver: yupResolver(reservationDetailsSchema),
    mode: "onBlur", // Set the mode to onBlur
  });

  const {
    setValue,
    getValues,
    setError,
    clearErrors,
    unregister,
    register,
    watch,
    formState: { errors },
  } = methods;
  // end date should not less then start date
  // ! commmented the un used state variable ..
  // const [selectedOption1, setSelectedOption1] = useState(null);
  // const [selectedOption2, setSelectedOption2] = useState(null);
  // const [selectedOption3, setSelectedOption3] = useState(null);
  // const [lastEndDate, setLastEndDate] = useState(null);
  const [
    serviceContractSmallestStartDateState,
    setServiceContractSmallestStartDateState,
  ] = useState("");
  const [
    serviceContractSmallestEndDateState,
    setServiceContractSmallestEndDateState,
  ] = useState("");
  const [groupedReservationDetails, setGroupReservationDetails] = useState({});
  const [reservationDetailsArray, setReservationDetailsArray] = useState([]);
  const [showWarehoseExpiredMsg, setShowWarehoseExpiredMsg] = useState("");
  const [uploadedSignedServiceContract, setUploadedSignedServiceContract] =
    useState([]);

  const [firstTimeLoad, setFirstTimeLoad] = useState({ isFirstTimeLoad: true });
  const [clientOptions, setClientOptions] = useState([]);
  const [banksList, setBankList] = useState([]);
  // eslint-disable-next-line
  const [reservationDates, setReservationDates] = useState({
    startDate: "",
    endDate: "",
  });

  const [reservationDatesState, setReservationDatesState] = useState({
    Reservation: {
      startDate: "",
      endDate: "",
    },
    "Post Reservation": {
      startDate: "",
      endDate: "",
    },
  });

  const [isBagWiseDetailsEditState, setIsBagWiseDetailsEditState] = useState({
    isEdit: false,
    index: null,
  });
  const [bagWiseDetailsArray, setBagWiseDetailsArray] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [chamberOptions, setChamberOptions] = useState([]);
  const [commodityOptions, setCommodityOptions] = useState([]);
  const [reservationBagSizeList, setReservationBagSizeList] = useState([]);
  // eslint-disable-next-line
  const [fumigationOptions, setFumigationOptions] = useState(
    Fumigation_by_go_green
  );
  const [isDisabledReservationType, setIsDisabledReservationType] =
    useState(false);
  // eslint-disable-next-line
  const [insuranceByOptions, setInsuranceByOptions] = useState(insurance_by);
  // eslint-disable-next-line
  const [qcChargesOptions, setQcChargesOptions] = useState(
    QC_charges_by_go_green
  );
  // eslint-disable-next-line
  const [reservationBillingCycleOptions, setReservationBillingCycleOptions] =
    useState(Post_Reservation_Billing_Cycle);

  // Billing details
  // eslint-disable-next-line
  const [excessBillingCycleOptions, setExcessBillingCycleOptions] =
    useState(Excess_Billing_Cycle);
  // eslint-disable-next-line
  const [storageOnRateOptions, setStorageOnRateOptions] =
    useState(Storage_rate_on);
  // eslint-disable-next-line
  const [reservationOptions, setReservationOptions] = useState(RESERVATION);
  const [selectedReservationBillingCycle, setSelectedReservationBillingCycle] =
    useState({
      Reservation: "",
      "Post Reservation": "",
    });

  // No reservation groupedReservationDetails
  // eslint-disable-next-line
  const [contractCommodity, setContractCommodity] = useState([]);
  // eslint-disable-next-line
  const [reservationBillingCycle, setReservationBillingCycle] = useState({
    Reservation: {},
    "Post Reservation": {},
  });

  const [bagWiseRateDetails, setBagWiseRateDetails] = useState([]);
  const [warehousechamber, setWarehousechamber] = useState([]);
  const [reservationDetails, setReservationDetails] = useState([]);

  const [isChamberDetailsEditState, setIsChamberDetailsEditState] = useState({
    isEdit: false,
    index: null,
  });

  const [isReservationDetailsEditState, setIsReservationDetailsEditState] =
    useState({
      isEdit: false,
      index: null,
    });

  const [selectedDropDownValue, setSelectedDropDownValue] = useState({
    selectedClient: {},
    selectedWarehouseName: {},
    selectedChamber: {},
    selectedFumigation: {},
    selectedInsurance: {},
    selectedQcCharges: {},
    selectedExcessBillingCycle: {},
    selectedStorageRate: {},
    selectedReservation: {},
    selectedReservationBillingCycle: {},
    selected_reservation_type: {},
    selected_reservation_bag_size: {},
  });

  console.log("errors ====>", errors);
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

  // console.log("details-->", details);
  // Start the region state are substate district options
  const [selectBoxOptions, setSelectBoxOptions] = useState({
    regions: [],
    substate: [],
    districts: [],
    states: [],

    areas: [],
  });

  const [bagSizeList, setBagSizeList] = useState([]);

  const dropDownOnChange = (val, key, name) => {
    console.log(val);
    console.log(key);
    console.log(name);
    console.log("getvalue --> ", getValues());
    if (name === "insurance_by" && val.value === "Bank") {
      fetchAllBanks();
    }

    if (val?.value === "Bag" && name === "storage_rate_on") {
      // let query_params = `filter=contractcommodity__commodity__commodity_name&contractcommodity__commodity__commodity_name=${
      let query_params = `filter=commodity__commodity_name&commodity__commodity_name=${
        getValues("commodity")?.label
      }`;

      fetchAllBagSizeLists(query_params);
    }

    setSelectedDropDownValue((prev) => ({
      ...prev,
      [key]: val,
    }));

    setValue(name, val, {
      shouldValidate: true,
    });
  };

  const handleEndDateChange = (e) => {
    const startDateValue = new Date(
      // Assuming you have a similar input for start date, update this line
      document.querySelector('input[name="service_contract_start_date"]').value
    );

    console.log(e.target.value);
    // service_contract_billing_end_date
    console.log(startDateValue);
    const endDateValue = new Date(e.target.value);
    console.log(endDateValue);

    const d = moment(e.target.value).format("YYYY-MM-DD");
    setValue("service_contract_billing_end_date", d, {
      shouldValidate: true,
    });

    if (startDateValue && endDateValue < startDateValue) {
      setError("service_contract_end_date", {
        type: "custom",
        message: "End Date should not be less than Start Date",
      });
    } else {
      clearErrors("service_contract_end_date");
    }
  };

  // location drill down api hook
  const [
    fetchLocationDrillDown,
    { isLoading: fetchLocationDrillDownApiIsLoading },
  ] = useFetchLocationDrillDownFreeMutation();

  const [
    getAllClients,
    // { isLoading: getAllClientsApiIsLoading }
  ] = useGetAllClientsMutation();

  // Warehouse Master start

  const [
    getWarehouseMaster,
    // { isLoading: getWarehouseMasterApiIsLoading }
  ] = useGetWareHouseFreeMutation();

  const [
    getBankMasterFree,
    // { isLoading: banksApiIsLoading }
  ] = useGetBankMasterFreeMutation();

  const [
    getAllCommodity,
    // { isLoading: getAllCommodityApiIsLoading }
  ] = useGetCommodityFreeMasterMutation();

  const getWarehouseMasterList = async (queryParams) => {
    try {
      const response = await getWarehouseMaster(queryParams).unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        setWarehouseOptions(
          response?.data?.map(({ warehouse_name, id, total_rent_payable }) => ({
            label: warehouse_name,
            value: id,
            rent: total_rent_payable,
          }))
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchAllCommodity = async () => {
    try {
      const response = await getAllCommodity().unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        console.log(response);
        setCommodityOptions(
          response?.data?.map(({ commodity_name, id }) => ({
            label: commodity_name,
            value: id,
          }))
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Warehouse Master end

  // Chamber Master start

  const [
    getChamberMaster,
    // { isLoading: getChamberApiIsLoading }
  ] = useGetChamberFreeMutation();

  const getChamberMasterList = async (query) => {
    try {
      const response = await getChamberMaster(query).unwrap();
      if (response.status === 200) {
        setChamberOptions(
          response?.data?.map(({ chamber_number, id, warehouse }) => ({
            label: chamber_number,
            value: id,
            warehouse: warehouse?.id,
          }))
        );
        let expire_messaage = response.warehouse_agreement_info.message;
        if (response.status === 200) {
          setShowWarehoseExpiredMsg(expire_messaage);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      CommonToasterAlert(error);
    }
  };

  const fetchAllBanks = async () => {
    try {
      const response = await getBankMasterFree().unwrap();
      console.log("getRegionMasterList:", response);
      let arr = response?.results?.map(({ bank_name, id }) => ({
        label: bank_name,
        value: id,
      }));
      setBankList(arr);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getRegionMasterList = async () => {
    try {
      const response = await fetchLocationDrillDown().unwrap();
      console.log("getRegionMasterList:", response);
      setSelectBoxOptions((prev) => ({
        ...prev,
        regions: response?.region?.map(({ region_name, id }) => ({
          label: region_name,
          value: id,
        })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchAllClients = async () => {
    try {
      const response = await getAllClients().unwrap();
      let arr = response.data.map((el) => ({
        label: el.name_of_client,
        value: el.id,
      }));
      setClientOptions(arr);
      console.log("getRegionMasterList:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const regionOnChange = async (val) => {
    console.log("value --> ", val);
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
      setSelectBoxOptions((prev) => ({
        ...prev,
        states: response?.state
          ?.filter((item) => item.state_name !== "All - State")
          .map(({ state_name, id }) => ({
            label: state_name,
            value: id,
          })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const stateOnChange = async (val) => {
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
      setSelectBoxOptions((prev) => ({
        ...prev,
        substate: response?.substate
          ?.filter((item) => item.substate_name !== "All - Zone")
          .map(({ substate_name, id }) => ({
            label: substate_name,
            value: id,
          })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const zoneOnChange = async (val) => {
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
      setSelectBoxOptions((prev) => ({
        ...prev,
        districts: response?.district
          ?.filter((item) => item.district_name !== "All - District")
          .map(({ district_name, id }) => ({
            label: district_name,
            value: id,
          })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const districtOnChange = async (val) => {
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
      setSelectBoxOptions((prev) => ({
        ...prev,
        areas: response?.area
          ?.filter((item) => item.area_name !== "All - District")
          .map(({ area_name, id }) => ({
            label: area_name,
            value: id,
          })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const areaOnChange = (val) => {
    setValue("area", val?.value, {
      shouldValidate: true,
    });
  };
  // Region State  Zone District Area  onChange drill down api end //

  // CHAMBERS ALL METHODS START HERE //

  const fetchAllBagSizeLists = async (params) => {
    try {
      const response = await getCommodityBagFreeMaster(params).unwrap();
      if (response.status === 200) {
        console.log("Fetching all -->", response);
        let arr = response?.data
          ?.filter((item) => item.is_active)
          ?.map((el) => ({
            label: el.bag_size,
            value: el.id,
          }));
        setBagSizeList(arr);
      }
    } catch (error) {
      toasterAlert(error);
    }
  };

  const checkPbpm = async () => {
    let id = warehousechamber?.[0]?.warehouse?.value;
    let query = {
      id: id,
      bag_size: getValues("bag_size")?.label,
    };

    try {
      const response = await fetchBagWiseDetails(query).unwrap();
      if (response?.status === 200) {
        if (response?.data && response?.data.length > 0) {
          let pbpm_rate = response?.data?.[0]?.storage_rate;

          setValue("pbpm_rate", pbpm_rate?.toFixed(2), {
            shouldValidate: true,
          });
        } else {
          showToastByStatusCode(400, "PBPM rate not found");
          setValue("pbpm_rate", "2023", { shouldValidate: true });
        }
      } else {
        showToastByStatusCode(400, "PBPM rate not found");
        setValue("pbpm_rate", "2023", { shouldValidate: true });
      }
    } catch (error) {
      setValue("pbpm_rate", "2023", { shouldValidate: true }); // is temporary line
      CommonToasterAlert(error);
    }
  };

  const fetchServiceContractById = async (id) => {
    try {
      const response = await getServiceContractById(id).unwrap();
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const addUpdateChamber = () => {
    const data = getValues();

    const details = {
      warehouse: data?.warehouse,
      chamber: data?.chamber,
    };

    const copy_mainArr = [...warehousechamber];

    const { index, isEdit } = isChamberDetailsEditState;

    try {
      toValidateChamberDetailsSchema(details);
      console.log("Data is valid.", details);
      console.log(warehousechamber);
      setWarehouseOptions([data?.warehouse]);

      const chamberExistsInMainArr = isChamberNumberAlreadyExists(
        details,
        warehousechamber
      );
      const chamberExistsInCopyArr = isChamberNumberAlreadyExists(
        details,
        copy_mainArr
      );

      if (isEdit && index >= 0 && index < warehousechamber.length) {
        // In edit mode and the edited index exists
        if (chamberExistsInMainArr) {
          if (
            warehousechamber[index]?.chamber?.value === details?.chamber?.value
          ) {
            // The doc_type remains the same, update the existing entry in the main kyc array
            const updatedArr = [...warehousechamber];
            updatedArr[index] = details;

            setWarehousechamber(updatedArr);
          } else {
            // The doc_type has changed, check if it exists in the copy array
            if (chamberExistsInCopyArr) {
              showToastByStatusCode(400, "Chamber already exists");
            } else {
              // Update the existing entry in the main kyc array with the new doc_type
              const updatedArr = [...warehousechamber];
              updatedArr[index] = details;
              //setIsKycFormDirty(false);
              setWarehousechamber(updatedArr);
            }
          }
        } else {
          showToastByStatusCode(400, "Chamber type not found.");
        }
      } else {
        // Not in edit mode or index is out of bounds
        if (chamberExistsInCopyArr) {
          showToastByStatusCode(400, "Chamber already exists");
        } else {
          setWarehousechamber([...warehousechamber, details]);
        }
      }

      clearChamberDetailsForm(details);

      setIsChamberDetailsEditState({
        isEdit: false,
        index: null,
      });

      // ---------------------------------------------------------
    } catch (validationErrors) {
      Object.keys(validationErrors).forEach((key) => {
        setError(key, {
          type: "manual",
          message: validationErrors[key] || "",
        });
      });
      return false;
    }
    setShowWarehoseExpiredMsg("");
  };

  const chamberDetailsOnEdit = (item, i) => {
    setIsChamberDetailsEditState({
      isEdit: true,
      index: i,
    });
    Object.keys(item).forEach((key) => {
      setValue(key, item[key], {
        shouldValidate: false,
      });
      setSelectedDropDownValue((prev) => ({
        ...prev,
        selectedWarehouseName: item.warehouse,
        selectedChamber: item.chamber,
      }));
    });
  };

  const deleteChamberDetails = (index) => {
    let indexToRemove = index;
    // console.log("warehousechamber length -->", warehousechamber.length);
    if (indexToRemove >= 0 && indexToRemove < warehousechamber.length) {
      // eslint-disable-next-line
      let x = warehousechamber.splice(indexToRemove, 1);
      setWarehousechamber([...warehousechamber]);
      clearChamberDetailsForm();
    }

    if (index === 0) {
      let selected_area_obj =
        selectBoxOptions?.areas?.filter(
          (item) => item.value === getValues("area")
        )[0] || {};
      const filters = [
        {
          filter: "warehouse_type",
          value: "PWH",
        },
        {
          filter: "area",
          value: selected_area_obj?.label,
        },
      ];
      let query = createQueryParams(filters);
      getWarehouseMasterList(query);
    }
  };

  const clearChamberDetailsForm = () => {
    const obj = {
      warehouse: "",
      chamber: "",
    };
    Object.keys(obj).forEach((key) => {
      setValue(key, "", {
        shouldValidate: false,
      });
    });
    setSelectedDropDownValue((prev) => ({
      ...prev,
      selectedWarehouseName: {},
      selectedChamber: {},
    }));
  };

  // CHAMBERS ALL METHODS END HERE //

  // Bag wise rate details all methods start here

  const addUpdateBagWiseRate = () => {
    const formData = getValues();
    const obj = {
      bag_size: formData?.bag_size,
      pbpm_rate: formData?.pbpm_rate || "2023",
      rate: formData?.rate || "",
    };
    try {
      validateBagWiseRateDetailsFormData(obj);
    } catch (error) {
      Object.keys(error).forEach((key) => {
        setError(key, {
          type: "manual",
          message:
            key === "pbpm_rate"
              ? "Click on 'Check PBPM button' to auto filled PBPM rate"
              : error[key] || "",
        });
      });
      return false;
    }

    const copy_mainArr = [...bagWiseDetailsArray];

    const isEditing = isBagWiseDetailsEditState?.isEdit;
    const editedIndex = isBagWiseDetailsEditState?.index;

    const stateExistsInMainArr = isBagSizeAlreadyExists(
      obj,
      bagWiseDetailsArray
    );
    const stateExistsInCopyArr = isBagSizeAlreadyExists(obj, copy_mainArr);

    console.log(bagWiseDetailsArray);
    if (
      isEditing &&
      editedIndex >= 0 &&
      editedIndex < bagWiseDetailsArray.length
    ) {
      // In edit mode and the edited index exists
      if (stateExistsInMainArr) {
        if (
          bagWiseDetailsArray[editedIndex]?.bag_size?.label ===
          obj?.bag_size?.label
        ) {
          // The doc_type remains the same, update the existing entry in the main kyc array
          const updatedArr = [...bagWiseDetailsArray];
          updatedArr[editedIndex] = obj;
          setReservationBagSizeList((prev) => [...prev, obj?.bag_size]);

          setBagWiseDetailsArray(updatedArr);
          clearErrors(["bag_size", "pbpm_rate", "rate"]);
        } else {
          // The doc_type has changed, check if it exists in the copy array
          if (stateExistsInCopyArr) {
            showToastByStatusCode(400, "Bag size already exists");
          } else {
            // Update the existing entry in the main kyc array with the new doc_type
            const updatedArr = [...bagWiseDetailsArray];
            updatedArr[editedIndex] = obj;
            //setIsKycFormDirty(false);
            setReservationBagSizeList((prev) => [...prev, obj?.bag_size]);

            setBagWiseDetailsArray(updatedArr);
            clearErrors(["bag_size", "pbpm_rate", "rate"]);
          }
        }
      } else {
        showToastByStatusCode(400, "Bag size not found.");
      }
    } else {
      // Not in edit mode or index is out of bounds
      if (stateExistsInCopyArr) {
        showToastByStatusCode(400, "Bag size already exists");
      } else {
        setReservationBagSizeList((prev) => [...prev, obj?.bag_size]);

        setBagWiseDetailsArray([...bagWiseDetailsArray, obj]);
        clearErrors(["bag_size", "pbpm_rate", "rate"]);
      }
    }

    setIsBagWiseDetailsEditState({
      isEdit: false,
      index: null,
    });

    clearBagWiseRateDetailsForm();
  };

  const bagWiseRateDetailsOnEdit = (item, i) => {
    setIsBagWiseDetailsEditState({
      isEdit: true,
      index: i,
    });

    Object.keys(item).forEach((key) => {
      setValue(key, item[key], {
        shouldValidate: false,
      });
    });
  };

  const deleteBagWiseRateDetails = (index) => {
    let indexToRemove = index;

    if (indexToRemove >= 0 && indexToRemove < bagWiseDetailsArray.length) {
      bagWiseDetailsArray.splice(indexToRemove, 1);
      const arr = bagWiseDetailsArray?.map((el) => el?.bag_size);
      setReservationBagSizeList(arr);
      setBagWiseDetailsArray([...bagWiseDetailsArray]);
      clearBagWiseRateDetailsForm();
    }
  };

  const deleteFile = (ind) => {
    const isDisabled = InputDisableFunction();
    if (isDisabled) {
      return false;
    }

    let indexToRemove = ind;

    if (
      indexToRemove > 0 &&
      indexToRemove < uploadedSignedServiceContract.length
    ) {
      uploadedSignedServiceContract.splice(indexToRemove, 1);
      setUploadedSignedServiceContract([...uploadedSignedServiceContract]);
    } else {
      setUploadedSignedServiceContract([]);
      setValue("upload_signed_service_contract", "", {
        shouldValidate: true,
      });
    }
    clearBagWiseRateDetailsForm();

    //uploadedSignedServiceContract
  };

  const clearBagWiseRateDetailsForm = () => {
    const obj = {
      bag_size: "",
      pbpm_rate: "",
      rate: "",
    };

    Object.keys(obj).forEach((key) => {
      setValue(key, "", {
        shouldValidate: false,
      });
    });

    setIsBagWiseDetailsEditState({
      isEdit: false,
      index: null,
    });
  };

  const reservationDetailsStartDateMin = () => {
    let minDate = moment().format("DD-MM-YYYY");
    const storage_rate_on = getValues("storage_rate_on");
    if (storage_rate_on?.value === "MT") {
      minDate = reservationDatesState?.["Reservation"]?.endDate
        ? moment(reservationDatesState?.["Reservation"]?.endDate)
            .add(1, "days")
            .format("DD-MM-YYYY")
        : moment().format("DD-MM-YYYY");
    }

    return minDate;
  };

  const reservationDetailsStartDateMax = () => {
    let maxDate = "";
    const storage_rate_on = getValues("storage_rate_on");
    if (storage_rate_on?.value === "MT") {
      maxDate = moment(reservationDatesState?.["Reservation"]?.endDate)
        .add(1, "days")
        .format("DD-MM-YYYY");
    }
    return maxDate;
  };

  const addUpdateReservation = () => {
    const data = getValues();
    setFirstTimeLoad({
      isFirstTimeLoad: false,
    });
    const storage_rate_on = data?.storage_rate_on;
    let obj = {
      reservation_type: data?.reservation_type,
      storage_rate_on: data?.storage_rate_on,
      reservation_storage_rate_mt: data?.reservation_storage_rate_mt,
      reservation_bag_size: data?.reservation_bag_size || "",
      reserved_no_of_bags: data?.reserved_no_of_bags || "",
    };

    let extra_fields = {};

    if (
      obj?.storage_rate_on?.value === "Bag" &&
      obj?.reservation_type?.value === "Reservation" &&
      (obj?.reservation_bag_size === "" || obj?.reserved_no_of_bags === "")
    ) {
      if (obj?.reservation_bag_size === "") {
        setError("reservation_bag_size", {
          type: "manual",
          message: "", // You can customize the error message here
        });
      }

      if (obj?.reserved_no_of_bags === "") {
        setError("reserved_no_of_bags", {
          type: "manual",
          message: "", // You can customize the error message here
        });
      }

      return false;
    } else {
      extra_fields = {
        reservation_bag_size: obj?.reservation_bag_size,
        reserved_no_of_bags: obj?.reserved_no_of_bags,
      };
      clearErrors(["reservation_bag_size", "reserved_no_of_bags"]);
    }

    // On MT
    if (
      obj?.storage_rate_on?.value === "MT" &&
      obj?.reservation_type?.value === "Reservation" &&
      data?.reservation_storage_rate_mt === ""
    ) {
      setError("reservation_storage_rate_mt", {
        type: "manual",
        message: "", // You can customize the error message here
      });
      return false;
    } else {
      extra_fields = {
        reservation_storage_rate_mt: obj?.reservation_storage_rate_mt,
      };
      clearErrors(["reservation_storage_rate_mt"]);
    }

    const details = {
      reservation_type: data?.reservation_type || { label: "", value: "" },

      reservation_start_date: data?.reservation_start_date,
      reservation_end_date: data?.reservation_end_date,
      reservation_pbpm_rate: parseFloat(data?.reservation_pbpm_rate),
      reservation_rate: parseFloat(data?.reservation_rate),
      reservation_billing_cycle: data?.reservation_billing_cycle || {
        label: "",
        value: "",
      },
    };

    const check_obj = {
      ...details,
      ...obj,
    };

    const { index, isEdit } = isReservationDetailsEditState;

    try {
      validateReservationDetailsFormData(details);
      const updatedReservationDetailsList = [...reservationDetailsArray];

      if (isEdit) {
        updatedReservationDetailsList.splice(index, 1);
      }

      // check_obj?.storage_rate_on?.value === "Bag" &&
      if (updatedReservationDetailsList.length > 0) {
        const isValidDate = checkDateRangeOverlap(
          check_obj,
          updatedReservationDetailsList
        );
        if (!isValidDate) {
          let msg =
            check_obj?.storage_rate_on?.value === "Bag"
              ? "You have already entered one record for reservation rate for same bag size and same period(Start date-End date)"
              : "You have already entered one record for reservation rate for same period(Start date-End date)";
          showToastByStatusCode(400, msg);
          return false;
        }
      }

      const form_data_obj = {
        ...details,
        reservation_storage_rate_mt: data?.reservation_storage_rate_mt,
        reservation_bag_size: data?.reservation_bag_size,
        reserved_no_of_bags: data?.reserved_no_of_bags,
      };

      const updatedGroupDetails = { ...groupedReservationDetails };

      const group = form_data_obj.reservation_type.value;

      if (isEdit) {
        setReservationDates({
          startDate: "",
          endDate: form_data_obj?.reservation_end_date,
        });

        setReservationDatesState({
          Reservation: {
            startDate: "",
            endDate: form_data_obj?.reservation_end_date,
          },
        });

        setSelectedReservationBillingCycle((prev) => ({
          ...prev,
          [group]: form_data_obj?.reservation_billing_cycle?.value,
        }));

        const updatedReservationDetails_array = [...reservationDetailsArray];
        updatedReservationDetails_array.splice(index, 1);
        const updatedArray = [
          ...updatedReservationDetails_array,
          form_data_obj,
        ];
        const total = reservationDetailsArray?.length || 0;
        const lastItemDetails = reservationDetailsArray[total - 1];
        setReservationDatesState(() => ({
          Reservation: {
            startDate: lastItemDetails?.reservation_start_date,
            endDate: lastItemDetails?.reservation_end_date,
          },
        }));
        console.log("updatedArray", updatedArray);
        setReservationDetailsArray([...updatedArray]);
        setIsDisabledReservationType(false);
        clearReservationDetailsForm();
      } else {
        setSelectedReservationBillingCycle((prev) => ({
          ...prev,
          [group]: form_data_obj?.reservation_billing_cycle?.value,
        }));
        setReservationDates({
          startDate: "",
          endDate: form_data_obj.reservation_end_date,
        });

        setReservationDetailsArray((prev) => [...prev, form_data_obj]);

        setIsDisabledReservationType(false);
        clearReservationDetailsForm();
        setReservationDatesState(() => ({
          Reservation: {
            startDate: form_data_obj?.reservation_start_date,
            endDate: form_data_obj?.reservation_end_date,
          },
        }));
      }

      // -------------------------------

      setReservationBillingCycle((prev) => ({
        ...prev,
        [group]: form_data_obj?.reservation_billing_cycle?.value,
      }));

      // ****************************************************

      setIsReservationDetailsEditState({
        isEdit: false,
        index: null,
      });
    } catch (validationErrors) {
      console.log("validationErrors", validationErrors);
      Object.keys(validationErrors).forEach((key) => {
        setError(key, {
          type: "manual",
          message: validationErrors[key] || "",
        });
      });
      return false;
    }
  };

  useMemo(() => {
    if (reservationDetailsArray?.length) {
      const smallestDatesArray = reservationDetailsArray?.map(
        (el) => el?.reservation_start_date
      );

      const smallMomentDates = smallestDatesArray?.map((date) => moment(date));
      const smallestDate = moment.min(smallMomentDates);
      const formattedSmallestDate = smallestDate.format("YYYY-MM-DD");
      console.log(formattedSmallestDate);
      setServiceContractSmallestStartDateState(formattedSmallestDate);
      if (!firstTimeLoad?.isFirstTimeLoad) {
        setValue("service_contract_start_date", formattedSmallestDate, {
          shouldValidate: true,
        });
      }

      const dateArray = reservationDetailsArray?.map(
        (el) => el?.reservation_end_date
      );

      const momentDates = dateArray?.map((date) => moment(date));
      const biggestDate = moment.max(momentDates);
      const formattedBiggestDate = biggestDate.format("YYYY-MM-DD");
      setServiceContractSmallestEndDateState(formattedBiggestDate);
      console.log(formattedBiggestDate);
      setValue("service_contract_end_date", formattedBiggestDate, {
        shouldValidate: true,
      });
      // setValue("service_contract_end_date", formattedBiggestDate, {
      //   shouldValidate: true,
      // });
      // serviceContractSmallestEndDateState
    }
  }, [reservationDetailsArray]);

  const reservationDetailsOnEdit = (item, i) => {
    let obj = {};
    if (i === 0) {
      obj = reservationDetailsArray[0];
    } else {
      obj = reservationDetailsArray[i - 1];
    }
    setIsDisabledReservationType(true);
    setIsReservationDetailsEditState({
      isEdit: true,
      index: i,
    });

    setReservationDatesState({
      Reservation: {
        startDate: obj.reservation_start_date,
        endDate: obj.reservation_end_date,
      },
    });

    setSelectedDropDownValue((prev) => ({
      ...prev,
      selectedReservationBillingCycle: item?.reservation_billing_cycle,
      selected_reservation_type: item?.reservation_type,
      selected_reservation_bag_size: item?.reservation_bag_size,
    }));

    Object.keys(item).forEach((key) => {
      setValue(key, item[key], {
        shouldValidate: true,
      });
    });
  };

  const deleteReservationDetails = (index) => {
    setIsDisabledReservationType(false);
    let obj = {};

    if (index === 0) {
      obj = reservationDetailsArray[0];
      setReservationDatesState({
        Reservation: {
          startDate: moment().format("DD-MM-YYYY"),
          endDate: "",
        },
      });
    } else {
      obj = reservationDetailsArray[index - 1];
      setReservationDatesState({
        Reservation: {
          startDate: obj?.reservation_start_date,
          endDate: obj?.reservation_end_date,
        },
      });
    }

    const updatedReservationDetailsArray = [...reservationDetailsArray];
    updatedReservationDetailsArray.splice(index, 1);

    // Set the state with the updated array
    setReservationDetailsArray(updatedReservationDetailsArray);
    setIsReservationDetailsEditState({
      isEdit: false,
      index: null,
    });
    clearReservationDetailsForm();
  };

  const clearReservationDetailsForm = () => {
    const obj = {
      reservation_type: "",

      reservation_storage_rate_mt: "",
      reservation_bag_size: "",
      reserved_no_of_bags: "",

      reservation_start_date: "",
      reservation_end_date: "",
      reservation_pbpm_rate: "",
      reservation_rate: "",
      reservation_billing_cycle: "",
    };

    setSelectedDropDownValue((prev) => ({
      ...prev,
      selectedReservationBillingCycle: {},
      selected_reservation_type: {},
      selected_reservation_bag_size: {},
    }));

    Object.keys(obj).forEach((key) => {
      setValue(key, "", {
        shouldValidate: false,
      });
    });
    setIsDisabledReservationType(false);
  };

  // RESERVATION ALL METHODS END HERE //

  const handleFileChange = (url, name) => {
    setValue(name, url, { shouldValidate: true });
  };

  // form onsubmit method
  const onSubmit = (data) => {
    const currentDate = moment();
    const inputDate = moment(data?.service_contract_start_date);

    // if (!inputDate.isSameOrAfter(currentDate, "day")) {
    //   showToastByStatusCode(
    //     400,
    //     "The service contract start date must be equal to or greater than the current date."
    //   );
    //   return false;
    // }

    let selectedReservation = selectedDropDownValue?.selectedReservation;

    // Insurance By

    if (
      selectedDropDownValue?.selectedInsurance?.value === "Bank" &&
      data?.bank?.value === ""
    ) {
      setError("bank", {
        type: "manual",
        message: "",
      });
      return false;
    } else {
      clearErrors("bank");
    }

    if (selectedReservation?.value === "No" && data?.expected_quantity === "") {
      setError("expected_quantity", {
        type: "manual",
        message: "",
      });
      return false;
    } else {
      clearErrors("expected_quantity");
    }

    if (
      selectedReservation?.value === "No" &&
      data?.expected_no_of_bags === ""
    ) {
      setError("expected_no_of_bags", {
        type: "manual",
        message: "",
      });
      return false;
    } else {
      clearErrors("expected_no_of_bags");
    }
    // return false;

    if (warehousechamber.length === 0) {
      scrollToElement("", 210); // first param to pass "ELEMENT-ID" || " " id to scroll and second param is pass "OFFSET" is options
      setError("warehouse", {
        type: "manual",
        message: "",
      });
      setError("chamber", {
        type: "manual",
        message: "",
      });
      return;
    }

    console.log("selectedReservation?.value", selectedReservation?.value);

    if (selectedReservation?.value === "Yes") {
      const dateArray = reservationDetailsArray?.map(
        (el) => el?.reservation_end_date
      );
      const momentDates = dateArray?.map((date) => moment(date));
      const biggestDate = moment.max(momentDates);
      const formattedBiggestDate = biggestDate.format("DD-MM-YYYY");

      console.log("biggestDate", biggestDate);
      console.log(getValues("service_contract_end_date"));
      console.log(formattedBiggestDate);
      const d = moment(getValues("service_contract_end_date")).format(
        "DD-MM-YYYY"
      );
      console.log(d);
      if (d !== formattedBiggestDate) {
        showToastByStatusCode(
          400,
          "Service Contract End date should be same as end date of last post reservation record."
        );
        return false;
      }
    }

    // Bag wise rate details
    if (
      selectedDropDownValue?.selectedStorageRate?.value === "Bag" &&
      bagWiseDetailsArray.length === 0
    ) {
      scrollToElement("", 1010); // first param to pass "ELEMENT-ID" || " " id to scroll and second param is pass "OFFSET" is options
      setError("bag_size", {
        type: "manual",
        message: "",
      });
      setError("pbpm_rate", {
        type: "manual",
        message: "",
      });
      setError("rate", {
        type: "manual",
        message: "",
      });
      return;
    }

    try {
      let conditional_field = {};
      let contractreservation = [];

      console.log(data?.commodity?.value);

      if (selectedDropDownValue?.selectedReservation?.value === "No") {
        conditional_field = {
          expected_quantity: data?.expected_quantity,
          expected_no_of_bags: data?.expected_no_of_bags,
        };
      }

      let contractcommodity = [];
      console.log(bagWiseDetailsArray);

      if (bagWiseDetailsArray.length) {
        contractcommodity = bagWiseDetailsArray.map((el) => ({
          commodity: data?.commodity?.value,
          bag_size: el?.bag_size?.value,
          pbpm_rate: el?.pbpm_rate,
          rate: el?.rate,
          storage_rate_per_mt: getValues("storage_rate_per_mt"),
        }));
      } else {
        contractcommodity = [
          {
            commodity: data?.commodity?.value,
            storage_rate_per_mt: getValues("storage_rate_per_mt"),
          },
        ];
      }

      console.log(contractcommodity);

      if (
        selectedDropDownValue?.selectedReservation.value === "Yes" &&
        reservationDetailsArray?.length === 0
      ) {
        scrollToElement("", 1250);
        validateReservationDetailsFormData({});
        return false;
      }

      if (selectedDropDownValue?.selectedReservation?.value === "Yes") {
        const arr = reservationDetailsArray?.map((item) => ({
          commodity: data?.commodity?.value,
          reservation_type: item.reservation_type.value,
          storage_rate_mt: item.reservation_storage_rate_mt || null,
          bag_size: item?.reservation_bag_size?.value,
          reserved_no_of_bags: parseInt(item.reserved_no_of_bags),
          reservation_start_date: moment(item.reservation_start_date).format(
            "YYYY-MM-DD"
          ),
          reservation_end_date: moment(item.reservation_end_date).format(
            "YYYY-MM-DD"
          ),
          pbpm_rate: parseFloat(item.reservation_pbpm_rate),
          rate: parseFloat(item.reservation_rate),
          reservation_billing_cycle: item.reservation_billing_cycle.value,
        }));
        contractreservation = arr;
      } else {
        contractreservation = [];
      }

      // const newItem = {
      //   commodity: data?.commodity?.value,
      //   reservation_type: item.reservation_type.value,
      //   storage_rate_mt: item.reservation_storage_rate_mt,
      //   bag_size: item.reservation_bag_size.value,
      //   reserved_no_of_bags: parseInt(item.reserved_no_of_bags),
      //   reservation_start_date: moment(
      //     item.reservation_start_date
      //   ).format("DD-MM-YYYY"),
      //   reservation_end_date: moment(item.reservation_end_date).format(
      //     "DD-MM-YYYY"
      //   ),
      //   pbpm_rate: parseFloat(item.reservation_pbpm_rate),
      //   rate: parseFloat(item.reservation_rate),
      //   reservation_billing_cycle: item.reservation_billing_cycle.value,
      // };

      // {
      //   reservation_type: { label: 'Reservation', value: 'Reservation' },
      //   reservation_start_date: '2023-11-01',
      //   reservation_end_date: '2023-12-28',
      //   reservation_pbpm_rate: 343,
      //   reservation_rate: 343,
      //   reservation_billing_cycle: { value: 'Fortnightly', label: 'Fortnightly' },
      //   reservation_storage_rate_mt: undefined,
      //   reservation_bag_size: { label: 45, value: 176 },
      //   reserved_no_of_bags: '343'
      // }

      // bagWiseDetailsArray

      console.log(contractreservation);

      const chamberArr = warehousechamber.map((el) => {
        return {
          warehouse: el.warehouse.value,
          chamber: el.chamber.value,
        };
      });

      console.log("data ", data);

      let finalFormData = {
        contract_type: "pwh",
        client: data.client.value,
        fumigation_by_gogreen: data.fumigation_by_gogreen.value,
        insurance_by: data?.insurance_by?.value,
        qc_charges_by_gogreen: data.qc_charges_by_gogreen.value,
        billing_cycle: data.excess_billing_cycle.value,
        //  "billing_cycle": "Excess Billing Cycle",
        storage_rate_on: data.storage_rate_on.value,
        reservation: data.reservation.value,
        ...conditional_field,
        service_contract_start_date: moment(
          data.service_contract_start_date
        ).format("YYYY-MM-DD"),
        service_contract_end_date: moment(
          data.service_contract_end_date
        ).format("YYYY-MM-DD"),
        service_contract_billing_end_date: moment(
          data.service_contract_billing_end_date
        ).format("YYYY-MM-DD"),
        //     "minimum_billing_charge": 50.0,
        upload_signed_service_contract: uploadedSignedServiceContract,
        // upload_signed_service_contract: data.upload_signed_service_contract,
        bank: data?.bank?.value,
        warehousechamber: chamberArr,
        contractcommodity: contractcommodity,
        contractreservation: contractreservation,
        commodity: data.commodity.value,
      };

      console.log(selectedDropDownValue?.selectedStorageRate);

      if (selectedDropDownValue?.selectedStorageRate?.value === "MT") {
        finalFormData = {
          ...finalFormData,
          storage_rate_per_mt: data?.storage_rate_per_mt,
        };
      }

      console.log(groupedReservationDetails);
      console.log("finalFormData", finalFormData);

      console.log(finalFormData);
      if (details?.id) {
        console.log({
          ...finalFormData,
          contractcommodity: contractcommodity,
          id: details.id,
        });
        updateData({
          ...finalFormData,
          contractcommodity: contractcommodity,
          id: details.id,
        });
      } else {
        addData(finalFormData);
        console.log(finalFormData);
      }
      //console.log("details", details);
    } catch (validationErrors) {
      console.log("validationErrors ----->", validationErrors);
      Object.keys(validationErrors).forEach((key) => {
        setError(key, {
          type: "manual",
          message: validationErrors[key] || "",
        });
      });
      return false;
    }
  };

  const addData = async (finalFormData) => {
    try {
      const response = await addServiceContractData(finalFormData).unwrap();
      console.log("Success:", response);
      if (response.status === 201) {
        console.log(response);
        showToastByStatusCode(201, response?.message);

        navigate(`${ROUTE_PATH.SERVICE_CONTRACT_PWH}`);
      }
    } catch (error) {
      console.error("Error:", error);
      // toasterAlert(error);
      CommonToasterAlert(error);
    }
  };

  const fetchAllBagWiseDetails = async (id) => {
    try {
      console.log(id);
      const response = await fetchBagWiseDetails({ id }).unwrap();
      console.log("Success ankit:", response);
      if (response.status === 200) {
        setValue("rate", 0, {
          shouldValidate: true,
        });
        console.log(response);
        let arr = response?.data?.map((el) => ({
          bag_size: el.bag_size,
          commodity: el.commodity_name,
          pbpm_rate: el.storage_rate,
          rate: 0,
        }));

        console.log(arr);

        setBagWiseRateDetails(arr);
      }
    } catch (error) {
      console.log(error);
      let errorMessage =
        error?.data?.data || error?.data?.message || "Request Failed.";
      console.log("Error:", errorMessage);
      // toasterAlert({
      //   message: JSON.stringify(errorMessage),
      //   status: 440,
      // });
    }
    // console.error("Error:", error);
    // toasterAlert(error);
  };

  const updateData = async (finalFormData) => {
    try {
      const response = await updateServiceContractData({
        ...finalFormData,
        id: details.id,
        contract_type: "pwh",
      }).unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        if (
          Number(details?.status?.status_code || 0) === 2 ||
          Number(details?.status?.status_code || 0) === 5
        ) {
          approvedToMeFunction({ status: "approved" });
        } else {
          toasterAlert(response);
          navigate(`${ROUTE_PATH.SERVICE_CONTRACT_PWH}`);
        }
      }
    } catch (error) {
      console.log(error);
      let errorMessage =
        error?.data?.data || error?.data?.message || "Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // const calculateEndDate = (startDate) => {
  //   const endDate = moment(startDate).add(11, "months").subtract(1, "day");
  //   return endDate.format("DD-MM-YYYY");
  // };

  const autoFillForm = async () => {
    fetchAllClients();
    getRegionMasterList();
    fetchAllCommodity();
    console.log(details);
    setValue("pbpm_rate", "2023", { shouldValidate: true }); // is just temporary
    if (details?.id) {
      const res = await fetchServiceContractById(details?.id);
      const form_details = res?.data;
      setDetails(form_details);
      console.log(form_details?.status);
      // details = form_details;
      console.log("fetchServiceContractById", res);
      console.log("billing cycle -->", form_details);
      // alert();
      let drillDown = {
        region:
          form_details?.warehousechamber?.length > 0
            ? form_details?.warehousechamber[0]?.warehouse?.region?.id
            : "",
        state:
          form_details?.warehousechamber?.length > 0
            ? form_details?.warehousechamber[0]?.warehouse?.state?.id
            : "",
        substate:
          form_details?.warehousechamber?.length > 0
            ? form_details?.warehousechamber[0]?.warehouse?.substate?.id
            : "",
        district:
          form_details?.warehousechamber?.length > 0
            ? form_details?.warehousechamber[0]?.warehouse?.district?.id
            : "",
        area:
          form_details?.warehousechamber?.length > 0
            ? form_details?.warehousechamber[0]?.warehouse?.area?.id
            : "",
      };
      // storage_rate_per_mt
      regionOnChange({ value: drillDown?.region });
      stateOnChange({ value: drillDown?.state });
      zoneOnChange({ value: drillDown?.substate });
      districtOnChange({ value: drillDown?.district });
      methods.setValue("area", drillDown?.area, { shouldValidate: true });

      // contractreservation

      let area_name =
        form_details?.warehousechamber?.length > 0
          ? form_details?.warehousechamber[0]?.warehouse?.area?.area_name
          : "";
      let query = `?filter=warehouse_type__warehouse_type_name&warehouse_type__warehouse_type_name=PWH&filter=area&area=${area_name}`;

      // filter: "warehouse_type",
      // warehouse_type: "PWH",
      // filter: "area",
      // area:
      //   form_details?.warehousechamber?.length > 0
      //     ? form_details?.warehousechamber[0]?.warehouse?.area?.area_name
      //     : "",

      getWarehouseMasterList(query);

      console.log("all edited form_details -->", form_details);
      const upload_signed_service_contract =
        form_details?.upload_signed_service_contract;

      console.log(upload_signed_service_contract);
      const finalFormData = {
        client: {
          label: form_details?.client.name_of_client,
          value: form_details?.client.id,
        },
        commodity: {
          label:
            form_details?.contractcommodity?.length > 0
              ? form_details?.contractcommodity[0]?.commodity?.commodity_name
              : "",
          value:
            form_details?.contractcommodity?.length > 0
              ? form_details?.contractcommodity[0]?.commodity?.id
              : "",
        },

        fumigation_by_gogreen: {
          label: form_details?.fumigation_by_gogreen,
          value: form_details?.fumigation_by_gogreen,
        },
        expected_quantity: form_details?.expected_quantity,
        expected_no_of_bags: form_details?.expected_no_of_bags,
        insurance_by: insurance_by?.filter(
          (el) => el.value === form_details?.insurance_by
        )[0],
        qc_charges_by_gogreen: QC_charges_by_go_green?.filter(
          (el) => el.value === form_details?.qc_charges_by_gogreen
        )[0],
        excess_billing_cycle: Excess_Billing_Cycle?.filter(
          (el) => el.value === form_details?.billing_cycle
        )[0],
        storage_rate_on: Storage_rate_on?.filter(
          (el) => el.value === form_details?.storage_rate_on
        )[0],
        reservation: RESERVATION?.filter(
          (el) => el.value === form_details?.reservation
        )[0],

        post_reservation_billing_cycle: Post_Reservation_Billing_Cycle?.filter(
          (el) => el.value === form_details?.post_reservation_billing_cycle
        )[0],
        service_contract_start_date: form_details?.service_contract_start_date,
        service_contract_end_date: form_details?.service_contract_end_date,
        service_contract_billing_end_date:
          form_details?.service_contract_billing_end_date,

        upload_signed_service_contract:
          form_details?.upload_signed_service_contract?.[0],
      };

      console.log("finalFormData", finalFormData);

      let query_params = `filter=contractcommodity__commodity__commodity_name&contractcommodity__commodity__commodity_name=${finalFormData?.commodity?.label}`;
      fetchAllBagSizeLists(query_params);

      // const files_arr = form_details?.upload_signed_service_contract?.map(
      //   (el) => el?.upload_signed_service_contract
      // );

      // console.log(files_arr);

      console.log("form details ----> ", form_details);

      setUploadedSignedServiceContract(
        form_details?.upload_signed_service_contract || []
      );
      // billing_cycle

      console.log("final_form data -->", finalFormData);

      setSelectedDropDownValue((prev) => ({
        ...prev,
        selectedClient: finalFormData.client,
        selectedCommodity: finalFormData.commodity,
        selectedFumigation: finalFormData.fumigation_by_gogreen,
        selectedInsurance: finalFormData.insurance_by,
        selectedQcCharges: finalFormData.qc_charges_by_gogreen,
        selectedExcessBillingCycle: finalFormData.excess_billing_cycle,
        selectedStorageRate: finalFormData.storage_rate_on,
        selectedReservation: finalFormData.reservation,
        selectedReservationBillingCycle:
          finalFormData.post_reservation_billing_cycle,
      }));

      // selectedCommodity
      // selectedExcessBillingCycle

      setWarehousechamber(
        form_details?.warehousechamber?.map((el) => ({
          warehouse: {
            label: el.warehouse.warehouse_name,
            value: el.warehouse.id,
          },
          chamber: {
            label: el.chamber.chamber_number,
            value: el.chamber.id,
          },
        }))
      );

      const reservation_data = [];

      // storage_rate_on
      console.log("finalFormData", finalFormData);
      console.log("form_details", form_details);
      // finalFormData?.reservation?.value === "No" ||

      if (finalFormData?.reservation?.value === "No") {
        // methods.setValue(
        //   "storage_rate_per_mt",
        //   form_details?.contractcommodity?.length > 0
        //     ? form_details?.contractcommodity[0]?.storage_rate_per_mt
        //     : "",
        //   { shouldValidate: true }
        // );
        // contractreservation

        let warehouse_id = form_details?.warehousechamber
          ? form_details?.warehousechamber[0]?.warehouse.id
          : null;

        if (warehouse_id) {
          fetchAllBagWiseDetails(warehouse_id);
        }

        setBagWiseRateDetails(form_details?.contractcommodity);
      } else {
        let total_contractreservation =
          form_details?.contractreservation?.length || 0;
        let contractreservation_last_item = {};

        if (total_contractreservation === 1) {
          contractreservation_last_item = form_details?.contractreservation[0];

          setReservationDatesState({
            Reservation: {
              startDate: contractreservation_last_item?.reservation_start_date,
              endDate: contractreservation_last_item?.reservation_end_date,
            },
          });
        }
        if (total_contractreservation > 1) {
          contractreservation_last_item =
            form_details?.contractreservation[total_contractreservation - 1];

          setReservationDatesState({
            Reservation: {
              startDate: contractreservation_last_item?.reservation_start_date,
              endDate: contractreservation_last_item?.reservation_end_date,
            },
          });
        }

        console.log(res?.data?.contractreservation);
        res?.data?.contractreservation?.forEach((item) => {
          const {
            reservation_type,
            reservation_start_date,
            reservation_end_date,
            pbpm_rate,
            rate,
            reservation_billing_cycle,
            storage_rate_mt,
            reserved_no_of_bags,
          } = item;

          const dataItem = {
            reservation_type: {
              label: reservation_type,
              value: reservation_type,
            },
            reservation_start_date,
            reservation_end_date,
            reservation_pbpm_rate: pbpm_rate || "",
            reservation_rate: rate || "",
            reservation_billing_cycle: {
              value: reservation_billing_cycle,
              label: reservation_billing_cycle,
            },
            reservation_storage_rate_mt: storage_rate_mt || null,
            reservation_bag_size: {
              label: item?.bag_size?.bag_size,
              value: item?.bag_size?.id,
            },
            reserved_no_of_bags,
          };

          console.log("details dataItem --> ", dataItem);

          // if (selectedDropDownValue?.selectedStorageRate?.value === "Bag") {
          //   console.log(selectedDropDownValue?.selectedStorageRate);
          //   delete dataItem?.reservation_storage_rate_mt;
          // } else {
          //   console.log(selectedDropDownValue?.selectedStorageRate);
          //   delete dataItem?.reservation_bag_size;
          //   delete dataItem?.reserved_no_of_bags;
          // }
          // alert();

          console.log(dataItem);
          // setReservationDetailsArray((prev) => [...prev, dataItem]);
          reservation_data.push(dataItem);
          setSelectedReservationBillingCycle((prev) => ({
            ...prev,
            [dataItem?.reservation_type?.value]:
              dataItem?.reservation_billing_cycle?.value,
          }));

          // if (!contractreservation_obj[reservation_type]) {
          //   console.log("-------->", contractreservation_obj[reservation_type]);
          //   contractreservation_obj[reservation_type] = [];
          // }

          // contractreservation_obj[reservation_type].push(dataItem);
        });
        // contractreservation
      }

      if (finalFormData?.storage_rate_on?.value === "MT") {
        console.log(finalFormData);
        console.log(form_details?.contractcommodity, "hiiiii");
        console.log(form_details?.contractcommodity[0]?.storage_rate_per_mt);
        methods.setValue(
          "storage_rate_per_mt",
          form_details?.contractcommodity?.length > 0
            ? form_details?.contractcommodity[0]?.storage_rate_per_mt
            : "",
          { shouldValidate: true }
        );
      }

      setReservationDetailsArray(reservation_data);

      Object.keys(finalFormData).forEach(function (key) {
        console.log(key);
        methods.setValue(key, finalFormData[key], { shouldValidate: true });
      });

      // -------------------------
      // ! commented un used variable
      // let contractreservation_obj = {};
      let contractcommodity_arr = res?.data?.contractcommodity?.map((el) => ({
        // commodity: data?.commodity?.value,
        bag_size: {
          label: el?.bag_size?.bag_size,
          value: el?.bag_size?.id,
        },
        pbpm_rate: el?.pbpm_rate,
        rate: el?.rate,
      }));

      let bag_size_arr = contractcommodity_arr?.map((el) => el.bag_size);
      setReservationBagSizeList(bag_size_arr);

      setBagWiseDetailsArray(contractcommodity_arr);

      // res?.data?.contractreservation?.forEach((item) => {
      //   const {
      //     reservation_type,
      //     reservation_start_date,
      //     reservation_end_date,
      //     reservation_pbpm_rate,
      //     reservation_rate,
      //     reservation_billing_cycle,
      //     reservation_storage_rate_mt,
      //     reserved_no_of_bags,
      //   } = item;

      //   const dataItem = {
      //     reservation_type: {
      //       label: reservation_type,
      //       value: reservation_type,
      //     },
      //     reservation_start_date,
      //     reservation_end_date,
      //     reservation_pbpm_rate: reservation_pbpm_rate || "",
      //     reservation_rate: reservation_rate || "",
      //     reservation_billing_cycle: {
      //       value: reservation_billing_cycle,
      //       label: reservation_billing_cycle,
      //     },
      //     reservation_storage_rate_mt: reservation_storage_rate_mt || "",
      //     reservation_bag_size: {
      //       label: item?.bag_size?.bag_size,
      //       value: item?.bag_size?.id,
      //     },
      //     reserved_no_of_bags,
      //   };

      //   if (selectedDropDownValue?.selectedStorageRate?.value === "Bag") {
      //     console.log(selectedDropDownValue?.selectedStorageRate);
      //     delete dataItem?.reservation_storage_rate_mt;
      //   } else {
      //     console.log(selectedDropDownValue?.selectedStorageRate);
      //     delete dataItem?.reservation_bag_size;
      //     delete dataItem?.reserved_no_of_bags;
      //   }

      //   console.log(dataItem);

      //   setReservationBillingCycle((prev) => ({
      //     ...prev,
      //     [dataItem?.reservation_type?.value]:
      //       dataItem?.reservation_billing_cycle?.value,
      //   }));

      //   if (!contractreservation_obj[reservation_type]) {
      //     console.log("-------->", contractreservation_obj[reservation_type]);
      //     contractreservation_obj[reservation_type] = [];
      //   }

      //   contractreservation_obj[reservation_type].push(dataItem);
      // });

      // // setReservationBillingCycle()

      // console.log("obj ->", contractreservation_obj);
      // setGroupReservationDetails(contractreservation_obj);

      // console.log("finalFormData ---> on page load -->", finalFormData);
    }
  };

  // All useEffect start here
  useEffect(() => {
    autoFillForm();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // console.log("value -->", value);
      // console.log("name -->", name);
      // console.log("type -->", type);

      if (name === "area" && value.area !== null && !Number(value.area)) {
        setWarehousechamber([]);

        let query = `?filter=warehouse_type__warehouse_type_name&warehouse_type__warehouse_type_name=PWH&filter=area&area=${value?.area}`;

        setWarehouseOptions([]);
        setChamberOptions([]);

        setSelectedDropDownValue((prev) => ({
          ...prev,
          selectedWarehouseName: {},
          selectedChamber: {},
        }));

        getWarehouseMasterList(query);
      }

      if (name === "warehouse") {
        if (value?.warehouse?.value) {
          setSelectedDropDownValue((prev) => ({
            ...prev,
            selectedChamber: {},
          }));
          console.log(value);
          let query = {
            filter: "warehouse__id",
            warehouse__id: value?.warehouse?.value,
          };
          console.log(query);
          getChamberMasterList(query);
        }
      }
      if (name === "reservation") {
        // setBagWiseRateDetails([...contractCommodity]);
        // setReservationDetails([]);
        // if (value.reservation.value === "No") {
        //   //fetchBagWiseDetails
        //   console.log(getValues("warehouse"));
        //   console.log("warehousechamber !!!", warehousechamber);
        //   //  let commodity_id = getValues("warehouse")?.value;
        //   let commodity_id = warehousechamber[0]?.warehouse?.value;
        //   console.log("commodity_id", commodity_id);
        //   console.log(warehousechamber);
        //   if (commodity_id) {
        //     fetchAllBagWiseDetails(commodity_id);
        //   }
        // }
        // reset({ rate: "" });
      }
      // if (name === "service_contract_start_date") {
      //   let end_date = calculateEndDate(value.service_contract_start_date);
      //   setValue("service_contract_end_date", end_date, {
      //     shouldValidate: true,
      //   });
      // }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line
  }, [watch]);

  useEffect(() => {
    setBagWiseRateDetails([...contractCommodity]);
    setReservationDetails([]);
    let warehouse_obj = getValues("reservation");
    if (warehouse_obj?.value === "No") {
      let commodity_id = warehousechamber[0]?.warehouse?.value;
      if (commodity_id) {
        fetchAllBagWiseDetails(commodity_id);
      }
    }
    // eslint-disable-next-line
  }, [getValues("reservation")]);

  useEffect(() => {
    // set breadcrumbArray
    const breadcrumbArray = [
      {
        title: "Service Contract(PWH)",
        link: `${ROUTE_PATH.SERVICE_CONTRACT_PWH}`,
      },
      // {
      //   title: "Region Master",
      //   link: "/manage-location/region-master",
      // },
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

  // Input disable Logic Start

  const loginData = localStorageService.get("GG_ADMIN");

  const InputDisableFunction = () => {
    const isViewOnly = location?.state?.isViewOnly || false;
    console.log("isViewOnly", isViewOnly);

    const NotUser =
      Number(details?.status?.status_code || 0) === 0
        ? false
        : details?.l3_user !== null
        ? details?.l3_user?.id === loginData?.userDetails?.id || 0
          ? false
          : true
        : details?.l2_user !== null
        ? details?.l2_user?.id === loginData?.userDetails?.id || 0
          ? false
          : true
        : details?.l1_user !== null
        ? details?.l1_user?.id === loginData?.userDetails?.id || 0
          ? false
          : true
        : true;

    const result =
      pageView ||
      isViewOnly ||
      NotUser ||
      details?.status?.status_code === 1 ||
      details?.status?.status_code === 3 ||
      details?.status?.status_code === 4 ||
      details?.status?.status_code === 6 ||
      details?.status?.status_code === 7
        ? true
        : false;

    // console.log(result);

    return result;
  };

  // Input disable Logic End

  // Reject Logic Start

  const [rejectReason, setRejectReason] = useState("");

  const [
    UpdateAssignServiceMaster,
    { isLoading: updateAssignServiceMasterApiIsLoading },
  ] = useAssignServiceContractMutation();

  const assignToMeFunction = async () => {
    const data = {
      id: details.id,
      status: "assigned",
      reasons: "",
    };

    try {
      const response = await UpdateAssignServiceMaster(data).unwrap();
      console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        console.log("response --> ", response);
        autoFillForm();
        toasterAlert({
          message: "Service Contract Assign Successfully.",
          status: 200,
        });
        //  navigate(`${ROUTE_PATH.SERVICE_CONTRACT_PWH}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data || error?.data?.message || "Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }

    console.log(data, "data");
  };

  const approvedToMeFunction = async () => {
    const data = {
      id: details.id,
      status: "approved",
      reasons: "",
    };

    console.log(data);

    try {
      const response = await UpdateAssignServiceMaster(data).unwrap();
      console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        console.log("response --> ", response);
        toasterAlert({
          message: "Service Contract Approved Successfully.",
          status: 200,
        });
        navigate(`${ROUTE_PATH.SERVICE_CONTRACT_PWH}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data || error?.data?.message || "Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }

    console.log(data, "data");
  };

  const rejectedToMeFunction = async () => {
    if (rejectReason?.trim() === "") {
      setValue("rejectReason_text", "", {
        shouldValidate: true,
      });
      setError("rejectReason_text", {
        type: "custom",
        message: "",
      });
      return false;
    } else {
      const data = {
        id: details.id,
        status: "rejected",
        reasons: rejectReason,
      };

      try {
        const response = await UpdateAssignServiceMaster(data).unwrap();
        console.log("saveAsDraftData - Success:", response);
        if (response.status === 200) {
          console.log("response --> ", response);
          toasterAlert({
            message: "Service Contract Rejected Successfully.",
            status: 200,
          });
          navigate(`${ROUTE_PATH.SERVICE_CONTRACT_PWH}`);
        }
      } catch (error) {
        console.error("Error:", error);
        let errorMessage =
          error?.data?.data || error?.data?.message || "Request Failed.";
        console.log("Error:", errorMessage);
        toasterAlert({
          message: JSON.stringify(errorMessage),
          status: 440,
        });
      }
    }

    // console.log(data, "data");
  };

  // Reject Logic Start

  // ! commented unused function
  // function renderRows(reservationType, reservations) {
  //   console.log("reservationType", reservationType);
  //   console.log("reservations", reservations);
  //   const total_record = reservations?.length;
  //   console.log(total_record);
  //   let prev_record = {};
  //   if (total_record !== 0 && total_record === 1) {
  //     prev_record = reservations[0];
  //   } else {
  //     prev_record = reservations[total_record - 1];
  //   }

  //   console.log(prev_record);
  //   //const prev_record = reservations[total_record -1]
  //   return reservations?.map((data, index) => (
  //     <Tr style={{ color: "#000" }} key={index}>
  //       {index === 0 && (
  //         <Td rowSpan={reservations?.length}>{reservationType}</Td>
  //       )}
  //       {/* <Td>{data.reservation_type.label}</Td> */}
  //       <Td>{data?.reservation_storage_rate_mt || index}</Td>
  //       <Td>{data?.reservation_bag_size?.label || "-"}</Td>
  //       <Td>{data?.reserved_no_of_bags || "-"}</Td>
  //       <Td>{data?.reservation_start_date}</Td>
  //       <Td>{data?.reservation_end_date}</Td>
  //       <Td>{data?.reservation_pbpm_rate}</Td>
  //       <Td>{data?.reservation_rate}</Td>
  //       {/* <Td>{data.reservation_billing_cycle.label}</Td> */}
  //       <Td>{reservationBillingCycle?.[reservationType]}</Td>
  //       <Td>
  //         <Box display="flex" alignItems="center" gap="3">
  //           <Flex gap="20px" justifyContent="center">
  //             <Box color={"primary.700"}>
  //               <BiEditAlt
  //                 fontSize="26px"
  //                 cursor="pointer"
  //                 onClick={() =>
  //                   reservationDetailsOnEdit(data, reservations, index)
  //                 }
  //               />
  //             </Box>
  //             <Box color="red">
  //               <AiOutlineDelete
  //                 cursor="pointer"
  //                 fontSize="26px"
  //                 onClick={() =>
  //                   deleteReservationDetails(reservationType, index)
  //                 }
  //               />
  //             </Box>
  //           </Flex>
  //         </Box>
  //       </Td>
  //     </Tr>
  //   ));
  // }

  // ! commneted un used function ..
  // function ReservationTable({ data }) {
  //   return (
  //     <Table variant="simple">
  //       <Thead>
  //         <Tr style={{ color: "#000" }}>
  //           {tableHeaders.map((header, index) => (
  //             <Th style={{ color: "#000" }} key={index}>
  //               {header}
  //             </Th>
  //           ))}
  //         </Tr>
  //       </Thead>
  //       <Tbody>
  //         {Object.keys(data).map((reservationType) =>
  //           renderRows(reservationType, data[reservationType])
  //         )}
  //       </Tbody>
  //     </Table>
  //   );
  // }

  // ! commented un used function ..
  // const handleEndDateUpdate = (newEndDate, item, index) => {
  //   const reservationType = item?.reservation_type?.label;

  //   if (
  //     groupedReservationDetails[reservationType] &&
  //     groupedReservationDetails[reservationType][index]
  //   ) {
  //     const oldEndDate =
  //       groupedReservationDetails[reservationType][index].reservation_end_date;
  //     if (newEndDate !== oldEndDate) {
  //       const confirmation = window.confirm(
  //         "The reservation end date has changed. Do you want to remove all data below this entry?"
  //       );

  //       if (confirmation) {
  //         // Remove all data below the given index
  //         groupedReservationDetails[reservationType][index] = item;
  //         if (groupedReservationDetails[reservationType].length > index + 1) {
  //           groupedReservationDetails[reservationType].splice(index + 1);
  //         }

  //         setReservationDates({
  //           startDate: "",
  //           endDate: item.reservation_end_date,
  //         });
  //         // setReservationDatesState({
  //         //   [reservationType]: {
  //         //     startDate: "",
  //         //     endDate: item.reservation_end_date,
  //         //   },
  //         // });
  //         // groupedReservationDetails;
  //       }
  //     }
  //   }
  // };

  // ! commented un used function ..
  // const handleEndDateUpdate_old = (newEndDate, item, index) => {
  //   const reservationType = item?.reservation_type?.label;
  //   console.log(reservationType);
  //   console.log(newEndDate);
  //   console.log(item);
  //   console.log(index);

  //   if (
  //     groupedReservationDetails[reservationType] &&
  //     groupedReservationDetails[reservationType].length > 1 &&
  //     groupedReservationDetails[reservationType][index]
  //   ) {
  //     const oldEndDate =
  //       groupedReservationDetails[reservationType][index].reservation_end_date;
  //     if (newEndDate !== oldEndDate) {
  //       const confirmation = window.confirm(
  //         "The reservation end date has changed. Do you want to remove all data below this entry?"
  //       );

  //       if (confirmation) {
  //         groupedReservationDetails[reservationType][index] = item;
  //         // Remove all data below the given index
  //         if (groupedReservationDetails[reservationType].length > index + 1) {
  //           groupedReservationDetails[reservationType].splice(index + 1);
  //         }
  //         setReservationDates({
  //           startDate: "",
  //           endDate: item.reservation_end_date,
  //         });

  //         setReservationDatesState((prev) => ({
  //           ...prev,
  //           [reservationType]: {
  //             startDate: "",
  //             //  startDate: item.reservation_start_date,
  //             endDate: item.reservation_end_date,
  //           },
  //         }));
  //       }
  //     }
  //   }
  // };

  return (
    <>
      <Box bgColor={"White"} borderRadius={"md"} p={2}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Box
              w={{
                base: "100%",
                sm: "100%",
                md: "100%",
                lg: "100%",
                xl: "100%",
              }}
            >
              {/*Client name   */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Client name<span style={{ color: "red" }}>*</span>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <ReactSelect
                      name="client"
                      value={selectedDropDownValue?.selectedClient}
                      onChange={(val) => {
                        dropDownOnChange(val, "selectedClient", "client");
                      }}
                      options={clientOptions}
                      isDisabled={InputDisableFunction()}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: errors?.client ? "red" : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/*  Region  */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Region<span style={{ color: "red" }}>*</span>{" "}
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <ReactCustomSelect
                      name="region"
                      label=""
                      isLoading={fetchLocationDrillDownApiIsLoading}
                      options={selectBoxOptions?.regions || []}
                      selectedValue={
                        selectBoxOptions?.regions?.filter(
                          (item) => item.value === getValues("region")
                        )[0] || {}
                      }
                      selectDisable={InputDisableFunction()}
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        setWarehousechamber([]);
                        regionOnChange(val);
                      }}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* State  */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    {" "}
                    State <span style={{ color: "red" }}>*</span>
                  </Text>{" "}
                </GridItem>

                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <ReactCustomSelect
                      name="state"
                      label=""
                      isLoading={fetchLocationDrillDownApiIsLoading}
                      options={selectBoxOptions?.states || []}
                      selectedValue={
                        selectBoxOptions?.states?.filter(
                          (item) => item.value === getValues("state")
                        )[0] || {}
                      }
                      selectDisable={InputDisableFunction()}
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        setWarehousechamber([]);
                        stateOnChange(val);
                      }}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/*  Sub states  */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Sub state<span style={{ color: "red" }}>*</span>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <ReactCustomSelect
                      name="substate"
                      label=""
                      selectDisable={InputDisableFunction()}
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
                        setWarehousechamber([]);
                        zoneOnChange(val);
                      }}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/*  District  */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    District<span style={{ color: "red" }}>*</span>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <ReactCustomSelect
                      name="district"
                      label=""
                      isLoading={fetchLocationDrillDownApiIsLoading}
                      options={selectBoxOptions?.districts || []}
                      selectedValue={
                        selectBoxOptions?.districts?.filter(
                          (item) => item.value === getValues("district")
                        )[0] || {}
                      }
                      selectDisable={InputDisableFunction()}
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        setWarehousechamber([]);
                        districtOnChange(val);
                      }}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/*  Area  */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Area<span style={{ color: "red" }}>*</span>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <ReactCustomSelect
                      name="area"
                      label=""
                      isLoading={fetchLocationDrillDownApiIsLoading}
                      options={selectBoxOptions?.areas || []}
                      selectedValue={
                        selectBoxOptions?.areas?.filter(
                          (item) => item.value === getValues("area")
                        )[0] || {}
                      }
                      isClearable={false}
                      selectDisable={InputDisableFunction()}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        setWarehousechamber([]);
                        areaOnChange(val);
                      }}
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              {/* Chamber details* start    */}
              <Box id="chamber-details">
                <Box>
                  <Box
                    mt="10"
                    bgColor={"#DBFFF5"}
                    padding="20px"
                    borderRadius="10px"
                  >
                    <Heading as="h5" fontSize="lg" textAlign="left">
                      Chamber details*
                    </Heading>

                    <>
                      <Box pt="10px">
                        <Grid
                          alignItems="center"
                          my="3"
                          templateColumns="repeat(3, 1fr)"
                          gap={5}
                        >
                          {/* --------------  Warehouse name* -------------- */}
                          <Box>
                            <Text my={1}>
                              Warehouse name
                              <span style={{ color: "red" }}>*</span>
                            </Text>{" "}
                            <Box>
                              <FormControl style={{ w: commonWidth.w }}>
                                <ReactSelect
                                  value={
                                    selectedDropDownValue?.selectedWarehouseName
                                  }
                                  name="warehouse"
                                  isDisabled={InputDisableFunction()}
                                  onChange={(val) =>
                                    dropDownOnChange(
                                      val,
                                      "selectedWarehouseName",
                                      "warehouse"
                                    )
                                  }
                                  options={warehouseOptions}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: errors?.warehouse
                                        ? "red"
                                        : "#c3c3c3",

                                      padding: "1px",
                                      textAlign: "left",
                                    }),

                                    ...reactSelectStyle,
                                  }}
                                />
                              </FormControl>
                              <Box position="absolute" as="small" color="red">
                                {showWarehoseExpiredMsg}
                              </Box>
                            </Box>
                          </Box>
                          {/* ------ Chamber no------------- */}
                          <Box>
                            <Text my={1}>
                              Chamber no<span style={{ color: "red" }}>*</span>
                            </Text>{" "}
                            <Box>
                              <FormControl style={{ w: commonWidth.w }}>
                                <ReactSelect
                                  value={selectedDropDownValue?.selectedChamber}
                                  onChange={(val) =>
                                    dropDownOnChange(
                                      val,
                                      "selectedChamber",
                                      "chamber"
                                    )
                                  }
                                  options={chamberOptions}
                                  isDisabled={InputDisableFunction()}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: errors?.chamber
                                        ? "red"
                                        : "#c3c3c3",

                                      padding: "1px",
                                      textAlign: "left",
                                    }),
                                    ...reactSelectStyle,
                                  }}
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
                          color="white"
                          _hover={{}}
                          isDisabled={InputDisableFunction()}
                          // color="white"
                          padding="0px 20px"
                          borderRadius={"50px"}
                          type="button"
                          onClick={() => {
                            addUpdateChamber();
                          }}
                        >
                          {isChamberDetailsEditState.isEdit ? "Update" : "Add"}
                        </Button>
                      </Flex>
                    </>
                  </Box>
                </Box>
                {/* Chamber details end    */}
                {/* show warehouse owner details table start */}
                <TableContainer mt="4">
                  <Table color="#000">
                    <Thead bg="#dbfff5" border="1px" borderColor="#000">
                      <Tr style={{ color: "#000" }}>
                        <Th color="#000">Sr no</Th>
                        <Th color="#000">Warehouse name</Th>
                        <Th color="#000">Chamber no</Th>

                        <Th color="#000">Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {warehousechamber && warehousechamber.length > 0 ? (
                        warehousechamber?.map((item, i) => (
                          <Tr
                            key={`chamber_${i}`}
                            textAlign="center"
                            bg="white"
                            border="1px"
                            borderColor="#000"
                          >
                            <Td>{i + 1}</Td>
                            <Td>{item?.warehouse?.label} </Td>
                            <Td>{item?.chamber?.label} </Td>
                            <Td>
                              <Box display="flex" alignItems="center" gap="3">
                                <Flex gap="20px" justifyContent="center">
                                  <Box color={"primary.700"}>
                                    <Button
                                      color="#A6CE39"
                                      isDisabled={InputDisableFunction()}
                                      onClick={() =>
                                        chamberDetailsOnEdit(item, i)
                                      }
                                    >
                                      <BiEditAlt
                                        // color="#A6CE39"
                                        fontSize="26px"
                                        cursor="pointer"
                                      />
                                    </Button>
                                  </Box>
                                  <Box color="red">
                                    <Button
                                      isDisabled={InputDisableFunction()}
                                      color="red"
                                      onClick={() => {
                                        deleteChamberDetails(i);
                                      }}
                                    >
                                      <AiOutlineDelete
                                        cursor="pointer"
                                        fontSize="26px"
                                        onClick={() => {
                                          deleteChamberDetails(i);
                                        }}
                                      />
                                    </Button>
                                  </Box>
                                </Flex>
                              </Box>
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr textAlign="center">
                          <Td textAlign="center" colSpan={5} color="#000">
                            No record found
                          </Td>
                        </Tr>
                      )}

                      {/* )} */}
                    </Tbody>
                  </Table>
                </TableContainer>
                {/* show client table end */}
              </Box>

              {/*Commodity name   */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Commodity name<span style={{ color: "red" }}>*</span>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <ReactSelect
                      value={selectedDropDownValue?.selectedCommodity}
                      onChange={(val) => {
                        setBagWiseDetailsArray([]);
                        setReservationDetailsArray([]);
                        dropDownOnChange(val, "selectedCommodity", "commodity");
                      }}
                      options={commodityOptions}
                      isDisabled={InputDisableFunction()}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: errors?.commodity ? "red" : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/*  Fumigation by go green */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Fumigation by go green
                    <span style={{ color: "red" }}>*</span>{" "}
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <ReactSelect
                      value={selectedDropDownValue?.selectedFumigation}
                      onChange={(val) =>
                        dropDownOnChange(
                          val,
                          "selectedFumigation",
                          "fumigation_by_gogreen"
                        )
                      }
                      options={fumigationOptions}
                      isDisabled={InputDisableFunction()}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: errors?.fumigation_by_gogreen
                            ? "red"
                            : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* insurance by  */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    {" "}
                    insurance by <span style={{ color: "red" }}>*</span>
                  </Text>{" "}
                </GridItem>

                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <ReactSelect
                      value={selectedDropDownValue?.selectedInsurance}
                      onChange={(val) =>
                        dropDownOnChange(
                          val,
                          "selectedInsurance",
                          "insurance_by"
                        )
                      }
                      options={insuranceByOptions}
                      isDisabled={InputDisableFunction()}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: errors?.insurance_by ? "red" : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              {selectedDropDownValue?.selectedInsurance?.value === "Bank" && (
                <>
                  {/* Bank name */}
                  <Grid
                    textAlign="right"
                    alignItems="center"
                    my="3"
                    templateColumns={templateColumns}
                    gap={5}
                  >
                    <GridItem colSpan={{ base: 1, lg: 0 }}>
                      <Text textAlign="right">
                        Bank name <span style={{ color: "red" }}>*</span>
                      </Text>{" "}
                    </GridItem>
                    <GridItem colSpan={{ base: 1 }}>
                      <FormControl style={{ w: commonWidth.w }}>
                        <ReactSelect
                          value={selectedDropDownValue?.selectedBank}
                          onChange={(val) =>
                            dropDownOnChange(val, "selectedBank", "bank")
                          }
                          options={banksList || []}
                          isDisabled={InputDisableFunction()}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              backgroundColor: "#fff",
                              borderRadius: "6px",
                              borderColor: errors?.bank ? "red" : "#c3c3c3",

                              padding: "1px",
                              textAlign: "left",
                            }),
                            ...reactSelectStyle,
                          }}
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                </>
              )}

              {/* Billing details :  */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right" color={"#212121"}>
                    Billing details :{" "}
                  </Text>{" "}
                </GridItem>
              </Grid>

              {/*  QC charges by go green  */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    QC charges by go green
                    <span style={{ color: "red" }}>*</span>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <ReactSelect
                      value={selectedDropDownValue?.selectedQcCharges}
                      onChange={(val) =>
                        dropDownOnChange(
                          val,
                          "selectedQcCharges",
                          "qc_charges_by_gogreen"
                        )
                      }
                      options={qcChargesOptions}
                      isDisabled={InputDisableFunction()}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: errors?.qc_charges_by_gogreen
                            ? "red"
                            : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              {/* Normal Billing Cycle  */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    {" "}
                    Normal Billing Cycle<span style={{ color: "red" }}>
                      *
                    </span>{" "}
                  </Text>{" "}
                </GridItem>

                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <ReactSelect
                      value={selectedDropDownValue?.selectedExcessBillingCycle}
                      onChange={(val) =>
                        dropDownOnChange(
                          val,
                          "selectedExcessBillingCycle",
                          "excess_billing_cycle"
                        )
                      }
                      options={excessBillingCycleOptions}
                      isDisabled={InputDisableFunction()}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: errors?.excess_billing_cycle
                            ? "red"
                            : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* Storage rate on  */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    {" "}
                    Storage rate on<span style={{ color: "red" }}>*</span>{" "}
                  </Text>{" "}
                </GridItem>

                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    style={{ w: commonWidth.w }}
                    isInvalid={errors?.storage_rate_on}
                  >
                    <ReactSelect
                      name="storage_rate_on"
                      /// {...register("storage_rate_on")}
                      value={selectedDropDownValue?.selectedStorageRate}
                      onChange={(val) => {
                        console.log(val);

                        setReservationDatesState({
                          Reservation: {
                            startDate: "",
                            endDate: "",
                          },
                          "Post Reservation": {
                            startDate: "",
                            endDate: "",
                          },
                        });

                        if (val?.value === "MT") {
                          setValue("storage_rate_per_mt", null, {
                            shouldValidate: false,
                          });
                        }

                        setBagWiseDetailsArray([]);
                        setReservationDetailsArray([]);
                        setGroupReservationDetails({});
                        clearBagWiseRateDetailsForm();
                        dropDownOnChange(
                          val,
                          "selectedStorageRate",
                          "storage_rate_on"
                        );
                      }}
                      options={storageOnRateOptions}
                      isDisabled={InputDisableFunction()}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: errors?.storage_rate_on
                            ? "red"
                            : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/*  Reservation  */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Reservation <span style={{ color: "red" }}>*</span>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <ReactSelect
                      value={selectedDropDownValue?.selectedReservation}
                      name="reservation"
                      isDisabled={InputDisableFunction()}
                      onChange={(val) => {
                        console.log(val);
                        setServiceContractSmallestStartDateState("");
                        setServiceContractSmallestEndDateState("");
                        if (val?.value === "Yes") {
                          unregister("expected_quantity");
                          unregister("expected_no_of_bags");
                        }
                        setValue("expected_quantity", "", {
                          shouldValidate: false,
                        });
                        setValue("expected_no_of_bags", "", {
                          shouldValidate: false,
                        });

                        dropDownOnChange(
                          val,
                          "selectedReservation",
                          "reservation"
                        );
                      }}
                      options={reservationOptions}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: errors?.reservation ? "red" : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              {selectedDropDownValue?.selectedStorageRate?.value === "MT" && (
                <>
                  {/*  Storage rate / MT   */}
                  <Grid
                    textAlign="right"
                    alignItems="center"
                    my="3"
                    templateColumns={templateColumns}
                    gap={5}
                  >
                    <GridItem colSpan={{ base: 1, lg: 0 }}>
                      <Text textAlign="right">
                        Storage rate / MT<span style={{ color: "red" }}>*</span>{" "}
                      </Text>{" "}
                    </GridItem>
                    <GridItem colSpan={{ base: 1 }}>
                      <FormControl
                        isInvalid={errors?.storage_rate_per_mt}
                        style={{ w: commonWidth.w }}
                      >
                        <Input
                          type="number"
                          name="storage_rate_per_mt"
                          isDisabled={InputDisableFunction()}
                          step="0.01"
                          {...register("storage_rate_per_mt", {
                            required:
                              selectedDropDownValue?.selectedStorageRate
                                ?.value === "MT",
                          })}
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
                          placeholder="Storage Rate / MT"
                        />
                      </FormControl>

                      {/* {errors && errors?.storage_rate_per_mt?.message && (
                        <Text textAlign="left" color="red">
                          {errors?.storage_rate_per_mt?.message}
                        </Text>
                      )} */}
                    </GridItem>
                    <GridItem textAlign="left" alignItems="center" gap="">
                      <Box display="flex">
                        {/* <Button
                          bg="#A6CE39"
                          _hover={{}}
                          color="white"
                          // isLoading={
                          //   addServiceContractDataApiIsLoading ||
                          //   updateServiceContractDataApiIsLoading
                          // }

                          padding="0px 30px"
                          borderRadius={"50px"}
                          type="button"
                          onClick={() => checkPbpm()}
                        >
                          Check PBPM
                        </Button> */}

                        <Text mt="2" mx="4">
                          {parseFloat(getValues("pbpm_rate")).toFixed(2) ==
                          "NaN"
                            ? ""
                            : parseFloat(getValues("pbpm_rate")).toFixed(2)}
                        </Text>
                      </Box>
                    </GridItem>
                  </Grid>
                </>
              )}

              {selectedDropDownValue?.selectedStorageRate?.value === "Bag" && (
                <>
                  {/* Bag wise rate details* start*/}
                  <Box>
                    <Box
                      mt="10"
                      bgColor={"#DBFFF5"}
                      padding="20px"
                      borderRadius="10px"
                    >
                      <Heading as="h5" fontSize="lg" textAlign="left">
                        Bag wise rate details*
                      </Heading>

                      <>
                        <Box pt="10px">
                          {
                            // bagWiseRateDetails &&
                            // bagWiseRateDetails.length > 0 ? (
                            //   bagWiseRateDetails.map((item, index) => (
                            <Grid
                              //  key={`bag_size_${index}`}
                              alignItems="center"
                              my="3"
                              templateColumns="repeat(4, 1fr)"
                              gap={5}
                            >
                              <GridItem>
                                {/* --------------  Bag size-------------- */}
                                <Box>
                                  <Text my={1}>Bag size</Text>{" "}
                                  <Box>
                                    <FormControl
                                      style={{ w: commonWidth.w }}
                                      isInvalid={errors?.bag_size}
                                    >
                                      <ReactSelect
                                        name="bag_size"
                                        id="bag_wise_rate_details"
                                        // value={
                                        //   selectedDropDownValue?.selectedClient
                                        // }

                                        onChange={(val) => {
                                          console.log(val);

                                          setValue("bag_size", val, {
                                            shouldValidate: true,
                                          });
                                        }}
                                        options={bagSizeList}
                                        isDisabled={InputDisableFunction()}
                                        styles={{
                                          control: (base, state) => ({
                                            ...base,
                                            backgroundColor: "#fff",
                                            borderRadius: "6px",
                                            borderColor: errors?.bag_size
                                              ? "red"
                                              : "#c3c3c3",

                                            padding: "1px",
                                            textAlign: "left",
                                          }),
                                          ...reactSelectStyle,
                                        }}
                                      />
                                    </FormControl>
                                  </Box>
                                </Box>
                              </GridItem>
                              <GridItem>
                                {/* --------------  PBPM rate-------------- */}
                                <Box>
                                  <Text my={1}>
                                    PBPM rate
                                    <span style={{ color: "red" }}>*</span>
                                  </Text>{" "}
                                  <Box position="relative">
                                    <FormControl
                                      style={{ w: commonWidth.w }}
                                      isInvalid={errors?.pbpm_rate}
                                    >
                                      <Input
                                        type="number"
                                        name="pbpm_rate"
                                        {...register("pbpm_rate")}
                                        border="1px"
                                        borderColor="gray.10"
                                        backgroundColor={"white"}
                                        height={"15px "}
                                        borderRadius={"lg"}
                                        // value={item?.pbpm_rate}
                                        ///value={"2023"}
                                        isDisabled={true}
                                        _placeholder={commonStyle._placeholder}
                                        _hover={commonStyle._hover}
                                        _focus={commonStyle._focus}
                                        p={{ base: "4" }}
                                        fontWeight={{ base: "normal" }}
                                        fontStyle={"normal"}
                                        placeholder="PBPM rate"
                                      />
                                    </FormControl>
                                    {errors && errors?.pbpm_rate?.message && (
                                      <Text
                                        as="small"
                                        position="absolute"
                                        // display="block"
                                        textAlign="left"
                                        color="red"
                                      >
                                        {errors?.pbpm_rate?.message}
                                      </Text>
                                    )}
                                  </Box>
                                </Box>
                              </GridItem>
                              <GridItem>
                                {/* --------------  rate-------------- */}
                                <Box>
                                  <Text my={1}>
                                    rate<span style={{ color: "red" }}>*</span>
                                  </Text>{" "}
                                  <Box>
                                    <FormControl
                                      style={{ w: commonWidth.w }}
                                      isInvalid={errors?.rate}
                                      //isInvalid={errors?.[`rate[${index}]`]}
                                    >
                                      <Input
                                        type="number"
                                        step="0.01"
                                        name="rate"
                                        {...register("rate")}
                                        border="1px"
                                        borderColor="gray.10"
                                        backgroundColor={"white"}
                                        height={"15px"}
                                        borderRadius={"lg"}
                                        // value={
                                        //   getValues(`rate[${index}]`) || item.rate
                                        // }
                                        onChange={(e) => {
                                          console.log(e.target.value);
                                        }}
                                        isDisabled={false}
                                        _placeholder={commonStyle._placeholder}
                                        _hover={commonStyle._hover}
                                        _focus={commonStyle._focus}
                                        p={{ base: "4" }}
                                        fontWeight={{ base: "normal" }}
                                        fontStyle={"normal"}
                                        placeholder="rate"
                                      />
                                    </FormControl>
                                  </Box>
                                </Box>
                              </GridItem>
                              <GridItem>
                                {/* --------------  Check PBPM Button -------------- */}
                                <Box display="flex" gap="2">
                                  {/* <Box mt="6">
                                    <Button
                                      type="button"
                                      // isDisabled={pageView}
                                      backgroundColor={"primary.700"}
                                      _hover={{
                                        backgroundColor: "primary.700",
                                      }}
                                      color={"white"}
                                      borderRadius={"full"}
                                      // my={"4"}
                                      px={"10"}
                                      onClick={() => checkPbpm()}
                                    >
                                      Check PBPM
                                    </Button>
                                  </Box> */}
                                  {/* --------------  Add | Update Button -------------- */}
                                  <Box textAlign="left" mt="6">
                                    <Button
                                      type="button"
                                      // isDisabled={pageView}
                                      isDisabled={InputDisableFunction()}
                                      backgroundColor={"primary.700"}
                                      _hover={{
                                        backgroundColor: "primary.700",
                                      }}
                                      color={"white"}
                                      borderRadius={"full"}
                                      // my={"4"}
                                      px={"10"}
                                      onClick={() => addUpdateBagWiseRate()}
                                    >
                                      {isBagWiseDetailsEditState?.isEdit
                                        ? "Update"
                                        : "Add"}
                                    </Button>
                                  </Box>
                                </Box>
                              </GridItem>
                            </Grid>
                            // ))
                            //)
                            // : (
                            //   <Box>No data found</Box>
                            // )
                          }
                        </Box>
                      </>
                    </Box>
                  </Box>
                  {/* Bag wise rate details*  end    */}
                  {/* bagWise details table start */}
                  <TableContainer mt="4">
                    <Table color="#000">
                      <Thead bg="#dbfff5" border="1px" borderColor="#000">
                        <Tr style={{ color: "#000" }}>
                          <Th color="#000">Sr no</Th>
                          <Th color="#000">Bag Size</Th>
                          <Th color="#000">PBPM Rate</Th>
                          <Th color="#000">Rate</Th>
                          <Th color="#000">Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {bagWiseDetailsArray &&
                          bagWiseDetailsArray?.map((item, i) => (
                            <Tr
                              key={`bag_wise_details_${i}`}
                              textAlign="center"
                              bg="white"
                              border="1px"
                              borderColor="#000"
                            >
                              <Td>{i + 1} </Td>
                              <Td>{item?.bag_size?.label} </Td>

                              <Td>{item?.pbpm_rate} </Td>
                              <Td>{item?.rate}</Td>

                              <Td>
                                <Box display="flex" alignItems="center" gap="3">
                                  <Flex gap="20px" justifyContent="center">
                                    <Box color={"primary.700"}>
                                      <Button
                                        isDisabled={InputDisableFunction()}
                                        onClick={() =>
                                          bagWiseRateDetailsOnEdit(item, i)
                                        }
                                      >
                                        <BiEditAlt
                                          // color="#A6CE39"
                                          fontSize="26px"
                                          cursor="pointer"
                                        />
                                      </Button>
                                    </Box>
                                    <Box color="red">
                                      <Button
                                        isDisabled={InputDisableFunction()}
                                        onClick={() => {
                                          deleteBagWiseRateDetails(i);
                                        }}
                                      >
                                        <AiOutlineDelete
                                          cursor="pointer"
                                          fontSize="26px"
                                        />
                                      </Button>
                                    </Box>
                                  </Flex>
                                </Box>
                              </Td>
                            </Tr>
                          ))}
                        {bagWiseDetailsArray?.length === 0 && (
                          <Tr
                            textAlign="center"
                            bg="white"
                            border="1px"
                            borderColor="#000"
                          >
                            <Td textAlign="center" colSpan={4}>
                              No record found.
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer>
                  {/*bagWise Details details table end */}
                </>
              )}

              {selectedDropDownValue?.selectedReservation?.value === "Yes" && (
                <>
                  {/* Reservation details*  starts*/}
                  <Box>
                    <Box
                      mt="10"
                      id="reservation_details"
                      bgColor={"#DBFFF5"}
                      padding="20px"
                      borderRadius="10px"
                    >
                      <Heading as="h5" fontSize="lg" textAlign="left">
                        Reservation details*
                      </Heading>

                      <>
                        <Box pt="10px">
                          <Grid
                            alignItems="center"
                            my="3"
                            templateColumns="repeat(3, 1fr)"
                            gap={5}
                          >
                            {/* -------------- Post Reservation / Reservation  -------------- */}
                            <Box>
                              <Text my={1}>
                                Reservation Type{" "}
                                <span style={{ color: "red" }}>*</span>{" "}
                              </Text>{" "}
                              <FormControl style={{ w: commonWidth.w }}>
                                <ReactSelect
                                  name="reservation_type"
                                  value={
                                    selectedDropDownValue?.selected_reservation_type
                                  }
                                  onChange={(val) => {
                                    setSelectedDropDownValue((prev) => ({
                                      ...prev,
                                      selected_reservation_type: val,
                                    }));
                                    setValue("reservation_type", val, {
                                      shouldValidate: true,
                                    });

                                    setValue("reservation_start_date", "", {
                                      shouldValidate: true,
                                    });
                                  }}
                                  options={[
                                    {
                                      label: "Post Reservation",
                                      value: "Post Reservation",
                                    },
                                    {
                                      label: "Reservation",
                                      value: "Reservation",
                                    },
                                  ]}
                                  //isDisabled={true}
                                  isDisabled={
                                    InputDisableFunction() ||
                                    isDisabledReservationType
                                  }
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor:
                                        errors?.reservation_type ||
                                        errors?.reservation_type?.label
                                          ? "red"
                                          : "#c3c3c3",

                                      padding: "1px",
                                      textAlign: "left",
                                    }),
                                    ...reactSelectStyle,
                                  }}
                                />
                              </FormControl>
                            </Box>

                            {selectedDropDownValue?.selectedStorageRate
                              ?.value === "Bag" ? (
                              <>
                                {/* -------------- Reservation Bag size -------------- */}
                                <Box>
                                  <Text my={1}>
                                    Reservation Bag size{" "}
                                    <span style={{ color: "red" }}>*</span>{" "}
                                  </Text>{" "}
                                  <FormControl
                                    style={{ w: commonWidth.w }}
                                    // isInvalid={errors?.reservation_bag_size}
                                  >
                                    <ReactSelect
                                      name="reservation_bag_size"
                                      value={
                                        selectedDropDownValue?.selected_reservation_bag_size
                                      }
                                      onChange={(val) => {
                                        setSelectedDropDownValue((prev) => ({
                                          ...prev,
                                          selected_reservation_bag_size: val,
                                        }));
                                        setValue("reservation_bag_size", val, {
                                          shouldValidate: true,
                                        });
                                      }}
                                      options={reservationBagSizeList}
                                      isDisabled={InputDisableFunction()}
                                      styles={{
                                        control: (base, state) => ({
                                          ...base,
                                          backgroundColor: "#fff",
                                          borderRadius: "6px",
                                          borderColor:
                                            errors?.reservation_bag_size
                                              ? "red"
                                              : "#c3c3c3",

                                          padding: "1px",
                                          textAlign: "left",
                                        }),
                                        ...reactSelectStyle,
                                      }}
                                    />
                                  </FormControl>
                                </Box>
                                {/* --------------  Reserved no of bags-------------- */}
                                <Box>
                                  {/* Reserved no of bags  */}
                                  <Text my={1}>
                                    Reserved no of bags{" "}
                                    <span style={{ color: "red" }}>*</span>{" "}
                                  </Text>{" "}
                                  <FormControl
                                    style={{ w: commonWidth.w }}
                                    isInvalid={errors?.reserved_no_of_bags}
                                  >
                                    <Input
                                      type="number"
                                      name="reserved_no_of_bags"
                                      {...register("reserved_no_of_bags")}
                                      border="1px"
                                      isDisabled={InputDisableFunction()}
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
                                      placeholder="Reserved No Of Bags"
                                    />
                                  </FormControl>
                                </Box>
                              </>
                            ) : (
                              <>
                                {/* --------------  Reservation MT-------------- */}
                                <Box>
                                  <Text my={1}>
                                    Reservation MT
                                    <span style={{ color: "red" }}>*</span>
                                  </Text>{" "}
                                  <Box>
                                    <FormControl
                                      style={{ w: commonWidth.w }}
                                      isInvalid={
                                        errors?.reservation_storage_rate_mt
                                      }
                                    >
                                      <Input
                                        type="number"
                                        name="reservation_storage_rate_mt"
                                        {...register(
                                          "reservation_storage_rate_mt"
                                        )}
                                        border="1px"
                                        borderColor="gray.10"
                                        backgroundColor={"white"}
                                        isDisabled={InputDisableFunction()}
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
                                        placeholder="Reservation storage rate mt"
                                      />
                                    </FormControl>
                                  </Box>
                                </Box>
                              </>
                            )}

                            {/* --------------  Start date-------------- */}
                            <Box>
                              <Text my={1}>
                                Start date
                                <span style={{ color: "red" }}>*</span>
                              </Text>{" "}
                              <Box>
                                <FormControl
                                  style={{ w: commonWidth.w }}
                                  isInvalid={errors?.reservation_start_date}
                                >
                                  <Input
                                    type="date"
                                    //  min={moment().format("YYYY-MM-DD")}
                                    //max={reservationDetailsStartDateMax()}
                                    id="reservation_start_date"
                                    name="reservation_start_date"
                                    {...register("reservation_start_date")}
                                    border="1px"
                                    borderColor="gray.10"
                                    backgroundColor={"white"}
                                    isDisabled={
                                      !selectedDropDownValue
                                        ?.selected_reservation_type?.label ||
                                      InputDisableFunction()
                                    }
                                    onChange={(e) => {
                                      setValue("reservation_end_date", "", {
                                        shouldValidate: true,
                                      });
                                      setReservationDates((prev) => ({
                                        ...prev,
                                        startDate: e?.target?.value,
                                        endDate: "",
                                      }));

                                      setReservationDatesState((prev) => ({
                                        Reservation: {
                                          ...prev.Reservation,
                                          startDate: e?.target?.value,
                                          endDate: "",
                                        },
                                      }));
                                    }}
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
                                    placeholder="Start date"
                                  />
                                </FormControl>
                              </Box>
                            </Box>
                            {/* --------------  End date-------------- */}
                            <Box>
                              <Text my={1}>
                                End date<span style={{ color: "red" }}>*</span>
                                {/* {reservationDatesState?.Reservation?.startDate} */}
                              </Text>{" "}
                              <Box>
                                <FormControl
                                  style={{ w: commonWidth.w }}
                                  isInvalid={errors?.reservation_end_date}
                                >
                                  <Input
                                    type="date"
                                    name="reservation_end_date"
                                    {...register("reservation_end_date")}
                                    border="1px"
                                    min={
                                      reservationDatesState?.["Reservation"]
                                        ?.startDate
                                        ? moment(
                                            reservationDatesState?.[
                                              "Reservation"
                                            ]?.startDate
                                          )
                                            .add(1, "days")
                                            .format("YYYY-MM-DD")
                                        : moment().format("YYYY-MM-DD")
                                    }
                                    borderColor="gray.10"
                                    isDisabled={
                                      !selectedDropDownValue
                                        ?.selected_reservation_type?.label ||
                                      reservationDatesState?.Reservation
                                        ?.startDate === "" ||
                                      InputDisableFunction()
                                    }
                                    backgroundColor={"white"}
                                    height={"15px"}
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
                                    placeholder="End date"
                                  />
                                </FormControl>
                              </Box>
                            </Box>
                            {/* --------------  PBPM rate-------------- */}
                            <Box>
                              <Text my={1}>
                                PBPM rate{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Text>{" "}
                              <Box>
                                <FormControl
                                  style={{ w: commonWidth.w }}
                                  isInvalid={errors?.reservation_pbpm_rate}
                                >
                                  <Input
                                    type="number"
                                    name="reservation_pbpm_rate"
                                    step="0.001"
                                    {...register("reservation_pbpm_rate")}
                                    border="1px"
                                    borderColor="gray.10"
                                    isDisabled={InputDisableFunction()}
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
                                    placeholder="PBPM rate"
                                  />
                                </FormControl>
                                {errors &&
                                  errors?.reservation_pbpm_rate?.message && (
                                    <Text textAlign="left" color="red">
                                      {errors?.reservation_pbpm_rate?.message}
                                    </Text>
                                  )}
                              </Box>
                            </Box>
                            {/* --------------  Reservation rate-------------- */}
                            <Box>
                              <Text my={1}>
                                Reservation rate
                                <span style={{ color: "red" }}>*</span>
                              </Text>{" "}
                              <Box>
                                <FormControl
                                  style={{ w: commonWidth.w }}
                                  isInvalid={errors?.reservation_rate}
                                >
                                  <Input
                                    type="number"
                                    name="reservation_rate"
                                    {...register("reservation_rate")}
                                    step="0.01"
                                    border="1px"
                                    borderColor="gray.10"
                                    backgroundColor={"white"}
                                    height={"15px "}
                                    borderRadius={"lg"}
                                    isDisabled={InputDisableFunction()}
                                    //value={inputValue}
                                    //  onChange={onChange}
                                    _placeholder={commonStyle._placeholder}
                                    _hover={commonStyle._hover}
                                    _focus={commonStyle._focus}
                                    //  isDisabled={true}
                                    p={{ base: "4" }}
                                    fontWeight={{ base: "normal" }}
                                    fontStyle={"normal"}
                                    placeholder="Reservation rate"
                                  />
                                </FormControl>
                                {errors && errors?.rate?.message && (
                                  <Text textAlign="left" color="red">
                                    {errors?.rate?.message}
                                  </Text>
                                )}
                              </Box>
                            </Box>

                            {/* --------------  Billing Cycle-------------- */}
                            <Box>
                              <Text my={1}>
                                Billing Cycle{" "}
                                <span style={{ color: "red" }}>*</span>
                              </Text>{" "}
                              <FormControl
                                style={{ w: commonWidth.w }}
                                // isInvalid={errors?.reservation_billing_cycle}
                              >
                                <ReactSelect
                                  value={
                                    selectedDropDownValue?.selectedReservationBillingCycle
                                  }
                                  onChange={(val) =>
                                    dropDownOnChange(
                                      val,
                                      "selectedReservationBillingCycle",
                                      "reservation_billing_cycle"
                                    )
                                  }
                                  options={reservationBillingCycleOptions}
                                  isDisabled={InputDisableFunction()}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor:
                                        errors?.reservation_billing_cycle
                                          ? "red"
                                          : "#c3c3c3",

                                      padding: "1px",
                                      textAlign: "left",
                                    }),
                                    ...reactSelectStyle,
                                  }}
                                />
                              </FormControl>
                            </Box>
                          </Grid>
                          <Flex
                            gap="10px"
                            justifyContent="end"
                            alignItems="center"
                          >
                            <Button
                              bg="#A6CE39"
                              isDisabled={InputDisableFunction()}
                              _hover={{}}
                              color="white"
                              padding="0px 20px"
                              borderRadius={"50px"}
                              type="button"
                              onClick={() => {
                                addUpdateReservation();
                              }}
                            >
                              {isReservationDetailsEditState?.isEdit
                                ? "Update"
                                : "Add"}
                            </Button>
                          </Flex>
                        </Box>
                      </>
                    </Box>
                  </Box>

                  {/* Reservation details table start */}

                  <TableContainer mt="4">
                    <Table variant="simple">
                      <Thead>
                        <Tr style={{ color: "#000" }}>
                          {tableHeaders.map((header, index) => (
                            <Th style={{ color: "#000" }} key={index}>
                              {header}
                            </Th>
                          ))}
                        </Tr>
                      </Thead>
                      {/* <Tbody>
                        {groupedReservationDetails &&
                          Object.keys(groupedReservationDetails).map(
                            (reservationType) =>
                              renderRows(
                                reservationType,
                                groupedReservationDetails[reservationType]
                              )
                          )}
                      </Tbody> */}
                      <Tbody>
                        <React.Fragment>
                          {reservationDetailsArray &&
                            reservationDetailsArray?.map((item, i) => (
                              <Tr key={i}>
                                <Td>{item?.reservation_type?.value}</Td>
                                <Td>{item.reservation_storage_rate_mt}</Td>
                                <Td>
                                  {item?.reservation_bag_size?.label || "-"}{" "}
                                </Td>
                                <Td>{item?.reserved_no_of_bags || "-"} </Td>
                                <Td>
                                  {moment(item.reservation_start_date).format(
                                    "DD-MM-YYYY"
                                  )}
                                </Td>
                                <Td>
                                  {moment(item.reservation_end_date).format(
                                    "DD-MM-YYYY"
                                  )}
                                </Td>
                                <Td>{item.reservation_pbpm_rate}</Td>
                                <Td>{item.reservation_rate}</Td>
                                {/* <Td>{item.reservation_billing_cycle.label}</Td> */}
                                <Td>
                                  {
                                    selectedReservationBillingCycle[
                                      item?.reservation_type?.value
                                    ]
                                  }
                                </Td>
                                <Td>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap="3"
                                  >
                                    <Flex gap="20px" justifyContent="center">
                                      <Box color={"primary.700"}>
                                        <Button
                                          isDisabled={InputDisableFunction()}
                                          onClick={() =>
                                            reservationDetailsOnEdit(item, i)
                                          }
                                        >
                                          <BiEditAlt
                                            // color="#A6CE39"
                                            fontSize="26px"
                                            cursor="pointer"
                                          />
                                        </Button>
                                      </Box>
                                      <Box color="red">
                                        <Button
                                          isDisabled={InputDisableFunction()}
                                          onClick={() =>
                                            deleteReservationDetails(i)
                                          }
                                        >
                                          <AiOutlineDelete
                                            cursor="pointer"
                                            fontSize="26px"
                                          />
                                        </Button>
                                      </Box>
                                    </Flex>
                                  </Box>
                                </Td>
                              </Tr>
                            ))}
                        </React.Fragment>

                        {reservationDetailsArray.length === 0 && (
                          <Tr
                            textAlign="center"
                            bg="white"
                            border="1px"
                            borderColor="#000"
                          >
                            <Td textAlign="center" colSpan={7}>
                              No record found.
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer>

                  {/* <TableContainer mt="4">
                    <Table color="#000">
                      <Thead bg="#dbfff5" border="1px" borderColor="#000">
                        <Tr style={{ color: "#000" }}>
                          <Th color="#000">Sr no</Th>
                          <Th color="#000">Reservation Type</Th>
                          <Th color="#000">Reservation MT</Th>
                          <Th color="#000">Reservation Size</Th>
                          <Th color="#000">Reserved no of bags</Th>

                          <Th color="#000">Start date</Th>
                          <Th color="#000">End date</Th>
                          <Th color="#000">pbpm rate</Th>
                          <Th color="#000">Reservation Rate</Th>
                          <Th color="#000">Billing cycle</Th>

                          <Th color="#000">Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {Object.entries(groupedReservationDetails).map(
                          ([type, data], index) => (
                            <React.Fragment key={index}>
                              <Tr>
                                <Td colSpan="7">{type}</Td>
                              </Tr>
                              {data.map((item, i) => (
                                <Tr key={i}>
                                  <Td></Td>
                                  <Td>{item.reservation_storage_rate_mt}</Td>
                                  <Td>
                                    {item?.reservation_bag_size?.label || "-"}{" "}
                                  </Td>
                                  <Td>{item?.reserved_no_of_bags || "-"} </Td>
                                  <Td>{item.reservation_start_date}</Td>
                                  <Td>{item.reservation_end_date}</Td>
                                  <Td>{item.reservation_pbpm_rate}</Td>
                                  <Td>{item.reservation_rate}</Td>
                                  <Td>
                                    {item.reservation_billing_cycle.label}
                                  </Td>
                                  <Td>
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      gap="3"
                                    >
                                      <Flex gap="20px" justifyContent="center">
                                        <Box color={"primary.700"}>
                                          <BiEditAlt
                                            // color="#A6CE39"
                                            fontSize="26px"
                                            cursor="pointer"
                                            onClick={() =>
                                              reservationDetailsOnEdit(item, i)
                                            }
                                          />
                                        </Box>
                                        <Box color="red">
                                          <AiOutlineDelete
                                            cursor="pointer"
                                            fontSize="26px"
                                            onClick={() => {
                                              deleteReservationDetails(i);
                                            }}
                                          />
                                        </Box>
                                      </Flex>
                                    </Box>
                                  </Td>
                                </Tr>
                              ))}
                            </React.Fragment>
                          )
                        )}

                        {reservationDetails.length === 0 && (
                          <Tr
                            textAlign="center"
                            bg="white"
                            border="1px"
                            borderColor="#000"
                          >
                            <Td textAlign="center" colSpan={7}>
                              No record found.
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer> */}
                  {/*Reservation details table end */}
                </>
              )}

              {/* If Reservation is select No */}

              {selectedDropDownValue?.selectedReservation?.value === "No" && (
                <>
                  <Grid
                    textAlign="right"
                    alignItems="center"
                    my="3"
                    templateColumns={templateColumns}
                    gap={5}
                  >
                    {/* --------------  Expected quantity(MT) -------------- */}
                    <GridItem colSpan={{ base: 1, lg: 0 }}>
                      <Text textAlign="right">
                        Expected quantity(MT){" "}
                        <span style={{ color: "red" }}>*</span>
                      </Text>{" "}
                    </GridItem>
                    <GridItem colSpan={{ base: 1 }}>
                      <FormControl
                        style={{ w: commonWidth.w }}
                        isInvalid={errors?.expected_quantity}
                      >
                        <Input
                          type="number"
                          step="0.01"
                          name="expected_quantity"
                          {...register("expected_quantity", {
                            required: false,
                          })}
                          border="1px"
                          borderColor="gray.10"
                          backgroundColor={"white"}
                          height={"15px "}
                          borderRadius={"lg"}
                          // value={
                          //   getValues(`rate[${index}]`) ||
                          //   item.rate
                          // }
                          onChange={(e) => {
                            console.log(e.target.value);
                            let num = parseFloat(e.target.value || 0);

                            if (num > 0 || num === 0) {
                              // ! comment the un used variable ..
                              // const updatedArr = [...bagWiseRateDetails];
                              // updatedArr[index] = {
                              //   ...item,
                              //   rate: num,
                              // };
                              // setValue(`rate[${index}]`, num, {
                              //   shouldValidate: true,
                              // });
                              // setBagWiseRateDetails([
                              //   ...updatedArr,
                              // ]);
                            } else {
                              // setError(`rate[${index}]`, {
                              //   type: "manual",
                              //   message: "",
                              // });
                            }
                          }}
                          isDisabled={false}
                          _placeholder={commonStyle._placeholder}
                          _hover={commonStyle._hover}
                          _focus={commonStyle._focus}
                          p={{ base: "4" }}
                          fontWeight={{ base: "normal" }}
                          fontStyle={"normal"}
                          placeholder="Expected quantity(MT)"
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                  <Grid
                    textAlign="right"
                    alignItems="center"
                    my="3"
                    templateColumns={templateColumns}
                    gap={5}
                  >
                    {/* --------------  Expected no of bags-------------- */}
                    <GridItem colSpan={{ base: 1, lg: 0 }}>
                      <Text textAlign="right">
                        Expected no of bags{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Text>{" "}
                    </GridItem>
                    <GridItem colSpan={{ base: 1 }}>
                      <FormControl
                        style={{ w: commonWidth.w }}
                        isInvalid={errors?.expected_no_of_bags}
                      >
                        <Input
                          type="number"
                          step="0.01"
                          name="expected_no_of_bags"
                          {...register("expected_no_of_bags", {
                            required: false,
                          })}
                          border="1px"
                          borderColor="gray.10"
                          backgroundColor={"white"}
                          height={"15px "}
                          borderRadius={"lg"}
                          // value={
                          //   getValues(`rate[${index}]`) ||
                          //   item.rate
                          // }
                          onChange={(e) => {
                            console.log(e.target.value);
                            let num = parseFloat(e.target.value || 0);

                            if (num > 0 || num === 0) {
                              // ! commented un used variable ..
                              // const updatedArr = [...bagWiseRateDetails];
                              // updatedArr[index] = {
                              //   ...item,
                              //   rate: num,
                              // };
                              // setValue(`rate[${index}]`, num, {
                              //   shouldValidate: true,
                              // });
                              // setBagWiseRateDetails([
                              //   ...updatedArr,
                              // ]);
                            } else {
                              // setError(`rate[${index}]`, {
                              //   type: "manual",
                              //   message: "",
                              // });
                            }
                          }}
                          isDisabled={false}
                          _placeholder={commonStyle._placeholder}
                          _hover={commonStyle._hover}
                          _focus={commonStyle._focus}
                          p={{ base: "4" }}
                          fontWeight={{ base: "normal" }}
                          fontStyle={"normal"}
                          placeholder="Expected no of bags"
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                </>
              )}

              {/* Agreement details :  :   */}
              <Grid
                textAlign="right"
                alignItems="center"
                my={3}
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right" color={"#212121"}>
                    Agreement details :
                  </Text>{" "}
                </GridItem>
              </Grid>

              {/* ------SERVICE CONTRACT START DATE------------- */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                Q
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Service Contract Start Date
                    <span style={{ color: "red" }}>*</span>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={errors?.service_contract_start_date}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      type="date"
                      name="service_contract_start_date"
                      {...register("service_contract_start_date")}
                      border="1px"
                      format="YYYY/MM/DD"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      // max={""}
                      // max={moment(
                      //   getValues("service_contract_start_date")
                      // ).format("YYYY-MM-DD")}
                      //  max={reservationDetailsStartDateMax()}
                      max={
                        getValues("reservation")?.value === "Yes"
                          ? serviceContractSmallestStartDateState
                          : ""
                      }
                      isDisabled={InputDisableFunction()}
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
                      placeholder="Service Contract Start Date"
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              {/* ------ SERVICE CONTRACT END DATE------------- */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Service Contract End Date
                    <span style={{ color: "red" }}>*</span>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={errors?.service_contract_end_date}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      type="date"
                      name="service_contract_end_date"
                      {...register("service_contract_end_date")}
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      // min={serviceContractSmallestEndDateState}
                      // min={""}
                      min={
                        getValues("reservation")?.value === "Yes"
                          ? serviceContractSmallestEndDateState
                          : ""
                      }
                      // min={moment(
                      //   getValues("service_contract_end_date")
                      // ).format("YYYY-MM-DD")}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      isDisabled={InputDisableFunction()}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      onChange={(e) => {
                        handleEndDateChange(e);
                      }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Service Contract End Date"
                    />
                  </FormControl>

                  {errors && errors?.service_contract_end_date && (
                    <Box textAlign="left">
                      <Text as="small" color="red.500">
                        {errors?.service_contract_end_date?.message}
                      </Text>
                    </Box>
                  )}
                </GridItem>
              </Grid>

              {/* Service Contract Billing End Date */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Service Contract Billing End Date
                    <span style={{ color: "red" }}>*</span>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={errors?.service_contract_billing_end_date}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      type="date"
                      name="service_contract_billing_end_date"
                      {...register("service_contract_billing_end_date")}
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      // value={getValues("service_contract_end_date")}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      isDisabled={true}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      //onChange={(e) => handleEndDateChange(e)}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Service Contract Billing End Date"
                    />
                  </FormControl>

                  {/* {errors && errors?.service_contract_end_date && (
                    <Box textAlign="left">
                      <Text as="small" color="red.500">
                        {errors?.service_contract_end_date?.message}
                      </Text>
                    </Box>
                  )} */}
                </GridItem>
              </Grid>

              {/* ------ Upload signed  Service Contract------------- */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Upload signed Service Contract
                    <span style={{ color: "red" }}>*</span>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FileUploadCmp
                    label=""
                    name="upload_signed_service_contract"
                    fileName={getValues("upload_signed_service_contract")}
                    isError={errors?.upload_signed_service_contract}
                    type="application/pdf, image/jpeg, image/png, image/jpg, application/msword"
                    defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                    placeholder="Choose a file"
                    allowedTypes={[
                      "application/pdf",
                      "image/jpeg",
                      "image/png",
                      "image/jpg",
                      // "application/vnd.ms-excel", // XLS file type
                      // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX file type
                      "application/msword", // DOC file type
                    ]}
                    fileuplaod_folder_structure={{
                      type: "Service Contract",
                      subtype: "Service Contract(PWH)",
                    }}
                    isMultipalUpload={false}
                    isDisabled={InputDisableFunction()}
                    //  clearFileName={clearFileName}
                    maxFileSize={1024 * 1024} // For example, 1MB (1024 bytes * 1024 bytes)
                    onChange={(url) => {
                      handleFileChange(url, "upload_signed_service_contract");
                      setUploadedSignedServiceContract((prev) => [
                        ...prev,
                        url,
                      ]);
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
                    {uploadedSignedServiceContract.map((url, ind) => (
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
                          {url}
                        </Box>
                        <Box
                          cursor="pointer"
                          display="flex"
                          gap="2"
                          alignItems="center"
                        >
                          <Button p="1" isDisabled={InputDisableFunction()}>
                            <DownloadFilesFromUrl
                              details={{
                                paths: [url],
                                fileName: "file_download",
                              }}
                              iconFontSize="20px"
                            />
                          </Button>
                          <Button
                            isDisabled={InputDisableFunction()}
                            p="1"
                            onClick={() => deleteFile(ind)}
                          >
                            <AiFillDelete color="red" />
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </GridItem>
              </Grid>

              <Box>
                {Number(details?.status?.status_code || 0) > 0 ? (
                  <>
                    <Grid
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">
                          Maker name<span style={{ color: "red" }}>*</span>
                        </Text>{" "}
                      </GridItem>

                      <GridItem colSpan={{ base: 1 }}>
                        <Box>
                          <Input
                            disabled={true}
                            type="text"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            value={details?.l1_user?.employee_name || ""}
                            //  isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Reason for rejection"
                          />
                        </Box>
                      </GridItem>
                    </Grid>
                    <Grid
                      textAlign="right"
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">Maker mobile no</Text>{" "}
                      </GridItem>

                      <GridItem colSpan={{ base: 1 }}>
                        <Box>
                          <Input
                            disabled={true}
                            type="text"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            value={details?.l1_user?.phone || ""}
                            //  isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Reason for rejection"
                          />
                        </Box>
                      </GridItem>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
                {Number(details?.status?.status_code || 0) > 2 ? (
                  <>
                    <Grid
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">Checker name</Text>{" "}
                      </GridItem>

                      <GridItem colSpan={{ base: 1 }}>
                        <Box>
                          <Input
                            disabled={true}
                            type="text"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            value={details?.l2_user?.employee_name || ""}
                            //  isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Reason for rejection"
                          />
                        </Box>
                      </GridItem>
                    </Grid>
                    <Grid
                      textAlign="right"
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">Checker mobile no</Text>{" "}
                      </GridItem>

                      <GridItem colSpan={{ base: 1 }}>
                        <Box>
                          <Input
                            disabled={true}
                            type="text"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            value={details?.l2_user?.phone || ""}
                            //  isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Reason for rejection"
                          />
                        </Box>
                      </GridItem>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
                {Number(details?.status?.status_code || 0) > 5 ? (
                  <>
                    <Grid
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">Reviewer name</Text>{" "}
                      </GridItem>

                      <GridItem colSpan={{ base: 1 }}>
                        <Box>
                          <Input
                            disabled={true}
                            type="text"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            value={details?.l3_user?.employee_name || ""}
                            //  isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Reason for rejection"
                          />
                        </Box>
                      </GridItem>
                    </Grid>
                    <Grid
                      textAlign="right"
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">Reviewer mobile no</Text>{" "}
                      </GridItem>

                      <GridItem colSpan={{ base: 1 }}>
                        <Box>
                          <Input
                            disabled={true}
                            type="text"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            value={details?.l3_user?.phone || ""}
                            //  isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Reason for rejection"
                          />
                        </Box>
                      </GridItem>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
                {Number(details?.status?.status_code || 0) === 2 ||
                Number(details?.status?.status_code || 0) === 5 ? (
                  <Box>
                    <Grid
                      textAlign="right"
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">Reason for rejection</Text>{" "}
                      </GridItem>

                      <GridItem colSpan={{ base: 1 }}>
                        <Box>
                          <Input
                            type="text"
                            border="1px"
                            name="rejectReason_text"
                            {...register("rejectReason_text")}
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            onChange={(e) => {
                              setRejectReason(e.target.value);
                            }}
                            value={rejectReason}
                            isDisabled={InputDisableFunction()}
                            // _placeholder={commonStyle._placeholder}
                            // _hover={commonStyle._hover}
                            // _focus={commonStyle._focus}
                            //  isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Reason for rejection"
                          />
                        </Box>
                      </GridItem>
                    </Grid>
                  </Box>
                ) : (
                  <></>
                )}
              </Box>

              {/* <Flex gap="10px" justifyContent="end" alignItems="center">
                <Button
                  bg="#A6CE39"
                  _hover={{}}
                  color="white"
                  isLoading={
                    addServiceContractDataApiIsLoading ||
                    updateServiceContractDataApiIsLoading
                  }
                  marginTop={"30px"}
                  padding="0px 30px"
                  borderRadius={"50px"}
                  type="submit"
                >
                  Submit
                </Button>
              </Flex> */}
              <Box
                display="flex"
                gap={2}
                justifyContent="flex-end"
                mt="10"
                px="0"
              >
                {Number(details?.status?.status_code || 0) === 1 ||
                Number(details?.status?.status_code || 0) === 3 ? (
                  <Button
                    type="button"
                    backgroundColor={"primary.700"}
                    _hover={{ backgroundColor: "primary.700" }}
                    color={"white"}
                    borderRadius={"full"}
                    isDisabled={pageView}
                    // isDisabled={view}
                    isLoading={updateAssignServiceMasterApiIsLoading}
                    onClick={() => {
                      if (pageView) {
                      } else {
                        assignToMeFunction();
                      }
                    }}
                    px={"10"}
                  >
                    Assign to me
                  </Button>
                ) : (
                  <></>
                )}
                {Number(details?.status?.status_code || 0) === 2 ||
                Number(details?.status?.status_code || 0) === 5 ? (
                  <>
                    <Button
                      type="button"
                      // type="submit"
                      //w="full"
                      isDisabled={InputDisableFunction()}
                      backgroundColor={"white"}
                      _hover={{ backgroundColor: "white" }}
                      color={"#F82F2F"}
                      borderRadius={"full"}
                      border="1px solid #F82F2F"
                      onClick={() => {
                        rejectedToMeFunction({ status: "rejected" });
                      }}
                      // isDisabled={rejectReason || !view ? false : true}
                      isLoading={updateAssignServiceMasterApiIsLoading}
                      px={"10"}
                    >
                      Reject
                    </Button>
                    <Button
                      // type="button"
                      type="submit"
                      // onClick={() => {
                      //   approvedToMeFunction({ status: "approved" });
                      // }}
                      backgroundColor={"primary.700"}
                      _hover={{ backgroundColor: "primary.700" }}
                      color={"white"}
                      isDisabled={InputDisableFunction()}
                      borderRadius={"full"}
                      // isDisabled={view ? true : false}
                      isLoading={
                        updateAssignServiceMasterApiIsLoading ||
                        updateServiceContractDataApiIsLoading
                      }
                      px={"10"}
                    >
                      Approve
                    </Button>
                  </>
                ) : (
                  <></>
                )}
                {Number(details?.status?.status_code || 0) < 1 ? (
                  <Button
                    type="submit"
                    //w="full"
                    isLoading={
                      addServiceContractDataApiIsLoading ||
                      updateServiceContractDataApiIsLoading
                    }
                    isDisabled={pageView}
                    backgroundColor={"primary.700"}
                    _hover={{ backgroundColor: "primary.700" }}
                    color={"white"}
                    borderRadius={"full"}
                    // my={"4"}
                    px={"10"}
                  >
                    Submit
                  </Button>
                ) : (
                  <></>
                )}
              </Box>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </>
  );
};

export default AddEditServiceContractPwh;

const toValidateChamberDetailsSchema = (formData) => {
  const schema = chamberDetailsSchema;

  try {
    schema.validateSync(formData, { abortEarly: false });
  } catch (errors) {
    const validationErrors = {};

    errors.inner.forEach((error) => {
      validationErrors[error.path] = error.message;
    });

    throw validationErrors;
  }
};

// ! comment un used function ..
// const toValidateContractCommodity_Bag_size_Schema = (formData) => {
//   const schema = contractCommodity_Bag_size_Schema;

//   try {
//     schema.validateSync(formData, { abortEarly: false });
//   } catch (errors) {
//     console.log("schema validation failed -->", errors);
//     const validationErrors = {};

//     errors.inner.forEach((error) => {
//       validationErrors[error.path] = error.message;
//     });

//     throw validationErrors;
//   }
// };

// ! commented un used function ..
// const toValidateReservationDetailsSchema = (formData) => {
//   console.log("form data --> ", formData);
//   const schema = validateReservationDetailsFormData(formData);

//   try {
//     schema.validateSync(formData, { abortEarly: false });
//   } catch (errors) {
//     const validationErrors = {};

//     errors.inner.forEach((error) => {
//       validationErrors[error.path] = error.message;
//     });

//     throw validationErrors;
//   }
// };

function validateBagWiseRateDetailsFormData(formData) {
  const validationSchema = yup.object().shape({
    bag_size: yup
      .object()
      .shape({
        label: yup.string().required(() => null),
        value: yup.string().required(() => null),
      })
      .required(() => null),
    pbpm_rate: yup
      .number()
      .typeError("")
      .required(() => null),
    rate: yup
      .number()
      .typeError("")
      .required(() => null),
  });

  try {
    return validationSchema.validateSync(formData, { abortEarly: false });
  } catch (errors) {
    const validationErrors = {};

    errors.inner.forEach((error) => {
      validationErrors[error.path] = error?.message;
    });

    throw validationErrors;
  }
}

function validateReservationDetailsFormData(formData) {
  console.log(formData);
  const validationSchema = yup.object().shape({
    reservation_type: yup
      .object()
      .shape({
        label: yup.string().required(() => null),
        value: yup.string().required(() => null),
      })
      .required(() => null),

    reservation_start_date: yup
      .date()
      .typeError("Start date must be a valid date")
      .required(() => null),
    reservation_end_date: yup
      .date()
      .typeError("End date must be a valid date")
      .required(() => null),

    reservation_pbpm_rate: yup
      .number()
      .positive("PBPM rate must be a positive number")
      .typeError()
      .required(() => null),

    reservation_rate: yup
      .number()
      .positive("Storage rate must be a positive number")
      .typeError("")
      .required(() => null),

    reservation_billing_cycle: yup
      .object()
      .shape({
        label: yup.string().required(() => null),
        value: yup.string().required(() => null),
      })
      .required(() => null),
  });

  try {
    return validationSchema.validateSync(formData, { abortEarly: false });
  } catch (errors) {
    const validationErrors = {};

    errors.inner.forEach((error) => {
      validationErrors[error.path] = error.message;
    });

    throw validationErrors;
  }
}

const toasterAlert = (obj) => {
  let msg = obj?.message;
  let status = obj?.status;
  console.log(obj?.status);
  console.log(obj);
  if (status === 400) {
    const errorData = obj?.data?.data || obj?.data;
    console.log(errorData);
    let errorMessage = "";

    Object.keys(errorData).forEach((key) => {
      const messages = errorData[key];
      console.log(messages);
      messages?.forEach((message) => {
        errorMessage += `${key} : ${message} \n`;
      });
    });
    showToastByStatusCode(status, errorMessage);
    return false;
  }
  showToastByStatusCode(status, msg);
};

function checkDateRangeOverlap(details, reservationDetailsArray) {
  console.log(details);
  console.log(reservationDetailsArray);
  const startDate = moment(details.reservation_start_date);
  const endDate = moment(details.reservation_end_date);

  let count = 0;

  for (const reservation of reservationDetailsArray) {
    const resStartDate = moment(reservation.reservation_start_date);
    const resEndDate = moment(reservation.reservation_end_date);
    if (
      details.reservation_bag_size?.label ===
        reservation.reservation_bag_size.label &&
      startDate.isSameOrBefore(resEndDate) &&
      endDate.isSameOrAfter(resStartDate)
    ) {
      count++;
    }
  }

  console.log(count);
  return count > 0 ? false : true;
}
