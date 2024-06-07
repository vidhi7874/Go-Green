import React, { useEffect, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import generateFormField from "../../components/Elements/GenerateFormField";
import {
  useAddEmployeeMasterMutation,
  useGetAreaMasterMutation,
  useGetDistrictMasterMutation,
  useGetRegionMasterMutation,
  useGetRoleMasterMutation,
  useGetStateMasterMutation,
  useGetUserMasterMutation,
  useGetZoneMasterMutation,
  useUpdateEmployeeMasterMutation,
} from "../../features/master-api-slice";
import { addEditFormFields, schema } from "./fields";
import { MotionSlideUp } from "../../utils/animation";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";

import CustomSelector from "../../components/Elements/CustomSelector";
import CustomSwitch from "../../components/Elements/CustomSwitch";

import CustomInput from "../../components/Elements/CustomInput";
import CustomTextArea from "../../components/Elements/CustomTextArea";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";

const AddEditFormEmployeeMaster = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const [getStateMaster] = useGetStateMasterMutation();
  const [getRegionMaster] = useGetRegionMasterMutation();
  const [getDistrictMaster] = useGetDistrictMasterMutation();
  const [getZoneMaster] = useGetZoneMasterMutation();
  const [getRoleMaster] = useGetRoleMasterMutation();
  const [getUserMaster] = useGetUserMasterMutation();
  const [getAreaMaster] = useGetAreaMasterMutation();
  const [selectBoxOptions, setSelectBoxOptions] = useState({
    regions: [],
    states: [],
    district: [],
    zones: [],
    roles: [],
    areas: [],
    reporting_managers: [],
    users: [],
  });

  const [addEmployeeMaster, { isLoading: addEmployeeMasterApiIsLoading }] =
    useAddEmployeeMasterMutation();
  const [
    updateEmployeeMaster,
    { isLoading: updateEmployeeMasterApiIsLoading },
  ] = useUpdateEmployeeMasterMutation();
  // eslint-disable-next-line
  const [isClear, setIsClear] = useState(false);

  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);

  const details = location.state?.details;
  // console.log("details ---> ", details);

  const { setValue } = methods;

  const onSubmit = (data) => {
    // console.log("data==>", data);
    if (details?.id) {
      updateData({ ...data, id: details.id });
    } else {
      addData(data);
    }
  };
  // for clear data in form

  const clearForm = () => {
    const defaultValues = methods.getValues();
    Object.keys(defaultValues).forEach((key) => {
      setValue(key, "", {
        shouldValidate: true,
      });
    });
    setIsClear(true); // Update isClear state to true
  };
  const addData = async (data) => {
    try {
      const response = await addEmployeeMaster(data).unwrap();
      // console.log("add Employee master res", response);
      if (response.status === 201) {
        toasterAlert(response);
        navigate("/employee-master");
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };

  const getAllStateMaster = async () => {
    try {
      const response = await getStateMaster().unwrap();
      // console.log("response ", response);
      let onlyActive = response?.results?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.state_name,
        value: item.id,
      }));

      console.log(arr);

      setAddEditFormFieldsList(
        addEditFormFields.map((field) => {
          if (field.type === "select") {
            return {
              ...field,
              options: arr,
            };
          } else {
            return field;
          }
        })
      );
      setSelectBoxOptions((prev) => ({
        ...prev,
        states: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getRegionMasterList = async () => {
    try {
      const response = await getRegionMaster().unwrap();
      // console.log("Success:", response);
      let onlyActive = response?.results?.filter((item) => item.is_active);

      let arr = onlyActive?.map((item) => ({
        label: item.region_name,
        value: item.id,
      }));

      console.log(arr);

      setSelectBoxOptions((prev) => ({
        ...prev,
        regions: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAllDistrict = async () => {
    try {
      const response = await getDistrictMaster().unwrap();

      // console.log("Success:", response);
      let onlyActive = response?.results?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.district_name,
        value: item.id,
      }));

      setSelectBoxOptions((prev) => ({ ...prev, district: arr }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAllRole = async () => {
    try {
      const response = await getRoleMaster().unwrap();

      // console.log("Success:", response);
      let onlyActive = response?.results?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.role_name,
        value: item.id,
      }));

      setSelectBoxOptions((prev) => ({ ...prev, roles: arr }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //API of all zone data
  const getAllZone = async () => {
    try {
      const response = await getZoneMaster().unwrap();

      // console.log("Success:", response);
      console.log(details);
      let onlyActive = response?.results?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.substate_name,
        value: item.id,
      }));
      console.log(arr);

      setAddEditFormFieldsList(
        addEditFormFields.map((field) => {
          if (field.type === "select") {
            return {
              ...field,
              options: arr,
            };
          } else {
            return field;
          }
        })
      );
      console.log(arr);
      setSelectBoxOptions((prev) => ({
        ...prev,
        zones: arr,
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAllArea = async () => {
    try {
      const response = await getAreaMaster().unwrap();

      // console.log("Success:", response);
      let onlyActive = response?.results?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.area_name,
        value: item.id,
      }));

      setSelectBoxOptions((prev) => ({ ...prev, areas: arr }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAllReportingManager = async () => {
    try {
      const response = await getUserMaster().unwrap();

      // console.log("Success:", response);
      let onlyActive = response?.results?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.email,
        value: item.id,
      }));

      setSelectBoxOptions((prev) => ({ ...prev, reporting_managers: arr }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await getUserMaster().unwrap();

      // console.log("Success:", response);
      let onlyActive = response?.results?.filter((item) => item.is_active);
      let arr = onlyActive?.map((item) => ({
        label: item.email,
        value: item.id,
      }));

      setSelectBoxOptions((prev) => ({ ...prev, users: arr }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateData = async (data) => {
    try {
      const response = await updateEmployeeMaster(data).unwrap();
      if (response.status === 200) {
        // console.log("update Employee master res", response);
        toasterAlert(response);
        navigate("/employee-master");
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };

  useEffect(() => {
    if (details?.id) {
      let obj = {
        user: details?.user.email,
        employee_full_name: details?.employee_full_name,
        contact_number: details?.contact_number,
        region_id: details?.region_id.region_name,
        state_id: details?.state_id.state_name,
        zone_id: details?.zone_id.substate_name,
        district_id: details?.district_id?.district_name,
        role: details?.role?.role_name || "",
        area_id: details?.area?.area_name,
        department__department_name: details?.department?.department_name,
        address: details?.address,
        pin_code: details?.pin_code,
        email_id: details?.email_id,
        job_title: details?.job_title,
        reporting_manager_id: details?.reporting_manager_id.email,
        employee_start_date: details?.employee_start_date,
        is_active: details.active,
      };
      // console.log("details", details);
      // console.log("obj", obj);

      Object.keys(obj).forEach(function (key) {
        // console.log("key value test : " + key + " : " + obj[key]);
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }
    getAllStateMaster();
    getRegionMasterList();
    getAllDistrict();
    getAllZone();
    getAllRole();
    getAllArea();
    getAllReportingManager();
    getAllUsers();
    // getBank();

    const breadcrumbArray = [
      {
        title: "Employee Master",
        link: "/employee-master",
      },
      {
        title: details?.id ? "Edit" : "Add",
      },
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

  return (
    <Box bg="white" borderRadius={10} p="10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box maxHeight="calc( 100vh - 260px )" overflowY="auto">
            <Box w={{ base: "100%", md: "80%", lg: "90%", xl: "60%" }}>
              {addEditFormFieldsList &&
                addEditFormFieldsList.map((item, i) => (
                  <MotionSlideUp key={i} duration={0.2 * i} delay={0.1 * i}>
                    <Box gap="4" display={{ base: "flex" }} alignItems="center">
                      <Text textAlign="right" w="550px">
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
                        // options: item.type === "select" && commodityTypeMaster,
                        isChecked: details?.active,
                        style: { mb: 1, mt: 1 },
                      })}
                    </Box>
                  </MotionSlideUp>
                ))}

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      Employee Full Name <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      name="employee_full_name"
                      placeholder="Enter Employee Full Name"
                      type="text"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Box>
                </MotionSlideUp>
              </Box>

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      Contact Number <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      name="contact_number"
                      placeholder=" Contact Number
                      "
                      type="text"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Box>
                </MotionSlideUp>
              </Box>

              {/* <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      User
                    </Text>
                    <CustomSelector
                      name="user"
                      label=""
                      options={selectBoxOptions.users}
                      selectedValue={selectBoxOptions.users.find(
                        (opt) => opt.label === details?.user.email
                      )}
                      isClearable={false}
                      selectType={"value"}
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Box>
                </MotionSlideUp>
              </Box> */}
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      Region <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomSelector
                      name="region_id"
                      label=""
                      options={selectBoxOptions.regions}
                      selectedValue={selectBoxOptions.regions.find(
                        (opt) => opt.label === details?.region_id.region_name
                      )}
                      isClearable={false}
                      selectType={"value"}
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Box>
                </MotionSlideUp>
              </Box>

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      State <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomSelector
                      name="state_id"
                      label=""
                      options={selectBoxOptions.states}
                      selectedValue={selectBoxOptions.states.find(
                        (opt) => opt?.label === details?.state_id.state_name
                      )}
                      isClearable={false}
                      selectType={"value"}
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Box>
                </MotionSlideUp>
              </Box>

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      Zone <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomSelector
                      name="zone_id"
                      label=""
                      options={selectBoxOptions.zones}
                      selectedValue={selectBoxOptions.zones.find(
                        (opt) => opt.label === details?.zone_id.substate_name
                      )}
                      isClearable={false}
                      selectType={"value"}
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Box>
                </MotionSlideUp>
              </Box>
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      District <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomSelector
                      name="district_id"
                      label=""
                      isChecked="details?.active"
                      options={selectBoxOptions.district}
                      selectedValue={selectBoxOptions.district.find(
                        (opt) =>
                          opt.label === details?.district_id.district_name
                      )}
                      isClearable={false}
                      selectType={"value"}
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Box>
                </MotionSlideUp>
              </Box>
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      Area <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomSelector
                      name="area_id"
                      label=""
                      options={selectBoxOptions.areas}
                      selectedValue={selectBoxOptions.areas.find(
                        (opt) => opt.label === details?.area?.area_name
                      )}
                      isClearable={false}
                      selectType={"value"}
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Box>
                </MotionSlideUp>
              </Box>

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      Address <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomTextArea
                      name="address"
                      placeholder="Address "
                      type="text"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Box>
                </MotionSlideUp>
              </Box>

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      Pin Code <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      name="pin_code"
                      placeholder="Pin Code"
                      type="number"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Box>
                </MotionSlideUp>
              </Box>
              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      Email ID <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      name="email_id"
                      placeholder="Enter Emial ID"
                      type="email"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Box>
                </MotionSlideUp>
              </Box>

              {/* <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      Role
                    </Text>
                    <CustomSelector
                      name="role"
                      label=""
                      options={selectBoxOptions.roles}
                      selectedValue={selectBoxOptions.roles.find(
                        (opt) => opt.label === details?.role.role_name
                      )}
                      isClearable={false}
                      selectType={"value"}
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Box>
                </MotionSlideUp>
              </Box> */}

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      Department <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomSelector
                      name="zone_id"
                      label=""
                      options={selectBoxOptions.zones}
                      selectedValue={selectBoxOptions.zones.find(
                        (opt) => opt.label === details?.zone_id.substate_name
                      )}
                      isClearable={false}
                      selectType={"value"}
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Box>
                </MotionSlideUp>
              </Box>

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      Designation <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      name="job_title"
                      placeholder="Designation"
                      type="text"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Box>
                </MotionSlideUp>
              </Box>

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      Reporting Manager <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomSelector
                      name="reporting_manager_id"
                      label=""
                      options={selectBoxOptions.reporting_managers}
                      selectedValue={selectBoxOptions.reporting_managers.find(
                        (opt) =>
                          opt.label === details?.reporting_manager_id.email
                      )}
                      isClearable={false}
                      selectType={"value"}
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                    />
                  </Box>
                </MotionSlideUp>
              </Box>

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      Employee Start Date{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Text>
                    <CustomInput
                      name="employee_start_date"
                      placeholder="Employee start date"
                      type="date"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      // formatDate=""
                    />
                  </Box>
                </MotionSlideUp>
              </Box>

              <Box>
                <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
                  <Box gap="4" display={{ base: "flex" }} alignItems="center">
                    <Text textAlign="right" w="550px">
                      Active
                    </Text>
                    <CustomSwitch
                      name="is_active"
                      // type="switch"
                      label=""
                      style={{
                        mb: 1,
                        mt: 1,
                      }}
                      // isChecked="regions?.active"
                    />
                  </Box>
                </MotionSlideUp>
              </Box>
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
                isLoading={
                  addEmployeeMasterApiIsLoading ||
                  updateEmployeeMasterApiIsLoading
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

export default AddEditFormEmployeeMaster;

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
