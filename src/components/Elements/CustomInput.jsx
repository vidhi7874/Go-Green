import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { numberToWords } from "../../services/common.service";

function CustomInput({
  name,
  placeholder,
  type,
  label,
  style,
  inputValue,
  height,
  InputDisabled,
  onChange,
  max,
  min,
  showNumberToWord,
  onBlur
}) {
  const {
    control,
    customData,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  const [state, setState] = useState({});

  const convertToWord = (num) => {
    const word = numberToWords(num);

    if (word.match(/Negative/i)) {
      return (
        <Text as="small" color="red.500">
          {word}
        </Text>
      );
    } else if (word.match(/out of range/i)) {
      setValue(name, "", { shouldValidate: false });
      return (
        <Text as="small" color="red.500">
          {word}
        </Text>
      );
    } else {
      return word;
    }
  };

  React.useEffect(() => {
    const subscription = watch((value, { name: fieldName, type }) => {
      if (showNumberToWord?.showOnly?.includes(fieldName)) {
        let word = convertToWord(parseFloat(value?.[fieldName]));

        if (typeof word === "string") {
          setState((prev) => ({
            ...prev,
            [fieldName]: word,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            [fieldName]: "out of range",
          }));
        }
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line
  }, [watch]);

  return (
    <FormControl shadow="none" {...style} isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Box>
        <Controller
          control={control}
          name={name}
          render={({ field }) =>
            onChange ? (
              <Input
                {...field}
                type={type}
                // width={{ base: "90%" }}
                // variant="error"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
                borderRadius={"lg"}
                value={inputValue}
                onChange={onChange}
                onBlur={onBlur}
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
                max={max}
                min={min}
                isDisabled={InputDisabled || false}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                placeholder={placeholder}
              />
            ) : (
              <Input
                {...field}
                type={type}
                // width={{ base: "90%" }}
                // variant="error"
                border="1px"
                borderColor="gray.10"
                backgroundColor={"white"}
                height={"15px "}
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
                max={max}
                min={min}
                p={{ base: "4" }}
                fontWeight={{ base: "normal" }}
                fontStyle={"normal"}
                isDisabled={InputDisabled || false}
                placeholder={placeholder}
              />
            )
          }
        />
      </Box>
      {type === "date" && customData?.[name]?.key === name && (
        <Text as="small" color="red">
          {customData?.[name]?.msg}
        </Text>
      )}

      {type === "number" && showNumberToWord?.isShow && (
        <Text
          as="small"
          color={state?.[name] === "out of range" ? "red" : "primary.700"}
        >
          {showNumberToWord?.showOnly?.includes(name) &&
            (state?.[name] || convertToWord(getValues(name)))}
        </Text>
      )}

      <FormErrorMessage>{error && error?.message}</FormErrorMessage>
    </FormControl>
  );
}

export default CustomInput;
