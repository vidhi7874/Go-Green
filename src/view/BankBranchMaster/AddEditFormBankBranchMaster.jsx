/* eslint-disable no-useless-escape */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Text,
  Image,
  TableContainer,
  Table,
  Thead,
  Tr,
  Tbody,
  Td,
  Th,
  Grid,
  Input,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import generateFormField from "../../components/Elements/GenerateFormField";
import {
  useAddBankBranchMasterMutation,
  useGetBankMasterFreeMutation,
  useUpdateBankBranchMasterMutation,
} from "../../features/master-api-slice";
import { addEditFormFields, schema } from "./fields";
import { MotionSlideUp } from "../../utils/animation";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import CustomTextArea from "../../components/Elements/CustomTextArea";
import CustomSwitch from "../../components/Elements/CustomSwitch";
import CustomInput from "../../components/Elements/CustomInput";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import { useFetchLocationDrillDownFreeMutation } from "../../features/warehouse-proposal.slice";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import CustomFileInput from "../../components/Elements/CustomFileInput";
import { BiEditAlt } from "react-icons/bi";
import moment from "moment";
import DownloadFilesFromUrl from "../../components/DownloadFileFromUrl";
import ROUTE_PATH from "../../constants/ROUTE";
import configuration from "../../config/configuration";
import FileUploadCmp from "../../components/Elements/FileUploadCmp";

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

