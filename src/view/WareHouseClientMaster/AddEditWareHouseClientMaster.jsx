/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
// import { schema } from "./fields";
import * as yup from "yup";
import {
  useAddWareHouseClientMutation,
  useGetClientMasterDocTypeMutation,
  useGetConstitutionClientMutation,
  useGetStateMutation,
  // useSubmitClientMasterMutation,
  useUpdateWareHouseClientMutation,
  useGetUserFreeMasterMutation,
  useWarehouseOwnerClientMasterCheckPanNumberMutation,
  useFetchWareHouseClientByIdMutation,
} from "../../features/master-api-slice";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import {
  Box,
  Button,
  Checkbox,
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
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import ReactSelect from "react-select";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import FileUploadCmp from "../../components/Elements/FileUploadCmp";
import { AiOutlineDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import DownloadFilesFromUrl from "../../components/DownloadFileFromUrl";
// import { m } from "framer-motion";
import moment from "moment";
import CustomSwitch from "../../components/Elements/CustomSwitch";
import {
  // useAssignServiceContractMutation,
  useAssignWarehouseContarctMutation,
} from "../../features/service-contract-api.slice";
import { toasterAlert } from "../../services/common.service";
import ROUTE_PATH from "../../constants/ROUTE";
import {
  aadharValidationMessage,
  panValidationMessage,
} from "../../services/validation.service";
import { localStorageService } from "../../services/localStorge.service";

const authorizedPersonRequiredValues = [
  "FPO",
  "LLP",
  "Company",
  "Partnership Firm",
];

const depositorPersonRequiredValues = ["Proprietorship"];

// Function to check if the obj's doc_type already exists in kyc
function isDocTypeAlreadyExists(obj, kycArray) {
  for (let i = 0; i < kycArray?.length || 0; i++) {
    if (kycArray[i]?.document_type?.value === obj?.document_type?.value) {
      return true; // doc_type already exists
    }
  }
  return false; // doc_type does not exist
}

function isStateAlreadyExists(obj, array) {
  for (let i = 0; i < array?.length || 0; i++) {
    if (array[i].state.value === obj.state.value) {
      return true; // state already exists
    }
  }
  return false; // state does not exist
}

const schema = yup.object().shape({
  clientType: yup
    .string()
    .trim()
    .required(() => null),

  salesPersonFromGGTeam: yup.string().trim().nullable(),

  // constitutionOfClient: yup.string().required(() => null),
  constitutionOfClient: yup
    .object()
    .shape({
      label: yup.string().required(() => null), // Validate as a string, trim whitespace, and make it required
      value: yup.string().required(() => null), // Validate as a number and make it required
    })
    .required(() => null), // Make the whole "commodity" object required

  nameOfClient: yup
    .string()
    .trim()
    .required(() => null),

  nameOfCompany: yup.string().when("constitutionOfClient", {
    is: (value) => ["Proprietorship"].includes(value?.label),
    then: () =>
      yup
        .string()
        .trim()
        .required(() => null),
    otherwise: () => yup.string().nullable().trim(),
  }),

  // nameOfCompany: yup.string().trim().nullable(),

  panCard: yup.string().trim(),
  // pan code added..
  // .matches(
  //   /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/,
  //   panValidationMessage()
  // ),

  panCardNumber: yup
    .string()
    .trim()
    .typeError("")
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, panValidationMessage())
    .required(false),

  // uploadPanCard: yup
  //   .string()
  //   .trim()
  //   .required(() => null),

  modeOfOperations: yup
    .string()
    .trim()
    .required(() => null),

  client_sourced_by: yup.string().trim(),

  // Authorise Person Details

  authorisePersonName: yup.string().when("constitutionOfClient", {
    is: (value) =>
      ["FPO", "LLP", "Company", "Partnership Firm"].includes(value?.label),
    then: () =>
      yup
        .string()
        .trim()
        .required(() => null),
    otherwise: () => yup.string().nullable().trim(),
  }),
  birthDate: yup.string().when("constitutionOfClient", {
    is: (value) => {
      console.log("value schema -->", value);
      return ["FPO", "LLP", "Company", "Partnership Firm"].includes(
        value?.label
      );
    },
    then: () =>
      yup
        .date()
        .max(new Date(), "Birth Date must be in the past")
        .typeError("")
        .nullable()
        .required(() => null),
    otherwise: () => yup.string().typeError("otherwise").nullable(),
  }),

  // birthDate: yup.string().when('constitutionOfClient', {
  //   is: (value) => ["FPO", "LLP", "Company", "Partnership Firm"].includes(value?.label),
  //   then: () => yup.string()
  //     .max(new Date(), 'Birth Date must be in the past')
  //     .typeError('Invalid date format. Please use YYYY-MM-DD.')
  //     .test('future-date', 'Birth Date must not be in the future', (value) => value <= new Date())
  //     .required('Birth Date is required'),
  //   otherwise: () => yup.string().notRequired(),
  // }),

  soOrWo: yup.string().when("constitutionOfClient", {
    is: (value) =>
      ["FPO", "LLP", "Company", "Partnership Firm"].includes(value?.label),
    then: () =>
      yup
        .string()
        .trim()
        .required(() => null),
    otherwise: () => yup.string().nullable().trim(),
  }),

  designation: yup.string().when("constitutionOfClient", {
    is: (value) =>
      ["FPO", "LLP", "Company", "Partnership Firm"].includes(value?.label),
    then: () =>
      yup
        .string()
        .trim()
        .required(() => null),
    otherwise: () => yup.string().nullable().trim(),
  }),

  aadhaarNumber: yup.string().when("constitutionOfClient", {
    is: (value) =>
      ["FPO", "LLP", "Company", "Partnership Firm"].includes(value?.label),
    then: () =>
      yup
        .string()
        .trim()
        .required(() => null)
        .matches(/^[0-9]{12}$/, {
          message: aadharValidationMessage(), // Customize the error message here
        }),
    otherwise: () => yup.string().nullable().trim(),
  }),

  uploadAadhaarCard: yup.string().when("constitutionOfClient", {
    is: (value) =>
      ["FPO", "LLP", "Company", "Partnership Firm"].includes(value?.label),
    then: () =>
      yup
        .string()
        .trim()
        .required(() => null),
    otherwise: () => yup.string().nullable().trim(),
  }),

  panCardNumberAuthorise: yup.string().when("constitutionOfClient", {
    is: (value) =>
      ["FPO", "LLP", "Company", "Partnership Firm"].includes(value?.label),
    then: () =>
      yup
        .string()
        .trim()
        .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, panValidationMessage())
        .required(() => null),
    otherwise: () => yup.string().nullable().trim(),
  }),

  uploadPanCardAuthorise: yup.string().when("constitutionOfClient", {
    is: (value) =>
      ["FPO", "LLP", "Company", "Partnership Firm"].includes(value?.label),
    then: () =>
      yup
        .string()
        .trim()
        .required(() => null),
    otherwise: () => yup.string().nullable().trim(),
  }),

  // KYC Details
  document_type: yup.string(), //.required(() => null),
  document_name: yup.string(), //.required(() => null),
  document_no: yup.string().max(25), //.required(false),
  upload_doc: yup.string(), //.required(() => null),
});

const clientTypesOptions = [
  { label: "Retail", value: "Retail" },
  { label: "Corporate", value: "Corporate" },
];

// const constitutionOfClientOptions = [
//   { label: "Company", value: "Company" },
//   { label: "Partnership Firm", value: "Partnership Firm" },
//   { label: "Partnership", value: "Partnership" },
//   { label: "Proprietary firm", value: "Proprietary firm" },
//   { label: "HUF", value: "HUF" },
//   { label: "FPO", value: "FPO" },
//   { label: "LLP", value: "LLP" },
// ];

const panCardOptions = [
  { label: "Firm", value: "Firm" },
  { label: "Company", value: "Company" },
  { label: "individual", value: "individual" },
];

const modeOfOperationOptions = [
  { label: "Any one can sign", value: "Any one can sign" },
  { label: "Jointly", value: "Jointly" },
];

