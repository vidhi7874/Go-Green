/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
// import * as Yup from "yup";
import ReactSelect from "react-select";
import { BiEditAlt } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import WarehouseSubDetails from "./WarehouseSubDetails";
import CommodityDetails from "./CommodityDetails";
import FacilitiesAtWarehouse from "./FacilitiesAtWarehouse";
import InspectionInspectorRelatedDetails from "./InspectionInspectorRelatedDetails";
import OtherDetails from "./OtherDetails";
import SupervisorDetails from "./SupervisorDetails";
import {
  useFetchLocationDrillDownFreeMutation,
  useGetDocumentStatusMutation,
  useGetWarehouseFreeTypeMutation,
  useGetWarehouseSubFreeTypeMutation,
  useGetWarehouseUnitTypeMutation,
} from "../../../features/warehouse-proposal.slice";
import {
  useAddInspectionMasterMutation,
  useGetBankMasterFreeMutation,
  useUpdateInspectionMasterMutation,
} from "../../../features/master-api-slice";
import { showToastByStatusCode } from "../../../services/showToastByStatusCode";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../../features/manage-breadcrumb.slice";
import {
  schema_obj,
  warehouse_owner_obj,
  lessee_details_obj,
  clients_details_obj,
  chamber_details_obj,
  oil_tank_details_obj,
  silo_details_obj,
} from "./all_warhouse_inspection_schema_obj";
import {
  form_schema,
  warehouse_owner_schema,
  lessee_details_obj_schema,
  clients_details_schema,
  chamber_details_schema,
  oil_tank_details_schema,
  silo_details_schema,
} from "./validation_schema_for_warehouse_inspection";
import ROUTE_PATH from "../../../constants/ROUTE";
import { localStorageService } from "../../../services/localStorge.service";
import {
  useGetReInspectionAllDataMutation,
  useGetReInspectionByIDMutation,
} from "../../../features/reinspection.slice";

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

let warehouseOwnedByOptions = [
  { label: "Client", value: "client" },
  { label: "Leased", value: "leased" },
  { label: "Others", value: "others" },
];

let LockKeyOfWHOptions = [
  { label: "GGWPL", value: "GGWPL" },
  { label: "OWNER", value: "OWNER" },
  { label: "JOINT", value: "JOINT" },
];

