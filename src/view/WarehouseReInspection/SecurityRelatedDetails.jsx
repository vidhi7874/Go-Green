/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";

import ReactSelect from "react-select";
// import { showToastByStatusCode } from "../../services/showToastByStatusCode";
// import { useAddInspectionMasterMutation } from "../../features/master-api-slice";
import {
  useGetSecurityGuardDayShiftFreeMutation,
  useGetSecurityGuardNightShiftFreeMutation,
  useGetSupervisorDayShiftFreeMutation,
  useGetSupervisorNightShiftFreeMutation,
} from "../../features/warehouse-proposal.slice";

// ! commented un used variable ..
// const reactSelectStyle = {
//   menu: (base) => ({
//     ...base,
//     // backgroundColor: "#A6CE39",
//   }),
//   option: (base, state) => ({
//     ...base,
//     backgroundColor: state.isFocused ? "#A6CE39" : "white",
//     color: state.isFocused ? "green" : "black",
//     textAlign: "left",
//     "&:hover": {
//       //  backgroundColor: "#C2DE8C",
//       color: "black",
//     },
//   }),
// };

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

const SupervisorDetails = React.memo(
  ({ mainFormsMethod, supervisor_details_form_schema, saveFunction }) => {
    let { register, setValue, getValues, errors } = mainFormsMethod;

    // ! commented un used toastAlert function ..
    // const toasterAlert = (obj) => {
    //   let msg = obj?.message;
    //   let status = obj?.status;
    //   console.log("toasterAlert", obj);
    //   if (status === 400) {
    //     const errorData = obj?.data || obj?.data?.data;
    //     let errorMessage = "";

    //     Object.keys(errorData)?.forEach((key) => {
    //       const messages = errorData[key];
    //       console.log("messages --> ", messages);
    //       if (typeof messages === "object") {
    //         messages &&
    //           messages?.forEach((message) => {
    //             errorMessage += `${key} : ${message} \n`;
    //           });
    //       } else {
    //         showToastByStatusCode(status, msg);
    //       }
    //     });
    //     showToastByStatusCode(status, errorMessage);
    //     return false;
    //   } else if (status === 410) {
    //     showToastByStatusCode(status, msg);
    //   }
    //   showToastByStatusCode(status, msg);
    // };

    // ! commented un used rtk hook ..
    // const [
    //   AddInspectionMaster,
    //   //  { isLoading: addInspectionMasterApiIsLoading }
    // ] = useAddInspectionMasterMutation();

    // ! commented un used saveAsdraftFunction ..
    // const saveAsDraftFunction = async () => {
    //   const data = {
    //     id: getValues("id"),
    //     is_draft: true,
    //     [supervisor_details_form_schema?.supervisor_day_shift]: getValues(
    //       supervisor_details_form_schema?.supervisor_day_shift
    //     ),
    //     [supervisor_details_form_schema?.is_new_supervisor_day_shift]: getValues(
    //       supervisor_details_form_schema?.is_new_supervisor_day_shift
    //     ),
    //     [supervisor_details_form_schema?.supervisor_night_shift]: getValues(
    //       supervisor_details_form_schema?.supervisor_night_shift
    //     ),
    //     [supervisor_details_form_schema?.is_new_supervisor_night_shift]:
    //       getValues(
    //         supervisor_details_form_schema?.is_new_supervisor_night_shift
    //       ),
    //     [supervisor_details_form_schema?.security_guard_day_shift]: getValues(
    //       supervisor_details_form_schema?.security_guard_day_shift
    //     ),
    //     [supervisor_details_form_schema?.is_new_security_guard_day_shift]:
    //       getValues(
    //         supervisor_details_form_schema?.is_new_security_guard_day_shift
    //       ),
    //     [supervisor_details_form_schema?.security_guard_night_shift]: getValues(
    //       supervisor_details_form_schema?.security_guard_night_shift
    //     ),
    //     [supervisor_details_form_schema?.is_new_security_guard_night_shift]:
    //       getValues(
    //         supervisor_details_form_schema?.is_new_security_guard_night_shift
    //       ),
    //   };

    //   try {
    //     const response = await AddInspectionMaster(data).unwrap();
    //     console.log("saveAsDraftData - Success:", response);
    //     if (response.status === 200) {
    //       console.log("response --> ", response);
    //       toasterAlert({
    //         message: "Form Inspection Drafted Successfully.",
    //         status: 200,
    //       });
    //     }
    //   } catch (error) {
    //     let errorMessage =
    //       error?.data?.data || error?.data?.message || "Save As Daft Failed";
    //     console.log("Error:", errorMessage);
    //     toasterAlert({
    //       message: JSON.stringify(errorMessage),
    //       status: 440,
    //     });
    //     console.error("Error:", error);
    //   }

    //   console.log(data, "data");
    // };

    const [selectBoxOptions, setSelectBoxOptions] = useState([]);

    const [
      getSupervisorDayShift,
      { isLoading: getSupervisorDayShiftApiIsLoading },
    ] = useGetSupervisorDayShiftFreeMutation();

    const [
      getSupervisorNightShift,
      { isLoading: getSupervisorNightShiftApiIsLoading },
    ] = useGetSupervisorNightShiftFreeMutation();

    const [
      getSecurityGuardDayShift,
      { isLoading: getSecurityGuardDayShiftApiIsLoading },
    ] = useGetSecurityGuardDayShiftFreeMutation();

    const [
      getSecurityGuardNightShift,
      { isLoading: getSecurityGuardNightShiftApiIsLoading },
    ] = useGetSecurityGuardNightShiftFreeMutation();

    const fetchSupervisorDayShift = async () => {
      try {
        const response = await getSupervisorDayShift(
          getValues("area")
        ).unwrap();
        console.log("fetchSupervisorDayShift:", response);

        const optionsArray = response?.data?.map(
          ({ employee_name, user_id, count, chamber_count }) => ({
            value: user_id,
            label: employee_name,
            WH: count,
            GD: chamber_count,
          })
        );

        setSelectBoxOptions((prev) => ({
          ...prev,
          superVisorDayShiftOpt: optionsArray,
        }));
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchSupervisorNightShift = async () => {
      try {
        const response = await getSupervisorNightShift(
          getValues("area")
        ).unwrap();
        console.log("Success:", response);

        const optionsArray = response?.data?.map(
          ({ employee_name, user_id, count, chamber_count }) => ({
            value: user_id,
            label: employee_name,
            WH: count,
            GD: chamber_count,
          })
        );

        setSelectBoxOptions((prev) => ({
          ...prev,
          superVisorNightShiftOpt: optionsArray,
        }));
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchSecurityGuardDayShift = async () => {
      try {
        const response = await getSecurityGuardDayShift(
          getValues("area")
        ).unwrap();
        console.log("Success:", response);

        const optionsArray = response?.data?.map(
          ({ employee_name, user_id, count, chamber_count }) => ({
            value: user_id,
            label: employee_name,
            WH: count,
            GD: chamber_count,
          })
        );

        setSelectBoxOptions((prev) => ({
          ...prev,
          securityGuardDayShiftOpt: optionsArray,
        }));
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchSecurityGuardNightShift = async () => {
      try {
        const response = await getSecurityGuardNightShift(
          getValues("area")
        ).unwrap();
        console.log("Success:", response);

        const optionsArray = response?.data?.map(
          ({ employee_name, user_id, count, chamber_count }) => ({
            value: user_id,
            label: employee_name,
            WH: count,
            GD: chamber_count,
          })
        );

        setSelectBoxOptions((prev) => ({
          ...prev,
          securityGuardNightShiftOpt: optionsArray,
        }));
      } catch (error) {
        console.error("Error:", error);
      }
    };

    useEffect(() => {
      console.log("fetchSupervisorDayShift", getValues("area"));
      if (getValues("area")) {
        fetchSupervisorDayShift();
        fetchSupervisorNightShift();
        fetchSecurityGuardDayShift();
        fetchSecurityGuardNightShift();
      }
    }, [getValues("area")]);

    console.log("error sub details", errors);
    return (
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
          {/* -------------- Supervisor for Day shift ------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  Supervisor for Day shift -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Supervisor for Day shift</Text>{" "}
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <ReactSelect
                  options={selectBoxOptions?.superVisorDayShiftOpt || []}
                  value={
                    selectBoxOptions?.superVisorDayShiftOpt?.filter(
                      (item) =>
                        item.value ===
                        getValues(
                          supervisor_details_form_schema.supervisor_day_shift
                        )
                    )[0] || {}
                  }
                  {...register(
                    supervisor_details_form_schema?.supervisor_day_shift
                  )}
                  isDisabled={getValues("form_edit")}
                  isClearable={true}
                  onChange={(e) => {
                    setValue(
                      supervisor_details_form_schema.supervisor_day_shift,
                      e?.value || null,
                      { shouldValidate: true }
                    );
                  }}
                  isLoading={getSupervisorDayShiftApiIsLoading}
                  // styles={{
                  //   control: (base, state) => ({
                  //     ...base,
                  //     backgroundColor: "#fff",
                  //     borderRadius: "6px",
                  //     borderColor: errors?.[
                  //       supervisor_details_form_schema.supervisor_day_shift
                  //     ]?.message
                  //       ? "red"
                  //       : "#c3c3c3",

                  //     padding: "1px",
                  //     textAlign: "left",
                  //   }),
                  //   ...reactSelectStyle,
                  // }}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      borderColor: errors?.[
                        supervisor_details_form_schema.supervisor_day_shift
                      ]?.message
                        ? "red"
                        : "#c3c3c3",
                      padding: "1px",
                      borderWidth: "1px",

                      "&:hover": {
                        //borderColor: error ? "red" : "#A6CE39",
                      },
                    }),
                    menu: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflow: "auto",
                      // backgroundColor: "#A6CE39",
                    }),
                    menuList: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflow: "auto",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? "#A6CE39" : "white",
                      color: state.isFocused ? "green" : "black",
                      "&:hover": {
                        //  backgroundColor: "#C2DE8C",
                        color: "black",
                      },
                    }),
                  }}
                  formatOptionLabel={({ label, count, GD, WH }) => (
                    <Flex
                      w={"100%"}
                      justifyContent="space-between"
                      alignItems={"center"}
                    >
                      <Text color={"black"} width={"60%"} textAlign={"left"}>
                        {label}
                      </Text>
                      {WH && (
                        <Text
                          fontSize={"0.8rem"}
                          color="black"
                          textAlign={"right"}
                          width={"20%"}
                        >
                          {WH} WH
                        </Text>
                      )}
                      {GD && (
                        <Text
                          fontSize={"0.8rem"}
                          color="black"
                          textAlign={"right"}
                          width={"20%"}
                        >
                          {GD} GD
                        </Text>
                      )}
                      {count && (
                        <Text
                          fontSize={"0.8rem"}
                          color="black"
                          textAlign={"right"}
                          width={"40%"}
                        >
                          ({count})
                        </Text>
                      )}
                    </Flex>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1} textAlign="left"></GridItem>
          </Grid>

          {/* -------------- Supervisor for Night shift ------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  Supervisor for Night shift -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Supervisor for Night shift</Text>{" "}
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <ReactSelect
                  options={selectBoxOptions?.superVisorNightShiftOpt || []}
                  value={
                    selectBoxOptions?.superVisorNightShiftOpt?.filter(
                      (item) =>
                        item.value ===
                        getValues(
                          supervisor_details_form_schema.supervisor_night_shift
                        )
                    )[0] || {}
                  }
                  isDisabled={getValues("form_edit")}
                  isClearable={true}
                  {...register(
                    supervisor_details_form_schema?.supervisor_night_shift
                  )}
                  onChange={(e) => {
                    setValue(
                      supervisor_details_form_schema.supervisor_night_shift,
                      e?.value || null,
                      { shouldValidate: true }
                    );
                  }}
                  isLoading={getSupervisorNightShiftApiIsLoading}
                  // styles={{
                  //   control: (base, state) => ({
                  //     ...base,
                  //     backgroundColor: "#fff",
                  //     borderRadius: "6px",
                  //     borderColor: errors?.[
                  //       supervisor_details_form_schema.supervisor_night_shift
                  //     ]?.message
                  //       ? "red"
                  //       : "#c3c3c3",

                  //     padding: "1px",
                  //     textAlign: "left",
                  //   }),
                  //   ...reactSelectStyle,
                  // }}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      borderColor: errors?.[
                        supervisor_details_form_schema.supervisor_night_shift
                      ]?.message
                        ? "red"
                        : "#c3c3c3",
                      padding: "1px",
                      borderWidth: "1px",

                      "&:hover": {
                        //borderColor: error ? "red" : "#A6CE39",
                      },
                    }),
                    menu: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflow: "auto",
                      // backgroundColor: "#A6CE39",
                    }),
                    menuList: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflow: "auto",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? "#A6CE39" : "white",
                      color: state.isFocused ? "green" : "black",
                      "&:hover": {
                        //  backgroundColor: "#C2DE8C",
                        color: "black",
                      },
                    }),
                  }}
                  formatOptionLabel={({ label, count, GD, WH }) => (
                    <Flex
                      w={"100%"}
                      justifyContent="space-between"
                      alignItems={"center"}
                    >
                      <Text color={"black"} width={"60%"} textAlign={"left"}>
                        {label}
                      </Text>
                      {WH && (
                        <Text
                          fontSize={"0.8rem"}
                          color="black"
                          textAlign={"right"}
                          width={"20%"}
                        >
                          {WH} WH
                        </Text>
                      )}
                      {GD && (
                        <Text
                          fontSize={"0.8rem"}
                          color="black"
                          textAlign={"right"}
                          width={"20%"}
                        >
                          {GD} GD
                        </Text>
                      )}
                      {count && (
                        <Text
                          fontSize={"0.8rem"}
                          color="black"
                          textAlign={"right"}
                          width={"40%"}
                        >
                          ({count})
                        </Text>
                      )}
                    </Flex>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1} textAlign="left"></GridItem>
          </Grid>

          {/* -------------- Security Guard for day shift ------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  Security Guard for day shift  -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Security Guard for day shift </Text>{" "}
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <ReactSelect
                  options={selectBoxOptions?.securityGuardDayShiftOpt || []}
                  value={
                    selectBoxOptions?.securityGuardDayShiftOpt?.filter(
                      (item) =>
                        item.value ===
                        getValues(
                          supervisor_details_form_schema.security_guard_day_shift
                        )
                    )[0] || {}
                  }
                  isDisabled={getValues("form_edit")}
                  isClearable={true}
                  {...register(
                    supervisor_details_form_schema?.security_guard_day_shift
                  )}
                  onChange={(e) => {
                    setValue(
                      supervisor_details_form_schema.security_guard_day_shift,
                      e?.value || null,
                      { shouldValidate: true }
                    );
                  }}
                  isLoading={getSecurityGuardDayShiftApiIsLoading}
                  // styles={{
                  //   control: (base, state) => ({
                  //     ...base,
                  //     backgroundColor: "#fff",
                  //     borderRadius: "6px",
                  //     borderColor: errors?.[
                  //       supervisor_details_form_schema.security_guard_day_shift
                  //     ]?.message
                  //       ? "red"
                  //       : "#c3c3c3",

                  //     padding: "1px",
                  //     textAlign: "left",
                  //   }),
                  //   ...reactSelectStyle,
                  // }}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      borderColor: errors?.[
                        supervisor_details_form_schema.security_guard_day_shift
                      ]?.message
                        ? "red"
                        : "#c3c3c3",
                      padding: "1px",
                      borderWidth: "1px",

                      "&:hover": {
                        //borderColor: error ? "red" : "#A6CE39",
                      },
                    }),
                    menu: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflow: "auto",
                      // backgroundColor: "#A6CE39",
                    }),
                    menuList: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflow: "auto",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? "#A6CE39" : "white",
                      color: state.isFocused ? "green" : "black",
                      "&:hover": {
                        //  backgroundColor: "#C2DE8C",
                        color: "black",
                      },
                    }),
                  }}
                  formatOptionLabel={({ label, count, GD, WH }) => (
                    <Flex
                      w={"100%"}
                      justifyContent="space-between"
                      alignItems={"center"}
                    >
                      <Text color={"black"} width={"60%"} textAlign={"left"}>
                        {label}
                      </Text>
                      {WH && (
                        <Text
                          fontSize={"0.8rem"}
                          color="black"
                          textAlign={"right"}
                          width={"20%"}
                        >
                          {WH} WH
                        </Text>
                      )}
                      {GD && (
                        <Text
                          fontSize={"0.8rem"}
                          color="black"
                          textAlign={"right"}
                          width={"20%"}
                        >
                          {GD} GD
                        </Text>
                      )}
                      {count && (
                        <Text
                          fontSize={"0.8rem"}
                          color="black"
                          textAlign={"right"}
                          width={"40%"}
                        >
                          ({count})
                        </Text>
                      )}
                    </Flex>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1} textAlign="left"></GridItem>
          </Grid>

          {/* -------------- Security Guard for night shift ------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  Security Guard for night shift  -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Security Guard for night shift </Text>{" "}
            </GridItem>

            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <ReactSelect
                  options={selectBoxOptions?.securityGuardNightShiftOpt || []}
                  value={
                    selectBoxOptions?.securityGuardNightShiftOpt?.filter(
                      (item) =>
                        item.value ===
                        getValues(
                          supervisor_details_form_schema.security_guard_night_shift
                        )
                    )[0] || {}
                  }
                  isDisabled={getValues("form_edit")}
                  isClearable={true}
                  {...register(
                    supervisor_details_form_schema?.security_guard_night_shift
                  )}
                  onChange={(e) => {
                    setValue(
                      supervisor_details_form_schema.security_guard_night_shift,
                      e?.value || null,
                      { shouldValidate: true }
                    );
                  }}
                  isLoading={getSecurityGuardNightShiftApiIsLoading}
                  // styles={{
                  //   control: (base, state) => ({
                  //     ...base,
                  //     backgroundColor: "#fff",
                  //     borderRadius: "6px",
                  //     borderColor: errors?.[
                  //       supervisor_details_form_schema.security_guard_night_shift
                  //     ]?.message
                  //       ? "red"
                  //       : "#c3c3c3",

                  //     padding: "1px",
                  //     textAlign: "left",
                  //   }),
                  //   ...reactSelectStyle,
                  // }}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#fff",
                      borderRadius: "6px",
                      borderColor: errors?.[
                        supervisor_details_form_schema
                          .security_guard_night_shift
                      ]?.message
                        ? "red"
                        : "#c3c3c3",
                      padding: "1px",
                      borderWidth: "1px",

                      "&:hover": {
                        //borderColor: error ? "red" : "#A6CE39",
                      },
                    }),
                    menu: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflow: "auto",
                      // backgroundColor: "#A6CE39",
                    }),
                    menuList: (base) => ({
                      ...base,
                      maxHeight: "150px",
                      overflow: "auto",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? "#A6CE39" : "white",
                      color: state.isFocused ? "green" : "black",
                      "&:hover": {
                        //  backgroundColor: "#C2DE8C",
                        color: "black",
                      },
                    }),
                  }}
                  formatOptionLabel={({ label, count, GD, WH }) => (
                    <Flex
                      w={"100%"}
                      justifyContent="space-between"
                      alignItems={"center"}
                    >
                      <Text color={"black"} width={"60%"} textAlign={"left"}>
                        {label}
                      </Text>
                      {WH && (
                        <Text
                          fontSize={"0.8rem"}
                          color="black"
                          textAlign={"right"}
                          width={"20%"}
                        >
                          {WH} WH
                        </Text>
                      )}
                      {GD && (
                        <Text
                          fontSize={"0.8rem"}
                          color="black"
                          textAlign={"right"}
                          width={"20%"}
                        >
                          {GD} GD
                        </Text>
                      )}
                      {count && (
                        <Text
                          fontSize={"0.8rem"}
                          color="black"
                          textAlign={"right"}
                          width={"40%"}
                        >
                          ({count})
                        </Text>
                      )}
                    </Flex>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={1} textAlign="left"></GridItem>
          </Grid>

          {getValues("is_draftable") ? (
            <Flex gap="10px" justifyContent="end" alignItems="center">
              <Button
                bg="#A6CE39"
                _hover={{}}
                color="white"
                marginTop={"30px"}
                padding="0px 30px"
                borderRadius={"50px"}
                type="button"
                onClick={() => {
                  saveFunction();
                }}
              >
                Save As Draft
              </Button>
            </Flex>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    );
  }
);

export default SupervisorDetails;
