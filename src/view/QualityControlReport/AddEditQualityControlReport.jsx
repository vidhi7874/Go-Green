/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import {
  FormProvider,
  useForm,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
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
  Toast,
  Tr,
} from "@chakra-ui/react";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import * as yup from "yup";
import { BsEye } from "react-icons/bs";
import { schema } from "./fields";
import {
  useAddQCRMutation,
  useAssignQCRMutation,
  useGetQCRByIdMutation,
} from "../../features/qcr.slice";
import moment from "moment";
import { useGetCommodityIDMasterMutation } from "../../features/master-api-slice";
import ROUTE_PATH from "../../constants/ROUTE";
import { localStorageService } from "../../services/localStorge.service";
import { toast } from "react-toastify";

const AddEditQualityControlReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const pageView = location?.state?.view;

  const methods = useForm({
    resolver: yupResolver(schema),
  });


  const [commonState, setCommonState] = useState({});

  const { register, control, formState } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "quality_control_report_parameter_details",
  });

  const details = location.state?.details;

  // Css code Start
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
    md: "repeat(2, 1fr)",
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

  console.log("errors --> ", formState?.errors);
  const [gradeForGGRN, setGradeForGGRN] = useState('');
  const [gradeForGGRNError, setGradeForGGRNError] = useState('');
  const handleChange = (e) => {
    setGradeForGGRN(e.target.value);
  };

  // Form Submit Function Start
  const onSubmit = (data) => {
    if (Number(qcrstaus || 0) > 1 && !data.grade_for_ggrn) {
      toast.error("Grade For GGRN is required");
      return;
    }
    console.log("data==>", data);
    updateData({ ...data, id: details?.id || 0 });
  };


  const [gatepassData, setGatepassData] = useState([]);
  // const [qcrpd,setQcrpd] = useState([])

  // Add warehouseClient Api End

  // Updat = e QCR Api Start

  const [updateQCR, { isLoading: updatQCRApiIsLoading }] = useAddQCRMutation();

  const updateData = async (data) => {
    console.log(data);

    // console.log(details?.quality_control_report_parameter_details.map((el) => el.id),"hhhiiiii")
    const quality_control_report_parameter_details_arr =
      data?.quality_control_report_parameter_details.map((el, index) => ({
        // id: location?.state?.qcrId,
        //id:autoFieldOnEdit,
        id: data?.final_test_result[index]?.id,
        quality_parameter: el?.quality_parameter?.id,
        test_result: el?.final_test_result,
      }));

    console.log(data);
    console.log("dddddddddd", data?.quality_control_report_parameter_details);

    let obj = {
      id: location?.state?.qcrId,
      cir_no: commonState?.cir_id,
      lab_location: data?.lab_location,
      grade_for_bank: data?.grade_for_bank,
      grade_for_ggrn: data?.grade_for_ggrn,
      model_of_packing: data?.model_of_packing,
      sampling_date: data?.sampling_date,
      receipt_date: data?.receipt_date,
      completion_date: data?.completion_date,
      remarks: data?.remarks,

      // quality_control_report_parameter_details : quality_control_report_parameter_details_arr

      quality_control_report_parameter_details:
        data?.quality_control_report_parameter_details.map((el) => ({
          // id: location?.state?.qcrId,
          //id:autoFieldOnEdit,
          id: el?.id || null,
          quality_parameter: el?.quality_parameter?.id,
          test_result: el?.final_test_result,
        })),
    };

    try {
      const response = await updateQCR(obj).unwrap();
      if (response.status === 200) {
        // toasterAlert(response);
        // if (Number(qcrstaus || 0) === 2) {
        approvedToMeFunction({ status: "approved" });
        // }

        // navigate(`${ROUTE_PATH.QUALITY_CONTROL_REPORT}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };

  // Update QCR Api Start

  // Detail QCR Api Start

  const [getQCRById] = useGetQCRByIdMutation();

  const [getCommodityIdMaster] = useGetCommodityIDMasterMutation();

  const fetchQcrDetails = async (id) => {
    try {
      const response = await getQCRById(id).unwrap();
      console.log("add warehouse owner type master res", response);

      if (response.status === 200) {
        console.log("done");
        return response;
      }
    } catch (error) {
      console.error("Error:", error);
      toasterAlert(error);
    }
  };

  const [qcrstaus, setQcrstaus] = useState(0);

  const [filledData, setFilledData] = useState({});

  const autoFieldOnEdit = async () => {
    console.log("details", details);
    if (details?.id) {
      console.log(details);
      const auto_filled_data = await fetchQcrDetails(details?.id);
      console.log("auto_filled_data", auto_filled_data);
      console.log(details?.commodity);
      let commodityData = "";
      try {
        commodityData = await getCommodityIdMaster({
          id: details?.commodity,
        }).unwrap();
      } catch (error) {
        console.log(error);
        showToastByStatusCode(400, error?.data?.detail);
      }
      console.log(commodityData);

      const data_obj = auto_filled_data?.data;
      console.log(data_obj);

      setQcrstaus(
        auto_filled_data?.quality_control_report?.status?.status_code
      );

      setFilledData(auto_filled_data?.quality_control_report || {});

      setCommonState((prev) => ({
        ...prev,
        cir_id: auto_filled_data?.data?.id,
      }));

      console.log(
        "------->$ auto_filled_data",
        auto_filled_data?.qc_report_parameter_details
      );
      const final_test_result =
        auto_filled_data?.qc_report_parameter_details.map((el) => ({
          id: el?.id,
          commodity_quality_report: el?.commodity_quality_report,
          quality_parameter: el?.quality_parameter,
          test_result: el.test_result,
        }));

      console.log("final_test_result $$", final_test_result);

      // const final_test_result =
      //   auto_filled_data?.qc_report_parameter_details.map(
      //     (el) => el.test_result
      //   );
      // const id  = auto_filled_data?.qc_report_parameter_details.map((el) => el.id);
      // console.log(id,"iddd")
console.log(auto_filled_data?.quality_control_report?.grade_for_ggrn,"hiii")
      let obj = {
        cir_no: data_obj?.cir_no,
        client: data_obj?.service_contract_no?.client?.name_of_client || null,
        commodity_variety:
          data_obj?.commodity_variety?.commodity_variety || null,
        warehouse: data_obj?.warehouse?.warehouse_name || null,
        commodity: data_obj?.commodity?.commodity_name || null,
        chamber: data_obj?.chamber?.chamber_number,
        cir_date: moment(data_obj?.cir_date).format("YYYY-MM-DD"),
        sampling_date: moment(data_obj?.sampling_date).format("YYYY-MM-DD"),
        receipt_date: auto_filled_data?.quality_control_report?.receipt_date,
        lab_location: auto_filled_data?.quality_control_report?.lab_location,
        model_of_packing:
          auto_filled_data?.quality_control_report?.model_of_packing,

        remarks: auto_filled_data?.quality_control_report?.remarks,
        rejectReason_text:
          auto_filled_data?.quality_control_report?.l2_reasons || "",
        completion_date:
          auto_filled_data?.quality_control_report?.completion_date,
        grade_for_ggrn: auto_filled_data?.quality_control_report?.grade_for_ggrn,

        final_test_result: final_test_result,
      };

      setRejectReason(auto_filled_data?.quality_control_report?.l2_reasons);

      const gatepass_arr =
        auto_filled_data?.gatepasses?.map((el) => ({
          id: el.id,
          gate_pass_no: el?.gate_pass_no,
          truck_no: el?.truck_no,
          weighbridge_slip_no: el?.weighbridge_slip_no,
          total_no_of_bags: el?.total_no_of_bags,
          gross_weight_kg: el?.gross_weight_kg,
          tare_weight: el?.tare_weight,
          net_weight: el?.net_weight,
        })) || [];

      console.log(gatepass_arr);

      setGatepassData(gatepass_arr);

      remove();

      const uniqueSet = new Set();
      const uniqueObjects = [];

      // Custom function to determine object uniqueness

      const TempArray = commodityData?.data?.quality_parameter;
      // const TempArray = commodityData?.data?.data?.quality_parameter;
      console.log(TempArray);

      function isUnique(obj) {
        const key = `${JSON.stringify(obj.id)}`;
        console.log(key);
        if (!uniqueSet.has(key)) {
          uniqueSet.add(key);
          return true;
        }
        return false;
      }

      console.log(uniqueSet);
      // qc_report_parameter_details

      TempArray?.forEach((item) => {
        console.log(item, "item");
        if (isUnique(item?.quality_parameter)) {
          uniqueObjects.push(item);
        }
      });

      console.log(uniqueObjects);

      const tempQuality =
        uniqueObjects?.map((item) => ({
          quality_parameter: item.quality_parameter,
          quality: [],
          gatepass: [],
        })) || [];

      const tempQP = commodityData?.data?.quality_parameter || [];
      console.log(commodityData?.data?.quality_parameter);

      for (let i = 0; i < tempQuality.length || 0; i++) {
        for (let j = 0; j < tempQP.length || 0; j++) {
          if (
            tempQuality[i].quality_parameter.id ===
            tempQP[j].quality_parameter.id
          ) {
            tempQuality[i].quality = [
              ...tempQuality[i].quality,
              {
                id: "",
                quality_grade: tempQP[j].quality_grade,
                quality_value:
                  tempQP[j].permissible_range ||
                  tempQP[j].permissible_value ||
                  0,
              },
            ];
          }
        }
      }

      const tempGP = auto_filled_data?.gate_pass_commodity_quality;
      console.log(tempGP);
      console.log(tempQuality);

      for (let i = 0; i < tempQuality?.length; i++) {
        for (let j = 0; j < tempGP?.length; j++) {
          if (
            tempQuality[i].quality_parameter?.id ===
            tempGP[j].quality_parameter?.id
          ) {
            console.log(
              "tempQuality[i].quality_parameter.id",
              tempQuality[i].quality_parameter?.id
            );
            tempQuality[i].gatepass = [
              ...tempQuality[i].gatepass,
              {
                gate_pass_id: tempGP[j]?.gate_pass?.id,
                gate_pass_value: tempGP[j]?.parameter_value || 0,
              },
            ];
          }
        }
      }

      let y = [];

      console.log(y);

      const filteredArray = final_test_result.filter((item) => {
        console.log("item", item);
        return tempQuality.some((result) => {
          if (item.quality_parameter === result.quality_parameter.id) {
            console.log("sdlkfjsdl", item);

            y.push({
              ...item,
              id: item?.id || null,
              final_test_result: item.test_result,
            });
          }
        });
      });
      // const filteredArray = final_test_result.filter((item) => {
      //   console.log("item", item);
      //   return tempQuality.some(
      //     (result) => item?.quality_parameter === result?.quality_parameter?.id
      //   );
      // });
      // gatepassData

      console.log(" ---> filteredArray", filteredArray);

      const uniqueTest_result = [];
      y?.forEach((item) => {
        console.log(item, "item");
        if (isUnique(item?.quality_parameter)) {
          uniqueTest_result.push(item);
        }
      });

      console.log("uniqueTest_result", uniqueTest_result);

      console.log(tempQuality, "jiii");
      console.log("---------->$ tempQuality", tempQuality);
      console.log("---------->$ final_test_result", final_test_result);

      // const arr = tempQuality?.map((el, index) => ({
      //   ...el,
      //   final_test_result: final_test_result[index]?.test_result,
      // }));

      let final_result = [];

      if (final_test_result?.length > 0) {
        tempQuality.filter((item) => {
          console.log("item", item);
          return final_test_result.some((result) => {
            if (item?.quality_parameter?.id === result?.quality_parameter) {
              console.log(result);
              final_result.push({
                ...item,
                id: result?.id || null,
                final_test_result: result?.test_result,
              });
            }
          });
        });
      } else {
        final_result = tempQuality?.map((el, index) => ({
          ...el,
          final_test_result: final_test_result[index]?.test_result,
        }));
      }

      console.log("final_result", final_result);

      // const arr = filteredArray?.map((el, index) => ({
      //   ...el,
      //   final_test_result: final_test_result[index]?.test_result,
      // }));

      //  const arr = y;

      // console.log("========>", arr);
      // append(arr);
      append(final_result);

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    }
  };

  // Detail QCR Api Start

  //GatePass Full Screen Code Start

  function enterFullScreen(newTab) {
    if (newTab.document.documentElement.requestFullscreen) {
      newTab.document.documentElement.requestFullscreen();
    } else if (newTab.document.documentElement.mozRequestFullScreen) {
      // Firefox
      newTab.document.documentElement.mozRequestFullScreen();
    } else if (newTab.document.documentElement.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      newTab.document.documentElement.webkitRequestFullscreen();
    } else if (newTab.document.documentElement.msRequestFullscreen) {
      // IE/Edge
      newTab.document.documentElement.msRequestFullscreen();
    }
  }

  //GatePass Full Screen Code End

  // Edit Form Fill Logic Start
  useEffect(() => {
    autoFieldOnEdit();

    const breadcrumbArray = [
      {
        title: "Quality Control Report",
        link: `${ROUTE_PATH.QUALITY_CONTROL_REPORT}`,
      },
    ];

    dispatch(setBreadCrumb(breadcrumbArray));
    // eslint-disable-next-line
  }, [details]);
  // Edit Form Fill Logic End
  const [rowAverages, setRowAverages] = useState([]);

  useEffect(() => {
    const calculateRowAverage = (field, index) => {
      const rowValues = gatepassData.map(
        (e, i) =>
          field?.gatepass?.find((item2) => item2.gate_pass_id === e.id)
            ?.gate_pass_value || 0
      );

      console.log("rowValues:", rowValues);

      const total = rowValues.reduce(
        (sum, value) => sum + parseFloat(value),
        0
      );
      const average = total / gatepassData.length;

      console.log("average:", average);

      // Use setValue within the useEffect to update the form field
      // methods.setValue(
      //   `quality_control_report_parameter_details.${index}.final_test_result`,
      // -  !isNaN(average) ? average.toFixed(2) : null,
      //   {
      //     shouldValidate: true,
      //   }
      // );

      return !isNaN(average) ? average.toFixed(2) : null;
    };

    // Calculate average for each row when the component mounts
    const newRowAverages = fields.map((field, index) =>
      calculateRowAverage(field, index)
    );

    setRowAverages(newRowAverages);
  }, [fields, gatepassData]);

  const handleInputChange = (e, rowIndex) => {
    const newValue = e.target.value;
    const updatedRowAverages = [...rowAverages];
    updatedRowAverages[rowIndex] = newValue;

    console.log(updatedRowAverages);

    methods.setValue(
      `quality_control_report_parameter_details.${rowIndex}.final_test_result`,
      newValue,
      {
        shouldValidate: true,
      }
    );
    setRowAverages(updatedRowAverages);
  };
  // Input disable Logic Start

  function InputDisableFunction() {
    const isViewOnly = location?.state?.isViewOnly || false;

    const userDetails = localStorageService.get("GG_ADMIN");

    if (isViewOnly) {
      return true;
    } else {
      if (qcrstaus > -2) {
        if (qcrstaus === 0) {
          if (filledData?.l1_user?.id === userDetails?.userDetails?.id) {
            return false;
          } else {
            return true;
          }
        } else if (qcrstaus === 1) {
          return true;
        } else if (qcrstaus === 2) {
          if (filledData?.l2_user?.id === userDetails?.userDetails?.id) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      } else {
        console.log(qcrstaus, "tempFlag");
        return true;
      }
    }
  }
  // Input disable Logic End

  // Reject Logic Start

  const [rejectReason, setRejectReason] = useState("");


  const [
    UpdateAssignServiceMaster,
    { isLoading: updateAssignServiceMasterApiIsLoading },
  ] = useAssignQCRMutation();

  const assignToMeFunction = async () => {
    const data = {
      id: filledData.id,
      status: "assigned",
      reasons: "",
    };

    try {
      const response = await UpdateAssignServiceMaster(data).unwrap();
      console.log("saveAsDraftData - Success:", response);
      if (response.status === 200) {
        console.log("response --> ", response);
        toasterAlert({
          message: "QCR Assign Successfully.",
          status: 200,
        });
        window.location.reload();
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
      id: filledData.id,
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
          message: "QCR Approved Successfully.",
          status: 200,
        });
        navigate("/quality-control-report");
      }
    } catch (error) {
      console.error("Error:", error);
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Request Failed.";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }

    console.log(data, "data");
  };

  const rejectedToMeFunction = async () => {
    if (rejectReason === "") {
      toasterAlert({
        message: "Add Reason for Rejection",
        status: 440,
      });

      //return false;
    } else {
      const data = {
        id: filledData.id,
        status: "rejected",
        reasons: rejectReason,
      };

      try {
        const response = await UpdateAssignServiceMaster(data).unwrap();
        console.log("saveAsDraftData - Success:", response);
        if (response.status === 200) {
          console.log("response --> ", response);
          toasterAlert({
            message: "QCR Rejected Successfully.",
            status: 200,
          });
          navigate("/quality-control-report");
        }
      } catch (error) {
        console.error("Error:", error);
        let errorMessage =
          error?.data?.data ||
          error?.data?.message ||
          error?.data ||
          "Request Failed.";
        console.log("Error:", errorMessage);
        toasterAlert({
          message: JSON.stringify(errorMessage),
          status: 440,
        });
      }

      console.log(data, "data");
    }
  };
  // Update isGradeForGGRNRequired based on qcrstaus value
  // Reject Logic End

  return (
    <>
      <Box bg="white" borderRadius={10} p="10">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
              {/*CIR No*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">CIR No</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      {...register("cir_no")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      // isDisabled={InputDisableFunction()}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="CIR No"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* CIR Date*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">CIR Date</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      {...register("cir_date")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      // isDisabled={InputDisableFunction()}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="CIR Date"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* Depositor / client Name */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Depositor / client Name</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      {...register("client")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      // isDisabled={InputDisableFunction()}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Depositor / client Name"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/*Warehouse Name*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Warehouse Name</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Textarea
                      {...register("warehouse")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      // isDisabled={InputDisableFunction()}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Warehouse Name"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* Chamber No*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Chamber No</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      {...register("chamber")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      // isDisabled={InputDisableFunction()}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Chamber No"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* Commodity name*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Commodity name</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      {...register("commodity")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      // isDisabled={InputDisableFunction()}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Commodity name"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* Commodity Variety*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Commodity Variety</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      {...register("commodity_variety")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      // isDisabled={InputDisableFunction()}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Commodity Variety"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* Lab Location */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Lab Location </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={formState?.errors?.lab_location}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      {...register("lab_location")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={InputDisableFunction()}
                      // isDisabled={true}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      // isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Lab Location"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* Model of Packing */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Model of Packing </Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={formState?.errors?.model_of_packing}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      {...register("model_of_packing")}
                      type="text"
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
                      placeholder="Model of Packing"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* Date of Sampling*/}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Date of Sampling</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl style={{ w: commonWidth.w }}>
                    <Input
                      {...register("sampling_date")}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      // isDisabled={InputDisableFunction()}
                      //value={inputValue}
                      //  onChange={onChange}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Date of Sampling"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* Date of Reciept */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Date of Reciept</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={formState?.errors?.receipt_date}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      {...register("receipt_date")}
                      type="date"
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
                      placeholder="Date of Reciept"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* Date of Completion/Issue */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right">Date of Completion/Issue</Text>{" "}
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                  <FormControl
                    isInvalid={formState?.errors?.completion_date}
                    style={{ w: commonWidth.w }}
                  >
                    <Input
                      {...register("completion_date")}
                      type="date"
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
                      placeholder="Date of Completion/Issue"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              {/* Gatepass details */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right" color={"#212121"} fontWeight={"bold"}>
                    Gatepass Details
                  </Text>{" "}
                </GridItem>
              </Grid>
              {/* Table Start */}
              <TableContainer mt="4">
                <Table color="#000">
                  <Thead bg="#dbfff5" border="1px" borderColor="#000">
                    <Tr style={{ color: "#000" }}>
                      <Th color="#000">Sr no</Th>
                      <Th color="#000">Gate pass no No</Th>
                      <Th color="#000">Truck no</Th>
                      <Th color="#000">Weighbridge slip no</Th>
                      <Th color="#000">No of bags</Th>
                      <Th color="#000">Gross weight</Th>
                      <Th color="#000">Tare weight</Th>
                      <Th color="#000">Net weight</Th>

                      <Th color="#000">View Gate Pass</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {gatepassData &&
                      gatepassData.map((item, i) => (
                        <Tr
                          key={`warehouse_owner_details${i}`}
                          textAlign="center"
                          bg="white"
                          border="1px"
                          borderColor="#000"
                        >
                          <Td>{i + 1}</Td>
                          <Td>{item?.gate_pass_no}</Td>
                          <Td>{item?.truck_no}</Td>
                          <Td>{item?.weighbridge_slip_no}</Td>
                          <Td>{item?.total_no_of_bags}</Td>
                          <Td>{item?.gross_weight_kg}</Td>
                          <Td>{item?.tare_weight}</Td>
                          <Td>{item?.net_weight}</Td>

                          <Td>
                            <Box display="flex" alignItems="center" gap="3">
                              <Flex gap="20px" justifyContent="center">
                                <Box color={"primary.700"}>
                                  <BsEye
                                    // color="#A6CE39"
                                    fontSize="26px"
                                    cursor="pointer"
                                    // edit/gate-pass/33
                                    onClick={() => {
                                      // navigate(`/edit/gate-pass/${item?.id}`, {
                                      //   state: {
                                      //     details: {
                                      //       id: item?.id,
                                      //     },
                                      //   },
                                      // })

                                      const newTab = window.open(
                                        `${ROUTE_PATH.GATE_PASS_INWARD_EDIT}/${item?.id}?readonly=true`,
                                        "_blank"
                                      );

                                      if (newTab) {
                                        // newTab.document.documentElement.requestFullscreen();
                                        enterFullScreen(newTab);
                                      }
                                    }}
                                  />
                                </Box>
                              </Flex>
                            </Box>
                          </Td>
                        </Tr>
                      ))}
                    {gatepassData.length === 0 && (
                      <Tr textAlign="center">
                        <Td colSpan="5" color="#000">
                          No record found
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
              {/* Table End */}
              {/* Test Result Analysis */}
              <Grid
                textAlign="right"
                alignItems="center"
                my="3"
                templateColumns={templateColumns}
                gap={5}
              >
                <GridItem colSpan={{ base: 1, lg: 0 }}>
                  <Text textAlign="right" color={"#212121"} fontWeight={"bold"}>
                    Test Result Analysis
                  </Text>{" "}
                </GridItem>
              </Grid>
              {/* Table Start */}
              <TableContainer mt="4">
                <Table color="#000">
                  <Thead bg="#dbfff5" border="1px" borderColor="#000">
                    <Tr style={{ color: "#000" }}>
                      <Th color="#000">Parameter</Th>
                      {gatepassData.map((e, ind) => (
                        <Th key={`gate_pass_${ind}`} color="#000">
                          {/* {`Gate pass - ${ind + 1}`} */}
                          {e.gate_pass_no}
                        </Th>
                      ))}

                      <Th color="#000">Final test result</Th>
                      {Number(qcrstaus || 0) > 1 && (
                        <Th color="#000">Specification</Th>
                      )}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {/* {warehouseOwnersDetails &&
                      warehouseOwnersDetails.map((item, i) => ( */}
                    {fields?.length > 0 ? (
                      fields.map((field, index) => (
                        <Tr key={field?.id}>
                          <Td color={"#212121"}>
                            {field?.quality_parameter?.quality_parameter || "-"}
                          </Td>
                          {gatepassData.map((e, ind) => (
                            <Td>
                              {field?.gatepass?.map((item2, index2) =>
                                item2.gate_pass_id === e.id
                                  ? item2.gate_pass_value
                                  : ""
                              ) || "-"}
                            </Td>
                          ))}
                          {Number(qcrstaus || 0) < 1 ? (
                            <Td>
                              <Controller
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="text"
                                    border="1px"
                                    value={rowAverages[index]}
                                    onChange={(e) =>
                                      handleInputChange(e, index)
                                    }
                                    borderColor={`${formState?.errors
                                      ?.quality_control_report_parameter_details?.[
                                      index
                                    ]?.final_test_result
                                      ? "red"
                                      : "gray.10"
                                      }`}
                                    backgroundColor={"white"}
                                    height={"15px "}
                                    borderRadius={"lg"}
                                    _placeholder={commonStyle._placeholder}
                                    _hover={commonStyle._hover}
                                    _focus={commonStyle._focus}
                                    p={{ base: "4" }}
                                    fontWeight={{ base: "normal" }}
                                    fontStyle={"normal"}
                                    placeholder="Enter final result"
                                    isDisabled={InputDisableFunction()}
                                  />
                                )}
                                name={`quality_control_report_parameter_details.${index}.final_test_result`}
                                control={control}
                                rules={{ required: "dsfad adsf" }}
                              />
                            </Td>
                          ) : (
                            <Td>
                              <Controller
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="text"
                                    border="1px"
                                    //    value={rowAverages[index]}
                                    borderColor={`${formState?.errors
                                      ?.quality_control_report_parameter_details?.[
                                      index
                                    ]?.final_test_result
                                      ? "red"
                                      : "gray.10"
                                      }`}
                                    backgroundColor={"white"}
                                    height={"15px "}
                                    borderRadius={"lg"}
                                    _placeholder={commonStyle._placeholder}
                                    _hover={commonStyle._hover}
                                    _focus={commonStyle._focus}
                                    p={{ base: "4" }}
                                    fontWeight={{ base: "normal" }}
                                    fontStyle={"normal"}
                                    placeholder="Enter final result"
                                    isDisabled={InputDisableFunction()}
                                  />
                                )}
                                name={`quality_control_report_parameter_details.${index}.final_test_result`}
                                control={control}
                                rules={{ required: "dsfad adsf" }}
                              />
                            </Td>
                          )}

                          {Number(qcrstaus || 0) > 1 && (
                            <Td>
                              {field?.quality?.map((item, index) => {
                                return (
                                  <p key={`grade_${index}`}>
                                    {item.quality_grade} :
                                    {JSON.stringify(item.quality_value)}{" "}
                                  </p>
                                );
                              }) || "-"}
                            </Td>
                          )}
                        </Tr>
                      ))
                    ) : (
                      <Tr textAlign="center">
                        <Td colSpan="5" color="#000">
                          No record found
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
              {/* Table End */}
              {/* Grade For GGRN  */}
              {/* {Number(qcrstaus || 0) > 1 && (
        <Grid
          textAlign="right"
          alignItems="center"
          my="3"
          templateColumns={templateColumns}
          gap={5}
        >
          <GridItem colSpan={{ base: 1, lg: 0 }}>
            <Text textAlign="right"> Grade For GGRN </Text>{" "}
          </GridItem>
          <GridItem colSpan={{ base: 1 }}>
            <Input
              type="text"
              border="1px"
              borderColor={formState.errors?.grade_for_ggrn ? "red" : "gray.10"}
              backgroundColor={"white"}
              height={"15px "}
              borderRadius={"lg"}
              isDisabled={InputDisableFunction()}
              {...register('grade_for_ggrn', {
                required: isGradeForGGRNRequired ? 'Grade for GGRN is required' : false,
              })}
              _placeholder={commonStyle._placeholder}
              _hover={commonStyle._hover}
              _focus={commonStyle._focus}
              p={{ base: "4" }}
              fontWeight={{ base: "normal" }}
              fontStyle={"normal"}
              placeholder="Reason for rejection"
            />
            {formState.errors?.grade_for_ggrn && (
              <FormErrorMessage>{formState.errors.grade_for_ggrn.message}</FormErrorMessage>
            )}
          </GridItem>
        </Grid>
      )} */}
              {Number(qcrstaus || 0) > 1 && (
                <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right"> Grade For GGRN </Text>{" "}
                  </GridItem>
                  <GridItem colSpan={{ base: 1 }}>
                    <Input
                      {...register('grade_for_ggrn')}
                      type="text"
                      border="1px"
                      // borderColor={formState.errors?.grade_for_ggrn ? "red" : "gray.10"}
                      borderColor={formState.errors?.grade_for_ggrn ? "red" : "gray.10"}
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={InputDisableFunction()}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      p={{ base: "4" }}
                      //value={gradeForGGRN}
                      onChange={handleChange}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Grade For GGRN"
                      style={{ borderColor: gradeForGGRNError ? 'red' : 'initial' }}
                    />
                    {gradeForGGRNError && <div style={{ color: 'red' }}>{gradeForGGRNError}</div>}
                  </GridItem>
                </Grid>
              )}

              {/* Grade For Bank  */}
              {Number(qcrstaus || 0) > 1 && (
                <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right"> Grade For Bank </Text>{" "}
                  </GridItem>
                  <GridItem colSpan={{ base: 1 }}>
                    <Input
                      {...register('grade_for_bank')}
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={InputDisableFunction()}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Grade For Bank"
                    />
                  </GridItem>
                </Grid>
              )}


              {/*Remarks*/}
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
                  <FormControl style={{ w: commonWidth.w }}>
                    <Textarea
                      {...register("remarks")}
                      type="text"
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
                      placeholder="Remarks"
                    />
                  </FormControl>
                </GridItem>
              </Grid>



              {/* rejectReason text */}

              {Number(qcrstaus || 0) === 4 || Number(qcrstaus || 0) === 2 ? (
                <Grid
                  textAlign="right"
                  alignItems="center"
                  my="3"
                  templateColumns={templateColumns}
                  gap={5}
                >
                  <GridItem colSpan={{ base: 1, lg: 0 }}>
                    <Text textAlign="right"> Reason for rejection </Text>{" "}
                  </GridItem>
                  <GridItem colSpan={{ base: 1 }}>
                    <Textarea
                      type="text"
                      border="1px"
                      borderColor="gray.10"
                      backgroundColor={"white"}
                      height={"15px "}
                      borderRadius={"lg"}
                      isDisabled={InputDisableFunction()}
                      value={rejectReason}
                      onChange={(e) => {
                        setRejectReason(e.target.value);
                      }}
                      _placeholder={commonStyle._placeholder}
                      _hover={commonStyle._hover}
                      _focus={commonStyle._focus}
                      //  isDisabled={true}
                      p={{ base: "4" }}
                      fontWeight={{ base: "normal" }}
                      fontStyle={"normal"}
                      placeholder="Reason for rejection"
                    />
                  </GridItem>
                </Grid>
              ) : (
                <></>
              )}
              <Box
                display="flex"
                gap={2}
                justifyContent="flex-end"
                mt="10"
                px="0"
              >
                {Number(qcrstaus || 0) === 1 ? (
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
                      assignToMeFunction();
                    }}
                    px={"10"}
                  >
                    Assign to me
                  </Button>
                ) : (
                  <></>
                )}
                {Number(qcrstaus || 0) === 2 ? (
                  <>
                    <Button
                      type="button"
                      // type="submit"
                      //w="full"
                      isDisabled={pageView}
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
                      type="submit"
                      // onClick={() => {
                      //   approvedToMeFunction({ status: "approved" });
                      // }}
                      backgroundColor={"primary.700"}
                      _hover={{ backgroundColor: "primary.700" }}
                      color={"white"}
                      isDisabled={pageView}
                      borderRadius={"full"}
                      // isDisabled={view ? true : false}
                      isLoading={
                        updateAssignServiceMasterApiIsLoading ||
                        updatQCRApiIsLoading
                      }
                      px={"10"}
                    >
                      Approve
                    </Button>
                  </>
                ) : (
                  <></>
                )}
                {qcrstaus === null || qcrstaus === undefined ? (
                  <Button
                    type="button"
                    // type="submit"
                    //w="full"
                    backgroundColor={"primary.700"}
                    _hover={{ backgroundColor: "primary.700" }}
                    color={"white"}
                    // isDisabled={getValues("form_edit") === true ? true : false}
                    borderRadius={"full"}
                    isLoading={updateAssignServiceMasterApiIsLoading}
                    onClick={() => {
                      assignToMeFunction();
                    }}
                    px={"10"}
                  >
                    Assign to me
                  </Button>
                ) : Number(qcrstaus || 0) < 1 ? (
                  <Button
                    type="submit"
                    //w="full"
                    isLoading={updatQCRApiIsLoading}
                    isDisabled={pageView}
                    backgroundColor={"primary.700"}
                    _hover={{ backgroundColor: "primary.700" }}
                    color={"white"}
                    borderRadius={"full"}
                    // onClick={() => {
                    //   assignToMeFunction();
                    // }}
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

export default AddEditQualityControlReport;

const toasterAlert = (obj) => {
  let msg = obj?.message;
  let status = obj?.status;
  if (status === 400) {
    const errorData = obj.data;
    let errorMessage = "";

    Object.keys(errorData).forEach((key) => {
      const messages = errorData[key];
      messages?.forEach((message) => {
        errorMessage += `${key} : ${message} \n`;
      });
    });
    showToastByStatusCode(status, errorMessage);
    return false;
  }
  showToastByStatusCode(status, msg);
};
