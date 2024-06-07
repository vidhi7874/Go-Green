/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MotionSlideUp } from "../../utils/animation";
import ReactCustomSelect from "../../components/Elements/CommonFielsElement/ReactCustomSelect";

import Pwh from "./Pwh.jsx";
import Wms from "./Wms";
import ThirdParty from "./ThirdParty";
import { useLocation } from "react-router-dom";
import {
  useGetWarehouseFreeTypeMutation,
  useGetWarehouseProposalDetailsMutation,
  useGetWarehouseSubFreeTypeMutation,
} from "../../features/warehouse-proposal.slice";
import WmsRent from "./WmsRent";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice.js";

const WarehouseProposal = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const details = location?.state?.details;

  const methods = useForm({});

  const [options, setOptions] = useState({
    warehouseType: [],
    subType: [],
  });

  // Warehouse Type Api Start

  const [getWarehouseType, { isLoading: getWarehouseTypeApiIsLoading }] =
    useGetWarehouseFreeTypeMutation();

  const fetchWarehouseType = async () => {
    try {
      const response = await getWarehouseType().unwrap();
      console.log("fetchWarehouseType:", response);
      if (response?.status === 200) {
        setOptions((prev) => ({
          ...prev,
          warehouseType: response?.results
            ?.filter((item) => item.is_active)
            ?.map((item) => ({
              label: item.warehouse_type_name,
              value: item.id,
            })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Warehouse Type Api End

  // Warehouse SubType Api Start

  const [getWarehouseSubType, { isLoading: getWarehouseSubTypeApiIsLoading }] =
    useGetWarehouseSubFreeTypeMutation();

  const fetchWetWarehouseSubType = async () => {
    try {
      const response = await getWarehouseSubType().unwrap();
      console.log("Success:", response);
      if (response.status === 200) {
        setOptions((prev) => ({
          ...prev,
          subType: response?.results
            ?.filter((item) => item.is_active)
            ?.map((item) => ({
              label: item.warehouse_subtype,
              value: item.id,
              type: item?.warehouse_type?.id || 0,
            })),
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Warehouse SubType Api End

  // Warehouse Details Start

  const [getWarehouseProposalDetails] =
    useGetWarehouseProposalDetailsMutation();

  const fetchWarehouseProposalDetails = async (id) => {
    try {
      const response = await getWarehouseProposalDetails(id).unwrap();
      console.log("Success:", response);
      if (response?.status === 200) {
        console.log("response?.data --> ", response?.data);
        // FillFormData(response?.data || {});
        // setFilledData(response?.data || {});
        setHiringProposal({
          type: response?.data?.warehouse_type?.id || 0,
          subType: response?.data?.warehouse_subtype?.id || 0,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Warehouse Details End

  const [hiringProposal, setHiringProposal] = useState({
    type: null,
    subType: null,
  });

  useEffect(() => {
    if (details) {
      setHiringProposal({
        type: details?.warehouse_type || 0,
             subType: details?.warehouse_subtype || 0,   
      });
    }
    console.log(details, "details");
  }, [details]);

  useEffect(() => {
    fetchWarehouseType();
    fetchWetWarehouseSubType();
    if (Number(window?.location?.pathname?.split("/")[2] || 0) > 0) {
      console.log(window.location.pathname);
      fetchWarehouseProposalDetails(window?.location?.pathname?.split("/")[2]);
    }

    // set breadcrumbArray
    const breadcrumbArray = [
      // {
      //   title: "Hiring Proposal Master",
      //   link: "/hiring-proposal-master",
      // },
      {
        title: "Warehouse Proposal",
        link: "/hiring-proposal-master",
      },
      // {
      //   title: details?.id ? "Edit" : "Add",
      // },
    ];
    dispatch(setBreadCrumb(breadcrumbArray));
  }, []);

  //remove data of breadcrumb from redux
  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
  }, []);

  return (
    <Box bg="gray.50" p="5">
      <Box>
        <Heading as="h2" size="lg">
          Hiring Proposal
        </Heading>
      </Box>
      <FormProvider {...methods}>
        {/* <form onSubmit={methods.handleSubmit(onSubmit)}> */}
        <Box
          bg="white"
          p="5"
          borderRadius={10}
          mt="4"
          display={{ base: "column", md: "flex" }}
        >
          <Box w="full" p="3">
            <MotionSlideUp duration={0.2 * 0.5} delay={0.1 * 0.5}>
              <ReactCustomSelect
                name="Select-warehouse-Type"
                label="Select warehouse Type"
                options={options?.warehouseType || []}
                selectedValue={
                  options?.warehouseType?.filter(
                    (item) => item.value === hiringProposal.type
                  )[0] || {}
                }
                isClearable={false}
                selectType="label"
                selectDisable={
                  details?.id ||
                  Number(window?.location?.pathname?.split("/")[2] || 0) > 0
                    ? true
                    : false
                }
                isLoading={getWarehouseTypeApiIsLoading}
                handleOnChange={(val) => {
                  console.log("selectedOption @@@@@@@@@@@------> ", val);
                  setHiringProposal((old) => ({
                    type: val.value,
                    subType: null,
                  }));
                }}
              />
            </MotionSlideUp>
          </Box>

          <Box w="full" p="3">
            <MotionSlideUp duration={0.2 * 1} delay={0.1 * 1}>
              <ReactCustomSelect
                name="Select-warehouse-sub-Type"
                label="Select warehouse Sub Type"
                options={
                  options?.subType?.filter(
                    (item) => item.type === hiringProposal.type
                  ) || []
                }
                selectDisable={
                  details?.id ||
                  Number(window?.location?.pathname?.split("/")[2] || 0) > 0
                    ? true
                    : false
                }
                selectedValue={
                  options?.subType?.filter(
                    (item) => item.value === hiringProposal.subType
                  )[0] || {}
                }
                isClearable={false}
                selectType="label"
                isLoading={getWarehouseSubTypeApiIsLoading}
                handleOnChange={(val) => {
                  console.log("selectedOption @@@@@@@@@@@------> ", val);
                  setHiringProposal((old) => ({ ...old, subType: val.value }));
                }}
              />
            </MotionSlideUp>
          </Box>
        </Box>
        <Box mt="2">
          {options?.warehouseType?.filter(
            (item) => item.value === hiringProposal.type
          )[0]?.label === "PWH" &&
          options?.subType?.filter(
            (item) => item.value === hiringProposal.subType
          )[0]?.label?.length > 0 ? (
            <Pwh
              id={
                details?.id
                  ? details?.id
                  : Number(window?.location?.pathname?.split("/")[2] || 0) > 0
                  ? Number(window?.location?.pathname?.split("/")[2] || 0)
                  : 0
              }
              view={details?.view || false}
              subType={
                options?.subType?.filter(
                  (item) => item.value === hiringProposal.subType
                )[0] || {}
              }
              type={hiringProposal?.type}
            />
          ) : options?.warehouseType?.filter(
              (item) => item.value === hiringProposal.type
            )[0]?.label === "WMS" &&
            options?.subType?.filter(
              (item) => item.value === hiringProposal.subType
            )[0]?.label?.length > 0 ? (
            <Wms
              view={details?.view || false}
              id={
                details?.id
                  ? details?.id
                  : Number(window?.location?.pathname?.split("/")[2] || 0) > 0
                  ? Number(window?.location?.pathname?.split("/")[2] || 0)
                  : 0
              }
              subType={
                options?.subType?.filter(
                  (item) => item.value === hiringProposal.subType
                )[0] || {}
              }
              type={hiringProposal?.type}
            />
          ) : options?.warehouseType?.filter(
              (item) => item.value === hiringProposal.type
            )[0]?.label === "Third Party" &&
            options?.subType?.filter(
              (item) => item.value === hiringProposal.subType
            )[0]?.label?.length > 0 ? (
            <ThirdParty
              view={details?.view || false}
              id={
                details?.id
                  ? details?.id
                  : Number(window?.location?.pathname?.split("/")[2] || 0) > 0
                  ? Number(window?.location?.pathname?.split("/")[2] || 0)
                  : 0
              }
              subType={
                options?.subType?.filter(
                  (item) => item.value === hiringProposal.subType
                )[0] || {}
              }
              type={hiringProposal?.type}
            />
          ) : options?.warehouseType?.filter(
              (item) => item.value === hiringProposal.type
            )[0]?.label === "WMS + RENT" &&
            options?.subType?.filter(
              (item) => item.value === hiringProposal.subType
            )[0]?.label?.length > 0 ? (
            <WmsRent
              view={details?.view || false}
              id={
                details?.id
                  ? details?.id
                  : Number(window?.location?.pathname?.split("/")[2] || 0) > 0
                  ? Number(window?.location?.pathname?.split("/")[2] || 0)
                  : 0
              }
              subType={
                options?.subType?.filter(
                  (item) => item.value === hiringProposal.subType
                )[0] || {}
              }
              type={hiringProposal?.type}
            />
          ) : (
            <></>
          )}
        </Box>

        {/* </form> */}
      </FormProvider>
    </Box>
  );
};

export default WarehouseProposal;
