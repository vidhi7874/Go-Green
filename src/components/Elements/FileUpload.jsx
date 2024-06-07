import React, { useRef } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { AiOutlineCloudDownload, AiOutlineCloudUpload } from "react-icons/ai";
import { usePostFileUploadMutation } from "../../features/master-api-slice";
import configuration from "../../config/configuration";

function FileUpload({
  name,
  label,
  value,
  placeholder = "File Upload",
  isCustomControl = false,
  onChange,
  InputDisabled = false,
  showErr = false,
  ...styleProps // Additional style properties
}) {
  const fileInputRef = useRef(null);
  const { control } = useFormContext();
  const [fileUploadHandle, { isLoading: addBankMasterApiIsLoading }] =
    usePostFileUploadMutation();

  const handleButtonClick = () => {
    if (!addBankMasterApiIsLoading) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (e) => {
    if (e?.target?.files[0]) {
      const selectedFile = e.target.files[0];
      const formData = new FormData();
      formData.append(name, selectedFile); // Use 'name' as the form field name
      const response = await fileUploadHandle(formData).unwrap();

      console.log(response, "file");
      if (response?.status === 200) {
        onChange(response?.data[name] || ""); // Use 'name' as the key to access the file path
      }
    }
  };

  return (
    <FormControl {...styleProps}>
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
                {console.log(value, "here")}
                <Text width={"250px"} fontSize={value ? "x-small" : "inherit"}>
                  {addBankMasterApiIsLoading
                    ? "Loading ..."
                    : value
                    ? value?.split("media/docs/")[1]
                    : placeholder}
                </Text>
                <Flex gap={2}>
                  <AiOutlineCloudUpload flex="none" fontSize={"20px"} />
                  {value && (
                    <Box>
                      <AiOutlineCloudDownload
                        flex="none"
                        fontSize={"20px"}
                        onClick={() =>
                          (window.location.href = `${configuration.BASE_URL}${value}`)
                        }
                      />
                    </Box>
                  )}
                </Flex>
              </Flex>
              <Input
                type="file"
                ref={fileInputRef}
                height={"15px"}
                display={"none"}
                accept={styleProps.accept} // Pass accept prop from styleProps
                onChange={handleFileUpload}
                isDisabled={InputDisabled}
              />
            </Box>
          )}
        />
      </Box>
    </FormControl>
  );
}

export default FileUpload;
