/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import {
  useAddUserMasterMutation,
  useGetAreaFreeMasterMutation,
  useGetChamberFreeMutation,
  useGetDesignationFreeMasterMutation,
  useGetDistrictFreeMasterMutation,
  useGetRegionFreeMasterMutation,
  useGetRoleFreeMasterMutation,
  useGetStateFreeMasterMutation,
  useGetUserFreeMasterMutation,
  useGetWareHouseFreeMutation,
  useGetZoneFreeMasterMutation,
  useUpdateUserMasterMutation,
} from "../../features/master-api-slice";
import { schema } from "./fields";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { MotionSlideUp } from "../../utils/animation";
import CustomInput from "../../components/Elements/CustomInput";
import CustomSwitch from "../../components/Elements/CustomSwitch";
import ReactSelect from "react-select";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";
import CustomTextArea from "../../components/Elements/CustomTextArea";
import { BiEditAlt } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { ROUTE_PATH } from "../../constants/ROUTE";

const tableStyle = {
  idWidth: "100px",
  generalPadding: "8px 16px",
  actionWidth: "150px",
};

const reactSelectStyle = {
  menu: (base) => ({
    ...base,
    // backgroundColor: "#A6CE39",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#A6CE39" : "white",
    color: state.isFocused ? "green" : "black",
    textTransform: " capitalize !important",

    "&:hover": {
      //  backgroundColor: "#C2DE8C",

      color: "black",
    },
  }),
};

