import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  // AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Grid,
  GridItem,
  ListItem,
  UnorderedList,
  Image,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { mastersSuperSet } from "../../features/superSet/masters";
import { localStorageService } from "../../services/localStorge.service";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  // clearBreadCrumb,
  setBreadCrumb,
} from "../../features/manage-breadcrumb.slice";
import { useGetActiveSecurityCountMutation, useGetClientMothBillingCountMutation, useGetCommodityHighestRateCountMutation, useGetInsuranceCountMutation, useGetOwnerMothBillingCountMutation, useGetTotalClientCountMutation, useGetWareHouseCountMutation } from "../../features/dashboardkpi.slice";

function Dashboard() {
  // ! commented unused variable ,....
  // const dispatch = useDispatch();

  //reports api calling start

  const colors = [
    {
      darkBg: "blue.50",
      bgColor: "blue.10",
    },
    {
      darkBg: "orange.50",
      bgColor: "orange.10",
    },
    {
      darkBg: "green.50",
      bgColor: "green.10",
    },
    {
      darkBg: "pink.50",
      bgColor: "pink.10",
    },
  ];

  const [reports, setReports] = useState({});

  const [kpiDetails,setKpiDetails] = useState({});

  //fetch access token api calling start
  const accessToken = async () => {
    try {
      let obj = {
        username: "admin",
        password: "admin",
        refresh: "true",
        provider: "db",
      };

      const response = await mastersSuperSet.getAccessToken(obj);

      if (response.status === 200) {
        localStorageService.set("Tokens", response?.data);
        allReports()
      }
    } catch (error) {
      console.error("Error:", error);
      // alert("catch");
    }
  };
  //fetch access token api calling end

  const allReports = async () => {
    try {
      const loginAccessToken = localStorageService.get("Tokens")?.access_token;

      // console.log("loginAccessTokenReport", loginAccessToken);

      if (loginAccessToken) {
        const headers = {
          Authorization: `Bearer ${loginAccessToken}`,
        };

        const response = await mastersSuperSet.getReports({ headers });
        // console.log("responseReports", response);

        const obj = {};

        response?.data?.result?.forEach((item) => {
          console.log(item.dashboard_title);
          //  debugger;
          const [category, labelTxt] = item.dashboard_title.split("__");
          const isSplit = item.dashboard_title.split("__");

          if (isSplit.length > 1) {
            // console.log("category", category);
            // console.log("labelTxt", labelTxt);

            if (!obj[category]) {
              obj[category] = [];
            }

            obj[category].push({
              labelTxt: labelTxt?.trim(),
              link: item.url,
              id: item.id,
            });
          }

          // console.log(obj);
        });

        setReports(obj);

        // console.log("obj", obj);
      } else {
        console.log("Access token is not available.");
      }
    } catch (error) {
      console.log("error: " + error);
    }
  };
  //reports api calling End

  useEffect(() => {
    accessToken();
    allReports();
    // eslint-disable-next-line
  }, []);




  const [warehouseCount, { isLoading: warehouseCountApiIsLoading }] =
  useGetWareHouseCountMutation();
const [insuranceCount, {isLoading: insuranceCountApiIsLoading}]=
  useGetInsuranceCountMutation();

  const [activeSecurityCount, {isLoading: activeSecurityCountApiIsLoading}] =
  useGetActiveSecurityCountMutation();

  const [commodityHighestRateCount, {isLoading: commodityHighetrateCountApiIsLoading}] =
  useGetCommodityHighestRateCountMutation();

  const [totalClientCount, {isLoading: totalClientCountApiIsLoading}] =
  useGetTotalClientCountMutation();


  const [currentMonthOwnerBillingCount, {isLoading: currentMonthOwnerBillingCountApiIsLoading}] =
  useGetOwnerMothBillingCountMutation();

  const [currentMonthClientBillingCount, {isLoading: currentMonthClientBillingCountApiIsLoading}] =
  useGetClientMothBillingCountMutation();




  const addData = async (data) => {
    try {
      const response = await warehouseCount().unwrap();
      console.log("responsePBPM", response);
      setKpiDetails(prev => (
        {
          ...prev,
          warehouseCount:response.total_warehouse_count,
        }
      ))

      const insuranceCountResponse = await insuranceCount().unwrap();
      console.log("insuranceCountResponse", insuranceCountResponse);
      setKpiDetails(prev => (
        {
          ...prev,
          insuranceCount:insuranceCountResponse.go_green_sum,
        }
      ))
      const activeSecurityCountResponse = await activeSecurityCount().unwrap();
      console.log("activeSecurityCountResponse", activeSecurityCountResponse);
      setKpiDetails(prev => (
        {
          ...prev,
          securityGuardCount:activeSecurityCountResponse.Total_active_guards,
        }
      ))

      const commodityHighestRateCountResponse = await commodityHighestRateCount().unwrap();
      console.log("commodityHighestRateCountResponse", commodityHighestRateCountResponse);
      setKpiDetails(prev => (
        {
          ...prev,
          commodityName:commodityHighestRateCountResponse.commodity_name,
          commodityPrice:commodityHighestRateCountResponse.highest_commodity_price
        }
      ))

      const totalClientCountResponse = await totalClientCount().unwrap();
      console.log("totalClientCountResponse", totalClientCountResponse);
      setKpiDetails(prev => (
        {
          ...prev,
          clientCount:totalClientCountResponse.total_client,
        
        }
      ))


      const currentMonthOwnerBillingCountResponse = await currentMonthOwnerBillingCount().unwrap();
      console.log("currentMonthOwnerBillingCountResponse", currentMonthOwnerBillingCountResponse);
      setKpiDetails(prev => (
        {
          ...prev,
          ownerBilling:currentMonthOwnerBillingCountResponse.previous_billing_month_count,
        
        }
      ))
      const currentMonthClientBillingCountResponse = await currentMonthClientBillingCount().unwrap();
    console.log("currentMonthClientBillingCountResponse", currentMonthClientBillingCountResponse);
    setKpiDetails(prev => (
      {
        ...prev,
        clientBilling:currentMonthClientBillingCountResponse.previous_billing_month_count,
      
      }
    ))
      // Further processing or handling of the response can be done here
    } catch (error) {
      console.error("An error occurred while fetching warehouse count:", error);
      // Handle the error as needed
    }
  };
  
  // Assuming warehouseCount() is an asynchronous function that returns a Promise
  // and .unwrap() is a method to extract the resolved value from the Promise.
  // Please replace these with the actual implementation details.
  

  useEffect(() => {
    addData();
    // eslint-disable-next-line
  }, []);



  return (
    <>
      {" "}
      {/* total ticket section */}
      <Box bg="white" borderRadius={10} p="10">
        <Grid
          templateRows="repeat(2, 1fr)"
          templateColumns={{ base: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
          gap={4}
        >
          <GridItem
            rowSpan={{ base: "4", lg: "2" }}
            colSpan={{ base: "3", lg: "1" }}
            padding={{ base: "2", lg: "0" }}
            bg="primary.700"
            borderRadius={"md"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Box>
              <Text color={"white"} fontWeight={"semibold"}>
              Total Warehouses
              </Text>
              <Flex gap={2}>
                <Box
                  border={"1px solid red"}
                  display={"flex"}
                  justifyContent={"center"}
                  height={"10"}
                  padding={"2"}
                  borderRadius={"full"}
                  borderColor={"gray.200"}
                  bg={"white"}
                >
                  <Image src="./logo/dashboard-folder-open.svg" width={"6"} />
                </Box>
                <Text color={"white"} fontWeight={"semibold"} fontSize={"2xl"}>
                {kpiDetails.warehouseCount}
                </Text>
              </Flex>
            </Box>
          </GridItem>

          <GridItem
            colSpan={1}
            border={"1px solid"}
            borderColor={"gray.300"}
            borderRadius={"lg"}
            w={"100%"}
            p={{ base: "3" }}
          >
            <Flex justifyContent={"space-between"}>
              <Box>
                <Text fontSize={{ base: "small" }} color={"gray.300"}>
                GG insurance amount
                </Text>
                <Text fontSize={"xl"} fontWeight={"bold"} color={"black.100"}>
                  {kpiDetails.insuranceCount}
                </Text>
              </Box>
              <Box
                border={"1px solid red"}
                // display={"flex"}
                // justifyContent={"center"}
                height={"10"}
                padding={"2"}
                borderRadius={"full"}
                borderColor={"#9f9f9f2e"}
                bg={"white"}
              >
                <Image src="./logo/dashboard-folder-open.svg" width={"6"} />
              </Box>
            </Flex>
          </GridItem>

          {/* Assigned tickets */}
          <GridItem
            colSpan={1}
            border={"1px solid"}
            borderColor={"gray.300"}
            borderRadius={"lg"}
            w={"100%"}
            p={{ base: "3" }}
          >
            <Flex justifyContent={"space-between"}>
              <Box>
                <Text fontSize={{ base: "small" }} color={"gray.300"}>
                Active Security Guards
                </Text>
                <Text fontSize={"xl"} fontWeight={"bold"} color={"black.100"}>
                  {kpiDetails.securityGuardCount}
                </Text>
              </Box>
              <Box
                border={"1px solid red"}
                // display={"flex"}
                // justifyContent={"center"}
                height={"10"}
                padding={"2"}
                borderRadius={"full"}
                borderColor={"#9f9f9f2e"}
                bg={"white"}
              >
                <Image src="./logo/dashboard-folder-open.svg" width={"6"} />
              </Box>
            </Flex>
          </GridItem>
          {/* On call tickets */}
          <GridItem
            colSpan={1}
            border={"1px solid"}
            borderColor={"gray.300"}
            borderRadius={"lg"}
            w={"100%"}
            p={{ base: "3" }}
          >
            <Flex justifyContent={"space-between"}>
              <Box>
                <Text fontSize={{ base: "small" }} color={"gray.300"}>
                Commodity with higest rate today
                </Text>
               <Flex gap={2}>
               <Text fontSize={"xl"} fontWeight={"bold"} color={"black.100"}>
                  {kpiDetails.commodityName}
                </Text>
               <Text fontSize={"xl"} fontWeight={"bold"} color={"black.100"}>
                  {kpiDetails.commodityPrice}
                </Text>

               </Flex>
              </Box>
              <Box
                border={"1px solid red"}
                // display={"flex"}
                // justifyContent={"center"}
                height={"10"}
                padding={"2"}
                borderRadius={"full"}
                borderColor={"#9f9f9f2e"}
                bg={"white"}
              >
                <Image src="./logo/dashboard-folder-open.svg" width={"6"} />
              </Box>
            </Flex>
          </GridItem>
          {/* Visited tickets */}
          <GridItem
            colSpan={1}
            border={"1px solid"}
            borderColor={"gray.300"}
            borderRadius={"lg"}
            w={"100%"}
            p={{ base: "3" }}
          >
            <Flex justifyContent={"space-between"}>
              <Box>
                <Text fontSize={{ base: "small" }} color={"gray.300"}>
                Total No of clients
                </Text>
                <Text fontSize={"xl"} fontWeight={"bold"} color={"black.100"}>
                  {kpiDetails.clientCount}
                </Text>
              </Box>
              <Box
                border={"1px solid red"}
                // display={"flex"}
                // justifyContent={"center"}
                height={"10"}
                padding={"2"}
                borderRadius={"full"}
                borderColor={"#9f9f9f2e"}
                bg={"white"}
              >
                <Image src="./logo/dashboard-folder-open.svg" width={"6"} />
              </Box>
            </Flex>
          </GridItem>
          {/* Waiting for spares */}
          <GridItem
            colSpan={1}
            border={"1px solid"}
            borderColor={"gray.300"}
            borderRadius={"lg"}
            w={"100%"}
            p={{ base: "3" }}
          >
            <Flex justifyContent={"space-between"}>
              <Box>
                <Text fontSize={{ base: "small" }} color={"gray.300"}>
                Current Month Owner Billing
                </Text>
                <Text fontSize={"xl"} fontWeight={"bold"} color={"black.100"}>
                  {kpiDetails.ownerBilling}
                </Text>
              </Box>
              <Box
                border={"1px solid red"}
                // display={"flex"}
                // justifyContent={"center"}
                height={"10"}
                padding={"2"}
                borderRadius={"full"}
                borderColor={"#9f9f9f2e"}
                bg={"white"}
              >
                <Image src="./logo/dashboard-folder-open.svg" width={"6"} />
              </Box>
            </Flex>
          </GridItem>

          {/* Completed tickets */}
          <GridItem
            colSpan={1}
            border={"1px solid"}
            borderColor={"gray.300"}
            borderRadius={"lg"}
            w={"100%"}
            p={{ base: "3" }}
          >
            <Flex justifyContent={"space-between"}>
              <Box>
                <Text fontSize={{ base: "small" }} color={"gray.300"}>
                Current Month Client Billing
                </Text>
                <Text fontSize={"xl"} fontWeight={"bold"} color={"black.100"}>
                  {kpiDetails.clientBilling}
                </Text>
              </Box>
              <Box
                border={"1px solid red"}
                // display={"flex"}
                // justifyContent={"center"}
                height={"10"}
                padding={"2"}
                borderRadius={"full"}
                borderColor={"#9f9f9f2e"}
                bg={"white"}
              >
                <Image src="./logo/dashboard-folder-open.svg" width={"6"} />
              </Box>
            </Flex>
          </GridItem>
        </Grid>
      </Box>
      {/* report section */}
      <Box bg="white" borderRadius={10} p="10" mt={4}>
        <Text fontSize={"2xl"} fontWeight={"semibold"} color={"black.100"}>
          Reports{" "}
        </Text>

        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            xl: "repeat(3, 1fr)",
            "2xl": "repeat(4, 1fr)",
          }}
          gap={6}
          mt={"6"}
        >
          {Object.entries(reports).map(([category, items], index) => {
            console.log("category: " + category);
            console.log("items: " + items);
            const x = [...items];
            console.log(x);

            return (
              <GridItem key={`reports_${index}`} w="100%">
                <ReportBlock
                  details={{
                    darkBgColor: colors[index % colors.length]?.darkBg,
                    backgroundColor: colors[index % colors.length]?.bgColor,
                    categoryName: category,
                    items: items,
                  }}
                />
              </GridItem>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}

export default Dashboard;

const ReportBlock = ({ details }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openReport = (el, event) => {
    event.preventDefault();
    console.log(el);
    const breadcrumbArray = [
      {
        title: details?.categoryName?.replace(/_/g, " "),
        link: "/",
      },
      {
        title: el?.labelTxt,
        link: `/superset-dashboard/${el?.id}`,
      },
    ];
    navigate(`/superset-dashboard/${el?.id}`);
    dispatch(setBreadCrumb(breadcrumbArray));
    // Clear breadcrumb when the title is clicked
  };

  useEffect(() => {
    dispatch(setBreadCrumb([]));
    // eslint-disable-next-line
  }, []);
  // allowMultiple defaultIndex={[0]}
  return (
    <>
      <Accordion allowMultiple={true} defaultIndex={[-1]}>
        <AccordionItem isDisabled={false}>
          {({ isExpanded }) => (
            <>
              <h2>
                <AccordionButton
                  bg={details?.backgroundColor}
                  _hover={{ bg: details?.backgroundColor }}
                  borderRadius={"md"}
                  display={"flex"}
                  gap={"2"}
                  position={"relative"}
                >
                  <Box
                    border={"2px solid black"}
                    borderColor={details?.darkBgColor}
                    borderRadius={"lg"}
                    h={{ base: "55%" }}
                    position={"absolute"}
                    left={{ base: "0" }}
                  ></Box>
                  <Flex alignItems={"center"} w={"100%"}>
                    <Box as="span" flex="1" textAlign="left" fontSize={"small"}>
                      {details?.categoryName?.replace(/_/g, " ")}
                      {console.log("details", details?.categoryName)}
                    </Box>
                    <Box
                      border={"1px solid"}
                      borderColor={details?.darkBgColor}
                      bg={details?.darkBgColor}
                      borderRadius={"full"}
                      color={"white"}
                      px={"2.5"}
                      py={"1"}
                      fontSize={"small"}
                    >
                      {details?.items.length}
                    </Box>
                  </Flex>
                  <Box>
                    {" "}
                    {isExpanded ? (
                      <MinusIcon fontSize="12px" />
                    ) : (
                      <AddIcon fontSize="12px" />
                    )}
                  </Box>
                </AccordionButton>
              </h2>
              <AccordionPanel
                pb={4}
                mt={"4"}
                bg={details?.backgroundColor}
                borderRadius={"md"}
                isDisabled={true}
                height={"60"}
                overflow={"scroll"}
                css={{
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  // Optional: Add custom styling for the scrollbar thumb
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "blue.50",
                    borderRadius: "0.25em",
                  },
                  // Optional: Add custom styling for the scrollbar track
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "blue.10",
                  },
                }}
              >
                <UnorderedList fontSize={"small"}>
                  {details?.items.map((el, ind) => {
                    return (
                      <ListItem
                        cursor="pointer"
                        key={ind}
                        my={"1"}
                        onClick={(event) => openReport(el, event)}
                      >
                        {el?.labelTxt}
                      </ListItem>
                    );
                  })}
                </UnorderedList>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </>
  );
};
