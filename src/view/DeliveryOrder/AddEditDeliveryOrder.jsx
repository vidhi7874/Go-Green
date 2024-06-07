/* eslint-disable react-hooks/exhaustive-deps */
import ROUTE_PATH from "../../constants/ROUTE";
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
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useGetChamberFreeMutation,
  useGetClientMasterFreeTypeMutation,
  useGetCommodityFreeMasterMutation,
  useGetCommodityVarityFreeMasterMutation,
  useGetWareHouseFreeMutation,
} from "../../features/master-api-slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./fields";
import { MotionSlideUp } from "../../utils/animation";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import { useFetchLocationDrillDownFreeMutation } from "../../features/warehouse-proposal.slice";
import ReactSelect from "react-select";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import { AiOutlineDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import CustomFileInput from "../../components/Elements/CustomFileInput";
import CustomInput from "../../components/Elements/CustomInput";
import { useGetWHRFreeMutation } from "../../features/cir.slice";
import {
  useAssignDoMutation,
  useFetchDOByIdMutation,
  useFetchLotsDataBasedOnStackMutation,
  useFetchStackNumberMutation,
  useGetMTBagDetailsMutation,
  usePostDOSubmitMutation,
  useUpdateDoMutation,
} from "../../features/do.slice";
import lotDetailsValidationSchema, {
  lot_details_schema,
} from "./lot_detailsSchema";

import { localStorageService } from "../../services/localStorge.service";
import {
  approvalCycleStatus,
  checkApprovalCycleStatus,
} from "../../constants/approvalCycleStatus";

//............................
// array for the aadhar and pan value ...
const authProofType = [
  {
    label: "Aadhar",
    value: "aadhar",
  },
  {
    label: "Pan Number",
    value: "pan",
  },
];

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

const DROP_DOWN_KEY_NAME_FOR_RESET = [
  "client",
  "region",
  "state",
  "substate",
  "district",
  "area",
  "warehouse_id",
  "chamber",
  "commodity",
  "commodity_varity",
  "whr_no",
  "current_do_bags",
  "current_do_mt",
];

function AddEditDeliveryOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  let clients_list = [];

  const [details, setDetails] = useState({});
  const [lotDetailsFinal, setLotDetailsFinal] = useState([]);
  const [lotDetailsFinalCopy, setLotDetailsFinalCopy] = useState([]);

  console.log("details: edit api all data state >>> ", details);
  const [lotDetailsEditState, setLotDetailsEditState] = useState({
    index: null,
    isEdit: false,
  });

  // function  to handle the toast message ...
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

  // function for the custom validation ....
  function validatedLotWiseDetailsForm(formData) {
    // importing the schema for the lot details table ..
    const validationSchema = lotDetailsValidationSchema;

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

  function validatedDeliveryOrderDetailsForm(formData) {
    delete formData?.broker_name;
    // importing the schema for the lot details table ..
    const validationSchema = schema;
    console.log("formData", formData);

    try {
      return validationSchema.validateSync(formData, { abortEarly: false });
    } catch (errors) {
      const validationErrors = {};
      console.log(errors);

      errors.inner.forEach((error) => {
        validationErrors[error.path] = error?.message;
      });

      throw validationErrors;
    }
  }

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      client_authorised_person_id_proof_type: authProofType[0]?.value,
    },
  });

  const {
    setValue,
    getValues,
    // eslint-disable-next-line
    formState: { errors },
  } = methods;

  console.log("show form errors ->", errors);

  const [selectBoxOptions, setSelectBoxOptions] = useState({
    regions: [],
    substate: [],
    districts: [],
    states: [],
    warehouse: [],
    chamber: [],
    commodity: [],
    communityVariety: [],
    whrNo: [],
    stack_number: [],
    lot_numbers: [],
  });
  console.log("selectBoxOptions: main state >>", selectBoxOptions);
  // eslint-disable-next-line

  // fetch the data for the user to show the filled up form ....
  const [fetchDOById] = useFetchDOByIdMutation();
  const fetchDODetailById = async (id) => {
    try {
      const response = await fetchDOById({ id }).unwrap();
      if (response.status === 200) {
        // setDetail state for storing all data ...
        console.log("edit time details 123", response?.data);
        console.log("edit time details 123", response?.data?.status);
        setDetails(response?.data || {});
        setLotDetailsFinal(response?.data?.delivery_order_lot_details);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // logic to get the client details start ............
  const [getClientMaster, { isLoading: getClientMasterApiIsLoading }] =
    useGetClientMasterFreeTypeMutation();

  const getClientMasterList = async () => {
    try {
      const response = await getClientMaster().unwrap();
      if (response.status === 200) {
        let client = response?.data?.map(({ name_of_client, id }) => ({
          label: name_of_client,
          value: id,
        }));

        setSelectBoxOptions((prev) => ({
          ...prev,
          client: client,
        }));
        clients_list = client;
        console.log(clients_list);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // useEffect(() => {
  //   console.log(originalMtBagDetails);
  // }, [originalMtBagDetails]);
  // logic to get the client details end ............

  // for the expiry date validation ..
  const currentDate = new Date().toISOString().split("T")[0];

  // location drill down api hook logic start .....
  const [
    fetchLocationDrillDown,
    { isLoading: fetchLocationDrillDownApiIsLoading },
  ] = useFetchLocationDrillDownFreeMutation();

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
      console.log("@@@@@@@@@@@@@@", response);
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

  const areaOnChange = (val) => {
    setValue("area", val?.value, {
      shouldValidate: true,
    });
  };

  useEffect(() => {
    let do_id = params?.id;
    getClientMasterList();
    getRegionMasterList();
    if (do_id) {
      fetchDODetailById(do_id);
    }
    return () => {
      dispatch(setBreadCrumb([]));
    };
  }, []);

  // Region State  Zone District Area  onChange drill down api end ......

  // Warehouse Name start logic start ...................
  const [getWarehouseMaster, { isLoading: getWarehouseMasterApiIsLoading }] =
    useGetWareHouseFreeMutation();

  async function getWarehouseMasterList(test) {
    // alert(test);
    // alert(1);
    console.log(
      "testing query --> ",
      "?filter=contractwarehousechamber__service_contract__client__name_of_client&contractwarehousechamber__service_contract__client__name_of_client=" +
        selectBoxOptions?.client?.filter(
          (item) => item.value === getValues("client")
        )?.[0]?.label +
        "&filter=area__id&area__id=" +
        getValues("area")
    );
    // fgdf

    console.log(getValues("client"));
    console.log(getValues("area"));

    // if (getValues("area") === undefined || getValues("area") === undefined) {
    //   // alert("is undefined");
    //   return false;
    // }
    console.log(selectBoxOptions.client);
    console.log(clients_list);
    let query =
      "?filter=contractwarehousechamber__service_contract__client__name_of_client&contractwarehousechamber__service_contract__client__name_of_client=" +
      clients_list?.filter((item) => item.value === getValues("client"))?.[0]
        ?.label +
      "&filter=area__id&area__id=" +
      getValues("area");

    console.log(query);

    try {
      const response = await getWarehouseMaster().unwrap();
      // fg

      if (response.status === 200) {
        const warehouse = response?.data?.map(({ warehouse_name, id }) => ({
          label: warehouse_name,
          value: id,
        }));
        console.log(warehouse);
        setSelectBoxOptions((prev) => ({
          ...prev,
          warehouse: response?.data?.map(({ warehouse_name, id }) => ({
            label: warehouse_name,
            value: id,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    let obj = {
      area: getValues("area"),
      client: getValues("client"),
    };
    console.log(selectBoxOptions.client);
    console.log(obj);
    if (getValues("area") === undefined || getValues("client") === undefined) {
      // alert("is failed"); dfd
    } else {
      // alert("is done");
      // getClientMasterList();
      getWarehouseMasterList(1);
    }
    // if (getValues("area") !== undefined && getValues("client") !== undefined) {
    //   getWarehouseMasterList();
    // }
  }, [getValues("area"), getValues("client")]);
  // Warehouse Name end logic start ...................

  // Chamber Master logic Start .......................................
  const [getChamberMaster, { isLoading: getChamberApiIsLoading }] =
    useGetChamberFreeMutation();

  const getChamberMasterList = async () => {
    try {
      console.log(clients_list);
      // alert("eee");
      console.log(getValues("client"));
      console.log(getValues("warehouse_id"));
      // "?filter=currentusedstack__client__name_of_client&currentusedstack__client__name_of_client=" +
      let query =
        "?filter=warehousechamberstackdetails__client__name_of_client&warehousechamberstackdetails__client__name_of_client=" +
        selectBoxOptions.client?.filter(
          (item) => item.value === getValues("client")
        )?.[0]?.label +
        "&filter=warehouse__id&warehouse__id=" +
        getValues("warehouse_id");

      console.log(query);

      console.log(clients_list);
      const response = await getChamberMaster(query).unwrap();
      if (response.status === 200) {
        console.log(response.data);
        setSelectBoxOptions((prev) => ({
          ...prev,
          chamber: response?.data?.map(({ chamber_number, id }) => ({
            label: chamber_number,
            value: id,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  //
  useEffect(() => {
    if (getValues("warehouse_id") && getValues("client")) {
      getChamberMasterList();
    }
  }, [getValues("warehouse_id"), getValues("client"), selectBoxOptions.client]);
  //chamber master logic End .....................

  //commodity name logic  Start ........................
  const [getCommodityMaster, { isLoading: getCommodityMasterApiIsLoading }] =
    useGetCommodityFreeMasterMutation();
  const getCommodityMasterList = async () => {
    try {
      console.log(clients_list);
      const response = await getCommodityMaster(
        "?filter=warehousechamberstackdetails__client__name_of_client&warehousechamberstackdetails__client__name_of_client=" +
          selectBoxOptions.client?.filter(
            (item) => item.value === getValues("client")
          )?.[0]?.label
      ).unwrap();
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          community: response?.data?.map(({ commodity_name, id }) => ({
            label: commodity_name,
            value: id,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    if (getValues("chamber") & getValues("client")) {
      getCommodityMasterList();
    }
  }, [getValues("chamber"), getValues("client"), selectBoxOptions.client]);
  // Commodity name logic end ............................................

  //commodity variety master Start ...............................
  const [getCommodityVarity, { isLoading: getCommodityVarityApiIsLoading }] =
    useGetCommodityVarityFreeMasterMutation();
  const getCommodityVarityList = async () => {
    try {
      const response = await getCommodityVarity(
        "?filter=gatepass__client__name_of_client&gatepass__client__name_of_client=" +
          selectBoxOptions.client?.filter(
            (item) => item.value === getValues("client")
          )?.[0]?.label +
          "&filter=commodity_id__id&commodity_id__id=" +
          getValues("commodity")
      ).unwrap();
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          communityVariety: response?.data?.map(
            ({ commodity_variety, id }) => ({
              label: commodity_variety,
              value: id,
            })
          ),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    if (getValues("client") && getValues("commodity")) {
      getCommodityVarityList();
    }
  }, [getValues("client"), getValues("commodity"), selectBoxOptions.client]);
  //commodity variety master logic end .........................

  //WHR No Start logic start .....................
  const [getWHR, { isLoading: getWHRApiIsLoading }] = useGetWHRFreeMutation();
  async function getWHRList(a, b) {
    console.log("gg-- chamber >> inside fn >>>", a);
    console.log("gg-- vareity >> inside fn >>>", b);
    try {
      if (a && b) {
        console.log("gg-- true condition");
        const response = await getWHR(
          "filter=service_contract_no__client__name_of_client&service_contract_no__client__name_of_client=" +
            selectBoxOptions.client?.filter(
              (item) => item.value == getValues("client")
            )?.[0]?.label +
            "&filter=chamber__chamber_number&chamber__chamber_number=" +
            a +
            "&filter=commodity_variety__commodity_variety&commodity_variety__commodity_variety=" +
            b +
            "&filter=status__status_code&status__status_code=6"
        ).unwrap();

        if (response.status === 200) {
          // i changed the code here
          console.log("cir number >>>", response?.data[0]);
          console.log("cir number >>>", response?.data[0]?.id);
          // setValue("cir", response?.data[0]?.id, {
          //   shouldValidate: false,
          // });
          setSelectBoxOptions((prev) => ({
            ...prev,
            whrNo: response?.data?.map(({ whr_no, id }) => ({
              // label: cir_no,
              label: whr_no,
              value: id,
            })),
          }));
        }
      } else {
        const response = await getWHR(
          "filter=service_contract_no__client__name_of_client&service_contract_no__client__name_of_client=" +
            selectBoxOptions?.client?.filter(
              (item) => item.value === getValues("client")
            )?.[0]?.label +
            "&filter=chamber__chamber_number&chamber__chamber_number=" +
            selectBoxOptions?.chamber?.filter(
              (item) => item.value === getValues("chamber")
            )?.[0]?.label +
            "&filter=commodity_variety__commodity_variety&commodity_variety__commodity_variety=" +
            selectBoxOptions?.communityVariety?.filter(
              (item) => item.value === getValues("commodity_varity")
            )?.[0]?.label +
            "&filter=status__status_code&status__status_code=6"
        ).unwrap();

        if (response.status === 200) {
          // i changed the code here
          console.log("cir number >>>", response?.data[0]?.id);
          console.log("cir number >>>", response?.data);
          // setValue("cir", response?.data[0]?.id, {
          //   shouldValidate: false,
          // });

          setSelectBoxOptions((prev) => ({
            ...prev,
            whrNo: response?.data?.map(({ whr_no, id }) => ({
              // label: cir_no,
              label: whr_no,
              value: id,
            })),
          }));
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    if (
      getValues("client") &&
      getValues("chamber") &&
      getValues("commodity_varity")
    ) {
      if (details?.id) {
        getWHRList(
          details?.chamber?.chamber_number,
          details?.commodity_variety?.commodity_variety
        );
      } else {
        getWHRList();
      }
    }
  }, [
    getValues("client"),
    getValues("commodity_varity"),
    getValues("chamber"),
    selectBoxOptions.client,
  ]);
  //WHR no logic  end ..................

  //Bag and MT master table Start ..........................
  const [mtBagDetail, setMtBagDetail] = useState({});
  const [originalMtBagDetails, setOriginalMtBagDetails] = useState({});

  // rtk hook and all the logic for the mt table ...
  const [getMTBag] = useGetMTBagDetailsMutation();

  const getMTBagList = async () => {
    try {
      const response = await getMTBag("cir=" + getValues("whr_no")).unwrap();
      console.log("Success getMTBagList:", response);
      setOriginalMtBagDetails(response.data);
      setMtBagDetail(response.data);

      // for demo
      // {
      //   data: {
      //     deposite_cir_bag: 100000,
      //     deposite_cir_mt: 988,
      //     do_generated_bag: 45000,
      //     do_generated_mt: 444.6,
      //     delivered_cor_bag: 0,
      //     delivered_cor_mt: 0,
      //     remaining_do_bag: 55000,
      //     remaining_do_mt: 543.4
      //   }
      // }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    console.log(getValues("whr_no"));
    if (getValues("whr_no")) {
      getMTBagList();
    } else {
      setOriginalMtBagDetails({});
      setMtBagDetail({});
    }
  }, [getValues("whr_no")]);
  // Mt table logic end ..............................................

  // LOT Details Start.....................................................
  // ?? use this state to show the data for the lot details table .....
  console.log("lotDetailsFinal: for the table >>", lotDetailsFinal);

  // logic to add multiple field data
  function getTotalSumFn(key_name) {
    console.log(lotDetailsFinal);
    const sum = lotDetailsFinal?.reduce((acc, currObj) => {
      return acc + +currObj[key_name];
    }, 0);

    return sum || 0;
  }

  // condition to add the total sum in mt table function
  useEffect(() => {
    if (lotDetailsFinal?.length !== 0) {
      setValue("current_do_bags", getTotalSumFn("currently_removing_bag"), {
        shouldValidate: true,
      });
      setValue("current_do_mt", getTotalSumFn("currently_removing_mt"), {
        shouldValidate: true,
      });
    } else {
      console.log("i am here  in else >>>>");
      setValue("current_do_bags", 0, {
        shouldValidate: true,
      });
      setValue("current_do_mt", 0, {
        shouldValidate: true,
      });
    }
    //  logic for the edit for the id....
    if (details?.id) {
      console.log("details?.id: in the useEffect .....", details?.id);
      if (lotDetailsFinal?.length !== 0) {
        setValue("current_do_bags", getTotalSumFn("currently_removing_bag"), {
          shouldValidate: true,
        });
        setValue("current_do_mt", getTotalSumFn("currently_removing_mt"), {
          shouldValidate: true,
        });
      } else {
        console.log("i am here  in else >>>>");
        setValue("current_do_bags", 0, {
          shouldValidate: true,
        });
        setValue("current_do_mt", 0, {
          shouldValidate: true,
        });
      }
    }

    console.log("lotDetailsFinal ====>", lotDetailsFinal);
    // eslint-disable-next-line
  }, [lotDetailsFinal]);

  const onSubmit = (data) => {
    if (details?.id) {
      // updateData({ ...data, id: details.id });
    } else {
      addData(data);
    }
  };

  // rtk hook for the edit api .....
  const [updateDo, { isLoading: updateDoApiIsLoading }] = useUpdateDoMutation();

  // logic for the main edit data api ..
  const updateData = async () => {
    const data = await getValues();
    console.log("data: in the update function  >>>", data);
    // payload for the edit api

    // getValues("stack_number_id")
    console.log(
      'getValues("stack_number_id"): ',
      getValues("stack_number_id"),
      details?.stack_no?.id
    );

    console.log("lotDetailsFinal", lotDetailsFinal);
    //
    // [
    //   {
    //     id: 107,
    //     stack_number: 9,
    //     stack_number_id: 400,
    //     lot_no: { label: 'GP240221221/1', value: 289 },
    //     average_bag_size: 20,
    //     currently_removing_bag: 12,
    //     currently_removing_mt: 0.24,
    //     deposited_cir_bag: 2000,
    //     deposited_cir_mt: 40,
    //     do_generated_bag: 0,
    //     do_generated_mt: 0,
    //     delivered_cor_bags: 0,
    //     delivered_cor_mt: 0,
    //     remaining_do_bags: 1988,
    //     remaining_do_mt: 39.76
    //   },
    //   {
    //     id: null,
    //     stack_number: 5,
    //     lot_no: { label: 'GP240221221/2', value: 290 },
    //     stack_number_id: 364,
    //     average_bag_size: 20,
    //     remaining_bag_for_do: 3000,
    //     remaining_mt_for_do: 60,
    //     deposited_cir_bag: 3000,
    //     deposited_cir_mt: 60,
    //     do_generated_bag: 0,
    //     do_generated_mt: 0,
    //     delivered_cor_bags: 0,
    //     delivered_cor_mt: 0,
    //     currently_removing_bag: 1000,
    //     currently_removing_mt: 20,
    //     remaining_do_bags: 2000,
    //     remaining_do_mt: 40,
    //     isNewlyAdded: true
    //   }
    // ]
    const delivery_order_lot_details = lotDetailsFinal?.map((el) => ({
      id: el?.id ? el?.id : null,
      stack_no: el?.stack_number_id,
      lot_no: el?.lot_no?.value,
      avg_bag_size: el?.average_bag_size,
      current_do_remove_bag: el?.currently_removing_bag,
      current_do_remove_mt: el?.currently_removing_mt,
      deposit_cir_bags: el?.deposited_cir_bag,
      deposit_cir_mt: el?.deposited_cir_mt,
      do_generated_bags: el?.do_generated_bag,
      do_generated_mt: el?.do_generated_mt,
      delivered_cor_bags: el?.delivered_cor_bags,
      delivered_cor_mt: el?.delivered_cor_mt,
      remaining_for_do_bags: el?.remaining_do_bags,
      remaining_for_do_mt: el?.remaining_do_mt,
      // remaining_for_do_bags: el?.remaining_bag_for_do,
      // remaining_for_do_mt: el?.remaining_mt_for_do,
    }));

    console.log(delivery_order_lot_details);

    let final_payload = {
      id: details.id,
      ...data,
      cir: data?.whr_no,
      client_authorised_person_contact_number: `+91${data?.client_authorised_person_contact_number}`,
      warehouse: data?.warehouse_id,
      commodity_variety: data?.commodity_varity,
      delivery_order_lot_details,
    };
    console.log("final_payload:  for the edit api >>>>", final_payload);

    try {
      const response = await updateDo(final_payload).unwrap();
      if (response.status === 200) {
        toasterAlert(response);
        // navigate(`${ROUTE_PATH.DELIVERY_ORDER}`);
      }
      return response;
    } catch (error) {
      let errorMessage =
        error?.data?.data || error?.data?.message || "Update DO Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Edit Form Fill LogicStart, edit api call ......................
  // useEffect(() => {
  //   let do_id = params?.id;
  //   fetchDODetailById(do_id);
  //   return () => {
  //     dispatch(setBreadCrumb([]));
  //   };
  //   // eslint-disable-next-line
  // }, []);

  // logic for setting up the values

  useEffect(() => {
    console.log("-->", getValues("area"));

    // if (getValues("area") !== undefined && getValues("client") !== undefined) {
    //   getWarehouseMasterList();
    // }
    // getWarehouseMasterList();
    // getChamberMasterList();
    // getCommodityMasterList();
    // getCommodityVarityList();

    if (details?.id) {
      //...
      console.log("details ^^^", details);
      regionOnChange({ value: details?.warehouse?.region?.id });
      stateOnChange({ value: details?.warehouse?.state?.id });
      zoneOnChange({ value: details?.warehouse?.substate?.id });
      districtOnChange({ value: details?.warehouse?.district?.id });
      // schema key name : value from api
      let obj = {
        // stack_number_id: details?.stack_no?.id,
        district_name: details?.warehouse?.district?.id,
        // stack_no:delivery_order_lot_details.stack_no,
        client: details?.client?.id,
        substate: details?.warehouse?.substate?.id,
        region: details?.warehouse?.region?.id,
        state: details?.warehouse?.state?.id,
        area: details?.warehouse?.area?.id,
        warehouse_id: details?.warehouse?.id,
        client_authorised_person: details?.client_authorised_person,
        client_authorised_person_contact_number:
          details?.client_authorised_person_contact_number?.replace(
            /^\+91/,
            ""
          ),
        //
        client_authorised_person_id_proof_type:
          details?.client_authorised_person_id_proof_type,
        client_authorised_person_id_proof_number:
          details?.client_authorised_person_id_proof_number,
        client_authorised_letter_path: details?.client_authorised_letter_path,
        broker_name: details?.broker_name,
        expire_date: details?.delivery_order_history[0]?.expiry_date,
        chamber: details?.chamber?.id,
        commodity_varity: details?.commodity_variety?.id,
        whr_no: details?.whr_no,
        cir: details?.whr_no,
        commodity: details?.commodity?.id,
        remarks: details?.remarks,

        delivery_order_number: details?.delivery_order_number,
        is_active: details.is_active,
      };

      console.log("obj ---> ", obj);

      // setting up all the values in the schema ...
      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });

      // if (
      //   getValues("area") !== undefined &&
      //   getValues("client") !== undefined
      // ) {
      //   console.log("testing");
      //   getWarehouseMasterList(2);
      // }

      // setting up the data for the lot details table ..
      const arr = details?.delivery_order_lot_details?.map((el) => ({
        id: el?.id ? el?.id : null,
        stack_number: el?.stack_no?.stack_number,
        stack_number_id: el?.stack_no?.id,
        lot_no: {
          label: el?.lot_no?.stack_lot_number,
          value: el?.lot_no?.id,
        },
        average_bag_size: el?.avg_bag_size,
        currently_removing_bag: el?.current_do_remove_bag,

        currently_removing_mt: el?.current_do_remove_mt,
        deposited_cir_bag: el?.deposit_cir_bags,
        deposited_cir_mt: el?.deposit_cir_mt,
        //
        do_generated_bag: el?.do_generated_bags,
        do_generated_mt: el?.do_generated_mt,
        delivered_cor_bags: el?.delivered_cor_bags,
        delivered_cor_mt: el?.delivered_cor_mt,
        remaining_do_bags: el?.remaining_for_do_bags,
        remaining_do_mt: el?.remaining_for_do_mt,
      }));

      setLotDetailsFinal(arr);

      // if (
      //   getValues("area") !== undefined &&
      //   getValues("client") !== undefined
      // ) {
      //   console.log(getValues("client"));
      //   console.log(getValues("area"));
      //   console.log("testing");
      //   getWarehouseMasterList(2);
      // }
    }
    getChamberMasterList();
    getCommodityMasterList();
    getCommodityVarityList();
    getWHRList();
    // setting up the bread crump data ..
    const breadcrumbArray = [
      {
        title: "Delivery Order",
        link: `${ROUTE_PATH.DELIVERY_ORDER}`,
      },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
    // eslint-disable-next-line
  }, [details]);

  // calling the stack number api on the id and cir change fo rthe edit mode ...
  //..
  useEffect(() => {
    async function fetchingUniqueStackList() {
      if (details?.id && getValues("whr_no")) {
        // await getUniqueStackList(getValues("cir"));
        await getUniqueStackList(getValues("whr_no"));
      }
    }
    fetchingUniqueStackList();
  }, [getValues("whr_no"), details?.id]);
  // Edit Form Fill Logic End
  // lot details add.......................................logic .......................................................

  // react-hook -form for the lot details table ...
  const lotDetailForm = useForm({
    resolver: yupResolver(lotDetailsValidationSchema),
    defaultValues: {},
  });
  const {
    setValue: setValueLotForm,
    getValues: getValueLotForm,
    reset: resetLotForm,
    setError: lotFormSetError,
    watch: watchLotDetails,
    // eslint-disable-next-line
    formState: { errors: errorslotDetailsForm },
  } = lotDetailForm;

  // keeping the watch logic on the stack_number field ..
  const keepStackSelectValue = watchLotDetails(
    lot_details_schema?.stack_number
  );

  // rtk hook for the stack number listing
  const [fetchStackNumber] = useFetchStackNumberMutation();
  // function to fetch the stack number from the api ....
  async function getUniqueStackList(id) {
    const response = await fetchStackNumber(id).unwrap();
    setSelectBoxOptions((prev) => ({
      ...prev,
      stack_number: response.data?.map((el, i) => ({
        label: el,
        value: el,
      })),
    }));
  }

  const [lotConditionForAddBtn, setLotConditionForAddBtn] = useState(false);

  // rtk hook for lot data stack details ....
  const [fetchLotsDataBasedOnStack] = useFetchLotsDataBasedOnStackMutation();
  // function to call the api and set the lot data in the selectOption array...
  async function getLotsData(cir_id, stack_number) {
    const response = await fetchLotsDataBasedOnStack({
      cir_id,
      stack_number,
    }).unwrap();
    console.log(response.data);
    setSelectBoxOptions((prev) => ({
      ...prev,
      lot_numbers: response.data?.map((el, i) => ({
        label: el?.lot_no?.stack_lot_number,
        value: el?.lot_no?.id,
        select_stack_no: el?.select_stack_no?.id,
        data: el,
      })),
    }));
  }

  useEffect(() => {
    // {
    //   deposite_cir_bag: 100000,
    //   deposite_cir_mt: 988,
    //   do_generated_bag: 25000,
    //   do_generated_mt: 247,
    //   delivered_cor_bag: 0,
    //   delivered_cor_mt: 0,
    //   remaining_do_bag: 75000,
    //   remaining_do_mt: 741
    // }

    console.log(mtBagDetail);
  }, [mtBagDetail]);

  // lot details table  add button logic ............
  async function lotDetailsAddButtonMethod() {
    let dataOflot = await getValueLotForm();
    console.log("dataOflot edit : ", dataOflot);

    const { isEdit, index } = lotDetailsEditState;

    // for the add button condition ....
    const result1 =
      dataOflot?.remaining_bag_for_do - dataOflot?.currently_removing_bag;

    const result2 =
      dataOflot?.remaining_mt_for_do - dataOflot?.currently_removing_mt;

    if (!isEdit) {
      console.log("if");
      // REMAINING FOR DO BAGS ....
      await setValueLotForm(lot_details_schema?.remaining_do_bags, result1);
      // REMAINING FOR DO MT	....
      await setValueLotForm(lot_details_schema?.remaining_do_mt, result2);

      console.log(result1);
      console.log(result2);

      dataOflot = {
        id: null,
        ...dataOflot,
        [lot_details_schema?.lot_no]: {
          label: dataOflot?.lot_no?.label,
          value: dataOflot?.lot_no?.value,
        },
        [lot_details_schema?.remaining_do_bags]: result1,
        [lot_details_schema?.remaining_do_mt]: result2,
        isNewlyAdded: true,
      };

      // stack_number_id

      console.log(dataOflot);

      try {
        const isValid = await validatedLotWiseDetailsForm(dataOflot);
        console.log("isValid: ", isValid);
        //  getMTBagList();

        console.log(originalMtBagDetails);

        // let x = {
        //   ...mtBagDetail,
        //   remaining_do_bag:
        //     Number(originalMtBagDetails?.remaining_do_bag) -
        //     Number(dataOflot?.currently_removing_bag || 0),

        //   remaining_do_mt:
        //     Number(originalMtBagDetails?.remaining_do_mt) -
        //     Number(dataOflot?.currently_removing_mt || 0),
        // };

        setMtBagDetail((prevState) => ({
          ...prevState,
          remaining_do_bag:
            Number(prevState?.remaining_do_bag) -
            Number(dataOflot?.currently_removing_bag || 0),
          remaining_do_mt:
            Number(prevState?.remaining_do_mt) -
            Number(dataOflot?.currently_removing_mt || 0),
        }));

        // setMtBagDetail((prevState) => ({
        //   ...prevState,
        //   remaining_do_bag:
        //     Number(originalMtBagDetails?.remaining_do_bag) -
        //     Number(dataOflot?.currently_removing_bag || 0),
        //   remaining_do_mt:
        //     Number(originalMtBagDetails?.remaining_do_mt) -
        //     Number(dataOflot?.currently_removing_mt || 0),
        // }));
      } catch (error) {
        console.log("form error", error);
        Object.keys(error).forEach((key) => {
          lotFormSetError(key, {
            type: "manual",
            message: error[key] || "",
          });
        });
        return false;
      }

      // const updatedArray = lotDetailsFinalCopy.filter((_, idx) => idx !== index);

      console.log(dataOflot.stack_number);
      console.log(dataOflot.lot_no);

      let updatedArray = [];
      // edit button condition ....

      if (lotDetailsFinalCopy?.length > 0) {
        console.log("errerer");
        updatedArray = lotDetailsFinalCopy.filter(
          (el) =>
            el?.stack_number === dataOflot?.stack_number &&
            el?.lot_no.value === dataOflot?.lot_no.value
        );

        // setLotDetailsFinalCopy(updatedArray);
      }
      console.log(updatedArray);

      // set the array to show data in the table
      console.log(updatedArray?.length);
      console.log(updatedArray[0]?.id);
      setLotDetailsFinal((prev) => [
        ...prev,
        {
          ...dataOflot,
          id: updatedArray[0]?.id || null,
          do_generated_bag: updatedArray[0]?.do_generated_bag,
          do_generated_mt: updatedArray[0]?.do_generated_mt,
        },
      ]);
      // if (updatedArray?.length > 0) {
      //   console.log("if");
      // } else {
      //   console.log("else");
      //   setLotDetailsFinal((prev) => [...prev, dataOflot]);
      // }
      // setLotDetailsFinal((prev) => [...prev, dataOflot]);
    } else {
      console.log("else ");
      console.log(dataOflot);
      let updatedArray = [];
      // edit button condition ....
      if (lotDetailsFinalCopy?.length > 0) {
        updatedArray = lotDetailsFinalCopy.filter(
          (el) =>
            el?.stack_number === dataOflot?.stack_number &&
            el?.lot_no.value === dataOflot?.lot_no.value
        );

        console.log(updatedArray);

        // setLotDetailsFinalCopy(updatedArray);
      }

      // set the array to show data in the table
      if (updatedArray?.length) {
        dataOflot = {
          ...dataOflot,
          id: updatedArray[0]?.id,
          do_generated_bag: updatedArray[0]?.do_generated_bag,
          do_generated_mt: updatedArray[0]?.do_generated_mt,
          [lot_details_schema?.remaining_do_bags]: result1,
          [lot_details_schema?.remaining_do_mt]: result2,
        };
      } else {
        dataOflot = {
          ...dataOflot,
          [lot_details_schema?.remaining_do_bags]: result1,
          [lot_details_schema?.remaining_do_mt]: result2,
        };
      }
      // dataOflot = {
      //   ...dataOflot,
      //   [lot_details_schema?.remaining_do_bags]: result1,
      //   [lot_details_schema?.remaining_do_mt]: result2,
      // };

      console.log(dataOflot);

      // updating the lot details table ...
      setLotDetailsFinal((old) => [
        ...old.slice(0, index),
        dataOflot,
        ...old.slice(index + 1),
      ]);

      // subtracting the Currently Removing Bags from the selectoption?.lot_number Remaining Bags For DO bags on add
      // setSelectBoxOptions((prev) => ({
      //   ...prev,
      //   lot_numbers: selectBoxOptions?.lot_numbers?.map((el, i) => ({
      //     label: el?.lot_no?.stack_lot_number,
      //     value: el?.lot_no?.id,
      //     data: el,
      //   })),
      // }));
    }

    console.log(mtBagDetail);
    // current_do_bags//
    // lot_details_schema.currently_removing_mt

    // above MtBagDetail table  data ...
    // setMtBagDetail((prevState) => ({
    //   ...prevState,
    //   remaining_do_bag:
    //     Number(mtBagDetail?.remaining_do_bag) -
    //     dataOflot?.currently_removing_bag,
    //   remaining_do_mt:
    //     Number(mtBagDetail?.remaining_do_mt) - dataOflot?.currently_removing_mt,
    // }));

    // resetting the index and edit option ...
    setLotDetailsEditState({
      index: null,
      isEdit: false,
    });

    // clear the fields once the edit or add button is clicked .....
    resetLotForm({ [lot_details_schema?.stack_number]: keepStackSelectValue }); //  except the stack select
    setValueLotForm(lot_details_schema?.average_bag_size, "");
  }

  // function call on the edit icon ...
  const UpdateLotDetailsFunction = (item, index) => {
    console.log("item: inside the edit mode >>", item);
    setLotDetailsEditState({
      index,
      isEdit: true,
    });
    // select_stack_no
    //??? main logic ....
    const lotDetailsData = selectBoxOptions.lot_numbers.filter(
      (el) => el?.label === item?.lot_no?.label
    )[0]?.data;
    console.log(
      "lotDetailsData: >>>>>>>>>>> in edit mode  >> ",
      lotDetailsData
    );

    getLotsData(getValues("cir"), item?.stack_number);

    let obj = {
      [lot_details_schema?.stack_number]: item?.stack_number,
      // [lot_details_schema.lot_no]: {
      //   label: lotDetailsData?.lot_no?.stack_lot_number,
      //   value: lotDetailsData?.lot_no?.id,
      // },
      [lot_details_schema.lot_no]: item?.lot_no,
      [lot_details_schema?.currently_removing_bag]:
        item?.currently_removing_bag,
      [lot_details_schema?.currently_removing_mt]: item?.currently_removing_mt,
      [lot_details_schema.average_bag_size]: item?.average_bag_size,
      [lot_details_schema.remaining_bag_for_do]: item?.remaining_bag_for_do,
      stack_number_id: lotDetailsData?.select_stack_no?.id,
      [lot_details_schema.remaining_mt_for_do]: item?.remaining_mt_for_do,
      [lot_details_schema.deposited_cir_bag]: lotDetailsData?.no_of_bags,
      [lot_details_schema.deposited_cir_mt]: lotDetailsData?.weight_in_stack,
      [lot_details_schema.do_generated_bag]:
        lotDetailsData?.remaining_commodity_for_lot_wise?.do_generated_bag,
      [lot_details_schema.do_generated_mt]:
        lotDetailsData?.remaining_commodity_for_lot_wise?.do_generated_mt,
      [lot_details_schema.delivered_cor_bags]:
        lotDetailsData?.remaining_commodity_for_lot_wise?.delivered_cor_bags,
      [lot_details_schema.delivered_cor_mt]:
        lotDetailsData?.remaining_commodity_for_lot_wise?.delivered_cor_mt,
    };

    console.log(selectBoxOptions?.lot_numbers);

    console.log(obj);

    // console.log("obj edit mode -->", { obj, item });

    Object.keys(obj)?.forEach((key) => {
      setValueLotForm(key, obj[key], {
        shouldValidate: true,
      });
    });
    // setUpdateStackId(index);
  };

  // function call on the delete icon ...
  const DeleteLotDetailsFunction = (index) => {
    console.log(index);
    // {
    //   deposite_cir_bag: 450,
    //   deposite_cir_mt: 41,
    //   do_generated_bag: 5,
    //   do_generated_mt: 0.83,
    //   delivered_cor_bag: 0,
    //   delivered_cor_mt: 0,
    //   remaining_do_bag: 445,
    //   remaining_do_mt: 40.17
    // }
    // ----- //
    // {
    //   id: 49,
    //   stack_number: 2,
    //   stack_number_id: 303,
    //   lot_no: { label: 'GP240122156/1', value: 155 },
    //   average_bag_size: 166.67,
    //   currently_removing_bag: 5,
    //   currently_removing_mt: 0.8333499999999999,
    //   deposited_cir_bag: 6,
    //   deposited_cir_mt: 1,
    //   do_generated_bag: 0,
    //   do_generated_mt: 0,
    //   delivered_cor_bags: 0,
    //   delivered_cor_mt: 0,
    //   remaining_do_bags: 6,
    //   remaining_do_mt: 1
    // }

    // {
    //   id: 111,
    //   stack_number: 5,
    //   stack_number_id: 364,
    //   lot_no: { label: 'GP240221220/1', value: 288 },
    //   average_bag_size: 20,
    //   currently_removing_bag: 1,
    //   currently_removing_mt: 0.02,
    //   deposited_cir_bag: 5000,
    //   deposited_cir_mt: 100,
    //   do_generated_bag: 250,
    //   do_generated_mt: 5,
    //   delivered_cor_bags: 0,
    //   delivered_cor_mt: 0,
    //   remaining_do_bags: 4999,
    //   remaining_do_mt: 99.98
    // }
    const deletedObj = lotDetailsFinal[index];
    console.log(deletedObj);
    setLotDetailsFinalCopy((prev) => [...prev, deletedObj]);
    const updatedArray = lotDetailsFinal.filter((_, idx) => idx !== index);
    console.log(mtBagDetail);
    console.log(deletedObj);
    if (!deletedObj?.isNewlyAdded) {
      setMtBagDetail((prevState) => ({
        ...prevState,
        do_generated_bag:
          Number(prevState?.do_generated_bag) -
          Number(deletedObj?.currently_removing_bag),
        do_generated_mt:
          Number(prevState?.do_generated_mt) -
          Number(deletedObj?.currently_removing_mt),

        remaining_do_bag:
          Number(prevState?.remaining_do_bag) +
          Number(deletedObj?.currently_removing_bag),

        remaining_do_mt:
          Number(prevState?.remaining_do_mt) +
          Number(deletedObj?.currently_removing_mt),
      }));
    } else {
      setMtBagDetail((prevState) => ({
        ...prevState,

        remaining_do_bag:
          Number(prevState?.remaining_do_bag) +
          Number(deletedObj?.currently_removing_bag),

        remaining_do_mt:
          Number(prevState?.remaining_do_mt) +
          Number(deletedObj?.currently_removing_mt),
      }));
    }
    // remaining_do_bag:
    //   Number(originalMtBagDetails?.remaining_do_bag) -
    //   Number(dataOflot?.currently_removing_bag || 0),
    // remaining_do_mt:
    //   Number(originalMtBagDetails?.remaining_do_mt) -
    //   Number(dataOflot?.currently_removing_mt || 0),

    setLotDetailsFinal(updatedArray);
    // getMTBagList();
    setLotDetailsEditState({
      index: null,
      isEdit: false,
    });
  };

  // logic to reset all the field of the lot details table ..
  useEffect(() => {
    // resetLotForm();

    // setValueLotForm(lot_details_schema?.average_bag_size, "");
    // current_do_bags//
    // lot_details_schema.currently_removing_mt

    // above MtBagDetail table  data ...

    console.log(Number(getValues("current_do_bags")));
    console.log(Number(getValues(lot_details_schema.currently_removing_mt)));

    // if (getValues("whr_no")) {
    //   setMtBagDetail((prevState) => ({
    //     ...prevState,
    //     remaining_do_bag:
    //       Number(originalMtBagDetails?.remaining_do_bag) -
    //       Number(getValues("current_do_bags") || 0),
    //     remaining_do_mt:
    //       Number(originalMtBagDetails?.remaining_do_mt) -
    //       Number(getValues("current_do_mt") || 0),
    //   }));
    // }
  }, [getValues("current_do_bags")]);

  // rtk hook for the post submit (add button api)..
  const [postDOSubmit, { isLoading: postDOSubmitLoading }] =
    usePostDOSubmitMutation();
  // stack_number
  // main add button logic for the whole form ..
  const addData = async (data) => {
    console.log("lotDetailsFinal", lotDetailsFinal);
    const delivery_order_lot_details = lotDetailsFinal?.map((el) => ({
      id: el?.id || null,
      stack_no: el?.stack_number_id,
      lot_no: el?.lot_no?.value,
      // remaining_do_bags: el?.remaining_do_bags,
      avg_bag_size: el?.average_bag_size,
      current_do_remove_bag: el?.currently_removing_bag,
      current_do_remove_mt: el?.currently_removing_mt,
      deposit_cir_bags: el?.deposited_cir_bag,
      deposit_cir_mt: el?.deposited_cir_mt,
      do_generated_bags: el?.do_generated_bag,
      do_generated_mt: el?.do_generated_mt,
      delivered_cor_bags: el?.delivered_cor_bags,
      delivered_cor_mt: el?.delivered_cor_mt,
      remaining_for_do_bags: el?.remaining_do_bags || el?.remaining_bag_for_do,
      remaining_for_do_mt: el?.remaining_do_mt || el?.remaining_mt_for_do,
    }));
    // remaining_do_bags

    console.log("delivery_order_lot_details", delivery_order_lot_details);

    //   {
    //     "avg_bag_size": 166.67,
    //     "current_do_remove_bag": 4,
    //     "current_do_remove_mt": 0.6666799999999999,
    //     "deposit_cir_bags": 6,
    //     "deposit_cir_mt": 1,
    //     "do_generated_bags": 0,
    //     "do_generated_mt": 0,
    //     "delivered_cor_bags": 0,
    //     "delivered_cor_mt": 0,
    //     "remaining_for_do_bags": 6,
    //     "remaining_for_do_mt": 1,
    //     "stack_no": 303,
    //     "lot_no": 155,
    //  }

    let final_payload = {
      ...data,
      client_authorised_person_contact_number: `+91${data?.client_authorised_person_contact_number}`,
      warehouse: data?.warehouse_id,
      commodity_variety: data?.commodity_varity,
      delivery_order_lot_details: delivery_order_lot_details,
      delivery_order_history: {
        expiry_date: data?.expire_date,
      },
    };
    console.log("final_payload: ", final_payload);
    try {
      const response = await postDOSubmit(final_payload).unwrap();
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.DELIVERY_ORDER}`);
      }
    } catch (error) {
      let errorMessage =
        error?.data?.data || error?.data?.message || "DO Creation Failed";
      console.log("Error: in the create do api console >>>>", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Approval cycle code start ...............................................

  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState(false);
  let do_id = params?.id;
  // rtk hook for the assign api ...
  const [assignDo, { isLoading: useAssignDoIsLoading }] = useAssignDoMutation();

  const assignToMeFunction = async () => {
    const data = {
      id: details.id,
      status: "assigned",
      reasons: "",
    };

    try {
      // api calling for the do assign ..;.
      const response = await assignDo(data).unwrap();
      console.log("assignDo - Success:", response);
      if (response.status === 200) {
        toasterAlert({
          message: "Delivery Order Assign Successfully.",
          status: 200,
        });
        // making up the application reload ..
        window.location.reload();
      }
    } catch (error) {
      // alert(55555);
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data || error?.data?.message || "Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };
  //
  const approvedToMeFunction = async () => {
    // call the update api here .....
    // const responseUpdateApi = await updateData();
    let dataOflot = await getValues();
    console.log(dataOflot);

    try {
      const isValid = await validatedDeliveryOrderDetailsForm(dataOflot);
      console.log("isValid: ", isValid);
      //  getMTBagList();
    } catch (error) {
      console.log("form error", error);
      // alert(1111);
      toasterAlert(error);

      // showToastByStatusCode()
      // Object.keys(error).forEach((key) => {
      //   lotFormSetError(key, {
      //     type: "manual",
      //     message: error[key] || "",
      //   });
      // });
      return false;
    }
    const data = {
      id: details.id,
      status: "approved",
      reasons: "",
    };
    let responseUpdateApi = "";
    try {
      responseUpdateApi = await assignDo(data);
    } catch (error) {
      // alert(6666666);
      console.log(error);
      toasterAlert(error);
    }
    console.log("responseUpdateApi: ", responseUpdateApi?.status);
    console.log("responseUpdateApi: ", responseUpdateApi);

    if (
      responseUpdateApi?.status === 400 ||
      responseUpdateApi?.data?.status === 400
    ) {
      let errorMessage =
        responseUpdateApi?.error?.data?.data ||
        responseUpdateApi?.error?.data?.message ||
        "Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
      return false;
    }

    // const data = {
    //   id: details.id,
    //   status: "approved",
    //   reasons: "",
    // };
    //// //
    try {
      // calling api for the approve cycle
      if (responseUpdateApi?.data?.status === 200) {
        // const response = await assignDo(data).unwrap();
        const response = await updateData();
        console.log("assignDo - Success:", response);
        if (response.status === 200) {
          toasterAlert({
            message: "Delivery Order Approved Successfully.",
            status: 200,
          });
          navigate(`${ROUTE_PATH.DELIVERY_ORDER}`);
        }
      }
    } catch (error) {
      // alert(22222);
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data || error?.data?.message || "Request Failed.";
      console.log("Error:", errorMessage);

      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  const rejectedToMeFunction = async () => {
    console.log("dfkjasgkf");
    if (rejectReason === "") {
      setValue("rejectReason_text", "", {
        shouldValidate: true,
      });
      return false;
    }
    const data = {
      id: details.id,
      status: "rejected",
      reasons: rejectReason || "reject",
    };
    console.log("data: for reject >>", data);
    // console.log("data: for reject >>", data);

    try {
      console.log("I am here >>>");
      const response = await assignDo(data).unwrap();
      console.log("assignDo - Success:", response);
      if (response.status === 200) {
        console.log("response --> ", response);
        toasterAlert({
          message: "Delivery Order Rejected Successfully.",
          status: 200,
        });

        navigate(`${ROUTE_PATH.DELIVERY_ORDER}`);
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
  };

  //  Approval cycle code end .....................................

  // RESET THE CODE OF THE DROPDOWN AND THE LOT DETAILS TABLE AND MT TABLE
  function resetTables() {
    resetLotForm();
    setValueLotForm(lot_details_schema.stack_number, "");
    setValueLotForm(lot_details_schema.lot_no, "");
    setValueLotForm(lot_details_schema?.average_bag_size, "");
    setMtBagDetail([]);
    setLotDetailsFinal([]);
    setSelectBoxOptions((prev) => ({
      ...prev,
      stack_number: [],
      lot_numbers: [],
    }));
  }

  function resetDropdownList(currentIndex) {
    for (let i = currentIndex + 1; i <= 10; i++) {
      setValue(`${DROP_DOWN_KEY_NAME_FOR_RESET[i]}`, "");
    }
    if (currentIndex !== 10) {
      resetTables();
    }
  }

  // fetch the user data from the local storage ...
  const loginData = useMemo(() => {
    return localStorageService.get("GG_ADMIN");
  }, []);
  console.log("loginData: in DO >>>", loginData);

  // code to avoid other user to edit the form once the user been assigned ..
  const inputDisableFunction = () => {
    // const disableDOField = () => {
    const NotUser =
      Number(details?.status?.status_code || 0) === 0
        ? false
        : details?.l2_user !== null
        ? details?.l2_user?.id === loginData?.userDetails?.id || 0
          ? false
          : true
        : details?.l1_user !== null
        ? details?.l1_user?.id === loginData?.userDetails?.id || 0
          ? false
          : true
        : true;
    console.log("NotUser: >>>", NotUser);
    return Number(details?.status?.status_code || 0) === 1 ||
      Number(details?.status?.status_code || 0) === 3 ||
      Number(details?.status?.status_code || 0) === 4 ||
      // view ||
      NotUser
      ? true
      : false;
  };

  // Input field  disable Logic .....
  function disableDOField(status_id) {
    if (details) {
      return status_id === 1 ||
        status_id === 3 ||
        //status_id === 5 ||
        status_id === 7
        ? true
        : false;
      //
    }
  }
  // ...........................................................................

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

  return (
    <Box bg="white" borderRadius={10} p="10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
            <Box>
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Delivery Order No <span style={{ color: "red" }}>*</span>
                    </Text>
                    <Input
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={true}
                      value={getValues("delivery_order_number")}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Delivery Order No"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">
                    Name of Client <span style={{ color: "red" }}>*</span>
                  </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <ReactCustomSelect
                      name="client"
                      // selectDisable={disableDOField(
                      //   details?.status?.status_code
                      // )}
                      selectDisable={InputDisableFunction()}
                      label=""
                      placeholder="Select Name of Client"
                      isLoading={getClientMasterApiIsLoading}
                      options={selectBoxOptions?.client || []}
                      selectedValue={
                        selectBoxOptions?.client?.filter(
                          (item) => item.value === getValues("client")
                        )[0] || {}
                      }
                      isClearable={false}
                      selectType="label"
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      handleOnChange={(val) => {
                        setSelectBoxOptions((prev) => ({
                          ...prev,
                          states: [],
                          substate: [],
                          districts: [],
                          areas: [],
                          warehouse: [],
                          chamber: [],
                          community: [],
                          communityVariety: [],
                          whrNo: [],
                        }));

                        setValue("client", val?.value, {
                          shouldValidate: true,
                        });
                        // logic for resetting the field on change ...
                        resetDropdownList(0);
                      }}
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                    mt="10px"
                  >
                    <Text textAlign="right">
                      Region <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="region"
                      // selectDisable={disableDOField(
                      //   details?.status?.status_code
                      // )}
                      selectDisable={InputDisableFunction()}
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
                        setSelectBoxOptions((prev) => ({
                          ...prev,

                          substate: [],
                          districts: [],
                          areas: [],
                          warehouse: [],
                          chamber: [],
                          community: [],
                          communityVariety: [],
                          whrNo: [],
                        }));

                        regionOnChange(val);
                        resetDropdownList(1);
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
                      State <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="state"
                      // selectDisable={disableDOField(
                      //   details?.status?.status_code
                      // )}
                      selectDisable={InputDisableFunction()}
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
                        setSelectBoxOptions((prev) => ({
                          ...prev,
                          districts: [],
                          areas: [],
                          warehouse: [],
                          chamber: [],
                          community: [],
                          communityVariety: [],
                          whrNo: [],
                        }));
                        stateOnChange(val);
                        resetDropdownList(2);
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
                      Sub State <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      name="substate"
                      selectDisable={InputDisableFunction()}
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
                        setSelectBoxOptions((prev) => ({
                          ...prev,
                          areas: [],
                          warehouse: [],
                          chamber: [],
                          community: [],
                          communityVariety: [],
                          whrNo: [],
                        }));
                        zoneOnChange(val);
                        resetDropdownList(3);
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
                  mt="10px"
                >
                  <Text textAlign="right">
                    District <span style={{ color: "red" }}>*</span>
                  </Text>
                  <ReactCustomSelect
                    name="district"
                    selectDisable={InputDisableFunction()}
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
                      setSelectBoxOptions((prev) => ({
                        ...prev,
                        warehouse: [],
                        chamber: [],
                        community: [],
                        communityVariety: [],
                        whrNo: [],
                      }));
                      districtOnChange(val);
                      resetDropdownList(4);
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
                    name="area"
                    selectDisable={InputDisableFunction()}
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
                      setSelectBoxOptions((prev) => ({
                        ...prev,
                        chamber: [],
                        community: [],
                        communityVariety: [],
                        whrNo: [],
                      }));
                      areaOnChange(val);
                      resetDropdownList(5);
                    }}
                  />
                </Grid>
              </MotionSlideUp>
            </Box>

            {/* warehouse name  */}
            <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
              <Grid
                gap={4}
                templateColumns={"repeat(3, 1fr)"}
                alignItems="center"
                mt="10px"
              >
                <Text textAlign="right">
                  Warehouse name <span style={{ color: "red" }}>*</span>
                </Text>

                <ReactSelect
                  options={selectBoxOptions?.warehouse || []}
                  onChange={(e) => {
                    setSelectBoxOptions((prev) => ({
                      ...prev,
                      community: [],
                      communityVariety: [],
                      whrNo: [],
                    }));

                    setValue("warehouse_id", e?.value, {
                      shouldValidate: true,
                    });
                    resetDropdownList(6);
                  }}
                  // isDisabled={disableDOField(details?.status?.status_code)}
                  isDisabled={InputDisableFunction()}
                  value={
                    selectBoxOptions?.warehouse?.filter(
                      (item) => item.value === getValues("warehouse_id")
                    )[0] || {}
                  }
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      borderColor: errors?.warehouse_id ? "red" : "#c3c3c3",

                      padding: "1px",
                      textAlign: "left",
                    }),
                    ...reactSelectStyle,
                  }}
                  isLoading={getWarehouseMasterApiIsLoading}
                />
              </Grid>
            </MotionSlideUp>

            {/* chamber Number */}
            <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
              <Grid
                gap={4}
                templateColumns={"repeat(3, 1fr)"}
                alignItems="center"
                mt="10px"
              >
                <Text textAlign="right">
                  Chamber No
                  <span style={{ color: "red" }}>*</span>
                </Text>

                <ReactSelect
                  options={selectBoxOptions?.chamber || []}
                  onChange={(e) => {
                    setSelectBoxOptions((prev) => ({
                      ...prev,
                      communityVariety: [],
                      whrNo: [],
                    }));
                    setValue("chamber", e?.value, {
                      shouldValidate: true,
                    });
                    resetDropdownList(7);
                  }}
                  isDisabled={InputDisableFunction()}
                  value={
                    selectBoxOptions?.chamber?.filter(
                      (item) => item.value === getValues("chamber")
                    )[0] || {}
                  }
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#fff",

                      borderRadius: "6px",
                      borderColor: errors.chamber ? "red" : "#c3c3c3",

                      padding: "1px",
                      textAlign: "left",
                    }),
                    ...reactSelectStyle,
                  }}
                  isLoading={getChamberApiIsLoading}
                />
              </Grid>
            </MotionSlideUp>

            {/* commodity name */}
            <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
              <Grid
                gap={4}
                templateColumns={"repeat(3, 1fr)"}
                alignItems="center"
                mt="10px"
              >
                <Text textAlign="right">
                  Commodity Name <span style={{ color: "red" }}>*</span>
                </Text>

                <ReactSelect
                  options={selectBoxOptions?.community || []}
                  onChange={(e) => {
                    setSelectBoxOptions((prev) => ({
                      ...prev,
                      whrNo: [],
                    }));
                    setValue("commodity", e?.value, {
                      shouldValidate: true,
                    });
                    resetDropdownList(8);
                  }}
                  isDisabled={InputDisableFunction()}
                  value={
                    selectBoxOptions?.community?.filter(
                      (item) => item.value === getValues("commodity")
                    )[0] || {}
                  }
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      borderColor: errors.commodity ? "red" : "#c3c3c3",

                      padding: "1px",
                      textAlign: "left",
                    }),
                    ...reactSelectStyle,
                  }}
                  isLoading={getCommodityMasterApiIsLoading}
                />
              </Grid>
            </MotionSlideUp>

            {/* commodity verity */}
            <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
              <Grid
                gap={4}
                templateColumns={"repeat(3, 1fr)"}
                alignItems="center"
                mt="10px"
              >
                <Text textAlign="right">
                  Commodity Variety <span style={{ color: "red" }}>*</span>
                </Text>

                <ReactSelect
                  isDisabled={InputDisableFunction()}
                  options={selectBoxOptions?.communityVariety || []}
                  onChange={(e) => {
                    console.log("e: commodity variety on change>>>", e);

                    // selectBoxOptions?.communityVariety

                    // setSelectBoxOptions((prev) => ({
                    //   ...prev,
                    //   whrNo: [],
                    // }));

                    setValue("commodity_varity", e?.value, {
                      shouldValidate: true,
                    });
                    resetDropdownList(9);
                  }}
                  // isDisabled={disableDOField(details?.status?.status_code)}
                  value={
                    selectBoxOptions?.communityVariety?.filter(
                      (item) => item.value === getValues("commodity_varity")
                    )[0] || {}
                  }
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      borderColor: errors.commodity_varity ? "red" : "#c3c3c3",
                      padding: "1px",
                      textAlign: "left",
                    }),
                    ...reactSelectStyle,
                  }}
                  isLoading={getCommodityVarityApiIsLoading}
                />
              </Grid>
            </MotionSlideUp>

            {/* WHR No  */}
            <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
              <Grid
                gap={4}
                templateColumns={"repeat(3, 1fr)"}
                alignItems="center"
                mt="10px"
              >
                <Text textAlign="right">
                  WHR No <span style={{ color: "red" }}>*</span>
                </Text>

                <ReactSelect
                  options={selectBoxOptions?.whrNo || []}
                  isDisabled={InputDisableFunction()}
                  isLoading={getWHRApiIsLoading}
                  onChange={(e) => {
                    console.log("e: of the whr >>>", e);
                    setValue("whr_no", e?.value, {
                      shouldValidate: true,
                    });
                    console.log(getValues());

                    setSelectBoxOptions((prev) => ({
                      ...prev,
                      stack_number: [],
                      lot_numbers: [],
                    }));
                    setLotDetailsFinal([]);
                    console.log(getValues("cir"));
                    console.log(getValues("whr_no"));

                    setValue("cir", e.value);

                    // calling as API for the stack_number details .....
                    getUniqueStackList(e.value);
                    // getUniqueStackList(getValues("whr_no"));
                    resetDropdownList(10);
                  }}
                  //  isDisabled={disableDOField(details?.status?.status_code)}
                  value={
                    selectBoxOptions?.whrNo?.filter(
                      (item) => item.value === getValues("whr_no")
                    )[0] || {}
                  }
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderColor: errors.whr_no ? "#e53e3e" : "#c3c3c3",
                      backgroundColor: "white",

                      borderRadius: "6px",

                      padding: "1px",
                      textAlign: "left",
                    }),
                    ...reactSelectStyle,
                  }}
                />
              </Grid>
            </MotionSlideUp>
            {/* <button onClick={resetTables}> click me </button> */}
            {/* table  */}
            <TableContainer mt="25px">
              <Table color="#000">
                <Thead bg="#dbfff5" border="1px" borderColor="#000">
                  <Tr style={{ color: "#000" }}>
                    <Th color="#000"></Th>
                    <Th color="#000">Deposit CIR</Th>
                    <Th color="#000">DO generated </Th>
                    <Th color="#000">Delivered COR </Th>
                    <Th color="#000">Remaining for DO</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr
                    textAlign="center"
                    bg="white"
                    border="1px"
                    borderColor="#000"
                  >
                    <Td>WHR Bags</Td>
                    <Td>{mtBagDetail?.deposite_cir_bag || 0} </Td>
                    <Td>{mtBagDetail?.do_generated_bag || 0} </Td>
                    <Td>{mtBagDetail?.delivered_cor_bag || 0}</Td>
                    <Td>{mtBagDetail?.remaining_do_bag || 0}</Td>
                  </Tr>
                  <Tr
                    textAlign="center"
                    bg="white"
                    border="1px"
                    borderColor="#000"
                    DO
                    GENERATED
                  >
                    <Td>WHR MT</Td>
                    <Td>{mtBagDetail?.deposite_cir_mt || 0} </Td>
                    <Td>{mtBagDetail?.do_generated_mt || 0}</Td>
                    <Td>{mtBagDetail?.delivered_cor_mt || 0}</Td>
                    <Td>{mtBagDetail?.remaining_do_mt || 0}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>

            {/* LOT details* ..................................*/}
            <FormProvider {...lotDetailForm}>
              <form>
                <Box
                  bgColor={"#DBFFF5"}
                  padding={"4"}
                  borderRadius={"md"}
                  mt="25px"
                >
                  <Text fontWeight="bold" textAlign="left">
                    LOT details
                    <span
                      style={{
                        color: "red",
                        marginLeft: "4px",
                      }}
                    >
                      *
                    </span>
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
                    {/* stack no  */}

                    <FormControl>
                      <Text fontWeight="bold" textAlign="left">
                        Stack No{" "}
                      </Text>
                      {/* {getValueLotForm(lot_details_schema?.stack_number)} */}
                      <ReactSelect
                        name={[lot_details_schema.stack_number]}
                        value={
                          selectBoxOptions?.stack_number?.filter(
                            (el) =>
                              el.value ===
                              getValueLotForm(lot_details_schema?.stack_number)
                          )[0] || {}
                        }
                        isDisabled={InputDisableFunction()}
                        onChange={(val) => {
                          console.log(
                            "val: on change  for the stack details >",
                            val
                          );
                          setValueLotForm(
                            lot_details_schema.stack_number,
                            val.value,
                            {
                              shouldValidate: true,
                            }
                          );
                          // call the api to fetch the lots details on the stack on change ....
                          // getLotsData(getValues("cir"), val?.value);
                          getLotsData(getValues("whr_no"), val?.value);
                        }}
                        options={selectBoxOptions?.stack_number || []}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            backgroundColor: "#fff",
                            borderRadius: "6px",
                            // code for the validation ...
                            borderColor: errorslotDetailsForm?.[
                              lot_details_schema.stack_number
                            ]
                              ? "red"
                              : "gray.10",

                            padding: "1px",
                            textAlign: "left",
                          }),
                          ...reactSelectStyle,
                        }}
                      />
                    </FormControl>
                    {/* lot  no  */}

                    <FormControl>
                      <Text fontWeight="bold" textAlign="left">
                        Lot No{" "}
                      </Text>
                      <ReactSelect
                        name={[lot_details_schema.lot_no]}
                        value={
                          selectBoxOptions?.lot_numbers.filter((el) => {
                            return (
                              el.value ===
                              getValueLotForm(lot_details_schema?.lot_no)?.value
                            );
                          })[0] || {}
                        }
                        isDisabled={InputDisableFunction()}
                        onChange={(val) => {
                          setValueLotForm(lot_details_schema?.lot_no, val, {
                            shouldValidate: true,
                          });

                          // if condition lot_no present in the lotsFinl array
                          const targetLotId = val?.value;

                          const isIdPresent = lotDetailsFinal.some(
                            (item) => item.lot_no?.value === targetLotId
                          );
                          console.log("isIdPresent: ", isIdPresent);
                          if (isIdPresent) {
                            // alert("condition true");
                            setLotConditionForAddBtn(true);
                            setValueLotForm(
                              lot_details_schema?.average_bag_size,
                              ""
                            );
                            resetLotForm();
                          } else {
                            console.log(val);
                            setLotConditionForAddBtn(false);
                            // SET THE REST 5 VALUES IN THE FORM USING THE SELECTOPTION STATE LOT_NUMBERS ARRAY
                            const lotDetailsData =
                              selectBoxOptions.lot_numbers.filter(
                                (el) => el.value === val?.value
                              )[0].data;
                            console.log(
                              "lotDetailsData: >>>>>>>>>>> to set keys >> ",
                              lotDetailsData
                            );
                            // copy to set the rest key on add button click ..
                            // [lot_details_schema.stack_number_id]:
                            // lotDetailsData?.select_stack_no?.id || val?.select_stack_no,

                            let obj = {
                              [lot_details_schema.stack_number_id]:
                                val?.select_stack_no,
                              [lot_details_schema?.stack_number]:
                                lotDetailsData?.select_stack_no?.stack_number,
                              [lot_details_schema.lot_no]: val,
                              [lot_details_schema.average_bag_size]:
                                lotDetailsData?.actual_bag_weight,
                              [lot_details_schema.remaining_bag_for_do]:
                                lotDetailsData?.remaining_commodity_for_lot_wise
                                  ?.remaining_do_bags,
                              [lot_details_schema.remaining_mt_for_do]:
                                lotDetailsData?.remaining_commodity_for_lot_wise
                                  ?.remaining_do_mt,
                              [lot_details_schema.deposited_cir_bag]:
                                lotDetailsData?.no_of_bags,
                              [lot_details_schema.deposited_cir_mt]:
                                lotDetailsData?.weight_in_stack,
                              [lot_details_schema.do_generated_bag]:
                                lotDetailsData?.remaining_commodity_for_lot_wise
                                  ?.do_generated_bag,
                              [lot_details_schema.do_generated_mt]:
                                lotDetailsData?.remaining_commodity_for_lot_wise
                                  ?.do_generated_mt,
                              [lot_details_schema.delivered_cor_bags]:
                                lotDetailsData?.remaining_commodity_for_lot_wise
                                  ?.delivered_cor_bags,
                              [lot_details_schema.delivered_cor_mt]:
                                lotDetailsData?.remaining_commodity_for_lot_wise
                                  ?.delivered_cor_mt,
                            };

                            console.log("@@@@@@@@@@@@", val);
                            console.log(obj);

                            //                         {
                            //                           average_bag_size: 9.88,
                            // remaining_bag_for_do: 30000,
                            // remaining_mt_for_do: 296.4,
                            // deposited_cir_bag: 50000,
                            // deposited_cir_mt: 494,
                            // do_generated_bag: 20000,
                            // do_generated_mt: 197.60000000000002,
                            // delivered_cor_bags: 0,
                            // delivered_cor_mt: 0
                            //                         }

                            // {
                            //   id: 84,
                            //   stack_number: 5,
                            //   stack_number_id: 364,
                            //   lot_no: { label: 'GP240202192/2', value: 244 },
                            //   average_bag_size: 9.88,
                            //   currently_removing_bag: 20000,
                            //   currently_removing_mt: 197.60000000000002,
                            //   deposited_cir_bag: 50000,
                            //   deposited_cir_mt: 494,
                            //   do_generated_bag: 0,
                            //   do_generated_mt: 0,
                            //   delivered_cor_bags: 0,
                            //   delivered_cor_mt: 0,
                            //   remaining_do_bags: 30000,
                            //   remaining_do_mt: 296.4
                            // }

                            if (details?.id && lotDetailsFinalCopy.length > 0) {
                              console.log(lotDetailsFinalCopy);

                              let deleted_lot_details =
                                lotDetailsFinalCopy.filter(
                                  (el) =>
                                    el?.stack_number === obj?.stack_number &&
                                    el?.lot_no.value === obj?.lot_no.value
                                );

                              console.log(deleted_lot_details);

                              // [
                              //   {
                              //     id: 83,
                              //     stack_number: 3,
                              //     stack_number_id: 363,
                              //     lot_no: { label: 'GP240202192/1', value: 243 },
                              //     average_bag_size: 9.88,
                              //     currently_removing_bag: 25000,
                              //     currently_removing_mt: 247.00000000000003,
                              //     deposited_cir_bag: 50000,
                              //     deposited_cir_mt: 494,
                              //     do_generated_bag: 0,
                              //     do_generated_mt: 0,
                              //     delivered_cor_bags: 0,
                              //     delivered_cor_mt: 0,
                              //     remaining_do_bags: 25000,
                              //     remaining_do_mt: 246.99999999999997
                              //   }
                              // ]

                              if (deleted_lot_details.length > 0) {
                                let x = {
                                  remaining_do_bags:
                                    Number(
                                      deleted_lot_details[0]
                                        ?.currently_removing_bag
                                    ) +
                                    Number(
                                      deleted_lot_details[0].remaining_do_bags
                                    ),
                                  remaining_do_mt:
                                    deleted_lot_details[0]
                                      .currently_removing_mt +
                                    deleted_lot_details[0].remaining_do_mt,
                                };

                                obj = {
                                  ...obj,
                                  ...x,
                                  remaining_bag_for_do: x.remaining_do_bags,
                                  remaining_mt_for_do: x.remaining_do_mt,
                                };
                              }

                              console.log(obj);

                              console.log(deleted_lot_details);
                            }

                            Object.keys(obj)?.forEach((key) => {
                              setValueLotForm(key, obj[key], {
                                shouldValidate: true,
                              });
                            });
                          }
                        }}
                        options={selectBoxOptions?.lot_numbers || []}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            backgroundColor: "#fff",
                            borderRadius: "6px",
                            borderColor: errorslotDetailsForm?.[
                              lot_details_schema.lot_no
                            ]
                              ? "red"
                              : "gray.10",
                            padding: "1px",
                            textAlign: "left",
                          }),
                          ...reactSelectStyle,
                        }}
                      />
                    </FormControl>

                    {/* Avg Bag Size(kg)  */}
                    <FormControl>
                      <Text fontWeight="bold" textAlign="left">
                        Avg Bag Size(kg)
                      </Text>
                      <Input
                        name={[lot_details_schema.average_bag_size]}
                        value={getValueLotForm(
                          lot_details_schema.average_bag_size
                        )}
                        isDisabled={InputDisableFunction()}
                        placeholder="Avg Bag Size(kg)"
                        type="text"
                        border="1px"
                        backgroundColor={"white"}
                        disabled={true}
                        onChange={(e) => {
                          // setValueLotForm(
                          //   lot_details_schema.average_bag_size,
                          //   e.target.value,
                          //   { shouldValidate: true }
                          // );
                        }}
                      />
                    </FormControl>

                    {/* Remaining Bags for DO  */}
                    <FormControl>
                      <Text fontWeight="bold" textAlign="left">
                        Remaining Bags for DO
                      </Text>
                      <Input
                        name={[lot_details_schema.remaining_bag_for_do]}
                        value={getValueLotForm([
                          lot_details_schema.remaining_bag_for_do,
                        ])}
                        isDisabled={InputDisableFunction()}
                        placeholder="Remaining Bags for DO"
                        type="number"
                        border="1px"
                        backgroundColor={"white"}
                        disabled={true}
                        onChange={(e) => {
                          // setValueLotForm(
                          //   lot_details_schema.remaining_bag_for_do,
                          //   e.target.value,
                          //   { shouldValidate: true }
                          // );
                        }}
                      />
                    </FormControl>

                    {/* Remaining MT for DO  */}
                    <FormControl>
                      <Text fontWeight="bold" textAlign="left">
                        Remaining MT for DO
                      </Text>
                      <Input
                        name={[lot_details_schema.remaining_mt_for_do]}
                        value={getValueLotForm([
                          lot_details_schema.remaining_mt_for_do,
                        ])}
                        isDisabled={InputDisableFunction()}
                        placeholder="Remaining MT for DO"
                        type="number"
                        border="1px"
                        backgroundColor={"white"}
                        disabled={true}
                        onChange={(e) => {
                          // setValueLotForm(
                          //   lot_details_schema.remaining_mt_for_do,
                          //   e.target.value,
                          //   { shouldValidate: true }
                          // );
                        }}
                      />
                    </FormControl>

                    {/*Currently removing Bags */}
                    <FormControl>
                      <Text fontWeight="bold" textAlign="left">
                        Currently removing Bags
                      </Text>
                      <Input
                        name={[lot_details_schema.currently_removing_bag]}
                        placeholder="Currently removing Bags"
                        type="text"
                        isDisabled={InputDisableFunction()}
                        border="1px"
                        borderColor={
                          errorslotDetailsForm?.[
                            lot_details_schema.currently_removing_bag
                          ]
                            ? "red"
                            : "gray.10"
                        }
                        backgroundColor={"white"}
                        value={getValueLotForm([
                          lot_details_schema.currently_removing_bag,
                        ])}
                        //
                        // isDisabled={
                        //   disableDOField(details?.status?.status_code) ||
                        //   lotConditionForAddBtn
                        // }
                        onChange={(e) => {
                          setValueLotForm(
                            lot_details_schema.currently_removing_bag,
                            Number(e.target.value),
                            { shouldValidate: true }
                          );
                          // set the value of the currently removing mt = average bag * currently removing bag /1000 .....
                          setValueLotForm(
                            lot_details_schema.currently_removing_mt,
                            (getValueLotForm([
                              lot_details_schema.average_bag_size,
                            ]) *
                              Number(e.target.value)) /
                              1000,
                            { shouldValidate: true }
                          );
                        }}
                      />
                      {errorslotDetailsForm?.[
                        lot_details_schema.currently_removing_bag
                      ] && (
                        <Box as="small" color="red">
                          {
                            errorslotDetailsForm?.[
                              lot_details_schema.currently_removing_bag
                            ]?.message
                          }
                        </Box>
                      )}

                      {lotConditionForAddBtn && (
                        <Box as="small" color="red">
                          This Lot is already added.
                        </Box>
                      )}
                    </FormControl>

                    {/* Currently removing MT  */}
                    <FormControl>
                      <Text fontWeight="bold" textAlign="left">
                        Currently removing MT
                      </Text>
                      <Input
                        name={[lot_details_schema.currently_removing_mt]}
                        value={Number(
                          getValueLotForm([
                            lot_details_schema.currently_removing_mt,
                          ])
                        )}
                        placeholder="Currently removing MT"
                        type="text"
                        border="1px"
                        // borderColor={
                        //   errorslotDetailsForm?.[
                        //     lot_details_schema.currently_removing_mt
                        //   ]
                        //     ? "red"
                        //     : "gray.10"
                        // }
                        backgroundColor={"white"}
                        isDisabled={true}
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
                  <Box
                    display="flex"
                    gap={2}
                    justifyContent="flex-end"
                    px="0"
                    mt="20px"
                  >
                    {/* button code for the add in the lot details  */}
                    <Button
                      type="button"
                      //w="full"
                      backgroundColor={"primary.700"}
                      _hover={{ backgroundColor: "primary.700" }}
                      color={"white"}
                      borderRadius={"full"}
                      // my={"4"}
                      px={"10"}
                      disabled={lotConditionForAddBtn}
                      onClick={
                        disableDOField(details?.status?.status_code)
                          ? null
                          : () => {
                              lotDetailsAddButtonMethod();
                            }
                      }
                    >
                      {lotDetailsEditState.isEdit ? "Update" : "Add"}
                    </Button>
                  </Box>
                </Box>
              </form>
            </FormProvider>
            {/* table  */}
            <TableContainer mt="4">
              <Table color="#000">
                <Thead bg="#dbfff5" border="1px" borderColor="#000">
                  <Tr style={{ color: "#000" }}>
                    <Th color="#000">Sr no</Th>
                    <Th color="#000">Stack no </Th>
                    <Th color="#000">lot no </Th>
                    <Th color="#000">Avg Bag Size </Th>
                    <Th color="#000">Currently removing Bags </Th>
                    <Th color="#000">Currently removing MT </Th>
                    <Th color="#000">Deposit CIR Bags </Th>
                    <Th color="#000">Deposit CIR MT</Th>
                    <Th color="#000">DO generated Bags</Th>
                    <Th color="#000">DO generated MT</Th>
                    <Th color="#000">Delivered COR Bags</Th>
                    <Th color="#000">Delivered COR MT</Th>
                    <Th color="#000">Remaining Bags for DO </Th>
                    <Th color="#000">Remaining MT for DO </Th>
                    <Th color="#000">Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {lotDetailsFinal?.length > 0 ? (
                    lotDetailsFinal?.map((item, index) => (
                      <Tr
                        key={`lot_${index}`}
                        textAlign="center"
                        bg="white"
                        border="1px"
                        borderColor="#000"
                      >
                        {console.log("item: in the table for lot >>>>", item)}
                        {console.log("items data >>>", item)}
                        <Td>{index + 1 || "-"}</Td>
                        <Td>{item.stack_number || "-"} </Td>
                        <Td>{item.lot_no.label || "-"}</Td>
                        <Td>{item.average_bag_size || 0}</Td>
                        <Td>{item.currently_removing_bag || 0}</Td>
                        <Td>
                          {item.currently_removing_mt
                            ? item.currently_removing_mt
                            : 0}
                        </Td>
                        <Td>
                          {item.deposited_cir_bag ? item.deposited_cir_bag : 0}
                        </Td>
                        <Td>
                          {item.deposited_cir_mt ? item.deposited_cir_mt : 0}
                        </Td>
                        <Td>
                          {item.do_generated_bag ? item.do_generated_bag : 0}
                        </Td>
                        <Td>
                          {item.do_generated_mt ? item.do_generated_mt : 0}
                        </Td>
                        <Td>
                          {item.delivered_cor_bags
                            ? item.delivered_cor_bags
                            : 0}
                        </Td>
                        <Td>
                          {item.delivered_cor_mt ? item.delivered_cor_mt : 0}
                        </Td>
                        <Td>
                          {item.remaining_do_bags ? item.remaining_do_bags : 0}{" "}
                        </Td>
                        <Td>
                          {item.remaining_do_mt ? item.remaining_do_mt : 0}
                        </Td>
                        <Td>
                          <Box display="flex" alignItems="center" gap="3">
                            <Flex gap="20px" justifyContent="center">
                              {/* <Box color={"primary.700"}>
                                <BiEditAlt
                                  // color="#A6CE39"
                                  isDisabled
                                  fontSize="26px"
                                  cursor="pointer"
                                  onClick={() => {
                                    let y = disableDOField(
                                      details?.status?.status_code
                                    );
                                    console.log(y);

                                    console.log(item);
                                    setLotConditionForAddBtn(false);
                                    UpdateLotDetailsFunction(item, index);
                                  }}
                                />
                              </Box> */}
                              <Box color="red">
                                <AiOutlineDelete
                                  cursor="pointer"
                                  fontSize="26px"
                                  onClick={
                                    disableDOField(details?.status?.status_code)
                                      ? null
                                      : () => {
                                          console.log("index123333: ", index);
                                          setLotConditionForAddBtn(false);
                                          DeleteLotDetailsFunction(index);
                                        }
                                  }
                                />
                              </Box>
                            </Flex>
                          </Box>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={15}> No Records Found </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>

            {/* lot details end ................................ */}

            {/* currently delivering total bags in DO  */}
            <Box>
              <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                  mt="10px"
                >
                  <Text textAlign="right">
                    currently delivering total bags in DO{" "}
                  </Text>
                  <Input
                    placeholder="currently delivering total bags in DO"
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    isDisabled={true}
                    value={getValues("current_do_bags")}
                  />
                </Grid>
              </MotionSlideUp>
            </Box>

            {/* currently delivering total MT in DO  */}
            <Box>
              <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                  mt="10px"
                >
                  <Text textAlign="right">
                    currently delivering total MT in DO{" "}
                  </Text>
                  <Input
                    placeholder="currently delivering total MT in DO"
                    type="number"
                    border="1px"
                    borderColor="gray.10"
                    isDisabled={true}
                    backgroundColor={"white"}
                    value={Number(getValues("current_do_mt"))}
                  />
                </Grid>
              </MotionSlideUp>
            </Box>

            {/* Authorised person of client */}
            <Box>
              <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                  mt="10px"
                >
                  <Text textAlign="right">
                    Authorized person of client
                    <span style={{ color: "red" }}> *</span>
                  </Text>
                  <Input
                    placeholder="Authorized person of client"
                    type="text"
                    border="1px"
                    borderColor={
                      errors.client_authorised_person ? "red" : "#c3c3c3"
                    }
                    isDisabled={InputDisableFunction()}
                    backgroundColor={"white"}
                    value={getValues("client_authorised_person")}
                    onChange={(e) => {
                      setValue("client_authorised_person", e.target.value, {
                        shouldValidate: true,
                      });
                    }}
                  />
                </Grid>
              </MotionSlideUp>
            </Box>

            {/* Authorised person mobile no */}
            <Box>
              <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                  mt="10px"
                >
                  <Text textAlign="right">
                    Authorized person mobile no
                    <span style={{ color: "red" }}> *</span>
                  </Text>
                  <Input
                    placeholder="Authorized person mobile no"
                    type="text"
                    border="1px"
                    borderColor={
                      errors.client_authorised_person_contact_number
                        ? "red"
                        : "#c3c3c3"
                    }
                    isDisabled={InputDisableFunction()}
                    backgroundColor={"white"}
                    value={getValues("client_authorised_person_contact_number")}
                    onChange={(e) => {
                      setValue(
                        "client_authorised_person_contact_number",
                        e.target.value,
                        {
                          shouldValidate: true,
                        }
                      );
                    }}
                  />
                </Grid>
              </MotionSlideUp>
            </Box>

            {/* Authorise person ID Proof type */}
            <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
              <Grid
                gap={4}
                templateColumns={"repeat(3, 1fr)"}
                alignItems="center"
                mt="10px"
              >
                <Text textAlign="right">
                  Authorize person ID Proof type{" "}
                  <span style={{ color: "red" }}>*</span>
                </Text>

                <ReactSelect
                  options={authProofType || []}
                  name="client_authorised_person_id_proof_type"
                  value={
                    authProofType?.filter(
                      (item) =>
                        item.value ===
                        getValues("client_authorised_person_id_proof_type")
                    )[0] || {}
                  }
                  isDisabled={InputDisableFunction()}
                  onChange={(e) => {
                    setValue(
                      "client_authorised_person_id_proof_type",
                      e.value,
                      {
                        shouldValidate: true,
                      }
                    );
                    setValue("client_authorised_person_id_proof_number", "", {
                      shouldValidate: true,
                    });
                  }}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      borderColor: errors.client_authorised_person_id_proof_type
                        ? "red"
                        : "#c3c3c3",

                      padding: "1px",
                      textAlign: "left",
                      placeholder: "Aadhar / PAN",
                    }),
                    ...reactSelectStyle,
                  }}
                  // isLoading={getChamberApiIsLoading}
                />
              </Grid>
            </MotionSlideUp>

            {/* Authorise Person ID Proof no */}
            <Grid
              textAlign="right"
              alignItems="center"
              my="3"
              templateColumns={templateColumns}
              gap={5}
            >
              {/* // client_authorised_person_id_proof_number */}
              <GridItem colSpan={{ base: 1, lg: 0 }}>
                <Text textAlign="right">
                  Authorise Person ID Proof no{" "}
                  <span style={{ color: "red" }}> *</span>
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 1 }}>
                <Input
                  placeholder="Enter id proof no "
                  type="text"
                  border="1px"
                  borderColor={
                    errors?.client_authorised_person_id_proof_number
                      ? "red"
                      : "#c3c3c3"
                  }
                  backgroundColor={"white"}
                  isDisabled={InputDisableFunction()}
                  value={getValues("client_authorised_person_id_proof_number")}
                  onChange={(e) => {
                    setValue(
                      "client_authorised_person_id_proof_number",
                      e.target.value,
                      {
                        shouldValidate: true,
                      }
                    );
                  }}
                />

                {errors &&
                  errors?.client_authorised_person_id_proof_number?.message && (
                    <Text textAlign="left" color="red">
                      {
                        errors?.client_authorised_person_id_proof_number
                          ?.message
                      }
                    </Text>
                  )}
              </GridItem>
            </Grid>
            {/* Upload client authority letter */}
            <Box>
              <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                  mt="10px"
                >
                  <Text textAlign="right">
                    Upload client authority letter
                    <span style={{ color: "red" }}> *</span>
                  </Text>
                  <CustomFileInput
                    name={"client_authorised_letter_path"}
                    placeholder="Agreement upload"
                    label=""
                    type="application/pdf ,image/jpg, image/png, image/jpeg ,application/msword "
                    defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                    InputDisabled={InputDisableFunction()}
                    fileuplaod_folder_structure={{
                      type: "DO",
                      subtype: "DO",
                    }}
                    onChange={(e) => {
                      console.log(e, "file");
                      setValue("client_authorised_letter_path", e, {
                        shouldValidate: true,
                      });
                    }}
                    showErr={
                      errors.client_authorised_letter_path ? true : false
                    }
                    value={getValues("client_authorised_letter_path")}
                    style={{
                      mb: 1,
                      mt: 1,
                    }}
                  />
                </Grid>
              </MotionSlideUp>
            </Box>

            {/* Broker name */}
            <Box>
              <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                  mt="10px"
                >
                  <Text textAlign="right">Broker name </Text>
                  <Input
                    placeholder="Broker names "
                    type="text"
                    border="1px"
                    isDisabled={InputDisableFunction()}
                    // borderColor={errors.broker_name ? "red" : "#c3c3c3"}
                    backgroundColor={"white"}
                    value={getValues("broker_name")}
                    onChange={(e) => {
                      setValue("broker_name", e.target.value, {
                        shouldValidate: true,
                      });
                    }}
                  />
                </Grid>
              </MotionSlideUp>
            </Box>
            {/* Expire date of DO */}

            <Box>
              <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                >
                  {console.log("sahjvhjscahj", getValues("expire_date"))}
                  <Text textAlign="right">
                    Expire date of DO
                    <span style={{ color: "red" }}>*</span>
                  </Text>
                  <CustomInput
                    name="date_of_transfer"
                    placeholder="Expire date of DO"
                    type="date"
                    InputDisabled={InputDisableFunction()}
                    label=""
                    style={{
                      mb: 1,
                      mt: 1,
                    }}
                    borderColor={errors.expire_date ? "red" : "#c3c3c3"}
                    min={currentDate} // Set min attribute to the current date
                    inputValue={getValues("expire_date")}
                    onChange={(e) => {
                      console.log("test_daate", e.target.value);
                      setValue("expire_date", e.target.value, {
                        shouldValidate: true,
                        //
                      });
                    }}
                  />
                </Grid>
              </MotionSlideUp>
            </Box>

            {/* Remarks */}
            <Box>
              <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                <Grid
                  gap={4}
                  templateColumns={"repeat(3, 1fr)"}
                  alignItems="center"
                  mt="10px"
                >
                  <Text textAlign="right">Remarks </Text>
                  <Textarea
                    name="remarks"
                    placeholder="Remarks"
                    type="text"
                    border="1px"
                    isDisabled={InputDisableFunction()}
                    backgroundColor={"white"}
                    // borderColor={errors.remarks ? "red" : "#c3c3c3"}
                    //  value={getValues("remarks")}
                    onChange={(e) => {
                      setValue("remarks", e.target.value, {
                        shouldValidate: false,
                      });
                    }}
                  />
                </Grid>
              </MotionSlideUp>
            </Box>

            {/* DO Update history table */}
            {!location.pathname === "/delivery-order-add" ? (
              <>
                <Box marginTop="10">
                  <Text fontSize={"xl"} color={"black"} fontWeight={"normal"}>
                    DO Update history
                  </Text>
                  {console.log("location.pathname : ", location.pathname)}
                </Box>
                <TableContainer mt="4">
                  <Table color="#000">
                    <Thead bg="#dbfff5" border="1px" borderColor="#000">
                      <Tr style={{ color: "#000" }}>
                        <Th color="#000">Sr no</Th>
                        <Th color="#000">L1 User name </Th>
                        <Th color="#000">L2 User name</Th>
                        <Th color="#000">L3 User name</Th>
                        <Th color="#000">Final Expiry Date</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr
                        // key={`chamber_${i}`}
                        textAlign="center"
                        bg="white"
                        border="1px"
                        borderColor="#000"
                      >
                        <Td>1</Td>
                        <Td>Het </Td>
                        <Td>Asim</Td>
                        <Td>Vaibhav </Td>
                        <Td>18 Jul 2022 </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            ) : null}

            {/* <Box
              display="flex"
              gap={2}
              justifyContent="flex-end"
              mt="10"
              px="0"
            >
              <Button
                type="submit"
                //w="full"
                backgroundColor={"primary.700"}
                _hover={{ backgroundColor: "primary.700" }}
                color={"white"}
                borderRadius={"full"}
                isLoading={postDOSubmitLoading || updateDoApiIsLoading}
                my={"4"}
                px={"10"}
              >
                {details?.id ? "Update" : "Submit"}
              </Button>
            </Box> */}

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
                          disabled={true}
                          type="text"
                          border="1px"
                          borderColor="gray.10"
                          backgroundColor={"white"}
                          height={"15px "}
                          borderRadius={"lg"}
                          value={
                            details?.l1_user?.phone?.replace(/^\+91/, "") || ""
                          }
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
                          disabled={true}
                          type="text"
                          border="1px"
                          borderColor="gray.10"
                          backgroundColor={"white"}
                          height={"15px "}
                          borderRadius={"lg"}
                          value={
                            details?.l2_user?.phone?.replace(/^\+91/, "") || ""
                          }
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
              {Number(details?.status?.status_code || 0) >
              approvalCycleStatus.l3_assigned ? (
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
                          disabled={true}
                          type="text"
                          border="1px"
                          borderColor="gray.10"
                          backgroundColor={"white"}
                          height={"15px "}
                          borderRadius={"lg"}
                          value={
                            details?.l3_user?.phone?.replace(/^\+91/, "") || ""
                          }
                          //  isDisabled={true}
                          p={{ base: "4" }}
                          fontWeight={{ base: "normal" }}
                          fontStyle={"normal"}
                          placeholder="Reason for rejection"
                        />
                      </Box>
                    </GridItem>
                  </Grid>
                  {details?.last_updated_user && (
                    <Grid
                      textAlign="right"
                      alignItems="center"
                      my="3"
                      templateColumns={templateColumns}
                      gap={5}
                    >
                      <GridItem colSpan={{ base: 1, lg: 0 }}>
                        <Text textAlign="right">Last Updated User</Text>{" "}
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
              {checkApprovalCycleStatus(
                details?.status?.status_code,
                approvalCycleStatus.l2_assigned,
                approvalCycleStatus.l3_assigned,
                approvalCycleStatus.l2_rejected,
                approvalCycleStatus.l3_rejected
              ) ? (
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
                          borderColor={rejectError ? "red" : "gray.10"}
                          backgroundColor={"white"}
                          height={"15px "}
                          borderRadius={"lg"}
                          onChange={(e) => {
                            setRejectReason(e.target.value);
                          }}
                          value={rejectReason}
                          isDisabled={disableDOField(
                            details?.status?.status_code
                          )}
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

            {/* Assign to me life cycle start  */}
            <Box
              display="flex"
              gap={2}
              justifyContent="flex-end"
              mt="10"
              px="0"
            >
              {checkApprovalCycleStatus(
                details?.status?.status_code || 0,
                approvalCycleStatus.l1_submitted,
                approvalCycleStatus.l2_approved
              ) ? (
                <Button
                  type="button"
                  backgroundColor={"primary.700"}
                  _hover={{ backgroundColor: "primary.700" }}
                  color={"white"}
                  borderRadius={"full"}
                  isLoading={useAssignDoIsLoading}
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
              {/* Status code changed from 5 to 4 */}
              {checkApprovalCycleStatus(
                details?.status?.status_code || 0,
                approvalCycleStatus.l2_assigned,
                approvalCycleStatus.l3_assigned
              ) ? (
                <>
                  <Button
                    type="button"
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

                    isLoading={useAssignDoIsLoading}
                    px={"10"}
                  >
                    Reject
                  </Button>
                  <Button
                    type="button"
                    backgroundColor={"primary.700"}
                    _hover={{ backgroundColor: "primary.700" }}
                    color={"white"}
                    // isDisabled={pageView}
                    borderRadius={"full"}
                    isLoading={useAssignDoIsLoading}
                    px={"10"}
                    onClick={() => {
                      approvedToMeFunction({ status: "approved" });
                    }}
                  >
                    Approve
                  </Button>
                </>
              ) : (
                <></>
              )}
              {Number(details?.status?.status_code || 0) <
              approvalCycleStatus.l1_submitted ? (
                <Button
                  type="submit"
                  //w="full"
                  isLoading={postDOSubmitLoading || updateDoApiIsLoading}
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
              ) : (
                <></>
              )}
            </Box>
            {/* Assign to me life cycle end */}
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}

export default AddEditDeliveryOrder;

// obj
// {
//   stack_number_id: 364,
//   stack_number: 5,
//   lot_no: {
//     label: 'GP240202192/2',
//     value: 244,
//     select_stack_no: 364,
//     data: {
//       id: 379,
//       remaining_commodity_for_lot_wise: {
//         avg_bag_size: 0,
//         remaining_do_bags: 30000,
//         remaining_do_mt: 296.4,
//         do_generated_bag: 20000,
//         do_generated_mt: 197.60000000000002,
//         delivered_cor_bags: 0,
//         delivered_cor_mt: 0
//       },
//       no_of_bags: 50000,
//       actual_bag_weight: 9.88,
//       weight_in_stack: 494,
//       upload_stack_image:
//         'media/docs/2023-2024/undefined/undefined/Screenshot from 2024-01-10 19-09-37_16_49_35_11_26_55_18:06:07.png',
//       gate_pass: {
//         id: 193,
//         gate_pass_type: 'inward',
//         gate_pass_no: 'GP240202192',
//         gate_pass_date_time_in: '2023-11-22T17:56:00+05:30',
//         gate_pass_date_time_out: '2023-11-22T17:57:00+05:30',
//         client_representative_name: 'aakanksha',
//         truck_no: 'MH15GJ23222',
//         truck_image: [

//             'media/docs/2023-2024/undefined/undefined/Screenshot from 2024-01-10 19-09-37_16_49_35_11_26_55_17:57:42.png', 'media/docs/2023-2024/undefined/undefined/Case studies_17:57:46.png'
//         ],
//         driver_name: 'kamlesh',
//         upload_driver_photo:
//           'media/docs/2023-2024/undefined/undefined/Screenshot from 2024-01-10 19-09-37_16_49_35_11_26_55_18:04:17.png',
//         weighbridge_name: 'Shiv Shakti Kata',
//         upload_approval_email: null,
//         new_weighbridge_name: null,
//         weighbridge_slip_no: 'WeighbridgeSlip123',
//         weighbridge_slip_datetime: '2023-11-22T17:56:00+05:30',
//         upload_weighbridge_slip:
//           'media/docs/2023-2024/undefined/undefined/Screenshot from 2024-01-10 19-09-37_16_49_35_11_26_55_18:04:23.png',
//         total_no_of_bags: 100000,
//         gross_weight_kg: 1000,
//         tare_weight: 12,
//         net_weight: 988,
//         sample_seal_no: 'sample11',
//         sampler_name: 'Mayur',
//         remarks: null,
//         gate_pass_status: 'CIR Created',
//         actual_bag_weight: 9.88,
//         created_at: '2024-02-02',
//         updated_at: '2024-02-02',
//         is_draft: false,
//         is_active: true,
//         service_contract: 206,
//         warehouse: 155,
//         chamber: 196,
//         client: 159,
//         commodity: 35,
//         commodity_variety: 202,
//         l1_user: 2,
//         cir: 63,
//         expected_bag_weight: 215,
//         document_status: 52,
//         last_updated_user: 2
//       },
//       select_stack_no: {
//         id: 364,
//         stack_number: 5,
//         quantity_bags: 50000,
//         quantity_mt: 494,
//         delivered_bags: 0,
//         delivered_mt: 0,
//         chamber: 196,
//         cir: null,
//         client: 159,
//         commodity_variety: 202,
//         commodity: 35,
//         last_updated_user: 2
//       },
//       lot_no: {
//         id: 244,
//         stack_lot_number: 'GP240202192/2',
//         quantity_in_bags: 50000,
//         quantity_in_mt: 494,
//         market_rate: null,
//         inward_date_time: null,
//         outward_date_time: null,
//         do_generated_bags: 20000,
//         do_generated_mt: 197.60000000000002,
//         delivered_gate_pass_bags: null,
//         delivered_gate_pass_mt: null,
//         warehouse_chamber_stack_details: 364,
//         last_updated_user: 2
//       },
//       last_updated_user: {
//         id: 2,
//         employee_name: 'Mayur',
//         phone: '+918306776883',
//         address: 'sdfdsfdsf',
//         pin_code: 650012,
//         email: 'admin@gmail.com',
//         password:
//           'pbkdf2_sha256$600000$pkHYeDFffFbitbclxYIScn$bUcH+MPZXqjgbdoVE+dWqOYewzIODOKT09/xRu1kHPU=',
//         employee_id: '2',
//         last_login: '2024-02-16T17:45:26.317031+05:30',
//         is_active: true,
//         created_at: '2023-06-09T11:39:10.712007+05:30',
//         updated_at: '2024-02-19T15:06:01.918384+05:30',
//         is_superuser: true,
//         is_staff: true,
//         fcm_token: 'mikjmoklm o',
//         last_working_date: '2023-11-15',
//         reporting_manager: 2,
//         designation: 1,
//         created_user: null,
//         last_updated_user: 2,
//         user_role: Array(27) [
//           125, 123, 122, 121, 119, 115, 107, 106, 105, 104, 103, 97, 96, 95, 78,
//           77, 76, 72, 71, 70, 67, 66, 59, 58, 32, 31, 4
//         ]
//       }
//     }
//   },
//   average_bag_size: 9.88,
//   remaining_bag_for_do: 30000,
//   remaining_mt_for_do: 296.4,
//   deposited_cir_bag: 50000,
//   deposited_cir_mt: 494,
//   do_generated_bag: 20000,
//   do_generated_mt: 197.60000000000002,
//   delivered_cor_bags: 0,
//   delivered_cor_mt: 0
// }

// deleted lot details

// [
//   {
//     id: 84,
//     stack_number: 5,
//     stack_number_id: 364,
//     lot_no: { label: 'GP240202192/2', value: 244 },
//     average_bag_size: 9.88,
//     currently_removing_bag: 20000,
//     currently_removing_mt: 197.60000000000002,
//     deposited_cir_bag: 50000,
//     deposited_cir_mt: 494,
//     do_generated_bag: 0,
//     do_generated_mt: 0,
//     delivered_cor_bags: 0,
//     delivered_cor_mt: 0,
//     remaining_do_bags: 30000,
//     remaining_do_mt: 296.4
//   },
// ]

// {
//   stack_number: 5,
//   lot_no: {
//     label: 'GP240202192/2',
//     value: 244,
//     select_stack_no: 364,
//     data: {
//       id: 379,
//       remaining_commodity_for_lot_wise: {
//         avg_bag_size: 0,
//         remaining_do_bags: 30000,
//         remaining_do_mt: 296.4,
//         do_generated_bag: 20000,
//         do_generated_mt: 197.60000000000002,
//         delivered_cor_bags: 0,
//         delivered_cor_mt: 0
//       },
//       no_of_bags: 50000,
//       actual_bag_weight: 9.88,
//       weight_in_stack: 494,
//       upload_stack_image:
//         'media/docs/2023-2024/undefined/undefined/Screenshot from 2024-01-10 19-09-37_16_49_35_11_26_55_18:06:07.png',
//       gate_pass: {
//         id: 193,
//         gate_pass_type: 'inward',
//         gate_pass_no: 'GP240202192',
//         gate_pass_date_time_in: '2023-11-22T17:56:00+05:30',
//         gate_pass_date_time_out: '2023-11-22T17:57:00+05:30',
//         client_representative_name: 'aakanksha',
//         truck_no: 'MH15GJ23222',
//         truck_image: [

//             'media/docs/2023-2024/undefined/undefined/Screenshot from 2024-01-10 19-09-37_16_49_35_11_26_55_17:57:42.png', 'media/docs/2023-2024/undefined/undefined/Case studies_17:57:46.png'
//         ],
//         driver_name: 'kamlesh',
//         upload_driver_photo:
//           'media/docs/2023-2024/undefined/undefined/Screenshot from 2024-01-10 19-09-37_16_49_35_11_26_55_18:04:17.png',
//         weighbridge_name: 'Shiv Shakti Kata',
//         upload_approval_email: null,
//         new_weighbridge_name: null,
//         weighbridge_slip_no: 'WeighbridgeSlip123',
//         weighbridge_slip_datetime: '2023-11-22T17:56:00+05:30',
//         upload_weighbridge_slip:
//           'media/docs/2023-2024/undefined/undefined/Screenshot from 2024-01-10 19-09-37_16_49_35_11_26_55_18:04:23.png',
//         total_no_of_bags: 100000,
//         gross_weight_kg: 1000,
//         tare_weight: 12,
//         net_weight: 988,
//         sample_seal_no: 'sample11',
//         sampler_name: 'Mayur',
//         remarks: null,
//         gate_pass_status: 'CIR Created',
//         actual_bag_weight: 9.88,
//         created_at: '2024-02-02',
//         updated_at: '2024-02-02',
//         is_draft: false,
//         is_active: true,
//         service_contract: 206,
//         warehouse: 155,
//         chamber: 196,
//         client: 159,
//         commodity: 35,
//         commodity_variety: 202,
//         l1_user: 2,
//         cir: 63,
//         expected_bag_weight: 215,
//         document_status: 52,
//         last_updated_user: 2
//       },
//       select_stack_no: {
//         id: 364,
//         stack_number: 5,
//         quantity_bags: 50000,
//         quantity_mt: 494,
//         delivered_bags: 0,
//         delivered_mt: 0,
//         chamber: 196,
//         cir: null,
//         client: 159,
//         commodity_variety: 202,
//         commodity: 35,
//         last_updated_user: 2
//       },
//       lot_no: {
//         id: 244,
//         stack_lot_number: 'GP240202192/2',
//         quantity_in_bags: 50000,
//         quantity_in_mt: 494,
//         market_rate: null,
//         inward_date_time: null,
//         outward_date_time: null,
//         do_generated_bags: 20000,
//         do_generated_mt: 197.60000000000002,
//         delivered_gate_pass_bags: null,
//         delivered_gate_pass_mt: null,
//         warehouse_chamber_stack_details: 364,
//         last_updated_user: 2
//       },
//       last_updated_user: {
//         id: 2,
//         employee_name: 'Mayur',
//         phone: '+918306776883',
//         address: 'sdfdsfdsf',
//         pin_code: 650012,
//         email: 'admin@gmail.com',
//         password:
//           'pbkdf2_sha256$600000$pkHYeDFffFbitbclxYIScn$bUcH+MPZXqjgbdoVE+dWqOYewzIODOKT09/xRu1kHPU=',
//         employee_id: '2',
//         last_login: '2024-02-16T17:45:26.317031+05:30',
//         is_active: true,
//         created_at: '2023-06-09T11:39:10.712007+05:30',
//         updated_at: '2024-02-19T17:56:26.596719+05:30',
//         is_superuser: true,
//         is_staff: true,
//         fcm_token: 'test',
//         last_working_date: '2023-11-15',
//         reporting_manager: 2,
//         designation: 1,
//         created_user: null,
//         last_updated_user: 2,
//         user_role: Array(27) [
//           125, 123, 122, 121, 119, 115, 107, 106, 105, 104, 103, 97, 96, 95, 78,
//           77, 76, 72, 71, 70, 67, 66, 59, 58, 32, 31, 4
//         ]
//       }
//     }
//   },
//   stack_number_id: 364,
//   average_bag_size: 9.88,
//   remaining_bag_for_do: 50000,
//   remaining_mt_for_do: 494,
//   deposited_cir_bag: 50000,
//   deposited_cir_mt: 494,
//   do_generated_bag: 20000,
//   do_generated_mt: 197.60000000000002,
//   delivered_cor_bags: 0,
//   delivered_cor_mt: 0,
//   remaining_do_bags: 50000,
//   remaining_do_mt: 494,
//   currently_removing_bag: 5000,
//   currently_removing_mt: 49.400000000000006
// }
