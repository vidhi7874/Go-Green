/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
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
import { FormProvider, appendErrors, useForm } from "react-hook-form";
import * as yup from "yup";
import {
  useAddWareHouseOwnerTypeMutation,
  useGetOwnerTypeMutation,
  // eslint-disable-next-line
  useGetWareHouseTypeMutation,
  useGetWareOwnerDocTypeMutation,
  useUpdateWareHouseOwnerTypeMutation,
  useGetWareHouseOwnerTypeByIdMutation,
  useWarehouseOwnerMasterCheckPanNumberMutation,
} from "../../features/master-api-slice";

import { schema } from "./fields";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import ReactSelect from "react-select";
import { BiEditAlt } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { useFetchLocationDrillDownFreeMutation } from "../../features/warehouse-proposal.slice";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
// import CustomFileInput from "../../components/Elements/CustomFileInput";
import FileUploadCmp from "../../components/Elements/FileUploadCmp";
import DownloadFileFromUrl from "../../components/DownloadFileFromUrl";
import CustomSwitch from "../../components/Elements/CustomSwitch";
import { isValidAadhaarNumber } from "../../services/common.service";
import ROUTE_PATH from "../../constants/ROUTE";
import { panValidationMessage } from "../../services/validation.service";
import moment from "moment";

// Function to check if the obj's doc_type already exists in kyc
function isDocTypeAlreadyExists(obj, kycArray) {
  for (let i = 0; i < kycArray.length; i++) {
    if (kycArray[i].doc_type?.value === obj.doc_type.value) {
      return true; // doc_type already exists
    }
  }
  return false; // doc_type does not exist.
}

// Css code Start
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

