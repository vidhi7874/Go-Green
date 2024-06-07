import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  Image,
  Input,
  Text,
  FormErrorMessage,
  InputRightElement,
  InputGroup,
  // useToast,
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Auth_Pages_IMG from "../../assets/Images/Authentication_Pages_IMG.svg";
import logoImg from "../../components/Icons/logo.svg";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { yupResolver } from "@hookform/resolvers/yup";
import { RiErrorWarningFill } from "react-icons/ri";
import * as yup from "yup";
import { useLoginMutation } from "../../features/auth/loginApiSlice";
import { localStorageService } from "../../services/localStorge.service";
import { Link } from "react-router-dom";

import { AES, enc } from "crypto-js";
import ROUTE_PATH from "../../constants/ROUTE";

// import AccessWebcamWithLocation from "../../components/AccessWebcamWithLocation/AccessWebcamWithLocation";

const schema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Invalid email address"),
  password: yup.string().trim().required("Password is required"),
});

function Login() {
  // const toast = useToast();
  const [errorMsg, setErrorMsg] = useState({ msg: "" });
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [login, { isLoading: loginApiIsLoading }] = useLoginMutation();
  const [rememberMe, setRememberMe] = useState(false);
  // eslint-disable-next-line
  const [encryptedPassword, setEncryptedPassword] = useState("");

  const encryptPassword = (password) => {
    const encrypted = AES.encrypt(password, "secret-key").toString();
    return encrypted;
  };

  const decryptPassword = (encryptedPassword) => {
    try {
      if (!encryptedPassword) {
        return null; // Return null if the encrypted password is empty
      }
      const decrypted = AES.decrypt(encryptedPassword, "secret-key").toString(
        enc.Utf8
      );
      return decrypted;
    } catch (error) {
      console.error("Error decrypting password:", error);
      return null;
    }
  };

  const onSubmit = (data) => {
    console.log(data); // Handle form submission
    const encryptedPassword = encryptPassword(data.password);
    // setEncryptedPassword(encryptedPassword);
    console.log("encryptedPassword", encryptedPassword);
    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("email", data.email);
      localStorage.setItem("password", encryptedPassword);
    } else {
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    }

    onLogin({ ...data, fcm_token: "test", rememberMe });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const onLogin = async (credentials) => {
    try {
      const storedEncryptedPassword = localStorage.getItem("password");
      // ! removed the un used variable declaration
      decryptPassword(storedEncryptedPassword);

      setErrorMsg({
        msg: "",
      });

      const res = await login(credentials).unwrap();
      // && res.data.is_superuser
      if (res.status === 200) {
        localStorageService.set("GG_ADMIN", { userDetails: res.data });

        // if (rememberMe) {
        //   localStorage.setItem("rememberMe", "true");
        //   localStorage.setItem("email", credentials.email);
        //   localStorage.setItem("password", encryptedPassword);
        // } else {
        //   localStorage.removeItem("rememberMe");
        //   localStorage.removeItem("email");
        //   localStorage.removeItem("password");
        // }
        window.location.href = `/${ROUTE_PATH.DASHBOARD}`;
      } else {
        // setErrorMsg({
        //   msg: "This account is not a superuser",
        // });
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

      setErrorMsg({
        msg: error.data?.message,
      });

      // ThrowErrors(error?.data?.message, error?.status);
    } finally {
      // setIsSubmitting(false); // Set submission state back to false after API call completes fs df
    }
  };

  // ! commented the unused state variable ..
  // const [isFocused, setIsFocused] = useState(false);
  // const [inputValue, setInputValue] = useState("");

  // ! commented the unused function ...
  // const handleFocus = () => {
  //   setIsFocused(true);
  // };

  // ! commented the unused function
  // const handleBlur = () => {
  //   setIsFocused(false);
  // };

  // ! commented the unused function ..
  // const handleChange = (event) => {
  //   setInputValue(event.target.value);
  // };

  return (
    <>
      <Box
        display={{ base: "column", md: "flex" }}
        justifyContent={{ base: "space-between" }}
        initial="fadeIn"
        animate="scale"
        exit="slideIn"
      >
        <Box mx="auto" p={{ base: "20" }}>
          <Box height={40}>
            <Image src={logoImg} alt="logo" width={{ base: "30%" }} />
          </Box>
          <Text fontSize="4xl">Login</Text>
          <Text my="4">Please fill your detail to access your account.</Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.email} mb={4}>
              <Text my="2" fontWeight="bold">
                Email
              </Text>
              <Input
                type="email"
                p="6"
                borderRadius={6}
                placeholder="Email"
                borderColor="gray.600"
                defaultValue={
                  localStorage.getItem("rememberMe") === "true"
                    ? localStorage.getItem("email")
                    : ""
                }
                {...register("email")}
              />
              <FormErrorMessage>
                {errors.email && (
                  <>
                    <RiErrorWarningFill style={{ marginRight: "0.5rem" }} />
                    {errors.email.message}
                  </>
                )}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password} mb={4}>
              <Text my="2" fontWeight="bold">
                Password
              </Text>

              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  borderRadius={6}
                  p="6"
                  //   borderColor={errors.password ? "red" : "Boxborder"}
                  borderColor="gray.600"
                  defaultValue={
                    localStorage.getItem("rememberMe") === "true"
                      ? decryptPassword(localStorage.getItem("password"))
                      : ""
                  }
                  {...register("password")}
                />

                <InputRightElement
                  onClick={handleTogglePassword}
                  cursor="pointer"
                  mt={1}
                  pr={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </InputRightElement>
              </InputGroup>

              <FormErrorMessage>
                {errors.password && (
                  <>
                    <RiErrorWarningFill style={{ marginRight: "0.5rem" }} />
                    {errors.password.message}
                  </>
                )}
              </FormErrorMessage>
            </FormControl>

            {errorMsg.msg && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#e53e3e",
                  fontSize: "14px",
                }}
              >
                <RiErrorWarningFill
                  style={{ marginRight: "0.5rem", color: "#e53e3e" }}
                />
                {errorMsg.msg}
              </div>
            )}

            <Flex justifyContent="space-between">
              <Stack spacing={5} direction="row">
                <Checkbox
                  border={"1px grey"}
                  colorScheme="CheckBoxPrimary"
                  onChange={(e) => setRememberMe(e.target.checked)}
                  defaultChecked={rememberMe}
                >
                  Remember me
                </Checkbox>
              </Stack>
              <Box>
                <Text color="primary.700">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </Text>
              </Box>
            </Flex>

            <Button
              my="10"
              whileHover={{ scale: 1.1 }}
              bg="primary.700"
              type="submit"
              color="white"
              isLoading={loginApiIsLoading}
              borderRadius={"30"}
              w="full"
              p="7"
              _hover={{}}
            >
              Sign In
            </Button>
          </form>

          {/* <FormControl>
            <FormLabel
              transform={
                isFocused || inputValue
                  ? "translateY(-80%) scale(0.95)"
                  : "none"
              }
              transition="all 0.3s"
              fontSize="lg"
              color={isFocused ? "gray.500" : "gray.700"}
              bg={isFocused ? "#f4f5fa" : "transparent"}
              ml={2}
              zIndex={1}
              mt="2"
              position="absolute"
              pointerEvents="none"
              px="1"
              //bg="#f4f5fa"
            >
              Label
            </FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<HiOutlineUser color="gray.300" />}
              />
              <Input
                type="number"
                value={inputValue}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                borderRadius="md"
                // boxShadow="md"
                py={2}
                //pl={10}
                fontSize="lg"
              />
            </InputGroup>
          </FormControl> */}
        </Box>

        <Box boxSize="2xl" p={{ base: "5" }}>
          <Image
            src={Auth_Pages_IMG}
            size="xl"
            alt="Authentication image"
            width={"100%"}
            borderRadius={"3xl"}
          />
        </Box>
        {/* <AccessWebcamWithLocation /> */}
      </Box>
    </>
  );
}

export default Login;