// main component this is file where i redirected >>>>
const ReInspectionStandard = React.memo(() => {
  console.count("WarehouseInspection >> ");
  // hooks
  const navigate = useNavigate();
  const location = useLocation();
  console.log("location321 >>> : ", location?.state?.reInpectionData);
  const dispatch = useDispatch();

  // state varaibles ...
  const [selectBoxOptions, setSelectBoxOptions] = useState({});

  const [reInspectionFetchedData, setReInspectionFetchedData] = useState(null);

  // variables
  const details = location.state?.details;

  // ? memoized the localStorage as It is been  rendered 37 times..

  const loginData = useMemo(() => {
    return localStorageService.get("GG_ADMIN");
  }, []);

  // api call logic to get all the data for the re inspection form using the warehouse id
  const [getReInspectionAllData, isLoading: getReInspectionAllDataIsLoading] =
    useGetReInspectionAllDataMutation();

  async function fetchReInspectionData() {
    let data = {
      ...location?.state?.reInpectionData,
    };
    const response = await getReInspectionAllData(data).unwrap();
    console.log("response:from the reInspection api >>>> ", response);
    setReInspectionFetchedData(response);
  }

  useEffect(() => {
    fetchReInspectionData();
  }, [location?.state?.reInpectionData]);

  //react-hook-form code ...
  const {
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(form_schema),
    defaultValues: {
      [schema_obj.first_accordion.distance_between_walls_and_stock]: "false",
      [schema_obj.second_accordion.is_factory_premise]: "false",
      [schema_obj.fourth_accordion.commodity_inside_wh]: "false",

      [schema_obj.fourth_accordion.pre_stack_commodity_stack_countable]:
        "false",
      [schema_obj.fourth_accordion.pre_stack_commodity_level_of_infestation]:
        "false",
      [schema_obj.fourth_accordion.pre_stack_commodity_sample_mandatory]:
        "false",
      [schema_obj.fourth_accordion.funded_by_bank]: "false",
      [schema_obj.fourth_accordion.gg_access_to_stock_bk]: "false",
      [schema_obj.fifth_accordion.weightment_facility]: "false",
      [schema_obj.fifth_accordion.temp_humidity_maintainance]: "false",
      [schema_obj.fifth_accordion.generator_available]: "false",
      [schema_obj.fifth_accordion.insurance_of_plant_machinary]: "false",
      [schema_obj.fifth_accordion.insurance_covers_stk_deter]: "false",
      [schema_obj.other_accordion.riots_prone]: "false",
      [schema_obj.other_accordion.earthquake_prone]: "false",
      [schema_obj.other_accordion.flood_prone]: "false",
      [schema_obj.other_accordion.fire_extinguishers]: "false",
      [schema_obj.other_accordion.fire_buckets]: "false",
      [schema_obj.other_accordion.other_equipment]: "false",
      [schema_obj.other_accordion.storage_worthy]: "false",
      [schema_obj.other_accordion.air_roof_fan_available]: "false",
      [schema_obj.other_accordion.ventilators]: "false",
      [schema_obj.other_accordion.window]: "false",
      [schema_obj.other_accordion.gate]: "false",
      [schema_obj.other_accordion.fencing]: "false",
      [schema_obj.other_accordion.compoundwall]: "false",
      [schema_obj.other_accordion.drainage]: "false",
      [schema_obj.other_accordion.water]: "false",
      [schema_obj.other_accordion.electricity]: "false",
      [schema_obj.other_accordion.live_wires_in_wh]: "false",
      [schema_obj.other_accordion.telephone_facility]: "false",
      [schema_obj.other_accordion.dunnage]: "false",
      [schema_obj.other_accordion.theft_incidence_in_three_years]: "false",
      [schema_obj.other_accordion.damanget_incidence_in_three_years]: "false",
      [schema_obj.other_accordion.flood_incidence_in_three_years]: "false",
      [schema_obj.seventh_accordion.inspection_date]:
        moment().format("YYYY-MM-DD"),
      [schema_obj.seventh_accordion.survey_official]:
        loginData?.userDetails?.id || 0,
      [schema_obj.seventh_accordion.wh_photos_path]: [],
      [schema_obj.seventh_accordion.warehouse_related_document]: [],
    },
  });

  // location drip down api start
  // rtk hook code ...
  const [
    fetchLocationDrillDown,
    { isLoading: fetchLocationDrillDownApiIsLoading },
  ] = useFetchLocationDrillDownFreeMutation();

  const [getWarehouseType, { isLoading: getWarehouseTypeApiIsLoading }] =
    useGetWarehouseFreeTypeMutation();

  const [getWarehouseSubType, { isLoading: getWarehouseSubTypeApiIsLoading }] =
    useGetWarehouseSubFreeTypeMutation();

  const [
    getWarehouseUnitType,
    { isLoading: getWarehouseUnitTypeApiIsLoading },
  ] = useGetWarehouseUnitTypeMutation();

  const [getBankMaster, { isLoading: getBankMasterApiIsLoading }] =
    useGetBankMasterFreeMutation();

  // function definitions ...
  const getRegionMasterList = useCallback(async () => {
    try {
      const response = await fetchLocationDrillDown().unwrap();
      // console.log("getRegionMasterList:", response);

      const arr = response?.region
        ?.filter((item) => item.region_name !== "ALL - Region")
        .map(({ region_name, id }) => ({
          label: region_name,
          value: id,
        }));

      setSelectBoxOptions((prev) => ({
        ...prev,
        regions: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  const regionOnChange = async (val) => {
    // console.log("value region >>--> ", val);
    setValue(schema_obj.first_accordion.region, val?.value, {
      shouldValidate: true,
    });

    setValue(schema_obj.first_accordion.state, null, {
      shouldValidate: false,
    });

    setValue(schema_obj.first_accordion.sub_state, null, {
      shouldValidate: false,
    });

    setValue(schema_obj.first_accordion.district, null, {
      shouldValidate: false,
    });

    setValue(schema_obj.first_accordion.area, null, {
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
        states: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const stateOnChange = async (val) => {
    setValue(schema_obj.first_accordion.state, val?.value, {
      shouldValidate: true,
    });

    setValue(schema_obj.first_accordion.sub_state, null, {
      shouldValidate: false,
    });

    setValue(schema_obj.first_accordion.district, null, {
      shouldValidate: false,
    });

    setValue(schema_obj.first_accordion.area, null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues(schema_obj.first_accordion.region),
      state: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();

      const arr = response?.substate
        ?.filter((item) => item.substate_name !== "All - Zone")
        .map(({ substate_name, id }) => ({
          label: substate_name,
          value: id,
        }));

      setSelectBoxOptions((prev) => ({
        ...prev,
        substate: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const zoneOnChange = async (val) => {
    setValue(schema_obj.first_accordion.sub_state, val?.value, {
      shouldValidate: true,
    });

    setValue(schema_obj.first_accordion.district, null, {
      shouldValidate: false,
    });

    setValue(schema_obj.first_accordion.area, null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues(schema_obj.first_accordion.region),
      state: getValues(schema_obj.first_accordion.state),
      substate: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();

      const arr = response?.district
        ?.filter((item) => item.district_name !== "All - District")
        .map(({ district_name, id }) => ({
          label: district_name,
          value: id,
        }));

      setSelectBoxOptions((prev) => ({
        ...prev,
        districts: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const districtOnChange = async (val) => {
    // console.log("value --> ", val);
    setValue(schema_obj.first_accordion.district, val?.value, {
      shouldValidate: true,
    });

    setValue(schema_obj.first_accordion.area, null, {
      shouldValidate: false,
    });

    const query = {
      region: getValues(schema_obj.first_accordion.region),
      state: getValues(schema_obj.first_accordion.state),
      substate: getValues(schema_obj.first_accordion.sub_state),
      district: val?.value,
    };

    try {
      const response = await fetchLocationDrillDown(query).unwrap();

      const arr = response?.area
        ?.filter((item) => item.area_name !== "All - Area")
        .map(({ area_name, id }) => ({
          label: area_name,
          value: id,
        }));

      setSelectBoxOptions((prev) => ({
        ...prev,
        areas: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const areaOnChange = (val) => {
    setValue(schema_obj.first_accordion.area, val?.value, {
      shouldValidate: true,
    });
  };

  const getWarehouseTypeMasterList = useCallback(async () => {
    try {
      const response = await getWarehouseType().unwrap();

      const arr = response?.results?.map(({ warehouse_type_name, id }) => ({
        label: warehouse_type_name,
        value: id,
      }));

      // console.log("getWarehouseTypeMasterList:", response, arr);

      setSelectBoxOptions((prev) => ({
        ...prev,
        warehouseType: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  const getWarehouseSubTypeMasterList = useCallback(async () => {
    try {
      const response = await getWarehouseSubType().unwrap();

      const arr = response?.results?.map(({ warehouse_subtype, id }) => ({
        label: warehouse_subtype,
        value: id,
      }));

      console.log("getWarehouseSubTypeMasterList:", response, arr);

      setSelectBoxOptions((prev) => ({
        ...prev,
        warehouseSubType: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  });

  const getWarehouseUnitTypeMasterList = useCallback(async () => {
    try {
      const response = await getWarehouseUnitType().unwrap();

      const arr = response?.results?.map(({ warehouse_unit_type, id }) => ({
        label: warehouse_unit_type,
        value: id,
      }));

      console.log("getWarehouseUnitTypeMasterList:", response, arr);

      setSelectBoxOptions((prev) => ({
        ...prev,
        warehouseUnitType: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  const getBankMasterList = useCallback(async () => {
    try {
      const response = await getBankMaster().unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          banks: response?.results.map(({ bank_name, id }) => ({
            label: bank_name,
            value: id,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  useEffect(() => {
    getRegionMasterList();
    // eslint-disable-next-line
  }, [getRegionMasterList]);

  // location drip down api end

  // warehouse type, subType and unit api start

  useEffect(() => {
    getWarehouseTypeMasterList();
    getWarehouseSubTypeMasterList();
    getWarehouseUnitTypeMasterList();
    // eslint-disable-next-line
  }, []);

  // warehouse type, subType and unit api end

  // bank api start

  useEffect(() => {
    getBankMasterList();
    // eslint-disable-next-line
  }, []);

  // bank api end

  // warehouse owner details userForm
  const warehouseOwnerFormsMethod = useForm({
    resolver: yupResolver(warehouse_owner_schema),
    mode: "onChange",
    defaultValues: {
      [warehouse_owner_obj.rent_amount]: 0,
    },
  });

  const lesseeDetailsFormsMethod = useForm({
    resolver: yupResolver(lessee_details_obj_schema),
    mode: "onChange",
    defaultValues: {
      [lessee_details_obj.rent_amount]: 0,
    },
  });

  const clientsDetailsFormsMethod = useForm({
    resolver: yupResolver(clients_details_schema),
    mode: "onChange",
  });

  const chamberDetailsFormsMethod = useForm({
    resolver: yupResolver(chamber_details_schema),
    mode: "onChange",
    // criteriaMode: "all",
  });

  const oilTankDetailsFormsMethod = useForm({
    resolver: yupResolver(oil_tank_details_schema),
    mode: "onChange",
  });

  const siloDetailsFormsMethod = useForm({
    resolver: yupResolver(silo_details_schema),
    mode: "onChange",
  });

  // start dealer all useState here
  const [warehouseOwnersDetails, setWarehouseOwnersDetails] = useState([]);
  const [lesseeDetails, setLesseeDetails] = useState([]);
  const [clientsDetails, setClientsDetails] = useState([]);
  const [chamberDetails, setChamberDetails] = useState([]);
  const [oilTankDetails, setOilTankDetails] = useState([]);
  const [siloDetails, setSiloDetails] = useState([]);

  const [editedFormIndex, setEditedFormIndex] = useState({
    warehouseOwnerFormEditedIndex: "",
    editedSubLesseeFormEditedIndex: "",
    editedLesseeFormEditedIndex: "",

    editedClientsFormEditedIndex: "",
    editedChamberDetailsFormEditedIndex: "",
    editedOilTankDetailsFormEditedIndex: "",
    editedSiloDetailsFormEditedIndex: "",
  });
  // end dealer all useState here

  // ==================================================

  // ---------------------------------------------------------------------------
  // Memoize the functions using useCallback
  // Memoize the functions using useCallback
  const memoizedRegister = useCallback(register, []);
  const memoizedSetValue = useCallback(setValue, []);
  const memoizedGetValues = useCallback(getValues, []);
  const memoizedWatch = useCallback(watch, []);
  const memoizedHandleSubmit = useCallback(handleSubmit, []);
  const memoizedSetError = useCallback(setError, []);
  const memoizedErrors = useCallback(errors, []);
  const warehouse_sub_details_form_schemaKey = useMemo(() => {
    return schema_obj.second_accordion;
  }, []);

  const commodity_details_form_schemaKey = useMemo(() => {
    return schema_obj.fourth_accordion;
  }, []);

  const facilities_at_warehouse_form_schemaKey = useMemo(() => {
    return schema_obj.fifth_accordion;
  }, []);

  const inspection_inspector_related_details_form_schemaKey = useMemo(() => {
    return schema_obj.seventh_accordion;
  }, []);

  const other_details_form_schemaKey = useMemo(() => {
    return schema_obj.other_accordion;
  }, []);

  const supervisor_details_form_schemaKey = useMemo(() => {
    return schema_obj.gard_accordion;
  }, []);

  // ---------------------------------------------------------------------------

  // =============== warehouse owner details form function start  =============================

  const InternalTypeOptions = [
    {
      label: "Lease",
      value: "Lease",
    },
    {
      label: "Sub Leased",
      value: "Sub Leased",
    },
  ];

  const [internalType, setInternalType] = useState("Lease");

  // useEffect(() => {
  //   setValue(`lessee`, [], { shouldValidate: true });
  // }, [internalType]);

  const warehouseOwnerOnSubmit = () => {
    let form_details = warehouseOwnerFormsMethod.getValues();
    console.log(
      "form_details",
      form_details,
      warehouseOwnerFormsMethod.getValues("warehouse_owner_contact_no")
    );
    if (
      form_details?.[warehouse_owner_obj.warehouse_owner_name] === "" ||
      form_details?.[warehouse_owner_obj.warehouse_owner_address] === "" ||
      form_details?.[warehouse_owner_obj.warehouse_owner_contact_no] === ""
    ) {
      // alert("if");
      for (let key in warehouse_owner_obj) {
        warehouseOwnerFormsMethod.setError(key, {
          type: {
            required: true,
          },
        });
      }
    } else {
      // alert("else");
      if (editedFormIndex.warehouseOwnerFormEditedIndex !== "") {
        // handle update form
        let form_edited_index = editedFormIndex.warehouseOwnerFormEditedIndex;
        setWarehouseOwnersDetails((prevData) => {
          const updatedData = [...prevData];
          updatedData[form_edited_index] = {
            ...updatedData[form_edited_index],
            ...form_details,
            warehouse_owner_contact_no:
              form_details.warehouse_owner_contact_no.includes("+91")
                ? form_details.warehouse_owner_contact_no
                : "+91" + form_details.warehouse_owner_contact_no,
            rent_amount:
              form_details.rent_amount === "" ? null : form_details.rent_amount,
            revenue_sharing_fix_amount:
              form_details.revenue_sharing_fix_amount === ""
                ? null
                : form_details.revenue_sharing_fix_amount,
            revenue_sharing_ratio:
              form_details.revenue_sharing_ratio === ""
                ? null
                : form_details.revenue_sharing_ratio,
          };
          return updatedData;
        });
      } else {
        // handle add form
        setWarehouseOwnersDetails((prev) => [
          ...prev,
          {
            ...form_details,
            warehouse_owner_contact_no:
              form_details.warehouse_owner_contact_no.includes("+91")
                ? form_details.warehouse_owner_contact_no
                : "+91" + form_details.warehouse_owner_contact_no,
            rent_amount:
              form_details.rent_amount === "" ? null : form_details.rent_amount,
            revenue_sharing_fix_amount:
              form_details.revenue_sharing_fix_amount === ""
                ? null
                : form_details.revenue_sharing_fix_amount,
            revenue_sharing_ratio:
              form_details.revenue_sharing_ratio === ""
                ? null
                : form_details.revenue_sharing_ratio,
          },
        ]);
        console.log("form_details", form_details);
      }
    }

    // clear form and clear index

    warehouseOwnerFormsMethod.reset({
      [warehouse_owner_obj.warehouse_owner_name]: "",
      [warehouse_owner_obj.warehouse_owner_address]: "",
      [warehouse_owner_obj.warehouse_owner_contact_no]: "",
      [warehouse_owner_obj.rent_amount]: "",
      [warehouse_owner_obj.revenue_sharing_fix_amount]: "",
      [warehouse_owner_obj.revenue_sharing_ratio]: "",
    });

    setEditedFormIndex((prev) => ({
      ...prev,
      warehouseOwnerFormEditedIndex: "",
    }));
  };

  const warehouseOwnerOnEdit = (item, index) => {
    setEditedFormIndex((prev) => ({
      ...prev,
      warehouseOwnerFormEditedIndex: index,
    }));

    warehouseOwnerFormsMethod.setValue(
      warehouse_owner_obj.warehouse_owner_name,
      item.warehouse_owner_name,
      {
        shouldValidate: true,
      }
    );
    warehouseOwnerFormsMethod.setValue(
      warehouse_owner_obj.warehouse_owner_address,
      item.warehouse_owner_address,
      {
        shouldValidate: true,
      }
    );
    warehouseOwnerFormsMethod.setValue(
      warehouse_owner_obj.warehouse_owner_contact_no,
      item.warehouse_owner_contact_no,
      {
        shouldValidate: true,
      }
    );
    warehouseOwnerFormsMethod.setValue(
      warehouse_owner_obj.rent_amount,
      item.rent_amount,
      {
        shouldValidate: true,
      }
    );
    warehouseOwnerFormsMethod.setValue(
      warehouse_owner_obj.revenue_sharing_fix_amount,
      item.revenue_sharing_fix_amount,
      {
        shouldValidate: true,
      }
    );
    warehouseOwnerFormsMethod.setValue(
      warehouse_owner_obj.revenue_sharing_ratio,
      item.revenue_sharing_ratio,
      {
        shouldValidate: true,
      }
    );
  };

  const warehouseOwnerRemove = (index) => {
    setWarehouseOwnersDetails((prevData) =>
      prevData.filter((item, i) => i !== index)
    );
  };

  useEffect(() => {
    if (
      selectBoxOptions?.warehouseSubType?.filter(
        (item) =>
          item.value ===
          getValues(schema_obj.first_accordion.warehouse_sub_type)
      )[0]?.label === "Revenue sharing"
    ) {
      if (internalType !== "Sub Leased") {
        setValue(
          `gg_revenue_ratio`,
          100 -
            warehouseOwnersDetails.reduce(
              (total, item) =>
                Number(total) + Number(item?.revenue_sharing_ratio || 0),
              0
            ),
          { shouldValidate: true }
        );
      }
    }
  }, [warehouseOwnersDetails]);

  // =============== warehouse owner details form function end  =============================

  // ===============  Lessee details form function start  =============================
  const lesseeOnSubmit = () => {
    let form_details = lesseeDetailsFormsMethod.getValues();
    // console.log("form_details", form_details);

    if (
      form_details?.[lessee_details_obj.lessee_name] === "" ||
      form_details?.[lessee_details_obj.lessee_name] === null ||
      form_details?.[lessee_details_obj.lessee_name] === undefined ||
      form_details?.[lessee_details_obj.lessee_address] === "" ||
      form_details?.[lessee_details_obj.lessee_address] === null ||
      form_details?.[lessee_details_obj.lessee_address] === undefined ||
      form_details?.[lessee_details_obj.lessee_contact_no] === "" ||
      form_details?.[lessee_details_obj.lessee_contact_no] === null ||
      form_details?.[lessee_details_obj.lessee_contact_no] === undefined
      // form_details?.[lessee_details_obj.rent_amount] === ""
    ) {
      for (let key in lessee_details_obj) {
        lesseeDetailsFormsMethod.setError(key, {
          type: {
            required: true,
          },
        });
      }
    } else {
      //alert("else");
      if (editedFormIndex.editedLesseeFormEditedIndex !== "") {
        // handle update form
        let form_edited_index = editedFormIndex.editedLesseeFormEditedIndex;
        setLesseeDetails((prevData) => {
          const updatedData = [...prevData];
          updatedData[form_edited_index] = {
            ...updatedData[form_edited_index],
            ...form_details,
            lessee_contact_no: form_details.lessee_contact_no.includes("+91")
              ? form_details.lessee_contact_no
              : "+91" + form_details.lessee_contact_no,
            rent_amount:
              form_details.rent_amount === "" ? null : form_details.rent_amount,
            revenue_sharing_fix_amount:
              form_details.revenue_sharing_fix_amount === ""
                ? null
                : form_details.revenue_sharing_fix_amount,
            revenue_sharing_ratio:
              form_details.revenue_sharing_ratio === ""
                ? null
                : form_details.revenue_sharing_ratio,
          };
          return updatedData;
        });
      } else {
        // handle add form
        setLesseeDetails((prev) => [
          ...prev,
          {
            ...form_details,
            lessee_contact_no: form_details.lessee_contact_no.includes("+91")
              ? form_details.lessee_contact_no
              : "+91" + form_details.lessee_contact_no,
            rent_amount:
              form_details.rent_amount === "" ? null : form_details.rent_amount,
            revenue_sharing_fix_amount:
              form_details.revenue_sharing_fix_amount === ""
                ? null
                : form_details.revenue_sharing_fix_amount,
            revenue_sharing_ratio:
              form_details.revenue_sharing_ratio === ""
                ? null
                : form_details.revenue_sharing_ratio,
          },
        ]);
        // console.log("form_details", form_details);
      }
    }

    // clear form and clear index

    lesseeDetailsFormsMethod.reset({
      [lessee_details_obj.lessee_name]: "",
      [lessee_details_obj.lessee_address]: "",
      [lessee_details_obj.lessee_contact_no]: "",
      [lessee_details_obj.rent_amount]: "",
      [lessee_details_obj.revenue_sharing_fix_amount]: "",
      [lessee_details_obj.revenue_sharing_ratio]: "",
    });

    setEditedFormIndex((prev) => ({
      ...prev,
      editedLesseeFormEditedIndex: "",
    }));
  };

  // ? memoise function
  const lesseeOnEdit = useCallback((item, index) => {
    setEditedFormIndex((prev) => ({
      ...prev,
      editedLesseeFormEditedIndex: index,
    }));

    lesseeDetailsFormsMethod.setValue(
      lessee_details_obj.lessee_name,
      item.lessee_name,
      {
        shouldValidate: true,
      }
    );
    lesseeDetailsFormsMethod.setValue(
      lessee_details_obj.lessee_address,
      item.lessee_address,
      {
        shouldValidate: true,
      }
    );
    lesseeDetailsFormsMethod.setValue(
      lessee_details_obj.lessee_contact_no,
      item.lessee_contact_no,
      {
        shouldValidate: true,
      }
    );
    lesseeDetailsFormsMethod.setValue(
      lessee_details_obj.rent_amount,
      item.rent_amount,
      {
        shouldValidate: true,
      }
    );

    lesseeDetailsFormsMethod.setValue(
      lessee_details_obj.revenue_sharing_fix_amount,
      item.revenue_sharing_fix_amount,
      {
        shouldValidate: true,
      }
    );
    lesseeDetailsFormsMethod.setValue(
      lessee_details_obj.revenue_sharing_ratio,
      item.revenue_sharing_ratio,
      {
        shouldValidate: true,
      }
    );
  }, []);

  // ? memoise function
  const lesseeRemove = useCallback((index) => {
    setLesseeDetails((prevData) => prevData.filter((item, i) => i !== index));
  }, []);

  useEffect(() => {
    if (
      selectBoxOptions?.warehouseSubType?.filter(
        (item) =>
          item.value ===
          getValues(schema_obj.first_accordion.warehouse_sub_type)
      )[0]?.label === "Revenue sharing"
    ) {
      if (internalType === "Sub Leased") {
        setValue(
          `gg_revenue_ratio`,
          100 -
            lesseeDetails.reduce(
              (total, item) =>
                Number(total) + Number(item?.revenue_sharing_ratio || 0),
              0
            ),
          { shouldValidate: true }
        );
      }
    }
  }, [lesseeDetails]);
  // ===============  Lessee details form function end  =============================

  // =============== Clients details form function start  =============================
  // ? memoise function
  const clientsDetailsOnSubmit = () => {
    let form_details = clientsDetailsFormsMethod.getValues();
    // console.log("form_details", form_details);

    if (form_details.client_name === "" && form_details.client_address === "") {
      // alert("if");

      clientsDetailsFormsMethod?.setError("client_name", {
        type: {
          required: true,
        },
      });
      clientsDetailsFormsMethod?.setError("client_address", {
        type: {
          required: true,
        },
      });
    } else {
      //alert("else");
      if (editedFormIndex.editedClientsFormEditedIndex !== "") {
        // handle update form
        let form_edited_index = editedFormIndex.editedClientsFormEditedIndex;
        setClientsDetails((prevData) => {
          const updatedData = [...prevData];
          updatedData[form_edited_index] = {
            ...updatedData[form_edited_index],
            ...form_details,
          };
          return updatedData;
        });
      } else {
        // handle add form
        setClientsDetails((prev) => [...prev, { ...form_details }]);
        // console.log("form_details", form_details);
      }
    }

    // clear form and clear index

    clientsDetailsFormsMethod.reset({
      [clients_details_obj.client_name]: "",
      [clients_details_obj.client_address]: "",
    });

    setEditedFormIndex((prev) => ({
      ...prev,
      editedClientsFormEditedIndex: "",
    }));
  };

  // ? memoise function
  const clientsDetailsOnEdit = (item, index) => {
    setEditedFormIndex((prev) => ({
      ...prev,
      editedClientsFormEditedIndex: index,
    }));

    clientsDetailsFormsMethod.setValue(
      clients_details_obj.client_name,
      item.client_name,
      {
        shouldValidate: true,
      }
    );
    clientsDetailsFormsMethod.setValue(
      clients_details_obj.client_address,
      item.client_address,
      {
        shouldValidate: true,
      }
    );
  };

  // ? memoise function
  const clientsDetailsRemove = (index) => {
    setClientsDetails((prevData) => prevData.filter((item, i) => i !== index));
  };
  // =============== Clients details form function end  =============================

  // =============== Chamber details form function start  =============================

  // ? memoise function
  const chamberDetailsOnSubmit = () => {
    let form_details = chamberDetailsFormsMethod.getValues();

    chamberDetailsFormsMethod.setError("chamber_number", {
      type: "custom",
    });

    if (
      form_details.chamber_number === "" ||
      form_details.chamber_length === "" ||
      form_details.chamber_breadth === "" ||
      form_details.roof_height === "" ||
      form_details.stackble_height === "" ||
      form_details.sq_feet === "" ||
      form_details.total_area === "" ||
      form_details.total_area === 0
    ) {
      // alert("if");

      for (let key in chamber_details_obj) {
        if (form_details[key] === "") {
          chamberDetailsFormsMethod.setError(key, {
            type: "custom",
          });
        }
      }
    } else {
      //alert("else");
      if (editedFormIndex.editedChamberDetailsFormEditedIndex !== "") {
        // handle update form
        let form_edited_index =
          editedFormIndex.editedChamberDetailsFormEditedIndex;
        setChamberDetails((prevData) => {
          const updatedData = [...prevData];
          updatedData[form_edited_index] = {
            ...updatedData[form_edited_index],
            ...form_details,
          };
          return updatedData;
        });
      } else {
        // handle add form
        setChamberDetails((prev) => [...prev, { ...form_details }]);
        // console.log("form_details", form_details);
      }
    }
    // clear form and clear index

    chamberDetailsFormsMethod.reset({
      [chamber_details_obj.chamber_number]: "",
      [chamber_details_obj.chamber_length]: "",

      [chamber_details_obj.chamber_breadth]: "",
      [chamber_details_obj.roof_height]: "",
      [chamber_details_obj.stackble_height]: "",
      [chamber_details_obj.sq_feet]: "",
      [chamber_details_obj.total_area]: "",
    });

    setEditedFormIndex((prev) => ({
      ...prev,
      editedChamberDetailsFormEditedIndex: "",
    }));
  };

  // ? memoize function ...
  const chamberDetailsOnEdit = (item, index) => {
    setEditedFormIndex((prev) => ({
      ...prev,
      editedChamberDetailsFormEditedIndex: index,
    }));

    for (let key in chamber_details_obj) {
      chamberDetailsFormsMethod.setValue(key, item[key], {
        shouldValidate: true,
      });
    }
  };

  // ? memoized function ..
  const chamberDetailsRemove = (index) => {
    setChamberDetails((prevData) => prevData.filter((item, i) => i !== index));
  };

  useEffect(() => {
    // console.log(chamberDetailsFormsMethod.getValues("chamber_length"));
    chamberDetailsFormsMethod.setValue(
      "total_area",
      Number(chamberDetailsFormsMethod.getValues("chamber_length") || 0) *
        Number(chamberDetailsFormsMethod.getValues("chamber_breadth") || 0),
      {
        shouldValidate: true,
      }
    );
  }, [
    chamberDetailsFormsMethod.getValues("chamber_length"),
    chamberDetailsFormsMethod.getValues("chamber_breadth"),
  ]);

  useEffect(() => {
    let Temp = 0;
    for (let i = 0; i < chamberDetails.length; i++) {
      Temp = Temp + chamberDetails[i]?.total_area || 0;
    }
    setValue("warehouse_total_area", Temp || 0, {
      shouldValidate: true,
    });
  }, [chamberDetails]);

  useEffect(() => {
    setValue(
      "standard_capacity",
      (Number(getValues("warehouse_total_area") || 0) / 6).toFixed(2),
      {
        shouldValidate: true,
      }
    );
  }, [getValues("warehouse_total_area")]);

  useEffect(() => {
    setValue(
      "storage_available_area",
      Number(getValues("warehouse_total_area") || 0) -
        Number(getValues("warehouse_unusable_area") || 0),
      {
        shouldValidate: true,
      }
    );
  }, [getValues("warehouse_total_area"), getValues("warehouse_unusable_area")]);

  useEffect(() => {
    setValue(
      "standard_capacity_available_for_storage",
      (Number(getValues("storage_available_area") || 0) / 6).toFixed(2),
      {
        shouldValidate: true,
      }
    );
    setValue(
      "total_rent_per_month",
      (
        Number(getValues("storage_available_area") || 0) *
        Number(getValues("rent") || 0)
      ).toFixed(2),
      {
        shouldValidate: true,
      }
    );
  }, [getValues("storage_available_area")]);

  // =============== Chamber details form function end  =============================

  // =============== Oil Tank details form function start  =============================
  const oilTankDetailsOnSubmit = () => {
    let form_details = oilTankDetailsFormsMethod.getValues();
    // console.log("form_details", form_details);

    if (
      form_details.chamber_number === "" ||
      form_details.diameter === "" ||
      form_details.height === "" ||
      form_details.density === "" ||
      form_details.capacity === ""
    ) {
      // alert("if");

      for (let key in chamber_details_obj) {
        oilTankDetailsFormsMethod.setError(key, {
          type: {
            required: true,
          },
        });
      }
    } else {
      //alert("else");
      if (editedFormIndex.editedOilTankDetailsFormEditedIndex !== "") {
        // handle update form
        let form_edited_index =
          editedFormIndex.editedOilTankDetailsFormEditedIndex;
        setOilTankDetails((prevData) => {
          const updatedData = [...prevData];
          updatedData[form_edited_index] = {
            ...updatedData[form_edited_index],
            ...form_details,
          };
          return updatedData;
        });
      } else {
        // handle add form
        setOilTankDetails((prev) => [...prev, { ...form_details }]);
        console.log("form_details", form_details);
      }
    }

    // clear form and clear index

    oilTankDetailsFormsMethod.reset({
      [oil_tank_details_obj.chamber_number]: "",
      [oil_tank_details_obj.diameter]: "",
      [oil_tank_details_obj.height]: "",
      [oil_tank_details_obj.density]: "",
      [oil_tank_details_obj.capacity]: "",
    });

    setEditedFormIndex((prev) => ({
      ...prev,
      editedOilTankDetailsFormEditedIndex: "",
    }));
  };

  const oilTankDetailsOnEdit = (item, index) => {
    setEditedFormIndex((prev) => ({
      ...prev,
      editedOilTankDetailsFormEditedIndex: index,
    }));

    for (let key in oil_tank_details_obj) {
      oilTankDetailsFormsMethod.setValue(key, item[key], {
        shouldValidate: true,
      });
    }
  };

  const oilTankDetailsRemove = (index) => {
    setOilTankDetails((prevData) => prevData.filter((item, i) => i !== index));
  };

  useEffect(() => {
    // console.log(oilTankDetailsFormsMethod.getValues("height"));
    oilTankDetailsFormsMethod.setValue(
      "capacity",
      (
        Math.PI *
        Number(oilTankDetailsFormsMethod.getValues("height") || 0) *
        Number(oilTankDetailsFormsMethod.getValues("density") || 0) *
        Number(oilTankDetailsFormsMethod.getValues("diameter") || 0) *
        Number(oilTankDetailsFormsMethod.getValues("diameter") || 0)
      ).toFixed(2),
      {
        shouldValidate: true,
      }
    );
  }, [
    oilTankDetailsFormsMethod.getValues("height"),
    oilTankDetailsFormsMethod.getValues("diameter"),
    oilTankDetailsFormsMethod.getValues("density"),
  ]);

  useEffect(() => {
    let Temp = 0;
    for (let i = 0; i < oilTankDetails.length; i++) {
      Temp = Number(Temp) + Number(oilTankDetails[i]?.capacity || 0);
    }
    setValue("warehouse_total_area", Temp || 0, {
      shouldValidate: true,
    });
  }, [oilTankDetails]);

  // =============== Oil Tank details form function end  =============================

  // =============== Silo details form function start  =============================
  // ? memoized function ...
  const siloDetailsOnSubmit = () => {
    let form_details = siloDetailsFormsMethod.getValues();
    // console.log("form_details", form_details);

    if (
      form_details.chamber_number === "" ||
      form_details.diameter === "" ||
      form_details.height === "" ||
      form_details.density === "" ||
      form_details.capacity === ""
    ) {
      // alert("if");

      for (let key in chamber_details_obj) {
        siloDetailsFormsMethod.setError(key, {
          type: {
            required: true,
          },
        });
      }
    } else {
      //alert("else");
      if (editedFormIndex.editedSiloDetailsFormEditedIndex !== "") {
        // handle update form
        let form_edited_index =
          editedFormIndex.editedSiloDetailsFormEditedIndex;
        setSiloDetails((prevData) => {
          const updatedData = [...prevData];
          updatedData[form_edited_index] = {
            ...updatedData[form_edited_index],
            ...form_details,
          };
          return updatedData;
        });
      } else {
        // handle add form
        setSiloDetails((prev) => [...prev, { ...form_details }]);
        // console.log("form_details", form_details);
      }
    }

    // clear form and clear index

    siloDetailsFormsMethod.reset({
      [silo_details_obj.chamber_number]: "",
      [silo_details_obj.diameter]: "",
      [silo_details_obj.height]: "",
      [silo_details_obj.density]: "",
      [silo_details_obj.capacity]: "",
    });

    setEditedFormIndex((prev) => ({
      ...prev,
      editedSiloDetailsFormEditedIndex: "",
    }));
  };

  // ? memoized function..
  const siloDetailsOnEdit = (item, index) => {
    setEditedFormIndex((prev) => ({
      ...prev,
      editedSiloDetailsFormEditedIndex: index,
    }));

    for (let key in silo_details_obj) {
      siloDetailsFormsMethod.setValue(key, item[key], {
        shouldValidate: true,
      });
    }
  };

  const siloDetailsRemove = (index) => {
    setSiloDetails((prevData) => prevData.filter((item, i) => i !== index));
  };

  useEffect(() => {
    siloDetailsFormsMethod.setValue(
      "capacity",
      (
        Math.PI *
        Number(siloDetailsFormsMethod.getValues("height") || 0) *
        Number(siloDetailsFormsMethod.getValues("density") || 0) *
        Number(siloDetailsFormsMethod.getValues("diameter") || 0) *
        Number(siloDetailsFormsMethod.getValues("diameter") || 0)
      ).toFixed(2),
      {
        shouldValidate: true,
      }
    );
  }, [
    siloDetailsFormsMethod.getValues("height"),
    siloDetailsFormsMethod.getValues("diameter"),
    siloDetailsFormsMethod.getValues("density"),
  ]);

  useEffect(() => {
    let Temp = 0;
    for (let i = 0; i < siloDetails.length; i++) {
      Temp = Number(Temp) + Number(siloDetails[i]?.capacity || 0);
    }
    setValue("warehouse_total_area", Temp || 0, {
      shouldValidate: true,
    });
  }, [siloDetails]);

  // =============== Oil Tank details form function end  =============================

  // ============================= save as draft logic start =============================
  // ? memoized function ..
  const saveAsDraftFunction = async () => {
    const data = getValues();
    const { hiring_proposal, ...data2 } = data;

    const finalData = {
      ...data2,
      is_draft: true,
      owner: warehouseOwnersDetails,
      lessee: lesseeDetails,
      client: clientsDetails,
      [schema_obj?.second_accordion?.license_number]:
        getValues(schema_obj?.second_accordion?.license_number) === ""
          ? null
          : getValues(schema_obj?.second_accordion?.license_number),
      [schema_obj?.second_accordion?.license_start_date]:
        getValues(schema_obj?.second_accordion?.license_start_date) === ""
          ? null
          : getValues(schema_obj?.second_accordion?.license_start_date),
      [schema_obj?.second_accordion?.license_end_date]:
        getValues(schema_obj?.second_accordion?.license_end_date) === ""
          ? null
          : getValues(schema_obj?.second_accordion?.license_end_date),
      [schema_obj?.second_accordion?.wdra_license_number]:
        getValues(schema_obj?.second_accordion?.wdra_license_number) === ""
          ? null
          : getValues(schema_obj?.second_accordion?.wdra_license_number),
      [schema_obj?.second_accordion?.wdra_license_start_date]:
        getValues(schema_obj?.second_accordion?.wdra_license_start_date) === ""
          ? null
          : getValues(schema_obj?.second_accordion?.wdra_license_start_date),
      [schema_obj?.second_accordion?.wdra_license_end_date]:
        getValues(schema_obj?.second_accordion?.wdra_license_end_date) === ""
          ? null
          : getValues(schema_obj?.second_accordion?.wdra_license_end_date),
      [schema_obj?.second_accordion?.fssai_license_number]:
        getValues(schema_obj?.second_accordion?.fssai_license_number) === ""
          ? null
          : getValues(schema_obj?.second_accordion?.fssai_license_number),
      [schema_obj?.second_accordion?.fssai_license_start_date]:
        getValues(schema_obj?.second_accordion?.fssai_license_start_date) === ""
          ? null
          : getValues(schema_obj?.second_accordion?.fssai_license_start_date),
      [schema_obj?.second_accordion?.fssai_license_end_date]:
        getValues(schema_obj?.second_accordion?.fssai_license_end_date) === ""
          ? null
          : getValues(schema_obj?.second_accordion?.fssai_license_end_date),
      chamber:
        selectBoxOptions?.warehouseUnitType?.filter(
          (item) =>
            item.value ===
            getValues(schema_obj.first_accordion.warehouse_unit_type)
        )?.[0]?.label === "Oil Tank"
          ? oilTankDetails
          : selectBoxOptions?.warehouseUnitType?.filter(
              (item) =>
                item.value ===
                getValues(schema_obj.first_accordion.warehouse_unit_type)
            )?.[0]?.label === "Silo"
          ? siloDetails
          : chamberDetails,
      other_details: {
        [schema_obj.other_accordion?.dacroit_prone]: getValues(
          schema_obj.other_accordion?.dacroit_prone
        ),
        [schema_obj.other_accordion?.riots_prone]: getValues(
          schema_obj.other_accordion?.riots_prone
        ),
        [schema_obj.other_accordion?.earthquake_prone]: getValues(
          schema_obj.other_accordion?.earthquake_prone
        ),
        [schema_obj.other_accordion?.flood_prone]: getValues(
          schema_obj.other_accordion?.flood_prone
        ),
        [schema_obj.other_accordion?.main_center_distance]:
          getValues(schema_obj.other_accordion?.main_center_distance) === ""
            ? null
            : getValues(schema_obj.other_accordion?.main_center_distance),
        [schema_obj.other_accordion?.police_station_distance]:
          getValues(schema_obj.other_accordion?.police_station_distance) === ""
            ? null
            : getValues(schema_obj.other_accordion?.police_station_distance),
        [schema_obj.other_accordion?.fire_station_distance]:
          getValues(schema_obj.other_accordion?.fire_station_distance) === ""
            ? null
            : getValues(schema_obj.other_accordion?.fire_station_distance),
        [schema_obj.other_accordion?.mandi_distance]:
          getValues(schema_obj.other_accordion?.mandi_distance) === ""
            ? null
            : getValues(schema_obj.other_accordion?.mandi_distance),
        [schema_obj.other_accordion?.goodshed_distance]:
          getValues(schema_obj.other_accordion?.goodshed_distance) === ""
            ? null
            : getValues(schema_obj.other_accordion?.goodshed_distance),
        [schema_obj.other_accordion?.fire_extinguishers]: getValues(
          schema_obj.other_accordion?.fire_extinguishers
        ),
        [schema_obj.other_accordion?.fire_extinguisher_count]:
          getValues(schema_obj.other_accordion?.fire_extinguisher_count) === ""
            ? null
            : getValues(schema_obj.other_accordion?.fire_extinguisher_count),
        [schema_obj.other_accordion?.fire_buckets]: getValues(
          schema_obj.other_accordion?.fire_buckets
        ),
        [schema_obj.other_accordion?.fire_bucket_count]:
          getValues(schema_obj.other_accordion?.fire_bucket_count) === ""
            ? null
            : getValues(schema_obj.other_accordion?.fire_bucket_count),
        [schema_obj.other_accordion?.other_equipment]: getValues(
          schema_obj.other_accordion?.other_equipment
        ),
        [schema_obj.other_accordion?.other_equipment_count]:
          getValues(schema_obj.other_accordion?.other_equipment_count) === ""
            ? null
            : getValues(schema_obj.other_accordion?.other_equipment_count),
        [schema_obj.other_accordion?.other_equipment_remarks]: getValues(
          schema_obj.other_accordion?.other_equipment_remarks
        ),
        [schema_obj.other_accordion?.storage_worthy]: getValues(
          schema_obj.other_accordion?.storage_worthy
        ),
        [schema_obj.other_accordion?.floor_type]: getValues(
          schema_obj.other_accordion?.floor_type
        ),
        [schema_obj.other_accordion?.floor_remarks]: getValues(
          schema_obj.other_accordion?.floor_remarks
        ),
        [schema_obj.other_accordion?.shutters]: getValues(
          schema_obj.other_accordion?.shutters
        ),
        [schema_obj.other_accordion?.shutter_door_count]:
          getValues(schema_obj.other_accordion?.shutter_door_count) === ""
            ? null
            : getValues(schema_obj.other_accordion?.shutter_door_count),
        [schema_obj.other_accordion?.roof_type]: getValues(
          schema_obj.other_accordion?.roof_type
        ),
        [schema_obj.other_accordion?.other_roof_remarks]: getValues(
          schema_obj.other_accordion?.other_roof_remarks
        ),
        [schema_obj.other_accordion?.air_roof_fan_available]: getValues(
          schema_obj.other_accordion?.air_roof_fan_available
        ),
        [schema_obj.other_accordion?.air_roof_count]:
          getValues(schema_obj.other_accordion?.air_roof_count) === ""
            ? null
            : getValues(schema_obj.other_accordion?.air_roof_count),
        [schema_obj.other_accordion?.wall_type]: getValues(
          schema_obj.other_accordion?.wall_type
        ),
        [schema_obj.other_accordion?.other_wall_remarks]: getValues(
          schema_obj.other_accordion?.other_wall_remarks
        ),
        [schema_obj.other_accordion?.plinth_height]:
          getValues(schema_obj.other_accordion?.plinth_height) === ""
            ? null
            : getValues(schema_obj.other_accordion?.plinth_height),
        [schema_obj.other_accordion?.approach_road_type]: getValues(
          schema_obj.other_accordion?.approach_road_type
        ),
        [schema_obj.other_accordion?.ventilators]: getValues(
          schema_obj.other_accordion?.ventilators
        ),
        [schema_obj.other_accordion?.ventilators_count]:
          getValues(schema_obj.other_accordion?.ventilators_count) === ""
            ? null
            : getValues(schema_obj.other_accordion?.ventilators_count),
        [schema_obj.other_accordion?.window]: getValues(
          schema_obj.other_accordion?.window
        ),
        [schema_obj.other_accordion?.window_count]:
          getValues(schema_obj.other_accordion?.window_count) === ""
            ? null
            : getValues(schema_obj.other_accordion?.window_count),
        [schema_obj.other_accordion?.gate]: getValues(
          schema_obj.other_accordion?.gate
        ),
        [schema_obj.other_accordion?.gate_count]:
          getValues(schema_obj.other_accordion?.gate_count) === ""
            ? null
            : getValues(schema_obj.other_accordion?.gate_count),
        [schema_obj.other_accordion?.fencing]: getValues(
          schema_obj.other_accordion?.fencing
        ),
        [schema_obj.other_accordion?.compoundwall]: getValues(
          schema_obj.other_accordion?.compoundwall
        ),
        [schema_obj.other_accordion?.drainage]: getValues(
          schema_obj.other_accordion?.drainage
        ),
        [schema_obj.other_accordion?.water]: getValues(
          schema_obj.other_accordion?.water
        ),
        [schema_obj.other_accordion?.electricity]: getValues(
          schema_obj.other_accordion?.electricity
        ),
        [schema_obj.other_accordion?.live_wires_in_wh]: getValues(
          schema_obj.other_accordion?.live_wires_in_wh
        ),
        [schema_obj.other_accordion?.telephone_facility]: getValues(
          schema_obj.other_accordion?.telephone_facility
        ),
        [schema_obj.other_accordion?.telephone_no]:
          getValues(schema_obj.other_accordion?.telephone_no) === ""
            ? null
            : getValues(schema_obj.other_accordion?.telephone_no),
        [schema_obj.other_accordion?.dunnage]: getValues(
          schema_obj.other_accordion?.dunnage
        ),
        [schema_obj.other_accordion?.dunnage_type]: getValues(
          schema_obj.other_accordion?.dunnage_type
        ),
        [schema_obj.other_accordion?.other_dunnage_remarks]: getValues(
          schema_obj.other_accordion?.other_dunnage_remarks
        ),
        [schema_obj.other_accordion?.people_integrity_in_area]: getValues(
          schema_obj.other_accordion?.people_integrity_in_area
        ),
        [schema_obj.other_accordion?.theft_incidence_in_three_years]: getValues(
          schema_obj.other_accordion?.theft_incidence_in_three_years
        ),
        [schema_obj.other_accordion?.theft_remarks]: getValues(
          schema_obj.other_accordion?.theft_remarks
        ),
        [schema_obj.other_accordion?.damanget_incidence_in_three_years]:
          getValues(
            schema_obj.other_accordion?.damanget_incidence_in_three_years
          ),
        [schema_obj.other_accordion?.damage_remarks]: getValues(
          schema_obj.other_accordion?.damage_remarks
        ),
        [schema_obj.other_accordion?.flood_incidence_in_three_years]: getValues(
          schema_obj.other_accordion?.flood_incidence_in_three_years
        ),
        [schema_obj.other_accordion?.flood_remarks]: getValues(
          schema_obj.other_accordion?.flood_remarks
        ),
      },
    };

    //logic of shoe error from backend

    if (selectBoxOptions?.ware) {
    }

    try {
      const response = await AddInspectionMaster(finalData).unwrap();
      console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        console.log("response --> ", response);
        toasterAlert({
          message: "Form Inspection Drafted Successfully.",
          status: 200,
        });
      }
    } catch (error) {
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Save As Daft Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
      console.error("Save As Draft Error:", error);
    }
    console.log(data, "here");
  };

  // ============================= save as draft logic end =============================

  // ============================= Document status api start =============================
  // rtk hook code ..
  const [getDocumentStatus] = useGetDocumentStatusMutation();

  const getDocumentStatusMasterList = useCallback(async () => {
    try {
      const response = await getDocumentStatus().unwrap();
      // console.log("getDocumentStatusMasterList:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          status: response?.results.map(({ description, status_code, id }) => ({
            label: description,
            value: id,
            code: status_code,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  useEffect(() => {
    getDocumentStatusMasterList();
    // eslint-disable-next-line
  }, [getDocumentStatusMasterList]);

  // ============================= Document status api end =============================

  // ============================= Geo  Location Logic start =============================

  // ? memoized function ...
  const watchLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setValue(
            schema_obj.first_accordion.geo_location_of_warehouse,
            latitude + " " + longitude,
            {
              shouldValidate: true,
            }
          );
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (Number(saveData?.status?.status_code) === 0) {
      watchLocation();

      if ("geolocation" in navigator) {
        var options = {
          enableHighAccuracy: true, // Request high accuracy
          timeout: 5000, // Set a timeout (in milliseconds) for the request
          maximumAge: 0, // Force the device to get a fresh location
        };

        navigator.geolocation.getCurrentPosition(
          function (position) {
            // var latitude = position.coords.latitude;
            // var longitude = position.coords.longitude;
            // console.log("Latitude --->: " + latitude);
            // console.log("Longitude ----> : " + longitude);
          },
          function (error) {
            console.log("Error retrieving location: " + error.message);
          },
          options
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    }
  }, [watchLocation]);

  // ============================= Geo  Location Logic end =============================

  // ============================= assign, approve, rejected api start =============================

  const [
    UpdateInspectionMaster,
    { isLoading: updateInspectionMasterApiIsLoading },
  ] = useUpdateInspectionMasterMutation();

  const assignToMeFunction = async () => {
    const data = {
      id: getValues("id"),
      status: "assigned",
      remarks: "",
    };

    try {
      const response = await UpdateInspectionMaster(data).unwrap();
      // console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        InspectionDetailFunction();
        // console.log("response --> ", response);
        toasterAlert({
          message: "Form Inspection Assign Successfully.",
          status: 200,
        });
        // navigate(`${ROUTE_PATH.WAREHOUSE_RE_INSPECTION_STANDARD}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Assign Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }

    // console.log(data, "data");
  };

  const approvedToMeFunction = async () => {
    const data = {
      id: getValues("id"),
      status: "approved",
      remarks: "",
    };

    try {
      const response = await UpdateInspectionMaster(data).unwrap();
      // console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        // console.log("response --> ", response);
        toasterAlert({
          message: "Inspection Form Approved Successfully.",
          status: 200,
        });
        navigate(`${ROUTE_PATH.WAREHOUSE_RE_INSPECTION_STANDARD}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Approval Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }

    // console.log(data, "data");
  };

  const [rejectReason, setRejectReason] = useState(undefined);

  const [rejectError, setRejectError] = useState(false);

  const rejectedToMeFunction = async () => {
    const data = {
      id: getValues("id"),
      status: "rejected",
      remarks: "reject",
    };

    try {
      const response = await UpdateInspectionMaster(data).unwrap();
      console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        console.log("response --> ", response);
        toasterAlert({
          message: "Form Inspection Rejected Successfully.",
          status: 200,
        });
        navigate(`${ROUTE_PATH.WAREHOUSE_RE_INSPECTION_STANDARD}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Rejection Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 400,
      });
    }

    console.log(data, "data");
  };

  // ============================= assign, approve, rejected api end =============================

  // ============================= inspection get detail api start =============================

  const [fetchInspectionDetail] = useGetReInspectionByIDMutation();

  const [saveData, setSaveData] = useState({});

  // ? memoized function ...
  const InspectionDetailFunction = async () => {
    try {
      // console.log(location, details, "InspectionDetailFunction");
      const response = await fetchInspectionDetail({
        id: details?.id,
      }).unwrap();
      console.log("InspectionDetailFunction", response);
      // proposal_number
      setSaveData(response?.data || {});
      FillFormData(response?.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const FillFormData = (data) => {
    // console.log(data, "here");

    const { id, ...formData } = data?.other_details || { id: "" };

    const FormData = Object.entries(formData)
      .filter(([key, value]) => value !== null && value !== undefined)
      .map(([key, index]) => ({
        key: key,
        index: index,
      }));

    const DataArr = Object.entries(data)
      .filter(([key, value]) => value !== null && value !== undefined)
      .map(([key, index]) => ({
        key: key,
        index: index,
      }));

    const TotalArr = [...FormData, ...DataArr];

    TotalArr.map((item) => {
      if (item.key === "warehouse_name") {
        setValue("warehouse_name", item?.index?.warehouse_name || null, {
          shouldValidate: true,
        });
        regionOnChange({ value: item?.index?.region?.id || null });
        stateOnChange({ value: item?.index?.state?.id || null });
        zoneOnChange({ value: item?.index?.substate?.id || null });
        districtOnChange({ value: item?.index?.district?.id || null });
        areaOnChange({ value: item?.index?.area?.id || null });
        setValue("place_of_inspection", item?.index?.area?.id || null, {
          shouldValidate: true,
        });
        setValue("warehouse_type", item?.index?.warehouse_type?.id || null, {
          shouldValidate: true,
        });
        setValue(
          "warehouse_sub_type",
          item?.index?.warehouse_sub_type?.id || null,
          {
            shouldValidate: true,
          }
        );
        setValue(
          "warehouse_subtype",
          item?.index?.warehouse_sub_type?.id || null,
          {
            shouldValidate: true,
          }
        );
        setValue(
          "warehouse_unit_type",
          item?.index?.warehouse_unit_type?.id || null,
          {
            shouldValidate: true,
          }
        );
        setValue("warehouse_address", item?.index?.warehouse_address || null, {
          shouldValidate: true,
        });
        setValue("warehouse_pincode", item?.index?.warehouse_pincode || null, {
          shouldValidate: true,
        });
        setValue(
          "geo_location_of_warehouse",
          item?.index?.geo_location_of_warehouse || null,
          {
            shouldValidate: true,
          }
        );
      } else if (item.key === "security_guard_day_shift") {
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "security_guard_night_shift") {
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "supervisor_day_shift") {
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "supervisor_night_shift") {
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "bank") {
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "prestack_commodity") {
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "l1_user") {
        if (item?.index?.id !== null) {
          setValue("survey_official", item?.index?.id, {
            shouldValidate: true,
          });
        }
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "l2_user") {
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "l3_user") {
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "l4_user") {
        setValue(item.key, item?.index?.id || null, { shouldValidate: true });
      } else if (item.key === "other_details") {
        console.log(item.index, DataArr, "other details");
      } else if (item.key === "hiring_proposal") {
        setValue(item.key, item?.index?.proposal_number || null, {
          shouldValidate: true,
        });
      } else if (item.key === "client") {
        if (item?.index?.length > 0) {
          setClientsDetails(item.index);
        }
      } else if (item.key === "chamber") {
        if (item?.index?.length > 0) {
          console.log(data.warehouse_unit_type, "formData");
          if (data?.warehouse_unit_type?.warehouse_unit_type === "Oil Tank") {
            setOilTankDetails(item.index);
          } else if (
            data?.warehouse_unit_type?.warehouse_unit_type === "Silo"
          ) {
            setSiloDetails(item.index);
          } else {
            setChamberDetails(item.index);
          }
        }
      } else if (item.key === "expected_commodity") {
        if (item?.index?.length > 0) {
          const tempCom = item.index;
          const temp = [];

          for (let index = 0; index < tempCom.length; index++) {
            const old = tempCom[index];

            temp.push({
              commodity_id: old?.commodity_id?.id,
            });
          }

          setValue(item.key, temp, { shouldValidate: true });
        }
      } else if (item.key === "owner") {
        if (item?.index?.length > 0) {
          setWarehouseOwnersDetails(item.index);
        }
      } else if (item.key === "lessee") {
        if (item?.index?.length > 0) {
          setInternalType("Sub Leased");
          setLesseeDetails(item.index);
        }
      } else if (item.key === "fire_extinguisher_count") {
        if (item?.index !== null) {
          setValue("fire_extinguishers", "true", {
            shouldValidate: true,
          });
        }
        setValue(item.key, item.index, {
          shouldValidate: true,
        });
      } else if (item.key === "fire_bucket_count") {
        if (item?.index !== null) {
          setValue("fire_buckets", "true", {
            shouldValidate: true,
          });
        }
        setValue(item.key, item.index, {
          shouldValidate: true,
        });
      } else if (item.key === "other_equipment_count") {
        if (item?.index !== null) {
          setValue("other_equipment", "true", {
            shouldValidate: true,
          });
        }
        setValue(item.key, item.index, {
          shouldValidate: true,
        });
      } else if (item.key === "air_roof_count") {
        if (item?.index !== null) {
          setValue("air_roof_fan_available", "true", {
            shouldValidate: true,
          });
        }
        setValue(item.key, item.index, {
          shouldValidate: true,
        });
      } else if (item.key === "ventilators_count") {
        if (item?.index !== null) {
          setValue("ventilators", "true", {
            shouldValidate: true,
          });
        }
        setValue(item.key, item.index, {
          shouldValidate: true,
        });
      } else if (item.key === "dunnage_type") {
        if (item?.index !== null) {
          setValue("dunnage", "true", {
            shouldValidate: true,
          });
        }
        setValue(item.key, item.index, {
          shouldValidate: true,
        });
      } else if (item.key === "window_count") {
        if (item?.index !== null) {
          setValue("window", "true", {
            shouldValidate: true,
          });
        }
        setValue(item.key, item.index, {
          shouldValidate: true,
        });
      } else if (item.key === "gate_count") {
        if (item?.index !== null) {
          setValue("gate", "true", {
            shouldValidate: true,
          });
        }
        setValue(item.key, item.index, {
          shouldValidate: true,
        });
      } else if (item.key === "hypothecation_of_warehouse") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "hypothecation_of_warehouse") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "is_new_security_guard_day_shift") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "is_new_security_guard_night_shift") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "is_new_supervisor_day_shift") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "is_new_supervisor_night_shift") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "warehouse_owned_by") {
        setValue(item.key, item.index, {
          shouldValidate: true,
        });
      } else if (item.key === "distance_between_walls_and_stock") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "is_factory_premise") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "commodity_inside_wh") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "pre_stack_commodity_stack_countable") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "pre_stack_commodity_level_of_infestation") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "pre_stack_commodity_sample_mandatory") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "funded_by_bank") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "gg_access_to_stock_bk") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "weightment_facility") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "temp_humidity_maintainance") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "generator_available") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "insurance_of_plant_machinary") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "insurance_covers_stk_deter") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "riots_prone") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "earthquake_prone") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "flood_prone") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "fire_extinguishers") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "fire_buckets") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "other_equipment") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "storage_worthy") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "air_roof_fan_available") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "ventilators") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "window") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "gate") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "fencing") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "compoundwall") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "drainage") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "water") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "electricity") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "live_wires_in_wh") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "telephone_facility") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "theft_incidence_in_three_years") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "damanget_incidence_in_three_years") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else if (item.key === "flood_incidence_in_three_years") {
        setValue(item.key, item.index ? "true" : "false", {
          shouldValidate: true,
        });
      } else {
        setValue(item.key, item.index, { shouldValidate: true });
      }
    });
  };

  useEffect(() => {
    InspectionDetailFunction();
    // eslint-disable-next-line
  }, []);

  // ============================= inspection get detail api end =============================

  // ============================= inspection form disable logic start =============================

  useEffect(() => {
    if (saveData?.status === null || details?.view) {
      setValue("form_edit", true, { shouldValidate: true });
      setValue("is_draftable", false, { shouldValidate: true });
    } else if (Number(saveData?.status?.status_code || 0) === 0) {
      if (saveData?.l1_user !== null) {
        if (saveData?.l1_user?.id === loginData?.userDetails?.id || 0) {
          setValue("is_draftable", true, { shouldValidate: true });
          setValue("form_edit", false, { shouldValidate: true });
        } else {
          setValue("form_edit", true, { shouldValidate: true });
          setValue("is_draftable", false, { shouldValidate: true });
        }
      }
    } else if (Number(saveData?.status?.status_code || 0) === 1) {
      setValue("is_draftable", false, { shouldValidate: true });
      setValue("form_edit", true, { shouldValidate: true });
    } else if (Number(saveData?.status?.status_code || 0) === 2) {
      if (saveData?.l2_user !== null) {
        if (saveData?.l2_user?.id === loginData?.userDetails?.id || 0) {
          setValue("is_draftable", false, { shouldValidate: true });
          setValue("form_edit", false, { shouldValidate: true });
        } else {
          setValue("form_edit", true, { shouldValidate: true });
          setValue("is_draftable", false, { shouldValidate: true });
        }
      }
    } else if (Number(saveData?.status?.status_code || 0) === 3) {
      setValue("is_draftable", false, { shouldValidate: true });
      setValue("form_edit", true, { shouldValidate: true });
    } else if (Number(saveData?.status?.status_code || 0) === 4) {
      setValue("is_draftable", false, { shouldValidate: true });
      setValue("form_edit", true, { shouldValidate: true });
    } else if (Number(saveData?.status?.status_code || 0) === 5) {
      if (saveData?.l3_user !== null) {
        if (saveData?.l3_user?.id === loginData?.userDetails?.id || 0) {
          setValue("is_draftable", false, { shouldValidate: true });
          setValue("form_edit", false, { shouldValidate: true });
        } else {
          setValue("form_edit", true, { shouldValidate: true });
          setValue("is_draftable", false, { shouldValidate: true });
        }
      }
    } else if (Number(saveData?.status?.status_code || 0) === 6) {
      setValue("is_draftable", false, { shouldValidate: true });
      setValue("form_edit", true, { shouldValidate: true });
    } else if (Number(saveData?.status?.status_code || 0) === 7) {
      setValue("is_draftable", false, { shouldValidate: true });
      setValue("form_edit", true, { shouldValidate: true });
    } else if (Number(saveData?.status?.status_code || 0) === 8) {
      if (saveData?.l4_user !== null) {
        if (saveData?.l4_user?.id === loginData?.userDetails?.id || 0) {
          setValue("is_draftable", false, { shouldValidate: true });
          setValue("form_edit", false, { shouldValidate: true });
        } else {
          setValue("form_edit", true, { shouldValidate: true });
          setValue("is_draftable", false, { shouldValidate: true });
        }
      }
    } else if (Number(saveData?.status?.status_code || 0) === 9) {
      setValue("is_draftable", false, { shouldValidate: true });
      setValue("form_edit", true, { shouldValidate: true });
    } else if (Number(saveData?.status?.status_code || 0) === 10) {
      setValue("is_draftable", false, { shouldValidate: true });
      setValue("form_edit", true, { shouldValidate: true });
    } else {
      setValue("is_draftable", false, { shouldValidate: true });
      setValue("form_edit", false, { shouldValidate: true });
    }
  }, [saveData]);

  // ============================= inspection form disable logic end =============================

  // ============================= inspection form  start =============================

  const [AddInspectionMaster, { isLoading: addInspectionMasterApiIsLoading }] =
    useAddInspectionMasterMutation();

  const onSubmit = async (data) => {
    try {
      const { hiring_proposal, ...data2 } = data;

      const finalData = {
        ...data2,
        is_draft: false,
        owner: warehouseOwnersDetails,
        lessee: lesseeDetails,
        client: clientsDetails,
        [schema_obj?.second_accordion?.license_number]:
          getValues(schema_obj?.second_accordion?.license_number) === ""
            ? null
            : getValues(schema_obj?.second_accordion?.license_number),
        [schema_obj?.second_accordion?.license_start_date]:
          getValues(schema_obj?.second_accordion?.license_start_date) === ""
            ? null
            : getValues(schema_obj?.second_accordion?.license_start_date),
        [schema_obj?.second_accordion?.license_end_date]:
          getValues(schema_obj?.second_accordion?.license_end_date) === ""
            ? null
            : getValues(schema_obj?.second_accordion?.license_end_date),
        [schema_obj?.second_accordion?.wdra_license_number]:
          getValues(schema_obj?.second_accordion?.wdra_license_number) === ""
            ? null
            : getValues(schema_obj?.second_accordion?.wdra_license_number),
        [schema_obj?.second_accordion?.wdra_license_start_date]:
          getValues(schema_obj?.second_accordion?.wdra_license_start_date) ===
          ""
            ? null
            : getValues(schema_obj?.second_accordion?.wdra_license_start_date),
        [schema_obj?.second_accordion?.wdra_license_end_date]:
          getValues(schema_obj?.second_accordion?.wdra_license_end_date) === ""
            ? null
            : getValues(schema_obj?.second_accordion?.wdra_license_end_date),
        [schema_obj?.second_accordion?.fssai_license_number]:
          getValues(schema_obj?.second_accordion?.fssai_license_number) === ""
            ? null
            : getValues(schema_obj?.second_accordion?.fssai_license_number),
        [schema_obj?.second_accordion?.fssai_license_start_date]:
          getValues(schema_obj?.second_accordion?.fssai_license_start_date) ===
          ""
            ? null
            : getValues(schema_obj?.second_accordion?.fssai_license_start_date),
        [schema_obj?.second_accordion?.fssai_license_end_date]:
          getValues(schema_obj?.second_accordion?.fssai_license_end_date) === ""
            ? null
            : getValues(schema_obj?.second_accordion?.fssai_license_end_date),
        chamber:
          selectBoxOptions?.warehouseUnitType?.filter(
            (item) =>
              item.value ===
              getValues(schema_obj.first_accordion.warehouse_unit_type)
          )?.[0]?.label === "Oil Tank"
            ? oilTankDetails
            : selectBoxOptions?.warehouseUnitType?.filter(
                (item) =>
                  item.value ===
                  getValues(schema_obj.first_accordion.warehouse_unit_type)
              )?.[0]?.label === "Silo"
            ? siloDetails
            : chamberDetails,
        other_details: {
          [schema_obj.other_accordion?.dacroit_prone]: getValues(
            schema_obj.other_accordion?.dacroit_prone
          ),
          [schema_obj.other_accordion?.riots_prone]: getValues(
            schema_obj.other_accordion?.riots_prone
          ),
          [schema_obj.other_accordion?.earthquake_prone]: getValues(
            schema_obj.other_accordion?.earthquake_prone
          ),
          [schema_obj.other_accordion?.flood_prone]: getValues(
            schema_obj.other_accordion?.flood_prone
          ),
          [schema_obj.other_accordion?.main_center_distance]:
            getValues(schema_obj.other_accordion?.main_center_distance) === ""
              ? null
              : getValues(schema_obj.other_accordion?.main_center_distance),
          [schema_obj.other_accordion?.police_station_distance]:
            getValues(schema_obj.other_accordion?.police_station_distance) ===
            ""
              ? null
              : getValues(schema_obj.other_accordion?.police_station_distance),
          [schema_obj.other_accordion?.fire_station_distance]:
            getValues(schema_obj.other_accordion?.fire_station_distance) === ""
              ? null
              : getValues(schema_obj.other_accordion?.fire_station_distance),
          [schema_obj.other_accordion?.mandi_distance]:
            getValues(schema_obj.other_accordion?.mandi_distance) === ""
              ? null
              : getValues(schema_obj.other_accordion?.mandi_distance),
          [schema_obj.other_accordion?.goodshed_distance]:
            getValues(schema_obj.other_accordion?.goodshed_distance) === ""
              ? null
              : getValues(schema_obj.other_accordion?.goodshed_distance),
          [schema_obj.other_accordion?.fire_extinguishers]: getValues(
            schema_obj.other_accordion?.fire_extinguishers
          ),
          [schema_obj.other_accordion?.fire_extinguisher_count]:
            getValues(schema_obj.other_accordion?.fire_extinguisher_count) ===
            ""
              ? null
              : getValues(schema_obj.other_accordion?.fire_extinguisher_count),
          [schema_obj.other_accordion?.fire_buckets]: getValues(
            schema_obj.other_accordion?.fire_buckets
          ),
          [schema_obj.other_accordion?.fire_bucket_count]:
            getValues(schema_obj.other_accordion?.fire_bucket_count) === ""
              ? null
              : getValues(schema_obj.other_accordion?.fire_bucket_count),
          [schema_obj.other_accordion?.other_equipment]: getValues(
            schema_obj.other_accordion?.other_equipment
          ),
          [schema_obj.other_accordion?.other_equipment_count]:
            getValues(schema_obj.other_accordion?.other_equipment_count) === ""
              ? null
              : getValues(schema_obj.other_accordion?.other_equipment_count),
          [schema_obj.other_accordion?.other_equipment_remarks]: getValues(
            schema_obj.other_accordion?.other_equipment_remarks
          ),
          [schema_obj.other_accordion?.storage_worthy]: getValues(
            schema_obj.other_accordion?.storage_worthy
          ),
          [schema_obj.other_accordion?.floor_type]: getValues(
            schema_obj.other_accordion?.floor_type
          ),
          [schema_obj.other_accordion?.floor_remarks]: getValues(
            schema_obj.other_accordion?.floor_remarks
          ),
          [schema_obj.other_accordion?.shutters]: getValues(
            schema_obj.other_accordion?.shutters
          ),
          [schema_obj.other_accordion?.shutter_door_count]:
            getValues(schema_obj.other_accordion?.shutter_door_count) === ""
              ? null
              : getValues(schema_obj.other_accordion?.shutter_door_count),
          [schema_obj.other_accordion?.roof_type]: getValues(
            schema_obj.other_accordion?.roof_type
          ),
          [schema_obj.other_accordion?.other_roof_remarks]: getValues(
            schema_obj.other_accordion?.other_roof_remarks
          ),
          [schema_obj.other_accordion?.air_roof_fan_available]: getValues(
            schema_obj.other_accordion?.air_roof_fan_available
          ),
          [schema_obj.other_accordion?.air_roof_count]:
            getValues(schema_obj.other_accordion?.air_roof_count) === ""
              ? null
              : getValues(schema_obj.other_accordion?.air_roof_count),
          [schema_obj.other_accordion?.wall_type]: getValues(
            schema_obj.other_accordion?.wall_type
          ),
          [schema_obj.other_accordion?.other_wall_remarks]: getValues(
            schema_obj.other_accordion?.other_wall_remarks
          ),
          [schema_obj.other_accordion?.plinth_height]:
            getValues(schema_obj.other_accordion?.plinth_height) === ""
              ? null
              : getValues(schema_obj.other_accordion?.plinth_height),
          [schema_obj.other_accordion?.approach_road_type]: getValues(
            schema_obj.other_accordion?.approach_road_type
          ),
          [schema_obj.other_accordion?.ventilators]: getValues(
            schema_obj.other_accordion?.ventilators
          ),
          [schema_obj.other_accordion?.ventilators_count]:
            getValues(schema_obj.other_accordion?.ventilators_count) === ""
              ? null
              : getValues(schema_obj.other_accordion?.ventilators_count),
          [schema_obj.other_accordion?.window]: getValues(
            schema_obj.other_accordion?.window
          ),
          [schema_obj.other_accordion?.window_count]:
            getValues(schema_obj.other_accordion?.window_count) === ""
              ? null
              : getValues(schema_obj.other_accordion?.window_count),
          [schema_obj.other_accordion?.gate]: getValues(
            schema_obj.other_accordion?.gate
          ),
          [schema_obj.other_accordion?.gate_count]:
            getValues(schema_obj.other_accordion?.gate_count) === ""
              ? null
              : getValues(schema_obj.other_accordion?.gate_count),
          [schema_obj.other_accordion?.fencing]: getValues(
            schema_obj.other_accordion?.fencing
          ),
          [schema_obj.other_accordion?.compoundwall]: getValues(
            schema_obj.other_accordion?.compoundwall
          ),
          [schema_obj.other_accordion?.drainage]: getValues(
            schema_obj.other_accordion?.drainage
          ),
          [schema_obj.other_accordion?.water]: getValues(
            schema_obj.other_accordion?.water
          ),
          [schema_obj.other_accordion?.electricity]: getValues(
            schema_obj.other_accordion?.electricity
          ),
          [schema_obj.other_accordion?.live_wires_in_wh]: getValues(
            schema_obj.other_accordion?.live_wires_in_wh
          ),
          [schema_obj.other_accordion?.telephone_facility]: getValues(
            schema_obj.other_accordion?.telephone_facility
          ),
          [schema_obj.other_accordion?.telephone_no]:
            getValues(schema_obj.other_accordion?.telephone_no) === ""
              ? null
              : getValues(schema_obj.other_accordion?.telephone_no),
          [schema_obj.other_accordion?.dunnage]: getValues(
            schema_obj.other_accordion?.dunnage
          ),
          [schema_obj.other_accordion?.dunnage_type]: getValues(
            schema_obj.other_accordion?.dunnage_type
          ),
          [schema_obj.other_accordion?.other_dunnage_remarks]: getValues(
            schema_obj.other_accordion?.other_dunnage_remarks
          ),
          [schema_obj.other_accordion?.people_integrity_in_area]: getValues(
            schema_obj.other_accordion?.people_integrity_in_area
          ),
          [schema_obj.other_accordion?.theft_incidence_in_three_years]:
            getValues(
              schema_obj.other_accordion?.theft_incidence_in_three_years
            ),
          [schema_obj.other_accordion?.theft_remarks]: getValues(
            schema_obj.other_accordion?.theft_remarks
          ),
          [schema_obj.other_accordion?.damanget_incidence_in_three_years]:
            getValues(
              schema_obj.other_accordion?.damanget_incidence_in_three_years
            ),
          [schema_obj.other_accordion?.damage_remarks]: getValues(
            schema_obj.other_accordion?.damage_remarks
          ),
          [schema_obj.other_accordion?.flood_incidence_in_three_years]:
            getValues(
              schema_obj.other_accordion?.flood_incidence_in_three_years
            ),
          [schema_obj.other_accordion?.flood_remarks]: getValues(
            schema_obj.other_accordion?.flood_remarks
          ),
        },
      };

      if (
        selectBoxOptions?.warehouseSubType?.filter(
          (item) =>
            item.value ===
            getValues(schema_obj.first_accordion.warehouse_sub_type)
        )[0]?.label === "Revenue sharing"
      ) {
        if (internalType === "Sub Leased") {
          if (lesseeDetails?.length > 0) {
            if (
              lesseeDetails.reduce(
                (total, item) =>
                  Number(total) + Number(item.revenue_sharing_ratio),
                0
              ) > 100
            ) {
              toasterAlert({
                message: "Lessee Total Revenue Sharing is Greater than 100.",
                status: 440,
              });
              return;
            }
          } else {
            toasterAlert({
              message: "Please Enter Lessee Details.",
              status: 440,
            });
            return;
          }
        } else {
          if (warehouseOwnersDetails?.length > 0) {
            if (
              warehouseOwnersDetails.reduce(
                (total, item) =>
                  Number(total) + Number(item.revenue_sharing_ratio),
                0
              ) > 100
            ) {
              toasterAlert({
                message: "Owner Total Revenue Sharing is Greater than 100.",
                status: 440,
              });
              return;
            }
          } else {
            toasterAlert({
              message: "Please Enter Owner Details.",
              status: 440,
            });
            return;
          }
        }
      } else {
        if (internalType === "Sub Leased") {
          if (lesseeDetails?.length > 0) {
            if (
              lesseeDetails.reduce(
                (total, item) => Number(total) + Number(item.rent_amount),
                0
              ) !== Number(getValues("total_rent_per_month"))
            ) {
              toasterAlert({
                message:
                  "Lessee Total Rent is not equal to Total rent per month",
                status: 440,
              });

              return;
            }
          } else {
            toasterAlert({
              message: "Please Enter Lessee Details.",
              status: 440,
            });
            return;
          }
        } else {
          if (warehouseOwnersDetails?.length > 0) {
            if (
              warehouseOwnersDetails.reduce(
                (total, item) => Number(total) + Number(item.rent_amount),
                0
              ) !== Number(getValues("total_rent_per_month"))
            ) {
              toasterAlert({
                message:
                  "Owner Total Rent is not equal to Total rent per month",
                status: 440,
              });
              return;
            }
          } else {
            toasterAlert({
              message: "Please Enter Owner Details.",
              status: 440,
            });
            return;
          }
        }
      }

      if (clientsDetails?.length > 0) {
      } else {
        toasterAlert({
          message: "Please Enter Client Details.",
          status: 440,
        });
        return;
      }

      if (
        selectBoxOptions?.warehouseUnitType?.filter(
          (item) =>
            item.value ===
            getValues(schema_obj.first_accordion.warehouse_unit_type)
        )?.[0]?.label === "Oil Tank"
      ) {
        if (oilTankDetails?.length > 0) {
        } else {
          toasterAlert({
            message: "Please Enter Oil Tank Details.",
            status: 440,
          });
          return;
        }
      } else if (
        selectBoxOptions?.warehouseUnitType?.filter(
          (item) =>
            item.value ===
            getValues(schema_obj.first_accordion.warehouse_unit_type)
        )?.[0]?.label === "Silo"
      ) {
        if (siloDetails?.length > 0) {
        } else {
          toasterAlert({
            message: "Please Enter Silo Tank Details.",
            status: 440,
          });
          return;
        }
      } else {
        if (chamberDetails?.length > 0) {
        } else {
          toasterAlert({
            message: "Please Enter Chamber Tank Details.",
            status: 440,
          });
          return;
        }
      }

      if (
        finalData?.supervisor_day_shift ||
        finalData?.supervisor_night_shift ||
        finalData?.is_new_supervisor_day_shift === "true" ||
        finalData?.is_new_supervisor_night_shift === "true"
      ) {
        if (
          finalData?.supervisor_day_shift &&
          finalData?.is_new_supervisor_day_shift === "true"
        ) {
          toasterAlert({
            message: "Please select only one Supervisor Day Option.",
            status: 440,
          });

          return;
        } else if (
          finalData?.supervisor_night_shift &&
          finalData?.is_new_supervisor_night_shift === "true"
        ) {
          toasterAlert({
            message: "Please select only one Supervisor Night Option.",
            status: 440,
          });

          return;
        }
        console.log("");
      } else {
        toasterAlert({
          message: "Please select any one  Shift of Supervisor ",
          status: 440,
        });

        return;
      }

      if (
        finalData?.is_new_security_guard_day_shift === "true" ||
        finalData?.is_new_security_guard_night_shift === "true" ||
        finalData?.security_guard_day_shift ||
        finalData?.security_guard_night_shift
      ) {
        console.log("");
        if (
          finalData?.security_guard_day_shift &&
          finalData?.is_new_security_guard_day_shift === "true"
        ) {
          toasterAlert({
            message: "Please select only one Security Guard Day Option.",
            status: 440,
          });

          return;
        } else if (
          finalData?.security_guard_night_shift &&
          finalData?.is_new_security_guard_night_shift === "true"
        ) {
          toasterAlert({
            message: "Please select only one Security Guard Night Option.",
            status: 440,
          });

          return;
        }
      } else {
        toasterAlert({
          message: "Please select any one  Shift of Security Guard ",
          status: 440,
        });

        return;
      }

      const response = await AddInspectionMaster(finalData).unwrap();
      console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        console.log("response --> ", response);
        if (Number(saveData?.status?.status_code || 0) < 2) {
          toasterAlert({
            message: "Form Inspection Submitted Successfully.",
            status: 200,
          });

          navigate("/inspection-master");
        } else if (
          Number(saveData?.status?.status_code || 0) === 2 ||
          Number(saveData?.status?.status_code || 0) === 5 ||
          Number(saveData?.status?.status_code || 0) === 8
        ) {
          approvedToMeFunction();
        }
      }
    } catch (error) {
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Warehouse Inspection Submission Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
      console.error("Error:", error);
    }
    console.log(data);
  };

  const toasterAlert = (obj) => {
    let msg = obj?.message;
    let status = obj?.status;
    console.log("toasterAlert", obj);
    if (status === 400) {
      const errorData = obj?.data?.data || obj?.data;
      let errorMessage = "";

      Object.keys(errorData)?.forEach((key) => {
        const messages = errorData[key];
        console.log("messages --> ", messages);
        if (typeof messages === "object") {
          messages &&
            messages?.forEach((message) => {
              errorMessage += `${key} : ${message} \n`;
            });
        } else {
          showToastByStatusCode(status, msg);
        }
      });
      showToastByStatusCode(status, errorMessage);
      return false;
    } else if (status === 410) {
      showToastByStatusCode(status, msg);
    }
    showToastByStatusCode(status, msg);
  };

  useEffect(() => {
    const breadcrumbArray = [
      {
        title: "Re Inspection Master",
        link: `${ROUTE_PATH.WAREHOUSE_RE_INSPECTION_STANDARD}`,
      },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
  }, [details]);

  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
  }, []);
  // ============================= inspection form start =============================

  return (
    <Box bg="gray.50" p="0" position="relative">
      <Box mt="10">
        <Accordion allowMultiple>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ================ Warehouse Details ================= */}
            {/* <MotionSlideUp duration={0.2 * 0.5} delay={0.1 * 0.5}> */}
            <AccordionItem>
              {({ isExpanded }) => (
                <>
                  <Box>
                    <AccordionButton bg="white" p="4" borderRadius={10}>
                      <Box
                        fontWeight="bold"
                        as="span"
                        flex="1"
                        textAlign="left"
                      >
                        Warehouse Details
                      </Box>
                      {isExpanded ? (
                        <MinusIcon fontSize="12px" />
                      ) : (
                        <AddIcon fontSize="12px" />
                      )}
                    </AccordionButton>

                    <AccordionPanel bg="white" mt="5" pb={4} py="4" px="8">
                      <Box
                        w={{
                          base: "100%",
                          sm: "100%",
                          md: "100%",
                          lg: "100%",
                          xl: "100%",
                        }}
                      >
                        <Box>
                          {/* -------------- Proposal  No------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            {/* --------------  Proposal No -------------- */}
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                Proposal No{" "}
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                // isInvalid={true}
                              >
                                <Input
                                  type="text"
                                  {...register(
                                    schema_obj.first_accordion.hiring_proposal
                                  )}
                                  border="1px"
                                  borderColor="gray.10"
                                  backgroundColor={"white"}
                                  height={"15px "}
                                  borderRadius={"lg"}
                                  isDisabled={true}
                                  //value={inputValue}
                                  //  onChange={onChange}
                                  _placeholder={commonStyle._placeholder}
                                  _hover={commonStyle._hover}
                                  _focus={commonStyle._focus}
                                  //  isDisabled={true}
                                  p={{ base: "4" }}
                                  fontWeight={{ base: "normal" }}
                                  fontStyle={"normal"}
                                  placeholder="Proposal No"
                                />
                              </FormControl>

                              <FormErrorMessage color="red">
                                Enter
                              </FormErrorMessage>
                            </GridItem>
                            <GridItem
                              colSpan={{ base: 1 }}
                              textAlign={"left"}
                            ></GridItem>
                          </Grid>

                          {/* --------------  Warehouse type select box-------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                Warehouse Type{" "}
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                //  isInvalid={true}
                              >
                                <ReactSelect
                                  {...register(
                                    schema_obj.first_accordion.warehouse_type
                                  )}
                                  options={
                                    selectBoxOptions?.warehouseType || []
                                  }
                                  isLoading={getWarehouseTypeApiIsLoading}
                                  isDisabled={true}
                                  name={
                                    schema_obj.first_accordion.warehouse_type
                                  }
                                  value={
                                    selectBoxOptions?.warehouseType?.filter(
                                      (item) =>
                                        item.value ===
                                        getValues(
                                          schema_obj.first_accordion
                                            .warehouse_type
                                        )
                                    )[0] || null
                                  }
                                  onChange={(val) => {
                                    setValue(
                                      schema_obj.first_accordion.warehouse_type,
                                      val?.value,
                                      {
                                        shouldValidate: true,
                                      }
                                    );
                                  }}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: false ? "red" : "#c3c3c3",

                                      padding: "1px",
                                      textAlign: "left",
                                    }),
                                    ...reactSelectStyle,
                                  }}
                                />
                              </FormControl>

                              <FormErrorMessage color="red">
                                Enter
                              </FormErrorMessage>
                            </GridItem>
                          </Grid>

                          {/* --------------  Warehouse sub type select box-------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                Warehouse Sub Type{" "}
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                //  isInvalid={true}
                              >
                                <ReactSelect
                                  options={
                                    selectBoxOptions?.warehouseSubType || []
                                  }
                                  isLoading={getWarehouseSubTypeApiIsLoading}
                                  isDisabled={true}
                                  value={
                                    selectBoxOptions?.warehouseSubType?.filter(
                                      (item) =>
                                        item.value ===
                                        getValues(
                                          schema_obj.first_accordion
                                            .warehouse_sub_type
                                        )
                                    )[0] || null
                                  }
                                  onChange={(val) => {
                                    setValue(
                                      schema_obj.first_accordion
                                        .warehouse_sub_type,
                                      val?.value,
                                      {
                                        shouldValidate: true,
                                      }
                                    );
                                  }}
                                  {...register(
                                    schema_obj.first_accordion
                                      .warehouse_sub_type
                                  )}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: false ? "red" : "#c3c3c3",

                                      padding: "1px",
                                      textAlign: "left",
                                    }),
                                    ...reactSelectStyle,
                                  }}
                                />
                              </FormControl>

                              <FormErrorMessage color="red">
                                Enter
                              </FormErrorMessage>
                            </GridItem>
                          </Grid>

                          {/* --------------  Warehouse unit type select box-------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                Warehouse Unit Type
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                //  isInvalid={true}
                              >
                                <ReactSelect
                                  options={
                                    selectBoxOptions?.warehouseUnitType || []
                                  }
                                  isDisabled={true}
                                  isLoading={getWarehouseUnitTypeApiIsLoading}
                                  value={
                                    selectBoxOptions?.warehouseUnitType?.filter(
                                      (item) =>
                                        item.value ===
                                        getValues(
                                          schema_obj.first_accordion
                                            .warehouse_unit_type
                                        )
                                    )[0] || null
                                  }
                                  {...register(
                                    schema_obj.first_accordion
                                      .warehouse_unit_type
                                  )}
                                  onChange={(val) => {
                                    setValue(
                                      schema_obj.first_accordion
                                        .warehouse_unit_type,
                                      val?.value,
                                      {
                                        shouldValidate: true,
                                      }
                                    );
                                    if (val?.value === 4) {
                                      setValue(
                                        schema_obj.fifth_accordion
                                          .temp_humidity_maintainance,
                                        "false",
                                        {
                                          shouldValidate: true,
                                        }
                                      );
                                      setValue(
                                        schema_obj.fifth_accordion
                                          .generator_available,
                                        "false",
                                        {
                                          shouldValidate: true,
                                        }
                                      );
                                      setValue(
                                        schema_obj.fifth_accordion
                                          .insurance_of_plant_machinary,
                                        "false",
                                        {
                                          shouldValidate: true,
                                        }
                                      );
                                      setValue(
                                        schema_obj.fifth_accordion
                                          .insurance_covers_stk_deter,
                                        "false",
                                        {
                                          shouldValidate: true,
                                        }
                                      );
                                    } else {
                                      setValue(
                                        schema_obj.fifth_accordion
                                          .temp_humidity_maintainance,
                                        null,
                                        {
                                          shouldValidate: true,
                                        }
                                      );
                                      setValue(
                                        schema_obj.fifth_accordion
                                          .generator_available,
                                        null,
                                        {
                                          shouldValidate: true,
                                        }
                                      );
                                      setValue(
                                        schema_obj.fifth_accordion
                                          .insurance_of_plant_machinary,
                                        null,
                                        {
                                          shouldValidate: true,
                                        }
                                      );
                                      setValue(
                                        schema_obj.fifth_accordion
                                          .insurance_covers_stk_deter,
                                        null,
                                        {
                                          shouldValidate: true,
                                        }
                                      );
                                    }
                                    setOilTankDetails([]);
                                    setSiloDetails([]);
                                    setChamberDetails([]);
                                  }}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: errors?.[
                                        schema_obj.first_accordion
                                          .warehouse_unit_type
                                      ]
                                        ? "red"
                                        : "#c3c3c3",

                                      padding: "1px",
                                      textAlign: "left",
                                    }),
                                    ...reactSelectStyle,
                                  }}
                                />
                              </FormControl>

                              <FormErrorMessage color="red">
                                Enter
                              </FormErrorMessage>
                            </GridItem>
                          </Grid>

                          {/* --------------  Warehouse Name -------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            {/* --------------  Proposal No -------------- */}
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                Warehouse Name{" "}
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                // isInvalid={true}
                              >
                                <Textarea
                                  {...register(
                                    schema_obj.first_accordion.warehouse_name
                                  )}
                                  border="1px"
                                  borderColor="gray.10"
                                  backgroundColor={"white"}
                                  height={"15px "}
                                  isDisabled={true}
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
                                  placeholder="Warehouse Name"
                                />
                              </FormControl>

                              <FormErrorMessage color="red">
                                Enter
                              </FormErrorMessage>
                            </GridItem>
                          </Grid>

                          {/* --------------  region select box-------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                Region{" "}
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                //  isInvalid={true}
                              >
                                <ReactSelect
                                  options={selectBoxOptions?.regions || []}
                                  value={
                                    selectBoxOptions?.regions?.filter(
                                      (item) =>
                                        item.value ===
                                        getValues(
                                          schema_obj.first_accordion.region
                                        )
                                    )[0] || null
                                  }
                                  {...register(
                                    schema_obj.first_accordion.region
                                  )}
                                  isDisabled={true}
                                  isLoading={fetchLocationDrillDownApiIsLoading}
                                  onChange={(val) => regionOnChange(val)}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: errors?.region
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

                          {/* --------------  state select box-------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                State{" "}
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                //  isInvalid={true}
                              >
                                <ReactSelect
                                  options={selectBoxOptions?.states || []}
                                  isLoading={fetchLocationDrillDownApiIsLoading}
                                  value={
                                    selectBoxOptions?.states?.filter(
                                      (item) =>
                                        item.value ===
                                        getValues(
                                          schema_obj.first_accordion.state
                                        )
                                    )[0] || null
                                  }
                                  {...register(
                                    schema_obj.first_accordion.state
                                  )}
                                  isDisabled={true}
                                  onChange={(val) => stateOnChange(val)}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: errors?.state
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

                          {/* --------------  sub_state select box-------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                Subtype{" "}
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
                                <ReactSelect
                                  options={selectBoxOptions?.substate || []}
                                  isLoading={fetchLocationDrillDownApiIsLoading}
                                  value={
                                    selectBoxOptions?.substate?.filter(
                                      (item) =>
                                        item.value ===
                                        getValues(
                                          schema_obj.first_accordion.sub_state
                                        )
                                    )[0] || null
                                  }
                                  {...register(
                                    schema_obj.first_accordion.sub_state
                                  )}
                                  isDisabled={true}
                                  onChange={(val) => zoneOnChange(val)}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: errors?.sub_state
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

                          {/* --------------  district select box-------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                District{" "}
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
                                <ReactSelect
                                  options={selectBoxOptions?.districts || []}
                                  isLoading={fetchLocationDrillDownApiIsLoading}
                                  value={
                                    selectBoxOptions?.districts?.filter(
                                      (item) =>
                                        item.value ===
                                        getValues(
                                          schema_obj.first_accordion.district
                                        )
                                    )[0] || null
                                  }
                                  {...register(
                                    schema_obj.first_accordion.district
                                  )}
                                  isDisabled={true}
                                  onChange={(val) => districtOnChange(val)}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: errors?.district
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

                          {/* --------------  areas select box-------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                Area{" "}
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
                                <ReactSelect
                                  options={selectBoxOptions?.areas || []}
                                  isLoading={fetchLocationDrillDownApiIsLoading}
                                  value={
                                    selectBoxOptions?.areas?.filter(
                                      (item) =>
                                        item.value ===
                                        getValues(
                                          schema_obj.first_accordion.area
                                        )
                                    )[0] || null
                                  }
                                  isDisabled={true}
                                  {...register(schema_obj.first_accordion.area)}
                                  onChange={(val) => areaOnChange(val)}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      backgroundColor: "#fff",
                                      borderRadius: "6px",
                                      borderColor: errors?.area
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

                          {/* --------------  Warehouse address -------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            {/* --------------  Proposal No -------------- */}
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                Warehouse Address{" "}
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                isInvalid={
                                  errors?.[
                                    schema_obj.first_accordion.warehouse_address
                                  ]
                                }
                              >
                                <Textarea
                                  {...register(
                                    schema_obj.first_accordion.warehouse_address
                                  )}
                                  border="1px"
                                  borderColor="gray.10"
                                  backgroundColor={"white"}
                                  height={"15px "}
                                  borderRadius={"lg"}
                                  isDisabled={true} //value={inputValue}
                                  //  onChange={onChange}
                                  _placeholder={commonStyle._placeholder}
                                  _hover={commonStyle._hover}
                                  _focus={commonStyle._focus}
                                  // isDisabled={true}
                                  p={{ base: "4" }}
                                  fontWeight={{ base: "normal" }}
                                  fontStyle={"normal"}
                                  placeholder="Warehouse Name"
                                />
                              </FormControl>
                            </GridItem>
                          </Grid>

                          {/* -------------- Pin code ------------ */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                Pin Code{" "}
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                isInvalid={
                                  errors?.[schema_obj.first_accordion.pincode]
                                }
                              >
                                <Input
                                  type="number"
                                  {...register(
                                    schema_obj.first_accordion.pincode
                                  )}
                                  border="1px"
                                  borderColor="gray.10"
                                  backgroundColor={"white"}
                                  height={"15px "}
                                  borderRadius={"lg"}
                                  isDisabled={true}
                                  //value={inputValue}
                                  //  onChange={onChange}
                                  _placeholder={commonStyle._placeholder}
                                  _hover={commonStyle._hover}
                                  _focus={commonStyle._focus}
                                  //  isDisabled={true}
                                  p={{ base: "4" }}
                                  fontWeight={{ base: "normal" }}
                                  fontStyle={"normal"}
                                  placeholder="Pin Code No"
                                />
                              </FormControl>
                            </GridItem>
                          </Grid>

                          {/* -------------- GPS Location of warehouse  ------------ */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                GPS Location of warehouse{" "}
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                isInvalid={
                                  errors?.[
                                    schema_obj.first_accordion
                                      .geo_location_of_warehouse
                                  ]
                                }
                              >
                                <Input
                                  type="text"
                                  {...register(
                                    schema_obj.first_accordion
                                      .geo_location_of_warehouse
                                  )}
                                  border="1px"
                                  borderColor="gray.10"
                                  backgroundColor={"white"}
                                  isDisabled={true}
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
                                  placeholder="Latitude, longitude"
                                />
                              </FormControl>
                            </GridItem>
                          </Grid>

                          {selectBoxOptions?.warehouseSubType?.filter(
                            (item) =>
                              item.value ===
                              getValues(
                                schema_obj.first_accordion.warehouse_sub_type
                              )
                          )[0]?.label === "Tri Party" ? (
                            <Box
                              mt="10"
                              bgColor={"#DBFFF5"}
                              padding="20px"
                              borderRadius="10px"
                            >
                              <Heading as="h5" fontSize="lg" textAlign="left">
                                Tri party details
                              </Heading>

                              <Box>
                                {/* -------------- First party name -------------- */}
                                <Box>
                                  <Grid
                                    alignItems="center"
                                    my="3"
                                    templateColumns="repeat(3, 1fr)"
                                    gap={5}
                                  >
                                    {/* First party name */}
                                    <Box>
                                      <Text my={1}>First party name</Text>{" "}
                                      <Box>
                                        <FormControl
                                          style={{ w: commonWidth.w }}
                                          isInvalid={false}
                                        >
                                          <Input
                                            type="text"
                                            // {...subLesseeDetailsFormsMethod.register(
                                            //   sub_lessee_details_obj.sub_lessee_name
                                            // )}
                                            border="1px"
                                            borderColor="gray.10"
                                            backgroundColor={"white"}
                                            height={"15px "}
                                            borderRadius={"lg"}
                                            _placeholder={
                                              commonStyle._placeholder
                                            }
                                            _hover={commonStyle._hover}
                                            _focus={commonStyle._focus}
                                            p={{ base: "4" }}
                                            fontWeight={{ base: "normal" }}
                                            fontStyle={"normal"}
                                            placeholder="First party name"
                                          />
                                        </FormControl>
                                      </Box>
                                    </Box>

                                    {/* First party Address */}
                                    <Box>
                                      <Text my={1}>First party Address</Text>{" "}
                                      <Box>
                                        <FormControl
                                          style={{ w: commonWidth.w }}
                                          isInvalid={false}
                                        >
                                          <Input
                                            type="text"
                                            // {...subLesseeDetailsFormsMethod.register(
                                            //   sub_lessee_details_obj.sub_lessee_name
                                            // )}
                                            border="1px"
                                            borderColor="gray.10"
                                            backgroundColor={"white"}
                                            height={"15px "}
                                            borderRadius={"lg"}
                                            _placeholder={
                                              commonStyle._placeholder
                                            }
                                            _hover={commonStyle._hover}
                                            _focus={commonStyle._focus}
                                            p={{ base: "4" }}
                                            fontWeight={{ base: "normal" }}
                                            fontStyle={"normal"}
                                            placeholder="First party Address"
                                          />
                                        </FormControl>
                                      </Box>
                                    </Box>
                                  </Grid>
                                </Box>

                                <Box>
                                  <Grid
                                    alignItems="center"
                                    my="3"
                                    templateColumns="repeat(3, 1fr)"
                                    gap={5}
                                  >
                                    {/* Second party name */}
                                    <Box>
                                      <Text my={1}>Second party name</Text>{" "}
                                      <Box>
                                        <FormControl
                                          style={{ w: commonWidth.w }}
                                          isInvalid={false}
                                        >
                                          <Input
                                            type="text"
                                            // {...subLesseeDetailsFormsMethod.register(
                                            //   sub_lessee_details_obj.sub_lessee_name
                                            // )}
                                            border="1px"
                                            borderColor="gray.10"
                                            backgroundColor={"white"}
                                            height={"15px "}
                                            borderRadius={"lg"}
                                            _placeholder={
                                              commonStyle._placeholder
                                            }
                                            _hover={commonStyle._hover}
                                            _focus={commonStyle._focus}
                                            p={{ base: "4" }}
                                            fontWeight={{ base: "normal" }}
                                            fontStyle={"normal"}
                                            placeholder="Second party name"
                                          />
                                        </FormControl>
                                      </Box>
                                    </Box>

                                    {/* First party Address */}
                                    <Box>
                                      <Text my={1}>Second party Address</Text>{" "}
                                      <Box>
                                        <FormControl
                                          style={{ w: commonWidth.w }}
                                          isInvalid={false}
                                        >
                                          <Input
                                            type="text"
                                            // {...subLesseeDetailsFormsMethod.register(
                                            //   sub_lessee_details_obj.sub_lessee_name
                                            // )}
                                            border="1px"
                                            borderColor="gray.10"
                                            backgroundColor={"white"}
                                            height={"15px "}
                                            borderRadius={"lg"}
                                            _placeholder={
                                              commonStyle._placeholder
                                            }
                                            _hover={commonStyle._hover}
                                            _focus={commonStyle._focus}
                                            p={{ base: "4" }}
                                            fontWeight={{ base: "normal" }}
                                            fontStyle={"normal"}
                                            placeholder="Second party Address"
                                          />
                                        </FormControl>
                                      </Box>
                                    </Box>
                                  </Grid>
                                </Box>

                                <Box>
                                  <Grid
                                    alignItems="center"
                                    my="3"
                                    templateColumns="repeat(3, 1fr)"
                                    gap={5}
                                  >
                                    {/* Third party name */}
                                    <Box>
                                      <Text>Third party name</Text>{" "}
                                      <Box>
                                        <FormControl
                                          style={{ w: commonWidth.w }}
                                          isInvalid={false}
                                        >
                                          <Input
                                            type="text"
                                            // {...subLesseeDetailsFormsMethod.register(
                                            //   sub_lessee_details_obj.sub_lessee_name
                                            // )}
                                            border="1px"
                                            borderColor="gray.10"
                                            backgroundColor={"white"}
                                            height={"15px "}
                                            borderRadius={"lg"}
                                            _placeholder={
                                              commonStyle._placeholder
                                            }
                                            _hover={commonStyle._hover}
                                            _focus={commonStyle._focus}
                                            p={{ base: "4" }}
                                            fontWeight={{ base: "normal" }}
                                            fontStyle={"normal"}
                                            placeholder="Third party name"
                                          />
                                        </FormControl>
                                      </Box>
                                    </Box>

                                    {/* Third party Address */}
                                    <Box>
                                      <Text>Third party Address</Text>{" "}
                                      <Box>
                                        <FormControl
                                          style={{ w: commonWidth.w }}
                                          isInvalid={false}
                                        >
                                          <Input
                                            type="text"
                                            // {...subLesseeDetailsFormsMethod.register(
                                            //   sub_lessee_details_obj.sub_lessee_name
                                            // )}
                                            border="1px"
                                            borderColor="gray.10"
                                            backgroundColor={"white"}
                                            height={"15px "}
                                            borderRadius={"lg"}
                                            _placeholder={
                                              commonStyle._placeholder
                                            }
                                            _hover={commonStyle._hover}
                                            _focus={commonStyle._focus}
                                            p={{ base: "4" }}
                                            fontWeight={{ base: "normal" }}
                                            fontStyle={"normal"}
                                            placeholder="Third party Address"
                                          />
                                        </FormControl>
                                      </Box>
                                    </Box>
                                  </Grid>
                                </Box>
                              </Box>
                            </Box>
                          ) : (
                            <></>
                          )}

                          {/* Clients details form and table start */}
                          <Box
                            mt="10"
                            bgColor={"#DBFFF5"}
                            padding="20px"
                            borderRadius="10px"
                          >
                            <Heading as="h5" fontSize="lg" textAlign="left">
                              Clients Details{" "}
                              <span
                                style={{
                                  color: "red",
                                  marginLeft: "4px",
                                }}
                              >
                                *
                              </span>
                            </Heading>

                            <>
                              {/* --------------  Client List -------------- */}
                              <Box pt="10px">
                                <Grid
                                  alignItems="center"
                                  my="3"
                                  templateColumns="repeat(3, 1fr)"
                                  gap={5}
                                >
                                  <Box>
                                    <Text my={1}>Client name</Text>{" "}
                                    <Box>
                                      <FormControl
                                        style={{ w: commonWidth.w }}
                                        isInvalid={
                                          clientsDetailsFormsMethod.formState
                                            .errors?.[
                                            clients_details_obj.client_name
                                          ]?.type?.required
                                        }
                                      >
                                        <Input
                                          type="text"
                                          {...clientsDetailsFormsMethod.register(
                                            clients_details_obj.client_name
                                          )}
                                          border="1px"
                                          isDisabled={getValues("form_edit")}
                                          borderColor="gray.10"
                                          backgroundColor={"white"}
                                          height={"15px "}
                                          borderRadius={"lg"}
                                          _placeholder={
                                            commonStyle._placeholder
                                          }
                                          _hover={commonStyle._hover}
                                          _focus={commonStyle._focus}
                                          p={{ base: "4" }}
                                          fontWeight={{ base: "normal" }}
                                          fontStyle={"normal"}
                                          placeholder="Client name"
                                        />
                                      </FormControl>
                                    </Box>
                                  </Box>

                                  <Box>
                                    <Text my={1}>Client Address</Text>{" "}
                                    <Box>
                                      <FormControl
                                        style={{ w: commonWidth.w }}
                                        isInvalid={
                                          clientsDetailsFormsMethod.formState
                                            .errors?.[
                                            clients_details_obj.client_address
                                          ]?.type?.required
                                        }
                                      >
                                        <Input
                                          type="text"
                                          {...clientsDetailsFormsMethod.register(
                                            clients_details_obj.client_address
                                          )}
                                          border="1px"
                                          isDisabled={getValues("form_edit")}
                                          borderColor="gray.10"
                                          backgroundColor={"white"}
                                          height={"15px "}
                                          borderRadius={"lg"}
                                          //value={inputValue}
                                          //  onChange={onChange}
                                          _placeholder={
                                            commonStyle._placeholder
                                          }
                                          _hover={commonStyle._hover}
                                          _focus={commonStyle._focus}
                                          // isDisabled={true}
                                          p={{ base: "4" }}
                                          fontWeight={{ base: "normal" }}
                                          fontStyle={"normal"}
                                          placeholder="Client Address"
                                        />
                                      </FormControl>
                                    </Box>
                                  </Box>

                                  <GridItem colSpan="3">
                                    <Flex
                                      gap="10px"
                                      justifyContent="end"
                                      alignItems="center"
                                    >
                                      <Button
                                        bg="#A6CE39"
                                        _hover={{}}
                                        color="white"
                                        type="button"
                                        isDisabled={getValues("form_edit")}
                                        padding="0px 20px"
                                        borderRadius={"50px"}
                                        onClick={() => {
                                          clientsDetailsOnSubmit();
                                        }}
                                      >
                                        {editedFormIndex?.editedClientsFormEditedIndex ===
                                        ""
                                          ? "Save"
                                          : "Update"}
                                      </Button>
                                    </Flex>
                                  </GridItem>
                                </Grid>
                              </Box>
                            </>
                          </Box>
                          {/* Client details table start */}
                          <TableContainer mt="4">
                            <Table color="#000">
                              <Thead
                                bg="#dbfff5"
                                border="1px"
                                borderColor="#000"
                              >
                                <Tr style={{ color: "#000" }}>
                                  <Th color="#000">Client Name</Th>
                                  <Th color="#000">Client Address</Th>

                                  <Th color="#000">Action</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {clientsDetails &&
                                  clientsDetails.map((item, i) => (
                                    <Tr
                                      key={`client_details${i}`}
                                      textAlign="center"
                                      bg="white"
                                      border="1px"
                                      borderColor="#000"
                                    >
                                      <Td>{item?.client_name} </Td>
                                      <Td>{item?.client_address} </Td>

                                      <Td>
                                        <Box
                                          display="flex"
                                          alignItems="center"
                                          gap="3"
                                        >
                                          <Flex
                                            gap="20px"
                                            justifyContent="center"
                                          >
                                            <Box color={"primary.700"}>
                                              <BiEditAlt
                                                // color="#A6CE39"
                                                fontSize="26px"
                                                cursor="pointer"
                                                onClick={() => {
                                                  if (getValues("form_edit")) {
                                                  } else {
                                                    clientsDetailsOnEdit(
                                                      item,
                                                      i
                                                    );
                                                  }
                                                }}
                                              />
                                            </Box>
                                            <Box color="red">
                                              <AiOutlineDelete
                                                cursor="pointer"
                                                fontSize="26px"
                                                onClick={() => {
                                                  if (getValues("form_edit")) {
                                                  } else {
                                                    clientsDetailsRemove(i);
                                                  }
                                                }}
                                              />
                                            </Box>
                                          </Flex>
                                        </Box>
                                      </Td>
                                    </Tr>
                                  ))}
                                {clientsDetails.length === 0 && (
                                  <Tr textAlign="center">
                                    <Td colSpan="3" color="#000">
                                      No record found
                                    </Td>
                                  </Tr>
                                )}
                              </Tbody>
                            </Table>
                          </TableContainer>
                          {/* client details table end */}
                          {/* client details form and table end */}
                          {/* --------------  Warehouse owned by select box-------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                Warehouse owned by{" "}
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                isInvalid={
                                  !!errors?.[
                                    schema_obj.first_accordion
                                      .warehouse_owned_by
                                  ]
                                }
                              >
                                <ReactSelect
                                  options={warehouseOwnedByOptions || []}
                                  value={
                                    warehouseOwnedByOptions?.filter(
                                      (item) =>
                                        item.value ===
                                        getValues(
                                          schema_obj.first_accordion
                                            .warehouse_owned_by
                                        )
                                    )[0] || null
                                  }
                                  {...register(
                                    schema_obj.first_accordion
                                      .warehouse_owned_by
                                  )}
                                  onChange={(val) => {
                                    setValue(
                                      schema_obj.first_accordion
                                        .warehouse_owned_by,
                                      val?.value,
                                      {
                                        shouldValidate: true,
                                      }
                                    );
                                  }}
                                  isDisabled={getValues("form_edit")}
                                  styles={{
                                    control: (base, state) => {
                                      console.log(
                                        "Error:",
                                        errors?.[
                                          schema_obj.first_accordion
                                            .warehouse_owned_by
                                        ]
                                      );
                                      console.log(
                                        "Value:",
                                        getValues(
                                          schema_obj.first_accordion
                                            .warehouse_owned_by
                                        )
                                      );

                                      return {
                                        ...base,
                                        backgroundColor: "#fff",
                                        borderRadius: "6px",
                                        borderWidth: "1px",
                                        borderColor: errors?.[
                                          schema_obj.first_accordion
                                            .warehouse_owned_by
                                        ]
                                          ? "red"
                                          : "#c3c3c3",
                                        padding: "1px",
                                        textAlign: "left",
                                      };
                                    },
                                    ...reactSelectStyle,
                                  }}
                                />
                              </FormControl>
                            </GridItem>
                          </Grid>
                          {/* --------------  Remark-------------- */}
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                isInvalid={
                                  errors?.[schema_obj.first_accordion.remarks]
                                    ?.message
                                }
                              >
                                <Box>
                                  <Textarea
                                    type="text"
                                    {...register(
                                      schema_obj.first_accordion.remarks
                                    )}
                                    border="1px"
                                    isDisabled={getValues("form_edit")}
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
                                    placeholder="Remark"
                                  />
                                </Box>
                              </FormControl>
                            </GridItem>
                          </Grid>
                          {/* --------------  hyphenation of Warehouse-------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                Hypothecation Of Warehouse{" "}
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                isInvalid={
                                  errors?.[
                                    schema_obj.first_accordion
                                      .hypothecation_of_warehouse
                                  ]?.message
                                }
                              >
                                <Box>
                                  <RadioGroup
                                    p="0"
                                    value={
                                      getValues(
                                        schema_obj.first_accordion
                                          .hypothecation_of_warehouse
                                      ) || "false"
                                    }
                                    isDisabled={getValues("form_edit")}
                                    name={
                                      schema_obj.first_accordion
                                        .hypothecation_of_warehouse
                                    }
                                    onChange={(e) => {
                                      if (e === "false") {
                                        setValue(
                                          schema_obj.first_accordion
                                            .account_name,
                                          null
                                        );
                                        setValue(
                                          schema_obj.first_accordion.bank,
                                          null
                                        );
                                        setValue(
                                          schema_obj.first_accordion
                                            .credit_limit,
                                          null
                                        );
                                        setValue(
                                          schema_obj.first_accordion
                                            .outstanding,
                                          null
                                        );
                                        setValue(
                                          schema_obj.first_accordion
                                            .account_health,
                                          null
                                        );
                                      }
                                      setValue(
                                        schema_obj.first_accordion
                                          .hypothecation_of_warehouse,
                                        e,
                                        { shouldValidate: true }
                                      );
                                    }}
                                  >
                                    <Stack spacing={5} direction="row">
                                      <Radio
                                        colorScheme="radioBoxPrimary"
                                        value={"true"}
                                      >
                                        Yes
                                      </Radio>
                                      <Radio
                                        colorScheme="radioBoxPrimary"
                                        value={"false"}
                                      >
                                        No
                                      </Radio>
                                    </Stack>
                                  </RadioGroup>
                                </Box>
                              </FormControl>
                            </GridItem>
                          </Grid>
                          {getValues(
                            schema_obj.first_accordion
                              .hypothecation_of_warehouse
                          ) === "true" ? (
                            <>
                              {/* --------------  Account name-------------- */}
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                my="3"
                                templateColumns={templateColumns}
                                gap={5}
                              >
                                <GridItem colSpan={{ base: 1, lg: 0 }}>
                                  <Text textAlign="right">
                                    Account Number
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
                                  <FormControl
                                    style={{ w: commonWidth.w }}
                                    isInvalid={
                                      errors?.[
                                        schema_obj.first_accordion.account_name
                                      ]?.message
                                    }
                                  >
                                    <Box>
                                      <Input
                                        type="number"
                                        {...register(
                                          schema_obj.first_accordion
                                            .account_name
                                        )}
                                        border="1px"
                                        isDisabled={getValues("form_edit")}
                                        borderColor="gray.10"
                                        backgroundColor={"white"}
                                        height={"15px "}
                                        borderRadius={"lg"}
                                        _placeholder={commonStyle._placeholder}
                                        _hover={commonStyle._hover}
                                        _focus={commonStyle._focus}
                                        // isDisabled={true}
                                        p={{ base: "4" }}
                                        fontWeight={{ base: "normal" }}
                                        fontStyle={"normal"}
                                        placeholder="Account Number"
                                      />
                                    </Box>
                                  </FormControl>
                                </GridItem>
                              </Grid>

                              {/* --------------  bank name select box-------------- */}
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
                                    Bank Name{" "}
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
                                  <FormControl
                                    style={{ w: commonWidth.w }}
                                    //  isInvalid={true}
                                  >
                                    <ReactSelect
                                      options={selectBoxOptions.banks || []}
                                      isLoading={getBankMasterApiIsLoading}
                                      value={
                                        selectBoxOptions?.banks?.filter(
                                          (item) =>
                                            item.value ===
                                            getValues(
                                              schema_obj.first_accordion.bank
                                            )
                                        )[0] || null
                                      }
                                      {...register(
                                        schema_obj.first_accordion.bank
                                      )}
                                      isDisabled={getValues("form_edit")}
                                      onChange={(val) => {
                                        setValue(
                                          schema_obj.first_accordion.bank,
                                          val?.value,
                                          {
                                            shouldValidate: true,
                                          }
                                        );
                                      }}
                                      styles={{
                                        control: (base, state) => ({
                                          ...base,
                                          backgroundColor: "#fff",
                                          borderRadius: "6px",
                                          borderWidth: "1px",
                                          borderColor: errors?.[
                                            schema_obj.first_accordion.bank
                                          ]?.message
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

                              {/* --------------  Credit limit -------------- */}
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                my="3"
                                templateColumns={templateColumns}
                                gap={5}
                              >
                                <GridItem colSpan={{ base: 1, lg: 0 }}>
                                  {" "}
                                  <Text textAlign="right">
                                    {" "}
                                    Credit limit{" "}
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
                                  <FormControl
                                    style={{ w: commonWidth.w }}
                                    isInvalid={
                                      errors?.[
                                        schema_obj.first_accordion.credit_limit
                                      ]?.message
                                    }
                                  >
                                    <Input
                                      type="number"
                                      {...register(
                                        schema_obj.first_accordion.credit_limit
                                      )}
                                      step={0.01}
                                      border="1px"
                                      borderColor="gray.10"
                                      isDisabled={getValues("form_edit")}
                                      backgroundColor={"white"}
                                      height={"15px "}
                                      borderRadius={"lg"}
                                      _placeholder={commonStyle._placeholder}
                                      _hover={commonStyle._hover}
                                      _focus={commonStyle._focus}
                                      p={{ base: "4" }}
                                      fontWeight={{ base: "normal" }}
                                      fontStyle={"normal"}
                                      placeholder="Credit Limit"
                                    />
                                  </FormControl>
                                </GridItem>
                              </Grid>

                              {/* --------------  Outstanding -------------- */}
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                my="3"
                                templateColumns={templateColumns}
                                gap={5}
                              >
                                <GridItem colSpan={{ base: 1, lg: 0 }}>
                                  {" "}
                                  <Text textAlign="right">
                                    {" "}
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
                                  <FormControl
                                    style={{ w: commonWidth.w }}
                                    isInvalid={
                                      errors?.[
                                        schema_obj.first_accordion.outstanding
                                      ]?.message
                                    }
                                  >
                                    <Input
                                      type="number"
                                      {...register(
                                        schema_obj.first_accordion.outstanding
                                      )}
                                      border="1px"
                                      step={0.01}
                                      borderColor="gray.10"
                                      isDisabled={getValues("form_edit")}
                                      backgroundColor={"white"}
                                      height={"15px "}
                                      borderRadius={"lg"}
                                      _placeholder={commonStyle._placeholder}
                                      _hover={commonStyle._hover}
                                      _focus={commonStyle._focus}
                                      p={{ base: "4" }}
                                      fontWeight={{ base: "normal" }}
                                      fontStyle={"normal"}
                                      placeholder="Outstanding"
                                    />
                                  </FormControl>
                                </GridItem>
                              </Grid>

                              {/* --------------  Account health -------------- */}
                              <Grid
                                textAlign="right"
                                alignItems="center"
                                my="3"
                                templateColumns={templateColumns}
                                gap={5}
                              >
                                <GridItem colSpan={{ base: 1, lg: 0 }}>
                                  {" "}
                                  <Text textAlign="right">
                                    {" "}
                                    Account health{" "}
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
                                  <FormControl
                                    style={{ w: commonWidth.w }}
                                    isInvalid={
                                      errors?.[
                                        schema_obj.first_accordion
                                          .account_health
                                      ]?.message
                                    }
                                  >
                                    <Input
                                      type="number"
                                      {...register(
                                        schema_obj.first_accordion
                                          .account_health
                                      )}
                                      border="1px"
                                      step={0.01}
                                      borderColor="gray.10"
                                      backgroundColor={"white"}
                                      height={"15px "}
                                      isDisabled={getValues("form_edit")}
                                      borderRadius={"lg"}
                                      _placeholder={commonStyle._placeholder}
                                      _hover={commonStyle._hover}
                                      _focus={commonStyle._focus}
                                      p={{ base: "4" }}
                                      fontWeight={{ base: "normal" }}
                                      fontStyle={"normal"}
                                      placeholder="Account Health"
                                    />
                                  </FormControl>
                                </GridItem>
                              </Grid>
                            </>
                          ) : (
                            <></>
                          )}
                          {selectBoxOptions?.warehouseUnitType?.filter(
                            (item) =>
                              item.value ===
                              getValues(
                                schema_obj.first_accordion.warehouse_unit_type
                              )
                          )[0]?.label === "Silo" ? (
                            <>
                              {/* Silo details start    */}
                              <Box>
                                <Box
                                  mt="10"
                                  bgColor={"#DBFFF5"}
                                  padding="20px"
                                  borderRadius="10px"
                                >
                                  <Heading
                                    as="h5"
                                    fontSize="lg"
                                    textAlign="left"
                                  >
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
                                              isInvalid={
                                                siloDetailsFormsMethod.formState
                                                  .errors?.[
                                                  silo_details_obj
                                                    .chamber_number
                                                ]?.type?.required
                                              }
                                            >
                                              <Input
                                                type="text"
                                                {...siloDetailsFormsMethod.register(
                                                  silo_details_obj.chamber_number
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
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
                                              isInvalid={
                                                siloDetailsFormsMethod.formState
                                                  .errors?.[
                                                  silo_details_obj.diameter
                                                ]?.type?.required
                                              }
                                            >
                                              <Input
                                                type="text"
                                                {...siloDetailsFormsMethod.register(
                                                  silo_details_obj.diameter
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                value={siloDetailsFormsMethod.getValues(
                                                  "diameter"
                                                )}
                                                onChange={(e) => {
                                                  siloDetailsFormsMethod.setValue(
                                                    "diameter",
                                                    e.target.value,
                                                    {
                                                      shouldValidate: true,
                                                    }
                                                  );
                                                }}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
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
                                              isInvalid={
                                                siloDetailsFormsMethod.formState
                                                  .errors?.[
                                                  silo_details_obj.height
                                                ]?.type?.required
                                              }
                                            >
                                              <Input
                                                type="text"
                                                {...siloDetailsFormsMethod.register(
                                                  silo_details_obj.height
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
                                                value={siloDetailsFormsMethod.getValues(
                                                  "height"
                                                )}
                                                onChange={(e) => {
                                                  siloDetailsFormsMethod.setValue(
                                                    "height",
                                                    e.target.value,
                                                    {
                                                      shouldValidate: true,
                                                    }
                                                  );
                                                }}
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
                                              isInvalid={
                                                siloDetailsFormsMethod.formState
                                                  .errors?.[
                                                  silo_details_obj.density
                                                ]?.type?.required
                                              }
                                            >
                                              <Input
                                                type="text"
                                                {...siloDetailsFormsMethod.register(
                                                  silo_details_obj.density
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
                                                value={siloDetailsFormsMethod.getValues(
                                                  "density"
                                                )}
                                                onChange={(e) => {
                                                  siloDetailsFormsMethod.setValue(
                                                    "density",
                                                    e.target.value,
                                                    {
                                                      shouldValidate: true,
                                                    }
                                                  );
                                                }}
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
                                              isInvalid={
                                                siloDetailsFormsMethod.formState
                                                  .errors?.[
                                                  silo_details_obj.capacity
                                                ]?.type?.required
                                              }
                                            >
                                              <Input
                                                type="text"
                                                {...siloDetailsFormsMethod.register(
                                                  silo_details_obj.capacity
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
                                                isDisabled={true}
                                                value={siloDetailsFormsMethod.getValues(
                                                  "capacity"
                                                )}
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
                                      </Grid>
                                    </Box>

                                    {/* ----------------- save button -----------  */}

                                    <Flex
                                      gap="10px"
                                      justifyContent="end"
                                      alignItems="center"
                                    >
                                      <Button
                                        bg="#A6CE39"
                                        _hover={{}}
                                        color="white"
                                        padding="0px 20px"
                                        borderRadius={"50px"}
                                        type="button"
                                        onClick={() => {
                                          siloDetailsOnSubmit();
                                        }}
                                      >
                                        {editedFormIndex?.editedSiloDetailsFormEditedIndex ===
                                        ""
                                          ? "Add"
                                          : "Update"}
                                      </Button>
                                    </Flex>
                                  </>
                                </Box>

                                {/* Chamber details table start */}
                                <TableContainer mt="4">
                                  <Table color="#000">
                                    <Thead
                                      bg="#dbfff5"
                                      border="1px"
                                      borderColor="#000"
                                    >
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
                                      {siloDetails &&
                                        siloDetails.map((item, i) => (
                                          <Tr
                                            key={`chamber_details${i}`}
                                            textAlign="center"
                                            bg="white"
                                            border="1px"
                                            borderColor="#000"
                                          >
                                            <Td>{item?.chamber_number} </Td>
                                            <Td>{item?.diameter} </Td>
                                            <Td>{item?.height} </Td>
                                            <Td>{item?.density} </Td>
                                            <Td>{item?.capacity} </Td>
                                            <Td>
                                              <Box
                                                display="flex"
                                                alignItems="center"
                                                gap="3"
                                              >
                                                <Flex
                                                  gap="20px"
                                                  justifyContent="center"
                                                >
                                                  <Box color={"primary.700"}>
                                                    <BiEditAlt
                                                      // color="#A6CE39"
                                                      fontSize="26px"
                                                      cursor="pointer"
                                                      onClick={() =>
                                                        siloDetailsOnEdit(
                                                          item,
                                                          i
                                                        )
                                                      }
                                                    />
                                                  </Box>
                                                  <Box color="red">
                                                    <AiOutlineDelete
                                                      cursor="pointer"
                                                      fontSize="26px"
                                                      onClick={() => {
                                                        siloDetailsRemove(i);
                                                      }}
                                                    />
                                                  </Box>
                                                </Flex>
                                              </Box>
                                            </Td>
                                          </Tr>
                                        ))}
                                      {siloDetails.length === 0 && (
                                        <Tr textAlign="center">
                                          <Td colSpan="6" color="#000">
                                            No record found
                                          </Td>
                                        </Tr>
                                      )}
                                    </Tbody>
                                  </Table>
                                </TableContainer>
                                {/* Chamber details table end */}
                              </Box>
                              {/* Silo Tank details end    */}
                            </>
                          ) : selectBoxOptions?.warehouseUnitType?.filter(
                              (item) =>
                                item.value ===
                                getValues(
                                  schema_obj.first_accordion.warehouse_unit_type
                                )
                            )[0]?.label === "Oil Tank" ? (
                            <>
                              {/* Oil Tank details start    */}
                              <Box>
                                <Box
                                  mt="10"
                                  bgColor={"#DBFFF5"}
                                  padding="20px"
                                  borderRadius="10px"
                                >
                                  <Heading
                                    as="h5"
                                    fontSize="lg"
                                    textAlign="left"
                                  >
                                    Oil Tank Details
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
                                              isInvalid={
                                                oilTankDetailsFormsMethod
                                                  .formState.errors?.[
                                                  oil_tank_details_obj
                                                    .chamber_number
                                                ]?.type?.required
                                              }
                                            >
                                              <Input
                                                type="text"
                                                {...oilTankDetailsFormsMethod.register(
                                                  oil_tank_details_obj.chamber_number
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
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
                                              isInvalid={
                                                oilTankDetailsFormsMethod
                                                  .formState.errors?.[
                                                  oil_tank_details_obj.diameter
                                                ]?.type?.required
                                              }
                                            >
                                              <Input
                                                type="text"
                                                {...oilTankDetailsFormsMethod.register(
                                                  oil_tank_details_obj.diameter
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
                                                value={oilTankDetailsFormsMethod.getValues(
                                                  "diameter"
                                                )}
                                                onChange={(e) => {
                                                  oilTankDetailsFormsMethod.setValue(
                                                    "diameter",
                                                    e.target.value,
                                                    {
                                                      shouldValidate: true,
                                                    }
                                                  );
                                                }}
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
                                              isInvalid={
                                                oilTankDetailsFormsMethod
                                                  .formState.errors?.[
                                                  oil_tank_details_obj.height
                                                ]?.type?.required
                                              }
                                            >
                                              <Input
                                                type="text"
                                                {...oilTankDetailsFormsMethod.register(
                                                  oil_tank_details_obj.height
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
                                                value={oilTankDetailsFormsMethod.getValues(
                                                  "height"
                                                )}
                                                onChange={(e) => {
                                                  oilTankDetailsFormsMethod.setValue(
                                                    "height",
                                                    e.target.value,
                                                    {
                                                      shouldValidate: true,
                                                    }
                                                  );
                                                }}
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
                                              isInvalid={
                                                oilTankDetailsFormsMethod
                                                  .formState.errors?.[
                                                  oil_tank_details_obj.density
                                                ]?.type?.required
                                              }
                                            >
                                              <Input
                                                type="text"
                                                {...oilTankDetailsFormsMethod.register(
                                                  oil_tank_details_obj.density
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
                                                value={oilTankDetailsFormsMethod.getValues(
                                                  "density"
                                                )}
                                                onChange={(e) => {
                                                  oilTankDetailsFormsMethod.setValue(
                                                    "density",
                                                    e.target.value,
                                                    {
                                                      shouldValidate: true,
                                                    }
                                                  );
                                                }}
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
                                              isInvalid={
                                                oilTankDetailsFormsMethod
                                                  .formState.errors?.[
                                                  oil_tank_details_obj.capacity
                                                ]?.type?.required
                                              }
                                            >
                                              <Input
                                                type="text"
                                                {...oilTankDetailsFormsMethod.register(
                                                  oil_tank_details_obj.capacity
                                                )}
                                                isDisabled={true}
                                                border="1px"
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
                                                value={oilTankDetailsFormsMethod.getValues(
                                                  "capacity"
                                                )}
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
                                      </Grid>
                                    </Box>

                                    {/* ----------------- save button -----------  */}

                                    <Flex
                                      gap="10px"
                                      justifyContent="end"
                                      alignItems="center"
                                    >
                                      <Button
                                        bg="#A6CE39"
                                        _hover={{}}
                                        color="white"
                                        padding="0px 20px"
                                        borderRadius={"50px"}
                                        type="button"
                                        onClick={() => {
                                          oilTankDetailsOnSubmit();
                                        }}
                                      >
                                        {editedFormIndex?.editedOilTankDetailsFormEditedIndex ===
                                        ""
                                          ? "Add"
                                          : "Update"}
                                      </Button>
                                    </Flex>
                                  </>
                                </Box>

                                {/* Chamber details table start */}
                                <TableContainer mt="4">
                                  <Table color="#000">
                                    <Thead
                                      bg="#dbfff5"
                                      border="1px"
                                      borderColor="#000"
                                    >
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
                                      {oilTankDetails &&
                                        oilTankDetails.map((item, i) => (
                                          <Tr
                                            key={`chamber_details${i}`}
                                            textAlign="center"
                                            bg="white"
                                            border="1px"
                                            borderColor="#000"
                                          >
                                            <Td>{item?.chamber_number} </Td>
                                            <Td>{item?.diameter} </Td>
                                            <Td>{item?.height} </Td>
                                            <Td>{item?.density} </Td>
                                            <Td>{item?.capacity} </Td>
                                            <Td>
                                              <Box
                                                display="flex"
                                                alignItems="center"
                                                gap="3"
                                              >
                                                <Flex
                                                  gap="20px"
                                                  justifyContent="center"
                                                >
                                                  <Box color={"primary.700"}>
                                                    <BiEditAlt
                                                      // color="#A6CE39"
                                                      fontSize="26px"
                                                      cursor="pointer"
                                                      onClick={() =>
                                                        oilTankDetailsOnEdit(
                                                          item,
                                                          i
                                                        )
                                                      }
                                                    />
                                                  </Box>
                                                  <Box color="red">
                                                    <AiOutlineDelete
                                                      cursor="pointer"
                                                      fontSize="26px"
                                                      onClick={() => {
                                                        oilTankDetailsRemove(i);
                                                      }}
                                                    />
                                                  </Box>
                                                </Flex>
                                              </Box>
                                            </Td>
                                          </Tr>
                                        ))}
                                      {oilTankDetails.length === 0 && (
                                        <Tr textAlign="center">
                                          <Td colSpan="6" color="#000">
                                            No record found
                                          </Td>
                                        </Tr>
                                      )}
                                    </Tbody>
                                  </Table>
                                </TableContainer>
                                {/* Chamber details table end */}
                              </Box>
                              {/* Oil Tank details end    */}
                            </>
                          ) : (
                            <>
                              {/* Chamber details start    */}
                              <Box>
                                <Box
                                  mt="10"
                                  bgColor={"#DBFFF5"}
                                  padding="20px"
                                  borderRadius="10px"
                                >
                                  <Heading
                                    as="h5"
                                    fontSize="lg"
                                    textAlign="left"
                                  >
                                    Chamber details{" "}
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      *
                                    </span>
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
                                              isInvalid={
                                                chamberDetailsFormsMethod
                                                  .formState.errors
                                                  ?.chamber_number
                                              }
                                            >
                                              <Input
                                                type="text"
                                                {...chamberDetailsFormsMethod.register(
                                                  chamber_details_obj.chamber_number
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
                                                _hover={commonStyle._hover}
                                                _focus={commonStyle._focus}
                                                p={{ base: "4" }}
                                                fontWeight={{ base: "normal" }}
                                                fontStyle={"normal"}
                                                placeholder="Chamber Number"
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
                                              isInvalid={
                                                chamberDetailsFormsMethod
                                                  .formState.errors
                                                  ?.chamber_length
                                              }
                                            >
                                              <Input
                                                type="text"
                                                {...chamberDetailsFormsMethod.register(
                                                  chamber_details_obj.chamber_length
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                value={chamberDetailsFormsMethod.getValues(
                                                  "chamber_length"
                                                )}
                                                onChange={(e) => {
                                                  chamberDetailsFormsMethod.setValue(
                                                    "chamber_length",
                                                    e.target.value,
                                                    {
                                                      shouldValidate: true,
                                                    }
                                                  );
                                                }}
                                                //value={inputValue}
                                                //  onChange={onChange}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
                                                _hover={commonStyle._hover}
                                                _focus={commonStyle._focus}
                                                // isDisabled={true}
                                                p={{ base: "4" }}
                                                fontWeight={{ base: "normal" }}
                                                fontStyle={"normal"}
                                                placeholder="Chamber Length"
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
                                              isInvalid={
                                                chamberDetailsFormsMethod
                                                  .formState.errors
                                                  ?.chamber_breadth
                                              }
                                            >
                                              <Input
                                                type="text"
                                                {...chamberDetailsFormsMethod.register(
                                                  chamber_details_obj.chamber_breadth
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                value={chamberDetailsFormsMethod.getValues(
                                                  "chamber_breadth"
                                                )}
                                                onChange={(e) => {
                                                  chamberDetailsFormsMethod.setValue(
                                                    "chamber_breadth",
                                                    e.target.value,
                                                    {
                                                      shouldValidate: true,
                                                    }
                                                  );
                                                }}
                                                //value={inputValue}
                                                //  onChange={onChange}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
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
                                          <Text my={1}>
                                            Chamber roof height
                                          </Text>{" "}
                                          <Box>
                                            <FormControl
                                              style={{ w: commonWidth.w }}
                                              isInvalid={
                                                chamberDetailsFormsMethod
                                                  .formState.errors?.roof_height
                                              }
                                            >
                                              <Input
                                                type="number"
                                                {...chamberDetailsFormsMethod.register(
                                                  chamber_details_obj.roof_height
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                //value={inputValue}
                                                //  onChange={onChange}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
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
                                          <Text my={1}>
                                            Chamber stackable height
                                          </Text>{" "}
                                          <Box>
                                            <FormControl
                                              style={{ w: commonWidth.w }}
                                              isInvalid={
                                                chamberDetailsFormsMethod
                                                  .formState.errors
                                                  ?.stackble_height
                                              }
                                            >
                                              <Input
                                                type="number"
                                                {...chamberDetailsFormsMethod.register(
                                                  chamber_details_obj.stackble_height
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                //value={inputValue}
                                                //  onChange={onChange}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
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
                                        {/* ------ chamber Sq. Ft------------- */}
                                        <Box>
                                          <Text my={1}>Chamber Sq. Ft</Text>{" "}
                                          <Box>
                                            <FormControl
                                              style={{ w: commonWidth.w }}
                                              isInvalid={
                                                chamberDetailsFormsMethod
                                                  .formState.errors?.sq_feet
                                              }
                                            >
                                              <Input
                                                type="number"
                                                {...chamberDetailsFormsMethod.register(
                                                  chamber_details_obj.sq_feet
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                //value={inputValue}
                                                //  onChange={onChange}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
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
                                          <Text my={1}>
                                            chamber total area Sq.ft
                                          </Text>{" "}
                                          <Box>
                                            <FormControl
                                              style={{ w: commonWidth.w }}
                                              isInvalid={
                                                chamberDetailsFormsMethod
                                                  .formState.errors?.total_area
                                              }
                                            >
                                              <Input
                                                type="number"
                                                {...chamberDetailsFormsMethod.register(
                                                  chamber_details_obj.total_area
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                disabled={true}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                value={chamberDetailsFormsMethod.getValues(
                                                  "total_area"
                                                )}
                                                //value={inputValue}
                                                //  onChange={onChange}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
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

                                    <Flex
                                      gap="10px"
                                      justifyContent="end"
                                      alignItems="center"
                                    >
                                      <Button
                                        bg="#A6CE39"
                                        _hover={{}}
                                        color="white"
                                        padding="0px 20px"
                                        borderRadius={"50px"}
                                        type="button"
                                        onClick={() => {
                                          chamberDetailsOnSubmit();
                                        }}
                                      >
                                        {editedFormIndex?.editedChamberDetailsFormEditedIndex ===
                                        ""
                                          ? "Add"
                                          : "Update"}
                                      </Button>
                                    </Flex>
                                  </>
                                </Box>

                                {/* Chamber details table start */}
                                <TableContainer mt="4">
                                  <Table color="#000">
                                    <Thead
                                      bg="#dbfff5"
                                      border="1px"
                                      borderColor="#000"
                                    >
                                      <Tr style={{ color: "#000" }}>
                                        <Th color="#000">Chamber Number</Th>
                                        <Th color="#000">Chamber Length</Th>
                                        <Th color="#000">Chamber Breadth</Th>
                                        <Th color="#000">
                                          Chamber Roof Height
                                        </Th>
                                        <Th color="#000">
                                          Chamber Stackable Height
                                        </Th>
                                        <Th color="#000">Chamber Sq. Ft</Th>
                                        <Th color="#000">
                                          chamber total Area Sq.ft
                                        </Th>
                                        <Th color="#000">Action</Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {chamberDetails &&
                                        chamberDetails.map((item, i) => (
                                          <Tr
                                            key={`chamber_details${i}`}
                                            textAlign="center"
                                            bg="white"
                                            border="1px"
                                            borderColor="#000"
                                          >
                                            <Td>{item?.chamber_number} </Td>
                                            <Td>{item?.chamber_length} </Td>
                                            <Td>{item?.chamber_breadth} </Td>
                                            <Td>{item?.roof_height} </Td>
                                            <Td>{item?.stackble_height} </Td>
                                            <Td>{item?.sq_feet} </Td>
                                            <Td>{item?.total_area} </Td>

                                            <Td>
                                              <Box
                                                display="flex"
                                                alignItems="center"
                                                gap="3"
                                              >
                                                <Flex
                                                  gap="20px"
                                                  justifyContent="center"
                                                >
                                                  <Box color={"primary.700"}>
                                                    <BiEditAlt
                                                      // color="#A6CE39"
                                                      fontSize="26px"
                                                      cursor="pointer"
                                                      onClick={() =>
                                                        chamberDetailsOnEdit(
                                                          item,
                                                          i
                                                        )
                                                      }
                                                    />
                                                  </Box>
                                                  <Box color="red">
                                                    <AiOutlineDelete
                                                      cursor="pointer"
                                                      fontSize="26px"
                                                      onClick={() => {
                                                        chamberDetailsRemove(i);
                                                      }}
                                                    />
                                                  </Box>
                                                </Flex>
                                              </Box>
                                            </Td>
                                          </Tr>
                                        ))}
                                      {chamberDetails.length === 0 && (
                                        <Tr textAlign="center">
                                          <Td colSpan="8" color="#000">
                                            No record found
                                          </Td>
                                        </Tr>
                                      )}
                                    </Tbody>
                                  </Table>
                                </TableContainer>
                                {/* Chamber details table end */}
                              </Box>
                              {/* Chamber details end    */}
                            </>
                          )}
                          {/* --------------  Unusable area of warehouse(Sq ft.) -------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                Unusable area of warehouse(Sq ft.){" "}
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                isInvalid={
                                  errors?.[
                                    schema_obj.first_accordion
                                      .warehouse_unusable_area
                                  ]?.message
                                }
                              >
                                <Input
                                  type="number"
                                  {...register(
                                    schema_obj.first_accordion
                                      .warehouse_unusable_area
                                  )}
                                  border="1px"
                                  step={0.01}
                                  min={0}
                                  isDisabled={getValues("form_edit")}
                                  borderColor="gray.10"
                                  backgroundColor={"white"}
                                  value={getValues("warehouse_unusable_area")}
                                  onChange={(e) => {
                                    setValue(
                                      "warehouse_unusable_area",
                                      e.target.value,
                                      {
                                        shouldValidate: true,
                                      }
                                    );
                                  }}
                                  height={"15px "}
                                  borderRadius={"lg"}
                                  _placeholder={commonStyle._placeholder}
                                  _hover={commonStyle._hover}
                                  _focus={commonStyle._focus}
                                  p={{ base: "4" }}
                                  fontWeight={{ base: "normal" }}
                                  fontStyle={"normal"}
                                  placeholder="Area"
                                />
                              </FormControl>
                            </GridItem>
                          </Grid>
                          {/* --------------  Total area of warehouse(Sq ft.) -------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              {" "}
                              <Text textAlign="right">
                                {" "}
                                Total area of warehouse(Sq ft.)
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                isInvalid={
                                  errors?.[
                                    schema_obj.first_accordion
                                      .warehouse_total_area
                                  ]?.message
                                }
                              >
                                <Input
                                  type="number"
                                  {...register(
                                    schema_obj.first_accordion
                                      .warehouse_total_area
                                  )}
                                  step={0.01}
                                  border="1px"
                                  borderColor="gray.10"
                                  isDisabled={true}
                                  backgroundColor={"white"}
                                  height={"15px "}
                                  borderRadius={"lg"}
                                  _placeholder={commonStyle._placeholder}
                                  _hover={commonStyle._hover}
                                  _focus={commonStyle._focus}
                                  p={{ base: "4" }}
                                  fontWeight={{ base: "normal" }}
                                  fontStyle={"normal"}
                                  placeholder="Area"
                                />
                              </FormControl>
                            </GridItem>
                          </Grid>
                          {/* --------------  User Capacity(MT)  -------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                User Capacity(MT){" "}
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                isInvalid={
                                  errors?.[
                                    schema_obj.first_accordion.user_capacity
                                  ]?.message
                                }
                              >
                                <Input
                                  type="number"
                                  {...register(
                                    schema_obj.first_accordion.user_capacity
                                  )}
                                  border="1px"
                                  borderColor="gray.10"
                                  isDisabled={getValues("form_edit")}
                                  step={0.01}
                                  backgroundColor={"white"}
                                  height={"15px "}
                                  borderRadius={"lg"}
                                  _placeholder={commonStyle._placeholder}
                                  _hover={commonStyle._hover}
                                  _focus={commonStyle._focus}
                                  p={{ base: "4" }}
                                  fontWeight={{ base: "normal" }}
                                  fontStyle={"normal"}
                                  placeholder=""
                                />
                              </FormControl>
                            </GridItem>
                          </Grid>
                          {/* --------------  Standard Capacity(MT) select -------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                Standard Capacity(MT){" "}
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                isInvalid={
                                  errors?.[
                                    schema_obj.first_accordion.standard_capacity
                                  ]?.message
                                }
                              >
                                <Input
                                  type="number"
                                  {...register(
                                    schema_obj.first_accordion.standard_capacity
                                  )}
                                  border="1px"
                                  borderColor="gray.10"
                                  isDisabled={true}
                                  step={0.01}
                                  backgroundColor={"white"}
                                  height={"15px "}
                                  borderRadius={"lg"}
                                  _placeholder={commonStyle._placeholder}
                                  _hover={commonStyle._hover}
                                  _focus={commonStyle._focus}
                                  p={{ base: "4" }}
                                  fontWeight={{ base: "normal" }}
                                  fontStyle={"normal"}
                                  placeholder=""
                                />
                              </FormControl>
                            </GridItem>
                          </Grid>
                          {/* -------------- Available area for Storage(Sq ft.)  -------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                Available area for Storage(Sq ft.)
                                <span
                                  style={{
                                    color: "red",
                                    marginLeft: "4px",
                                  }}
                                >
                                  *
                                </span>
                              </Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 1 }}>
                              <FormControl
                                style={{ w: commonWidth.w }}
                                isInvalid={
                                  errors?.[
                                    schema_obj.first_accordion
                                      .storage_available_area
                                  ]?.message
                                }
                              >
                                <Input
                                  type="number"
                                  {...register(
                                    schema_obj.first_accordion
                                      .storage_available_area
                                  )}
                                  step={0.01}
                                  border="1px"
                                  borderColor="gray.10"
                                  isDisabled={true}
                                  backgroundColor={"white"}
                                  height={"15px "}
                                  borderRadius={"lg"}
                                  _placeholder={commonStyle._placeholder}
                                  _hover={commonStyle._hover}
                                  _focus={commonStyle._focus}
                                  p={{ base: "4" }}
                                  fontWeight={{ base: "normal" }}
                                  fontStyle={"normal"}
                                  placeholder=""
                                />
                              </FormControl>
                            </GridItem>
                          </Grid>
                          {/* --------------Standard Capacity  available for Storage(MT)-------------- */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              {" "}
                              <Text textAlign="right">
                                {" "}
                                Standard Capacity available for Storage(MT)
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                isInvalid={
                                  errors?.[
                                    schema_obj.first_accordion
                                      .standard_capacity_available_for_storage
                                  ]?.message
                                }
                              >
                                <Input
                                  type="number"
                                  {...register(
                                    schema_obj.first_accordion
                                      .standard_capacity_available_for_storage
                                  )}
                                  border="1px"
                                  borderColor="gray.10"
                                  step={0.01}
                                  isDisabled={true}
                                  backgroundColor={"white"}
                                  height={"15px "}
                                  borderRadius={"lg"}
                                  _placeholder={commonStyle._placeholder}
                                  _hover={commonStyle._hover}
                                  _focus={commonStyle._focus}
                                  p={{ base: "4" }}
                                  fontWeight={{ base: "normal" }}
                                  fontStyle={"normal"}
                                  placeholder=""
                                />
                              </FormControl>
                            </GridItem>
                          </Grid>

                          {/* --------------  rent  ------------ */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                Rent (Per/Sq Ft/Month){" "}
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                isInvalid={
                                  errors?.[schema_obj.first_accordion.rent]
                                }
                              >
                                <Input
                                  type="text"
                                  {...register(schema_obj.first_accordion.rent)}
                                  border="1px"
                                  borderColor="gray.10"
                                  backgroundColor={"white"}
                                  isDisabled={true}
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
                                  placeholder="Total rent payable"
                                />
                              </FormControl>
                            </GridItem>
                          </Grid>

                          {/* -------------- Total rent payable  ------------ */}
                          <Grid
                            textAlign="right"
                            alignItems="center"
                            my="3"
                            templateColumns={templateColumns}
                            gap={5}
                          >
                            <GridItem colSpan={{ base: 1, lg: 0 }}>
                              <Text textAlign="right">
                                Total rent payable (per month){" "}
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
                              <FormControl
                                style={{ w: commonWidth.w }}
                                isInvalid={
                                  errors?.[
                                    schema_obj.first_accordion
                                      .total_rent_per_month
                                  ]
                                }
                              >
                                <Input
                                  type="text"
                                  {...register(
                                    schema_obj.first_accordion
                                      .total_rent_per_month
                                  )}
                                  border="1px"
                                  borderColor="gray.10"
                                  backgroundColor={"white"}
                                  isDisabled={true}
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
                                  placeholder="Total rent payable"
                                />
                              </FormControl>
                            </GridItem>
                          </Grid>

                          {/* -------------- Proposal Type -------------- */}
                          <Box mt={commonStyle.mt}>
                            <Grid
                              textAlign="right"
                              alignItems="center"
                              templateColumns="repeat(3, 1fr)"
                              gap={4}
                            >
                              <GridItem colSpan={1}>
                                <Text textAlign="right">
                                  Proposal Type{" "}
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
                              <GridItem colSpan={1}>
                                <ReactSelect
                                  options={InternalTypeOptions || []}
                                  value={
                                    InternalTypeOptions.filter(
                                      (item) => item.value === internalType
                                    ) || {}
                                  }
                                  isDisabled={true}
                                  onChange={(val) => {
                                    setInternalType(val.value);
                                  }}
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
                              </GridItem>
                            </Grid>
                          </Box>

                          {/* Warehouse Owner details form and table start */}

                          <Box
                            bgColor={"#DBFFF5"}
                            padding="20px"
                            borderRadius="10px"
                            mt={"10px"}
                          >
                            <Heading as="h5" fontSize="lg" textAlign="left">
                              Warehouse Owner Details{" "}
                              <span
                                style={{
                                  color: "red",
                                  marginLeft: "4px",
                                }}
                              >
                                *
                              </span>
                            </Heading>

                            <>
                              {/* --------------  owner name -------------- */}
                              <Box pt="10px">
                                <Grid
                                  alignItems="center"
                                  my="3"
                                  templateColumns={{
                                    base: "repeat(1, 1fr)",
                                    md: "repeat(2, 1fr)",
                                    lg: "repeat(3, 1fr)",
                                  }}
                                  gap={5}
                                >
                                  <GridItem colSpan={1}>
                                    <Box>
                                      <Text my={1}>Owner Name</Text>{" "}
                                      <Box>
                                        <FormControl
                                          style={{ w: commonWidth.w }}
                                          isInvalid={
                                            warehouseOwnerFormsMethod.formState
                                              .errors?.[
                                              warehouse_owner_obj
                                                .warehouse_owner_name
                                            ]?.type?.required
                                          }
                                        >
                                          <Input
                                            type="text"
                                            {...warehouseOwnerFormsMethod.register(
                                              warehouse_owner_obj.warehouse_owner_name
                                            )}
                                            border="1px"
                                            borderColor="gray.10"
                                            backgroundColor={"white"}
                                            isDisabled={getValues("form_edit")}
                                            height={"15px "}
                                            borderRadius={"lg"}
                                            _placeholder={
                                              commonStyle._placeholder
                                            }
                                            _hover={commonStyle._hover}
                                            _focus={commonStyle._focus}
                                            p={{ base: "4" }}
                                            fontWeight={{ base: "normal" }}
                                            fontStyle={"normal"}
                                            placeholder="Owner Name"
                                          />
                                        </FormControl>
                                      </Box>
                                    </Box>
                                  </GridItem>
                                  <GridItem colSpan={1}>
                                    <Box>
                                      <Text my={1}>Mobile No.</Text>{" "}
                                      <Box>
                                        <FormControl
                                          style={{ w: commonWidth.w }}
                                          isInvalid={
                                            warehouseOwnerFormsMethod.formState
                                              .errors?.[
                                              warehouse_owner_obj
                                                .warehouse_owner_contact_no
                                            ]?.type?.required
                                          }
                                        >
                                          {console.log(
                                            warehouseOwnerFormsMethod.getValues(
                                              warehouse_owner_obj.warehouse_owner_contact_no
                                            ),
                                            " warehouse_owner_contact_no"
                                          )}
                                          <Input
                                            type="text"
                                            {...warehouseOwnerFormsMethod.register(
                                              warehouse_owner_obj.warehouse_owner_contact_no
                                            )}
                                            border="1px"
                                            borderColor="gray.10"
                                            isDisabled={getValues("form_edit")}
                                            backgroundColor={"white"}
                                            height={"15px "}
                                            borderRadius={"lg"}
                                            _placeholder={
                                              commonStyle._placeholder
                                            }
                                            value={
                                              warehouseOwnerFormsMethod
                                                .getValues(
                                                  warehouse_owner_obj.warehouse_owner_contact_no
                                                )
                                                ?.split("+91")[1]
                                                ? Number(
                                                    warehouseOwnerFormsMethod
                                                      .getValues(
                                                        warehouse_owner_obj.warehouse_owner_contact_no
                                                      )
                                                      ?.split("+91")[1] || ""
                                                  )
                                                : ""
                                            }
                                            onChange={(e) => {
                                              warehouseOwnerFormsMethod.setValue(
                                                warehouse_owner_obj.warehouse_owner_contact_no,
                                                "+91" + e.target.value,
                                                {
                                                  shouldValidate: true,
                                                }
                                              );
                                            }}
                                            _hover={commonStyle._hover}
                                            _focus={commonStyle._focus}
                                            p={{ base: "4" }}
                                            fontWeight={{ base: "normal" }}
                                            fontStyle={"normal"}
                                            placeholder="Mobile No."
                                          />
                                        </FormControl>
                                      </Box>
                                    </Box>
                                  </GridItem>
                                  <GridItem colSpan={1}>
                                    <Box>
                                      <Text my={1}>Address</Text>{" "}
                                      <Box>
                                        <FormControl
                                          style={{ w: commonWidth.w }}
                                          isInvalid={
                                            warehouseOwnerFormsMethod.formState
                                              .errors?.[
                                              warehouse_owner_obj
                                                .warehouse_owner_address
                                            ]?.type?.required
                                          }
                                        >
                                          <Input
                                            type="text"
                                            {...warehouseOwnerFormsMethod.register(
                                              warehouse_owner_obj.warehouse_owner_address
                                            )}
                                            border="1px"
                                            borderColor="gray.10"
                                            isDisabled={getValues("form_edit")}
                                            backgroundColor={"white"}
                                            height={"15px "}
                                            borderRadius={"lg"}
                                            //value={inputValue}
                                            //  onChange={onChange}
                                            _placeholder={
                                              commonStyle._placeholder
                                            }
                                            _hover={commonStyle._hover}
                                            _focus={commonStyle._focus}
                                            // isDisabled={true}
                                            p={{ base: "4" }}
                                            fontWeight={{ base: "normal" }}
                                            fontStyle={"normal"}
                                            placeholder="Owner Address"
                                          />
                                        </FormControl>
                                      </Box>
                                    </Box>
                                  </GridItem>

                                  {selectBoxOptions?.warehouseSubType?.filter(
                                    (item) =>
                                      item.value ===
                                      getValues(
                                        schema_obj.first_accordion
                                          .warehouse_sub_type
                                      )
                                  )[0]?.label === "Revenue sharing" ? (
                                    <>
                                      <GridItem colSpan={1}>
                                        <Box>
                                          <Text my={1}>Revenue sharing</Text>{" "}
                                          <Box>
                                            <FormControl
                                              style={{ w: commonWidth.w }}
                                              isInvalid={
                                                warehouseOwnerFormsMethod
                                                  .formState.errors?.[
                                                  warehouse_owner_obj
                                                    .revenue_sharing_ratio
                                                ]?.type?.required
                                              }
                                            >
                                              <Input
                                                type="number"
                                                {...warehouseOwnerFormsMethod.register(
                                                  warehouse_owner_obj.revenue_sharing_ratio
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                isDisabled={getValues(
                                                  "form_edit"
                                                )}
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
                                                _hover={commonStyle._hover}
                                                _focus={commonStyle._focus}
                                                p={{ base: "4" }}
                                                fontWeight={{ base: "normal" }}
                                                fontStyle={"normal"}
                                                placeholder="Revenue sharing"
                                              />
                                            </FormControl>
                                          </Box>
                                        </Box>
                                      </GridItem>
                                      <GridItem colSpan={1}>
                                        <Box>
                                          <Text my={1}>Min Fixed Amount</Text>{" "}
                                          <Box>
                                            <FormControl
                                              style={{ w: commonWidth.w }}
                                              isInvalid={
                                                warehouseOwnerFormsMethod
                                                  .formState.errors?.[
                                                  warehouse_owner_obj
                                                    .revenue_sharing_fix_amount
                                                ]?.type?.required
                                              }
                                            >
                                              <Input
                                                type="number"
                                                {...warehouseOwnerFormsMethod.register(
                                                  warehouse_owner_obj.revenue_sharing_fix_amount
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                isDisabled={getValues(
                                                  "form_edit"
                                                )}
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
                                                _hover={commonStyle._hover}
                                                _focus={commonStyle._focus}
                                                p={{ base: "4" }}
                                                fontWeight={{ base: "normal" }}
                                                fontStyle={"normal"}
                                                placeholder="Min Fixed Amount"
                                              />
                                            </FormControl>
                                          </Box>
                                        </Box>
                                      </GridItem>
                                    </>
                                  ) : (
                                    <>
                                      {" "}
                                      <GridItem colSpan={1}>
                                        <Box>
                                          <Text my={1}>Rent</Text>{" "}
                                          <Box>
                                            <FormControl
                                              style={{ w: commonWidth.w }}
                                              isInvalid={
                                                warehouseOwnerFormsMethod
                                                  .formState.errors?.[
                                                  warehouse_owner_obj
                                                    .rent_amount
                                                ]?.type?.required
                                              }
                                            >
                                              <Input
                                                type="number"
                                                {...warehouseOwnerFormsMethod.register(
                                                  warehouse_owner_obj.rent_amount
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                isDisabled={
                                                  getValues("form_edit") ||
                                                  (selectBoxOptions?.warehouseType?.filter(
                                                    (item) =>
                                                      item.value ===
                                                      getValues(
                                                        schema_obj
                                                          .first_accordion
                                                          .warehouse_type
                                                      )
                                                  )[0]?.label === "WMS" &&
                                                    selectBoxOptions?.warehouseSubType?.filter(
                                                      (item) =>
                                                        item.value ===
                                                        getValues(
                                                          schema_obj
                                                            .first_accordion
                                                            .warehouse_sub_type
                                                        )
                                                    )[0]?.label ===
                                                      "Fixed rental")
                                                }
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
                                                _hover={commonStyle._hover}
                                                _focus={commonStyle._focus}
                                                p={{ base: "4" }}
                                                fontWeight={{ base: "normal" }}
                                                fontStyle={"normal"}
                                                placeholder="Rent"
                                              />
                                            </FormControl>
                                          </Box>
                                        </Box>
                                      </GridItem>
                                    </>
                                  )}
                                  <GridItem colSpan={1}>
                                    <Flex
                                      gap="10px"
                                      justifyContent="end"
                                      alignItems="center"
                                    >
                                      <Button
                                        bg="#A6CE39"
                                        _hover={{}}
                                        isDisabled={getValues("form_edit")}
                                        color="white"
                                        borderRadius={"50px"}
                                        padding="0px 20px"
                                        type="button"
                                        onClick={() => {
                                          warehouseOwnerOnSubmit();
                                        }}
                                      >
                                        {editedFormIndex?.warehouseOwnerFormEditedIndex ===
                                        ""
                                          ? "Add"
                                          : "Update"}
                                      </Button>
                                    </Flex>
                                  </GridItem>
                                </Grid>
                              </Box>
                            </>
                          </Box>

                          {/* show warehouse owner details table start */}
                          <TableContainer mt="4">
                            <Table color="#000">
                              <Thead
                                bg="#dbfff5"
                                border="1px"
                                borderColor="#000"
                              >
                                <Tr style={{ color: "#000" }}>
                                  <Th color="#000">Owner Name</Th>
                                  <Th color="#000">Mobile No</Th>
                                  <Th color="#000">Address</Th>
                                  {selectBoxOptions?.warehouseSubType?.filter(
                                    (item) =>
                                      item.value ===
                                      getValues(
                                        schema_obj.first_accordion
                                          .warehouse_sub_type
                                      )
                                  )[0]?.label === "Revenue sharing" ? (
                                    <>
                                      <Th color="#000">Min Fixed Amount</Th>
                                      <Th color="#000">Revenue sharing</Th>
                                    </>
                                  ) : (
                                    <Th color="#000">Rent</Th>
                                  )}
                                  <Th color="#000">Action</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {warehouseOwnersDetails &&
                                  warehouseOwnersDetails.map((item, i) => (
                                    <Tr
                                      key={`warehouse_owner_details${i}`}
                                      textAlign="center"
                                      bg="white"
                                      border="1px"
                                      borderColor="#000"
                                    >
                                      <Td>{item?.warehouse_owner_name} </Td>
                                      <Td>
                                        {item?.warehouse_owner_contact_no}{" "}
                                      </Td>
                                      <Td>{item?.warehouse_owner_address} </Td>
                                      {selectBoxOptions?.warehouseSubType?.filter(
                                        (item) =>
                                          item.value ===
                                          getValues(
                                            schema_obj.first_accordion
                                              .warehouse_sub_type
                                          )
                                      )[0]?.label === "Revenue sharing" ? (
                                        <>
                                          <Td>
                                            {item?.revenue_sharing_fix_amount}{" "}
                                          </Td>
                                          <Td>
                                            {item?.revenue_sharing_ratio}{" "}
                                          </Td>
                                        </>
                                      ) : (
                                        <Td>{item?.rent_amount} </Td>
                                      )}
                                      <Td>
                                        <Box
                                          display="flex"
                                          alignItems="center"
                                          gap="3"
                                        >
                                          <Flex
                                            gap="20px"
                                            justifyContent="center"
                                          >
                                            <Box color={"primary.700"}>
                                              <BiEditAlt
                                                // color="#A6CE39"
                                                fontSize="26px"
                                                cursor="pointer"
                                                onClick={() => {
                                                  if (getValues("form_edit")) {
                                                  } else {
                                                    warehouseOwnerOnEdit(
                                                      item,
                                                      i
                                                    );
                                                  }
                                                }}
                                              />
                                            </Box>
                                            <Box color="red">
                                              <AiOutlineDelete
                                                cursor="pointer"
                                                fontSize="26px"
                                                onClick={() => {
                                                  if (getValues("form_edit")) {
                                                  } else {
                                                    warehouseOwnerRemove(i);
                                                  }
                                                }}
                                              />
                                            </Box>
                                          </Flex>
                                        </Box>
                                      </Td>
                                    </Tr>
                                  ))}
                                {warehouseOwnersDetails.length === 0 && (
                                  <Tr textAlign="center">
                                    <Td colSpan="5" color="#000">
                                      No record found
                                    </Td>
                                  </Tr>
                                )}
                              </Tbody>
                            </Table>
                          </TableContainer>
                          {/* show client table end */}

                          {/* Warehouse Owner details form and table end */}
                          {internalType === "Sub Leased" ? (
                            <>
                              {/*  Lessee details form and table start */}

                              <Box
                                mt="10"
                                bgColor={"#DBFFF5"}
                                padding="20px"
                                borderRadius="10px"
                              >
                                <Heading as="h5" fontSize="lg" textAlign="left">
                                  Lessee details{" "}
                                  <span
                                    style={{
                                      color: "red",
                                      marginLeft: "4px",
                                    }}
                                  >
                                    *
                                  </span>
                                </Heading>

                                <>
                                  {/* --------------  Lessee name -------------- */}
                                  <Box pt="10px">
                                    <Grid
                                      alignItems="center"
                                      my="3"
                                      templateColumns={{
                                        base: "repeat(1, 1fr)",
                                        md: "repeat(2, 1fr)",
                                        lg: "repeat(3, 1fr)",
                                      }}
                                      gap={5}
                                    >
                                      <GridItem colSpan={1}>
                                        <Box>
                                          <Text my={1}> Lessee name</Text>{" "}
                                          <Box>
                                            <FormControl
                                              style={{ w: commonWidth.w }}
                                              isInvalid={
                                                lesseeDetailsFormsMethod
                                                  .formState.errors?.[
                                                  lessee_details_obj.lessee_name
                                                ]?.types?.required
                                              }
                                            >
                                              <Input
                                                type="text"
                                                {...lesseeDetailsFormsMethod.register(
                                                  lessee_details_obj.lessee_name
                                                )}
                                                isDisabled={getValues(
                                                  "form_edit"
                                                )}
                                                border="1px"
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
                                                _hover={commonStyle._hover}
                                                _focus={commonStyle._focus}
                                                p={{ base: "4" }}
                                                fontWeight={{ base: "normal" }}
                                                fontStyle={"normal"}
                                                placeholder="Lessee name"
                                              />
                                            </FormControl>
                                          </Box>
                                        </Box>
                                      </GridItem>
                                      <GridItem colSpan={1}>
                                        <Box>
                                          <Text my={1}> Mobile No. </Text>{" "}
                                          <Box>
                                            <FormControl
                                              style={{ w: commonWidth.w }}
                                              isInvalid={
                                                lesseeDetailsFormsMethod
                                                  .formState.errors?.[
                                                  lessee_details_obj
                                                    .lessee_contact_no
                                                ]?.types?.required
                                              }
                                            >
                                              <Input
                                                type="text"
                                                {...lesseeDetailsFormsMethod.register(
                                                  lessee_details_obj.lessee_contact_no
                                                )}
                                                border="1px"
                                                isDisabled={getValues(
                                                  "form_edit"
                                                )}
                                                value={
                                                  lesseeDetailsFormsMethod
                                                    .getValues(
                                                      lessee_details_obj.lessee_contact_no
                                                    )
                                                    ?.split("+91")[1]
                                                    ? Number(
                                                        lesseeDetailsFormsMethod
                                                          .getValues(
                                                            lessee_details_obj.lessee_contact_no
                                                          )
                                                          ?.split("+91")[1] ||
                                                          ""
                                                      )
                                                    : ""
                                                }
                                                onChange={(e) => {
                                                  lesseeDetailsFormsMethod.setValue(
                                                    lessee_details_obj.lessee_contact_no,
                                                    "+91" + e.target.value,
                                                    {
                                                      shouldValidate: true,
                                                    }
                                                  );
                                                }}
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
                                                _hover={commonStyle._hover}
                                                _focus={commonStyle._focus}
                                                p={{ base: "4" }}
                                                fontWeight={{ base: "normal" }}
                                                fontStyle={"normal"}
                                                placeholder="Mobile No"
                                              />
                                            </FormControl>
                                          </Box>
                                        </Box>
                                      </GridItem>
                                      <GridItem colSpan={1}>
                                        <Box>
                                          <Text my={1}>Lessee Address</Text>{" "}
                                          <Box>
                                            <FormControl
                                              style={{ w: commonWidth.w }}
                                              isInvalid={
                                                lesseeDetailsFormsMethod
                                                  .formState.errors?.[
                                                  lessee_details_obj
                                                    .lessee_address
                                                ]?.type?.required
                                              }
                                            >
                                              <Input
                                                type="text"
                                                {...lesseeDetailsFormsMethod.register(
                                                  lessee_details_obj.lessee_address
                                                )}
                                                border="1px"
                                                isDisabled={getValues(
                                                  "form_edit"
                                                )}
                                                borderColor="gray.10"
                                                backgroundColor={"white"}
                                                height={"15px "}
                                                borderRadius={"lg"}
                                                //value={inputValue}
                                                //  onChange={onChange}
                                                _placeholder={
                                                  commonStyle._placeholder
                                                }
                                                _hover={commonStyle._hover}
                                                _focus={commonStyle._focus}
                                                // isDisabled={true}
                                                p={{ base: "4" }}
                                                fontWeight={{ base: "normal" }}
                                                fontStyle={"normal"}
                                                placeholder="Lessee Address"
                                              />
                                            </FormControl>
                                          </Box>
                                        </Box>
                                      </GridItem>
                                      {selectBoxOptions?.warehouseSubType?.filter(
                                        (item) =>
                                          item.value ===
                                          getValues(
                                            schema_obj.first_accordion
                                              .warehouse_sub_type
                                          )
                                      )[0]?.label === "Revenue sharing" ? (
                                        <>
                                          <GridItem colSpan={1}>
                                            <Box>
                                              <Text my={1}>
                                                Revenue sharing{" "}
                                              </Text>{" "}
                                              <Box>
                                                <FormControl
                                                  style={{ w: commonWidth.w }}
                                                  isInvalid={
                                                    lesseeDetailsFormsMethod
                                                      .formState.errors?.[
                                                      lessee_details_obj
                                                        .revenue_sharing_ratio
                                                    ]?.types?.required
                                                  }
                                                >
                                                  <Input
                                                    type="number"
                                                    {...lesseeDetailsFormsMethod.register(
                                                      lessee_details_obj.revenue_sharing_ratio
                                                    )}
                                                    isDisabled={getValues(
                                                      "form_edit"
                                                    )}
                                                    border="1px"
                                                    borderColor="gray.10"
                                                    backgroundColor={"white"}
                                                    height={"15px "}
                                                    borderRadius={"lg"}
                                                    _placeholder={
                                                      commonStyle._placeholder
                                                    }
                                                    _hover={commonStyle._hover}
                                                    _focus={commonStyle._focus}
                                                    p={{ base: "4" }}
                                                    fontWeight={{
                                                      base: "normal",
                                                    }}
                                                    fontStyle={"normal"}
                                                    placeholder="Rent"
                                                  />
                                                </FormControl>
                                              </Box>
                                            </Box>
                                          </GridItem>
                                          <GridItem colSpan={1}>
                                            <Box>
                                              <Text my={1}>
                                                {" "}
                                                Min Fixed Amount{" "}
                                              </Text>{" "}
                                              <Box>
                                                <FormControl
                                                  style={{ w: commonWidth.w }}
                                                  isInvalid={
                                                    lesseeDetailsFormsMethod
                                                      .formState.errors?.[
                                                      lessee_details_obj
                                                        .revenue_sharing_fix_amount
                                                    ]?.types?.required
                                                  }
                                                >
                                                  <Input
                                                    type="number"
                                                    {...lesseeDetailsFormsMethod.register(
                                                      lessee_details_obj.revenue_sharing_fix_amount
                                                    )}
                                                    isDisabled={getValues(
                                                      "form_edit"
                                                    )}
                                                    border="1px"
                                                    borderColor="gray.10"
                                                    backgroundColor={"white"}
                                                    height={"15px "}
                                                    borderRadius={"lg"}
                                                    _placeholder={
                                                      commonStyle._placeholder
                                                    }
                                                    _hover={commonStyle._hover}
                                                    _focus={commonStyle._focus}
                                                    p={{ base: "4" }}
                                                    fontWeight={{
                                                      base: "normal",
                                                    }}
                                                    fontStyle={"normal"}
                                                    placeholder="Rent"
                                                  />
                                                </FormControl>
                                              </Box>
                                            </Box>
                                          </GridItem>
                                        </>
                                      ) : (
                                        <GridItem colSpan={1}>
                                          <Box>
                                            <Text my={1}> Rent </Text>{" "}
                                            <Box>
                                              <FormControl
                                                style={{ w: commonWidth.w }}
                                                isInvalid={
                                                  lesseeDetailsFormsMethod
                                                    .formState.errors?.[
                                                    lessee_details_obj
                                                      .rent_amount
                                                  ]?.types?.required
                                                }
                                              >
                                                <Input
                                                  type="number"
                                                  {...lesseeDetailsFormsMethod.register(
                                                    lessee_details_obj.rent_amount
                                                  )}
                                                  isDisabled={
                                                    getValues("form_edit") ||
                                                    (selectBoxOptions?.warehouseType?.filter(
                                                      (item) =>
                                                        item.value ===
                                                        getValues(
                                                          schema_obj
                                                            .first_accordion
                                                            .warehouse_type
                                                        )
                                                    )[0]?.label === "WMS" &&
                                                      selectBoxOptions?.warehouseSubType?.filter(
                                                        (item) =>
                                                          item.value ===
                                                          getValues(
                                                            schema_obj
                                                              .first_accordion
                                                              .warehouse_sub_type
                                                          )
                                                      )[0]?.label ===
                                                        "Fixed rental")
                                                  }
                                                  border="1px"
                                                  borderColor="gray.10"
                                                  backgroundColor={"white"}
                                                  height={"15px "}
                                                  borderRadius={"lg"}
                                                  _placeholder={
                                                    commonStyle._placeholder
                                                  }
                                                  _hover={commonStyle._hover}
                                                  _focus={commonStyle._focus}
                                                  p={{ base: "4" }}
                                                  fontWeight={{
                                                    base: "normal",
                                                  }}
                                                  fontStyle={"normal"}
                                                  placeholder="Rent"
                                                />
                                              </FormControl>
                                            </Box>
                                          </Box>
                                        </GridItem>
                                      )}
                                      <GridItem colSpan={1}>
                                        <Flex
                                          gap="10px"
                                          justifyContent="end"
                                          alignItems="center"
                                        >
                                          <Button
                                            bg="#A6CE39"
                                            isDisabled={getValues("form_edit")}
                                            _hover={{}}
                                            color="white"
                                            borderRadius={"50px"}
                                            padding="0px 20px"
                                            type="button"
                                            onClick={() => {
                                              lesseeOnSubmit();
                                            }}
                                          >
                                            {editedFormIndex?.editedLesseeFormEditedIndex ===
                                            ""
                                              ? "Save"
                                              : "Update"}
                                          </Button>
                                        </Flex>
                                      </GridItem>
                                    </Grid>
                                  </Box>
                                </>
                              </Box>

                              {/*  Lessee details details table start */}
                              <TableContainer mt="4">
                                <Table color="#000">
                                  <Thead
                                    bg="#dbfff5"
                                    border="1px"
                                    borderColor="#000"
                                  >
                                    <Tr style={{ color: "#000" }}>
                                      <Th color="#000">Lessee Name</Th>
                                      <Th color="#000">Mobile No.</Th>
                                      <Th color="#000">Address</Th>
                                      {selectBoxOptions?.warehouseSubType?.filter(
                                        (item) =>
                                          item.value ===
                                          getValues(
                                            schema_obj.first_accordion
                                              .warehouse_sub_type
                                          )
                                      )[0]?.label === "Revenue sharing" ? (
                                        <>
                                          <Th color="#000">Min Fixed Amount</Th>
                                          <Th color="#000">Revenue sharing</Th>
                                        </>
                                      ) : (
                                        <Th color="#000">Rent</Th>
                                      )}
                                      <Th color="#000">Action</Th>
                                    </Tr>
                                  </Thead>
                                  <Tbody>
                                    {console.log(
                                      "lesseeDetails",
                                      lesseeDetails
                                    )}
                                    {lesseeDetails &&
                                      lesseeDetails.map((item, i) => (
                                        <Tr
                                          key={`lesseeDetails_${i}`}
                                          textAlign="center"
                                          bg="white"
                                          border="1px"
                                          borderColor="#000"
                                        >
                                          <Td>{item?.lessee_name} </Td>
                                          <Td>{item?.lessee_contact_no} </Td>
                                          <Td>{item?.lessee_address} </Td>
                                          {selectBoxOptions?.warehouseSubType?.filter(
                                            (item) =>
                                              item.value ===
                                              getValues(
                                                schema_obj.first_accordion
                                                  .warehouse_sub_type
                                              )
                                          )[0]?.label === "Revenue sharing" ? (
                                            <>
                                              <Td>
                                                {
                                                  item?.revenue_sharing_fix_amount
                                                }{" "}
                                              </Td>
                                              <Td>
                                                {item?.revenue_sharing_ratio}{" "}
                                              </Td>
                                            </>
                                          ) : (
                                            <Td>{item?.rent_amount} </Td>
                                          )}
                                          <Td>
                                            <Box
                                              display="flex"
                                              alignItems="center"
                                              gap="3"
                                            >
                                              <Flex
                                                gap="20px"
                                                justifyContent="center"
                                              >
                                                <Box color={"primary.700"}>
                                                  <BiEditAlt
                                                    // color="#A6CE39"
                                                    fontSize="26px"
                                                    cursor="pointer"
                                                    onClick={() => {
                                                      if (
                                                        getValues("form_edit")
                                                      ) {
                                                      } else {
                                                        lesseeOnEdit(item, i);
                                                      }
                                                    }}
                                                  />
                                                </Box>
                                                <Box color="red">
                                                  <AiOutlineDelete
                                                    cursor="pointer"
                                                    fontSize="26px"
                                                    onClick={() => {
                                                      if (
                                                        getValues("form_edit")
                                                      ) {
                                                      } else {
                                                        lesseeRemove(i);
                                                      }
                                                    }}
                                                  />
                                                </Box>
                                              </Flex>
                                            </Box>
                                          </Td>
                                        </Tr>
                                      ))}
                                    {lesseeDetails.length === 0 && (
                                      <Tr textAlign="center">
                                        <Td colSpan="5" color="#000">
                                          No record found
                                        </Td>
                                      </Tr>
                                    )}
                                  </Tbody>
                                </Table>
                              </TableContainer>
                              {/*  Lessee details table end */}
                              {/*  Lessee details form and table end */}
                            </>
                          ) : (
                            <></>
                          )}

                          {/* --------------  Go Green Revenue Sharing  ------------ */}
                          {selectBoxOptions?.warehouseSubType?.filter(
                            (item) =>
                              item.value ===
                              getValues(
                                schema_obj.first_accordion.warehouse_sub_type
                              )
                          )[0]?.label === "Revenue sharing" ? (
                            <Grid
                              textAlign="right"
                              alignItems="center"
                              my="3"
                              templateColumns={templateColumns}
                              gap={5}
                            >
                              <GridItem colSpan={{ base: 1, lg: 0 }}>
                                <Text textAlign="right">
                                  Go Green Revenue Sharing{" "}
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
                                <FormControl
                                  style={{ w: commonWidth.w }}
                                  isInvalid={
                                    errors?.[
                                      schema_obj.first_accordion
                                        .gg_revenue_ratio
                                    ]
                                  }
                                >
                                  <Input
                                    type="text"
                                    {...register(
                                      schema_obj.first_accordion
                                        .gg_revenue_ratio
                                    )}
                                    border="1px"
                                    borderColor="gray.10"
                                    backgroundColor={"white"}
                                    isDisabled={true}
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
                                    placeholder="Go Green Revenue Sharing"
                                  />
                                </FormControl>
                              </GridItem>
                            </Grid>
                          ) : (
                            <></>
                          )}
                        </Box>
                        {/* --------------  Lock & Key of WH select -------------- */}
                        <Grid
                          textAlign="right"
                          alignItems="center"
                          my="3"
                          templateColumns={templateColumns}
                          gap={5}
                        >
                          <GridItem colSpan={{ base: 1, lg: 0 }}>
                            <Text textAlign="right">
                              Lock & Key of WH{" "}
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
                            <FormControl
                              style={{ w: commonWidth.w }}
                              //  isInvalid={true}
                            >
                              <ReactSelect
                                options={LockKeyOfWHOptions || []}
                                value={
                                  LockKeyOfWHOptions?.filter(
                                    (item) =>
                                      item.value ===
                                      getValues(
                                        schema_obj.first_accordion
                                          .lock_and_key_of_warehouse
                                      )
                                  )[0] || null
                                }
                                {...register(
                                  schema_obj.first_accordion
                                    .lock_and_key_of_warehouse
                                )}
                                onChange={(val) => {
                                  setValue(
                                    schema_obj.first_accordion
                                      .lock_and_key_of_warehouse,
                                    val?.value,
                                    {
                                      shouldValidate: true,
                                    }
                                  );
                                }}
                                isDisabled={getValues("form_edit")}
                                styles={{
                                  control: (base, state) => ({
                                    ...base,
                                    backgroundColor: "#fff",
                                    borderRadius: "6px",
                                    borderWidth: "1px",
                                    borderColor: errors?.[
                                      schema_obj.first_accordion
                                        .lock_and_key_of_warehouse
                                    ]?.message
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
                        {/* --------------  Proper distance maintain between  radio buttons walls and stock-------------- */}
                        <Grid
                          textAlign="right"
                          alignItems="center"
                          my="3"
                          templateColumns={templateColumns}
                          gap={5}
                        >
                          <GridItem colSpan={{ base: 1, lg: 0 }}>
                            <Text textAlign="right">
                              Proper distance maintain between walls and stock{" "}
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
                            <FormControl
                              style={{ w: commonWidth.w }}
                              isInvalid={
                                errors?.[
                                  schema_obj.first_accordion
                                    .distance_between_walls_and_stock
                                ]?.message
                              }
                            >
                              <Box>
                                <RadioGroup
                                  p="0"
                                  value={
                                    getValues(
                                      schema_obj.first_accordion
                                        .distance_between_walls_and_stock
                                    ) || "false"
                                  }
                                  isDisabled={getValues("form_edit")}
                                  name={
                                    schema_obj.first_accordion
                                      .distance_between_walls_and_stock
                                  }
                                  onChange={(e) => {
                                    setValue(
                                      schema_obj.first_accordion
                                        .distance_between_walls_and_stock,
                                      e,
                                      { shouldValidate: true }
                                    );
                                  }}
                                >
                                  <Stack spacing={5} direction="row">
                                    <Radio
                                      colorScheme="radioBoxPrimary"
                                      value={"true"}
                                    >
                                      Yes
                                    </Radio>
                                    <Radio
                                      colorScheme="radioBoxPrimary"
                                      value={"false"}
                                    >
                                      No
                                    </Radio>
                                  </Stack>
                                </RadioGroup>
                              </Box>
                            </FormControl>
                          </GridItem>
                        </Grid>
                        {/* --------------  Remarks-------------- */}
                        <Grid
                          textAlign="right"
                          alignItems="center"
                          my="3"
                          templateColumns={templateColumns}
                          gap={5}
                        >
                          <GridItem colSpan={{ base: 1, lg: 0 }}>
                            <Text textAlign="right">Remarks</Text>{" "}
                          </GridItem>
                          <GridItem colSpan={{ base: 1 }}>
                            <FormControl
                              style={{ w: commonWidth.w }}
                              isInvalid={
                                errors?.[
                                  schema_obj.first_accordion.no_distance_remarks
                                ]?.message
                              }
                            >
                              <Box>
                                <Textarea
                                  type="text"
                                  {...register(
                                    schema_obj.first_accordion
                                      .no_distance_remarks
                                  )}
                                  border="1px"
                                  borderColor="gray.10"
                                  isDisabled={getValues("form_edit")}
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
                                  placeholder="Enter remarks"
                                />
                              </Box>
                            </FormControl>
                          </GridItem>
                        </Grid>

                        {getValues("is_draftable") ? (
                          <Flex
                            gap="10px"
                            justifyContent="end"
                            alignItems="center"
                          >
                            <Button
                              bg="#A6CE39"
                              _hover={{}}
                              color="white"
                              marginTop={"30px"}
                              padding="0px 30px"
                              borderRadius={"50px"}
                              type="button"
                              onClick={() => {
                                saveAsDraftFunction();
                              }}
                            >
                              Save As Draft
                            </Button>
                          </Flex>
                        ) : (
                          <></>
                        )}
                      </Box>
                    </AccordionPanel>
                  </Box>
                </>
              )}
            </AccordionItem>

            <AccordionItem mt="20px">
              {({ isExpanded }) => (
                <>
                  <Box>
                    <AccordionButton bg="white" p="4" borderRadius={10}>
                      <Box
                        fontWeight="bold"
                        as="span"
                        flex="1"
                        textAlign="left"
                      >
                        Warehouse Sub Details
                      </Box>
                      {isExpanded ? (
                        <MinusIcon fontSize="12px" />
                      ) : (
                        <AddIcon fontSize="12px" />
                      )}
                    </AccordionButton>
                    <AccordionPanel bg="white" mt="5" pb={4} py="4" px="8">
                      <WarehouseSubDetails
                        mainFormsMethod={{
                          // register,
                          // setValue,
                          // getValues,
                          // watch,
                          // handleSubmit,
                          // setError,
                          // errors,
                          register: memoizedRegister,
                          setValue: memoizedSetValue,
                          getValues: memoizedGetValues,
                          watch: memoizedWatch,
                          handleSubmit: memoizedHandleSubmit,
                          setError: memoizedSetError,
                          errors: memoizedErrors,
                        }}
                        warehouse_sub_details_form_schema={
                          warehouse_sub_details_form_schemaKey
                        }
                        saveFunction={() => saveAsDraftFunction()}
                      />
                    </AccordionPanel>
                  </Box>
                </>
              )}
            </AccordionItem>

            <AccordionItem mt="20px">
              {({ isExpanded }) => (
                <>
                  <Box>
                    <AccordionButton bg="white" p="4" borderRadius={10}>
                      <Box
                        fontWeight="bold"
                        as="span"
                        flex="1"
                        textAlign="left"
                      >
                        Commodity Details
                      </Box>
                      {isExpanded ? (
                        <MinusIcon fontSize="12px" />
                      ) : (
                        <AddIcon fontSize="12px" />
                      )}
                    </AccordionButton>
                    <AccordionPanel bg="white" mt="5" pb={4} py="4" px="8">
                      <CommodityDetails
                        mainFormsMethod={{
                          // register,
                          // setValue,
                          // getValues,
                          // watch,
                          // handleSubmit,
                          // setError,
                          // errors,
                          register: memoizedRegister,
                          setValue: memoizedSetValue,
                          getValues: memoizedGetValues,
                          watch: memoizedWatch,
                          handleSubmit: memoizedHandleSubmit,
                          setError: memoizedSetError,
                          errors: memoizedErrors,
                        }}
                        commodity_details_form_schema={
                          commodity_details_form_schemaKey
                        }
                        saveFunction={() => saveAsDraftFunction()}
                      />
                    </AccordionPanel>
                  </Box>
                </>
              )}
            </AccordionItem>

            <AccordionItem mt="20px">
              {({ isExpanded }) => (
                <>
                  <Box>
                    <AccordionButton bg="white" p="4" borderRadius={10}>
                      <Box
                        fontWeight="bold"
                        as="span"
                        flex="1"
                        textAlign="left"
                      >
                        Facilities at Warehouse
                      </Box>
                      {isExpanded ? (
                        <MinusIcon fontSize="12px" />
                      ) : (
                        <AddIcon fontSize="12px" />
                      )}
                    </AccordionButton>
                    <AccordionPanel bg="white" mt="5" pb={4} py="4" px="8">
                      <FacilitiesAtWarehouse
                        mainFormsMethod={{
                          // register,
                          // setValue,
                          // getValues,
                          // watch,
                          // handleSubmit,
                          // setError,
                          // errors,
                          register: memoizedRegister,
                          setValue: memoizedSetValue,
                          getValues: memoizedGetValues,
                          watch: memoizedWatch,
                          handleSubmit: memoizedHandleSubmit,
                          setError: memoizedSetError,
                          errors: memoizedErrors,
                        }}
                        facilities_at_warehouse_form_schema={
                          // schema_obj.fifth_accordion
                          facilities_at_warehouse_form_schemaKey
                        }
                        saveFunction={() => saveAsDraftFunction()}
                      />
                    </AccordionPanel>
                  </Box>
                </>
              )}
            </AccordionItem>

            <AccordionItem mt="20px">
              {({ isExpanded }) => (
                <>
                  <Box>
                    <AccordionButton bg="white" p="4" borderRadius={10}>
                      <Box
                        fontWeight="bold"
                        as="span"
                        flex="1"
                        textAlign="left"
                      >
                        Supervisor and Security Guard related Details
                      </Box>
                      {isExpanded ? (
                        <MinusIcon fontSize="12px" />
                      ) : (
                        <AddIcon fontSize="12px" />
                      )}
                    </AccordionButton>
                    <AccordionPanel bg="white" mt="5" pb={4} py="4" px="8">
                      <SupervisorDetails
                        mainFormsMethod={{
                          // register,
                          // setValue,
                          // getValues,
                          // watch,
                          // handleSubmit,
                          // setError,
                          // errors,
                          register: memoizedRegister,
                          setValue: memoizedSetValue,
                          getValues: memoizedGetValues,
                          watch: memoizedWatch,
                          handleSubmit: memoizedHandleSubmit,
                          setError: memoizedSetError,
                          errors: memoizedErrors,
                        }}
                        supervisor_details_form_schema={
                          // schema_obj.gard_accordion
                          supervisor_details_form_schemaKey
                        }
                        saveFunction={() => saveAsDraftFunction()}
                      />
                    </AccordionPanel>
                  </Box>
                </>
              )}
            </AccordionItem>

            <AccordionItem mt="20px">
              {({ isExpanded }) => (
                <>
                  <Box>
                    <AccordionButton bg="white" p="4" borderRadius={10}>
                      <Box
                        fontWeight="bold"
                        as="span"
                        flex="1"
                        textAlign="left"
                      >
                        Other Details
                      </Box>
                      {isExpanded ? (
                        <MinusIcon fontSize="12px" />
                      ) : (
                        <AddIcon fontSize="12px" />
                      )}
                    </AccordionButton>
                    <AccordionPanel bg="white" mt="5" pb={4} py="4" px="8">
                      <OtherDetails
                        mainFormsMethod={{
                          register: memoizedRegister,
                          setValue: memoizedSetValue,
                          getValues: memoizedGetValues,
                          watch: memoizedWatch,
                          handleSubmit: memoizedHandleSubmit,
                          setError: memoizedSetError,
                          errors: memoizedErrors,
                        }}
                        other_details_form_schema={
                          // schema_obj.other_accordion
                          other_details_form_schemaKey
                        }
                        saveFunction={() => saveAsDraftFunction()}
                      />
                    </AccordionPanel>
                  </Box>
                </>
              )}
            </AccordionItem>

            <AccordionItem mt="20px">
              {({ isExpanded }) => (
                <>
                  <Box>
                    <AccordionButton bg="white" p="4" borderRadius={10}>
                      <Box
                        fontWeight="bold"
                        as="span"
                        flex="1"
                        textAlign="left"
                      >
                        Inspection Related Details
                      </Box>
                      {isExpanded ? (
                        <MinusIcon fontSize="12px" />
                      ) : (
                        <AddIcon fontSize="12px" />
                      )}
                    </AccordionButton>
                    <AccordionPanel bg="white" mt="5" pb={4} py="4" px="8">
                      <InspectionInspectorRelatedDetails
                        mainFormsMethod={{
                          // register,
                          // setValue,
                          // getValues,
                          // watch,
                          // handleSubmit,
                          // setError,
                          // errors,
                          register: memoizedRegister,
                          setValue: memoizedSetValue,
                          getValues: memoizedGetValues,
                          watch: memoizedWatch,
                          handleSubmit: memoizedHandleSubmit,
                          setError: memoizedSetError,
                          errors: memoizedErrors,
                        }}
                        inspection_inspector_related_details_form_schema={
                          // schema_obj.seventh_accordion
                          inspection_inspector_related_details_form_schemaKey
                        }
                        saveFunction={() => saveAsDraftFunction()}
                      />
                    </AccordionPanel>
                  </Box>
                </>
              )}
            </AccordionItem>

            {/* </MotionSlideUp> */}

            {Number(saveData?.status?.status_code || 0) > 0 ? (
              <Box bg="white" borderRadius="10px" p="20px" mt="20px">
                {Number(saveData?.status?.status_code || 0) > 0 ? (
                  <>
                    <Grid
                      textAlign="right"
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">Maker name</Text>{" "}
                      </GridItem>

                      <GridItem colSpan={{ base: 1 }}>
                        <Box>
                          <Input
                            type="text"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            isDisabled={true}
                            value={saveData?.l1_user?.employee_name}
                            //value={inputValue}
                            //  onChange={onChange}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            //  isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Maker name"
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
                            type="tel"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            isDisabled={true}
                            borderRadius={"lg"}
                            value={saveData?.l1_user?.phone}
                            //value={inputValue}
                            //  onChange={onChange}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            //  isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Maker mobile no"
                          />
                        </Box>
                      </GridItem>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
                {Number(saveData?.status?.status_code || 0) > 2 ? (
                  <>
                    <Grid
                      textAlign="right"
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
                            type="text"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            isDisabled={true}
                            borderRadius={"lg"}
                            value={saveData?.l2_user?.employee_name}
                            //value={inputValue}
                            //  onChange={onChange}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            //  isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Checker name"
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
                            type="text"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            isDisabled={true}
                            value={saveData?.l2_user?.phone}
                            //value={inputValue}
                            //  onChange={onChange}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            //  isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Checker mobile no"
                          />
                        </Box>
                      </GridItem>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
                {Number(saveData?.status?.status_code || 0) > 5 ? (
                  <>
                    <Grid
                      textAlign="right"
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
                            type="text"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            value={saveData?.l3_user?.employee_name}
                            borderRadius={"lg"}
                            //value={inputValue}
                            //  onChange={onChange}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Reviewer name"
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
                            type="text"
                            border="1px"
                            borderColor="gray.10"
                            backgroundColor={"white"}
                            height={"15px "}
                            borderRadius={"lg"}
                            value={saveData?.l2_user?.phone}
                            //value={inputValue}
                            //  onChange={onChange}
                            _placeholder={commonStyle._placeholder}
                            _hover={commonStyle._hover}
                            _focus={commonStyle._focus}
                            isDisabled={true}
                            p={{ base: "4" }}
                            fontWeight={{ base: "normal" }}
                            fontStyle={"normal"}
                            placeholder="Reviewer mobile no"
                          />
                        </Box>
                      </GridItem>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
                {Number(saveData?.status?.status_code || 0) === 2 ||
                Number(saveData?.status?.status_code || 0) === 5 ||
                Number(saveData?.status?.status_code || 0) === 8 ? (
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
                          borderColor={rejectError ? "red" : "gray.10"}
                          backgroundColor={"white"}
                          height={"15px "}
                          borderRadius={"lg"}
                          onChange={(e) => {
                            setRejectReason(e.target.value);
                          }}
                          isDisabled={
                            getValues("form_edit") === true ? true : false
                          }
                          _placeholder={commonStyle._placeholder}
                          _hover={commonStyle._hover}
                          _focus={commonStyle._focus}
                          p={{ base: "4" }}
                          fontWeight={{ base: "normal" }}
                          fontStyle={"normal"}
                          placeholder="Reason for rejection"
                        />
                      </Box>
                    </GridItem>
                  </Grid>
                ) : (
                  <></>
                )}
              </Box>
            ) : (
              <></>
            )}

            <Box display="flex" gap="10px" justifyContent="flex-end" mt="20px">
              {Number(saveData?.status?.status_code || 0) === 1 ||
              Number(saveData?.status?.status_code || 0) === 3 ||
              Number(saveData?.status?.status_code || 0) === 6 ? (
                <Button
                  type="button"
                  // type="submit"
                  //w="full"
                  backgroundColor={"primary.700"}
                  _hover={{ backgroundColor: "primary.700" }}
                  color={"white"}
                  borderRadius={"full"}
                  // isDisabled={getValues("form_edit") === true ? true : false}
                  isLoading={updateInspectionMasterApiIsLoading}
                  onClick={() => {
                    assignToMeFunction();
                  }}
                  px={"10"}
                >
                  Assign to me
                </Button>
              ) : (
                <></>
              )}

              {Number(saveData?.status?.status_code || 0) === 2 ||
              Number(saveData?.status?.status_code || 0) === 5 ||
              Number(saveData?.status?.status_code || 0) === 8 ? (
                <>
                  <Button
                    type="button"
                    // type="submit"
                    //w="full"
                    backgroundColor={"white"}
                    _hover={{ backgroundColor: "white" }}
                    color={"#F82F2F"}
                    borderRadius={"full"}
                    isDisabled={getValues("form_edit") === true ? true : false}
                    border="1px solid #F82F2F"
                    isLoading={updateInspectionMasterApiIsLoading}
                    onClick={() => {
                      if (rejectReason?.length > 0) {
                        rejectedToMeFunction();
                        setRejectError(false);
                      } else {
                        setRejectError(true);
                      }
                    }}
                    px={"10"}
                  >
                    Reject
                  </Button>
                  <Button
                    // type="button"
                    type="submit"
                    //w="full"
                    backgroundColor={"primary.700"}
                    _hover={{ backgroundColor: "primary.700" }}
                    color={"white"}
                    isDisabled={getValues("form_edit") === true ? true : false}
                    borderRadius={"full"}
                    isLoading={updateInspectionMasterApiIsLoading}
                    // onClick={() => {
                    //   approvedToMeFunction();
                    // }}
                    px={"10"}
                  >
                    Approve
                  </Button>
                </>
              ) : (
                <></>
              )}

              {saveData?.status === null ? (
                <Button
                  type="button"
                  // type="submit"
                  //w="full"
                  backgroundColor={"primary.700"}
                  _hover={{ backgroundColor: "primary.700" }}
                  color={"white"}
                  // isDisabled={getValues("form_edit") === true ? true : false}
                  borderRadius={"full"}
                  isLoading={updateInspectionMasterApiIsLoading}
                  onClick={() => {
                    assignToMeFunction();
                  }}
                  px={"10"}
                >
                  Assign to me
                </Button>
              ) : Number(saveData?.status?.status_code || 0) < 1 ? (
                <Button
                  type="submit"
                  // type="submit"
                  //w="full"
                  backgroundColor={"primary.700"}
                  _hover={{ backgroundColor: "primary.700" }}
                  color={"white"}
                  isDisabled={getValues("form_edit") === true ? true : false}
                  borderRadius={"full"}
                  isLoading={addInspectionMasterApiIsLoading}
                  px={"10"}
                  mb="20px"
                >
                  Submit
                </Button>
              ) : (
                <></>
              )}
            </Box>
          </form>
        </Accordion>
      </Box>
    </Box>
  );
});

export default ReInspectionStandard;
