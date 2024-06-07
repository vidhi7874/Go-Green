import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Switch,
} from "@chakra-ui/react";

const CustomSwitch = ({ name, label, isDisabled = false, isChecked }) => {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();
  const [selectedVal, setSelectedVal] = useState(isChecked);

  const error = errors[name];

  useEffect(() => {
    setSelectedVal(isChecked);
  }, [isChecked]);

  const handleActiveDeActive = (e) => {
    setValue(name, e.target.checked);
    setSelectedVal(e.target.checked);
  };

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Box>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Switch
              {...field}
              isDisabled={isDisabled}
              size="md"
              colorScheme="whatsapp"
              onChange={(e) => handleActiveDeActive(e)}
              isChecked={selectedVal}
            />
          )}
          // rules={rules}
        />
      </Box>
      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  );
};

export default CustomSwitch;
