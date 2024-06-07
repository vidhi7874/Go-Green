import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  // List,
  Text,
  // useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AuthLayout from "./AuthLayout";
import { useForgotPasswordMutation } from "../../features/auth/loginApiSlice";
import { Link } from "react-router-dom";

const schema = yup.object().shape({
  email: yup.string().email("invalid email").required("Email is required"),
});

function ForgotPassword() {
  const [showMsg, setShowMsg] = useState({ msg: "" });
  // const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [forgotPassword, { isLoading: forgotPasswordApiIsLoading }] =
    useForgotPasswordMutation();

  const onSubmit = async (data) => {
    try {
      setShowMsg({
        msg: "",
      });
      console.log("credentials ", data);
      const res = await forgotPassword(data).unwrap();
      console.log("login api res ---> ", res);
      if (res.status === 200) {
        console.log("testing");
        // toast({
        //   title: "Success",
        //   description: res.message,
        //   status: "success",
        //   duration: 9000,
        //   isClosable: true,
        //   position: "top-right",
        // });
        setShowMsg({
          msg: res.message,
          status: 200,
        });
      }
    } catch (error) {
      console.log("error --> ", error);

      // toast({
      //   title: "Error",
      //   description: error.data.message,
      //   status: "error",
      //   duration: 9000,
      //   isClosable: true,
      //   position: "top-right",
      // });

      setShowMsg({
        msg: "This email is not registered",
        status: 400,
      });

      // ThrowErrors(error?.data?.message, error?.status);
    } finally {
      // setIsSubmitting(false); // Set submission state back to false after API call completes
    }
  };

  return (
    <>
      <AuthLayout>
        <Box>
          {showMsg.status === 200 ? (
            <>
              <Box border="1px" p="8" borderRadius={10} bg="primary.100">
                <Text
                  fontSize="2xl"
                  fontWeight="400"
                  mt="10px"
                  color="#667085"
                  textAlign="center"
                >
                  Check your email for a link to reset your password. If it
                  doesn’t appear within a few minutes, check your spam folder.
                </Text>
                <Link to="/login">
                  <Button
                    mt={4}
                    bg="primary.700"
                    borderRadius="46px"
                    p="6"
                    fontSize="20px"
                    color="white"
                    isLoading={forgotPasswordApiIsLoading}
                    type="submit"
                    width="100%"
                    _hover={{}}
                  >
                    Sign In
                  </Button>
                </Link>
              </Box>
            </>
          ) : (
            <>
              <Heading fontSize="40px" fontWeight="900" color="#344054">
                {" "}
                Forgot Password{" "}
              </Heading>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={errors.email} mt="31px">
                  <FormLabel
                    htmlFor="email"
                    fontSize="20px"
                    fontWeight="500"
                    color="#344054"
                  >
                    Enter your user account's verified email address and we will
                    send you a password reset link.
                  </FormLabel>
                  <Input
                    id="email"
                    mt="8px"
                    type="email"
                    p="6"
                    borderColor="gray.300"
                    borderRadius={6}
                    color="gray.500"
                    _placeholder={{ color: "gray.600" }}
                    placeholder="Enter your email address"
                    {...register("email")}
                  />
                  <FormErrorMessage>
                    {errors.email && errors.email.message}
                  </FormErrorMessage>
                </FormControl>

                <Box fontSize="sm" mb="2" textAlign="left">
                  <Text
                    mt="2"
                    color={showMsg.status === 200 ? "green" : "#e53e3e"}
                  >
                    {showMsg.msg}
                  </Text>
                </Box>
                <Button
                  mt={4}
                  bg="primary.700"
                  borderRadius="46px"
                  p="6"
                  fontSize="20px"
                  color="white"
                  isLoading={forgotPasswordApiIsLoading}
                  type="submit"
                  width="100%"
                  _hover={{}}
                >
                  Send password reset email
                </Button>
              </form>
            </>
          )}
        </Box>
      </AuthLayout>
    </>
  );
}

export default ForgotPassword;
