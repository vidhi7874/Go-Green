import React from "react";
import {
  Box,
  FormControl,
  Grid,
  GridItem,
  Input,
  Text,
} from "@chakra-ui/react";

const OtherDetail = ({ warehouseDetailsData }) => {
  const commonStyle = {
    _placeholder: { color: "gray.300" },
    _hover: {
      borderColor: "primary.700",
      backgroundColor: "primary.200",
    },
    _focus: {
      borderColor: "primary.700",
      backgroundColor: "primary.200",
      boxShadow: "none",
    },
  };

  const templateColumns = {
    base: "repeat(1, 1fr)",
    md: "repeat(3, 2fr)",
    lg: "repeat(3, 1fr)",
  };

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

  return (
    <>
      <Box bg={"White"} py={3}>
        <Box
          w={{
            base: "100%",
            sm: "100%",
            md: "100%",
            lg: "100%",
            xl: "100%",
          }}
        >
          {/* Dacoit prone**/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Dacoit prone*</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="text"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={warehouseDetailsData?.other_details?.dacroit_prone}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Dacoit prone*"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/*Riots prone**/}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Riots prone*</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details?.riots_prone
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/*Earthquake prone**/}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Earthquake prone*</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details?.earthquake_prone
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/*Flood prone**/}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Flood prone*</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details?.flood_prone
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/* Distance of warehouse from main center
 ( Village/Town) (KM)**/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Distance of warehouse from main center ( Village/Town) (KM)*
              </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="number"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={
                    warehouseDetailsData?.other_details?.main_center_distance
                  }
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Distance of warehouse from main center
                  ( Village/Town) (KM)"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* Distance of warehouse from 
Police Station(KM)**/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Distance of warehouse from Police Station(KM)*
              </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="number"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={
                    warehouseDetailsData?.other_details?.police_station_distance
                  }
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Distance of warehouse from 
                  Police Station(KM)*"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/*Distance of warehouse 
from Fire station(KM)**/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Distance of warehouse from Fire station(KM)*
              </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="number"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={
                    warehouseDetailsData?.other_details?.fire_station_distance
                  }
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Distance of warehouse 
                  from Fire station(KM)"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* Distance of warehouse from Mandi (Km)**/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Distance of warehouse from Mandi (Km)*
              </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="number"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={warehouseDetailsData?.other_details?.mandi_distance}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Distance of warehouse from Mandi (Km)"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* Distance of warehouse from Goodshed (km.)**/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Distance of warehouse from Goodshed (km.)*
              </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="number"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={warehouseDetailsData?.other_details?.goodshed_distance}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Distance of warehouse from Goodshed (km.)*"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* Fire extinguishers**/}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Fire extinguishers*</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details
                  ?.fire_extinguisher_count !== null
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/* Count of fire extinguisher*/}
          {warehouseDetailsData?.other_details?.fire_extinguisher_count !==
            null && (
            <Grid
              textAlign="right"
              alignItems="center"
              my="3"
              templateColumns={templateColumns}
              gap={5}
            >
              <GridItem colSpan={{ base: 1, lg: 0 }}>
                <Text textAlign="right">Count of fire extinguisher</Text>{" "}
              </GridItem>
              <GridItem colSpan={{ base: 1 }}>
                <FormControl style={{ w: commonWidth.w }}>
                  <Input
                    type="number"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    value={
                      warehouseDetailsData?.other_details
                        ?.fire_extinguisher_count
                    }
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Count of fire extinguisher"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          )}
          {/* Fire buckets**/}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Fire buckets*</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details?.fire_bucket_count !== null
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/* Count of fire buckets*/}
          {warehouseDetailsData?.other_details?.fire_bucket_count !== null && (
            <Grid
              textAlign="right"
              alignItems="center"
              my="3"
              templateColumns={templateColumns}
              gap={5}
            >
              <GridItem colSpan={{ base: 1, lg: 0 }}>
                <Text textAlign="right">Count of fire buckets</Text>{" "}
              </GridItem>
              <GridItem colSpan={{ base: 1 }}>
                <FormControl style={{ w: commonWidth.w }}>
                  <Input
                    type="number"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    value={
                      warehouseDetailsData?.other_details?.fire_bucket_count
                    }
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Count of fire buckets"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          )}
          {/*Other equipment**/}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Other equipment*</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details?.other_equipment_count !==
                null
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/* Count of Other equipment*/}
          {warehouseDetailsData?.other_details?.other_equipment_count !==
            null && (
            <Grid
              textAlign="right"
              alignItems="center"
              my="3"
              templateColumns={templateColumns}
              gap={5}
            >
              <GridItem colSpan={{ base: 1, lg: 0 }}>
                <Text textAlign="right">Count of Other equipment</Text>{" "}
              </GridItem>
              <GridItem colSpan={{ base: 1 }}>
                <FormControl style={{ w: commonWidth.w }}>
                  <Input
                    type="number"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    value={
                      warehouseDetailsData?.other_details?.other_equipment_count
                    }
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Count of Other equipment"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          )}
          {/* Remark*/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Remark</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="text"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={
                    warehouseDetailsData?.other_details?.other_equipment_remarks
                  }
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Remark"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/*Storage worthy* */}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Storage worthy* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details?.storage_worthy
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/* Floor type* */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Floor type* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="text"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={warehouseDetailsData?.other_details?.floor_type}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Floor type"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {warehouseDetailsData?.other_details?.floor_type === "Other" && (
            <Grid
              textAlign="right"
              alignItems="center"
              my="3"
              templateColumns={templateColumns}
              gap={5}
            >
              <GridItem colSpan={{ base: 1, lg: 0 }}>
                <Text textAlign="right">Remark</Text>{" "}
              </GridItem>
              <GridItem colSpan={{ base: 1 }}>
                <FormControl style={{ w: commonWidth.w }}>
                  <Input
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    value={warehouseDetailsData?.other_details?.floor_remarks}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Remark"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          )}
          {/* Shutters* */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Shutters</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="text"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={warehouseDetailsData?.other_details?.shutters}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Shutters"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* Shutter / Door Count* */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Shutter / Door Count* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="text"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={
                    warehouseDetailsData?.other_details?.shutter_door_count
                  }
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Shutter / Door Count"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* Roof* */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Roof* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="text"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={warehouseDetailsData?.other_details?.roof_type}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Roof"
                />
              </FormControl>
            </GridItem>
          </Grid>

          {warehouseDetailsData?.other_details?.roof_type === "Other" && (
            <Grid
              textAlign="right"
              alignItems="center"
              my="3"
              templateColumns={templateColumns}
              gap={5}
            >
              <GridItem colSpan={{ base: 1, lg: 0 }}>
                <Text textAlign="right">Remark</Text>{" "}
              </GridItem>
              <GridItem colSpan={{ base: 1 }}>
                <FormControl style={{ w: commonWidth.w }}>
                  <Input
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    value={
                      warehouseDetailsData?.other_details?.other_roof_remarks
                    }
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Remark"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          )}
          {/*Air roof FAN available*  */}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Air roof FAN available* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details?.air_roof_count !== null
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/* Air roof count */}
          {warehouseDetailsData?.other_details?.air_roof_count !== null && (
            <Grid
              textAlign="right"
              alignItems="center"
              my="3"
              templateColumns={templateColumns}
              gap={5}
            >
              <GridItem colSpan={{ base: 1, lg: 0 }}>
                <Text textAlign="right">Air roof count </Text>{" "}
              </GridItem>
              <GridItem colSpan={{ base: 1 }}>
                <FormControl style={{ w: commonWidth.w }}>
                  <Input
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    value={warehouseDetailsData?.other_details?.air_roof_count}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Air roof count"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          )}
          {/* Walls* */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Walls* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="text"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={warehouseDetailsData?.other_details?.wall_type}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Walls"
                />
              </FormControl>
            </GridItem>
          </Grid>

          {warehouseDetailsData?.other_details?.wall_type === "Other" && (
            <Grid
              textAlign="right"
              alignItems="center"
              my="3"
              templateColumns={templateColumns}
              gap={5}
            >
              <GridItem colSpan={{ base: 1, lg: 0 }}>
                <Text textAlign="right">Remark</Text>{" "}
              </GridItem>
              <GridItem colSpan={{ base: 1 }}>
                <FormControl style={{ w: commonWidth.w }}>
                  <Input
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    value={
                      warehouseDetailsData?.other_details?.other_wall_remarks
                    }
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Remark"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          )}
          {/* Plinth Height (ft)* */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Plinth Height (ft)* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="text"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={warehouseDetailsData?.other_details?.plinth_height}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Plinth Height (ft)"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* Approach Road* */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Approach Road* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="text"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={
                    warehouseDetailsData?.other_details?.approach_road_type
                  }
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Approach Road"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/*Ventilators*   */}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Ventilators* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details?.ventilators_count !== null
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/* Ventilators count */}
          {warehouseDetailsData?.other_details?.ventilators_count !== null && (
            <Grid
              textAlign="right"
              alignItems="center"
              my="3"
              templateColumns={templateColumns}
              gap={5}
            >
              <GridItem colSpan={{ base: 1, lg: 0 }}>
                <Text textAlign="right">Ventilators count </Text>{" "}
              </GridItem>
              <GridItem colSpan={{ base: 1 }}>
                <FormControl style={{ w: commonWidth.w }}>
                  <Input
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    value={
                      warehouseDetailsData?.other_details?.ventilators_count
                    }
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Ventilators count"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          )}
          {/*Window*    */}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Window* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details?.window_count !== null
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/* Windows count */}
          {warehouseDetailsData?.other_details?.window_count !== null && (
            <Grid
              textAlign="right"
              alignItems="center"
              my="3"
              templateColumns={templateColumns}
              gap={5}
            >
              <GridItem colSpan={{ base: 1, lg: 0 }}>
                <Text textAlign="right">Windows count </Text>{" "}
              </GridItem>
              <GridItem colSpan={{ base: 1 }}>
                <FormControl style={{ w: commonWidth.w }}>
                  <Input
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    value={warehouseDetailsData?.other_details?.window_count}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Windows count"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          )}
          {/*Gate*     */}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Gate* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details?.gate_count !== null
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/* Gate count */}
          {warehouseDetailsData?.other_details?.gate_count !== null && (
            <Grid
              textAlign="right"
              alignItems="center"
              my="3"
              templateColumns={templateColumns}
              gap={5}
            >
              <GridItem colSpan={{ base: 1, lg: 0 }}>
                <Text textAlign="right">Gate count </Text>{" "}
              </GridItem>
              <GridItem colSpan={{ base: 1 }}>
                <FormControl style={{ w: commonWidth.w }}>
                  <Input
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    value={warehouseDetailsData?.other_details?.gate_count}
                    //value={inputValue}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Gate count"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          )}
          {/*Fencing*      */}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Fencing* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details?.fencing ? "Yes" : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/*Compound wall**/}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Compound wall* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details?.compoundwall
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/*Drainage*      */}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Drainage* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details?.drainage ? "Yes" : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/*Water*       */}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Water* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details?.water ? "Yes" : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/*Electricity*      */}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Electricity* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details?.electricity
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/*live wires inside the Warehouse*       */}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">live wires inside the Warehouse* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details?.live_wires_in_wh
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/*Telephone*       */}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Telephone* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details?.telephone_facility
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/* Telephone No */}
          {warehouseDetailsData?.other_details?.telephone_facility === true && (
            <Grid
              textAlign="right"
              alignItems="center"
              my="3"
              templateColumns={templateColumns}
              gap={5}
            >
              <GridItem colSpan={{ base: 1, lg: 0 }}>
                <Text textAlign="right">Telephone No </Text>{" "}
              </GridItem>
              <GridItem colSpan={{ base: 1 }}>
                <FormControl style={{ w: commonWidth.w }}>
                  <Input
                    type="phone"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    value={warehouseDetailsData?.other_details?.telephone_no}
                    //value={inputValue}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Telephone No"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          )}
          {/*Dunnage*        */}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Dunnage* </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details?.dunnage_type !== null
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/* Dunnage Material*/}
          {warehouseDetailsData?.other_details?.dunnage_type !== null && (
            <Grid
              textAlign="right"
              alignItems="center"
              my="3"
              templateColumns={templateColumns}
              gap={5}
            >
              <GridItem colSpan={{ base: 1, lg: 0 }}>
                <Text textAlign="right">Dunnage Material </Text>{" "}
              </GridItem>
              <GridItem colSpan={{ base: 1 }}>
                <FormControl style={{ w: commonWidth.w }}>
                  <Input
                    type="text"
                    border="1px"
                    borderColor="gray.10"
                    backgroundColor={"white"}
                    height={"15px "}
                    borderRadius={"lg"}
                    value={warehouseDetailsData?.other_details?.dunnage_type}
                    //value={inputValue}
                    //  onChange={onChange}
                    _placeholder={commonStyle._placeholder}
                    _hover={commonStyle._hover}
                    _focus={commonStyle._focus}
                    isDisabled={true}
                    p={{ base: "4" }}
                    fontWeight={{ base: "normal" }}
                    fontStyle={"normal"}
                    placeholder="Dunnage Material"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          )}
          {/* Remark */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Remark </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="text"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={
                    warehouseDetailsData?.other_details?.other_dunnage_remarks
                  }
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Remark"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* General Integrity of people in the area* */}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                General Integrity of people in the area*{" "}
              </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="text"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={
                    warehouseDetailsData?.other_details
                      ?.people_integrity_in_area
                  }
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="General Integrity of people in the area*"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/*Incidence of theft during last 3 years*        */}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Incidence of theft during last 3 years*{" "}
              </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details
                  ?.theft_incidence_in_three_years
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/* Remarks*/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Remarks</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="text"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={warehouseDetailsData?.other_details?.theft_remarks}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Remarks"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/*Incidence of damage to stock during 
last 3 years*        */}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Incidence of damage to stock during last 3 years*
              </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details
                  ?.damanget_incidence_in_three_years
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/* Remarks*/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Remarks</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="text"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={warehouseDetailsData?.other_details?.damage_remarks}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Remarks"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/*Incidence of floods during last 3 years*        */}
          <Grid
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">
                Incidence of floods during last 3 years*
              </Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }} color={"#A6CE39"}>
                {warehouseDetailsData?.other_details
                  ?.flood_incidence_in_three_years
                  ? "Yes"
                  : "No"}
              </FormControl>
            </GridItem>
          </Grid>
          {/*Remarks*/}
          <Grid
            textAlign="right"
            alignItems="center"
            my="3"
            templateColumns={templateColumns}
            gap={5}
          >
            <GridItem colSpan={{ base: 1, lg: 0 }}>
              <Text textAlign="right">Remarks</Text>{" "}
            </GridItem>
            <GridItem colSpan={{ base: 1 }}>
              <FormControl style={{ w: commonWidth.w }}>
                <Input
                  type="text"
                  border="1px"
                  borderColor="gray.10"
                  backgroundColor={"white"}
                  height={"15px "}
                  borderRadius={"lg"}
                  value={warehouseDetailsData?.other_details?.flood_remarks}
                  //  onChange={onChange}
                  _placeholder={commonStyle._placeholder}
                  _hover={commonStyle._hover}
                  _focus={commonStyle._focus}
                  isDisabled={true}
                  p={{ base: "4" }}
                  fontWeight={{ base: "normal" }}
                  fontStyle={"normal"}
                  placeholder="Remarks"
                />
              </FormControl>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default OtherDetail;