const mobileNumberRegex = /^\+91\d{10}$/;

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function AddEditFormBankBranchMaster() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const details = location.state?.details;
  console.log("details-->", details);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_active: !details?.id, // Set is_active to true only when adding
      branch_contact_detail: [],
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);

  const initialIsActive = details ? details.is_active : true;
  const {
    setValue,
    getValues,
    formState: { errors },
  } = methods;

  const [selectBoxOptions, setSelectBoxOptions] = useState({
    earthQuack: [],
    regions: [],
    substate: [],
    districts: [],
    states: [],
    banks: [],
    areas: [],
  });
  const handleFileChange = (url, name) => {
    setValue(name, url, { shouldValidate: true });
  };
  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);

  // for clear data in form

  // Form Submit Function Start
  const onSubmit = (data) => {
    // console.log("data==>", data);
    let isValid =
      Array.isArray(data?.branch_contact_detail) &&
      data?.branch_contact_detail.length === 1 &&
      Object.keys(data?.branch_contact_detail[0]).length === 0;
    // console.log("details", details);
    console.log(isValid);
    if (details?.id) {
      // Assign the array
      // Your code to handle a valid array structure goes here
      console.log("Valid array structure");
      let dataObj = {
        ...data,
        id: details.id,
        branch_contact_detail: isValid ? [] : [...data?.branch_contact_detail],
      };
      updateData(dataObj);
    } else {
      let dataObj = {
        ...data,
        branch_contact_detail: isValid ? [] : [...data?.branch_contact_detail],
      };
      addData(dataObj);
    }
  };
  // Form Submit Function End

  // for clear data in form
  const clearForm = () => {
    const defaultValues = methods.getValues();
    if (details?.id) {
      Object.keys(defaultValues).forEach((key) => {
        // Check if the field key is not 'is_active' before clearing it
        if (key === "is_active" || key === "branch_contact_detail") {
        } else {
          setValue(key, "", {
            shouldValidate: true,
          });
        }
      });
    } else {
      Object.keys(defaultValues).forEach((key) => {
        // Check if the field key is not 'is_active' before clearing it
        if (key === "is_active") {
        }
        if (key === "branch_contact_detail") {
          setValue(
            key,
            [
              {
                person_rank: 1,
              },
            ],
            {
              shouldValidate: true,
            }
          );
        } else {
          setValue(key, "", {
            shouldValidate: true,
          });
        }
      });
    }
  };
  // Form Clear Function End

  // Add BankBranch Api Start
  const [addBankBranchMaster, { isLoading: addBankBranchMasterApiIsLoading }] =
    useAddBankBranchMasterMutation();

  const addData = async (data) => {
    try {
      const response = await addBankBranchMaster(data).unwrap();
      // console.log("add bank branch master res", response);
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_BANKS_BANK_BRANCH}`);
      }
    } catch (error) {
      console.log("Error: " + error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Bank Branch Adding is Failed";
      console.log("Error:", errorMessage);
      // console.log("errorMessage:", error?.data?.message);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };
  // Add BankBranch Api End

  // Update BankBranch Api Start
  const [
    updateBankBranchMaster,
    { isLoading: updateBankBranchMasterApiIsLoading },
  ] = useUpdateBankBranchMasterMutation();

  const updateData = async (data) => {
    try {
      const response = await updateBankBranchMaster(data).unwrap();
      if (response.status === 200) {
        // console.log("update bank branch master res", response);
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_BANKS_BANK_BRANCH}`);
      }
    } catch (error) {
      console.log("Error:", error);

      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        "Bank Branch Updating is Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };
  // Update BankBranch Api End

  const getBankBranch = async () => {
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

  //bank master free api calling
  const [getBankMaster] = useGetBankMasterFreeMutation();

  const getBankMasterList = async () => {
    try {
      const response = await getBankMaster().unwrap();
      // console.log("Success:", response);
      let onlyActive = response?.results?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.bank_name,
        value: item.id,
        region: item.region,
        state: item.state,
      }));

      console.log(arr);

      if (details?.bank?.is_active === false) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          banks: [
            ...arr,
            {
              label: details?.bank?.bank_name,
              value: details?.bank?.id,
            },
          ],
        }));
      } else {
        setSelectBoxOptions((prev) => ({
          ...prev,
          banks: arr,
        }));
      }

      console.log(details, "getBankMasterList");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [viewForm, setViewForm] = useState(false);
  //bank master free api calling end

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
      // console.log("fetchLocationDrillDown response :", response);

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

  const stateOnChange = async (val) => {
    // console.log("value --> ", val);
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

      const arr = response?.substate
        ?.filter((item) => item.substate_name !== "All - Zone")
        .map(({ substate_name, id }) => ({
          label: substate_name,
          value: id,
        }));

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

  const areaOnChange = (val) => {
    setValue("area", val?.value, {
      shouldValidate: true,
    });
  };
  // Region State  Zone District Area  onChange drill down api end //
  //auth person 1 start

  const [isNewCmRate, setIsNewCmRate] = useState(false);

  const [bankDetail, setBankDetail] = useState({
    id: null,
    rank: 1,
    name: "",
    contact: "",
    email: "",
    start_date: "",
    end_date: "",
    agreement: "",
  });

  const [bankError, setBankError] = useState({
    name: "",
    contact: "",
    email: "",
    start_date: "",
    end_date: "",
    agreement: "",
  });

  const bankErrorMessage = () => {
    setBankError((old) => ({
      name: bankDetail.name === "" ? "error" : "",
      contact:
        bankDetail.contact === ""
          ? "error"
          : mobileNumberRegex.test(bankDetail.contact)
          ? ""
          : "Please enter a valid number",
      email:
        bankDetail.email === ""
          ? "error"
          : emailRegex.test(bankDetail.email)
          ? ""
          : "Please enter a valid email",
      start_date: bankDetail.start_date === "" ? "error" : "",
      end_date: bankDetail.end_date === "" ? "error" : "",
      agreement: bankDetail.agreement === "" ? "error" : "",
    }));
  };

  const append_new_bank_details = () => {
    if (
      bankDetail.start_date !== "" &&
      bankDetail.end_date !== "" &&
      bankDetail.agreement !== "" &&
      bankDetail.name !== "" &&
      bankDetail.contact !== "" &&
      bankDetail.email !== "" &&
      mobileNumberRegex.test(bankDetail.contact) &&
      emailRegex.test(bankDetail.email)
    ) {
      const tempArr = getValues(`branch_contact_detail`);
      setValue(
        `branch_contact_detail`,
        [
          ...tempArr,
          {
            authorized_person_id: null,
            person_rank: 1,
            authorized_name: bankDetail.name,
            authorized_mobile_no: bankDetail.contact,
            authorized_email_id: bankDetail.email,
            valid_from: bankDetail.start_date,
            valid_to: bankDetail.end_date,
            signature_img_upload_path: bankDetail.agreement,
          },
        ],
        { shouldValidate: true }
      );
      setBankDetail({
        id: null,
        rank: 1,
        name: "",
        contact: "",
        email: "",
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
      id: data.authorized_person_id,
      rank: data.person_rank,
      name: data.authorized_name,
      contact: data.authorized_mobile_no,
      email: data.authorized_email_id,
      start_date: data.valid_from,
      end_date: data.valid_to,
      agreement: data.signature_img_upload_path,
    });
    setIsNewCmRate(false);
  };

  const UpdateBankDetail = () => {
    if (
      bankDetail.start_date !== "" &&
      bankDetail.end_date !== "" &&
      bankDetail.agreement !== "" &&
      bankDetail.name !== "" &&
      bankDetail.contact !== "" &&
      bankDetail.email !== "" &&
      mobileNumberRegex.test(bankDetail.contact) &&
      emailRegex.test(bankDetail.email)
    ) {
      const tempArr = getValues(`branch_contact_detail`);
      setValue(
        `branch_contact_detail`,
        [
          ...tempArr?.slice(0, updateBankFlag),
          {
            authorized_person_id: bankDetail.id,
            person_rank: 1,
            authorized_name: bankDetail.name,
            authorized_mobile_no: bankDetail.contact,
            authorized_email_id: bankDetail.email,
            valid_from: bankDetail.start_date,
            valid_to: bankDetail.end_date,
            signature_img_upload_path: bankDetail.agreement,
          },
          ...tempArr?.slice(updateBankFlag + 1),
        ],
        { shouldValidate: true }
      );
      setBankDetail({
        id: null,
        rank: 1,
        name: "",
        contact: "",
        email: "",
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
      bankDetail.start_date !== "" &&
      bankDetail.end_date !== "" &&
      bankDetail.agreement !== "" &&
      bankDetail.name !== "" &&
      bankDetail.contact !== "" &&
      bankDetail.email !== "" &&
      mobileNumberRegex.test(bankDetail.contact) &&
      emailRegex.test(bankDetail.email)
    ) {
      const tempArr = getValues(`branch_contact_detail`);
      if (tempArr) {
        setValue(
          `branch_contact_detail`,
          [
            ...tempArr?.slice(0, currentBankFlag),
            {
              authorized_person_id: bankDetail.id,
              person_rank: 1,
              authorized_name: bankDetail.name,
              authorized_mobile_no: bankDetail.contact,
              authorized_email_id: bankDetail.email,
              valid_from: bankDetail.start_date,
              valid_to: bankDetail.end_date,
              signature_img_upload_path: bankDetail.agreement,
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

  //auth person 1 end

  //auth person 2 start

  const [isNewCmRate2, setIsNewCmRate2] = useState(false);

  const [bankDetail2, setBankDetail2] = useState({
    id: null,
    rank: 2,
    name: "",
    contact: "",
    email: "",
    start_date: "",
    end_date: "",
    agreement: "",
  });

  const [bankError2, setBankError2] = useState({
    name: "",
    contact: "",
    email: "",
    start_date: "",
    end_date: "",
    agreement: "",
  });

  const bankErrorMessage2 = () => {
    setBankError2((old) => ({
      name: bankDetail2.name === "" ? "error" : "",
      contact:
        bankDetail2.contact === ""
          ? "error"
          : mobileNumberRegex.test(bankDetail2.contact)
          ? ""
          : "Please enter a valid number",
      email:
        bankDetail2.email === ""
          ? "error"
          : emailRegex.test(bankDetail2.email)
          ? ""
          : "Please enter a valid email",
      start_date: bankDetail2.start_date === "" ? "error" : "",
      end_date: bankDetail2.end_date === "" ? "error" : "",
      agreement: bankDetail2.agreement === "" ? "error" : "",
    }));
  };

  const append_new_bank_details2 = () => {
    if (
      bankDetail2.start_date !== "" &&
      bankDetail2.end_date !== "" &&
      bankDetail2.agreement !== "" &&
      bankDetail2.name !== "" &&
      bankDetail2.contact !== "" &&
      bankDetail2.email !== "" &&
      mobileNumberRegex.test(bankDetail2.contact) &&
      emailRegex.test(bankDetail2.email)
    ) {
      const tempArr = getValues(`branch_contact_detail`);
      setValue(
        `branch_contact_detail`,
        [
          ...tempArr,
          {
            authorized_person_id: null,
            person_rank: 2,
            authorized_name: bankDetail2.name,
            authorized_mobile_no: bankDetail2.contact,
            authorized_email_id: bankDetail2.email,
            valid_from: bankDetail2.start_date,
            valid_to: bankDetail2.end_date,
            signature_img_upload_path: bankDetail2.agreement,
          },
        ],
        { shouldValidate: true }
      );
      setBankDetail2({
        id: null,
        rank: 2,
        name: "",
        contact: "",
        email: "",
        start_date: "",
        end_date: "",
        agreement: "",
      });
    } else {
      bankErrorMessage2();
    }
  };

  const [updateBankFlag2, setUpdateBankFlag2] = useState(null);

  const [currentBankFlag2, setCurrentBankFlag2] = useState(null);

  const updateBankFlagFunction2 = (data, id) => {
    setUpdateBankFlag2(id);
    setBankDetail2({
      id: data.authorized_person_id,
      rank: data.person_rank,
      name: data.authorized_name,
      contact: data.authorized_mobile_no,
      email: data.authorized_email_id,
      start_date: data.valid_from,
      end_date: data.valid_to,
      agreement: data.signature_img_upload_path,
    });
    setIsNewCmRate2(false);
  };

  const UpdateBankDetail2 = () => {
    if (
      bankDetail2.start_date !== "" &&
      bankDetail2.end_date !== "" &&
      bankDetail2.agreement !== "" &&
      bankDetail2.name !== "" &&
      bankDetail2.contact !== "" &&
      bankDetail2.email !== "" &&
      mobileNumberRegex.test(bankDetail2.contact) &&
      emailRegex.test(bankDetail2.email)
    ) {
      const tempArr = getValues(`branch_contact_detail`);
      setValue(
        `branch_contact_detail`,
        [
          ...tempArr?.slice(0, updateBankFlag2),
          {
            authorized_person_id: bankDetail2.id,
            person_rank: 2,
            authorized_name: bankDetail2.name,
            authorized_mobile_no: bankDetail2.contact,
            authorized_email_id: bankDetail2.email,
            valid_from: bankDetail2.start_date,
            valid_to: bankDetail2.end_date,
            signature_img_upload_path: bankDetail2.agreement,
          },
          ...tempArr?.slice(updateBankFlag2 + 1),
        ],
        { shouldValidate: true }
      );
      setBankDetail2({
        id: null,
        rank: 2,
        name: "",
        contact: "",
        email: "",
        start_date: "",
        end_date: "",
        agreement: "",
      });
      setUpdateBankFlag2(null);
    } else {
      bankErrorMessage2();
    }
  };

  const CurrentUpdateBankDetail2 = () => {
    if (
      bankDetail2.start_date !== "" &&
      bankDetail2.end_date !== "" &&
      bankDetail2.agreement !== "" &&
      bankDetail2.name !== "" &&
      bankDetail2.contact !== "" &&
      bankDetail2.email !== "" &&
      mobileNumberRegex.test(bankDetail2.contact) &&
      emailRegex.test(bankDetail2.email)
    ) {
      const tempArr = getValues(`branch_contact_detail`);
      if (tempArr) {
        setValue(
          `branch_contact_detail`,
          [
            ...tempArr?.slice(0, currentBankFlag2),
            {
              authorized_person_id: bankDetail2.id,
              person_rank: 2,
              authorized_name: bankDetail2.name,
              authorized_mobile_no: bankDetail2.contact,
              authorized_email_id: bankDetail2.email,
              valid_from: bankDetail2.start_date,
              valid_to: bankDetail2.end_date,
              signature_img_upload_path: bankDetail2.agreement,
            },
            ...tempArr?.slice(currentBankFlag2 + 1),
          ],
          { shouldValidate: true }
        );
      }
    } else {
      bankErrorMessage2();
    }
  };

  useEffect(() => {
    if (isNewCmRate2) {
      CurrentUpdateBankDetail2();
    }
    // eslint-disable-next-line
  }, [bankDetail2]);

  //auth person 1 end

  // signature open function start

  const [imgPath, setImgPath] = useState("");

  const SignatureOpen = (path) => {
    setImgPath(path);
    onOpen();
  };

  // signature open function end

  // Update code end

  // Edit Form Fill Logic Start
  useEffect(() => {
    getRegionMasterList();
    getBankBranch();
    getBankMasterList();

    if (details?.id) {
      console.log(details)
      regionOnChange({ value: details?.region?.id });
      stateOnChange({ value: details?.state?.id });
      zoneOnChange({ value: details?.substate?.id });
      districtOnChange({ value: details?.district?.id });
      let obj = {
        branch_name: details.branch_name,
        bank: details?.bank?.id,
        region: details?.region?.id,
        state: details?.state?.id,
        substate: details.substate?.id,
        district: details.district?.id,
        area: details?.area?.id,
        branch_address: details.branch_address,
        pincode: details.pincode,
        group_email: details.group_email,
        authority_signature_letter: details?.authority_signature_letter,
        is_active: details.is_active,
        branch_contact_detail: details?.branch_contact_detail?.map((item) => ({
          ...item,
          authorized_person_id: item.id,
        })),
      };
      // console.log("details", details);
      // console.log("obj", obj);

      if (details?.current_branch_contact_detail?.length > 0) {
        for (let i = 0; i < details.current_branch_contact_detail.length; i++) {
          if (details.current_branch_contact_detail[i].person_rank === 1) {
            setIsNewCmRate(true);
            let result = -1;
            let maxId = -1;

            details?.branch_contact_detail?.forEach((item, index) => {
              if (
                item.id === details.current_branch_contact_detail[i].id &&
                item.id > maxId
              ) {
                result = index;
                maxId = item.id;
              }
            });

            setBankDetail((old) => ({
              ...old,
              id: details?.current_branch_contact_detail[i]?.id || "",
              rank: 1,
              name:
                details?.current_branch_contact_detail[i]?.authorized_name ||
                "",
              contact:
                details?.current_branch_contact_detail[i]
                  ?.authorized_mobile_no || "",
              email:
                details?.current_branch_contact_detail[i]
                  ?.authorized_email_id || "",
              start_date:
                details?.current_branch_contact_detail[i]?.valid_from || "",
              end_date:
                details?.current_branch_contact_detail[i]?.valid_to || "",
              agreement:
                details?.current_branch_contact_detail[i]
                  ?.signature_img_upload_path || "",
            }));

            if (result !== -1) {
              setCurrentBankFlag(result);
            }
          } else if (
            details.current_branch_contact_detail[i].person_rank === 2
          ) {
            setIsNewCmRate2(true);
            let result = -1;
            let maxId = -1;

            details?.branch_contact_detail?.forEach((item, index) => {
              if (
                item.id === details.current_branch_contact_detail[i].id &&
                item.id > maxId
              ) {
                result = index;
                maxId = item.id;
              }
            });

            setBankDetail2((old) => ({
              ...old,
              id: details?.current_branch_contact_detail[i]?.id || "",
              rank: 1,
              name:
                details?.current_branch_contact_detail[i]?.authorized_name ||
                "",
              contact:
                details?.current_branch_contact_detail[i]
                  ?.authorized_mobile_no || "",
              email:
                details?.current_branch_contact_detail[i]
                  ?.authorized_email_id || "",
              start_date:
                details?.current_branch_contact_detail[i]?.valid_from || "",
              end_date:
                details?.current_branch_contact_detail[i]?.valid_to || "",
              agreement:
                details?.current_branch_contact_detail[i]
                  ?.signature_img_upload_path || "",
            }));

            if (result !== -1) {
              setCurrentBankFlag2(result);
            }
          }
        }
      } else {
        setIsNewCmRate(false);
        setIsNewCmRate2(false);
      }

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }

    setViewForm(location?.state?.view || false);

    const breadcrumbArray = [
      // {
      //   title: "Manage Banks",
      //   link: "/bank-master/bank-branch-master",
      // },
      {
        title: "Bank Branch Master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_BANKS_BANK_BRANCH}`,
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
  // Edit Form Fill Logic End
  return (
    <Box bg="white" borderRadius={10} p="10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
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
                      Bank<span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="bank"
                      label=""
                      options={selectBoxOptions?.banks || []}
                      selectedValue={
                        selectBoxOptions?.banks?.filter(
                          (opt) => opt.value === getValues("bank")
                        )[0] || {}
                      }
                      handleOnChange={(val) => {
                        setValue("bank", val?.value, {
                          shouldValidate: true,
                        });
                        regionOnChange({ value: val?.region?.id });
                        stateOnChange({ value: val?.state?.id });
                      }}
                      isClearable={false}
                      selectType={"value"}
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
                      Region <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="region"
                      label=""
                      selectDisable={
                        viewForm ? true : getValues("bank") ? true : false
                      }
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
                      name="state"
                      selectDisable={
                        viewForm ? true : getValues("bank") ? true : false
                      }
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
                      Sub State <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="substate"
                      label=""
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

              <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                >
                  <Text textAlign="right">
                    District <span style={{ color: "red" }}>*</span>
                  </Text>{" "}
                  <ReactCustomSelect
                    selectDisable={viewForm}
                    name="district"
                    label=""
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
              </MotionSlideUp>

              <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                >
                  <Text textAlign="right">
                    Area <span style={{ color: "red" }}>*</span>
                  </Text>{" "}
                  <ReactCustomSelect
                    selectDisable={viewForm}
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
                  >
                    <Text textAlign="right">
                      Address <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomTextArea
                      InputDisable={viewForm}
                      name="branch_address"
                      placeholder=" Address"
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
                    <Text textAlign="right">
                      Pincode <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      name="pincode"
                      placeholder=" pincode"
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

              <Box mt="10px">
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Group E-mail id <span style={{ color: "red" }}>*</span>
                    </Text>
                    <Box>
                      <CustomInput
                        InputDisabled={viewForm}
                        name="group_email"
                        placeholder="Group E-mail"
                        type="text"
                        label=""
                        style={{
                          mb: 1,
                          mt: 1,
                        }}
                      />
                    </Box>
                  </Grid>
                </MotionSlideUp>
              </Box>

              <Box mt="4px">
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">authority signatory letter </Text>

                    <FileUploadCmp
                      isDisabled={viewForm}
                      label=""
                      name="authority_signature_letter"
                      isError={errors?.authority_signature_letter}
                      type="application/pdf, image/jpeg, image/png, image/jpg ,application/msword"
                      defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                      placeholder="Choose a file"
                      allowedTypes={[
                        "application/pdf",
                        "image/jpeg",
                        "image/png",
                        "image/jpg",
                        "application/msword",
                      ]}
                      fileName={getValues("authority_signature_letter")}
                      fileuplaod_folder_structure={{
                        type: "master",
                        subtype: "Bank Branch Master",
                      }}
                      clearFileName={
                        getValues("authority_signature_letter") === ""
                      }
                      value={getValues("authority_signature_letter")}
                      showDownloadIcon={true}
                      isMultipalUpload={false}
                      maxFileSize={1024 * 1024} // For example, 1MB (1024 bytes * 1024 bytes)
                      onChange={(url) =>
                        handleFileChange(url, "authority_signature_letter")
                      }
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {details?.id ? (
                <></>
              ) : (
                <>
                  {/* For add detail start  */}
                  {/* For the authoraization 1 person start */}
                  <Box mt={4}>
                    {/* New fields */}
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text fontWeight={"semibold"} textAlign="right">
                          Authorize person - 1
                        </Text>
                      </Grid>
                    </MotionSlideUp>
                    <MotionSlideUp>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">Name</Text>
                        <Input
                          value={
                            getValues(
                              "branch_contact_detail[0].authorized_name"
                            ) || ""
                          }
                          type="text"
                          isDisabled={viewForm}
                          onChange={(e) => {
                            setValue(
                              "branch_contact_detail[0].authorized_name",
                              e.target.value,
                              {
                                shouldValidate: true,
                              }
                            );
                          }}
                          style={inputStyle}
                          border="1px"
                          marginBottom={"1"}
                          marginTop={"1"}
                          borderColor={
                            errors?.branch_contact_detail &&
                            errors?.branch_contact_detail[0]?.authorized_name
                              ? "red"
                              : "gray.10"
                          }
                        />
                      </Grid>
                    </MotionSlideUp>

                    <MotionSlideUp duration={0.2 * 2} delay={0.1 * 2}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">Contact No</Text>
                        <Input
                          value={
                            getValues(
                              "branch_contact_detail[0].authorized_mobile_no"
                            )?.split("+91")[1]
                              ? Number(
                                  getValues(
                                    "branch_contact_detail[0].authorized_mobile_no"
                                  )?.split("+91")[1] || ""
                                )
                              : ""
                          }
                          type="number"
                          isDisabled={viewForm}
                          onChange={(e) => {
                            setValue(
                              "branch_contact_detail[0].authorized_mobile_no",
                              "+91" + e.target.value,
                              {
                                shouldValidate: true,
                              }
                            );
                          }}
                          style={inputStyle}
                          border="1px"
                          marginBottom={"1"}
                          marginTop={"1"}
                          borderColor={
                            errors?.branch_contact_detail &&
                            errors?.branch_contact_detail[0]
                              ?.authorized_mobile_no
                              ? "red"
                              : "gray.10"
                          }
                        />
                      </Grid>
                    </MotionSlideUp>

                    <MotionSlideUp duration={0.2 * 2} delay={0.1 * 2}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">Email Id</Text>
                        <Input
                          value={
                            getValues(
                              "branch_contact_detail[0].authorized_email_id"
                            ) || ""
                          }
                          type="email"
                          isDisabled={viewForm}
                          onChange={(e) => {
                            setValue(
                              "branch_contact_detail[0].authorized_email_id",
                              e.target.value,
                              {
                                shouldValidate: true,
                              }
                            );
                          }}
                          style={inputStyle}
                          border="1px"
                          marginBottom={"1"}
                          marginTop={"1"}
                          borderColor={
                            errors?.branch_contact_detail &&
                            errors?.branch_contact_detail[0]
                              ?.authorized_email_id
                              ? "red"
                              : "gray.10"
                          }
                        />
                      </Grid>
                    </MotionSlideUp>

                    <MotionSlideUp duration={0.2 * 2} delay={0.1 * 2}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">Signature Upload</Text>
                        <CustomFileInput
                          name="branch_contact_detail[0].signature_img_upload_path"
                          placeholder="Signature Upload"
                          maxSize={2}
                          type="image/jpg, image/png, image/jpeg"
                          defaultMsg="File must be less than 2 MB with jpeg, jpg or png format."
                          label=""
                          InputDisable={viewForm}
                          fileuplaod_folder_structure={{
                            type: "master",
                            subtype: "Bank Branch Master",
                          }}
                          //  errors={errors}
                          onChange={(e) => {
                            console.log(e, "file");
                            setValue(
                              "branch_contact_detail[0].signature_img_upload_path",
                              e,
                              {
                                shouldValidate: true,
                              }
                            );
                          }}
                          value={
                            getValues(
                              "branch_contact_detail[0].signature_img_upload_path"
                            ) || ""
                          }
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                        />

                        <Image
                          boxSize="100px"
                          objectFit="cover"
                          src={`${configuration.BASE_URL}${getValues(
                            "branch_contact_detail[0].signature_img_upload_path"
                          )}`}
                          fallbackSrc="https://via.placeholder.com/150"
                          alt="sing img"
                          onClick={() => {
                            console.log("wpoiwr");
                            SignatureOpen(
                              `${configuration.BASE_URL}${getValues(
                                "branch_contact_detail[0].signature_img_upload_path"
                              )}`
                            );
                          }}
                        />
                      </Grid>
                    </MotionSlideUp>

                    <MotionSlideUp duration={0.2 * 2} delay={0.1 * 2}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">valid From</Text>
                        <Box>
                          <CustomInput
                            name={"branch_contact_detail[0].valid_from"}
                            inputValue={
                              getValues(
                                "branch_contact_detail[0].valid_from"
                              ) || ""
                            }
                            InputDisabled={viewForm}
                            type="date"
                            onBlur={(e) => {
                              setValue(
                                "branch_contact_detail[0].valid_from",
                                e.target.value,
                                {
                                  shouldValidate: true,
                                }
                              );
                            }}
                            //style={inputStyle}
                            // border="1px"
                            style={{
                              mb: 1,
                              mt: 1,
                            }}
                            // marginBottom={"1"}
                            // marginTop={"1"}
                            // borderColor={
                            //   errors?.branch_contact_detail &&
                            //   errors?.branch_contact_detail[0]?.valid_from
                            //     ? "red"
                            //     : "gray.10"
                            // }
                          />
                          {/* {moment(
                            methods.getValues(
                              "branch_contact_detail[0].valid_from"
                            )
                          ).isBefore(moment()) ? ( */}
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

                    <MotionSlideUp duration={0.2 * 2} delay={0.1 * 2}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">valid To</Text>
                        <CustomInput
                          name={"branch_contact_detail[0].valid_to"}
                          inputValue={
                            getValues("branch_contact_detail[0].valid_to") || ""
                          }
                          type="date"
                          isDisabled={viewForm}
                          min={moment(
                            getValues("branch_contact_detail[0].valid_from")
                          ).format("YYYY-MM-DD")}
                          onBlur={(e) => {
                            setValue(
                              "branch_contact_detail[0].valid_to",
                              e.target.value,
                              {
                                shouldValidate: true,
                              }
                            );
                          }}
                          //style={inputStyle}
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                          // border="1px"
                          // marginBottom={"1"}
                          // marginTop={"1"}
                          borderColor={
                            errors?.branch_contact_detail &&
                            errors?.branch_contact_detail[0]?.valid_to
                              ? "red"
                              : "gray.10"
                          }
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>

                  {/* For the authoraization 2 person start */}
                  <Box mt={4}>
                    {/* New fields */}
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text fontWeight={"semibold"} textAlign="right">
                          Authorize person - 2
                        </Text>
                      </Grid>
                    </MotionSlideUp>

                    <MotionSlideUp>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">Name</Text>
                        <Input
                          isDisabled={viewForm}
                          value={
                            getValues(
                              "branch_contact_detail[1].authorized_name"
                            ) || ""
                          }
                          type="text"
                          onChange={(e) => {
                            setValue(
                              "branch_contact_detail[1].authorized_name",
                              e.target.value,
                              {
                                shouldValidate: true,
                              }
                            );
                          }}
                          style={inputStyle}
                          border="1px"
                          marginBottom={"1"}
                          marginTop={"1"}
                          borderColor={
                            errors?.branch_contact_detail &&
                            errors?.branch_contact_detail[1]?.authorized_name
                              ? "red"
                              : "gray.10"
                          }
                        />
                      </Grid>
                    </MotionSlideUp>

                    <MotionSlideUp duration={0.2 * 2} delay={0.1 * 2}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">Contact No</Text>
                        <Input
                          isDisabled={viewForm}
                          value={
                            getValues(
                              "branch_contact_detail[1].authorized_mobile_no"
                            )?.split("+91")[1]
                              ? Number(
                                  getValues(
                                    "branch_contact_detail[1].authorized_mobile_no"
                                  )?.split("+91")[1] || ""
                                )
                              : ""
                          }
                          type="number"
                          onChange={(e) => {
                            setValue(
                              "branch_contact_detail[1].authorized_mobile_no",
                              "+91" + e.target.value,
                              {
                                shouldValidate: true,
                              }
                            );
                          }}
                          style={inputStyle}
                          border="1px"
                          marginBottom={"1"}
                          marginTop={"1"}
                          borderColor={
                            errors?.branch_contact_detail &&
                            errors?.branch_contact_detail[1]
                              ?.authorized_mobile_no
                              ? "red"
                              : "gray.10"
                          }
                        />
                      </Grid>
                    </MotionSlideUp>

                    <MotionSlideUp duration={0.2 * 2} delay={0.1 * 2}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">Email Id</Text>
                        <Input
                          isDisabled={viewForm}
                          value={
                            getValues(
                              "branch_contact_detail[1].authorized_email_id"
                            ) || ""
                          }
                          type="email"
                          onChange={(e) => {
                            setValue(
                              "branch_contact_detail[1].authorized_email_id",
                              e.target.value,
                              {
                                shouldValidate: true,
                              }
                            );
                          }}
                          style={inputStyle}
                          border="1px"
                          marginBottom={"1"}
                          marginTop={"1"}
                          borderColor={
                            errors?.branch_contact_detail &&
                            errors?.branch_contact_detail[1]
                              ?.authorized_email_id
                              ? "red"
                              : "gray.10"
                          }
                        />
                      </Grid>
                    </MotionSlideUp>

                    <MotionSlideUp duration={0.2 * 2} delay={0.1 * 2}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">Signature Upload</Text>
                        <CustomFileInput
                          InputDisabled={viewForm}
                          name=""
                          placeholder="Signature Upload"
                          // max={2}
                          type="image/jpg, image/png, image/jpeg"
                          defaultMsg="File must be less than 2 MB with jpeg, jpg or png format."
                          fileuplaod_folder_structure={{
                            type: "master",
                            subtype: "Bank Branch Master",
                          }}
                          onChange={(e) => {
                            console.log(e, "file");
                            setValue(
                              "branch_contact_detail[1].signature_img_upload_path",
                              e,
                              {
                                shouldValidate: true,
                              }
                            );
                            setValue(
                              "branch_contact_detail[1].person_rank",
                              "2",
                              {
                                shouldValidate: true,
                              }
                            );
                          }}
                          value={
                            getValues(
                              "branch_contact_detail[1].signature_img_upload_path"
                            ) || ""
                          }
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                        />

                        <Image
                          boxSize="100px"
                          objectFit="cover"
                          src={`${configuration.BASE_URL}${getValues(
                            "branch_contact_detail[1].signature_img_upload_path"
                          )}`}
                          onClick={() => {
                            SignatureOpen(
                              `${configuration.BASE_URL}${getValues(
                                "branch_contact_detail[1].signature_img_upload_path"
                              )}`
                            );
                          }}
                          fallbackSrc="https://via.placeholder.com/150"
                          alt="img"
                        />
                      </Grid>
                    </MotionSlideUp>

                    <MotionSlideUp duration={0.2 * 2} delay={0.1 * 2}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">valid From</Text>
                        <Box>
                          <Input
                            isDisabled={viewForm}
                            value={
                              getValues(
                                "branch_contact_detail[1].valid_from"
                              ) || ""
                            }
                            type="date"
                            onBlur={(e) => {
                              setValue(
                                "branch_contact_detail[1].valid_from",
                                e.target.value,
                                {
                                  shouldValidate: true,
                                }
                              );
                            }}
                            style={{
                              mb: 1,
                              mt: 1,
                            }}
                            // style={inputStyle}
                            // border="1px"
                            // marginBottom={"1"}
                            // marginTop={"1"}
                            borderColor={
                              errors?.branch_contact_detail &&
                              errors?.branch_contact_detail[1]?.valid_from
                                ? "red"
                                : "gray.10"
                            }
                          />
                          {/* {moment(
                            methods.getValues(
                              "branch_contact_detail[1].valid_from"
                            )
                          ).isBefore(moment()) ? ( */}
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

                    <MotionSlideUp duration={0.2 * 2} delay={0.1 * 2}>
                      <Grid
                        gap={4}
                        templateColumns={"repeat(3, 1fr)"}
                        alignItems="center"
                      >
                        <Text textAlign="right">valid To</Text>
                        <Input
                          isDisabled={viewForm}
                          value={
                            getValues("branch_contact_detail[1].valid_to") || ""
                          }
                          type="date"
                          min={moment(
                            getValues("branch_contact_detail[1].valid_from")
                          ).format("YYYY-MM-DD")}
                          onBlur={(e) => {
                            setValue(
                              "branch_contact_detail[1].valid_to",
                              e.target.value,
                              {
                                shouldValidate: true,
                              }
                            );
                          }}
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                          // style={inputStyle}
                          // border="1px"
                          // marginBottom={"1"}
                          // marginTop={"1"}
                          borderColor={
                            errors?.branch_contact_detail &&
                            errors?.branch_contact_detail[1]?.valid_to
                              ? "red"
                              : "gray.10"
                          }
                        />
                      </Grid>
                    </MotionSlideUp>
                  </Box>
                </>
              )}
            </Box>
            {details?.id ? (
              <>
                {/* These for the edit start  */}
                <Box>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                    >
                      <Text fontWeight={"semibold"} textAlign="right">
                        Authorize person - 1
                      </Text>
                    </Grid>
                  </MotionSlideUp>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt={3}
                    >
                      <Text textAlign="right">Name</Text>

                      <Input
                        isDisabled={viewForm}
                        value={bankDetail.name}
                        type="text"
                        onChange={(e) => {
                          setBankDetail((old) => ({
                            ...old,
                            name: e.target.value,
                          }));
                          setBankError((old) => ({
                            ...old,
                            name: "",
                          }));
                        }}
                        style={inputStyle}
                        border="1px"
                        borderColor={bankError.name ? "red" : "gray.10"}
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
                      <Text textAlign="right">Contact No</Text>
                      <Box>
                        <Input
                          isDisabled={viewForm}
                          value={
                            bankDetail.contact?.split("+91")[1]
                              ? Number(
                                  bankDetail.contact?.split("+91")[1] || ""
                                )
                              : "" || ""
                          }
                          type="number"
                          onChange={(e) => {
                            setBankDetail((old) => ({
                              ...old,
                              contact: "+91" + e.target.value,
                            }));
                            setBankError((old) => ({
                              ...old,
                              contact: "",
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={bankError.contact ? "red" : "gray.10"}
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {bankError.contact === "error"
                            ? ""
                            : bankError.contact}
                        </Text>
                      </Box>
                    </Grid>
                  </MotionSlideUp>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt={3}
                    >
                      <Text textAlign="right">Email Id</Text>
                      <Box>
                        <Input
                          isDisabled={viewForm}
                          value={bankDetail.email}
                          type="email"
                          onChange={(e) => {
                            setBankDetail((old) => ({
                              ...old,
                              email: e.target.value,
                            }));
                            setBankError((old) => ({
                              ...old,
                              email: "",
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={bankError.email ? "red" : "gray.10"}
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {bankError.contact === "error"
                            ? ""
                            : bankError.contact}
                        </Text>
                      </Box>
                    </Grid>
                  </MotionSlideUp>
                  <MotionSlideUp duration={0.2 * 2} delay={0.1 * 2}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                    >
                      <Text textAlign="right">Signature Upload </Text>
                      <Box>
                        <CustomFileInput
                          InputDisabled={viewForm}
                          name=""
                          placeholder="Signature Upload"
                          type="image/jpg, image/png, image/jpeg"
                          defaultMsg="File must be less than 2 MB with jpeg, jpg or png format."
                          fileuplaod_folder_structure={{
                            type: "master",
                            subtype: "Bank Branch Master",
                          }}
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
                          value={bankDetail.agreement}
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {bankError.agreement === ""
                            ? ""
                            : "Please enter a Signature"}
                        </Text>
                      </Box>
                      <Image
                        boxSize="100px"
                        objectFit="cover"
                        src={`${configuration.BASE_URL}${bankDetail.agreement}`}
                        fallbackSrc="https://via.placeholder.com/150"
                        alt="img"
                        onClick={() => {
                          SignatureOpen(
                            `${configuration.BASE_URL}${bankDetail.agreement}`
                          );
                        }}
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
                      <Text textAlign="right">Valid From</Text>
                      <Box>
                        <Input
                          value={bankDetail.start_date}
                          type="date"
                          isDisabled={
                            viewForm
                              ? true
                              : bankDetail?.id === null
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
                      alignItems="center"
                      mt={3}
                    >
                      <Text textAlign="right">valid To</Text>
                      <Input
                        isDisabled={viewForm}
                        value={bankDetail.end_date}
                        type="date"
                        min={moment(bankDetail.start_date).format("YYYY-MM-DD")}
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
                      />{" "}
                      <Flex>
                        <Button
                          type="button"
                          // maxWidth="200px"
                          backgroundColor={"white"}
                          borderWidth={"1px"}
                          borderColor={"#A6CE39"}
                          isDisabled={viewForm ? true : false}
                          _hover={{ backgroundColor: "" }}
                          color={"#A6CE39"}
                          borderRadius={"full"}
                          onClick={() => {
                            if (isNewCmRate) {
                              setIsNewCmRate(false);
                              setBankDetail({
                                id: null,
                                rank: 1,
                                name: "",
                                contact: "",
                                email: "",
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
                            ? "Add New Person"
                            : updateBankFlag === null
                            ? "Add"
                            : "Update"}
                        </Button>
                      </Flex>
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
                      <Text fontWeight={"semibold"} textAlign="right">
                        Authorize person - 2
                      </Text>
                    </Grid>
                  </MotionSlideUp>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt={3}
                    >
                      <Text textAlign="right">Name</Text>
                      <Input
                        isDisabled={viewForm}
                        value={bankDetail2.name}
                        type="text"
                        onChange={(e) => {
                          setBankDetail2((old) => ({
                            ...old,
                            name: e.target.value,
                          }));
                          setBankError2((old) => ({
                            ...old,
                            name: "",
                          }));
                        }}
                        style={inputStyle}
                        border="1px"
                        borderColor={bankError2.name ? "red" : "gray.10"}
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
                      <Text textAlign="right">Contact No</Text>
                      <Box>
                        <Input
                          isDisabled={viewForm}
                          value={
                            bankDetail2.contact?.split("+91")[1]
                              ? Number(
                                  bankDetail2.contact?.split("+91")[1] || ""
                                )
                              : "" || ""
                          }
                          type="number"
                          onChange={(e) => {
                            setBankDetail2((old) => ({
                              ...old,
                              contact: "+91" + e.target.value,
                            }));
                            setBankError2((old) => ({
                              ...old,
                              contact: "",
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={bankError2.contact ? "red" : "gray.10"}
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {bankError2.contact === "error"
                            ? ""
                            : bankError2.contact}
                        </Text>
                      </Box>
                    </Grid>
                  </MotionSlideUp>
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                      mt={3}
                    >
                      <Text textAlign="right">Email Id</Text>
                      <Box>
                        <Input
                          isDisabled={viewForm}
                          value={bankDetail2.email}
                          type="email"
                          onChange={(e) => {
                            setBankDetail2((old) => ({
                              ...old,
                              email: e.target.value,
                            }));
                            setBankError2((old) => ({
                              ...old,
                              email: "",
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={bankError2.email ? "red" : "gray.10"}
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {bankError2.contact === "error"
                            ? ""
                            : bankError2.contact}
                        </Text>
                      </Box>
                    </Grid>
                  </MotionSlideUp>
                  <MotionSlideUp duration={0.2 * 2} delay={0.1 * 2}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                    >
                      <Text textAlign="right">Signature Upload</Text>
                      <Box>
                        <CustomFileInput
                          InputDisabled={viewForm}
                          name=""
                          placeholder="Signature Upload"
                          type="image/jpg, image/png, image/jpeg"
                          defaultMsg="File must be less than 2 MB with jpeg, jpg or png format."
                          fileuplaod_folder_structure={{
                            type: "master",
                            subtype: "Bank Branch Master",
                          }}
                          onChange={(e) => {
                            setBankDetail2((old) => ({
                              ...old,
                              agreement: e,
                            }));
                            setBankError2((old) => ({
                              ...old,
                              agreement: "",
                            }));
                          }}
                          value={bankDetail2.agreement}
                          style={{
                            mb: 1,
                            mt: 1,
                          }}
                        />
                        <Text color="red" fontSize="14px" textAlign="left">
                          {bankError2.agreement === ""
                            ? ""
                            : "Please enter a Signature"}
                        </Text>
                      </Box>
                      <Image
                        boxSize="100px"
                        objectFit="cover"
                        src={`${configuration.BASE_URL}${bankDetail2.agreement}`}
                        fallbackSrc="https://via.placeholder.com/150"
                        onClick={() => {
                          SignatureOpen(
                            `${configuration.BASE_URL}${bankDetail2.agreement}`
                          );
                        }}
                        alt="img"
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
                      <Text textAlign="right">Valid From</Text>
                      <Box>
                        <Input
                          value={bankDetail2.start_date}
                          type="date"
                          isDisabled={
                            viewForm
                              ? true
                              : bankDetail2?.id === null
                              ? false
                              : moment(bankDetail2.start_date).isBefore(
                                  moment()
                                )
                          }
                          onChange={(e) => {
                            setBankDetail2((old) => ({
                              ...old,
                              start_date: e.target.value,
                              end_date: "",
                            }));
                            setBankError2((old) => ({
                              ...old,
                              start_date: "",
                            }));
                          }}
                          style={inputStyle}
                          border="1px"
                          borderColor={
                            bankError2.start_date ? "red" : "gray.10"
                          }
                        />
                        {moment(bankDetail2.start_date).isBefore(moment()) ? (
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
                      alignItems="center"
                      mt={3}
                    >
                      <Text textAlign="right">valid To</Text>
                      <Input
                        isDisabled={viewForm}
                        value={bankDetail2.end_date}
                        type="date"
                        min={moment(bankDetail2.start_date).format(
                          "YYYY-MM-DD"
                        )}
                        onChange={(e) => {
                          setBankDetail2((old) => ({
                            ...old,
                            end_date: e.target.value,
                          }));
                          setBankError2((old) => ({
                            ...old,
                            end_date: "",
                          }));
                        }}
                        style={inputStyle}
                        border="1px"
                        borderColor={bankError2.end_date ? "red" : "gray.10"}
                      />{" "}
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
                            if (isNewCmRate2) {
                              setIsNewCmRate2(false);
                              setBankDetail2({
                                id: null,
                                rank: 2,
                                name: "",
                                contact: "",
                                email: "",
                                start_date: "",
                                end_date: "",
                                agreement: "",
                              });
                              setCurrentBankFlag2(null);
                            } else {
                              if (updateBankFlag === null) {
                                append_new_bank_details2();
                              } else {
                                UpdateBankDetail2();
                              }
                            }
                          }}
                        >
                          {isNewCmRate2
                            ? "Add New Person"
                            : updateBankFlag === null
                            ? "Add"
                            : "Update"}
                        </Button>
                      </Flex>
                    </Grid>
                  </MotionSlideUp>
                </Box>
              </>
            ) : (
              <></>
            )}

            {/* This is for the table code  */}
            {details?.id ? (
              <Box mx="20" mt={5}>
                <TableContainer>
                  <Table color="#000">
                    <Thead bg="#dbfff5" border="1px" borderColor="#000">
                      <Tr style={{ color: "#000" }}>
                        <Th color="#000">No.</Th>
                        <Th color="#000">Name</Th>
                        <Th color="#000">Personal Rank</Th>
                        <Th color="#000">Contact no </Th>
                        <Th color="#000">E-mail id</Th>
                        <Th color="#000">Valid From</Th>
                        <Th color="#000">Valid To</Th>
                        <Th color="#000">Download signature</Th>
                        <Th color="#000">Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody style={{ backgroundColor: "#ffffff" }}>
                      {getValues("branch_contact_detail")?.length === 0 && (
                        <Tr>
                          <Td colSpan={8} color="#c1c1c1" fontWeight="semibold">
                            No record found
                          </Td>
                        </Tr>
                      )}
                      {getValues("branch_contact_detail") &&
                        getValues("branch_contact_detail").map(
                          (data, index) => (
                            <Tr key={index}>
                              <Td>{index + 1}</Td>
                              <Td>{data.authorized_name}</Td>
                              <Td>
                                {data.person_rank === 1
                                  ? "Authorize person - 1"
                                  : "Authorize person - 2"}
                              </Td>
                              <Td>{data.authorized_mobile_no}</Td>
                              <Td>{data.authorized_email_id}</Td>
                              <Td>{moment(data.valid_from).format("LL")}</Td>
                              <Td>{moment(data.valid_to).format("LL")}</Td>
                              <Td>
                                <Box color={"primary.700"}>
                                  <DownloadFilesFromUrl
                                    details={{
                                      paths: [data?.signature_img_upload_path],
                                      fileName: `${data?.authorized_name}_signature`,
                                    }}
                                  />
                                </Box>
                              </Td>
                              <Td>
                                {new Date(data.valid_to) > new Date() ? (
                                  <BiEditAlt
                                    fontSize="26px"
                                    cursor="pointer"
                                    onClick={() => {
                                      data.person_rank === 1
                                        ? updateBankFlagFunction(data, index)
                                        : updateBankFlagFunction2(data, index);
                                    }}
                                  />
                                ) : (
                                  <></>
                                )}
                              </Td>
                            </Tr>
                          )
                        )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <></>
            )}

            <Modal
              finalFocusRef={finalRef}
              isOpen={isOpen}
              size="2xl"
              onClose={onClose}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Signature Photos</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    textAlign={"center"}
                  >
                    <img
                      src={imgPath}
                      alt=""
                      style={{ height: "500px", width: "500px" }}
                    />
                  </Box>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    type="button"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

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
                isLoading={
                  addBankBranchMasterApiIsLoading ||
                  updateBankBranchMasterApiIsLoading
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
}

export default AddEditFormBankBranchMaster;

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
