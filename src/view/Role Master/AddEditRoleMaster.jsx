/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";
import { useLocation, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MotionSlideUp } from "../../utils/animation";
import { addEditFormFields, schema } from "./fields";
import {
  useAddRoleMasterMutation,
  useGetPageFreeMasterMutation,
  useGetRoleIdMasterMutation,
  useUpdateRoleMasterMutation,
} from "../../features/master-api-slice";
import generateFormField from "../../components/Elements/GenerateFormField";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "../../features/manage-breadcrumb.slice";
import ROUTE_PATH from "../../constants/ROUTE";

const AddEditRoleMaster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const details = location.state?.details;

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_active: true, // Set is_active to true by default
    },
  });

  const [addEditFormFieldsList, setAddEditFormFieldsList] = useState([]);

  const { setValue } = methods;

  // Local Page List Start

  const initialPageAccess = [
    {
      name: "manage Locations",
      main: { view: false, add: false, edit: false },
      pages: [
        {
          name: "region",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "state",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "sub state",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "district",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "area",
          permissions: { view: false, add: false, edit: false },
        },
      ],
    },
    {
      name: "manage users",
      main: { view: false, add: false, edit: false },
      pages: [
        { name: "user", permissions: { view: false, add: false, edit: false } },
        {
          name: "role",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "Supervisor Master",
          permissions: { view: false, add: false, edit: false },
        },
      ],
    },
    {
      name: "manage banks",
      main: { view: false, add: false, edit: false },
      pages: [
        { name: "bank", permissions: { view: false, add: false, edit: false } },
        {
          name: "bank branch",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "bank cm location",
          permissions: { view: false, add: false, edit: false },
        },
      ],
    },
    {
      name: "manage insurances",
      main: { view: false, add: false, edit: false },
      pages: [
        // {
        //   name: "insurance company",
        //   permissions: { view: false, add: false, edit: false },
        // },
        {
          name: "insurance policy",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "earthquake zone",
          permissions: { view: false, add: false, edit: false },
        },
      ],
    },
    {
      name: "manage commodities",
      main: { view: false, add: false, edit: false },
      pages: [
        {
          name: "commodity type",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "commodity",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "commodity variety",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "commodity grade",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "commodity bag",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "HSN",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "commodity price pulling",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "quality parameter",
          permissions: { view: false, add: false, edit: false },
        },
      ],
    },
    {
      name: "manage warehouses",
      main: { view: false, add: false, edit: false },
      pages: [
        {
          name: "warehouse type",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "warehouse sub type",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "warehouse owner",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "warehouse",
          permissions: { view: false, add: false, edit: false },
        },
        // {
        //   name: "client",
        //   permissions: { view: false, add: false, edit: false },
        // },
      ],
    },
    {
      name: "manage clients",
      main: { view: false, add: false, edit: false },
      pages: [
        {
          name: "client",
          permissions: { view: false, add: false, edit: false },
        },
        // {
        //   name: "client gst",
        //   permissions: { view: false, add: false, edit: false },
        // },
      ],
    },
    {
      name: "manage vendors",
      main: { view: false, add: false, edit: false },
      pages: [
        {
          name: "security agency",
          permissions: { view: false, add: false, edit: false },
        },
      ],
    },
    {
      name: "manage security guards",
      main: { view: false, add: false, edit: false },
      pages: [
        {
          name: "security guard",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "security guard transfer",
          permissions: { view: false, add: false, edit: false },
        },
      ],
    },
    {
      name: "manage hiring proposals",
      main: { view: false, add: false, edit: false },
      pages: [
        {
          name: "hiring proposal",
          permissions: { view: false, add: false, edit: false },
        },
      ],
    },
    {
      name: "manage warehouse inspection",
      main: { view: false, add: false, edit: false },
      pages: [
        {
          name: "warehouse inspection",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "warehouse re-inspection",
          permissions: { view: false, add: false, edit: false },
        },
      ],
    },
    {
      name: "commodity inward report",
      main: { view: false, add: false, edit: false },
      pages: [
        // {
        //   name: "gate pass inward",
        //   permissions: { view: false, add: false, edit: false },
        // },
        {
          name: "CIR",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "gate pass outward",
          permissions: { view: false, add: false, edit: false },
        },
        // {
        //   name: "quality control report",
        //   permissions: { view: false, add: false, edit: false },
        // },
      ],
    },
    {
      name: "quality control report",
      main: { view: false, add: false, edit: false },
      pages: [
        // {
        //   name: "gate pass inward",
        //   permissions: { view: false, add: false, edit: false },
        // },
        // {
        //   name: "CIR",
        //   permissions: { view: false, add: false, edit: false },
        // },
        // {
        //   name: "gate pass outward",
        //   permissions: { view: false, add: false, edit: false },
        // },
        {
          name: "quality control report",
          permissions: { view: false, add: false, edit: false },
        },
      ],
    },
    {
      name: "delivery order",
      main: { view: false, add: false, edit: false },
      pages: [
        {
          name: "delivery order",
          permissions: { view: false, add: false, edit: false },
        },
        // {
        //   name: "service contract wms",
        //   permissions: { view: false, add: false, edit: false },
        // },
      ],
    },
    {
      name: "service contract",
      main: { view: false, add: false, edit: false },
      pages: [
        {
          name: "service contract",
          permissions: { view: false, add: false, edit: false },
        },
        // {
        //   name: "service contract wms",
        //   permissions: { view: false, add: false, edit: false },
        // },
      ],
    },
    // {
    //   name: "setting",
    //   main: { view: false, add: false, edit: false },
    //   pages: [
    //     {
    //       name: "setting",
    //       permissions: { view: false, add: false, edit: false },
    //     },
    //   ],
    // },
    {
      name: "Reports",
      main: { view: false, add: false, edit: false },
      pages: [
        {
          name: "Bank Reports",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "Security Guard Reports",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "Insurance Reports",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "Commodity Reports",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "Vendors Reports",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "Warehouse Reports",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "Location Reports",
          permissions: { view: false, add: false, edit: false },
        },
        {
          name: "Other Reports",
          permissions: { view: false, add: false, edit: false },
        },
      ],
    },
  ];

  // Local Page List End

  // Page Logic Start

  const [pageAccess, setPageAccess] = useState(initialPageAccess);

  const handleCheckboxChange = (pageIndex, childPageIndex, permission) => {
    const updatedPageAccess = [...pageAccess];
    const page = updatedPageAccess[pageIndex];
    const childPage = page.pages[childPageIndex];
    childPage.permissions[permission] = !childPage.permissions[permission];

    // Update the main checkbox based on the child checkboxes
    const allChecked = page.pages.every(
      (childPage) => childPage.permissions[permission]
    );
    page.main[permission] = allChecked;

    if (childPage.permissions[permission] && permission !== "view") {
      childPage.permissions["view"] = true;

      const allChecked = page.pages.every(
        (childPage) => childPage.permissions["view"]
      );

      page.main["view"] = allChecked;
    }

    setPageAccess(updatedPageAccess);
  };

  const handleMainCheckboxToggle = (pageIndex, permission) => {
    const updatedPageAccess = [...pageAccess];
    const page = updatedPageAccess[pageIndex];
    page.main[permission] = !page.main[permission];

    // Update the checkboxes for all permissions of the page based on the main checkbox value
    page.pages.forEach((childPage) => {
      childPage.permissions[permission] = page.main[permission];
    });

    if (page.main[permission] && permission !== "view") {
      page.main["view"] = true;

      // Update the checkboxes for all permissions of the page based on the main checkbox value
      page.pages.forEach((childPage) => {
        childPage.permissions["view"] = page.main[permission];
      });
    }

    setPageAccess(updatedPageAccess);
  };

  // Page Logic End

  // Form Data clear Logic start

  const clearForm = () => {
    const defaultValues = methods.getValues();
    Object.keys(defaultValues).forEach((key) => {
      setValue(key, "", {
        shouldValidate: true,
      });
    });

    // Clear all checkbox values
    const updatedPageAccess = pageAccess.map((page) => {
      const updatedPages = page.pages.map((childPage) => ({
        ...childPage,
        permissions: {
          view: false,
          add: false,
          edit: false,
        },
      }));
      return {
        ...page,
        pages: updatedPages,
        main: {
          view: false,
          add: false,
          edit: false,
        },
      };
    });
    setPageAccess(updatedPageAccess);
  };

  // Form Data clear Logic end

  // Form Submit Logic Start

  const onSubmit = (data) => {
    console.log("data==>", data);
    console.log(pageAccess, "here");
    if (details?.id) {
      updateData({ ...data, id: details.id });
    } else {
      addData(data);
    }
  };

  // Add Role Logic Start

  const [addRoleMaster, { isLoading: addRoleMasterApiIsLoading }] =
    useAddRoleMasterMutation();

  const addData = async (data) => {
    try {
      const result = pageAccess.map((item) => {
        const pages = item.pages.map((old) => {
          return {
            page: old.id,
            view: old.permissions.view,
            add: old.permissions.add,
            edit: old.permissions.edit,
          };
        });
        return pages;
      });

      let pagePer = [];

      for (let i = 0; result.length > i; i++) {
        pagePer = [...pagePer, ...result[i]];
      }

      if (pagePer.find((item) => item.view === true)) {
        const response = await addRoleMaster({
          ...data,
          role_page_assignment: pagePer,
        }).unwrap();

        console.log("add Role master res", response);

        if (response.status === 201) {
          toasterAlert(response);
          navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_ROLE}`);
        }
      } else {
        toasterAlert({
          message: "Please Give access to a page.",
          status: 440,
        });
      }
    } catch (error) {
      console.error("Error:", error);

      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Role Adding is Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Add Role Logic End

  // Edit Role Logic Start

  const [updateRoleMaster, { isLoading: updateRoleMasterApiIsLoading }] =
    useUpdateRoleMasterMutation();

  const updateData = async (data) => {
    try {
      const result = pageAccess.map((item) => {
        const pages = item.pages.map((old) => {
          return old?.pageId
            ? {
                page: old.id,
                id: old?.pageId,
                view: old.permissions.view,
                add: old.permissions.add,
                edit: old.permissions.edit,
                role: details?.id || null,
              }
            : {
                page: old.id,
                view: old.permissions.view,
                add: old.permissions.add,
                edit: old.permissions.edit,
                role: details?.id || null,
              };
        });
        return pages;
      });

      let pagePer = [];

      for (let i = 0; result.length > i; i++) {
        pagePer = [...pagePer, ...result[i]];
      }

      if (pagePer.find((item) => item.view === true)) {
        const response = await updateRoleMaster({
          ...data,
          role_page_assignment: pagePer,
        }).unwrap();

        if (response.status === 200) {
          console.log("update earthQuack master res", response);
          toasterAlert(response);
          navigate(`${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_ROLE}`);
        }
      } else {
        toasterAlert({
          message: "Please Give access to a page.",
          status: 440,
        });
      }
    } catch (error) {
      console.error("Error:", error);

      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Role Updating is Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
    }
  };

  // Edit Role Logic End

  // Form Submit Logic Start

  // Page List Api Start

  const [getPageMaster] = useGetPageFreeMasterMutation();

  const PageMasterData = async () => {
    try {
      const response = await getPageMaster().unwrap();

      const result = pageAccess.map((module) => {
        const pages = module.pages
          .map((modulePage) => {
            const pageData = response?.data?.find(
              (pageEntry) => pageEntry.page_name === modulePage.name
            );
            if (pageData) {
              return {
                id: pageData.id,
                name: modulePage.name,
                permissions: {
                  view: false,
                  add: false,
                  edit: false,
                },
              };
            }
            return null;
          })
          .filter(Boolean); // Remove any null entries
        return {
          name: module.name,
          pages: pages,
          main: { view: false, add: false, edit: false },
        };
      });

      setPageAccess(result);

      return result;
    } catch (error) {
      console.log(error, "Error");
    }
  };

  // Page List Api End

  // Role Id Detail Api Start

  const [getRoleIdMaster] = useGetRoleIdMasterMutation();

  const RoleIdMasterData = async (id) => {
    try {
      const pageResult = await PageMasterData();

      const response = await getRoleIdMaster(id).unwrap();

      const result = pageResult.map((module) => {
        const pages = module.pages
          .map((modulePage) => {
            const pageData = response?.data?.role_page_assignment?.find(
              (pageEntry) => pageEntry.page.page_name === modulePage.name
            );
            if (pageData) {
              return {
                id: pageData.page.id,
                name: modulePage.name,
                pageId: pageData.id,
                permissions: {
                  view: pageData.view,
                  add: pageData.add,
                  edit: pageData.edit,
                },
              };
            } else {
              return modulePage;
            }
          })
          .filter(Boolean); // Remove any null entries
        return {
          name: module.name,
          pages: pages,
          main: { view: false, add: false, edit: false },
        };
      });

      setPageAccess(result);
    } catch (error) {
      console.log(error, "Error");
    }
  };

  // Role Id Detail Api Start

  const [viewForm, setViewForm] = useState(false);

  useEffect(() => {
    setAddEditFormFieldsList(addEditFormFields);
    if (details?.id) {
      let obj = {
        role_name: details?.role_name,
        description: details?.description,
        is_active: details.is_active,
      };

      RoleIdMasterData({ id: details?.id });

      setViewForm(location?.state?.view || false);

      Object.keys(obj).forEach(function (key) {
        methods.setValue(key, obj[key], { shouldValidate: true });
      });
    } else {
      PageMasterData();
    }

    const breadcrumbArray = [
      {
        title: "Role Master",
        link: `${ROUTE_PATH.ALL_MASTER_MANAGE_USERS_ROLE}`,
      },
    ];

    dispatch(setBreadCrumb(breadcrumbArray));
  }, [details]);

  useEffect(() => {
    return () => {
      dispatch(setBreadCrumb([]));
    };
  }, []);

  return (
    <Box bg="white" borderRadius={10} p="10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Box maxHeight="calc( 100vh - 285px )" overflowY="auto">
            <Box>
              {addEditFormFieldsList &&
                addEditFormFieldsList.map((item, i) => (
                  <MotionSlideUp key={i} duration={0.2 * i} delay={0.1 * i}>
                    <Grid
                      gap={4}
                      templateColumns={"repeat(3, 1fr)"}
                      alignItems="center"
                    >
                      <Text textAlign="right">
                        {item.label}
                        {item.label === "Active" ? null : (
                          <span style={{ color: "red", marginLeft: "4px" }}>
                            *
                          </span>
                        )}
                      </Text>
                      {generateFormField({
                        ...item,
                        label: "",
                        isChecked: methods.watch("is_active"),

                        isClearable: false,
                        style: { mb: 1, mt: 1 },
                        inputDisabled: viewForm,
                      })}
                    </Grid>
                  </MotionSlideUp>
                ))}
            </Box>
            <Box mt="20px">
              <Accordion allowMultiple>
                {pageAccess.map((page, pageIndex) => (
                  <AccordionItem key={pageIndex} borderColor="#00000044">
                    <Grid
                      templateColumns="repeat(6, 1fr)"
                      rowGap={4}
                      columnGap={5}
                      width="100%"
                      padding="8px 16px"
                    >
                      <GridItem colSpan="2">
                        <Text
                          fontWeight="700"
                          textTransform="capitalize"
                          textAlign="right"
                        >
                          {page.name}
                        </Text>
                      </GridItem>
                      <GridItem textAlign="left" colSpan="1">
                        <Checkbox
                          size="lg"
                          border={"1px grey"}
                          colorScheme="CheckBoxPrimary"
                          fontWeight="700"
                          isChecked={page.main.view}
                          isDisabled={
                            viewForm
                              ? true
                              : page.pages.filter(
                                  (childPage) => childPage.permissions["edit"]
                                ).length > 0 ||
                                page.pages.filter(
                                  (childPage) => childPage.permissions["add"]
                                ).length > 0
                              ? page.pages.filter(
                                  (childPage) => childPage.permissions["view"]
                                ).length === page.pages.length
                              : false
                          }
                          onChange={() =>
                            handleMainCheckboxToggle(pageIndex, "view")
                          }
                        >
                          View
                        </Checkbox>
                      </GridItem>
                      <GridItem textAlign="left" colSpan="1">
                        <Checkbox
                          size="lg"
                          fontWeight="700"
                          border={"1px grey"}
                          colorScheme="CheckBoxPrimary"
                          isChecked={page.main.add}
                          isDisabled={viewForm ? true : false}
                          onChange={() =>
                            handleMainCheckboxToggle(pageIndex, "add")
                          }
                        >
                          Add
                        </Checkbox>
                      </GridItem>
                      <GridItem textAlign="left" colSpan="1">
                        <Checkbox
                          size="lg"
                          fontWeight="700"
                          border={"1px grey"}
                          colorScheme="CheckBoxPrimary"
                          isChecked={page.main.edit}
                          isDisabled={viewForm ? true : false}
                          onChange={() =>
                            handleMainCheckboxToggle(pageIndex, "edit")
                          }
                        >
                          Edit
                        </Checkbox>
                      </GridItem>
                      <GridItem colSpan="1" placeSelf="end">
                        <Flex justifyContent="center">
                          <AccordionButton padding="2px 10px">
                            <AccordionIcon fontSize="24px" />
                          </AccordionButton>
                        </Flex>
                      </GridItem>
                    </Grid>
                    <AccordionPanel>
                      <Grid
                        templateColumns="repeat(6, 1fr)"
                        rowGap={4}
                        columnGap={5}
                      >
                        {page.pages.map((childPage, childPageIndex) => (
                          <>
                            <GridItem colSpan="2">
                              <Text
                                textTransform="capitalize"
                                textAlign="right"
                              >
                                {childPage.name}
                              </Text>
                            </GridItem>
                            <GridItem>
                              <Checkbox
                                size="lg"
                                border={"1px grey"}
                                colorScheme="CheckBoxPrimary"
                                isChecked={childPage.permissions.view}
                                isDisabled={
                                  viewForm
                                    ? true
                                    : childPage.permissions.add ||
                                      childPage.permissions.edit
                                }
                                onChange={() =>
                                  handleCheckboxChange(
                                    pageIndex,
                                    childPageIndex,
                                    "view"
                                  )
                                }
                              ></Checkbox>
                            </GridItem>
                            <GridItem>
                              <Checkbox
                                size="lg"
                                border={"1px grey"}
                                colorScheme="CheckBoxPrimary"
                                isDisabled={viewForm ? true : false}
                                isChecked={childPage.permissions.add}
                                onChange={() =>
                                  handleCheckboxChange(
                                    pageIndex,
                                    childPageIndex,
                                    "add"
                                  )
                                }
                              ></Checkbox>
                            </GridItem>
                            <GridItem>
                              <Checkbox
                                size="lg"
                                border={"1px grey"}
                                colorScheme="CheckBoxPrimary"
                                isChecked={childPage.permissions.edit}
                                isDisabled={viewForm ? true : false}
                                onChange={() =>
                                  handleCheckboxChange(
                                    pageIndex,
                                    childPageIndex,
                                    "edit"
                                  )
                                }
                              ></Checkbox>
                            </GridItem>
                            <GridItem colSpan="1"></GridItem>
                          </>
                        ))}
                      </Grid>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
            <Box
              display="flex"
              gap={2}
              justifyContent="flex-end"
              mt="10"
              px="0"
            >
              <Button
                type="button"
                backgroundColor={"white"}
                borderWidth={"1px"}
                borderColor={"#F82F2F"}
                _hover={{ backgroundColor: "" }}
                color={"#F82F2F"}
                borderRadius={"full"}
                my={"4"}
                px={"10"}
                onClick={clearForm}
                isDisabled={viewForm ? true : false}
              >
                Clear
              </Button>
              <Button
                type="submit"
                //w="full"
                backgroundColor={"primary.700"}
                _hover={{ backgroundColor: "primary.700" }}
                color={"white"}
                borderRadius={"full"}
                isDisabled={viewForm ? true : false}
                isLoading={
                  addRoleMasterApiIsLoading || updateRoleMasterApiIsLoading
                }
                my={"4"}
                px={"10"}
              >
                {details?.id ? "Update" : "Add"}
              </Button>
            </Box>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default AddEditRoleMaster;

const toasterAlert = (obj) => {
  let msg = obj?.message;
  let status = obj?.status;
  if (status === 400) {
    const errorData = obj.data;
    let errorMessage = "";

    Object.keys(errorData).forEach((key) => {
      const messages = errorData[key];
      messages.forEach((message) => {
        errorMessage += `${key} : ${message} \n`;
      });
    });
    showToastByStatusCode(status, errorMessage);
    return false;
  }
  showToastByStatusCode(status, msg);
};
