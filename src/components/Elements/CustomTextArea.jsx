import React from "react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

function CustomTextArea({
  name,
  placeholder,
  type,
  rowLength,
  label,
  style,
  InputDisable,
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  console.log("errors", errors);
  const error = errors[name];

  return (
    <FormControl {...style} isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Box>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            // <Textarea placeholder='Here is a sample placeholder' />
            <Textarea
              {...field}
              type={type}
              rows={rowLength || 3}
              backgroundColor={"white"}
              borderColor="#c3c3c3"
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
              px={{ base: "4" }}
              py={{ base: "5px" }}
              isDisabled={InputDisable || false}
              fontWeight={{ base: "normal" }}
              fontStyle={"normal"}
              placeholder={placeholder}
            />
          )}
        />
      </Box>
      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  );
}

export default CustomTextArea;