const AddEditWareHouseClientMaster = () => {
  const location = useLocation();
  const [details, setDetails] = useState(location.state?.details);
  // let details = location.state?.details;
  console.log("details --->", details);
  const initialIsActive = details?.is_active;

  const navigate = useNavigate();
  const pageView = location?.state?.view;

  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const {
    setValue,
    register,
    getValues,
    setError,
    clearErrors,
    reset,
    watch,
    formState: { errors },
  } = methods;

  const [userStatus, setUserStatus] = useState(0);

  const [hideCheckPanButton, setHideCheckPanButton] = useState(true);
  const [selectedConstitutionOfClient, setSelectedConstitutionOfClient] =
    useState({});
  const [isShowAuthorisePersonDetails, setIsShowAuthorisePersonDetails] =
    useState(false);
  const [isShowNameOfProperitor, setIsShowNameOfProperitor] = useState(false);

  const [isKycEditState, setIsKycEditState] = useState({
    isEdit: false,
    index: null,
  });

  const [disabledField, setDisabledField] = useState(true);
  const [isEditStateWiseDetails, setIsEditStateWiseDetails] = useState(false);
  const [defaultPanCardDetails, setDefaultPanCardDetails] = useState({});
  const [mandatoryDocument, setMandatoryDocument] = useState([]);
  const [allSalesPersonGg, setAllSalesPersonGg] = useState([]);
  const [kycDetailsList, setKycDetailsList] = useState([]);
  const [kycDetailsListCopy, setKycDetailsListCopy] = useState([]);
  const [constitutionOfClientOptions, setConstitutionOfClientOptions] =
    useState([]);
  const [documentNamesOptions, setDocumentNamesOptions] = useState([]);
  const [getDoctypeQueryParams, setGetDoctypeQueryParams] = useState([]);
  const [documentTypesOptions, setDocumentTypesOptions] = useState([]);

  const [allStates, setAllStates] = useState([]);
  const [officeAddressLists, setOfficeAddressLists] = useState([]);
  const [isOfficeAddressEditState, setIsOfficeAddressEditState] = useState({
    isEdit: false,
    index: null,
  });

  const [getUserFreeMaster, { isLoading: getUserFreeMasterApiIsLoading }] =
    useGetUserFreeMasterMutation();

  const [
    fetchWareHouseClientById,
    { isLoading: fetchWareHouseClientByIdApiIsLoading },
  ] = useFetchWareHouseClientByIdMutation();

  const [checkPanDetails, { isLoading: checkPanDetailsApiIsLoading }] =
    useWarehouseOwnerClientMasterCheckPanNumberMutation();

  const [addWareHouseClient, { isLoading: addWareHouseClientApiIsLoading }] =
    useAddWareHouseClientMutation();

  const [
    updateWareHouseClient,
    { isLoading: updateWareHouseClientApiIsLoading },
  ] = useUpdateWareHouseClientMutation();

  const [
    getConstitutionClient,
    { isLoading: getConstitutionClientApiIsLoading },
  ] = useGetConstitutionClientMutation();

  const [getClientMasterDocType] = useGetClientMasterDocTypeMutation();

  // ! commented un used rtk hook ...
  // const [submitClientMaster, { isLoading: submitClientMasterApiIsLoading }] =
  //   useSubmitClientMasterMutation();

  const [getState] = useGetStateMutation();

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
  // css Code End

  const getAllGGTSalesTeam = async () => {
    try {
      const response = await getUserFreeMaster().unwrap();

      if (response.status === 200) {
        console.log(response);
        let arr = response.data.map((el) => ({
          label: el.employee_name,
          value: el.id,
        }));
        //constitutionOfClientOptions
        // setConstitutionOfClientOptions(arr);
        setAllSalesPersonGg(arr);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchConstitutionClient = async () => {
    try {
      const response = await getConstitutionClient().unwrap();

      if (response.status === 200) {
        console.log(response);
        let arr = response.data.map((el) => ({
          label: el.type_name,
          value: el.id,
        }));
        //constitutionOfClientOptions
        setConstitutionOfClientOptions(arr);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllKycDocTypes = async (url) => {
    try {
      console.log("url -->", url);
      const response = await getClientMasterDocType(url).unwrap();
      console.log(response);
      if (response.status === 200) {
        const uniqueGroupNames = [
          ...new Set(
            response?.data.group.map((item) => ({
              label: item.group_name,
              value: item.group_id,
              is_required: item?.is_required,
            }))
          ),
        ];

        const doc_names = [
          ...new Set(
            response?.data.document.map((item) => ({
              label: item.document_name,
              value: item.id,
            }))
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeDocumentType = (val) => {
    setValue("document_type", val?.value, {
      shouldValidate: true,
    });
  };

  // Form Submit Function Start
  const onSubmit = (data) => {
    console.log("data 1 ==>", data);

    // mandatoryDocument.includes()
    // kycDetailsList.map(el =>)

    console.log("mandatoryDocument ---->", mandatoryDocument);
    console.log("kycDetailsList  -----> ", kycDetailsList);

    // Check if all mandatory documents are available
    const missingDocuments = mandatoryDocument.filter((docType) =>
      kycDetailsList.every((kycDoc) => kycDoc?.document_type?.label !== docType)
    );

    if (missingDocuments?.length > 0) {
      const errorMessage = `The following mandatory documents have not been uploaded: ${missingDocuments.join(
        ", "
      )}`;
      showToastByStatusCode(400, errorMessage);
      return;
    }

    let pan_number =
      kycDetailsList?.filter(
        (el) => el?.document_type?.label === "Identity Proof - Pan Card"
      )[0] || "";

    const kyc = kycDetailsList?.map((el) => ({
      client_type_doc: el?.document_name?.value,
      document_number: el?.document_no,
      document_expiry_date: null,
      document_path: el?.upload_doc,
      id: el?.id,
    }));

    console.log("mandatoryDocument -->", mandatoryDocument);
    console.log("kyc --> ", kycDetailsList);

    const office = officeAddressLists.map((el, index) => ({
      is_default: selectedCheckboxIndex === index,
      state: el?.state?.value,
      mobile_no: `+91${el?.mobile_no}`,
      office_address: el?.office_address,
      email_addresses: el?.email_addresses,
      gst_no: el?.gst_no,
      upload_gst_certificate: el?.upload_gst_certificate,
    }));

    // ["FPO", "LLP", "Company", "Partnership Firm"]

    let auth_peson = {
      authorised_person_name: data?.authorisePersonName,
      authorised_person_so_or_wo: data?.soOrWo,
      authorised_person_birth_date: moment(data?.birthDate).format(
        "YYYY-MM-DD"
      ),
      authorised_person_designation: data?.designation,
      authorised_person_aadhaar_number: data?.aadhaarNumber,
      authorised_person_upload_aadhaar_card: data?.uploadAadhaarCard,
      authorised_person_pan_card_number: data?.panCardNumberAuthorise,
      authorised_person_upload_pan_card: data?.uploadPanCardAuthorise,
    };

    console.log("auth_peson", auth_peson);

    let formData = {
      client_type: data?.clientType,
      sales_person: data.salesPersonFromGGTeam,
      constitution_of_client: data?.constitutionOfClient?.value,
      name_of_client: data.nameOfClient,
      name_of_company: data.nameOfCompany,
      pan_card_type: data.panCard,
      //pan_card_number: data.panCardNumber,
      pan_card_number: pan_number?.document_no,
      // upload_pan_card: data.uploadPanCard,
      mode_of_operations: data.modeOfOperations,
      client_sourced_by: data.client_sourced_by,

      kyc: kyc || [],
      office: office || [],
      is_active: true,
      // is_active: data?.is_active,
    };

    let isFind = ["FPO", "LLP", "Company", "Partnership Firm"].includes(
      data?.constitutionOfClient?.label
    );

    console.log("dd", data?.constitutionOfClient);

    console.log(isFind);

    if (isFind) {
      formData = {
        ...formData,
        ...auth_peson,
      };
    }

    console.log("formData on suubmit time ===> ", formData);

    if (details?.id) {
      updateData({ ...formData, id: details.id });
    } else {
      addData(formData);
    }
  };
  // Form Submit Function End

  // Form Clear Function Start

  const addUpdateKycDetails = async () => {
    let data = getValues();
    console.log("data list --->", data);
    // Check if required fields are empty and set errors dynamically
    let doc_type_obj =
      documentTypesOptions?.filter(
        (item) => item?.value === data?.document_type
      )[0] || {};

    console.log("doc_type_obj", doc_type_obj);

    console.log({
      document_name: data?.document_name,
      document_type: data?.document_type,
      upload_doc: data?.upload_doc,
      document_no: data?.document_no,
    });

    if (data?.document_type === "" || data?.document_type === undefined) {
      setError("document_type", {
        type: "manual",
        message: "",
      });
    }

    if (data?.document_name === "" || data?.document_name === undefined) {
      setError("document_name", {
        type: "manual",
        message: "",
      });
    }

    if (data?.upload_doc === "" || data?.upload_doc === undefined) {
      setError("upload_doc", {
        type: "manual",
        message: "",
      });
    }

    if (
      (doc_type_obj?.label?.trim()?.toLowerCase() ===
        "identity proof".toLowerCase() ||
        doc_type_obj?.label?.trim()?.toLowerCase() ===
          "Identity Proof - Pan Card".toLowerCase()) &&
      (data?.document_no?.trim() === "" ||
        data?.document_no?.trim() === undefined)
    ) {
      setError("document_no", {
        type: "manual",
        message: "",
      });

      return;
    } else {
      clearErrors("document_no");
    }

    // check pan number is valid

    if (
      doc_type_obj?.label?.trim().toLowerCase() ===
        "Identity Proof - Pan Card".toLowerCase() &&
      data?.document_no?.trim()
    ) {
      const isValid = await isValidPAN(data?.document_no?.trim());
      if (isValid) {
        clearErrors("document_no");
      } else {
        setError("document_no", {
          type: "manual",
          message: panValidationMessage(),
        });
        return false;
      }
    }
    // check Addhar card number is valid or not

    if (
      doc_type_obj?.label?.trim().toLowerCase() ===
        "Identity Proof".toLowerCase() &&
      data?.document_no?.trim()
    ) {
      const isValid = await isValidAadhaarNumber(data?.document_no?.trim());
      if (isValid) {
        clearErrors("document_no");
      } else {
        setError("document_no", {
          type: "manual",
          message: aadharValidationMessage(),
        });
        return false;
      }
    }

    if (data.document_type && data.document_name && data.upload_doc) {
      console.log("!!!!!!!!!!!!!!!!!!! -----> ", kycDetailsList);
      const copy_kycDetails = [...kycDetailsList];

      const isEditing = isKycEditState?.isEdit;
      const editedIndex = isKycEditState?.index;

      let kycDetail = {
        document_type: documentTypesOptions?.filter(
          (type) => type.value === data.document_type
        )[0],
        document_name: documentNamesOptions?.filter(
          (type) => type.value === data.document_name
        )[0],
        document_no: data?.document_no?.trim() || null,
        upload_doc: data.upload_doc,
      };

      if (kycDetailsListCopy.length > 0) {
        let matchDoc =
          kycDetailsListCopy.filter(
            (el) => el.document_no === kycDetail?.document_no
          )[0] || null;

        kycDetail = {
          ...kycDetail,
          id: matchDoc?.id,
        };
      }

      console.log(kycDetail);

      console.log("kycDetailsList", kycDetailsList);

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
        editedIndex < kycDetailsList?.length
      ) {
        // In edit mode and the edited index exists
        if (docTypeExistsInMainKyc) {
          if (
            kycDetailsList[editedIndex].document_type.value ===
            kycDetail.document_type.value
          ) {
            // The doc_type remains the same, update the existing entry in the main kyc array
            const updatedKyc = [...kycDetailsList];
            updatedKyc[editedIndex] = kycDetail;

            setKycDetailsList(updatedKyc);
          } else {
            // The doc_type has changed, check if it exists in the copy array
            if (docTypeExistsInCopyKyc) {
              showToastByStatusCode(
                400,
                "Document type already exists in KYC."
              );
            } else {
              // Update the existing entry in the main kyc array with the new doc_type
              clearErrors();
              const updatedKyc = [...kycDetailsList];
              updatedKyc[editedIndex] = kycDetail;

              setKycDetailsList(updatedKyc);
            }
          }
        } else {
          showToastByStatusCode(400, "Document type not found in KYC.");
        }
      } else {
        // Not in edit mode or index is out of bounds
        if (docTypeExistsInCopyKyc) {
          showToastByStatusCode(400, "Document type already exists in KYC.");
        } else {
          // Add the new KYC detail to the main kyc array
          //  setIsKycFormDirty(false);
          clearErrors();
          setKycDetailsList([...kycDetailsList, kycDetail]);
        }
      }

      setIsKycEditState({
        isEdit: false,
        index: null,
      });

      clearKycForm();

      setGetDoctypeQueryParams([
        {
          filter: "client_type",
          client_type: constitutionOfClientOptions?.filter(
            (item) => item.value === getValues("constitutionOfClient")?.value
          )[0].label,
        },
      ]);
    }
    // else {

    //   setError("document_type", {
    //     type: "manual",
    //     message: "",
    //   });
    //   setError("document_name", {
    //     type: "manual",
    //     message: "",
    //   });
    //   setError("upload_doc", {
    //     type: "manual",
    //     message: "",
    //   });
    // }
  };

  const clearKycForm = () => {
    setValue("document_type", "", {
      shouldValidate: false,
    });
    setValue("document_name", "", {
      shouldValidate: false,
    });
    setValue("document_no", "", {
      shouldValidate: false,
    });
    setValue("upload_doc", "", {
      shouldValidate: false,
    });
  };

  const removeKycDocument = (index) => {
    let indexToRemove = index; // This will remove the object at index 1 (i.e., { id: 2, name: 'Bob' })

    // Use splice to remove the object at the specified index
    if (indexToRemove >= 0 && indexToRemove < kycDetailsList?.length) {
      let x = kycDetailsList.splice(indexToRemove, 1);
      console.log("$$$$$$$$$$$$", x);
      setKycDetailsList([...kycDetailsList]);
    } else {
      console.log("Invalid index");
    }

    // Display the updated array
    console.log(kycDetailsList);
    // reset({
    //   document_type: "",
    //   document_name: "",
    //   document_no: "",
    //   upload_doc: "",
    // });
  };

  const onEditKycDetails = (item, index) => {
    Object.keys(item).forEach((fieldName) => {
      if (item[fieldName] !== undefined) {
        setValue(fieldName, item[fieldName]?.value || item[fieldName] || "", {
          shouldValidate: true,
        });
      }
    });
    setIsKycEditState({
      isEdit: true,
      index: index,
    });
  };

  // ! commented un used function ..
  // const downloadKycDocument = (obj) => {
  //   const { document_name, upload_doc } = obj;
  //   console.log(obj);
  //   const url = `${configuration.BASE_URL}${upload_doc}`;
  //   console.log(url);
  // };

  // office addresses all function are start here

  const getAllStates = async () => {
    try {
      const response = await getState().unwrap();

      if (response.status === 200) {
        console.log(response);
        let arr = response.results.map((el) => ({
          label: el.state_name,
          value: el.id,
        }));
        console.log(arr);
        setAllStates(arr);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addEditOfficeAddress = () => {
    let data = getValues();

    const obj = {
      state: data.state,
      office_address: data.office_address,
      email_addresses: data.email_addresses,
      mobile_no: data.mobile_no,
      gst_no: data.gst_no,
      upload_gst_certificate: data.upload_gst_certificate,
    };

    try {
      validateOfficeAddressFormData(obj);
      console.log("Data is valid.");
    } catch (validationErrors) {
      Object.keys(validationErrors).forEach((key) => {
        setError(key, {
          type: "manual",
          message: validationErrors[key] || "",
        });
      });
      return false;
    }

    // Handle form submission here if all required fields are filled
    if (
      data.state &&
      data.office_address &&
      data.email_addresses &&
      data.mobile_no &&
      data.gst_no &&
      data.upload_gst_certificate
    ) {
      const copy_mainArr = [...officeAddressLists];

      const isEditing = isOfficeAddressEditState?.isEdit;
      const editedIndex = isOfficeAddressEditState?.index;

      // Perform your submission logic here

      console.log(obj);

      const stateExistsInMainArr = isStateAlreadyExists(
        obj,
        officeAddressLists
      );
      const stateExistsInCopyArr = isStateAlreadyExists(obj, copy_mainArr);

      if (
        isEditing &&
        editedIndex >= 0 &&
        editedIndex < officeAddressLists?.length
      ) {
        // In edit mode and the edited index exists
        if (stateExistsInMainArr) {
          if (
            officeAddressLists[editedIndex]?.state?.value === obj?.state?.value
          ) {
            // The doc_type remains the same, update the existing entry in the main kyc array
            const updatedArr = [...officeAddressLists];
            updatedArr[editedIndex] = obj;

            setOfficeAddressLists(updatedArr);
          } else {
            // The doc_type has changed, check if it exists in the copy array
            if (stateExistsInCopyArr) {
              showToastByStatusCode(400, "State already exists");
            } else {
              // Update the existing entry in the main kyc array with the new doc_type
              const updatedArr = [...officeAddressLists];
              updatedArr[editedIndex] = obj;
              //setIsKycFormDirty(false);
              setOfficeAddressLists(updatedArr);
            }
          }
        } else {
          showToastByStatusCode(400, "State type not found.");
        }
      } else {
        // Not in edit mode or index is out of bounds
        if (stateExistsInCopyArr) {
          showToastByStatusCode(400, "State already exists");
        } else {
          setOfficeAddressLists([...officeAddressLists, obj]);
        }
      }

      setIsOfficeAddressEditState({
        isEdit: false,
        index: null,
      });

      clearOfficeAddressForm();
    }
  };

  const onEditOfficeAddressDetail = (item, index) => {
    console.log("item && index", item, index);
    // Fill the form fields with the initial data using setValue
    Object.keys(item).forEach((fieldName) => {
      if (item[fieldName] !== undefined) {
        setValue(fieldName, item[fieldName], {
          shouldValidate: true,
        });
      }
    });
    setIsOfficeAddressEditState({
      isEdit: true,
      index: index,
    });
  };

  const clearOfficeAddressForm = () => {
    const obj = {
      state: "",
      office_address: "",
      email_addresses: "",
      mobile_no: "",
      gst_no: "",
      upload_gst_certificate: "",
    };

    Object.keys(obj).forEach((key) => {
      setValue(key, "", {
        shouldValidate: false,
      });
      clearErrors(key);
    });
  };

  const removeOfficeAddress = (index) => {
    let indexToRemove = index;
    if (indexToRemove >= 0 && indexToRemove < officeAddressLists?.length) {
      // eslint-disable-next-line
      let x = officeAddressLists.splice(indexToRemove, 1);
      setOfficeAddressLists([...officeAddressLists]);
    }

    clearOfficeAddressForm();
  };

  // office addresses all function are end here

  // Form Clear Function End

  // Add warehouseClient Api Start

  const addData = async (formData) => {
    try {
      const response = await addWareHouseClient(formData).unwrap();
      console.log("add warehouse client type master res", response);
      if (response.status === 201) {
        showToastByStatusCode(201, response?.message);

        navigate(
          `${ROUTE_PATH.ALL_MASTER_MANAGE_MANAGE_CLIENT_WAREOUSE_CLIENT}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };

  // Add warehouseClient Api End

  // Update warehouseClient Api Start

  const updateData = async (data) => {
    try {
      const response = await updateWareHouseClient(data).unwrap();
      if (response.status === 200) {
        if (
          Number(details?.status?.status_code || 0) === 2 ||
          Number(details?.status?.status_code || 0) === 5
        ) {
          approvedToMeFunction();
        } else {
          navigate(
            `${ROUTE_PATH.ALL_MASTER_MANAGE_MANAGE_CLIENT_WAREOUSE_CLIENT}`
          );
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };

  const isValidPAN = (value) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    return panRegex.test(value);
  };

  function isValidAadhaarNumber(aadhaarNumber) {
    // Regular expression pattern for a valid Aadhaar number
    const aadhaarRegex =
      /^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)/;

    // Remove any spaces or hyphens from the input string
    const cleanedAadhaarNumber = aadhaarNumber.replace(/\s|-/g, "");

    // Check if the cleaned input string matches the regex pattern
    return aadhaarRegex.test(cleanedAadhaarNumber);
  }

  const checkPanNUmber = async () => {
    try {
      let query = {
        pan_no: getValues("panCardNumber")?.trim(),
      };
      if (query.pan_no === "" || query.pan_no === undefined) {
        setError("panCardNumber", {
          type: "manual",
          message: "",
        });
        return;
      }
      console.log("query -->", query);
      console.log("constitutionOfClientOptions", constitutionOfClientOptions);
      // Validate the PAN card number using the Yup schema
      const isValid = await isValidPAN(query?.pan_no);
      console.log(isValid);
      if (isValid) {
        //setDisabledField(false);
        const response = await checkPanDetails(query).unwrap();
        // console.log("res checkPanNUmber --->", response);
        if (response?.status === 200 && response?.data) {
          setDisabledField(true);
          const res_data = response.data;
          console.log(res_data);

          let form_data = {
            clientType: res_data?.client_type,
            salesPersonFromGGTeam: res_data?.sales_person?.id,
            constitutionOfClient: {
              label: res_data?.constitution_of_client?.type_name,
              value: res_data?.constitution_of_client?.id,
            },
            nameOfClient: res_data?.name_of_client,
            nameOfCompany: res_data?.name_of_company,
            panCard: res_data?.pan_card_type,
            // panCardNumber: res_data?.pan_card_number,

            modeOfOperations: res_data?.mode_of_operations,
            client_sourced_by: res_data?.client_sourced_by,
          };

          console.log("form_data on pan check --> ", form_data);

          let authorise_Person_details = {};
          let isFind = ["FPO", "LLP", "Company", "Partnership Firm"].includes(
            form_data?.constitutionOfClient?.label
          );

          console.log(isFind);
          console.log(form_data?.constitutionOfClient?.label);

          if (isFind) {
            authorise_Person_details = {
              authorisePersonName: res_data?.authorised_person_name,
              birthDate: res_data?.authorised_person_birth_date,
              soOrWo: res_data?.authorised_person_so_or_wo,
              designation: res_data?.authorised_person_designation,
              aadhaarNumber: res_data?.authorised_person_aadhaar_number,
              uploadAadhaarCard:
                res_data?.authorised_person_upload_aadhaar_card,
              panCardNumberAuthorise:
                res_data?.authorised_person_pan_card_number,
              uploadPanCardAuthorise:
                res_data?.authorised_person_upload_pan_card,
            };
            console.log(authorise_Person_details);
            Object.keys(authorise_Person_details).forEach(function (key) {
              methods.setValue(key, authorise_Person_details[key], {
                shouldValidate: true,
              });
            });
          }

          Object.keys(form_data).forEach(function (key) {
            methods.setValue(key, form_data[key], {
              shouldValidate: true,
            });
          });

          setSelectedConstitutionOfClient(form_data?.constitutionOfClient);
          // setValue("constitutionOfClient", constitutionOfClient_obj, {
          //   shouldValidate: true,
          // });
          clearErrors("panCardNumber");
          console.log("done");
          //setDefaultPanCardDetails()
          let kyc_arr = response.data.kyc;
          console.log(kyc_arr);
          kyc_arr =
            kyc_arr &&
            kyc_arr.map((el) => ({
              document_type: {
                label: el?.client_type_doc?.group_name,
                value: el?.client_type_doc?.group_id,
              },
              document_name: {
                label: el?.client_type_doc?.document_name,
                value: el?.client_type_doc?.id,
              },
              document_no: el?.document_number,
              upload_doc: el?.document_path,
              id: el?.id,
              // nonEditable: true,
            }));

          console.log("kyc_arr", kyc_arr);
          let default_pan_card =
            kyc_arr?.filter(
              (el) => el.document_type?.label === "Identity Proof - Pan Card"
            )[0] || {};
          console.log(default_pan_card);
          setDefaultPanCardDetails(default_pan_card);
          // setValue("panCardNumber", default_pan_card, {
          //   shouldValidate: true,
          // });

          setKycDetailsList(kyc_arr);

          const office_arr = response.data?.office.map((el) => ({
            state: { label: el?.state?.state_name, value: el?.state?.id },
            mobile_no: el?.mobile_no.replace(/^\+91/, ""),
            office_address: el.office_address,
            email_addresses: el.email_addresses,
            gst_no: el.gst_no,
            upload_gst_certificate: el.upload_gst_certificate,
          }));

          console.log("office details on edit ---> ", office_arr);

          setOfficeAddressLists(office_arr);
        } else {
          setDisabledField(false);
          setKycDetailsList([]);
          clearForm();
          showToastByStatusCode(200, "Pan number does not exist");
          // setError("panCardNumber", {
          //   type: "manual",
          //   message: "", // You can customize the error message here
          // });
          clearErrors("panCardNumber");
        }
        clearErrors("pan_card");
      } else {
        setError("panCardNumber", {
          type: "manual",
          message: panValidationMessage(), // You can customize the error message here
        });
      }
    } catch (error) {
      clearErrors("panCardNumber");
      console.error("Error:", error?.message);
    }
  };

  const [selectedCheckboxIndex, setSelectedCheckboxIndex] = useState(0); // State to track selected checkbox index

  // Effect to select the first checkbox by default
  useEffect(() => {
    setSelectedCheckboxIndex(0);
  }, []);

  const handleCheckboxChange = (index) => {
    // If the current selection is the default one and user clicks on it again, reset selection
    if (selectedCheckboxIndex === index) {
      setSelectedCheckboxIndex(0);
    } else {
      setSelectedCheckboxIndex(index); // Update selected checkbox index
      console.log("Selected ID:", officeAddressLists[index].id); // Log the selected ID
    }
  };

  const gethWareHouseClientById = async (id) => {
    try {
      const response = await fetchWareHouseClientById(id).unwrap();
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  // Update warehouseClient Api End

  // Edit Form Fill Logic Start
  const clearForm = () => {
    // const defaultValues = methods.getValues();
    // Object.keys(defaultValues).forEach((key) => {
    //   // Check if the field key is not 'is_active' before clearing it
    //   if (key !== "is_active") {
    //     setValue(key, "", {
    //       shouldValidate: true,
    //     });
    //   }
    // });
    let obj = {
      clientType: "",
      salesPersonFromGGTeam: "",
      constitutionOfClient: "",
      nameOfClient: "",
      nameOfCompany: "",
      panCard: "",
      // panCardNumber: "",
      //  uploadPanCard: "",
      modeOfOperations: "",
      client_sourced_by: "",
      authorisePersonName: "",
      birthDate: "",
      soOrWo: "",
      designation: "",
      aadhaarNumber: "",
      uploadAadhaarCard: "",
      panCardNumberAuthorise: "",
      uploadPanCardAuthorise: "",
      document_type: "",
      document_name: "",
      document_no: "",
      upload_doc: "",
    };
    // reset({...obj});

    Object.keys(obj).forEach((key) => {
      // Check if the field key is not 'is_active' before clearing it

      setValue(key, "", {
        shouldValidate: false,
      });
    });

    setSelectedConstitutionOfClient({});
    setDefaultPanCardDetails({});
    setKycDetailsList([]);
    setOfficeAddressLists([]);
  };

  const autoFillForm = async () => {
    console.log("ljsjflks dfjsldkflk");
    setDisabledField(false);
    setHideCheckPanButton(false);

    if (details?.id) {
      const response = await fetchWareHouseClientById(details.id).unwrap();
      const form_details = response?.data;
      console.log(form_details?.office);

      // const office_arr = form_details?.office(el , index => {
      //   return {
      //     ...el,

      //   }
      // })

      setDetails(response?.data);
      console.log(response);
      let obj = {
        client_sourced_by: form_details?.client_sourced_by,
        clientType: form_details?.client_type,
        constitutionOfClient: {
          label: form_details?.constitution_of_client?.type_name,
          value: form_details?.constitution_of_client?.id,
        },

        panCard: form_details?.pan_card_type,
        kyc: form_details?.kyc,
        modeOfOperations: form_details?.mode_of_operations,
        nameOfClient: form_details?.name_of_client,
        nameOfCompany: form_details?.name_of_company,
        office: form_details?.office,
        panCardNumber: form_details?.pan_card_number,
        salesPersonFromGGTeam: form_details?.sales_person?.id,
        is_active: true,
        // is_active: form_details?.is_active,
      };

      setRejectReason(form_details?.l2_reasons || form_details?.l3_reasons);

      let auth_peson = {
        authorisePersonName: form_details?.authorised_person_name,
        soOrWo: form_details?.authorised_person_so_or_wo,
        birthDate: form_details?.authorised_person_birth_date,
        designation: form_details?.authorised_person_designation,
        aadhaarNumber: form_details?.authorised_person_aadhaar_number,
        uploadAadhaarCard: form_details?.authorised_person_upload_aadhaar_card,
        uploadPanCardAuthorise: form_details?.authorised_person_upload_pan_card,
        panCardNumberAuthorise: form_details?.authorised_person_pan_card_number,
      };

      let isFind = ["FPO", "LLP", "Company", "Partnership Firm"].includes(
        form_details?.constitution_of_client?.type_name
      );

      setSelectedConstitutionOfClient({
        label: form_details?.constitution_of_client?.type_name,
        value: form_details?.constitution_of_client?.id,
      });
      if (isFind) {
        obj = {
          ...obj,
          ...auth_peson,
        };
      }

      Object.keys(obj).forEach(function (key) {
        if (key !== "kyc" || key !== "office") {
          methods.setValue(key, obj[key], {
            shouldValidate: key === "client_sourced_by" ? false : true,
          });
        }
      });
      // officeAddressLists
      console.log(obj);
      const kyc = obj.kyc.map((el) => ({
        document_type: {
          label: el?.client_type_doc?.group_name,
          value: el?.client_type_doc?.group_id,
        },
        document_name: {
          label: el?.client_type_doc?.document_name,
          value: el?.client_type_doc?.id,
        },
        document_no: el?.document_number,
        document_expiry_date: el?.document_expiry_date,
        upload_doc: el?.document_path,
        id: el?.id,
      }));

      // console.log("kyc details on edit ---> ", kyc);

      let pan_details =
        kyc?.filter(
          (el) => el.document_type?.label === "Identity Proof - Pan Card"
        )[0] || {};
      console.log(pan_details);
      console.log(pan_details?.document_no);
      setValue("panCardNumber", pan_details?.document_no, {
        shouldValidate: true,
      });

      setKycDetailsList(kyc);
      setKycDetailsListCopy([...kyc]);

      console.log("obj?.office", obj);

      const office = obj?.office.map((el, index) => {
        let isSelected = el.is_default ? index : null;
        setSelectedCheckboxIndex(Number(isSelected));
        return {
          state: { label: el?.state?.state_name, value: el?.state?.id },
          mobile_no: el?.mobile_no.replace(/^\+91/, ""),
          office_address: el.office_address,
          email_addresses: el.email_addresses,
          gst_no: el.gst_no,
          upload_gst_certificate: el.upload_gst_certificate,
          is_default: el?.is_default,
        };
      });

      console.log("office details on edit ---> ", office);

      setOfficeAddressLists(office);
    }

    // console.log("test details field .", details);
  };

  // useMemo(() => {
  //   setKycDetailsListCopy([...kycDetailsList]);
  // }, [kycDetailsList]);

  useEffect(() => {
    //panCard
    setIsEditStateWiseDetails(details?.l3_user === null);

    if (details?.id) {
      autoFillForm();
    }
  }, []);

  useEffect(() => {
    const breadcrumbArray = [
      // {
      //   title: "Manage Warehouse",
      //   link: "/warehouse-master/warehouse-client-master",
      // },
      {
        title: "Warehouse Client Master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_MANAGE_CLIENT_WAREOUSE_CLIENT}`,
      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
  }, [details]);

  // Edit Form Fill Logic End

  const handleFileChange = (url, name) => {
    setValue(name, url, { shouldValidate: true });

    console.log("param --->", url, name);
  };

  useEffect(() => {
    setGetDoctypeQueryParams([]);
    console.log(selectedConstitutionOfClient);
    let isShow = authorizedPersonRequiredValues.includes(
      selectedConstitutionOfClient.label
    );

    let isShowing = depositorPersonRequiredValues.includes(
      selectedConstitutionOfClient.label
    );

    setIsShowAuthorisePersonDetails(isShow);
    setIsShowNameOfProperitor(isShowing);
    setGetDoctypeQueryParams((prev) => [
      ...prev,
      {
        filter: "client_type",
        client_type: selectedConstitutionOfClient.label,
      },
    ]);
  }, [selectedConstitutionOfClient]);

  useEffect(() => {
    getAllGGTSalesTeam();
    fetchConstitutionClient();
    getAllStates();
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log(value);
      console.log(name);
      console.log(type);

      if (name === "document_type") {
        setGetDoctypeQueryParams([
          {
            client_type: value?.constitutionOfClient?.label,
            filter: "client_type",
          },
          {
            filter: "group_id",
            group_id: value.document_type,
          },
        ]);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    console.log("getDoctypeQueryParams", getDoctypeQueryParams);
    if (getDoctypeQueryParams?.length > 0) {
      let queryParams = [];

      if (getDoctypeQueryParams?.length === 0) return;

      getDoctypeQueryParams.forEach((item) => {
        queryParams.push(`filter=${item.filter}`);
        queryParams.push(`${item.filter}=${item[item.filter]}`);
      });

      queryParams = Array.from(new Set(queryParams));

      const url = `?${queryParams.join("&")}`;

      console.log("queryParams ######", getDoctypeQueryParams);
      console.log("queryString ######", queryParams);

      getAllKycDocTypes(url);
    }
  }, [getDoctypeQueryParams]);

  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
  }, []);

  console.log("errors ---> ", errors);
  console.log("All form values  ---> ", getValues());

  const loginData = localStorageService.get("GG_ADMIN");

  // Input dissabled Logic Start
  const InputDisableFunction = () => {
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
      NotUser ||
      details?.status?.status_code === 1 ||
      details?.status?.status_code === 3 ||
      details?.status?.status_code === 4 ||
      details?.status?.status_code === 6 ||
      details?.status?.status_code === 7
        ? true
        : false;

    return result;
  };

  // Input Disabled Logic End

  // Reject Logic Start

  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState(false);

  const [
    UpdateAssignWarehouseClient,
    { isLoading: UpdateAssignWarehouseClientApiIsLoading },
  ] = useAssignWarehouseContarctMutation();

  const assignToMeFunction = async () => {
    const data = {
      id: details.id,
      status: "assigned",
      reasons: "",
    };

    try {
      const response = await UpdateAssignWarehouseClient(data).unwrap();
      console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        console.log("response --> ", response);

        showToastByStatusCode(200, "Warehouse Client Assign Successfully");
        autoFillForm();
        //  window.location.reload();
        // details = location.state?.details;
        // navigate(
        //   `${ROUTE_PATH.ALL_MASTER_MANAGE_MANAGE_CLIENT_WAREOUSE_CLIENT}`
        // );
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }

    console.log(data, "data");
  };

  const approvedToMeFunction = async () => {
    const data = {
      id: details.id,
      status: "approved",
      reasons: "",
    };

    try {
      const response = await UpdateAssignWarehouseClient(data).unwrap();
      console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        console.log("response --> ", response);

        showToastByStatusCode(200, "Warehouse Client Approved Successfully");
        navigate(
          `${ROUTE_PATH.ALL_MASTER_MANAGE_MANAGE_CLIENT_WAREOUSE_CLIENT}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data || error?.data?.message || "Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert(error);
    }

    console.log(data, "data");
  };

  const rejectedToMeFunction = async () => {
    const data = {
      id: details.id,
      status: "rejected",
      reasons: rejectReason || "reject",
    };

    try {
      const response = await UpdateAssignWarehouseClient(data).unwrap();
      console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        console.log("response --> ", response);
        showToastByStatusCode(200, response?.message);
        navigate(
          `${ROUTE_PATH.ALL_MASTER_MANAGE_MANAGE_CLIENT_WAREOUSE_CLIENT}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }

    console.log(data, "data");
  };

  // Reject Logic Start

  return (
    <>
      <Box bg="white" borderRadius={10} p="10">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Box
              isDisabled={disabledField}
              maxHeight="calc( 100vh - 285px )"
              overflowY="auto"
            >
              {/* Depositor Pan card number*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Depositor Pan card number{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }} alignItems="center">
                  <FormControl
                    isInvalid={errors?.panCardNumber}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      {...register("panCardNumber", {
                        setValueAs: (value) => value.toUpperCase(),
                      })}
                      className="pancardInput"
                      name="panCardNumber"
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={InputDisableFunction()}
                      // isDisabled={disabledField}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Depositor Pan card number"
                    />
                  </FormControl>
                  {errors && errors?.panCardNumber?.message && (
                    <Text textAlign="left" color="red">
                      {errors?.panCardNumber?.message}
                    </Text>
                  )}
                </GridItem>
                {hideCheckPanButton && (
                  <GridItem textAlign="left" colSpan={{ base: 1 }}>
                    <Button
                      type="button"
                      bg="#A6CE39"
                      _hover={{}}
                      color="white"
                      isLoading={checkPanDetailsApiIsLoading}
                      // isLoading={warehouseOwnerMasterCheckPanNumberApiIsLoading}
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
              {/*  Client Type*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Client Type
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <ReactSelect
                      {...register("clientType")}
                      name="clientType"
                      isDisabled={disabledField || InputDisableFunction()}
                      value={
                        clientTypesOptions?.filter(
                          (item) => item.value === getValues("clientType")
                        )[0] || {}
                      }
                      onChange={(val) => {
                        setValue("clientType", val?.value, {
                          shouldValidate: true,
                        });
                      }}
                      options={clientTypesOptions}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: errors?.clientType ? "red" : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/*  Sales Person from GG Team*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Sales Person from GG Team{" "}
                    {/* <Box as="span" color="red">
                      *
                    </Box>{" "} */}
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <ReactSelect
                      {...register("salesPersonFromGGTeam")}
                      name="salesPersonFromGGTeam"
                      value={
                        allSalesPersonGg?.filter(
                          (item) =>
                            item.value === getValues("salesPersonFromGGTeam")
                        )[0] || {}
                      }
                      onChange={(val) => {
                        setValue("salesPersonFromGGTeam", val?.value, {
                          shouldValidate: true,
                        });
                      }}
                      isDisabled={disabledField || InputDisableFunction()}
                      isLoading={getUserFreeMasterApiIsLoading}
                      options={allSalesPersonGg || []}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: errors?.salesPersonFromGGTeam
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
              {/*  Constitution of Client*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Constitution of Client{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <ReactSelect
                      isDisabled={disabledField || InputDisableFunction()}
                      {...register("constitutionOfClient")}
                      name="constitutionOfClient"
                      // value={
                      //   constitutionOfClientOptions?.filter(
                      //     (item) =>
                      //       item?.value ===
                      //       getValues("constitutionOfClient")?.value
                      //   )[0] || {}
                      // }
                      value={selectedConstitutionOfClient}
                      onChange={(val) => {
                        setSelectedConstitutionOfClient(val);
                        setValue("constitutionOfClient", val, {
                          shouldValidate: true,
                        });
                        console.log(
                          "defaultPanCardDetails",
                          defaultPanCardDetails
                        );
                        setIsKycEditState({
                          isEdit: false,
                          index: null,
                        });

                        clearKycForm();
                        if (JSON.stringify(defaultPanCardDetails) === "{}") {
                          setKycDetailsList([]);
                        } else {
                          setKycDetailsList([defaultPanCardDetails]);
                        }
                        // setKycDetailsList([...defaultPanCardDetails]);
                        //checkPanNUmber();
                      }}
                      isLoading={getConstitutionClientApiIsLoading}
                      options={constitutionOfClientOptions}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: errors?.constitutionOfClient
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
              {/* Name of Depositor*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Name of Depositor{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={errors?.nameOfClient}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      isDisabled={disabledField || InputDisableFunction()}
                      name="nameOfClient"
                      {...register("nameOfClient")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      // isDisabled={true}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Name of Depositor"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* Name of properietor*/}
              {isShowNameOfProperitor && (
                <>
                  <Grid
                    textAlign="right"
                    alignItems="center"
                    my="3"
                    templateColumns={templateColumns}
                    gap={5}
                  >
                    <GridItem colSpan={{ base: 1, lg: 0 }}>
                      <Text textAlign="right">
                        Name of properietor{" "}
                        {/* <Box as="span" color="red">
                      *
                    </Box> */}
                      </Text>{" "}
                    </GridItem>
                    <GridItem colSpan={{ base: 1 }}>
                      <FormControl
                        isInvalid={errors?.nameOfCompany}
                        style={{ w: commonWidth.w }}
                      >
                        <Input
                          isDisabled={disabledField || InputDisableFunction()}
                          name="nameOfCompany"
                          {...register("nameOfCompany")}
                          type="text"
                          border="1px"
                          borderColor="gray.10"
                          backgroundColor={"white"}
                          height={"15px "}
                          borderRadius={"lg"}
                          // isDisabled={true}
                          //value={inputValue}
                          //  onChange={onChange}
                          _placeholder={commonStyle._placeholder}
                          _hover={commonStyle._hover}
                          _focus={commonStyle._focus}
                          //  isDisabled={true}
                          p={{ base: "4" }}
                          fontWeight={{ base: "normal" }}
                          fontStyle={"normal"}
                          placeholder="Name of properietor"
                        />
                      </FormControl>
                      {errors?.nameOfCompany?.message && (
                        <Text color="red" textAlign="left" mx="1">
                          {errors?.nameOfCompany?.message}
                        </Text>
                      )}
                    </GridItem>
                  </Grid>
                </>
              )}
              {/*  Pan card*/}
              {/* <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Pan card{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <ReactSelect
                      isDisabled={disabledField || InputDisableFunction()}
                      value={
                        panCardOptions?.filter(
                          (item) => item.value === getValues("panCard")
                        )[0] || {}
                      }
                      onChange={(val) => {
                        setValue("panCard", val?.value, {
                          shouldValidate: true,
                        });
                      }}
                      options={panCardOptions}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: errors?.panCard ? "red" : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                  </FormControl>
                </GridItem>
              </Grid> */}

              {/* Upload Pan card */}
              {/* <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Upload Pan card </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FileUploadCmp
                    label=""
                    name="uploadPanCard"
                    isError={errors?.uploadPanCard}
                    type="application/pdf, image/jpeg, image/png, image/jpg"
                    placeholder="Choose a file"
                    allowedTypes={[
                      "application/pdf",
                      "image/jpeg",
                      "image/png",
                      "image/jpg",
                    ]}
                    value={getValues("uploadPanCard")}
                    fileName={getValues("uploadPanCard")}
                    clearFileName={getValues("uploadPanCard") === ""}
                    showDownloadIcon={true}
                    isMultipalUpload={false}
                    maxFileSize={1024 * 1024} // For example, 1MB (1024 bytes * 1024 bytes)
                    onChange={(url) => handleFileChange(url, "uploadPanCard")}
                  />
                </GridItem>
              </Grid> */}
              {/* Mode of operations*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Mode of operations{" "}
                    <Box as="span" color="red">
                      *
                    </Box>{" "}
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <ReactSelect
                      isDisabled={disabledField || InputDisableFunction()}
                      value={
                        modeOfOperationOptions?.filter(
                          (item) => item.value === getValues("modeOfOperations")
                        )[0] || {}
                      }
                      onChange={(val) => {
                        setValue("modeOfOperations", val?.value, {
                          shouldValidate: true,
                        });
                      }}
                      options={modeOfOperationOptions}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: errors?.modeOfOperations
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

              {/* Client Sourced by*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Client Sourced by{" "}
                    <Box as="span" color="red">
                      *
                    </Box>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={errors?.client_sourced_by}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      isDisabled={disabledField || InputDisableFunction()}
                      name="client_sourced_by"
                      {...register("client_sourced_by")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      // isDisabled={true}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Client Sourced by"
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              {/*Authorise person details  Authorise person details will be displayed if constitution of client is of type  FPO/LLP/Company/Partnership Firm  */}

              {isShowAuthorisePersonDetails && (
                <>
                  <Grid
                    textAlign="right"
                    alignItems="center"
                    my="3"
                    templateColumns={templateColumns}
                    gap={5}
                  >
                    <GridItem colSpan={{ base: 1, lg: 0 }}>
                      <Text textAlign="right">
                        Authorise person details{" "}
                        <Box as="span" color="red">
                          *
                        </Box>
                      </Text>{" "}
                    </GridItem>
                  </Grid>
                  {/* Authorise Person Name*/}
                  <Grid
                    textAlign="right"
                    alignItems="center"
                    my="3"
                    templateColumns={templateColumns}
                    gap={5}
                  >
                    <GridItem colSpan={{ base: 1, lg: 0 }}>
                      <Text textAlign="right">
                        Authorise Person Name{" "}
                        <Box as="span" color="red">
                          *
                        </Box>{" "}
                      </Text>{" "}
                    </GridItem>
                    <GridItem colSpan={{ base: 1 }}>
                      <FormControl
                        isInvalid={errors?.authorisePersonName}
                        style={{ w: commonWidth.w }}
                      >
                        <Input
                          isDisabled={disabledField || InputDisableFunction()}
                          name="authorisePersonName"
                          {...register("authorisePersonName")}
                          // {...register("authorisePersonName", {
                          //   required: isShowAuthorisePersonDetails,
                          // })}
                          type="text"
                          border="1px"
                          borderColor="gray.10"
                          backgroundColor={"white"}
                          height={"15px "}
                          borderRadius={"lg"}
                          // isDisabled={true}
                          //value={inputValue}
                          //  onChange={onChange}
                          _placeholder={commonStyle._placeholder}
                          _hover={commonStyle._hover}
                          _focus={commonStyle._focus}
                          //  isDisabled={true}
                          p={{ base: "4" }}
                          fontWeight={{ base: "normal" }}
                          fontStyle={"normal"}
                          placeholder="Authorise Person Name"
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                  {/* Birth Date*/}
                  <Grid
                    textAlign="right"
                    alignItems="center"
                    my="3"
                    templateColumns={templateColumns}
                    gap={5}
                  >
                    <GridItem colSpan={{ base: 1, lg: 0 }}>
                      <Text textAlign="right">
                        Birth Date{" "}
                        <Box as="span" color="red">
                          *
                        </Box>
                      </Text>{" "}
                    </GridItem>
                    <GridItem colSpan={{ base: 1 }}>
                      <FormControl
                        isInvalid={errors?.birthDate}
                        style={{ w: commonWidth.w }}
                      >
                        <Input
                          isDisabled={disabledField || InputDisableFunction()}
                          name="birthDate"
                          {...register("birthDate")}
                          // {...register("birthDate", {
                          //   required: isShowAuthorisePersonDetails,
                          // })}
                          type="date"
                          border="1px"
                          borderColor="gray.10"
                          backgroundColor={"white"}
                          height={"15px "}
                          borderRadius={"lg"}
                          // isDisabled={true}
                          //value={inputValue}
                          //  onChange={onChange}
                          _placeholder={commonStyle._placeholder}
                          _hover={commonStyle._hover}
                          _focus={commonStyle._focus}
                          //  isDisabled={true}
                          p={{ base: "4" }}
                          fontWeight={{ base: "normal" }}
                          fontStyle={"normal"}
                          placeholder="Middle Name"
                        />
                      </FormControl>
                      {errors && errors?.birthDate?.message && (
                        <Text
                          // as="small"
                          // display="block"
                          textAlign="left"
                          color="red"
                        >
                          {errors?.birthDate?.message}
                        </Text>
                      )}
                    </GridItem>
                  </Grid>
                  {/* s/o or w/o*/}
                  <Grid
                    textAlign="right"
                    alignItems="center"
                    my="3"
                    templateColumns={templateColumns}
                    gap={5}
                  >
                    <GridItem colSpan={{ base: 1, lg: 0 }}>
                      <Text textAlign="right">
                        s/o or w/o{" "}
                        <Box as="span" color="red">
                          *
                        </Box>
                      </Text>{" "}
                    </GridItem>
                    <GridItem colSpan={{ base: 1 }}>
                      <FormControl
                        isInvalid={errors?.soOrWo}
                        style={{ w: commonWidth.w }}
                      >
                        <Input
                          isDisabled={disabledField || InputDisableFunction()}
                          name="soOrWo"
                          {...register("soOrWo")}
                          // {...register("soOrWo", {
                          //   required: isShowAuthorisePersonDetails,
                          // })}
                          type="text"
                          border="1px"
                          borderColor="gray.10"
                          backgroundColor={"white"}
                          height={"15px "}
                          borderRadius={"lg"}
                          // isDisabled={true}
                          //value={inputValue}
                          //  onChange={onChange}
                          _placeholder={commonStyle._placeholder}
                          _hover={commonStyle._hover}
                          _focus={commonStyle._focus}
                          //  isDisabled={true}
                          p={{ base: "4" }}
                          fontWeight={{ base: "normal" }}
                          fontStyle={"normal"}
                          placeholder="S/O Or W/O"
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                  {/* Designation*/}
                  <Grid
                    textAlign="right"
                    alignItems="center"
                    my="3"
                    templateColumns={templateColumns}
                    gap={5}
                  >
                    <GridItem colSpan={{ base: 1, lg: 0 }}>
                      <Text textAlign="right">
                        Designation{" "}
                        <Box as="span" color="red">
                          *
                        </Box>
                      </Text>{" "}
                    </GridItem>
                    <GridItem colSpan={{ base: 1 }}>
                      <FormControl
                        isInvalid={errors?.designation}
                        style={{ w: commonWidth.w }}
                      >
                        <Input
                          isDisabled={disabledField || InputDisableFunction()}
                          name="designation"
                          {...register("designation")}
                          // {...register("designation", {
                          //   required: isShowAuthorisePersonDetails,
                          // })}
                          type="text"
                          border="1px"
                          borderColor="gray.10"
                          backgroundColor={"white"}
                          height={"15px "}
                          borderRadius={"lg"}
                          // isDisabled={true}
                          //value={inputValue}
                          //  onChange={onChange}
                          _placeholder={commonStyle._placeholder}
                          _hover={commonStyle._hover}
                          _focus={commonStyle._focus}
                          //  isDisabled={true}
                          p={{ base: "4" }}
                          fontWeight={{ base: "normal" }}
                          fontStyle={"normal"}
                          placeholder="Designation"
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>

                  {/* Aadhaar number*/}
                  <Grid
                    textAlign="right"
                    alignItems="center"
                    my="3"
                    templateColumns={templateColumns}
                    gap={5}
                  >
                    <GridItem colSpan={{ base: 1, lg: 0 }}>
                      <Text textAlign="right">
                        Aadhaar number{" "}
                        <Box as="span" color="red">
                          *
                        </Box>
                      </Text>{" "}
                    </GridItem>
                    <GridItem colSpan={{ base: 1 }}>
                      <FormControl
                        isInvalid={errors?.aadhaarNumber}
                        style={{ w: commonWidth.w }}
                      >
                        <Input
                          isDisabled={disabledField || InputDisableFunction()}
                          name="aadhaarNumber"
                          {...register("aadhaarNumber")}
                          // {...register("aadhaarNumber", {
                          //   required: isShowAuthorisePersonDetails,
                          // })}
                          type="text"
                          border="1px"
                          borderColor="gray.10"
                          backgroundColor={"white"}
                          height={"15px "}
                          borderRadius={"lg"}
                          // isDisabled={true}
                          //value={inputValue}
                          //  onChange={onChange}
                          _placeholder={commonStyle._placeholder}
                          _hover={commonStyle._hover}
                          _focus={commonStyle._focus}
                          //  isDisabled={true}
                          p={{ base: "4" }}
                          fontWeight={{ base: "normal" }}
                          fontStyle={"normal"}
                          placeholder="Aadhaar Number"
                        />
                      </FormControl>

                      {errors?.aadhaarNumber?.message && (
                        <Text color="red" textAlign="left" mx="1">
                          {errors?.aadhaarNumber?.message}
                        </Text>
                      )}

                      {/* {errors?.aadhaarNumber && (
                        <FormErrorMessage>
                          {errors?.aadhaarNumber?.message}
                        </FormErrorMessage>
                      )} */}
                    </GridItem>
                  </Grid>
                  {/* Upload Aadhaar card  */}
                  <Grid
                    textAlign="right"
                    alignItems="center"
                    my="3"
                    templateColumns={templateColumns}
                    gap={5}
                  >
                    <GridItem colSpan={{ base: 1, lg: 0 }}>
                      <Text textAlign="right">
                        Upload Aadhaar card 123
                        <Box as="span" color="red">
                          *
                        </Box>
                      </Text>{" "}
                    </GridItem>
                    <GridItem colSpan={{ base: 1 }}>
                      <FileUploadCmp
                        label=""
                        isDisabled={disabledField || InputDisableFunction()}
                        name="uploadAadhaarCard"
                        isRequired={isShowAuthorisePersonDetails}
                        fileuplaod_folder_structure={{
                          type: "master",
                          subtype: "Warehouse Client Master",
                        }}
                        isError={errors?.uploadAadhaarCard}
                        type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword"
                        defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                        placeholder="Choose a file"
                        showDownloadIcon={true}
                        allowedTypes={[
                          "application/pdf",
                          "image/jpeg",
                          "image/png",
                          "image/jpg",
                          "application/msword",
                        ]}
                        value={getValues("uploadAadhaarCard")}
                        fileName={getValues("uploadAadhaarCard")}
                        clearFileName={getValues("uploadAadhaarCard") === ""}
                        isMultipalUpload={false}
                        maxFileSize={1024 * 1024} // For example, 1MB (1024 bytes * 1024 bytes)
                        onChange={(url) =>
                          handleFileChange(url, "uploadAadhaarCard")
                        }
                      />
                    </GridItem>
                  </Grid>
                  {/*Pan card number  */}
                  <Grid
                    textAlign="right"
                    alignItems="center"
                    my="3"
                    templateColumns={templateColumns}
                    gap={5}
                  >
                    <GridItem colSpan={{ base: 1, lg: 0 }}>
                      <Text textAlign="right">
                        Pan card number{" "}
                        <Box as="span" color="red">
                          *
                        </Box>
                      </Text>{" "}
                    </GridItem>
                    <GridItem colSpan={{ base: 1 }}>
                      <FormControl
                        isInvalid={errors?.panCardNumberAuthorise}
                        style={{ w: commonWidth.w }}
                      >
                        <Input
                          isDisabled={disabledField || InputDisableFunction()}
                          name="panCardNumberAuthorise"
                          {...register("panCardNumberAuthorise", {
                            setValueAs: (value) => value.toUpperCase(),
                          })}
                          // {...register("panCardNumberAuthorise", {
                          //   required: isShowAuthorisePersonDetails,
                          // })}
                          type="text"
                          className="pancardInput"
                          border="1px"
                          borderColor="gray.10"
                          backgroundColor={"white"}
                          height={"15px "}
                          borderRadius={"lg"}
                          // isDisabled={true}
                          //value={inputValue}
                          //  onChange={onChange}
                          _placeholder={commonStyle._placeholder}
                          _hover={commonStyle._hover}
                          _focus={commonStyle._focus}
                          //  isDisabled={true}
                          p={{ base: "4" }}
                          fontWeight={{ base: "normal" }}
                          fontStyle={"normal"}
                          placeholder="Pan card number"
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                  {/* Upload Pan card   */}
                  <Grid
                    textAlign="right"
                    alignItems="center"
                    my="3"
                    templateColumns={templateColumns}
                    gap={5}
                  >
                    <GridItem colSpan={{ base: 1, lg: 0 }}>
                      <Text textAlign="right">
                        Upload Pan card 123{" "}
                        <Box as="span" color="red">
                          *
                        </Box>
                      </Text>{" "}
                    </GridItem>
                    <GridItem colSpan={{ base: 1 }}>
                      <FileUploadCmp
                        isDisabled={disabledField || InputDisableFunction()}
                        label=""
                        name="uploadPanCardAuthorise"
                        isRequired={isShowAuthorisePersonDetails}
                        isError={errors?.uploadPanCardAuthorise}
                        fileuplaod_folder_structure={{
                          type: "master",
                          subtype: "Warehouse Client Master",
                        }}
                        type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword"
                        defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                        placeholder="Choose a file"
                        showDownloadIcon={true}
                        allowedTypes={[
                          "application/pdf",
                          "image/jpeg",
                          "image/png",
                          "image/jpg",
                          "application/msword",
                        ]}
                        value={getValues("uploadPanCardAuthorise")}
                        isMultipalUpload={false}
                        maxFileSize={1024 * 1024} // For example, 1MB (1024 bytes * 1024 bytes)
                        onChange={(url) =>
                          handleFileChange(url, "uploadPanCardAuthorise")
                        }
                      />
                    </GridItem>
                  </Grid>
                </>
              )}

              {/* KYC details start here */}

              <Box bgColor={"#DBFFF5"} p={5} borderRadius={"10px"}>
                {/*State wise Office  details*  */}
                <Grid
                  alignItems="center"
                  templateColumns="repeat(3, 1fr)"
                  gap={5}
                >
                  <GridItem colSpan={3}>
                    <Text
                      textAlign="left"
                      color={"#212121"}
                      fontWeight={"bold"}
                    >
                      KYC Details{" "}
                      <Box as="span" color="red">
                        *
                      </Box>
                    </Text>{" "}
                  </GridItem>
                  {/* -------------- Document type -------------- */}
                  <Box>
                    <Text my={1}>Document type</Text>{" "}
                    <Box>
                      <FormControl style={{ w: commonWidth.w }}>
                        <ReactSelect
                          isDisabled={disabledField || InputDisableFunction()}
                          value={
                            documentTypesOptions?.filter(
                              (item) =>
                                item.value === getValues("document_type")
                            )[0] || {}
                          }
                          onChange={(val) => onChangeDocumentType(val)}
                          options={documentTypesOptions}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              backgroundColor: "#fff",
                              borderRadius: "6px",
                              borderColor: errors?.document_type
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

                  {/* -------------- Document Name -------------- */}
                  <Box>
                    <Text my={1}>Document Name</Text>{" "}
                    <Box>
                      <FormControl style={{ w: commonWidth.w }}>
                        <ReactSelect
                          isDisabled={disabledField || InputDisableFunction()}
                          value={
                            documentNamesOptions?.filter(
                              (item) =>
                                item.value === getValues("document_name")
                            )[0] || {}
                          }
                          onChange={(val) => {
                            setValue("document_name", val?.value, {
                              shouldValidate: true,
                            });
                          }}
                          options={documentNamesOptions}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              backgroundColor: "#fff",
                              borderRadius: "6px",
                              borderColor: errors?.document_name
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

                  {/* ------ Document No ------------- */}
                  <Box position="relative">
                    <Text my={1}> Document No </Text>{" "}
                    <Box>
                      <FormControl
                        isInvalid={errors?.document_no}
                        style={{ w: commonWidth.w }}
                      >
                        <Input
                          isDisabled={disabledField || InputDisableFunction()}
                          type="text"
                          name="document_no"
                          {...register("document_no")}
                          border="1px"
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
                          placeholder="Document No "
                        />
                      </FormControl>
                    </Box>
                    {errors?.document_no?.message && (
                      <Text
                        position="absolute"
                        color="red"
                        textAlign="left"
                        mx="1"
                      >
                        {errors?.document_no?.message}
                      </Text>
                    )}
                  </Box>
                  {/* ------ Upload Document------------- */}
                  <Box>
                    <Text my={1}>Upload KYC Document</Text>{" "}
                    <Box>
                      <FileUploadCmp
                        isDisabled={disabledField || InputDisableFunction()}
                        label=""
                        name="upload_doc"
                        fileuplaod_folder_structure={{
                          type: "master",
                          subtype: "Warehouse Client Master",
                        }}
                        isError={errors?.upload_doc}
                        type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword"
                        defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                        placeholder="Choose a file"
                        fileName={getValues("upload_doc")}
                        clearFileName={getValues("upload_doc") === ""}
                        allowedTypes={[
                          "application/pdf",
                          "image/jpeg",
                          "image/png",
                          "image/jpg",
                          "application/msword",
                        ]}
                        isMultipalUpload={false}
                        maxFileSize={1024 * 1024} // For example, 1MB (1024 bytes * 1024 bytes)
                        onChange={(url) => handleFileChange(url, "upload_doc")}
                      />
                    </Box>
                  </Box>

                  {/* Add Button */}
                  <Box display="flex" gap={2} justifyContent="flex-end" px="0">
                    <Button
                      type="button"
                      isDisabled={disabledField || InputDisableFunction()}
                      //w="full"
                      backgroundColor={"primary.700"}
                      _hover={{ backgroundColor: "primary.700" }}
                      color={"white"}
                      borderRadius={"full"}
                      // isLoading={
                      //   addWareHouseClientApiIsLoading ||
                      //   updateWareHouseClientApiIsLoading
                      // }
                      px={"10"}
                      onClick={() => addUpdateKycDetails()}
                    >
                      {isKycEditState?.isEdit ? "Update" : "Add"}
                    </Button>
                  </Box>
                </Grid>
              </Box>
              {/* State wise Office  details* table start */}
              <TableContainer my="4">
                <Table color="#000">
                  <Thead bg="#dbfff5" border="1px" borderColor="#000">
                    <Tr style={{ color: "#000" }}>
                      <Th color="#000">Document type</Th>
                      <Th color="#000">Document Name</Th>
                      <Th color="#000">Document No</Th>

                      <Th color="#000">Download Document</Th>
                      <Th color="#000">Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {/* {chamberDetails &&
                    chamberDetails.map((item, i) => ( */}
                    {kycDetailsList &&
                      kycDetailsList?.length > 0 &&
                      kycDetailsList.map((kyc, i) => (
                        <Tr
                          key={`kyc_${i}`}
                          textAlign="center"
                          bg="white"
                          border="1px"
                          borderColor="#000"
                        >
                          <Td>{kyc?.document_type?.label} </Td>
                          <Td>{kyc?.document_name?.label}</Td>
                          <Td>{kyc?.document_no}</Td>

                          <Td>
                            <Box display="flex" alignItems="center" gap="3">
                              <Box color={"primary.700"}>
                                <DownloadFilesFromUrl
                                  details={{
                                    paths: [kyc?.upload_doc],
                                    fileName: kyc?.document_type?.label,
                                  }}
                                />
                                {/* 
                                <AiOutlineCloudDownload
                                  // color="#A6CE39"
                                  fontSize="26px"
                                  cursor="pointer"
                                  onClick={() => downloadKycDocument(kyc)}
                                  // media/docs/Screenshot_from_2023-09-08_12-48-12_hYRBQwN.png
                                /> */}
                              </Box>
                            </Box>
                          </Td>
                          <Td>
                            <Box display="flex" alignItems="center" gap="3">
                              <Flex gap="20px" justifyContent="center">
                                {kyc?.nonEditable === true ? (
                                  <></>
                                ) : (
                                  <>
                                    <Box color={"primary.700"}>
                                      <BiEditAlt
                                        color="#A6CE39"
                                        //  isDisabled={InputDisableFunction()}
                                        //   isDisabled={true}
                                        // disabled={true}
                                        fontSize="26px"
                                        cursor={
                                          disabledField ||
                                          InputDisableFunction()
                                            ? "not-allowed"
                                            : "pointer"
                                        }
                                        onClick={() => {
                                          if (
                                            !disabledField &&
                                            !InputDisableFunction()
                                          ) {
                                            onEditKycDetails(kyc, i);
                                          }
                                        }}
                                      />
                                    </Box>
                                    <Box color="red">
                                      <AiOutlineDelete
                                        cursor={
                                          disabledField ||
                                          InputDisableFunction()
                                            ? "not-allowed"
                                            : "pointer"
                                        }
                                        fontSize="26px"
                                        onClick={() => {
                                          if (
                                            !disabledField &&
                                            !InputDisableFunction()
                                          ) {
                                            removeKycDocument(i);
                                          }
                                        }}
                                      />
                                    </Box>
                                  </>
                                )}
                              </Flex>
                            </Box>
                          </Td>
                        </Tr>
                      ))}
                    {/* ))} */}
                    {kycDetailsList?.length === 0 && (
                      <Tr textAlign="center">
                        <Td colSpan="5" color="#000">
                          No record found
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
              <Box mb="4">
                {/* Download All Files Button */}
                <DownloadFilesFromUrl
                  details={{
                    paths: kycDetailsList.map((el) => el?.upload_doc),
                    fileName: "",
                  }}
                  label="Download All Files"
                />
              </Box>

              {/* KYC details end here */}

              {/* ================================================================================ */}

              {/* State wise Office  details Start* */}

              <Box bgColor={"#DBFFF5"} p={5} borderRadius={"10px"}>
                <>
                  <Box>
                    <Grid
                      alignItems="center"
                      templateColumns="repeat(3, 1fr)"
                      gap={5}
                    >
                      <GridItem colSpan={3}>
                        <Text
                          textAlign="left"
                          color={"#212121"}
                          fontWeight={"bold"}
                        >
                          State wise Office details*
                        </Text>{" "}
                      </GridItem>
                      {/* -------------- State -------------- */}
                      <Box>
                        <Text my={1}>State</Text>{" "}
                        <Box>
                          <FormControl style={{ w: commonWidth.w }}>
                            <ReactSelect
                              isDisabled={
                                isEditStateWiseDetails &&
                                (disabledField || InputDisableFunction())
                              }
                              value={
                                allStates?.filter(
                                  (item) =>
                                    item.value === getValues("state")?.value
                                )[0] || {}
                              }
                              onChange={(val) => {
                                setValue("state", val, {
                                  shouldValidate: true,
                                });
                              }}
                              options={allStates || []}
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
                        </Box>
                      </Box>
                      {/* ------Office address------------- */}
                      <Box>
                        <Text my={1}>Office address</Text>{" "}
                        <Box>
                          <FormControl
                            style={{ w: commonWidth.w }}
                            isInvalid={errors?.office_address}
                          >
                            <Input
                              isDisabled={
                                isEditStateWiseDetails &&
                                (disabledField || InputDisableFunction())
                              }
                              type="text"
                              name="office_address"
                              {...register("office_address")}
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
                              placeholder="Office address"
                            />
                          </FormControl>
                        </Box>
                      </Box>
                      {/* ------ E-mail addresses------------- */}
                      <Box>
                        <Text my={1}>E-mail addresses</Text>{" "}
                        <Box position="relative">
                          <FormControl
                            style={{ w: commonWidth.w }}
                            isInvalid={errors?.email_addresses}
                          >
                            <Input
                              isDisabled={
                                isEditStateWiseDetails &&
                                (disabledField || InputDisableFunction())
                              }
                              type="text"
                              name="email_addresses"
                              {...register("email_addresses")}
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
                              placeholder="E-mail addresses"
                            />
                          </FormControl>
                          {errors && errors?.email_addresses?.message && (
                            <Text
                              position="absolute"
                              textAlign="left"
                              color="red"
                            >
                              {errors?.email_addresses?.message}
                            </Text>
                          )}
                        </Box>
                      </Box>
                      {/* ------Mobile no------------- */}
                      <Box>
                        <Text my={1}>Mobile no </Text>{" "}
                        <Box position="relative">
                          <FormControl
                            style={{ w: commonWidth.w }}
                            isInvalid={errors?.mobile_no}
                          >
                            <Input
                              isDisabled={
                                isEditStateWiseDetails &&
                                (disabledField || InputDisableFunction())
                              }
                              type="text"
                              name="mobile_no"
                              {...register("mobile_no")}
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
                              placeholder="Mobile no"
                            />
                          </FormControl>
                          {errors && errors?.mobile_no?.message && (
                            <Text
                              position="absolute"
                              textAlign="left"
                              color="red"
                            >
                              {errors?.mobile_no?.message}
                            </Text>
                          )}
                        </Box>
                      </Box>
                      {/* ------ GST no------------- */}
                      <Box>
                        <Text my={1}> GST no</Text>{" "}
                        <Box position="relative">
                          <FormControl
                            style={{ w: commonWidth.w }}
                            isInvalid={errors?.gst_no}
                          >
                            <Input
                              isDisabled={
                                isEditStateWiseDetails &&
                                (disabledField || InputDisableFunction())
                              }
                              type="text"
                              name="gst_no"
                              {...register("gst_no")}
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
                              placeholder=" GST no"
                            />
                          </FormControl>
                          {errors && errors?.gst_no?.message && (
                            <Text
                              position="absolute"
                              textAlign="left"
                              color="red"
                            >
                              {errors?.gst_no?.message}
                            </Text>
                          )}
                        </Box>
                      </Box>
                      {/* ------ Upload GST certificate - ------------- */}
                      <Box>
                        <Text my={1}>Upload GST certificate</Text>{" "}
                        <Box>
                          <FormControl
                            style={{ w: commonWidth.w }}
                            // isInvalid={
                            //   chamberDetailsFormsMethod.formState.errors?.[
                            //     chamber_details_obj.chamber_sq_ft
                            //   ]?.type?.required
                            // }
                          >
                            {" "}
                            <FileUploadCmp
                              isDisabled={
                                isEditStateWiseDetails &&
                                (disabledField || InputDisableFunction())
                              }
                              label=""
                              name="upload_gst_certificate"
                              isError={errors?.upload_gst_certificate}
                              fileuplaod_folder_structure={{
                                type: "master",
                                subtype: "Warehouse Client Master",
                              }}
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
                              fileName={getValues("upload_gst_certificate")}
                              clearFileName={
                                getValues("upload_gst_certificate") === ""
                              }
                              isMultipalUpload={false}
                              value={getValues("upload_gst_certificate")}
                              maxFileSize={1024 * 1024} // For example, 1MB (1024 bytes * 1024 bytes)
                              onChange={(url) =>
                                handleFileChange(url, "upload_gst_certificate")
                              }
                            />
                            {/* <CustomFileInput
                              name=""
                              placeholder="Upload GST certificate
                        "
                              label=""
                              type=""
                              style={{
                                mb: 1,
                                mt: 1,
                              }}
                            /> */}
                          </FormControl>
                        </Box>
                      </Box>
                    </Grid>
                  </Box>
                  {/* Add Button */}
                  <Box
                    display="flex"
                    gap={2}
                    justifyContent="flex-end"
                    mt="2"
                    px="0"
                  >
                    <Button
                      isDisabled={
                        isEditStateWiseDetails &&
                        (disabledField || InputDisableFunction())
                      }
                      type="button"
                      //w="full"
                      backgroundColor={"primary.700"}
                      _hover={{ backgroundColor: "primary.700" }}
                      color={"white"}
                      borderRadius={"full"}
                      // isLoading={
                      //   addWareHouseClientApiIsLoading ||
                      //   updateWareHouseClientApiIsLoading
                      // }
                      px={"10"}
                      onClick={() => addEditOfficeAddress()}
                    >
                      {/* Add */}
                      {isOfficeAddressEditState.isEdit ? "Update" : "Add"}
                    </Button>
                  </Box>
                </>
              </Box>
              {/* State wise Office  details* table start */}
              <TableContainer mt="4">
                <Table color="#000">
                  <Thead bg="#dbfff5" border="1px" borderColor="#000">
                    <Tr style={{ color: "#000" }}>
                      <Th color="#000">Sr no</Th>
                      <Th color={"#000"}>Default Billing State</Th>

                      <Th color="#000">State</Th>
                      <Th color="#000">Office address</Th>
                      <Th color="#000">E-mail address (Group email )</Th>
                      <Th color="#000">Mobile no</Th>
                      <Th color="#000">Gst no</Th>
                      <Th color="#000">Download GST certificate</Th>
                      <Th color="#000">Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {officeAddressLists &&
                      officeAddressLists.map((item, index) => (
                        <Tr
                          key={`officeAddress_${index}`}
                          textAlign="center"
                          bg="white"
                          border="1px"
                          borderColor="#000"
                        >
                          <Td>{index + 1} </Td>

                          <Td textAlign={"center"}>
                            <Checkbox
                              // defaultChecked
                              border={"1px grey"}
                              colorScheme="CheckBoxPrimary"
                              size="lg"
                              // onChange={(e) =>
                              //   onCheck(e, ind, item.id, item.warehouse?.id)
                              // }

                              isChecked={selectedCheckboxIndex === index} // Check if current checkbox is selected
                              onChange={() => handleCheckboxChange(index)} // Handle checkbox change
                            >
                              {/* {index + 1} */}
                            </Checkbox>
                          </Td>
                          <Td>{item.state.label} </Td>
                          <Td>{item.office_address} </Td>
                          <Td>{item.email_addresses}</Td>
                          <Td>{item.mobile_no}</Td>
                          <Td>{item.gst_no}</Td>

                          <Td>
                            <Box display="flex" alignItems="center" gap="3">
                              <Box color={"primary.700"}>
                                <DownloadFilesFromUrl
                                  details={{
                                    paths: [item?.upload_gst_certificate],
                                    fileName: "gst",
                                  }}
                                />
                              </Box>
                            </Box>
                          </Td>
                          <Td>
                            <Box display="flex" alignItems="center" gap="3">
                              <Flex gap="20px" justifyContent="center">
                                <Box color={"primary.700"}>
                                  <BiEditAlt
                                    // color="#A6CE39"
                                    fontSize="26px"
                                    cursor={
                                      isEditStateWiseDetails &&
                                      (disabledField || InputDisableFunction())
                                        ? "not-allowed"
                                        : "pointer"
                                    }
                                    onClick={() => {
                                      if (
                                        !disabledField &&
                                        !InputDisableFunction()
                                      ) {
                                        onEditOfficeAddressDetail(item, index);
                                      }
                                      if (!isEditStateWiseDetails) {
                                        onEditOfficeAddressDetail(item, index);
                                      }
                                    }}
                                  />
                                </Box>
                                <Box color="red">
                                  <AiOutlineDelete
                                    fontSize="26px"
                                    cursor={
                                      isEditStateWiseDetails &&
                                      (disabledField || InputDisableFunction())
                                        ? "not-allowed"
                                        : "pointer"
                                    }
                                    onClick={() => {
                                      if (
                                        !disabledField &&
                                        !InputDisableFunction()
                                      ) {
                                        removeOfficeAddress(index);
                                      }
                                      if (!isEditStateWiseDetails) {
                                        removeOfficeAddress(index);
                                      }
                                    }}
                                  />
                                </Box>
                              </Flex>
                            </Box>
                          </Td>
                        </Tr>
                      ))}
                    {officeAddressLists?.length === 0 && (
                      <Tr textAlign="center">
                        <Td colSpan="8" color="#000">
                          No record found
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
              {/*State wise Office  details* table end */}
              {/* State wise Office  details End* */}
              {/* ================================================================================ */}

              {/* <Box>
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                  mt="10px"
                >
                  <Text textAlign="right">Active</Text>
                  <CustomSwitch
                    isDisabled={disabledField || InputDisableFunction()}
                    name="is_active"
                    {...register("is_active")}
                    // type="switch"

                    onChange={(e) => {
                      console.log("on change", e.target.checked);
                      setValue("is_active", e?.target?.checked, {
                        shouldValidate: false,
                      });
                    }}
                    label=""
                    style={{
                      mb: 1,
                      mt: 1,
                    }}
                    isChecked={initialIsActive}
                  />
                </Grid>
              </Box> */}

              {/* Start Logic For Button  */}
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
                          Maker name{" "}
                          <Box as="span" color="red">
                            *
                          </Box>
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
                        <Text textAlign="right">
                          Maker mobile no{" "}
                          <Box as="span" color="red">
                            *
                          </Box>
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
                            value={details?.l1_user?.phone || ""}
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
                {Number(details?.status?.status_code || 0) > 2 ? (
                  <>
                    <Grid
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">
                          Checker name{" "}
                          <Box as="span" color="red">
                            *
                          </Box>
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
                            value={details?.l2_user?.employee_name || ""}
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
                        <Text textAlign="right">
                          Checker mobile no{" "}
                          <Box as="span" color="red">
                            *
                          </Box>
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
                            value={details?.l2_user?.phone || ""}
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
                {Number(details?.status?.status_code || 0) > 5 ? (
                  <>
                    <Grid
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">
                          Reviewer name{" "}
                          <Box as="span" color="red">
                            *
                          </Box>
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
                            value={details?.l3_user?.employee_name || ""}
                            //  isDisabled={true}
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
                        <Text textAlign="right">
                          Reviewer mobile no{" "}
                          <Box as="span" color="red">
                            *
                          </Box>
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
                    {details?.last_updated_user?.employee_name && (
                      <Grid
                        textAlign="right"
                        alignItems="center"
                        my="3"
                        templateColumns={templateColumns}
                        gap={5}
                      >
                        <GridItem colSpan={{ base: 1, lg: 0 }}>
                          <Text textAlign="right">
                            Last Updated User{" "}
                            <Box as="span" color="red">
                              *
                            </Box>
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
                              value={details?.last_updated_user?.employee_name}
                              //  isDisabled={true}
                              p={{ base: "4" }}
                              fontWeight={{ base: "normal" }}
                              fontStyle={"normal"}
                              placeholder="Last Updated User"
                            />
                          </Box>
                        </GridItem>
                      </Grid>
                    )}
                  </>
                ) : (
                  <></>
                )}
                {Number(details?.status?.status_code || 0) === 2 ||
                Number(details?.status?.status_code || 0) === 5 ||
                Number(details?.status?.status_code || 0) === 4 ||
                Number(details?.status?.status_code || 0) === 7 ? (
                  <Box>
                    <Grid
                      textAlign="right"
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">
                          Reason for rejection{" "}
                          <Box as="span" color="red">
                            *
                          </Box>
                        </Text>{" "}
                      </GridItem>
                      {console.log(rejectReason, "hiii")}
                      <GridItem colSpan={{ base: 1 }}>
                        <Box>
                          <Input
                            type="text"
                            border="1px"
                            borderColor={rejectError ? "red" : "gray.10"}
                            backgroundColor={"white"}
                            height={"15px "}
                            isDisabled={
                              Number(details?.status?.status_code || 0) === 4 ||
                              Number(details?.status?.status_code || 0) === 7
                            }
                            borderRadius={"lg"}
                            onChange={(e) => {
                              setRejectReason(e.target.value);
                            }}
                            value={rejectReason}
                            // isDisabled={InputDisableFunction()}
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
                    isLoading={UpdateAssignWarehouseClientApiIsLoading}
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
                {Number(details?.status?.status_code || 0) === 2 ||
                Number(details?.status?.status_code || 0) === 5 ? (
                  <>
                    <Button
                      type="button"
                      // type="submit"
                      //w="full"
                      // isDisabled={InputDisableFunction()}
                      backgroundColor={"white"}
                      _hover={{ backgroundColor: "white" }}
                      color={"#F82F2F"}
                      borderRadius={"full"}
                      border="1px solid #F82F2F"
                      onClick={() => {
                        if (rejectReason?.length > 0) {
                          rejectedToMeFunction();
                          setRejectError(false);
                        } else {
                          setRejectError(true);
                        }
                      }}
                      // isDisabled={rejectReason || !view ? false : true}
                      isLoading={UpdateAssignWarehouseClientApiIsLoading}
                      px={"10"}
                    >
                      Reject
                    </Button>
                    <Button
                      type="submit"
                      // onClick={() => {
                      //   ApproveRejectFunction({ status: "approved" });
                      // }}
                      backgroundColor={"primary.700"}
                      _hover={{ backgroundColor: "primary.700" }}
                      color={"white"}
                      // isDisabled={InputDisableFunction()}
                      borderRadius={"full"}
                      isLoading={
                        UpdateAssignWarehouseClientApiIsLoading ||
                        updateWareHouseClientApiIsLoading
                      }
                      px={"10"}
                    >
                      Approve
                    </Button>
                  </>
                ) : (
                  <></>
                )}
                {Number(details?.status?.status_code || 0) < 1 ||
                Number(details?.status?.status_code || 0) == 6 ? (
                  <Button
                    type="submit"
                    //w="full"
                    isLoading={
                      addWareHouseClientApiIsLoading ||
                      updateWareHouseClientApiIsLoading
                    }
                    isDisabled={disabledField || pageView}
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

              {/* End Logic For Button */}
            </Box>
          </form>
        </FormProvider>
      </Box>
    </>
  );
};

export default AddEditWareHouseClientMaster;

// ! commented un used toast alert function ..
// const toasterAlert_old = (errorObj) => {
//   if (!errorObj) {
//     console.error("Invalid input object: ", errorObj);
//     return;
//   }

//   console.log(errorObj);

//   const { status, message, data } = errorObj;

//   if (status && message) {
//     showToastByStatusCode(status, message);
//   } else {
//     console.error("Invalid status or message:", status, message);
//   }

//   if (data && typeof data === "object") {
//     const errorMessages = [];

//     for (const key in data) {
//       if (data.hasOwnProperty(key) && Array.isArray(data[key])) {
//         data[key].forEach((message) => {
//           errorMessages.push(`${key} : ${message}`);
//         });
//       }
//     }

//     if (errorMessages?.length > 0) {
//       showToastByStatusCode(status || 400, errorMessages.join("\n"));
//     }
//   }
// };

// function toasterAlert(errorResponse) {
//   const errorMessage = [];
//   console.log("error message:", errorResponse);

//   if (errorResponse && Array.isArray(errorResponse?.data?.message)) {
//     errorMessage.push(...errorResponse.data.message);
//   } else {
//     showToastByStatusCode(400, errorResponse?.data?.message);
//     return;
//   }

//   // Check if there are any error messages
//   if (errorMessage.length > 0) {
//     // Handle the error messages, e.g., display them to the user
//     // console.error("API Error:", errorMessage);
//     showToastByStatusCode(400, errorMessage.join("\n"));
//   } else {
//     console.error("Unknown API Error");
//     showToastByStatusCode(400, "Something went wrong !");
//   }
// }

// // Example usage:
// const apiErrorResponse = {
//   "message": [],
//   "data": {
//     "kyc": [
//       {},
//       {},
//       {
//         "document_number": ["client kyc with this Document Number already exists."],
//       },
//       {},
//       {},
//       {},
//     ],
//   },
//   "status": 400,
// };

// handleApiError(apiErrorResponse);

function validateOfficeAddressFormData(formData) {
  const validationSchema = yup.object().shape({
    state: yup
      .object()
      .shape({
        label: yup.string().required(() => null),
        value: yup.number().required(() => null),
      })
      .required(() => null),
    office_address: yup.string().required(() => null),
    email_addresses: yup
      .string()
      // .email("Invalid email address")
      .required(() => null),
    mobile_no: yup
      .string()
      .matches(/^\d{10}$/, "Invalid mobile number")
      .required(() => null),
    gst_no: yup
      .string()
      .trim()
      .matches(
        /^[0-9A-Z]{15}$/i,
        "Enter a valid GST Number in the format 09AAACH7409R1ZZ"
      )
      .trim()
      .required(() => null),
    // gst_no: yup
    //   .string()
    //   .trim()
    //   .required("GST Number is required")
    //   .matches(
    //     /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[0-9A-Z]{1}$/,
    //     "Enter a valid GST Number in the format 09AAACH7409R1ZZ"
    //   ),

    // gst_no: yup
    //   .string()
    //   .trim()
    //   .required("GST Number is required")
    //   .matches(
    //     /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[0-9A-Z]{1}$/,
    //     "Enter a valid GST Number in the format 09AAACH7409R1ZZ"
    //   ),

    upload_gst_certificate: yup.string().required(() => null),
  });

  try {
    validationSchema.validateSync(formData, { abortEarly: false });
  } catch (errors) {
    const validationErrors = {};

    errors.inner.forEach((error) => {
      validationErrors[error.path] = error.message;
    });

    throw validationErrors;
  }
}
