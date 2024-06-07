import React, { useRef, useState } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { AiOutlineCloudUpload, AiOutlineDownload } from "react-icons/ai";

import { usePostFileUploadMutation } from "../../features/master-api-slice";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import configuration from "../../config/configuration";

function CustomFileInput({
  name,
  placeholder,
  type = "application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword",
  label,
  style,
  onChange,
  value,
  InputDisabled,
  maxSize = 2, // 2 MB
  showErr,
  borderColor,
  title = "Click to download",
  isCustomControl,
  fileuplaod_folder_structure = {},
  defaultMsg = "",
}) {
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState(defaultMsg);
  const [showDefaultMessage, setShowDefaultMessage] = useState(true);

  const handleButtonClick = () => {
    if (!addBankMasterApiIsLoading) {
      fileInputRef.current.click();
    }
  };

  const [fileUploadHandle, { isLoading: addBankMasterApiIsLoading }] =
    usePostFileUploadMutation();

  const handleFileUpload = async (e) => {
    try {
      if (e?.target?.files[0]) {
        const maxSize = 2; // MB
        // let type =
        //   "application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword";
        const selectedFile = e.target.files[0];
        console.log("selectedFile:  >>>>", selectedFile);

        const allowedTypes = type?.split(",").map((el) => el.trim());
        console.log("allowedTypes: inside the fn >>", allowedTypes);

        // for the 2 mb
        if (selectedFile.size / (1024 * 1024 * 2) > maxSize) {
          // Handle file size exceeding maxSize
          setMessage("File size exceeds the allowed limit.");
          setMessage(`Allowed only ${maxSize} Mb file size `);
          setShowDefaultMessage(false);
          return;
        }

        if (!allowedTypes.includes(selectedFile.type)) {
          // Handle file type not alloweds
          setMessage("File type not allowed.");
          setShowDefaultMessage(false);

          return;
        }

        setShowDefaultMessage(true);
        setMessage(defaultMsg);

        if (selectedFile.size / (1024 * 1024 * 2) < maxSize) {
          setShowDefaultMessage(false);
          setMessage("");
        }

        const formData = new FormData();
        formData.append("file_path", selectedFile);
        formData.append("type", fileuplaod_folder_structure?.type);
        formData.append("subtype", fileuplaod_folder_structure?.subtype);
        //fileuplaod_folder_structure
        const response = await fileUploadHandle(formData).unwrap();

        console.log(response, "file");
        if (response?.status === 200) {
          // onChange(response?.data?.vaibhav_file_path || "");
          onChange(response?.data || "");
        }
      }
    } catch (error) {
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Photo Catcher Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
      console.error("Error:", error);
    }
  };

  const toasterAlert = (obj) => {
    let msg = obj?.message;
    let status = obj?.status;
    console.log("toasterAlert", obj);
    if (status === 400) {
      const errorData =
        obj?.data?.message ||
        obj?.data?.data ||
        obj?.data ||
        "Photo Catcher Failed";
      let errorMessage = "";

      Object.keys(errorData)?.forEach((key) => {
        const messages = errorData[key];
        console.log("messages --> ", messages);
        if (typeof messages === "object") {
          messages &&
            messages?.forEach((message) => {
              errorMessage += `${key} : ${message} \n`;
            });
        } else {
          showToastByStatusCode(status, msg);
        }
      });
      showToastByStatusCode(status, errorMessage);
      return false;
    } else if (status === 410) {
      showToastByStatusCode(status, msg);
    }
    showToastByStatusCode(status, msg);
  };

  const {
    control,
    formState: { errors },
  } = useFormContext();

  // console.log("errors", errors);
  const error = errors[name];
  // console.log("errorcheck==>", error);

  return (
    <FormControl {...style} isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Box>
        <Controller
          control={isCustomControl || control}
          name={name}
          render={({ field }) => (
            <Box {...field}>
              <Flex
                onClick={handleButtonClick}
                backgroundColor={"gray.200"}
                border={"1px solid"}
                borderColor={showErr ? "red" : "gray.10"}
                borderRadius={"lg"}
                _placeholder={{ color: "gray.300" }}
                _hover={{
                  borderColor: "primary.700",
                  backgroundColor: "primary.200",
                }}
                _focus={{
                  borderColor: "primary.700",
                  backgroundColor: "primary.200",
                  boxShadow: "none",
                }}
                p={{ base: "2" }}
                height={{ base: "40px" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                cursor={"pointer"}
                justifyContent="space-between"
                alignItems="center"
              >
                <Text width={"200px"} fontSize={value ? "x-small" : "inherit"}>
                  {addBankMasterApiIsLoading
                    ? "Loading ..."
                    : value
                    ? value?.split("media/docs/")[1]
                    : placeholder
                    ? placeholder
                    : "File Upload"}{" "}
                </Text>
                <Flex gap={2}>
                  <AiOutlineCloudUpload flex="none" fontSize={"20px"} />
                  {value && (
                    <Box>
                      <AiOutlineDownload
                        flex="none"
                        title={title}
                        fontSize={"20px"}
                        onClick={() => {
                          window.open(
                            `${configuration.BASE_URL}${value}`,
                            "_blank"
                          );
                        }}
                      />
                    </Box>
                  )}
                </Flex>
              </Flex>
              <Input
                // {...field}
                type="file"
                ref={fileInputRef}
                height={"15px"}
                display={"none"}
                accept={type}
                onChange={handleFileUpload}
                isDisabled={InputDisabled}
                // width={{ base: "90%" }}
                borderColor={showErr ? "red" : "gray.10"}
              />
            </Box>
          )}
        />
        {/* <Box as="small" color={!showDefaultMessage ? "red" : "green"}>
          {message}
        </Box> */}
        <Box as="small" color={!showDefaultMessage ? "red" : "green"}>
          {message}
        </Box>
      </Box>
      {/* <FormErrorMessage>{error && error.message}</FormErrorMessage> */}
    </FormControl>
  );
}

export default CustomFileInput;
