import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  InputRightElement,
  InputGroup,
  Heading,
  UnorderedList,
  ListItem,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import AuthLayout from "./AuthLayout";
import { useChangePasswordMutation } from "../../features/auth/loginApiSlice";
import { useLocation, useNavigate } from "react-router-dom";
import ROUTE_PATH from "../../constants/ROUTE";

const schema = yup.object().shape({
  newpassword: yup
    .string()
    .trim()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    // .max(10, "password should be 10 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?]).*$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
  confirmpassword: yup
    .string()
    .trim()
    .required("Confirm Password is required")
    .oneOf([yup.ref("newpassword")], "Passwords must match"),
});

const ChangePassword = () => {
  // ! commented unused location variable ...
  // const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [showMsg, setShowMsg] = useState({ msg: "", status: "" });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // console.log("location ==>: ", location.search);

  const search = useLocation().search;

  const id = new URLSearchParams(search).get("id");
  const token = new URLSearchParams(search).get("token");

  console.log("id token ", id, token);

  const [
    changePassword,
    { error: changePasswordApiErr, isLoading: changePasswordApiIsLoading },
  ] = useChangePasswordMutation();

  const onSubmit = async (data) => {
    console.log(data); // Handle form submission here
    let obj = {
      newpassword: data.newpassword,
      confirmpassword: data.confirmpassword,
      id,
      token,
    };

    try {
      const res = await changePassword(obj).unwrap();
      // console.log("change password api res ---> ", res);
      if (res.status === 200) {
        toast({
          title: "Success",
          description: res.message,
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  useEffect(() => {
    // console.log("changePasswordApiErr ===> ", changePasswordApiErr);
    const err = changePasswordApiErr?.data?.Error?.[0];
    setShowMsg({
      msg: err,
      status: 400,
    });
    // eslint-disable-next-line
  }, [changePasswordApiErr]);
  // console.log("erors --> ", errors);

  useEffect(() => {
    if (!id && !token) {
      navigate(`${ROUTE_PATH.LOGIN}`);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <AuthLayout>
      <Box>
        <Heading
          fontSize="4xl"
          fontWeight="bold"
          w="full"
          mb={4}
          textColor={"gray.500"}
        >
          Change Password
        </Heading>
        {/* <Text my="6" textColor={"gray.400"}>
          Enter your user account's verified email address and we will send you
          a password reset link.
        </Text> */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb={4} isInvalid={errors.newpassword}>
            <FormLabel textColor={"gray.500"}>New Password</FormLabel>
            <InputGroup>
              <Controller
                control={control}
                name="newpassword"
                render={({ field }) => (
                  <Input
                    p="6"
                    type={showNewPassword ? "text" : "password"}
                    {...field}
                  />
                )}
              />
              <InputRightElement>
                <IconButton
                  icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={toggleNewPasswordVisibility}
                  variant="ghost"
                  size="sm"
                  mt={2}
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                />
              </InputRightElement>
            </InputGroup>

            {errors.newpassword && (
              <Text color="red">{errors.newpassword.message}</Text>
            )}
          </FormControl>
          <FormControl my={4} isInvalid={errors.confirmpassword}>
            <FormLabel textColor={"gray.500"}>Confirm Password</FormLabel>
            <InputGroup>
              <Controller
                control={control}
                name="confirmpassword"
                render={({ field }) => (
                  <Input
                    p="6"
                    type={showConfirmPassword ? "text" : "password"}
                    {...field}
                  />
                )}
              />
              <InputRightElement>
                <IconButton
                  icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={toggleConfirmPasswordVisibility}
                  variant="ghost"
                  size="sm"
                  mt={2}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                />
              </InputRightElement>
            </InputGroup>
            {errors.confirmpassword && (
              <Text color="red">{errors.confirmpassword.message}</Text>
            )}
          </FormControl>

          <Box fontSize="sm" mb="2" textAlign="left" px="2">
            <Text mt="1" color={showMsg.status === 200 ? "green" : "# e53e3e"}>
              {showMsg.msg}
            </Text>
          </Box>

          <Button
            _hover={""}
            bgColor={"primary.700"}
            borderRadius={"2xl"}
            py={2}
            color={"white"}
            w={"100%"}
            type="submit"
            mb={4}
            isLoading={changePasswordApiIsLoading}
          >
            Change password
          </Button>
        </form>
        <Box>
          <UnorderedList textColor={"gray.400"}>
            <ListItem>
              The password length should be at least 8 characters.
            </ListItem>
            {/* <ListItem>
              The password length should be Max 10 characters.
            </ListItem> */}
            <ListItem>
              The password should contain at least one uppercase letter.
            </ListItem>
            <ListItem>
              The password should contain at least one lowercase letter.
            </ListItem>
            <ListItem>The password should contain at least one digit.</ListItem>
            <ListItem>
              The password should contain at least one special character.
            </ListItem>
          </UnorderedList>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default ChangePassword;
