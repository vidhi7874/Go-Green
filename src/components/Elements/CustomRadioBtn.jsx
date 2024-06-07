import React from "react";
import { Box, Radio, RadioGroup, Stack } from "@chakra-ui/react";

const CustomRadioBtn = () => {
  return (
    <Box>
      <RadioGroup defaultValue="1">
        <Stack spacing={4} direction="row">
          <Radio value="1" isDisabled>
            Radio 1
          </Radio>
          <Radio value="2">Radio 2</Radio>
          <Radio value="3">Radio 3</Radio>
        </Stack>
      </RadioGroup>
    </Box>
  );
};

export default CustomRadioBtn;
