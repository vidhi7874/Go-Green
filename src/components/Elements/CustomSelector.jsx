/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import Select from "react-select";
import { isDisabled } from "@testing-library/user-event/dist/utils";

const CustomSelector = ({
  name,
  label,
  options,
  rules,
  selectedValue,
  isClearable,
  selectType,
  style,
  isDisabled,
  // handleOnChange,
}) => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const [selectedVal, setSelectedVal] = useState(selectedValue);
  console.log("selectedValue ----> ", selectedValue);
  const error = errors[name];

  useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log("wahtch", value, name, type)
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  console.log("selectedValue value: ", selectedValue);
  const handleSelectChange = (selectedOption) => {
    console.log("handleSelectChange", selectedOption);
    console.log("selected type ", name, selectedOption?.[selectType]);
    setValue(name, selectedOption?.[selectType] || "");
    setSelectedVal(selectedOption);
    // handleOnChange(selectedOption);
  };

  useEffect(() => {
    if (selectedValue?.[selectType]) {
      console.log("selected type ", name, selectedValue?.[selectType]);
      setValue(name, selectedValue?.[selectType] || "");
      setSelectedVal(selectedValue);
    }

    console.log("errors -------> ", error);
  }, [selectedValue]);

  return (
    <FormControl {...style} isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Box>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Select
              {...field}
              options={options || []}
              placeholder={label}
              isClearable={isClearable}
              isDisabled={isDisabled}
              //   value={selectedVal}
              value={selectedVal}
              onChange={handleSelectChange}
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: "#F0F0F0",
                  minHeight: "30px", // Set the desired minimum height here
                  borderColor: error ? "crimson" : "#A6CE39",
                  "&:hover": {
                    borderColor: error ? "crimson" : "#A6CE39",
                  },
                  borderWidth: "2px",
                }),
                menu: (base) => ({
                  ...base,
                  // backgroundColor: "#A6CE39",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#A6CE39" : "white",
                  color: state.isFocused ? "green" : "black",
                  "&:hover": {
                    backgroundColor: "#C2DE8C",
                    color: "black",
                  },
                }),
              }}
              formatOptionLabel={({ label, count }) => (
                <Flex w={"100%"} justifyContent="space-between">
                  <Text color={"black"}>{label}</Text>
                  {count && (
                    <Text fontSize={"0.8rem"} color="black">
                      ({count})
                    </Text>
                  )}
                </Flex>
              )}
            />
          )}
          rules={rules}
        />
      </Box>
      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  );
};

export default CustomSelector;
