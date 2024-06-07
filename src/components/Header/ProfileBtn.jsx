import {
  Box,
  // Button,
  Flex,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";

import React from "react";
import { RiGroupLine } from "react-icons/ri";
import { IoLogOutOutline } from "react-icons/io5";
import logo from "../Icons/logo.svg";
import profile_dumy_icon from "../Icons/profile_dumy_icon.svg";

import { commonService } from "../../services/common.service";
import { localStorageService } from "../../services/localStorge.service";
// import { Link, useNavigate } from "react-router-dom";

function ProfileBtn() {
  const handleChangePassword = () => {
    window.location.href = "/change-current-password";
  };

  return (
    <>
      <Box position="relative">
        <Popover direction="rtl" isLazy autoFocus={true}>
          <PopoverTrigger>
            <Flex
              height="40px"
              width="40px"
              borderRadius="full"
              bg="white"
              justifyContent="center"
              alignItems="center"
              cursor="pointer"
              boxShadow="md"
            >
              <Image size="30" width={24} height={24} src={profile_dumy_icon} />
            </Flex>
          </PopoverTrigger>
          <PopoverContent position={"absolute"} right="0px" borderRadius="20px">
            <PopoverBody>
              <Box p="10px">
                <Flex
                  bg="primary.100"
                  p="16px"
                  gap="10px"
                  alignItems="center"
                  cursor="pointer"
                >
                  <Flex
                    height="40px"
                    width="40px"
                    borderRadius="full"
                    bg="white"
                    justifyContent="center"
                    alignItems="center"
                    cursor="pointer"
                  >
                    <Image size="30" width={24} height={24} src={logo} />
                  </Flex>
                  <Box>
                    <Text fontSize="16px" color="gray.800" fontWeight="600">
                      {localStorageService.get("GG_ADMIN")?.userDetails
                        ?.employee_name || "Johnathan Joy"}
                    </Text>
                    <Text
                      fontSize="14px"
                      color="gray.800"
                      mt="-5px"
                      fontWeight="400"
                    >
                      {localStorageService.get("GG_ADMIN")?.userDetails
                        ?.email || "jonathan@gmail.com"}
                    </Text>
                  </Box>
                </Flex>
                <Flex
                  mt="10px"
                  p="16px"
                  gap="10px"
                  alignItems="center"
                  borderBottom="1px"
                  borderColor="gray.100"
                  cursor="pointer"
                  onClick={handleChangePassword}
                >
                  <Flex
                    height="40px"
                    width="40px"
                    borderRadius="8px"
                    bg="secondary.100"
                    justifyContent="center"
                    alignItems="center"
                    cursor="pointer"
                  >
                    <RiGroupLine stroke="secondary.500" size="24" />
                  </Flex>
                  <Box>
                    <Text fontSize="16px" color="black" fontWeight="600">
                      Change password
                    </Text>
                  </Box>
                </Flex>
                <Flex
                  p="16px"
                  gap="10px"
                  alignItems="center"
                  borderBottom="1px"
                  borderColor="gray.100"
                  cursor="pointer"
                  // onClick={() => alert()}

                  onClick={() => commonService.userLogout()}
                >
                  <Flex
                    height="40px"
                    width="40px"
                    borderRadius="8px"
                    bg="secondary.100"
                    justifyContent="center"
                    alignItems="center"
                    cursor="pointer"
                  >
                    <IoLogOutOutline size="24" />
                  </Flex>
                  <Box zIndex={10000}>
                    <Text fontSize="16px" color="black" fontWeight="600">
                      Sign out
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    </>
  );
}

export default ProfileBtn;