function AddEditFormUserMaster() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const details = location.state?.details;

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_active: !details?.id, // Set is_active to true only when adding
    },
  });
  const initialIsActive = details ? details.is_active : true;
  const { setValue, getValues, formState } = methods;

  const [selectBoxOptions, setSelectBoxOptions] = useState({
    regions: [],
    roles: [],
    reportingManager: [],
    users: [],
    designation: [],
  });

  // Form Data clear Logic start

  const clearForm = () => {
    const defaultValues = methods.getValues();
    Object.keys(defaultValues).forEach((key) => {
      // Check if the field key is not 'is_active' before clearing it
      if (key !== "is_active") {
        setValue(key, "", {
          shouldValidate: true,
        });
      }
    });
  };

  // Form Data clear Logic end
  const [viewForm, setViewForm] = useState(false);
  // Form Submit Logic Start

  const onSubmit = (data) => {
    if (details?.id) {
      let final_data = {
        ...data,
        id: details.id,
        is_active: data?.is_active === "true" ? true : false,
      };

      console.log("update -> ", final_data);
      updateData(final_data);
    } else {
      // console.log("add -> ", final_data);
      addData(data);
    }
  };

  // Add User Logic Start

  const [addUserMaster, { isLoading: addUserMasterApiIsLoading }] =
    useAddUserMasterMutation();

  const addData = async (data) => {
    try {
      const response = await addUserMaster(data).unwrap();
      console.log("add User master res", response);
      if (response.status === 201) {
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_USER}`);
      }
    } catch (error) {
      console.error("Error:", error);

      let errorMessage =
        error?.data || error?.data?.message || "User Adding is Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Add User Logic End

  // Edit User Logic Start

  const [updateUserMaster, { isLoading: updateUserMasterApiIsLoading }] =
    useUpdateUserMasterMutation();

  const updateData = async (data) => {
    try {
      const response = await updateUserMaster(data).unwrap();
      if (response.status === 200) {
        console.log("update User master res", response);
        toasterAlert(response);
        navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_USER}`);
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data || error?.data?.message || "User Updating is Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Edit User Logic End

  // Form Submit Logic End

  // Reporting Master Listing Start

  const [getUserMaster] = useGetUserFreeMasterMutation();

  const getReportingManagerList = async () => {
    try {
      const response = await getUserMaster().unwrap();
      let onlyActive = response?.data?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.employee_name,
        value: item.id,
      }));

      console.log(arr);

      setSelectBoxOptions((prev) => ({
        ...prev,
        reportingManager:
          details?.reporting_manager?.is_active === false
            ? [
              ...arr,
              {
                label: details?.reporting_manager?.employee_name,
                value: details?.reporting_manager?.id,
              },
            ]
            : arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getReportingManagerList();
  }, []);

  // Reporting Master Listing End

  // Designation Listing Start

  const [getDesignationMaster] = useGetDesignationFreeMasterMutation();

  const getDesignationMasterList = async () => {
    try {
      const response = await getDesignationMaster().unwrap();
      let onlyActive = response?.data?.filter((item) => item.is_active);

      let arr = onlyActive?.map((item) => ({
        label: item.designation_name,
        value: item.id,
      }));

      console.log(arr);

      setSelectBoxOptions((prev) => ({
        ...prev,
        designation:
          details?.designation?.is_active === false
            ? [
              ...arr,
              {
                label: details?.designation?.designation_name,
                value: details?.designation?.id,
              },
            ]
            : arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getDesignationMasterList();
  }, []);

  // Designation Listing End

  // Role Listing Start

  const [getRoleMaster] = useGetRoleFreeMasterMutation();

  const getAllRole = async () => {
    try {
      const response = await getRoleMaster().unwrap();

      console.log("Success:", response);
      let onlyActive = response?.data?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.role_name,
        value: item.id,
      }));

      let tempArr = details?.user_role
        ? details?.user_role
          ?.filter((item) => item.is_active === false)
          .map((item) => ({
            label: item.role_name,
            value: item.id,
          }))
        : [];

      setSelectBoxOptions((prev) => ({ ...prev, roles: [...arr, ...tempArr] }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getAllRole();
  }, []);

  // Designation Listing End

  // Location Accessability Logic start

  const [fetchRegionFree, { isLoading: fetchRegionFreeApiIsLoading }] =
    useGetRegionFreeMasterMutation();

  const [fetchStateFree, { isLoading: fetchStateFreeApiIsLoading }] =
    useGetStateFreeMasterMutation();

  const [fetchSubStateFree, { isLoading: fetchSubStateFreeApiIsLoading }] =
    useGetZoneFreeMasterMutation();

  const [fetchDistrictFree, { isLoading: fetchDistrictFreeApiIsLoading }] =
    useGetDistrictFreeMasterMutation();

  const [fetchAreaFree, { isLoading: fetchAreaFreeApiIsLoading }] =
    useGetAreaFreeMasterMutation();

  const getRegionList = async () => {
    try {
      const response = await fetchRegionFree("?all_data=all").unwrap();
      console.log("getRegionList", response);

      setSelectBoxOptions((prev) => ({
        ...prev,
        regions: response?.data
          ?.filter((item) => item.is_active)
          ?.map(({ region_name, id }) => ({
            // label: region_name === "all region" ? "All Region" : region_name,
            label: region_name,

            value: id,
          }))
          .reverse(),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getStateList = async () => {
    try {
      const response = await fetchStateFree().unwrap();
      console.log("getStateList", response);

      setSelectBoxOptions((prev) => ({
        ...prev,
        states: response?.data
          ?.filter((item) => item.is_active)
          ?.map(({ region, state_name, id }) => ({
            label: state_name,
            value: id,
            region_id: region?.id || 0,
          })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getSubStateList = async () => {
    try {
      const response = await fetchSubStateFree().unwrap();
      console.log("getSubStateList", response);

      setSelectBoxOptions((prev) => ({
        ...prev,
        substate: response?.data
          ?.filter((item) => item.is_active)
          ?.map(({ state, substate_name, id }) => ({
            label: substate_name,
            value: id,
            state_id: state?.id || 0,
          })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getDistrictList = async () => {
    try {
      const response = await fetchDistrictFree().unwrap();
      console.log("getDistrictList", response);

      setSelectBoxOptions((prev) => ({
        ...prev,
        districts: response?.data
          ?.filter((item) => item.is_active)
          ?.map(({ substate, district_name, id }) => ({
            label: district_name,
            value: id,
            substate_id: substate?.id || 0,
          })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAreaList = async () => {
    try {
      const response = await fetchAreaFree().unwrap();
      console.log("getAreaList", response);

      setSelectBoxOptions((prev) => ({
        ...prev,
        areas: response?.data
          ?.filter((item) => item.is_active)
          ?.map(({ district, area_name, id }) => ({
            label: area_name,
            value: id,
            district_id: district?.id || 0,
          })),
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getRegionList();
    getStateList();
    getSubStateList();
    getDistrictList();
    getAreaList();
  }, []);

  // Warehouse Master start

  const [getWarehouseMaster, { isLoading: getWarehouseMasterApiIsLoading }] =
    useGetWareHouseFreeMutation();

  const getWarehouseMasterList = async () => {
    try {
      const response = await getWarehouseMaster().unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          warehouse: response?.data?.map(({ warehouse_name, id, area }) => ({
            label: warehouse_name,
            value: id,
            area: area?.id,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getWarehouseMasterList();
  }, []);

  // Warehouse Master end

  // Chamber Master start

  const [getChamberMaster, { isLoading: getChamberApiIsLoading }] =
    useGetChamberFreeMutation();

  const getChamberMasterList = async () => {
    try {
      const response = await getChamberMaster().unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        setSelectBoxOptions((prev) => ({
          ...prev,
          chamber: response?.data?.map(({ chamber_number, id, warehouse }) => ({
            label: chamber_number,
            value: id,
            warehouse: warehouse?.id,
          })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getChamberMasterList();
  }, []);

  // Chamber Master end

  const {
    fields: user_location,
    append: add_user_location_list,
    remove: remove_user_location_list,
  } = useFieldArray({
    control: methods.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "user_location",
  });

  const [userLocationList, setUserLocationList] = useState({
    region: null,
    state: null,
    substate: null,
    district: null,
    area: null,
    warehouse: null,
    chamber: null,
  });

  const [userLocationError, setUserLocationError] = useState({
    region: "",
    state: "",
    substate: "",
    district: "",
    area: "",
    warehouse: "",
    chamber: "",
  });

  const [updateUserLocationList, setUpdateUserLocationList] = useState(null);

  const regionOnUserChange = async (val) => {
    setUserLocationList((old) => ({
      // ...old,
      region: val?.value,
      state: val?.label === "all region" ? "all" : null,
      substate: val?.label === "all region" ? "all" : null,
      district: val?.label === "all region" ? "all" : null,
      area: val?.label === "all region" ? "all" : null,
      warehouse: val?.label === "all region" ? "all" : null,
      chamber: val?.label === "all region" ? "all" : null,
    }));
  };

  const stateOnUserChange = async (val) => {
    setUserLocationList((old) => ({
      ...old,
      state: val?.value,
      substate: val?.value === "all" ? "all" : null,
      district: val?.value === "all" ? "all" : null,
      area: val?.value === "all" ? "all" : null,
      warehouse: val?.value === "all" ? "all" : null,
      chamber: val?.value === "all" ? "all" : null,
    }));
  };

  const zoneOnUserChange = async (val) => {
    setUserLocationList((old) => ({
      ...old,
      substate: val?.value,
      district: val?.value === "all" ? "all" : null,
      area: val?.value === "all" ? "all" : null,
      warehouse: val?.value === "all" ? "all" : null,
      chamber: val?.value === "all" ? "all" : null,
    }));
  };

  const districtOnUserChange = async (val) => {
    setUserLocationList((old) => ({
      ...old,
      district: val?.value,
      area: val?.value === "all" ? "all" : null,
      warehouse: val?.value === "all" ? "all" : null,
      chamber: val?.value === "all" ? "all" : null,
    }));
  };

  const areaOnUserChange = (val) => {
    setUserLocationList((old) => ({
      ...old,
      area: val?.value,
      warehouse: val?.value === "all" ? "all" : null,
      chamber: val?.value === "all" ? "all" : null,
    }));
  };

  const warehouseOnUserChange = (val) => {
    setUserLocationList((old) => ({
      ...old,
      warehouse: val?.value,
      chamber: val?.value === "all" ? "all" : null,
    }));
  };

  const chamberOnUserChange = (val) => {
    setUserLocationList((old) => ({
      ...old,
      chamber: val?.value,
    }));
  };

  const UserListClear = () => {
    setUserLocationList({
      region: null,
      state: null,
      substate: null,
      district: null,
      area: null,
      warehouse: null,
      chamber: null,
    });
  };

  const UserErrorClear = (key) => {
    if (key) {
      setUserLocationError((old) => ({ ...old, [key]: "" }));
    } else {
      setUserLocationError({
        region: "",
        state: "",
        substate: "",
        district: "",
        area: "",
        warehouse: "",
        chamber: "",
      });
    }
  };

  const UserErrorStatus = () => {
    const checkingConnection =
      getValues("user_location")
        ?.filter((item, index) => index !== updateUserLocationList)
        ?.filter(
          (item) =>
            item.region ===
            (userLocationList.region === "all"
              ? null
              : userLocationList.region) &&
            item.state ===
            (userLocationList.state === "all"
              ? null
              : userLocationList.state) &&
            item.substate ===
            (userLocationList.substate === "all"
              ? null
              : userLocationList.substate) &&
            item.district ===
            (userLocationList.district === "all"
              ? null
              : userLocationList.district) &&
            item.area ===
            (userLocationList.area === "all"
              ? null
              : userLocationList.area) &&
            item.warehouse ===
            (userLocationList.warehouse === "all"
              ? null
              : userLocationList.warehouse) &&
            item.chamber ===
            (userLocationList.chamber === "all"
              ? null
              : userLocationList.chamber)
        )?.length > 0
        ? false
        : true;

    console.log();

    const result =
      userLocationList.region !== null &&
      userLocationList.state !== null &&
      userLocationList.substate !== null &&
      userLocationList.district !== null &&
      userLocationList.area !== null &&
      userLocationList.warehouse !== null &&
      userLocationList.chamber !== null &&
      checkingConnection;

    if (!checkingConnection) {
      toasterAlert({
        message: "Duplicated Data not Allowed",
        status: 440,
      });
    }

    return result;
  };

  const UserErrorFunction = () => {
    setUserLocationError({
      region: userLocationList.region === null ? "error" : "",
      state: userLocationList.state === null ? "error" : "",
      substate: userLocationList.substate === null ? "error" : "",
      district: userLocationList.district === null ? "error" : "",
      area: userLocationList.area === null ? "error" : "",
      warehouse: userLocationList.warehouse === null ? "error" : "",
      chamber: userLocationList.chamber === null ? "error" : "",
    });
  };

  const append_user_location_list = () => {
    if (UserErrorStatus()) {
      add_user_location_list({
        region:
          userLocationList.region === "all" ? null : userLocationList.region,
        state: userLocationList.state === "all" ? null : userLocationList.state,
        substate:
          userLocationList.substate === "all"
            ? null
            : userLocationList.substate,
        district:
          userLocationList.district === "all"
            ? null
            : userLocationList.district,
        area: userLocationList.area === "all" ? null : userLocationList.area,
        warehouse:
          userLocationList.warehouse === "all"
            ? null
            : userLocationList.warehouse,
        chamber:
          userLocationList.chamber === "all" ? null : userLocationList.chamber,
      });
      UserListClear();
      UserErrorClear();
    } else {
      UserErrorFunction();
    }
  };

  const updateClientFunction = (data, id) => {
    setUpdateUserLocationList(id);
    setUserLocationList({
      region: data.region === null ? "all" : data.region,
      state: data.state === null ? "all" : data.state,
      substate: data.substate === null ? "all" : data.substate,
      district: data.district === null ? "all" : data.district,
      area: data.area === null ? "all" : data.area,
      warehouse: data.warehouse === null ? "all" : data.warehouse,
      chamber: data.chamber === null ? "all" : data.chamber,
    });
    UserErrorClear();
  };

  const UpdateClientListFunction = () => {
    if (UserErrorStatus()) {
      const tempArr = getValues(`user_location`);
      setValue(
        `user_location`,
        [
          ...tempArr.slice(0, updateUserLocationList),
          {
            region:
              userLocationList.region === "all"
                ? null
                : userLocationList.region,
            state:
              userLocationList.state === "all" ? null : userLocationList.state,
            substate:
              userLocationList.substate === "all"
                ? null
                : userLocationList.substate,
            district:
              userLocationList.district === "all"
                ? null
                : userLocationList.district,
            area:
              userLocationList.area === "all" ? null : userLocationList.area,
            warehouse:
              userLocationList.warehouse === "all"
                ? null
                : userLocationList.warehouse,
            chamber:
              userLocationList.chamber === "all"
                ? null
                : userLocationList.chamber,
          },
          ...tempArr.slice(updateUserLocationList + 1),
        ],
        { shouldValidate: true }
      );
      setUpdateUserLocationList(null);
      UserListClear();
      UserErrorClear();
    } else {
      UserErrorFunction();
    }
  };

  // Location Accessability Logic start

  const FillUpdatedData = (data) => {
    const DataArr = Object.entries(data)
      .filter(([key, value]) => value !== null && value !== undefined)
      .map(([key, index]) => ({
        key: key,
        index: index,
      }));

    DataArr.map((item) => {
      if (item.key === "user_location") {
        if (item?.index?.length > 0) {
          const tempClient = item.index;
          const temp = [];

          for (let index = 0; index < tempClient.length; index++) {
            const old = tempClient[index];
            console.log(old, "old");
            temp.push({
              region: old?.region?.id || null,
              state: old?.state?.id || null,
              substate: old?.substate?.id || null,
              district: old?.district?.id || null,
              area: old?.area?.id || null,
              warehouse: old?.warehouse?.id || null,
              chamber: old?.chamber?.id || null,
            });
          }

          setValue(item.key, temp, { shouldValidate: true });
        }
      } else if (item.key === "designation") {
        setValue(item.key, item.index.id, { shouldValidate: true });
      } else if (item.key === "reporting_manager") {
        setValue(item.key, item.index.id, { shouldValidate: true });
      } else if (item.key === "user_role") {
        let temp = item.index.map((old) => old.id);
        setValue(item.key, temp, { shouldValidate: true });
      } else {
        setValue(item.key, item.index, { shouldValidate: true });
      }
    });
  };

  useEffect(() => {
    const breadcrumbArray = [
      {
        title: "User Master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_USER}`,
      },
    ];
    setViewForm(location?.state?.view || false);

    dispatch(setBreadCrumb(breadcrumbArray));
    console.log(details, "details");
    if (details?.id) {
      FillUpdatedData(details);
    }
  }, [details]);

  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
  }, []);

  return (
    // <Box bg={"white"}>
    <Box bg="white" borderRadius={10} p="10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
            {/*  maxHeight="calc( 100vh - 260px )" overflowY="auto" */}
            <Box>
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Full Name <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      name="employee_name"
                      placeholder="Full Name"
                      type=""
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
                      Employee Id <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      name="employee_id"
                      placeholder="Employee Id"
                      type=""
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
                      Designation<span style={{ color: "red" }}>*</span>
                    </Text>

                    <ReactCustomSelect
                      name="designation"
                      selectDisable={viewForm}
                      label=""
                      options={selectBoxOptions.designation}
                      selectedValue={
                        selectBoxOptions?.designation?.filter(
                          (opt) => opt.value === getValues("designation")
                        )[0] || {}
                      }
                      handleOnChange={(val) => {
                        setValue("designation", val.value, {
                          shouldValidate: true,
                        });
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
                      Contact Number <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      name="phone"
                      placeholder="Contact Number"
                      InputDisabled={viewForm}
                      type="number"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      inputValue={
                        getValues("phone")?.split("+91")[1]
                          ? Number(getValues("phone")?.split("+91")[1] || "")
                          : ""
                      }
                      onChange={(e) => {
                        setValue("phone", "+91" + e.target.value, {
                          shouldValidate: true,
                        });
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
                    alignItems="start"
                  >
                    <Text textAlign="right">
                      Address <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomTextArea
                      InputDisable={viewForm}
                      name="address"
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
                      Pin Code <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      name="pin_code"
                      placeholder=" Pin code "
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
                    <Text textAlign="right">
                      User Email <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      InputDisabled={viewForm}
                      name="email"
                      placeholder=" User Mail
                      "
                      type="email"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>
              {/* This is for reporting manager code */}

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">Reporting Manager</Text>

                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="reporting_manager"
                      label=""
                      options={selectBoxOptions?.reportingManager || []}
                      selectedValue={
                        selectBoxOptions?.reportingManager?.filter(
                          (opt) => opt.value === getValues("reporting_manager")
                        )[0] || {}
                      }
                      isClearable={true}
                      handleOnChange={(val) => {
                        setValue("reporting_manager", val?.value || "", {
                          shouldValidate: true,
                        });
                        console.log("selected val", val);
                      }}
                      selectType={"value"}
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Grid>
                </MotionSlideUp>
              </Box>

              {/* Role called code */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Grid
                    gap={4}
                    templateColumns={"repeat(3, 1fr)"}
                    alignItems="center"
                  >
                    <Text textAlign="right">
                      Role <span style={{ color: "red" }}>*</span>
                    </Text>
                    <ReactCustomSelect
                      selectDisable={viewForm}
                      name="user_role"
                      label=""
                      options={selectBoxOptions?.roles || []}
                      selectedValue={
                        selectBoxOptions?.roles?.filter((opt) =>
                          getValues("user_role")?.includes(opt.value)
                        ) || []
                      }
                      isClearable={false}
                      isMultipleSelect={true}
                      isLoading={false}
                      style={{ w: "100%" }}
                      handleOnChange={(val) => {
                        console.log("selectedOption @@@@@@@@@@@------> ", val);
                        let temp = val.map((item) => item.value);
                        setValue("user_role", temp, { shouldValidate: true });
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

            <Box m="5">
              <Text fontWeight={"semibold"} fontSize={"23px"} color="black">
                Data Accessibility
              </Text>

              <Box backgroundColor={"#DBFFF5"} borderRadius={"10px"} mt="10px">
                <Grid
                  templateColumns={{
                    base: "repeat(1, 1fr)",
                    sm: "repeat(1, 1fr)",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  }}
                  gap={5}
                  p={4}
                >
                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Text>Region</Text>
                    <ReactSelect
                      options={selectBoxOptions?.regions || []}
                      placeholder="Select Region"
                      isDisabled={viewForm}
                      value={
                        selectBoxOptions?.regions?.filter(
                          (item) => item.value === userLocationList.region
                        )[0] || {}
                      }
                      isLoading={fetchRegionFreeApiIsLoading}
                      onChange={(val) => {
                        regionOnUserChange(val);
                      }}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: userLocationError.region
                            ? "red"
                            : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                  </MotionSlideUp>

                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Text>State</Text>
                      <ReactSelect
                        isDisabled={userLocationList.region === "all"}
                        options={
                          userLocationList.region
                            ? selectBoxOptions?.states
                              ?.filter(
                                (item) =>
                                  item.region_id === userLocationList.region
                              )
                              .concat({
                                label: "All-State",
                                value: "all",
                              })
                              .reverse() || [
                              { label: "All-State", value: "all" },
                            ]
                            : []
                        }
                        placeholder="Select State"
                        value={
                          selectBoxOptions?.states
                            ?.concat({
                              label: "All-State",
                              value: "all",
                            })
                            ?.filter(
                              (item) => item.value === userLocationList.state
                            )[0] || {}
                        }
                        isLoading={fetchStateFreeApiIsLoading}
                        onChange={(val) => {
                          stateOnUserChange(val);
                        }}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            backgroundColor: "#fff",
                            borderRadius: "6px",
                            borderColor: userLocationError.state
                              ? "red"
                              : "#c3c3c3",

                            padding: "1px",
                            textAlign: "left",
                          }),
                          ...reactSelectStyle,
                        }}
                      />
                    </MotionSlideUp>
                  </Box>

                  <Box>
                    <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                      <Text>Sub State</Text>
                      <ReactSelect
                        isDisabled={userLocationList.state === "all"}
                        options={
                          userLocationList.state
                            ? selectBoxOptions?.substate
                              ?.filter(
                                (item) =>
                                  item.state_id === userLocationList.state
                              )
                              .concat({
                                label: "All-SubState",
                                value: "all",
                              })
                              .reverse() || [
                              { label: "All-SubState", value: "all" },
                            ]
                            : []
                        }
                        placeholder="Select SubState"
                        value={
                          selectBoxOptions?.substate
                            ?.concat({
                              label: "All-SubState",
                              value: "all",
                            })
                            ?.filter(
                              (item) => item.value === userLocationList.substate
                            )[0] || {}
                        }
                        isLoading={fetchSubStateFreeApiIsLoading}
                        onChange={(val) => {
                          zoneOnUserChange(val);
                        }}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            backgroundColor: "#fff",
                            borderRadius: "6px",
                            borderColor: userLocationError.substate
                              ? "red"
                              : "#c3c3c3",

                            padding: "1px",
                            textAlign: "left",
                          }),
                          ...reactSelectStyle,
                        }}
                      />
                    </MotionSlideUp>
                  </Box>

                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Text>District</Text>{" "}
                    <ReactSelect
                      isDisabled={userLocationList.substate === "all"}
                      options={
                        userLocationList.substate
                          ? selectBoxOptions?.districts
                            ?.filter(
                              (item) =>
                                item.substate_id === userLocationList.substate
                            )
                            .concat({
                              label: "All-District",
                              value: "all",
                            })
                            .reverse() || [
                            { label: "All-District", value: "all" },
                          ]
                          : []
                      }
                      placeholder="Select District"
                      value={
                        selectBoxOptions?.districts
                          ?.concat({
                            label: "All-District",
                            value: "all",
                          })
                          ?.filter(
                            (item) => item.value === userLocationList.district
                          )[0] || {}
                      }
                      isLoading={fetchDistrictFreeApiIsLoading}
                      onChange={(val) => {
                        districtOnUserChange(val);
                      }}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: userLocationError.district
                            ? "red"
                            : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                  </MotionSlideUp>

                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Text>Area</Text>{" "}
                    <ReactSelect
                      isDisabled={userLocationList.district === "all"}
                      options={
                        userLocationList.district
                          ? selectBoxOptions?.areas
                            ?.filter(
                              (item) =>
                                item.district_id === userLocationList.district
                            )
                            .concat({
                              label: "All-Area",
                              value: "all",
                            })
                            .reverse() || [
                            { label: "All-Area", value: "all" },
                          ]
                          : []
                      }
                      placeholder="Select Area"
                      value={
                        selectBoxOptions?.areas
                          ?.concat({
                            label: "All-Area",
                            value: "all",
                          })
                          ?.filter(
                            (item) => item.value === userLocationList.area
                          )[0] || {}
                      }
                      isLoading={fetchAreaFreeApiIsLoading}
                      onChange={(val) => {
                        areaOnUserChange(val);
                      }}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: userLocationError.area
                            ? "red"
                            : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                  </MotionSlideUp>

                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Text>Warehouse</Text>
                    <ReactSelect
                      isDisabled={userLocationList.area === "all"}
                      options={
                        userLocationList.area
                          ? selectBoxOptions?.warehouse
                            ?.filter(
                              (item) => item.area === userLocationList.area
                            )
                            .concat({
                              label: "All-Warehouse",
                              value: "all",
                            })
                            .reverse() || [
                            { label: "All-Warehouse", value: "all" },
                          ]
                          : []
                      }
                      value={
                        selectBoxOptions?.warehouse
                          ?.concat({
                            label: "All-Warehouse",
                            value: "all",
                          })
                          ?.filter(
                            (item) => item.value === userLocationList.warehouse
                          )[0] || {}
                      }
                      placeholder="Select Warehouse"
                      isLoading={getWarehouseMasterApiIsLoading}
                      onChange={(val) => {
                        warehouseOnUserChange(val);
                      }}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: userLocationError.warehouse
                            ? "red"
                            : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                  </MotionSlideUp>

                  <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                    <Text> Chamber </Text>
                    <ReactSelect
                      isDisabled={userLocationList.warehouse === "all"}
                      options={
                        userLocationList.warehouse
                          ? selectBoxOptions?.chamber
                            ?.filter(
                              (item) =>
                                item.warehouse === userLocationList.warehouse
                            )
                            .concat({
                              label: "All-Chamber",
                              value: "all",
                            })
                            .reverse() || [
                            { label: "All-Chamber", value: "all" },
                          ]
                          : []
                      }
                      value={
                        selectBoxOptions?.chamber
                          ?.concat({
                            label: "All-Chamber",
                            value: "all",
                          })
                          ?.filter(
                            (item) => item.value === userLocationList.chamber
                          )[0] || {}
                      }
                      placeholder="Select Chamber"
                      isLoading={getChamberApiIsLoading}
                      onChange={(val) => {
                        chamberOnUserChange(val);
                      }}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          borderColor: userLocationError.chamber
                            ? "red"
                            : "#c3c3c3",

                          padding: "1px",
                          textAlign: "left",
                        }),
                        ...reactSelectStyle,
                      }}
                    />
                  </MotionSlideUp>

                  <GridItem
                    colSpan={{ base: 1, sm: 1, md: 1, lg: 2 }}
                    alignSelf="end"
                  >
                    <Flex
                      colSpan={{ base: 1, lg: 2 }}
                      justifyContent={"end"}
                      px={5}
                      alignItems={"center"}
                    >
                      <Button
                        type="button"
                        backgroundColor={"primary.700"}
                        _hover={{ backgroundColor: "primary.700" }}
                        color={"white"}
                        borderRadius={"full"}
                        px={"10"}
                        onClick={() =>
                          updateUserLocationList !== null
                            ? UpdateClientListFunction()
                            : append_user_location_list()
                        }
                      >
                        {updateUserLocationList !== null ? "Update" : "Add"}
                      </Button>
                    </Flex>
                  </GridItem>
                </Grid>
              </Box>

              <Box mt={"10px"} overflow={"auto"}>
                <table width="100%">
                  <thead style={{ background: "#DBFFF5" }}>
                    <tr>
                      <th
                        width={tableStyle.idWidth}
                        style={{
                          color: "#000",
                          padding: tableStyle.generalPadding,
                        }}
                      >
                        No.
                      </th>
                      <th
                        style={{
                          color: "#000",
                          padding: tableStyle.generalPadding,
                        }}
                      >
                        Region
                      </th>
                      <th
                        style={{
                          color: "#000",
                          padding: tableStyle.generalPadding,
                        }}
                      >
                        State
                      </th>
                      <th
                        style={{
                          color: "#000",
                          padding: tableStyle.generalPadding,
                        }}
                      >
                        Sub State
                      </th>
                      <th
                        style={{
                          color: "#000",
                          padding: tableStyle.generalPadding,
                        }}
                      >
                        District
                      </th>
                      <th
                        style={{
                          color: "#000",
                          padding: tableStyle.generalPadding,
                        }}
                      >
                        Area
                      </th>
                      <th
                        style={{
                          color: "#000",
                          padding: tableStyle.generalPadding,
                        }}
                      >
                        Warehouse
                      </th>
                      <th
                        style={{
                          color: "#000",
                          padding: tableStyle.generalPadding,
                        }}
                      >
                        Chamber
                      </th>
                      <th
                        style={{
                          color: "#000",
                          padding: tableStyle.generalPadding,
                        }}
                        width={tableStyle.actionWidth}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getValues(`user_location`)?.length > 0 ? (
                      user_location.map((item, index) => (
                        <tr>
                          <td
                            style={{
                              padding: tableStyle.generalPadding,
                              textAlign: "center",
                            }}
                          >
                            {index + 1}
                          </td>
                          <td
                            style={{
                              padding: tableStyle.generalPadding,
                            }}
                          >
                            {selectBoxOptions?.regions?.filter(
                              (old) =>
                                old.value ===
                                (item.region === "all region"
                                  ? "all"
                                  : Number(item.region))
                            )[0]?.label || item.region}
                          </td>
                          <td
                            style={{
                              padding: tableStyle.generalPadding,
                            }}
                          >
                            {selectBoxOptions?.states
                              ?.concat({
                                label: "All-State",
                                value: "all",
                              })
                              ?.filter(
                                (old) =>
                                  old.value ===
                                  (item.state === null
                                    ? "all"
                                    : Number(item.state))
                              )[0]?.label || item.state}
                          </td>
                          <td
                            style={{
                              padding: tableStyle.generalPadding,
                            }}
                          >
                            {selectBoxOptions?.substate
                              ?.concat({
                                label: "All-SubState",
                                value: "all",
                              })
                              ?.filter(
                                (old) =>
                                  old.value ===
                                  (item.substate === null
                                    ? "all"
                                    : Number(item.substate))
                              )[0]?.label || item.substate}
                          </td>
                          <td
                            style={{
                              padding: tableStyle.generalPadding,
                            }}
                          >
                            {selectBoxOptions?.districts
                              ?.concat({
                                label: "All-District",
                                value: "all",
                              })
                              ?.filter(
                                (old) =>
                                  old.value ===
                                  (item.district === null
                                    ? "all"
                                    : Number(item.district))
                              )[0]?.label || item.district}
                          </td>
                          <td
                            style={{
                              padding: tableStyle.generalPadding,
                            }}
                          >
                            {selectBoxOptions?.areas
                              ?.concat({
                                label: "All-Area",
                                value: "all",
                              })
                              ?.filter(
                                (old) =>
                                  old.value ===
                                  (item.area === null
                                    ? "all"
                                    : Number(item.area))
                              )[0]?.label || item.area}
                          </td>
                          <td
                            style={{
                              padding: tableStyle.generalPadding,
                            }}
                          >
                            {selectBoxOptions?.warehouse
                              ?.concat({
                                label: "All-Warehouse",
                                value: "all",
                              })
                              ?.filter(
                                (old) =>
                                  old.value ===
                                  (item.warehouse === null
                                    ? "all"
                                    : Number(item.warehouse))
                              )[0]?.label || item.warehouse}
                          </td>
                          <td
                            style={{
                              padding: tableStyle.generalPadding,
                            }}
                          >
                            {selectBoxOptions?.chamber
                              ?.concat({
                                label: "All-Chamber",
                                value: "all",
                              })
                              ?.filter(
                                (old) =>
                                  old.value ===
                                  (item.chamber === null
                                    ? "all"
                                    : Number(item.chamber))
                              )[0]?.label || item.chamber}
                          </td>
                          <td
                            style={{
                              padding: tableStyle.generalPadding,
                            }}
                          >
                            <Flex  justifyContent="center">
                              <Button color={"primary.700"}  bg={"transparent"} isDisabled={viewForm ? true : false}>
                                <BiEditAlt
                                  // color="#A6CE39"
                                  fontSize="26px"
                                  cursor="pointer"
                                  onClick={() => {
                                    updateClientFunction(item, index);
                                  }}
                                />
                              </Button>
                              
                                <Button color="red" bg={"transparent"} isDisabled={viewForm ? true : false}>
                                  <AiOutlineDelete
                                    cursor="pointer"

                                    fontSize="26px"
                                    onClick={() => {
                                      if (updateUserLocationList === null) {
                                        remove_user_location_list(index);
                                      }
                                    }}
                                  />
                                </Button>
                              
                            </Flex>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          style={{
                            padding: tableStyle.generalPadding,
                            textAlign: "center",
                          }}
                          colSpan={9}
                        >
                          No Data Added
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Box>

              {formState?.errors?.user_location ? (
                <Text color="red">
                  {formState?.errors?.user_location?.message}
                </Text>
              ) : (
                <></>
              )}
            </Box>

            <Box
              display="flex"
              gap={2}
              justifyContent="flex-end"
              mt="10"
              mr="6"
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
                isDisabled={viewForm ? true : false}
                borderRadius={"full"}
                isLoading={
                  addUserMasterApiIsLoading || updateUserMasterApiIsLoading
                }
                my={"4"}
                px={"10"}
              >
                {/* {details?.id ? "Update" : "Add"} */}
                Submit
              </Button>
            </Box>
          </Box>
        </form>
      </FormProvider>
    </Box>
    // </Box>
  );
}

export default AddEditFormUserMaster;

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