const AddEditWareHouseOwnerMaster = () => {
  const [selectBoxOptions, setSelectBoxOptions] = useState({
    regions: [],
    substate: [],
    districts: [],
    states: [],
    areas: [],
  });
  const [editAndDeleteIconsEnabled, setEditAndDeleteIconsEnabled] =
    useState(true);

  const [warehouseMappingEditState, setWarehouseMappingEditState] = useState({
    isEdit: false,
    index: null,
  });

  const [warehouseMappingDataError, setWarehouseMappingDataError] =
    useState("");
  const [warehouseMappingData, setWarehouseMappingData] = useState([]);
  const [disabledField, setDisabledField] = useState(true);
  const [disabledAllField, setDisabledAllField] = useState(true);
  // eslint-disable-next-line
  const [clearFileName, setClearFileName] = useState(false);
  const [defaultPanCardDetails, setDefaultPanCardDetails] = useState({});
  const [kycDetailsList, setKycDetailsList] = useState([]);
  const [documentNamesOptions, setDocumentNamesOptions] = useState([]);
  const [getDoctypeQueryParams, setGetDoctypeQueryParams] = useState([]);
  const [documentTypesOptions, setDocumentTypesOptions] = useState([]);
  const [mandatoryDocument, setMandatoryDocument] = useState([]);
  // eslint-disable-next-line
  const [kyc, setKyc] = useState([]);
  // eslint-disable-next-line
  const [isKycFormDirty, setIsKycFormDirty] = useState(false);
  const [isShowCheckPanBtn, setIsShowCheckPanBtn] = useState(false);
  const [isDisabledPanNumberField, setIsDisabledPanNumberField] =
    useState(false);
  const [viewForm, setViewForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const {
    setValue,
    register,
    getValues,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = methods;
  const [isKycEditState, setIsKycEditState] = useState({
    isEdit: false,
    index: null,
  });

  const [
    getWareHouseOwnerTypeById,
    // eslint-disable-next-line
    { isLoading: getWareHouseOwnerTypeByIdApiIsLoading },
  ] = useGetWareHouseOwnerTypeByIdMutation();

  const [
    updateWareHouseOwnerType,
    { isLoading: updateWareHouseOwnerTypeApiIsLoading },
  ] = useUpdateWareHouseOwnerTypeMutation();

  const [
    warehouseOwnerMasterCheckPanNumber,
    { isLoading: warehouseOwnerMasterCheckPanNumberApiIsLoading },
  ] = useWarehouseOwnerMasterCheckPanNumberMutation();
  // eslint-disable-next-line
  const [getOwnerDocType, { isLoading: updateWareHouseTypefdsApiIsLoading }] =
    useGetWareOwnerDocTypeMutation();

  const [getOwnerType, { isLoading: getOwnerTypeApiIsLoading }] =
    useGetOwnerTypeMutation();

  const [
    fetchLocationDrillDown,
    { isLoading: fetchLocationDrillDownApiIsLoading },
  ] = useFetchLocationDrillDownFreeMutation();

  const [
    addWareHouseOwnerType,
    { isLoading: addWareHouseOwnerTypeApiIsLoading },
  ] = useAddWareHouseOwnerTypeMutation();

  const details = location?.state?.details;

  const initialIsActive = details ? details.is_active : true;
  console.log(details?.id);

  // css Code End

  // Form Submit Function Start
  const onSubmit = (data) => {
    console.log("data==>", data);
    console.log("kycDetailsList #####", kycDetailsList);

    console.log("9537642005".split("+91")[1]);
    console.log("+919537642005".split("+91")[1]);
    console.log(getValues("alternate_mobile_no"));
    let no = getValues("alternate_mobile_no")?.split("+91");
    console.log(no);
    console.log(getValues("alternate_mobile_no")?.split("+91")[0]);
    console.log(getValues("alternate_mobile_no")?.split("+91")[1]);

    console.log("mandatoryDocument", mandatoryDocument);
    const requiredDocumentLabels = [
      "Identity Proof - Pan Card",
      "Bank Documents",
    ];

    const missingDocuments = requiredDocumentLabels.filter(
      (label) =>
        !kycDetailsList.some((kycDoc) => kycDoc?.doc_type?.label === label)
    );

    console.log("missingDocuments", missingDocuments);

    if (missingDocuments.length > 0) {
      const errorMessage = `The following mandatory documents have not been uploaded: ${missingDocuments.join(
        ", "
      )}`;
      showToastByStatusCode(400, errorMessage);
      return;
    }

    console.log("missingDocuments", missingDocuments);

    if (missingDocuments?.length > 0) {
      const errorMessage = `The following mandatory documents have not been uploaded: ${missingDocuments.join(
        ", "
      )}`;
      showToastByStatusCode(400, errorMessage);
      return;
    }

    // let warehouse_owner_mapping = {
    //   account_holder_name: data?.account_holder_name,
    //   account_number: data?.account_number,
    //   ifsc_code: data?.ifsc_code,
    // };

    let warehouse_owner_mapping = warehouseMappingData?.map((el) => {
      return {
        id: el?.id,
        account_holder_name: el?.account_holder_name,
        account_number: el?.account_number,
        ifsc_code: el?.ifsc_code,
      };
    });

    console.log(kycDetailsList);

    const PAN_NUMBER = getValues("pan_card");

    let pan_obj = kycDetailsList.filter(
      (el) =>
        el.owner_type_doc?.label.toLowerCase() === "Pan Card".toLowerCase()
    )[0];

    console.log(pan_obj);
    console.log(pan_obj?.document_number);
    console.log(PAN_NUMBER);
    if (pan_obj?.document_number.trim() !== PAN_NUMBER.trim()) {
      showToastByStatusCode(
        400,
        "Please Enter Same pan card number  in 'Check pan card' field and in 'kyc details'."
      );
      return false;
    }

    let kyc_arr = kycDetailsList.map((el) => ({
      owner_type_doc: el?.owner_type_doc?.value,
      document_number: el?.document_number,
      document_path: el?.document_path,
      id: el?.id,
    }));

    let pan_number =
      kycDetailsList?.filter(
        (el) => el?.document_type?.label === "Identity Proof - Pan Card"
      )[0] || "";

    // check warehouse wise bank details
    const emptyData = warehouseMappingData.filter(
      (el) => !el.account_holder_name || !el.account_number || !el?.ifsc_code
    );

    console.log(emptyData);

    if (emptyData.length > 0) {
      setWarehouseMappingDataError("Add Bank Details For All Warehouse");
      return false;
    } else {
      setWarehouseMappingDataError("");
    }

    if (details?.id) {
      updateData({
        ...data,
        id: details.id,
        owner_type: data?.owner_type?.id || data?.owner_type?.value,
        identity_card_number: pan_number?.document_no,
        warehouse_owner_contact_no: `+91${data?.warehouse_owner_contact_no}`,
        alternate_mobile_no:
          getValues("alternate_mobile_no")?.split("+91")[1] === undefined
            ? `+91${data?.alternate_mobile_no}`
            : data?.alternate_mobile_no,

        kyc: kyc_arr,

        warehouse_owner_mapping: warehouse_owner_mapping,
      });
    } else {
      addData({
        ...data,
        warehouse_owner_contact_no: `+91${data?.warehouse_owner_contact_no}`,
        alternate_mobile_no: `+91${data?.alternate_mobile_no}`,
        kyc: kyc_arr,
        warehouse_owner_mapping: warehouse_owner_mapping,
      });
    }
  };

  // Form Submit Function End

  // Form Clear Function Start

  const clearForm = () => {
    const defaultValues = methods.getValues();
    Object.keys(defaultValues).forEach((key) => {
      setValue(key, "", {
        shouldValidate: true,
      });
    });
    // Clear table details
    setKycDetailsList([]);
    // setIsClear(true); // Update isClear state to true
  };

  // Form Clear Function End

  // Owner Function Start

  const checkPanNUmber = async () => {
    const isValidPAN = (value) => {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
      return panRegex.test(value);
    };
    try {
      let query = {
        pan_no: getValues("pan_card").trim(),
        warehouse_owner_id: details?.id,
      };
      console.log("query -->", query);

      // Validate the PAN card number using the Yup schema
      const isValid = await isValidPAN(query?.pan_no);
      console.log(isValid);
      if (isValid) {
        const response = await warehouseOwnerMasterCheckPanNumber(
          query
        ).unwrap();
        setDisabledAllField(false);

        console.log("res --->", response);
        console.log("res --->", response?.data?.warehouse_owner_mapping);
        if (
          response?.status === 200 &&
          response?.message === "PAN Card Not Found"
        ) {
          // Enable the edit and delete icons
          setEditAndDeleteIconsEnabled(true);
        } else {
          // Disable the edit and delete icons
          setEditAndDeleteIconsEnabled(false);
        }
        if (
          response?.status === 200 &&
          response.message !== "PAN Card Not Found"
        ) {
          setDisabledField(true);
          setIsDisabledPanNumberField(true);

          const arr = createWarehouseMappingData(
            response?.data?.warehouse_owner_mapping
          );

          console.log("array -->", arr);
          setWarehouseMappingData((prev) => [...prev, ...arr]);

          console.log("done");

          let warehouse_owner_mapping =
            response?.data?.warehouse_owner_mapping[0] || {};

          let bank_details_obj = {
            warehouse_owner_name: response?.data?.warehouse_owner_name,
            alternate_mobile_no:
              response?.data?.alternate_mobile_no?.split("+91")[1] || "",
            warehouse_owner_contact_no:
              response?.data?.warehouse_owner_contact_no?.split("+91")[1] || "",

            // alternate_mobile_no: response?.data?.alternate_mobile_no,
            email_id: response?.data?.email_id,
            warehouse_owner_address: response?.data?.warehouse_owner_address,
            //account_holder_name: warehouse_owner_mapping?.account_holder_name,
            //  account_number: warehouse_owner_mapping?.account_number,
            //  ifsc_code: warehouse_owner_mapping?.ifsc_code,
            owner_type: {
              label: response?.data?.owner_type?.type_name,
              value: response?.data?.owner_type?.id,
            },
          };

          Object.keys(bank_details_obj).forEach(function (key) {
            methods.setValue(key, bank_details_obj[key], {
              shouldValidate: true,
            });
          });

          console.log(response?.data);

          let kyc_arr = response?.data?.kyc?.map((el) => ({
            doc_type: {
              label: el?.owner_type_doc?.group_name,
              value: el?.owner_type_doc?.group_id,
            },
            owner_type_doc: {
              label: el?.owner_type_doc?.document_name,
              value: el?.owner_type_doc?.id,
            },
            document_number: el?.document_number,
            document_path: el?.document_path,
            id: el?.id,
          }));

          console.log(kyc_arr);

          setKycDetailsList(kyc_arr || []);
        } else {
          setDisabledField(false);
          showToastByStatusCode(400, response?.message);
        }
        clearErrors("pan_card");
      } else {
        setError("pan_card", {
          type: "manual",
          message: getValues("pan_card") === "" ? "" : panValidationMessage(), // You can customize the error message here
        });
      }
    } catch (error) {
      clearErrors("pan_card");
      showToastByStatusCode(400, error?.data?.message);
    }
  };

  const getOwnerTypeMasterList = async () => {
    try {
      const response = await getOwnerType().unwrap();
      console.log("getOwnerTypeMasterList:", response);
      setSelectBoxOptions((prev) => ({
        ...prev,
        type: response?.data?.map(({ type_name, id }) => ({
          label: type_name,
          value: id,
        })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAllKycDocTypes = async (url) => {
    if (getDoctypeQueryParams && getDoctypeQueryParams.length > 0) {
      try {
        console.log("query params url -->", url);
        // '?filter=client_type&client_type=1&client_type=undefined'
        console.log(url);

        const response = await getOwnerDocType(url).unwrap();
        console.log(response);
        if (response.status === 200) {
          const uniqueGroupNames = [
            ...new Set(
              response?.data.group.map((item) => ({
                label: item?.group_name,
                value: item?.group_id,
                is_required: item?.is_required,
              }))
            ),
          ];

          let doc_names = [
            ...new Set(
              response?.data.document.map((item) => {
                return {
                  label: item.document_name,
                  value: item.id,
                  //isDisabled: item?.document_name?.toLowerCase() === "pan card",
                };
              })
            ),
          ];

          console.log(uniqueGroupNames);

          let requiredDocList = uniqueGroupNames
            .filter((el) => el.is_required)
            .map((item) => item.label);
          console.log("requiredDocList -->", requiredDocList);
          setMandatoryDocument(requiredDocList);

          setDocumentTypesOptions(uniqueGroupNames);

          setDocumentNamesOptions(doc_names);
          return {
            uniqueGroupNames,
            doc_names,
          };
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const defaultPanCardDetailsForKyc = async (value) => {
    let query = `?filter=owner_type&filter=document_name&filter=group_id&document_name=pan&owner_type=individual&group_id=1`;

    const response = await getOwnerDocType(query).unwrap();

    let doc_type_obj = response?.data?.document?.filter(
      (el) => el.document_name.trim().toLowerCase() === "pan card"
    )[0];

    let obj = {
      owner_type_doc:
        { label: doc_type_obj.document_name, value: doc_type_obj.id } || "",
      document_number: value?.pan_card || "",
      document_path: value?.pan_document_path || "",
    };

    setDefaultPanCardDetails(obj);
    setKycDetailsList([obj]);

    console.log("obj ==> ", obj);
  };

  React.useEffect(() => {
    const subscription = watch(async (value, { name, type }) => {
      console.log("value -----> ", value);
      console.log(name);
      console.log(type);

      if (name === "owner_type" && value?.owner_type?.label) {
        setGetDoctypeQueryParams((prev) => [
          ...prev,
          {
            filter: "owner_type",
            owner_type: value?.owner_type?.label,
          },
        ]);
      }

      if (name === "doc_type" && value?.doc_type?.value) {
        setGetDoctypeQueryParams([
          {
            filter: "owner_type",
            owner_type: value?.owner_type?.label,
          },
          {
            filter: "group_id",
            group_id: value?.doc_type?.value,
          },
        ]);
      }

      if (name === "pan_document_path") {
        defaultPanCardDetailsForKyc(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    console.log("getDoctypeQueryParams", getDoctypeQueryParams);
    if (getDoctypeQueryParams.length > 0) {
      let queryParams = [];

      if (getDoctypeQueryParams.length === 0) return;
      getDoctypeQueryParams.forEach((item) => {
        if (item[item.filter] !== undefined) {
          queryParams.push(`filter=${item.filter}`);
          queryParams.push(`${item.filter}=${item[item.filter]}`);
        }
      });

      queryParams = Array.from(new Set(queryParams));
      console.log(queryParams);

      const url = `?${queryParams.join("&")}`;

      console.log(url);
      console.log("queryParams ######", getDoctypeQueryParams);
      console.log("queryString ######", queryParams);
      // '?filter=client_type&client_type=1'
      getAllKycDocTypes(url);
    }
  }, [getDoctypeQueryParams]);

  useEffect(() => {
    getOwnerTypeMasterList();
  }, []);

  // eslint-disable-next-line
  // ! un used state commmented
  // const [panCardError, setPanCardError] = useState("");

  const isValidPAN = (value) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    return panRegex.test(value);
  };

  // getWareHouseOwnerTypeById;

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
      console.log("fetchLocationDrillDown response :", response);

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
      console.log("fetchLocationDrillDown response :", response);

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
    console.log("value --> ", val);
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
      console.log("fetchLocationDrillDown response :", response);

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
    console.log("value --> ", val);
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
      console.log("fetchLocationDrillDown response :", response);

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

  useEffect(() => {
    //  getRegionMasterList();
  }, []);

  // Location Drill Down Function End

  const fetchWareHouseOwnerTypeById = async (id) => {
    try {
      const response = await getWareHouseOwnerTypeById(id).unwrap();
      console.log("add warehouse owner type master res", response);
      if (response.status === 200) {
        console.log("done");
        return response?.data;
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };

  // Add warehouseOwner Api Start

  const addData = async (data) => {
    try {
      const response = await addWareHouseOwnerType(data).unwrap();
      console.log("add warehouse owner type master res", response);
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_OWNER}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };

  // Add warehouseOwner Api End

  // Update Area Api Start

  const updateData = async (data) => {
    try {
      const response = await updateWareHouseOwnerType(data).unwrap();
      if (response.status === 200) {
        console.log("update warehouse owner type master res", response);
        toasterAlert(response);
        showToastByStatusCode(200, response?.message);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_OWNER}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };

  // Update Area Api End

  // KYC Logic start
  // eslint-disable-next-line
  const [kycDetail, setKycDetail] = useState({
    doc_type: "",
    owner_type_doc: "",
    document_number: "",
    document_path: "",
  });
  // eslint-disable-next-line

  // const [updateKycFlag, setUpdateKycFlag] = useState(null);

  const warehouseOwnerRemove = (index) => {
    let indexToRemove = index;

    if (indexToRemove >= 0 && indexToRemove < kycDetailsList.length) {
      // eslint-disable-next-line
      let x = kycDetailsList.splice(indexToRemove, 1);
      setKycDetailsList([...kycDetailsList]);
    }
  };

  const clearKycFormError = () => {
    clearErrors([
      "doc_type",
      "owner_type_doc",
      "document_number",
      "document_path",
    ]);
  };

  const AddUpdateKycDetails = async () => {
    let data = getValues();
    console.log(data);

    if (
      data?.doc_type?.label?.trim().toLowerCase() ===
      "Identity Proof - Pan Card".trim().toLowerCase()
    ) {
      if (data?.document_number) {
        let isValid = isValidPAN(data?.document_number.trim());
        if (isValid) {
          clearErrors("document_number");
        } else {
          setError("document_number", {
            type: "manual",
            message: panValidationMessage(),
          });
          return false;
        }
      }
    }

    // check Addhar card number is valid or not

    if (
      data?.doc_type?.label?.trim().toLowerCase() ===
        "Identity Proof".toLowerCase() ||
      data?.doc_type?.label?.trim().toLowerCase() ===
        "AUTHORIZED PERSON ID PROOF".trim().toLowerCase()
    ) {
      if (data?.document_number) {
        const isValid = await isValidAadhaarNumber(
          data?.document_number.trim()
        );
        console.log(isValid);
        if (isValid) {
          clearErrors("document_number");
        } else {
          setError("document_number", {
            type: "manual",
            message: "Invalid Aadhaar Card Number",
          });
          return false;
        }
      }
    }

    let kycDetail = {
      doc_type: documentTypesOptions?.filter(
        (type) => type.value === data?.doc_type?.value
      )[0],
      owner_type_doc: documentNamesOptions?.filter(
        (type) => type.value === data?.owner_type_doc?.value
      )[0],
      document_number: data?.document_number?.trim() || null,
      document_path: data?.document_path,
    };

    console.log("kycDetail on edit time ==>", kycDetail);

    try {
      validateWarehouseOwnerMasterKYCFormData(kycDetail);
      console.log("Data is valid.");
      clearKycFormError();
    } catch (validationErrors) {
      clearKycFormError();
      Object.keys(validationErrors).forEach((key) => {
        setError(key, {
          type: "manual",
          message: validationErrors[key] || "",
        });
      });
      return false;
    }

    console.log(data);

    // Handle form submission here if all required fields are filled
    if (!errors.doc_type && !errors.owner_type_doc && !errors.document_path) {
      // Perform your submission logic here
    }
    console.log("isKycEditState ------>", isKycEditState);

    if (data.doc_type && data.owner_type_doc && data.document_path) {
      const copy_kycDetails = [...kycDetailsList];

      console.log("kycDetail ----> ", kycDetail);
      console.log("kycDetailsList ---> ", kycDetailsList);

      const isEditing = isKycEditState?.isEdit;
      const editedIndex = isKycEditState?.index;
      const editedDataId = isKycEditState?.editedDataId;

      const docTypeExistsInMainKyc = isDocTypeAlreadyExists(
        kycDetail,
        kycDetailsList
      );
      const docTypeExistsInCopyKyc = isDocTypeAlreadyExists(
        kycDetail,
        copy_kycDetails
      );

      if (
        isEditing &&
        editedIndex >= 0 &&
        editedIndex < kycDetailsList.length
      ) {
        // In edit mode and the edited index exists
        if (docTypeExistsInMainKyc) {
          if (
            kycDetailsList[editedIndex].doc_type.value ===
            kycDetail.doc_type.value
          ) {
            kycDetail["id"] = editedDataId;
            // The doc_type remains the same, update the existing entry in the main kyc array
            const updatedKyc = [...kycDetailsList];
            updatedKyc[editedIndex] = kycDetail;

            setKycDetailsList(updatedKyc);
          } else {
            // The doc_type has changed, check if it exists in the copy array
            if (docTypeExistsInCopyKyc) {
              showToastByStatusCode(400, "Document type already exists in KYC");
            } else {
              kycDetail["id"] = editedDataId;
              // Update the existing entry in the main kyc array with the new doc_type
              const updatedKyc = [...kycDetailsList];
              updatedKyc[editedIndex] = kycDetail;
              setKycDetailsList(updatedKyc);
            }
          }
        } else {
          showToastByStatusCode(400, "Document type not found in KYC");
        }
      } else {
        // Not in edit mode or index is out of bounds
        if (docTypeExistsInCopyKyc) {
          showToastByStatusCode(400, "Document type already exists in KYC");
        } else {
          setKycDetailsList([...kycDetailsList, kycDetail]);
        }
      }

      setIsKycEditState({
        isEdit: false,
        index: null,
        editedDataId: null,
      });

      clearKycForm();

      console.log(getValues("owner_type"), "owner_type");

      setGetDoctypeQueryParams([
        {
          filter: "owner_type",
          owner_type: getValues("owner_type").label,
        },
      ]);
      setClearFileName(true);
    }

    // ------------------------------------------------------------
    // console.log(kycDetail);
    // if (JSON.stringify(kycDetail) === "{}") {
    //   setIsKycEditState(false);
    // } else {
    //   const isEditing = isKycEditState?.isEdit;
    //   const editedIndex = isKycEditState?.index;
    //   // Create a copy of the KYC details
    //   const copy_kycDetails = [...kyc];

    //   // Check if the document type already exists
    //   const docTypeExistsInMainKyc = isDocTypeAlreadyExists(kycDetail, kyc);
    //   const docTypeExistsInCopyKyc = isDocTypeAlreadyExists(
    //     kycDetail,
    //     copy_kycDetails
    //   );

    //   if (isEditing && editedIndex >= 0 && editedIndex < kyc.length) {
    //     // In edit mode and the edited index exists
    //     if (docTypeExistsInMainKyc) {
    //       if (kyc[editedIndex].doc_type === kycDetail.doc_type) {
    //         // The doc_type remains the same, update the existing entry in the main kyc array
    //         const updatedKyc = [...kyc];
    //         updatedKyc[editedIndex] = kycDetail;
    //         setIsKycFormDirty(false);
    //         setKyc(updatedKyc);
    //       } else {
    //         // The doc_type has changed, check if it exists in the copy array
    //         if (docTypeExistsInCopyKyc) {
    //           alert("Document type already exists in KYC.");
    //         } else {
    //           // Update the existing entry in the main kyc array with the new doc_type
    //           const updatedKyc = [...kyc];
    //           updatedKyc[editedIndex] = kycDetail;
    //           setIsKycFormDirty(false);
    //           setKyc(updatedKyc);
    //         }
    //       }
    //     } else {
    //       alert("Document type not found in KYC.");
    //     }
    //   } else {
    //     // Not in edit mode or index is out of bounds
    //     if (docTypeExistsInCopyKyc) {
    //       alert("Document type already exists in KYC.");
    //     } else {
    //       // Add the new KYC detail to the main kyc array
    //       setIsKycFormDirty(false);
    //       setKyc([...kyc, kycDetail]);
    //     }
    //   }

    //   console.log("copy_kycDetail", copy_kycDetails);

    //   // Reset the edit state and clear the KYC detail object
    //   setIsKycEditState({ isEdit: false, index: null });
    //   setKycDetail({
    //     doc_type: "",
    //     owner_type_doc: "",
    //     document_number: "",
    //     document_path: "",
    //   });
    // }
  };

  console.log("errors -->", errors);

  const clearKycForm = () => {
    setValue("doc_type", "", {
      shouldValidate: false,
    });
    setValue("owner_type_doc", "", {
      shouldValidate: false,
    });
    setValue("document_number", "", {
      shouldValidate: false,
    });
    setValue("document_path", "", {
      shouldValidate: false,
    });
  };

  const onChangeWarehouseOwnerType = (val) => {
    console.log(val);
    console.log(getValues("owner_type"));
    setGetDoctypeQueryParams([]);
    setValue("owner_type", val, {
      shouldValidate: true,
    });
    if (Object.keys(defaultPanCardDetails).length !== 0) {
      setKycDetailsList([defaultPanCardDetails]);
    } else {
      setKycDetailsList([]);
    }

    clearKycForm();
    setIsKycEditState({
      isEdit: false,
      index: null,
    });
    // setKycDetail((old) => ({
    //   ...old,
    //   owner_type: val,
    // }));
    // setKycDetail({
    //   doc_type: "",
    //   owner_type_doc: "",
    //   document_number: "",
    //   document_path: "",
    // });
    // setKyc([]);
  };

  const warehouseOwnerOnEdit = (item, ind) => {
    console.log(item, ind);
    Object.keys(item).forEach((fieldName) => {
      console.log(fieldName);
      console.log(item[fieldName]);
      if (item[fieldName] !== undefined) {
        setValue(fieldName, item[fieldName], {
          shouldValidate: false,
        });
      }
    });
    setIsKycEditState({
      isEdit: true,
      index: ind,
      editedDataId: item?.id,
    });
    // setKycDetail(obj);
  };

  const editWarehouseMappingDetails = (item, index) => {
    console.log("dfdf");

    setWarehouseMappingEditState({
      isEdit: true,
      index: index,
    });

    const formData = {
      warehouse_name: item?.warehouse_name,
      account_holder_name: item?.account_holder_name,
      account_number: item?.account_number,
      ifsc_code: item?.ifsc_code,
    };

    Object.keys(formData).forEach((key) => {
      setValue(key, formData[key], {
        shouldValidate: false,
      });
    });
  };

  const updateWarehouseMappingDetails = () => {
    const { warehouse_name, account_holder_name, account_number, ifsc_code } =
      getValues();

    const { isEdit, index } = warehouseMappingEditState;
    const formData = {
      warehouse_name,
      account_holder_name,
      account_number,
      ifsc_code,
    };

    try {
      const isValid = validateWarehouseMappingFormData(formData);
      console.log("Data is valid.");

      const updatedWarehouseMappingData = [...warehouseMappingData];
      if (isEdit && index >= 0 && index < updatedWarehouseMappingData.length) {
        updatedWarehouseMappingData[index] = {
          ...updatedWarehouseMappingData[index],
          ...formData,
        };
      }
      console.log(updatedWarehouseMappingData);
      setWarehouseMappingData(updatedWarehouseMappingData);

      console.log("formData", formData);

      clearErrors([
        "warehouse_name",
        "account_holder_name",
        "account_number",
        "ifsc_code",
      ]);
      Object.keys(formData).forEach((key) => {
        setValue(key, "", {
          shouldValidate: false,
        });
      });

      setWarehouseMappingEditState({
        isEdit: false,
        index: null,
      });
    } catch (validationErrors) {
      Object.keys(validationErrors).forEach((key) => {
        setError(key, {
          type: "manual",
          message: validationErrors[key] || "",
        });
      });
      return false;
    }
  };

  // ! commented un-used function..

  // const handleDownloadClick = () => {
  //   // Create a CSV string from the table data
  //   const csvData = kycDetailsList
  //     .map((item, index) => {
  //       return [
  //         index + 1,
  //         item.doc_type.label,
  //         item.owner_type_doc.label,
  //         item.document_number,
  //       ].join(",");
  //     })
  //     .join("\n");

  //   // Create a Blob object containing the CSV data
  //   const csvBlob = new Blob([csvData], { type: "text/csv" });

  //   // Create a download link and trigger the download
  //   const url = window.URL.createObjectURL(csvBlob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "kyc_data.csv";
  //   a.style.display = "none";
  //   document.body.appendChild(a);
  //   a.click();

  //   // Clean up
  //   window.URL.revokeObjectURL(url);
  //   document.body.removeChild(a);
  // };

  // Function to get file extension from the fileType
  // ! commented the un-used function ...
  // eslint-disable-next-line
  // const getFileExtension = (fileType) => {
  //   if (fileType === "text/csv") {
  //     return "csv";
  //   }
  //   // Add more cases as needed for other file types
  //   return "";
  // };

  const autoFieldOnEdit = async () => {
    if (details?.id) {
      const warehouse_owner_details = await fetchWareHouseOwnerTypeById(
        details?.id
      );

      const arr = createWarehouseMappingData(
        warehouse_owner_details?.warehouse_owner_mapping
      );

      console.log("array -->", arr);
      setWarehouseMappingData(arr || []);
      console.log(warehouse_owner_details?.owner_type);
      /// owner_type
      console.log("warehouse_details", warehouse_owner_details);
      // regionOnChange({ value: warehouse_owner_details?.region?.id });
      // stateOnChange({ value: warehouse_owner_details?.state?.id });
      // zoneOnChange({ value: warehouse_owner_details?.substate?.id });
      // districtOnChange({ value: warehouse_owner_details?.district?.id });

      let obj = {
        // hiring_proposal_id: details.hiring_proposal_id.id,
        // warehouse_name: warehouse_owner_details?.warehouse?.warehouse_name,
        owner_type: {
          label: warehouse_owner_details?.owner_type?.type_name,
          value: warehouse_owner_details?.owner_type?.id,
        },
        warehouse_owner_address:
          warehouse_owner_details?.warehouse_owner_address,
        warehouse_owner_contact_no:
          warehouse_owner_details?.warehouse_owner_contact_no?.split(
            "+91"
          )[1] || "",
        alternate_mobile_no:
          warehouse_owner_details?.alternate_mobile_no?.split("+91")[1] || "",
        email_id: warehouse_owner_details?.email_id,

        warehouse_owner_name: warehouse_owner_details?.warehouse_owner_name,

        // account_holder_name:
        //   warehouse_owner_details?.warehouse_owner_mapping[0]
        //     ?.account_holder_name,
        // account_number:
        //   warehouse_owner_details?.warehouse_owner_mapping[0]?.account_number,
        // ifsc_code:
        //   warehouse_owner_details?.warehouse_owner_mapping[0]?.ifsc_code,
        // region: warehouse_owner_details?.region?.id,
        // state: warehouse_owner_details?.state?.id,
        // substate: warehouse_owner_details?.substate?.id,
        // district: warehouse_owner_details?.district?.id,
        // area: warehouse_owner_details?.area?.id,
      };

      console.log(obj);

      console.log(selectBoxOptions);
      console.log("warehouse_owner_details", obj);
      console.log(warehouse_owner_details?.kyc);
      let kyc_arr = warehouse_owner_details?.kyc?.map((el) => ({
        doc_type: {
          label: el?.owner_type_doc?.group_name,
          value: el?.owner_type_doc?.group_id,
        },
        owner_type_doc: {
          label: el?.owner_type_doc?.document_name,
          value: el?.owner_type_doc?.id,
        },
        document_number: el?.document_number,
        document_path: el?.document_path,
        id: el?.id,
      }));

      let pan_card =
        kyc_arr?.filter(
          (el) => el?.doc_type?.label === "Identity Proof - Pan Card"
        )[0] || "";
      methods.setValue("pan_card", pan_card?.document_number, {
        shouldValidate: true,
      });

      if (pan_card?.document_number) {
        setDisabledAllField(false);
        setIsShowCheckPanBtn(true);
        setIsDisabledPanNumberField(true);
        setEditAndDeleteIconsEnabled(false);
      } else {
        setDisabledAllField(true);
        setIsShowCheckPanBtn(false);
        setIsDisabledPanNumberField(false);
        setEditAndDeleteIconsEnabled(true);
      }

      setKycDetailsList(kyc_arr || []);
      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }
  };

  useEffect(() => {
    console.log("details in edit -->", details);
    autoFieldOnEdit();

    setViewForm(location?.state?.view || false);

    const breadcrumbArray = [
      // {
      //   title: "Manage Warehouse",
      //   link: "/warehouse-master/warehouse-owner-master",
      // },
      {
        title: "Warehouse Owner Master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_WAREHOUSE_WAREHOUSE_OWNER}`,
      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
  }, [details]);
  // Edit Form Fill Logic End

  useEffect(() => {
    console.log("kycDetailsList", kycDetailsList);
    setIsShowCheckPanBtn(kycDetailsList?.length === 0);
  }, [kycDetailsList]);

  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
  }, []);

  return (
    <Box bg="white" borderRadius={10} p="10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
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
                {/* pan_card Card No*/}
                <Grid
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right">Pan Card No </Text>{" "}
                  </GridItem>
                  <GridItem position="relative" colSpan={{ base: 1 }}>
                    <FormControl
                      isInvalid={errors?.pan_card}
                      style={{ w: commonWidth.w }}
                    >
                      <Input
                        type="text"
                        border="1px"
                        className="pancardInput"
                        name="pan_card"
                        {...register("pan_card",{
                          setValueAs: (value) => value.toUpperCase()
                        })}
                        borderColor="gray.10"
                        backgroundColor={"white"}
                        height={"15px "}
                        borderRadius={"lg"}
                        isDisabled={viewForm ? true : isDisabledPanNumberField}
                        //value={inputValue}
                        //  onChange={onChange}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        //  isDisabled={true}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Identity Card No"
                      />
                    </FormControl>
                    {errors && errors?.pan_card?.message && (
                      <Text
                        as="small"
                        position="absolute"
                        textAlign="left"
                        color="red"
                      >
                        {errors?.pan_card?.message}
                      </Text>
                    )}
                  </GridItem>
                  {isShowCheckPanBtn && (
                    <GridItem colSpan={{ base: 1 }}>
                      <Button
                        type="button"
                        bg="#A6CE39"
                        _hover={{}}
                        color="white"
                        isLoading={
                          warehouseOwnerMasterCheckPanNumberApiIsLoading
                        }
                        isDisabled={viewForm}
                        padding="0px 20px"
                        borderRadius={"50px"}
                        onClick={() => {
                          checkPanNUmber();
                        }}
                      >
                        Check
                      </Button>
                    </GridItem>
                  )}
                </Grid>

                {/* Warehouse name*/}
                {/* <Grid
                  textAlign="right"
                  alignItems="center"
                  my="5"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right">Warehouse name</Text>{" "}
                  </GridItem>
                  <GridItem colSpan={{ base: 1 }}>
                    <FormControl style={{ w: commonWidth.w }}>
                      <Textarea
                        name="warehouse_name"
                        {...register("warehouse_name")}
                        type="text"
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
                        placeholder="Warehouse name"
                      />
                    </FormControl>
                  </GridItem>
                </Grid> */}

                {/* Warehouse Owner Name*/}
                <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right">Warehouse Owner Name</Text>{" "}
                  </GridItem>
                  <GridItem colSpan={{ base: 1 }}>
                    <FormControl style={{ w: commonWidth.w }}>
                      <Input
                        {...register("warehouse_owner_name")}
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
                        //isDisabled={disabledField}
                        isDisabled={viewForm ? true : disabledAllField}
                        placeholder="Warehouse Owner Name"
                      />
                    </FormControl>
                  </GridItem>
                </Grid>

                {/*  Warehouse owner type*/}
                <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right">Warehouse owner type</Text>{" "}
                  </GridItem>
                  <GridItem colSpan={{ base: 1 }}>
                    <FormControl style={{ w: commonWidth.w }}>
                      <ReactSelect
                        value={
                          selectBoxOptions?.type?.filter(
                            (item) =>
                              item.value === getValues("owner_type")?.value
                          )[0] || {}
                        }
                        options={selectBoxOptions.type}
                        onChange={(val) => {
                          onChangeWarehouseOwnerType(val);
                        }}
                        isLoading={getOwnerTypeApiIsLoading}
                        isDisabled={
                          viewForm
                            ? true
                            : disabledField || isDisabledPanNumberField
                        }
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            backgroundColor: "#fff",
                            borderRadius: "6px",
                            borderColor:
                              errors.owner_type || !getValues("owner_type")
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

                {/* Upload pan card */}
                {/* <Grid
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right">Upload pan card </Text>{" "}
                  </GridItem>
                  <GridItem position="relative" colSpan={{ base: 1 }}>
                    <FormControl
                      isInvalid={errors?.pan_card}
                      style={{ w: commonWidth.w }}
                    >
                      <FileUploadCmp
                        label=""
                        name="pan_document_path"
                        isError={errors?.pan_document_path}
                        type="application/pdf, image/jpeg, image/png, image/jpg"
                        placeholder="Choose a file"
                        allowedTypes={[
                          "application/pdf",
                          "image/jpeg",
                          "image/png",
                          "image/jpg",
                        ]}
                        isMultipalUpload={false}
                        fileName={getValues("pan_document_path")}
                        clearFileName={getValues("pan_document_path") === ""}
                        maxFileSize={1024 * 1024} // For example, 1MB (1024 bytes * 1024 bytes)
                        onChange={(url) => {
                          setValue("pan_document_path", url, {
                            shouldValidate: true,
                          });
                        }}
                      />
                    </FormControl>
                    {errors && errors?.pan_document_path?.message && (
                      <Text
                        as="small"
                        position="absolute"
                        textAlign="left"
                        color="red"
                      >
                        {errors?.pan_document_path?.message}
                      </Text>
                    )}
                  </GridItem>
                </Grid> */}

                {/*  Region */}
                {/* <Grid
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
                      <ReactCustomSelect
                        name="region"
                        label=""
                        selectDisable={true}
                        // selectDisable={getValues("bank") ? true : false}
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
                    </FormControl>
                  </GridItem>
                </Grid> */}

                {/*  State */}
                {/* <Grid
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
                      <ReactCustomSelect
                        name="state"
                        selectDisable={true}
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
                    </FormControl>
                  </GridItem>
                </Grid> */}

                {/*  Sub-state */}
                {/* <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right">Sub-state</Text>{" "}
                  </GridItem>
                  <GridItem colSpan={{ base: 1 }}>
                    <FormControl style={{ w: commonWidth.w }}>
                      <ReactCustomSelect
                        name="substate"
                        label=""
                        selectDisable={true}
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
                    </FormControl>
                  </GridItem>
                </Grid> */}

                {/* District*/}
                {/* <Grid
                  textAlign="right"a
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
                      <ReactCustomSelect
                        name="district"
                        label=""
                        selectDisable={true}
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
                    </FormControl>
                  </GridItem>
                </Grid> */}

                {/*  Area*/}
                {/* <Grid
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
                      <ReactCustomSelect
                        name="area"
                        label=""
                        selectDisable={true}
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
                    </FormControl>
                  </GridItem>
                </Grid> */}

                {/* warehouse owner Address*/}
                <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right">Warehouse Owner Address</Text>{" "}
                  </GridItem>
                  <GridItem colSpan={{ base: 1 }}>
                    <FormControl style={{ w: commonWidth.w }}>
                      <Textarea
                        {...register("warehouse_owner_address")}
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
                        isDisabled={viewForm ? true : disabledAllField}
                        //  isDisabled={true}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="warehouse owner Address"
                      />
                    </FormControl>
                  </GridItem>
                </Grid>

                {/* Mobile no*/}
                <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right">Mobile no</Text>{" "}
                  </GridItem>
                  <GridItem colSpan={{ base: 1 }}>
                    <FormControl
                      isInvalid={errors?.warehouse_owner_contact_no}
                      style={{ w: commonWidth.w }}
                    >
                      <Input
                        name="warehouse_owner_contact_no"
                        {...register("warehouse_owner_contact_no")}
                        type="text"
                        border="1px"
                        borderColor="gray.10"
                        backgroundColor={"white"}
                        height={"15px "}
                        isDisabled={viewForm ? true : disabledAllField}
                        borderRadius={"lg"}
                        // value={
                        //   getValues("warehouse_owner_contact_no")?.split(
                        //     "+91"
                        //   )[1]
                        //     ? Number(
                        //         getValues("warehouse_owner_contact_no")?.split(
                        //           "+91"
                        //         )[1] || ""
                        //       )
                        //     : ""
                        // }
                        // onChange={(e) => {
                        //   setValue(
                        //     "warehouse_owner_contact_no",
                        //     "+91" + e.target.value,
                        //     {
                        //       shouldValidate: true,
                        //     }
                        //   );
                        // }}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        //  isDisabled={true}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Mobile no"
                      />
                    </FormControl>
                  </GridItem>
                </Grid>

                {/* Alternate Mobile no*/}
                <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right">Alternate Mobile no</Text>{" "}
                  </GridItem>
                  <GridItem colSpan={{ base: 1 }}>
                    <FormControl
                      isInvalid={errors?.alternate_mobile_no}
                      style={{ w: commonWidth.w }}
                    >
                      <Input
                        name="alternate_mobile_no"
                        {...register("alternate_mobile_no")}
                        type="text"
                        border="1px"
                        borderColor="gray.10"
                        backgroundColor={"white"}
                        height={"15px "}
                        borderRadius={"lg"}
                        isDisabled={viewForm ? true : disabledAllField}
                        // value={
                        //   getValues("alternate_mobile_no")?.split("+91")[1]
                        //     ? Number(
                        //         getValues("alternate_mobile_no")?.split(
                        //           "+91"
                        //         )[1] || ""
                        //       )
                        //     : ""
                        // }
                        // onChange={(e) => {
                        //   setValue(
                        //     "alternate_mobile_no",
                        //     "+91" + e.target.value,
                        //     {
                        //       shouldValidate: true,
                        //     }
                        //   );
                        // }}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        //  isDisabled={true}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Alternate Mobile no "
                      />
                    </FormControl>
                  </GridItem>
                </Grid>

                {/*e-mail id*/}
                <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right">E-mail id</Text>{" "}
                  </GridItem>
                  <GridItem colSpan={{ base: 1 }}>
                    <FormControl
                      isInvalid={errors?.email_id}
                      style={{ w: commonWidth.w }}
                    >
                      <Input
                        {...register("email_id")}
                        type="text"
                        border="1px"
                        borderColor="gray.10"
                        backgroundColor={"white"}
                        height={"15px "}
                        borderRadius={"lg"}
                        isDisabled={viewForm ? true : disabledAllField}
                        //value={inputValue}
                        //  onChange={onChange}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        //  isDisabled={true}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="e-mail id"
                      />
                    </FormControl>
                  </GridItem>
                </Grid>

                {/*Bank details :  */}
                {/* <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right" color={"#212121"}>
                      Bank details :
                    </Text>{" "}
                  </GridItem>
                </Grid> */}

                {/* Account Holder Name
                 */}
                {/* <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right">Account Holder Name</Text>{" "}
                  </GridItem>
                  <GridItem colSpan={{ base: 1 }}>
                    <FormControl
                      isInvalid={errors?.account_holder_name}
                      style={{ w: commonWidth.w }}
                    >
                      <Input
                        {...register("account_holder_name")}
                        type="text"
                        border="1px"
                        borderColor="gray.10"
                        backgroundColor={"white"}
                        height={"15px "}
                        borderRadius={"lg"}
                        isDisabled={disabledAllField}
                        //value={inputValue}
                        //  onChange={onChange}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        //  isDisabled={true}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Account Holder Name"
                      />
                    </FormControl>
                  </GridItem>
                </Grid> */}

                {/*Account number*/}
                {/* <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right">Account Number</Text>{" "}
                  </GridItem>
                  <GridItem colSpan={{ base: 1 }}>
                    <FormControl
                      isInvalid={errors?.account_number}
                      style={{ w: commonWidth.w }}
                    >
                      <Input
                        {...register("account_number")}
                        type="text"
                        border="1px"
                        borderColor="gray.10"
                        backgroundColor={"white"}
                        height={"15px "}
                        borderRadius={"lg"}
                        isDisabled={disabledAllField}
                        //value={inputValue}
                        //  onChange={onChange}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        //  isDisabled={true}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="Account number"
                      />
                    </FormControl>
                  </GridItem>
                </Grid> */}

                {/*IFSC Code*/}
                {/* <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right">IFSC Code</Text>{" "}
                  </GridItem>
                  <GridItem colSpan={{ base: 1 }}>
                    <FormControl
                      isInvalid={errors?.ifsc_code}
                      style={{ w: commonWidth.w }}
                    >
                      <Input
                        {...register("ifsc_code")}
                        type="text"
                        border="1px"
                        borderColor="gray.10"
                        backgroundColor={"white"}
                        height={"15px "}
                        borderRadius={"lg"}
                        isDisabled={disabledAllField}
                        //value={inputValue}
                        //  onChange={onChange}
                        _placeholder={commonStyle._placeholder}
                        _hover={commonStyle._hover}
                        _focus={commonStyle._focus}
                        //  isDisabled={true}
                        p={{ base: "4" }}
                        fontWeight={{ base: "normal" }}
                        fontStyle={"normal"}
                        placeholder="IFSC Code "
                      />
                    </FormControl>
                  </GridItem>
                </Grid> */}
              </Box>
            </Box>

            {/*KYC details :   */}
            <Grid
              textAlign="right"
              alignItems="center"
              my="3"
              templateColumns={templateColumns}
              gap={5}
            >
              <GridItem colSpan={{ base: 1, lg: 0 }}>
                <Text
                  textAlign="right"
                  fontWeight={"semibold"}
                  color={"#212121"}
                >
                  KYC Details :
                </Text>{" "}
              </GridItem>
            </Grid>

            <Box>
              <Grid
                textAlign="right"
                templateColumns="repeat(2, 1fr)"
                alignItems="start"
                gap={4}
                bgColor={"#DBFFF5"}
                padding="20px"
                borderRadius="10px"
              >
                <Box>
                  <Text fontWeight="bold" textAlign="left">
                    Document type
                  </Text>
                  {console.log(documentTypesOptions, "here")}
                  <ReactSelect
                    isDisabled={viewForm}
                    options={documentTypesOptions || []}
                    // options={selectBoxOptions?.docType || []}
                    value={
                      documentTypesOptions?.filter(
                        (item) => item.value === getValues("doc_type")?.value
                      )[0] || {}
                    }
                    // isLoading={getBankMasterApiIsLoading}
                    onChange={(val) => {
                      setValue("doc_type", val, {
                        shouldValidate: true,
                      });
                      setKycDetail((old) => ({
                        ...old,
                        doc_type: val,
                      }));
                    }}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        backgroundColor: "#fff",
                        borderRadius: "6px",
                        borderColor: errors?.doc_type ? "red" : "#c3c3c3",

                        padding: "1px",
                        textAlign: "left",
                      }),
                      ...reactSelectStyle,
                    }}
                  />
                </Box>
                <Box>
                  <Text fontWeight="bold" textAlign="left">
                    Document Name
                  </Text>
                  <ReactSelect
                    isDisabled={viewForm}
                    options={documentNamesOptions || []}
                    value={
                      documentNamesOptions?.filter(
                        (item) =>
                          item?.value === getValues("owner_type_doc")?.value
                      )[0] || {}
                    }
                    // isLoading={getBankMasterApiIsLoading}
                    onChange={(val) => {
                      console.log(val);
                      setValue("owner_type_doc", val, {
                        shouldValidate: true,
                      });

                      setKycDetail((old) => ({
                        ...old,
                        owner_type_doc: val,
                      }));

                      // setKycDetail((old) => ({
                      //   ...old,
                      //   owner_type_doc: val.value,
                      // }));
                      // setBankError((old) => ({
                      //   ...old,
                      //   bank: "",
                      // }));
                    }}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        backgroundColor: "#fff",
                        borderRadius: "6px",
                        borderColor: errors?.owner_type_doc ? "red" : "#c3c3c3",
                        padding: "1px",
                        textAlign: "left",
                      }),
                      ...reactSelectStyle,
                    }}
                  />
                </Box>
                <Box>
                  <Text fontWeight="bold" textAlign="left">
                    Document No
                  </Text>
                  <Input
                    isDisabled={viewForm}
                    type="text"
                    name="document_no"
                    {...register("document_number")}
                    border="1px"
                    /// borderColor="gray.10"
                    borderColor={errors?.document_number ? "red" : "gray.10"}
                    backgroundColor={"white"}
                    height={"15px"}
                    borderRadius={"lg"}
                    //value={kycDetail?.document_number || ""}
                    // onChange={(e) => {
                    //   setKycDetail((old) => ({
                    //     ...old,
                    //     document_number: e.target.value,
                    //   }));
                    // }}
                    //value={inputValue}
                    //  onChange={onChange}

                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    //  isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Document No"
                  />
                  {errors?.document_number?.message && (
                    <Text color="red" textAlign="left" mx="1">
                      {errors?.document_number?.message}
                    </Text>
                  )}
                </Box>
                <Box>
                  <Text fontWeight="bold" textAlign="left">
                    Upload Document
                  </Text>

                  <FileUploadCmp
                    isDisabled={viewForm}
                    label=""
                    name="document_path"
                    isError={errors?.document_path}
                    type="application/pdf, image/jpeg, image/png, image/jpg,application/msword"
                    defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                    placeholder="Choose a file"
                    allowedTypes={[
                      "application/pdf",
                      "image/jpeg",
                      "image/png",
                      "image/jpg",
                      "application/vnd.ms-excel", // XLS file type
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX file type
                      "application/msword", // DOC file type
                    ]}
                    isMultipalUpload={false}
                    fileuplaod_folder_structure={{
                      type: "master",
                      subtype: "Warehouse Owner Master",
                    }}
                    fileName={getValues("document_path")}
                    clearFileName={getValues("document_path") === ""}
                    maxFileSize={1024 * 1024} // For example, 1MB (1024 bytes * 1024 bytes)
                    onChange={(url) => {
                      setValue("document_path", url, { shouldValidate: true });
                    }}
                  />
                </Box>
                <GridItem colSpan="2">
                  <Box display="flex" gap={2} justifyContent="flex-end" px="0">
                    <Button
                      type="button"
                      backgroundColor={"primary.700"}
                      _hover={{ backgroundColor: "primary.700" }}
                      color={"white"}
                      borderRadius={"full"}
                      isDisabled={viewForm ? true : false}
                      px={"10"}
                      onClick={() => {
                        if (viewForm === true) {
                        } else {
                          AddUpdateKycDetails();
                        }
                      }}
                      // onClick={clearForm}
                    >
                      {isKycEditState?.isEdit ? "Update" : "Add"}
                    </Button>
                  </Box>
                </GridItem>
              </Grid>
            </Box>

            {/* show KYC details :   table start */}
            <TableContainer mt="4">
              <Table color="#000">
                <Thead bg="#dbfff5" border="1px" borderColor="#000">
                  <Tr style={{ color: "#000" }}>
                    <Th color="#000">Sr no</Th>
                    <Th color="#000">Document type</Th>
                    <Th color="#000">Document name</Th>
                    <Th color="#000">Document no</Th>
                    <Th color="#000"> Download document</Th>
                    <Th color="#000">Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {kycDetailsList &&
                    kycDetailsList.map((item, i) => (
                      <Tr
                        key={i}
                        // key={`warehouse_owner_details${i}`}
                        textAlign="center"
                        bg="white"
                        border="1px"
                        borderColor="#000"
                      >
                        <Td>{i + 1} </Td>
                        <Td>{item?.doc_type?.label}</Td>
                        <Td>{item?.owner_type_doc?.label}</Td>
                        <Td>{item.document_number} </Td>
                        <Td>
                          <Box flex="none" color={"primary.700"}>
                            <DownloadFileFromUrl
                              details={{
                                paths: [item?.document_path],
                                fileName: item?.doc_type?.label,
                              }}
                            />
                          </Box>
                        </Td>
                        <Td>
                          <Box display="flex" alignItems="center" gap="3">
                            <Flex gap="20px" justifyContent="center">
                              <Box color={"primary.700"}>
                                <BiEditAlt
                                  fontSize="26px"
                                  cursor={
                                    item?.doc_type?.label ===
                                      "Identity Proof - Pan Card" &&
                                    !editAndDeleteIconsEnabled
                                      ? "not-allowed"
                                      : "pointer"
                                  }
                                  onClick={() => {
                                    if (
                                      item?.doc_type?.label ===
                                        "Identity Proof - Pan Card" &&
                                      !editAndDeleteIconsEnabled
                                    ) {
                                      console.log("not edited");
                                    } else {
                                      warehouseOwnerOnEdit(item, i);
                                    }
                                  }}
                                />
                              </Box>
                              <Box color="red">
                                <AiOutlineDelete
                                  isDisabled={
                                    item?.doc_type?.label ===
                                      "Identity Proof - Pan Card" &&
                                    !editAndDeleteIconsEnabled
                                  }
                                  fontSize="26px"
                                  cursor={
                                    item?.doc_type?.label ===
                                      "Identity Proof - Pan Card" &&
                                    !editAndDeleteIconsEnabled
                                      ? "not-allowed"
                                      : "pointer"
                                  }
                                  onClick={() => {
                                    if (
                                      item?.doc_type?.label ===
                                        "Identity Proof - Pan Card" &&
                                      !editAndDeleteIconsEnabled
                                    ) {
                                      console.log("not edited");
                                    } else {
                                      warehouseOwnerRemove(i);
                                    }
                                  }}
                                  // onClick={() => {
                                  //   warehouseOwnerRemove(i);
                                  // }}
                                />
                              </Box>
                            </Flex>
                          </Box>
                        </Td>
                      </Tr>
                    ))}
                  {kycDetailsList.length === 0 && (
                    <Tr textAlign="center">
                      <Td colSpan="5" color="#000">
                        No record found
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
            {/* show KYC details : table end */}

            <DownloadFileFromUrl
              details={{
                paths: kycDetailsList.map((el) => el.document_path),
              }}
              label="Download All Files"
            />

            {/*Warehouse Mapping :   */}
            <Grid
              textAlign="right"
              alignItems="center"
              my="3"
              templateColumns={templateColumns}
              gap={5}
            >
              <GridItem colSpan={{ base: 1, lg: 0 }}>
                <Text
                  textAlign="right"
                  fontWeight={"semibold"}
                  color={"#212121"}
                >
                  Warehouse Wise Bank details
                </Text>{" "}
              </GridItem>
            </Grid>

            <Box>
              <Grid
                textAlign="right"
                templateColumns="repeat(2, 1fr)"
                alignItems="start"
                gap={4}
                bgColor={"#DBFFF5"}
                padding="20px"
                borderRadius="10px"
              >
                <Box>
                  <Text fontWeight="bold" textAlign="left">
                    Warehouse Name
                  </Text>
                  <Input
                    isDisabled={viewForm}
                    type="text"
                    name="warehouse_name"
                    {...register("warehouse_name")}
                    readOnly
                    border="1px"
                    backgroundColor={"white"}
                    height={"15px"}
                    borderRadius={"lg"}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Warehouse Name"
                  />
                </Box>

                <Box>
                  <Text fontWeight="bold" textAlign="left">
                    Account Holder Name
                  </Text>
                  <Input
                    isDisabled={viewForm}
                    type="text"
                    name="account_holder_name"
                    {...register("account_holder_name")}
                    border="1px"
                    borderColor={
                      errors?.account_holder_name ? "red" : "gray.10"
                    }
                    backgroundColor={"white"}
                    height={"15px"}
                    borderRadius={"lg"}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Account Holder Name"
                  />

                  {errors?.account_holder_name?.message && (
                    <Text color="red" textAlign="left" mx="1">
                      {errors?.account_holder_name?.message}
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text fontWeight="bold" textAlign="left">
                    Account Number
                  </Text>
                  <Input
                    isDisabled={viewForm}
                    type="number"
                    name="account_number"
                    {...register("account_number")}
                    border="1px"
                    borderColor={errors?.account_number ? "red" : "gray.10"}
                    backgroundColor={"white"}
                    height={"15px"}
                    borderRadius={"lg"}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Account Number"
                  />
                  {errors?.account_number?.message && (
                    <Text color="red" textAlign="left" mx="1">
                      {errors?.account_number?.message}
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text fontWeight="bold" textAlign="left">
                    IFSC Code
                  </Text>
                  <Input
                    isDisabled={viewForm}
                    type="text"
                    name="ifsc_code"
                    {...register("ifsc_code")}
                    border="1px"
                    borderColor={errors?.ifsc_code ? "red" : "gray.10"}
                    backgroundColor={"white"}
                    height={"15px"}
                    borderRadius={"lg"}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder=" IFSC Code"
                  />
                  {errors?.ifsc_code?.message && (
                    <Text color="red" textAlign="left" mx="1">
                      {errors?.ifsc_code?.message}
                    </Text>
                  )}
                </Box>

                <GridItem colSpan="2">
                  <Box display="flex" gap={2} justifyContent="flex-end" px="0">
                    <Button
                      type="button"
                      backgroundColor={"primary.700"}
                      _hover={{ backgroundColor: "primary.700" }}
                      color={"white"}
                      borderRadius={"full"}
                      px={"10"}
                      isDisabled={
                        viewForm ? true : !warehouseMappingEditState?.isEdit
                      }
                      onClick={() => {
                        updateWarehouseMappingDetails();
                      }}
                    >
                      Edit
                    </Button>
                  </Box>
                </GridItem>
              </Grid>

              {/* warehouse mapping table start */}
              <TableContainer mt="4">
                <Table color="#000">
                  <Thead bg="#dbfff5" border="1px" borderColor="#000">
                    <Tr style={{ color: "#000" }}>
                      <Th color="#000">Sr No</Th>
                      <Th color="#000">Warehouse Name</Th>
                      <Th color="#000">Warehouse Location</Th>
                      <Th color="#000">Account Holder Name</Th>
                      <Th color="#000"> Account No</Th>
                      <Th color="#000"> IFSC Code</Th>
                      <Th color="#000">Agreement Start Date</Th>
                      <Th color="#000"> Agreement End Date</Th>
                      <Th color="#000"> Rent</Th>
                      <Th color="#000"> Rev Sharing Ratio</Th>
                      <Th color="#000"> Min Fixed Amount</Th>
                      <Th color="#000">Status</Th>
                      <Th color="#000">Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {warehouseMappingData &&
                      warehouseMappingData.map((item, i) => (
                        <Tr
                          key={`warehouse_mapping_details${i}`}
                          textAlign="center"
                          bg="white"
                          border="1px"
                          borderColor="#000"
                        >
                          <Td>{i + 1} </Td>
                          <Td>{item?.warehouse_name}</Td>
                          <Td>{item?.location} </Td>
                          <Td>{item?.account_holder_name}</Td>
                          <Td>{item.account_number} </Td>
                          <Td>{item.ifsc_code} </Td>
                          <Td>{item?.agreement_start_date} </Td>
                          <Td>{item?.agreement_end_date} </Td>

                          <Td>{item.rent_amount} </Td>
                          <Td>{item.revenue_sharing_ratio || "-"} </Td>
                          <Td>{item.revenue_sharing_fix_amt || "-"} </Td>
                          <Td>{item.is_active ? "Active" : "Close" || "-"} </Td>

                          <Td>
                            <Box display="flex" alignItems="center" gap="3">
                              <Flex gap="20px" justifyContent="center">
                                <Box color={"primary.700"}>
                                  <BiEditAlt
                                    onClick={() => {
                                      if (viewForm === true) {
                                      } else {
                                        editWarehouseMappingDetails(item, i);
                                      }
                                    }}
                                    fontSize="26px"
                                    cursor="pointer"
                                  />
                                </Box>
                              </Flex>
                            </Box>
                          </Td>
                        </Tr>
                      ))}
                    {warehouseMappingData.length === 0 && (
                      <Tr textAlign="center">
                        <Td colSpan="5" color="#000">
                          No record found
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
              {warehouseMappingDataError && (
                <Box as="p" my="2" color="red">
                  {warehouseMappingDataError}
                </Box>
              )}
            </Box>

            {/* warehouse mapping table end */}

            {/* <Box>
              <Grid
                gap={4}
                templateColumns={"repeat(3, 1fr)"}
                alignItems="center"
                mt="10px"
              >
                <Text textAlign="right">Active</Text>
                <CustomSwitch
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
            </Box> */}

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
                isDisabled={viewForm ? true : false}
                isLoading={
                  addWareHouseOwnerTypeApiIsLoading ||
                  updateWareHouseOwnerTypeApiIsLoading
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
};

export default AddEditWareHouseOwnerMaster;

const toasterAlert = (obj) => {
  if (!obj) {
    console.error("Invalid input object: ", obj);
    return;
  }
  console.log(obj);
  const { status, message, data } = obj?.data;

  if (status && message) {
    showToastByStatusCode(status, message);
  } else {
    console.error("Invalid status or message:", status, message);
  }

  if (data && typeof data === "object") {
    const errorMessages = [];

    for (const key in data) {
      if (data.hasOwnProperty(key) && Array.isArray(data[key])) {
        data[key].forEach((message) => {
          errorMessages.push(`${key} : ${message}`);
        });
      }
    }

    if (errorMessages.length > 0) {
      showToastByStatusCode(status || 400, errorMessages.join("\n"));
    }
  }
};

function validateWarehouseOwnerMasterKYCFormData(formData) {
  console.log("formdata -->", formData);

  const validationSchema = yup.object().shape({
    doc_type: yup
      .object()
      .shape({
        label: yup.string().required(() => null),
        value: yup.number().required(() => null),
      })
      .required(() => null),
    owner_type_doc: yup
      .object()
      .shape({
        label: yup.string().required(() => null),
        value: yup.number().required(() => null),
      })
      .required(() => null),

    document_number: yup
      .string()
      .trim()
      .max(25)
      .when("doc_type.label", {
        is: (label) =>
          label === "identity proof" ||
          label === "Identity Proof - Pan Card" ||
          label === "AUTHORIZED PERSON ID PROOF",
        then: (schema) =>
          schema
            .required(() => null)
            .typeError()
            .trim(),
        otherwise: (schema) => schema.nullable().trim(),
      }),

    document_path: yup.string().required(() => null),
  });

  try {
    validationSchema.validateSync(formData, { abortEarly: false });
    console.log("try -_---------------><");
  } catch (errors) {
    console.log("errr -------->", errors);
    const validationErrors = {};

    errors.inner.forEach((error) => {
      validationErrors[error.path] = error.message;
    });

    throw validationErrors;
  }
}

function validateWarehouseMappingFormData(formData) {
  console.log("formdata -->", formData);

  const validationSchema = yup.object().shape({
    warehouse_name: yup.string().trim(),

    account_holder_name: yup
      .string()
      .typeError("")
      .trim()
      .max(50, "Account holder name must not exceed 50 characters")
      .required(() => null),
    account_number: yup
      .string()
      .typeError("")
      .trim()
      .matches(/^\d+$/, "Account number must contain only digits")
      .min(9, "Account number must be at least 9 digits")
      .max(18, "Account number must not exceed 18 digits")
      .required(() => null),
    ifsc_code: yup
      .string()
      .trim()
      .typeError("")
      .matches(/^[A-Za-z]{4}\d{7}$/, "Invalid IFSC code (SBIN0123456)")
      .required(() => null),
  });

  try {
    validationSchema.validateSync(formData, { abortEarly: false });
    console.log("try -_---------------><");
  } catch (errors) {
    console.log("errr -------->", errors);
    const validationErrors = {};

    errors.inner.forEach((error) => {
      validationErrors[error.path] = error.message;
    });

    throw validationErrors;
  }
}

const createWarehouseMappingData = (array) => {
  return array?.map((item) => {
    const location = [
      item?.warehouse?.area?.area_name,
      item?.warehouse?.district?.district_name,
      item?.warehouse?.region?.region_name,
      item?.warehouse?.state?.state_name,
      item?.warehouse?.substate?.substate_name,
    ]
      ?.map((el) => el)
      .join(", ");
    return {
      id: item?.id,
      warehouse_name: item?.warehouse?.warehouse_name,
      location,
      account_holder_name: item?.account_holder_name,
      account_number: item?.account_number,
      ifsc_code: item?.ifsc_code,
      agreement_start_date: item?.warehouse_agreement?.agreement_start_date
        ? moment(item?.warehouse_agreement?.agreement_start_date).format(
            "YYYY-MM-DD"
          )
        : null,
      agreement_end_date: item?.warehouse_agreement?.agreement_end_date
        ? moment(item?.warehouse_agreement?.agreement_end_date).format(
            "YYYY-MM-DD"
          )
        : null,
      rent_amount: item.rent_amount,
      revenue_sharing_ratio: item.revenue_sharing_ratio,
      revenue_sharing_fix_amt: item.revenue_sharing_fix_amt,
      is_active: item?.is_active,
    };
  });
};
