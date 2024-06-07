import * as yup from "yup";
import {
  Box,
  FormControl,
  Grid,
  GridItem,
  Input,
  Text,
} from "@chakra-ui/react";
import { useGetStateFreeMasterMutation } from "../../features/master-api-slice";
import { useEffect, useState } from "react";
import { MotionSlideUp } from "../../utils/animation";
import CustomInput from "../../components/Elements/CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ReactSelect from "react-select";

const schema = yup.object().shape({
  default_state: yup.string().required("State is required "),
});

const Billing = ({
  mainFormsMethod,
  methods,
  stateOnChange,
  billing_schema,
}) => {
  // let { register, errors } = mainFormsMethod;
  // const commonStyle = {
  //     _placeholder: { color: "gray.300" },
  //     _hover: {
  //       borderColor: "primary.700",
  //       backgroundColor: "primary.200",
  //     },
  //     _focus: {
  //       borderColor: "primary.700",
  //       backgroundColor: "primary.200",
  //       boxShadow: "none",
  //     },
  //   };

  //   const templateColumns = {
  //     base: "repeat(1, 1fr)",
  //     md: "repeat(3, 2fr)",
  //     lg: "repeat(3, 1fr)",
  //   };

  console.log(methods);

  const commonWidth = {
    mt: 2,
    w: {
      base: "100%",
      sm: "80%",
      md: "60%",
      lg: "55%",
    },
    comm_details_style: {
      w: "90%",
    },
  };

  const reactSelectStyle = {
    menu: (base) => ({
      ...base,
      // backgroundColor: "#A6CE39",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#A6CE39" : "white",
      color: state.isFocused ? "green" : "black",
      textAlign: "left",
      "&:hover": {
        //  backgroundColor: "#C2DE8C",
        color: "black",
      },
    }),
  };
  //   const methods = useForm({
  //     resolver: yupResolver(billing_schema),
  //   });

  const {
    // register,
    getValues,
    errors,
  } = methods;

  console.log(getValues());

  const [allStates, setAllStates] = useState([]);
  const [fetchStateFree] = useGetStateFreeMasterMutation();
  const getStateList = async () => {
    try {
      const response = await fetchStateFree().unwrap();
      console.log("getStateList", response);

      if (response.status === 200) {
        console.log(response);
        let arr = response.data?.map((el) => ({
          label: el.state_name,
          value: el.id,
        }));
        console.log(arr);
        setAllStates(arr, "hiiii");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    getStateList();
  }, []);

  return (
    <Box>
      <Box>
        <Box
          w={{
            base: "100%",
            sm: "100%",
            md: "100%",
            lg: "100%",
            xl: "100%",
          }}
        >
          {/* State Dropdown*/}
          <Box>
            <Grid
              gap={4}
              templateColumns={"repeat(3, 1fr)"}
              alignItems="center"
            >
              <Text textAlign={"right"} my={1}>
                GGRN Default Billing State
              </Text>{" "}
              <Box>
                <FormControl style={{ w: commonWidth.w }}>
                  <ReactSelect
                    //   isDisabled={
                    //     isEditStateWiseDetails &&
                    //     (disabledField || InputDisableFunction())
                    //   }
                    //  {...register("default_state")}
                    value={allStates.find(
                      (option) =>
                        option.value === parseInt(getValues("default_state"))
                    )}
                    onChange={(selectedOption) => {
                      console.log(
                        "Selected option value:",
                        selectedOption?.value
                      );
                      console.log(selectedOption);
                      // setValue("default_state", selectedOption.value);

                      stateOnChange(selectedOption.value);
                    }}
                    options={allStates || []}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        backgroundColor: "#fff",
                        borderRadius: "6px",
                        borderColor: errors?.state ? "red" : "#c3c3c3",

                        padding: "1px",
                        textAlign: "left",
                      }),
                      ...reactSelectStyle,
                    }}
                  />
                  {errors.default_state && (
                    <Text fontSize="sm" color="red">
                      {errors.default_state.message}
                    </Text>
                  )}
                </FormControl>
              </Box>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default Billing;
