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

const ReactCustomSelect = ({
  name,
  label,
  options,
  rules,
  errorMsgHide = true,
  selectedValue,
  isClearable,
  selectType,
  selectDisable,
  isMultipleSelect,
  style,
  handleOnChange,
  isLoading,
}) => {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();
  const [selectedVal, setSelectedVal] = useState(selectedValue);

  const error = errors[name];

  // React.useEffect(() => {
  //   const subscription = watch((value, { name, type }) =>
  //     console.log("watch", value, name, type)
  //   );
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  // console.log("selectedValue value: ", selectedValue);
  const handleSelectChange = (selectedOption) => {
    console.log("name --> ", name, selectedOption);
    console.log("handleSelectChange", selectedOption);
    setValue(name, selectedOption?.[selectType] || "");
    setSelectedVal(selectedOption);
    handleOnChange(selectedOption);
  };

  useEffect(() => {
    // setSelectedVal({});
    setSelectedVal(selectedValue);
    console.log("selectedValue --> ", selectedValue);
    console.log("tesing select cmp ");
    //  setValue(name, selectedValue?.[selectType] || "");
  }, [selectedValue]);

  return (
    <FormControl {...style} isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Box zIndex="10" maxWidth={isMultipleSelect ? "452" : ""}>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Select
              {...field}
              options={options || []}
              placeholder={label}
              isMulti={isMultipleSelect || false}
              isClearable={isClearable}
              // value={selectedVal} r
              isLoading={isLoading}
              value={selectedVal}
              onChange={handleSelectChange}
              isDisabled={selectDisable || false}
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: "#fff",
                  borderRadius: "6px",
                  borderColor: error ? "#e53e3e" : "#c3c3c3",
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
                  fontSize: "15px",
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
                  <Text color={"black"} isTruncated width={"60%"} textAlign={"left"}>
                    {label}
                  </Text>
                  {WH && (
                    <Text
                      fontSize={"0.8rem"}
                      color="black"
                      textAlign={"right"}
                      width={"20%"}
                      isTruncated
                    >
                      {`${WH || "00"} WH`}
                    </Text>
                  )}
                  {GD && (
                    <Text
                      fontSize={"0.8rem"}
                      color="black"
                      textAlign={"right"}
                      isTruncated
                      width={"20%"}
                    >
                      {`${GD || "00"} GD`}
                    </Text>
                  )}
                  {count && (
                    <Text
                      fontSize={"0.8rem"}
                      color="black"
                      isTruncated
                      textAlign={"right"}
                      width={"40%"}
                    >
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
      {errorMsgHide && (
        <FormErrorMessage>{error && error.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default ReactCustomSelect;
