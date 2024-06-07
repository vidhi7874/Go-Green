/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import CustomFileInput from "../../components/Elements/CustomFileInput";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import {
  // useAddInspectionMasterMutation,
  useGetUserFreeMasterMutation,
  useGetAreaFreeMasterMutation,
} from "../../features/master-api-slice";
import { LeftIcon, RightIcon } from "../../components/Icons/Icons";
import { BiDownload } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import configuration from "../../config/configuration";
// import Webcam from "react-webcam";
// import { usePostFileUploadMutation } from "../../features/master-api-slice";

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

const InspectionInspectorRelatedDetails = React.memo(
  ({
    mainFormsMethod,
    inspection_inspector_related_details_form_schema,
    saveFunction,
  }) => {
    let { register, setValue, getValues, errors } = mainFormsMethod;

    // ! commented un used webcam variable ..
    // const webcamRef = useRef(null);

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
    //   // { isLoading: addInspectionMasterApiIsLoading }
    // ] = useAddInspectionMasterMutation();

    // ! commented un used saveAsDraft Function ...
    // const saveAsDraftFunction = async () => {
    //   const data = {
    //     id: getValues("id"),
    //     is_draft: true,
    //     [inspection_inspector_related_details_form_schema?.place_of_inspection]:
    //       getValues(
    //         inspection_inspector_related_details_form_schema?.place_of_inspection
    //       ),
    //     [inspection_inspector_related_details_form_schema?.inspection_date]:
    //       getValues(
    //         inspection_inspector_related_details_form_schema?.inspection_date
    //       ),
    //     [inspection_inspector_related_details_form_schema?.survey_official]:
    //       getValues(
    //         inspection_inspector_related_details_form_schema?.survey_official
    //       ),
    //     [inspection_inspector_related_details_form_schema?.wh_photos_path]:
    //       getValues(
    //         inspection_inspector_related_details_form_schema?.wh_photos_path
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

    const [selectBoxOptions, setSelectBoxOptions] = useState({});

    const [getUserMaster] = useGetUserFreeMasterMutation();

    const getUserList = async () => {
      try {
        const response = await getUserMaster().unwrap();
        console.log("getUserList:", response);
        if (response.status === 200) {
          setSelectBoxOptions((prev) => ({
            ...prev,
            users: response?.data?.map(({ employee_name, id, phone }) => ({
              label: employee_name,
              value: id,
              phone: phone,
            })),
          }));
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const [fetchAreaFree] = useGetAreaFreeMasterMutation();

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
      getUserList();
      getAreaList();
    }, []);

    const methods = useForm({
      resolver: yupResolver({}),
    });

    const { isOpen, onOpen, onClose } = useDisclosure();
    const finalRef = React.useRef(null);

    const [imageNumber, setImageNumber] = useState(0);

    const ImageDelete = () => {
      setValue(
        inspection_inspector_related_details_form_schema.wh_photos_path,
        getValues(
          inspection_inspector_related_details_form_schema.wh_photos_path
        ).filter((item2, index) => imageNumber !== index),
        { shouldValidate: true }
      );
    };

    // const [capturedImage, setCapturedImage] = useState(null);

    // const [fileUploadHandle, { isLoading: addBankMasterApiIsLoading }] =
    //   usePostFileUploadMutation();

    // const capture = async () => {
    //   try{
    //   const imageSrc = webcamRef?.current?.getScreenshot();
    //   console.log(imageSrc)
    //   if (imageSrc) {

    //     const blob = dataURLtoBlob(imageSrc);
    //     const blobUrl = URL.createObjectURL(blob);

    //     const formData = new FormData();

    //     formData.append("vaibhav_file_path", blob);
    //     const response = await fileUploadHandle(formData).unwrap();

    //     console.log(response, "file");

    //     if (response?.status === 200) {
    //       setValue(
    //         inspection_inspector_related_details_form_schema.wh_photos_path,
    //         [
    //           ...getValues(
    //             inspection_inspector_related_details_form_schema.wh_photos_path
    //           ),
    //           response?.data?.vaibhav_file_path || "",
    //         ],
    //         { shouldValidate: true }
    //       );
    //     }

    //     setCapturedImage(blobUrl);
    //   }}catch(error){

    //     let errorMessage =
    //       error?.data?.data || error?.data?.message || "Photo Catcher Failed";
    //     console.log("Error:", errorMessage);
    //     toasterAlert({
    //       message: JSON.stringify(errorMessage),
    //       status: 440,
    //     });
    //     console.error("Error:", error);
    //   }
    // };

    // // Helper function to convert Data URL to Blob
    // const dataURLtoBlob = (dataURL) => {
    //   const parts = dataURL.split(";base64,");
    //   const contentType = parts[0].split(":")[1];
    //   const byteString = atob(parts[1]);
    //   let arrayBuffer = new ArrayBuffer(byteString.length);
    //   let uint8Array = new Uint8Array(arrayBuffer);
    //   for (let i = 0; i < byteString.length; i++) {
    //     uint8Array[i] = byteString.charCodeAt(i);
    //   }
    //   return new Blob([arrayBuffer], { type: contentType });
    // };

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
          {/* -------------- place_of_inspection ------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  place_of_inspection -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Place of inspection{" "}
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
                    inspection_inspector_related_details_form_schema
                      .place_of_inspection
                  ]?.message
                }
              >
                <Box>
                  <Input
                    type="text"
                    {...register(
                      inspection_inspector_related_details_form_schema.place_of_inspection
                    )}
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    isDisabled={true}
                    value={
                      selectBoxOptions?.areas?.filter(
                        (item) =>
                          item.value ===
                          getValues(
                            inspection_inspector_related_details_form_schema.place_of_inspection
                          )
                      )[0]?.label || ""
                    }
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    //  isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Place of inspection"
                  />
                </Box>
              </FormControl>
            </GridItem>
          </Grid>

          {/* -------------- inspection_date ------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  inspection_date -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Date of inspection{" "}
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
                    inspection_inspector_related_details_form_schema
                      .inspection_date
                  ]?.message
                }
              >
                <Box>
                  <Input
                    type="date"
                    {...register(
                      inspection_inspector_related_details_form_schema.inspection_date
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
                    //  isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Date of inspection"
                  />
                </Box>
              </FormControl>
            </GridItem>
          </Grid>

          {/* -------------- survey_official ------------- */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  survey_official -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Name of Survey official{" "}
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
                    inspection_inspector_related_details_form_schema
                      .survey_official
                  ]?.message
                }
              >
                <Box>
                  <Input
                    type="text"
                    {...register(
                      inspection_inspector_related_details_form_schema.survey_official
                    )}
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    isDisabled={true}
                    value={
                      selectBoxOptions?.users?.filter(
                        (item) =>
                          item.value ===
                          getValues(
                            inspection_inspector_related_details_form_schema.survey_official
                          )
                      )[0]?.label || ""
                    }
                    //value={inputValue}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    //  isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Name of Survey official"
                  />
                </Box>
              </FormControl>
            </GridItem>
          </Grid>

          {/* -------------- wh_photos_path ------------- */}
          <Grid
            textAlign="right"
            alignItems="start"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  wh_photos_path -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Photographs of Warehouse
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

            {getValues("is_draftable") ? (
              <>
                <GridItem colSpan={{ base: 1 }} textAlign="left">
                  <Box>
                    <FormProvider {...methods}>
                      <CustomFileInput
                        name=""
                        InputDisabled={getValues("form_edit")}
                        value={""}
                        placeholder="Upload"
                        label=""
                        fileuplaod_folder_structure={{
                          type: "Warehouse",
                          subtype: "Inspection",
                        }}
                        onChange={(e) => {
                          setValue(
                            inspection_inspector_related_details_form_schema.wh_photos_path,
                            [
                              ...getValues(
                                inspection_inspector_related_details_form_schema.wh_photos_path
                              ),
                              e,
                            ],
                            { shouldValidate: true }
                          );
                        }}
                        showErr={errors?.wh_photos_path ? true : false}
                        type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                        defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                        maxSize={2}
                        style={{ w: "100%" }}
                      />
                    </FormProvider>
                  </Box>
                </GridItem>

                <GridItem colSpan={{ base: 1 }} textAlign="left">
                  {/* <Webcam audio={false} ref={webcamRef} />

        <Button
              _hover={{}}
              onClick={()=>{capture()}}
              color="white"
              bg="primary.700"
            >
              Capture
            </Button> */}
                </GridItem>
              </>
            ) : (
              <></>
            )}
          </Grid>

          <Box>
            {getValues(
              inspection_inspector_related_details_form_schema.wh_photos_path
            ) ? (
              <Box
                gap={5}
                overflow={"auto"}
                display={"flex"}
                justifyContent={"center"}
                ref={finalRef}
                onClick={onOpen}
                cursor={"pointer"}
              >
                {getValues(
                  inspection_inspector_related_details_form_schema.wh_photos_path
                ).map((item, index) => (
                  <Box key={index} mt="10px" flex={"none"}>
                    <img
                      src={`${configuration.BASE_URL}${item}`}
                      alt=""
                      style={{ height: "100px", width: "100px" }}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <></>
            )}
          </Box>

          <Modal
            finalFocusRef={finalRef}
            isOpen={isOpen}
            size="2xl"
            onClose={onClose}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Warehouse Photos</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  textAlign={"center"}
                >
                  <Box width={"50px"} fontSize={"25px"} cursor={"pointer"}>
                    <LeftIcon
                      onClick={() => {
                        if (imageNumber !== 0) {
                          setImageNumber(imageNumber - 1);
                        }
                      }}
                    />
                  </Box>
                  {getValues(
                    inspection_inspector_related_details_form_schema.wh_photos_path
                  ).map((item, index) => (
                    <Box key={index} flex={"none"}>
                      {index === imageNumber ? (
                        <img
                          src={`${configuration.BASE_URL}${item}`}
                          alt=""
                          style={{ height: "500px", width: "500px" }}
                        />
                      ) : (
                        <></>
                      )}
                    </Box>
                  ))}
                  <Box width={"50px"} fontSize={"25px"} cursor={"pointer"}>
                    <RightIcon
                      onClick={() => {
                        if (
                          imageNumber !==
                          (getValues(
                            inspection_inspector_related_details_form_schema.wh_photos_path
                          )?.length - 1 || 0)
                        ) {
                          setImageNumber(imageNumber + 1);
                        }
                      }}
                    />
                  </Box>
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
                <Button
                  variant="ghost"
                  colorScheme="red"
                  type="button"
                  onClick={() => {
                    ImageDelete();
                    // onClose();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* -------------- warehouse_related_document ------------- */}
          <Grid
            textAlign="right"
            alignItems="start"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            {/* --------------  warehouse_related_document -------------- */}
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Warehouse related Documents file{" "}
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

            <GridItem colSpan={{ base: 1 }} textAlign="left">
              <Box>
                <FormProvider {...methods}>
                  <CustomFileInput
                    name=""
                    InputDisabled={getValues("form_edit")}
                    value={""}
                    placeholder="Upload"
                    label=""
                    fileuplaod_folder_structure={{
                      type: "Warehouse",
                      subtype: "Inspection",
                    }}
                    onChange={(e) => {
                      setValue(
                        inspection_inspector_related_details_form_schema.warehouse_related_document,
                        [
                          ...getValues(
                            inspection_inspector_related_details_form_schema.warehouse_related_document
                          ),
                          e,
                        ],
                        { shouldValidate: true }
                      );
                    }}
                    showErr={errors?.warehouse_related_document ? true : false}
                    type="application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword "
                    defaultMsg="File must be less than 2 MB with pdf, docs ,jpg or png format."
                    maxSize={2}
                    style={{ w: "100%" }}
                  />
                </FormProvider>
              </Box>
            </GridItem>
          </Grid>

          <Grid
            textAlign="right"
            alignItems="start"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}></GridItem>

            <GridItem colSpan={{ base: 1 }} textAlign="left">
              {getValues(
                inspection_inspector_related_details_form_schema.warehouse_related_document
              )?.map((item, index) => (
                <Flex justifyContent={"space-between"} gap={5}>
                  <Box>{item?.split("/")[item?.split("/")?.length - 1]}</Box>
                  <Flex gap={2}>
                    <BiDownload
                      fontSize="26px"
                      cursor="pointer"
                      onClick={() => {
                        window.open(
                          `${configuration.BASE_URL}${item || ""}`,
                          "_blank"
                        );
                      }}
                    />{" "}
                    <AiOutlineDelete
                      cursor="pointer"
                      fontSize="26px"
                      onClick={() => {
                        if (getValues("form_edit")) {
                        } else {
                          setValue(
                            inspection_inspector_related_details_form_schema.warehouse_related_document,
                            getValues(
                              inspection_inspector_related_details_form_schema.warehouse_related_document
                            ).filter((item2, index2) => index !== index2),
                            { shouldValidate: true }
                          );
                        }
                      }}
                    />
                  </Flex>
                </Flex>
              ))}
            </GridItem>
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

export default InspectionInspectorRelatedDetails;
