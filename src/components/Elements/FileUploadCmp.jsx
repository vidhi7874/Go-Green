import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import {
  AiOutlineCloudUpload,
  // AiOutlineCloudDownload,
  // AiOutlineDownload,
} from "react-icons/ai";
import { usePostFileUploadMutation } from "../../features/master-api-slice";
import { useFormContext } from "react-hook-form";
import DownloadFilesFromUrl from "../DownloadFileFromUrl";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";

const FileUploadCmp = ({
  label,
  name,
  type,
  isError,
  isDisabled = false,
  isRequired = true,
  placeholder,
  showDownloadIcon = false,
  allowedTypes,
  fileName = null,
  isMultipalUpload,
  clearFileName = false,
  onChange,
  value,
  uploadFile_FolderStructures = {},
  maxFileSize = 2, // Add a prop for maximum file size in bytes.
  fileuplaod_folder_structure = {},
  defaultMsg,
}) => {
  const {
    // control,
    register,
    getValues,
    // eslint-disable-next-line
    formState: { errors },
  } = useFormContext();

  // console.log(uploadFile_FolderStructures);

  // console.log("FileUploadCmp --getValues --->", getValues());
  // console.log("FileUploadCmp --value  --->", value);

  // console.log("file upload input errr ->", name, errors[name]);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState(defaultMsg);
  const [showDefaultMessage, setShowDefaultMessage] = useState(true);
  // eslint-disable-next-line
  const [filepath, setFilePath] = useState("");

  const [fileUploadHandle, { isLoading: addBankMasterApiIsLoading }] =
    usePostFileUploadMutation();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);

    // if (event.target.files) {
    //   const maxSize = 2; // MB
    //   // let type =
    //   //   "application/pdf  ,image/jpg, image/png, image/jpeg ,application/msword";
    //   const selectedFile = event.target.files[0];
    //   console.log("selectedFile:  >>>>", selectedFile);

    //   const allowedTypes = type?.split(",").map((el) => el.trim());
    //   console.log("allowedTypes: inside the fn >>", allowedTypes);

    //   // for the 2 mb
    //   if (selectedFile.size / (1024 * 1024 * 2) > maxSize) {
    //     // Handle file size exceeding maxSize
    //     setMessage("File size exceeds the allowed limit.");
    // setMessage(`Allowed only ${maxSize} Mb file size `);
    // setShowDefaultMessage(false);
    //     return;
    //   }

    //   if (!allowedTypes.includes(selectedFile.type)) {
    //     // Handle file type not alloweds
    // setMessage("File type not allowed.");
    // setShowDefaultMessage(false);

    //     return;
    //   }

    //   setShowDefaultMessage(true);
    //   setMessage(defaultMsg);

    //   if (selectedFile.size / selectedFiles(1024 * 1024 * 2) < maxSize) {
    // setShowDefaultMessage(false);
    // setMessage("");
    //   }
    // }
    const isNotValidFiles = selectedFiles.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (isNotValidFiles?.length > 0) {
      const allowedExtensions = allowedTypes
        .map((type) => type.split("/")[1])
        .join(", ");

      const errorMessage = `Oops! It looks like you're trying to upload an unsupported file. Please choose a file with one of the following extensions: ${allowedExtensions}.`;
      setMessage("File type not allowed.");
      setShowDefaultMessage(false);
      showToastByStatusCode(400, errorMessage);
      return false;
    }

    const validFiles = selectedFiles.filter((file) =>
      allowedTypes.includes(file.type)
    );

    if (validFiles) {
      setShowDefaultMessage(false);
      setMessage("");
    }

    // console.log("validFiles", validFiles?.[0]?.name);

    const oversizedFiles = validFiles.filter((file) => file.size > maxFileSize);

    if (oversizedFiles.length > 0) {
      // Handle oversized files
      // console.error("Oversized files:", oversizedFiles);
      showToastByStatusCode(
        400,
        `File size is too large. Please upload a file with a maximum size of ${
          (maxFileSize / 1024 / 1024) * 2
        } MB`
      );
      setMessage(
        `Allowed only ${(maxFileSize / 1024 / 1024) * 2} Mb file size `
      );
      setShowDefaultMessage(false);
      return;
    }

    if (isMultipalUpload) {
      // For multiple file upload
      setFiles(validFiles);
      //  onChange(validFiles);
    } else {
      // For single file upload
      if (validFiles.length > 0) {
        setFiles(validFiles);
        const selectedFile = validFiles[0];
        const formData = new FormData();
        // formData.append("vaibhav_file_path", selectedFile);

        formData.append("file_path", selectedFile);
        formData.append("type", fileuplaod_folder_structure?.type);
        formData.append("subtype", fileuplaod_folder_structure?.subtype);

        try {
          const response = await fileUploadHandle(formData).unwrap();
          console.log(response);
          if (response?.status === 200) {
            // setFilePath(response?.data?.vaibhav_file_path);
            // onChange(response?.data?.vaibhav_file_path || "");

            setFilePath(response?.data);
            onChange(response?.data || "");
          }
        } catch (error) {
          // Handle the error here
          console.error("File upload error:", error);
        }
      }
    }
  };

  useEffect(() => {
    setFiles([]);
    // eslint-disable-next-line
  }, [clearFileName]);

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Box mt={"-7px"}>
        <Flex
          backgroundColor={"gray.200"}
          border={"1px solid"}
          borderColor={isError ? "red" : "#c3c3c3"}
          borderRadius={"lg"}
          _hover={{
            borderColor: "primary.700",
            backgroundColor: "primary.200",
          }}
          p={{ base: "1" }}
          height={"33px"}
          // minHeight={{ base: "40px" }}
          fontWeight={{ base: "normal" }}
          fontStyle={"normal"}
          cursor={"pointer"}
          justifyContent="space-between"
          alignItems="center"
        >
          {isMultipalUpload && files.length > 0 ? (
            <Box>
              {files.map((file, index) => (
                <Text
                  key={index}
                  textAlign="left"
                  //   width={"250px"}
                  fontSize="x-small"
                >
                  {file.name}
                </Text>
              ))}
            </Box>
          ) : (
            <Text noOfLines={1} textAlign="left" fontSize="sm">
              {files.length > 0
                ? files[0].name || fileName
                : value || fileName || placeholder || "File Upload"}
            </Text>
          )}

          <Flex gap={2}>
            {addBankMasterApiIsLoading ? (
              <Spinner
                thickness="2px"
                speed="0.5s"
                emptyColor="gray.800"
                color="primary.700"
                size="sm"
              />
            ) : (
              <AiOutlineCloudUpload
                onClick={handleButtonClick}
                title="upload file"
                flex="none"
                fontSize={"20px"}
              />
            )}
            {(files.length > 0 || value) &&
              showDownloadIcon &&
              !addBankMasterApiIsLoading && (
                <Box>
                  <DownloadFilesFromUrl
                    details={{
                      paths: [getValues(name)],
                      fileName: fileName || "file_download",
                    }}
                    iconFontSize="20px"
                  />
                </Box>
              )}
          </Flex>
        </Flex>
        <Input
          type="file"
          isDisabled={isDisabled}
          name={name}
          {...register(name, {
            required: isRequired,
          })}
          ref={fileInputRef}
          height={"15px"}
          display={"none"}
          accept={allowedTypes.join(",")}
          multiple={isMultipalUpload}
          onChange={handleFileUpload}
        />
        <Box as="small" color={!showDefaultMessage ? "red" : "green"}>
          {message}
        </Box>
      </Box>
    </FormControl>
  );
};

export default FileUploadCmp;
