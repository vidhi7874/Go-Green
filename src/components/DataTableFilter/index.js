import { CloseIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUpFilterFields,
  setUpFilterQuery,
} from "../../features/filter.slice";

import { FormProvider, useForm } from "react-hook-form";
import generateFormField from "../Elements/GenerateFormField";

const Index = () => {
  const dispatch = useDispatch();
  const { fields } = useSelector(
    (state) => state.dataTableFiltersReducer.filtersFields
  );
  const methods = useForm({
    // resolver: yupResolver(schema),
  });
  console.log("filterFields", fields);
  const closeFilter = () => {
    dispatch(setUpFilterFields({ isShow: false }));
    // dispatch(setUpFilterQuery(""));

    let filters = [];

    let filterString = filters.join("&");

    dispatch(setUpFilterQuery(filterString));
  };

  const { setValue } = methods;

  const onSubmit = (data) => {
    console.log("data==>", data);

    let filters = [];
    for (let key in data) {
      if (data[key]) {
        let value = data[key];
        if (typeof value === "string") {
          value = value.trim();
        }
        filters.push(`filter=${key}&${key}=${value}`);
      }
    }
    let filterString = filters.join("&");

    dispatch(setUpFilterQuery(filterString));

    console.log("filterString", filterString);
  };
  // for clear data in form
  const clearForm = () => {
    const defaultValues = methods.getValues();
    console.log("defaulvalues===>", defaultValues);
    Object.keys(defaultValues).forEach((key) => {
      setValue(key, "", {
        shouldValidate: true,
      });
    });
    dispatch(setUpFilterQuery([]));
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems={"center"} py="2">
        <Text fontWeight={"bold"}>Filters</Text>
        <Box>
          <Button onClick={() => closeFilter()} p="1">
            <CloseIcon rotate={120} boxSize={3} />
          </Button>
        </Box>
      </Flex>
      {console.log(methods.getValues(), "here")}
      <Box py="4">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {fields &&
              fields.map((item) =>
                generateFormField({
                  ...item,
                  selectType: "value",
                  style: {
                    mb: 1,
                    mx: 1,
                    width: "90%",
                    height: "70px",
                  },
                  height: "20px",
                })
              )}

            <Button
              type="submit"
              w="90%"
              backgroundColor={"primary.700"}
              _hover={{ backgroundColor: "primary.700" }}
              color={"white"}
              borderRadius={"full"}
              my={"2"}
              px={"10"}
            >
              Filter
            </Button>
            <Button
              type="button"
              backgroundColor={"white"}
              borderWidth={"1px"}
              w="90%"
              borderColor={"#F82F2F"}
              _hover={""}
              color={"#F82F2F"}
              borderRadius={"full"}
              my={"1"}
              px={"10"}
              onClick={clearForm}
            >
              Clear
            </Button>
          </form>
        </FormProvider>
      </Box>
    </Box>
  );
};

export default Index;
