//   {/* Stack details */}
//   <Box
//   mt="4"
//   backgroundColor={"aqua.100"}
//   borderRadius={"lg"}
//   padding={"4"}
// >
//   <form>
//     <Text>
//       Stack details <span style={{ color: "red" }}>*</span>
//     </Text>
//     <Grid>
//       {/*SR NO */}
//       <FormControl>
//         <Grid my="3" spacing={"10px"}>
//           <GridItem>
//             <Text>Sr no</Text>
//           </GridItem>
//           <GridItem>
//             <FormControl style={{ w: commonWidth.w }}>
//               <CustomInput
//                 placeholder="sr no"
//                 name=""
//                 styles={{
//                   control: (base, state) => ({
//                     ...base,
//                     backgroundColor: "#fff",
//                     borderRadius: "6px",

//                     padding: "1px",
//                   }),
//                   ...reactSelectStyle,
//                 }}
//               />
//             </FormControl>
//           </GridItem>
//         </Grid>
//       </FormControl>

//       {/* Select Chamber  */}
//       <FormControl>
//         <Grid my="3">
//           <GridItem>
//             <Text>Select Chamber </Text>
//           </GridItem>
//           <GridItem>
//             <FormControl>
//               <ReactSelect
//                 // value={selectedOption1}
//                 // onChange={handleSelectChange1}
//                 // options={firstoptions}
//                 styles={{
//                   control: (base, state) => ({
//                     ...base,
//                     backgroundColor: "#fff",
//                     borderRadius: "6px",
//                     // borderColor: clientError.clientType ? "red" : "#c3c3c3",

//                     padding: "1px",
//                     textAlign: "left",
//                   }),
//                   ...reactSelectStyle,
//                 }}
//               />
//             </FormControl>
//           </GridItem>
//         </Grid>
//       </FormControl>

//       {/* Select stack  No  */}
//       <FormControl>
//         <Grid my="3">
//           <GridItem>
//             <Text>Select stack No </Text>
//           </GridItem>
//           <GridItem>
//             <FormControl>
//               <ReactSelect
//                 // value={selectedOption1}
//                 // onChange={handleSelectChange1}
//                 // options={firstoptions}
//                 styles={{
//                   control: (base, state) => ({
//                     ...base,
//                     backgroundColor: "#fff",
//                     borderRadius: "6px",
//                     // borderColor: clientError.clientType ? "red" : "#c3c3c3",

//                     padding: "1px",
//                     textAlign: "left",
//                   }),
//                   ...reactSelectStyle,
//                 }}
//               />
//             </FormControl>
//           </GridItem>
//         </Grid>
//       </FormControl>

//       {/* Lot no  */}
//       <FormControl>
//         <Grid my="3">
//           <GridItem>
//             <Text>Lot no </Text>
//           </GridItem>
//           <GridItem>
//             <FormControl>
//               <CustomInput
//                 placeholder="Lot no "
//                 name=""
//                 styles={{
//                   control: (base, state) => ({
//                     ...base,
//                     backgroundColor: "#fff",
//                     borderRadius: "6px",

//                     padding: "1px",
//                   }),
//                   ...reactSelectStyle,
//                 }}
//               />
//             </FormControl>
//           </GridItem>
//         </Grid>
//       </FormControl>

//       {/* No. Of Bags   */}
//       <FormControl>
//         <Grid my="3">
//           <GridItem>
//             <Text>No. Of Bags </Text>
//           </GridItem>
//           <GridItem>
//             <FormControl>
//               <CustomInput
//                 placeholder="Enter no of bags  "
//                 name=""
//                 styles={{
//                   control: (base, state) => ({
//                     ...base,
//                     backgroundColor: "#fff",
//                     borderRadius: "6px",

//                     padding: "1px",
//                   }),
//                   ...reactSelectStyle,
//                 }}
//               />
//             </FormControl>
//           </GridItem>
//         </Grid>
//       </FormControl>

//       {/* Bag weight (Kg) */}
//       <FormControl>
//         <Grid my="3">
//           <GridItem>
//             <Text>Bag weight (Kg) </Text>
//           </GridItem>
//           <GridItem>
//             <FormControl>
//               <CustomInput
//                 placeholder="Enter bag weight "
//                 name=""
//                 styles={{
//                   control: (base, state) => ({
//                     ...base,
//                     backgroundColor: "#fff",
//                     borderRadius: "6px",

//                     padding: "1px",
//                   }),
//                   ...reactSelectStyle,
//                 }}
//               />
//             </FormControl>
//           </GridItem>
//         </Grid>
//       </FormControl>

//       {/* Weight in Stack  */}
//       <FormControl>
//         <Grid my="3">
//           <GridItem>
//             <Text>Weight in Stack </Text>
//           </GridItem>
//           <GridItem>
//             <FormControl>
//               <CustomInput
//                 placeholder="(No. of bags * Bag weight)  "
//                 name=""
//                 styles={{
//                   control: (base, state) => ({
//                     ...base,
//                     backgroundColor: "#fff",
//                     borderRadius: "6px",

//                     padding: "1px",
//                   }),
//                   ...reactSelectStyle,
//                 }}
//               />
//             </FormControl>
//           </GridItem>
//         </Grid>
//       </FormControl>

//       {/* Upload stack image  */}
//       <FormControl>
//         <Grid my="3">
//           <GridItem>
//             <Text>Upload stack image </Text>
//           </GridItem>
//           <GridItem>
//             <FormControl>
//               <CustomFileInput
//                 name=""
//                 placeholder="Upload Images"
//                 label=""
//                 type=""
//                 style={{
//                   mb: 1,
//                   mt: 1,
//                 }}
//               />
//             </FormControl>
//           </GridItem>
//         </Grid>
//       </FormControl>

//       {/* Client rent */}
//       <FormControl>
//         <Grid my="3">
//           <GridItem>
//             <Text>Client rent</Text>
//           </GridItem>
//           <GridItem>
//             <FormControl>
//               <CustomInput
//                 placeholder="Client rent"
//                 name=""
//                 styles={{
//                   control: (base, state) => ({
//                     ...base,
//                     backgroundColor: "#fff",
//                     borderRadius: "6px",

//                     padding: "1px",
//                   }),
//                   ...reactSelectStyle,
//                 }}
//               />
//             </FormControl>
//           </GridItem>
//         </Grid>
//       </FormControl>

//       {/* <Box
//         display="flex"
//         gap={2}
//         justifyContent="flex-end"
//         mt="10"
//         px="0"
//       >
//         <Button
//           type="submit"
//           //w="full"
//           backgroundColor={"primary.700"}
//           _hover={{ backgroundColor: "primary.700" }}
//           color={"white"}
//           borderRadius={"full"}
//           // my={"4"}
//           px={"10"}
//         >
//           Add
//         </Button>
//       </Box> */}
//     </Grid>

//     <Box
//       display="flex"
//       gap={2}
//       justifyContent="flex-end"
//       mt="10"
//       px="0"
//     >
//       <Button
//         type="submit"
//         //w="full"
//         backgroundColor={"primary.700"}
//         _hover={{ backgroundColor: "primary.700" }}
//         color={"white"}
//         borderRadius={"full"}
//         // my={"4"}
//         px={"10"}
//       >
//         Add
//       </Button>
//     </Box>
//   </form>
// </Box>
