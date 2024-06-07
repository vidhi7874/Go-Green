import * as yup from "yup";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { BiDownload, BiUpload } from "react-icons/bi";
import configuration from "../../config/configuration";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { usePostOtherReGenrateBillingMutation } from "../../features/billing.slice";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";

const downloadPdf = (info) => {
  const baseUrl = configuration.BASE_URL;
  const fullUrl = baseUrl + info?.row?.original?.bill_path;

  // Extract the file name from the bill_path
  const fileName = info?.row?.original?.bill_path.split("/").pop();

  fetch(fullUrl)
    .then((response) => response.blob())
    .then((blob) => {
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary <a> element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName; // Set the filename to the extracted file name
      a.style.display = "none"; // Hide the element
      document.body.appendChild(a);

      // Trigger the download
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    })
    .catch((error) => console.error("Error downloading PDF:", error));
};

const columnHelper = createColumnHelper();

const filterFields = [
  {
    "Invoice Number": "invoice_no",
    isActiveFilter: false,
    label: "Invoice Number",
    name: "invoice_no",
    placeholder: "Invoice Number",
    type: "text",
  },
  {
    "Client Name ": "service_contract__client__name_of_client",
    isActiveFilter: false,
    label: "Client Name",
    name: "service_contract__client__name_of_client",
    placeholder: "Enter Cleint Name",
    type: "text",
  },
  {
    "Warehouse Type ":
      "service_contract__contractwarehousechamber__warehouse__warehouse_type__warehouse_type_name",
    isActiveFilter: false,
    label: "Warehouse Type",
    name: "service_contract__contractwarehousechamber__warehouse__warehouse_type__warehouse_type_name",
    placeholder: "Enter Warehouse Type",
    type: "text",
  },
  {
    "Warehouse no ":
      "service_contract__contractwarehousechamber__warehouse__warehouse_number",
    isActiveFilter: false,
    label: "Warehouse no",
    name: "service_contract__contractwarehousechamber__warehouse__warehouse_number",
    placeholder: "Enter Warehouse no",
    type: "text",
  },
  {
    "REGION ":
      "service_contract__contractwarehousechamber__warehouse__region__region_name",
    isActiveFilter: false,
    label: "Region",
    name: "service_contract__contractwarehousechamber__warehouse__region__region_name",
    placeholder: "Region",
    type: "text",
  },
  {
    "State ":
      "service_contract__contractwarehousechamber__warehouse__state__state_name",
    isActiveFilter: false,
    label: "State",
    name: "service_contract__contractwarehousechamber__warehouse__state__state_name",
    placeholder: "State",
    type: "text",
  },
  {
    Substate:
      "service_contract__contractwarehousechamber__warehouse__substate__substate_name",
    isActiveFilter: false,
    label: "Substate ",
    name: "service_contract__contractwarehousechamber__warehouse__substate__substate_name",
    placeholder: "Substate    ",
    type: "text",
  },

  {
    "District ":
      "service_contract__contractwarehousechamber__warehouse__district__district_name",
    isActiveFilter: false,
    label: "District",
    name: "service_contract__contractwarehousechamber__warehouse__district__district_name",
    placeholder: "District",
    type: "text",
  },
  {
    "Area ":
      "service_contract__contractwarehousechamber__warehouse__area__area_name",
    isActiveFilter: false,
    label: "Area",
    name: "service_contract__contractwarehousechamber__warehouse__area__area_name",
    placeholder: "Area",
    type: "text",
  },
  {
    "Warehouse name ":
      "service_contract__contractwarehousechamber__warehouse__warehouse_name",
    isActiveFilter: false,
    label: "Warehouse name",
    name: "service_contract__contractwarehousechamber__warehouse__warehouse_name",
    placeholder: "Warehouse name",
    type: "text",
  },

  {
    "Chamber name ":
      "service_contract__contractwarehousechamber__chamber__chamber_number",
    isActiveFilter: false,
    label: "Chamber name",
    name: "service_contract__contractwarehousechamber__chamber__chamber_number",
    placeholder: "Chamber name",
    type: "text",
  },
  {
    "Commodity name ":
      "service_contract__contractcommodity__commodity__commodity_name",
    isActiveFilter: false,
    label: "Commodity name",
    name: "service_contract__contractcommodity__commodity__commodity_name",
    placeholder: "Commodity name",
    type: "text",
  },
  {
    "Service Contract No ": "service_contract__service_contract_number",
    isActiveFilter: false,
    label: "Service Contract No",
    name: "service_contract__service_contract_number",
    placeholder: "Service Contract No",
    type: "text",
  },
  {
    "Total Rent": "total_billing_ammount",
    isActiveFilter: false,
    label: "Total Rent",
    name: "total_billing_ammount",
    placeholder: "Total Rent",
    type: "number",
  },

  {
    "Start date": "created_at",
    isActiveFilter: false,
    label: "Start date",
    name: "created_at",
    placeholder: "Start date ",
    type: "date",
    // max: new Date().toISOString().split("T")[0],
  },

  {
    "End date": "last_updated_date",
    isActiveFilter: false,
    label: "End date",
    name: "last_updated_date",
    placeholder: "End date",
    type: "date",
    // max: new Date().toISOString().split("T")[0],
  },
];
function getMonthName(monthNumber) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[monthNumber - 1]; // Adjust index since month numbers start from 1
}

const addEditFormFields = [
  {
    label: "Region ",
    name: "region_name",
    placeholder: "Region ",
    type: "text",
  },
  {
    label: "Active",
    name: "is_active",
    type: "switch",
  },
];

const schema = yup.object().shape({
  is_active: yup.string(),
  region_name: yup
    .string()
    .trim()
    .required(() => null),
});

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: "SR. NO",
  }),
  columnHelper.accessor("invoice_number", {
    cell: (info) => info.getValue() || "-",
    header: "Invoice no",
  }),
  columnHelper.accessor("service_contract.client", {
    cell: (info) => info.getValue(),
    header: "Client Name",
  }),
  columnHelper.accessor("billing_month", {
    cell: (info) => {
      const billingDate = info.row.original.billing_date; // Assuming 'billing_date' is a field in your row data
      const monthNumber = billingDate ? parseInt(billingDate.slice(5, 7), 10) : 0; // Extract mm and convert to number
      return monthNumber ? getMonthName(monthNumber) : ""; // Convert month number to month name
    },
    header: "Invoice Month",
  }),
  
  
  columnHelper.accessor("billing_date", {
    cell: (info) => info.getValue(),
    header: "Invoice Date",
  }),
  columnHelper.accessor("region_name", {
    cell: (info) => {
      let warehouse_type =
        info?.row?.original?.service_contract.contractwarehousechamber
          ?.map((el) => el?.warehouse__warehouse_type__warehouse_type_name)
          .join(",");
      return warehouse_type || "-";
    },
    header: "Warehouse Type",
  }),
  columnHelper.accessor("warehouse.warehouse_number", {
    cell: (info) => {
      let warehouse_number =
        info?.row?.original?.service_contract.contractwarehousechamber
          ?.map((el) => el?.warehouse__warehouse_number)
          .join(",");
      return warehouse_number || "-";
    },
    header: "Warehouse NO",
  }),
  columnHelper.accessor("warehouse.warehouse_name", {
    // cell: (info) => info.getValue(),
    cell: (info) => {
      let warehouse_name =
        info?.row?.original?.service_contract.contractwarehousechamber
          ?.map((el) => el?.warehouse__warehouse_name)
          .join(",");
      return warehouse_name || "-";
    },
    header: "Warehouse Name",
  }),
  columnHelper.accessor("chamber.chamber_name", {
    cell: (info) => {
      let chamber_name =
        info?.row?.original?.service_contract.contractwarehousechamber
          ?.map((el) => el?.chamber__chamber_number)
          .join(",");
      return chamber_name || "-";
    },
    header: "Chamber Name",
  }),
  columnHelper.accessor("region_name", {
    cell: (info) => {
      let commodity_name =
        info?.row?.original?.service_contract.contractcommodity
          ?.map((el) => el?.commodity__commodity_name)
          .join(",");
      return commodity_name || "-";
    },
    header: "Commodity Name",
  }),
  columnHelper.accessor("service_contract.service_contract_number", {
    cell: (info) => info.getValue() || "-",
    header: "Service Contract NO",
  }),
  columnHelper.accessor("billing_start_date", {
    cell: (info) => info.getValue(),
    header: "Start Date",
  }),
  columnHelper.accessor("billing_end_date", {
    cell: (info) => info.getValue(),
    header: "End Date",
  }),
  columnHelper.accessor("discount", {
    cell: (info) => info.getValue() || "-",
    header: "Discount Percentage",
  }),
  columnHelper.accessor("total_billing_ammount", {
    cell: (info) => info.getValue() || "-",
    header: "Total Amount",
  }),
  columnHelper.accessor("owner_kyc_completed", {
    cell: (info) => {
      return <OwnersKycCompletedCell row={info.row} />;
    },
    header: "Re Genrate Bill",
  }),
  columnHelper.accessor("update", {
    header: () => (
      <Text id="update_col" fontWeight="800">
        DOWNLOAD
      </Text>
    ),
    // cell: (info) => (
    //   <Flex justifyContent="center" color="primary.700" id="update_row">
    //     <BiDownload
    //       fontSize="26px"
    //       cursor="pointer"
    //       // onClick={() => editForm(info)}
    //       onClick={() => downloadPdf(info)}
    //     />
    //   </Flex>
    // ),
    cell: (info) => (
      <Flex justifyContent="center" color="primary.700" id="update_row">
        <BiDownload
          fontSize="26px"
          cursor="pointer"
          onClick={() => {
            console.log("Info:", info);
            downloadPdf(info);
          }}
        />
      </Flex>
    ),
    id: "update_col",
    accessorFn: (row) => row.update_col,
  }),
];

export { filterFields, addEditFormFields, schema, columns };










// const OwnersKycCompletedCell = ({ row }) => {
//   const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
//   const numberValue = watch('discount');
//   const attachmentUpload = watch('attachment_upload');
//   const [postOthetRegenrateClientBilling, { isLoading: postOtherRegenrateClientBillingApiIsLoading }] =
//     usePostOtherReGenrateBillingMutation();

//   // const onSubmit = (data) => {
//   //   console.log("Form data:", data);
//   //   console.log("Number input value:", data.discount);
//   //   console.log("Discount value:", data.discount);

//   //   if (data.attachment_upload && data.attachment_upload.length > 0) {
//   //     // Convert FileList to array
//   //     const filesArray = Array.from(data.attachment_upload);

//   //     // Extract file names
//   //     const fileNames = filesArray.map(file => file.name);

//   //     // Create a new object with only the file names
//   //     const newData = {
//   //       ...data,
//   //       attachment_upload: fileNames
//   //     };

//   //     console.log("Form data with only file names:", newData);

//   //     // Perform your form submission with the new data
//   //     // Example: axios.post('/api/submit-form', newData)

//   //     // Show a success toast
//   //     toast.success('Form submitted successfully!');
//   //   } else {
//   //     console.log("No files uploaded");

//   //     // Show a failed toast
//   //     toast.error('Failed to submit form. No files uploaded.');
//   //   }
//   // };



//   // const onSubmit = async (data) => {
//   //   console.log("Form data:", data);
//   //   console.log("Number input value:", data.discount);
//   //   console.log("Discount value:", data.discount);

//   //   try {
//   //     const response = await axios.post('http://192.168.0.186:8001/billing_flow/regenerate_billing', {
//   //       warehouse_client_billing_id: 235,
//   //       discount: data.discount,
//   //       attachment_upload: data.attachment_upload
//   //     });

//   //     console.log("API Response:", response.data);

//   //     // Show a success toast
//   //     toast.success('Form submitted successfully!');
//   //   } catch (error) {
//   //     console.error("Failed to submit form. Error:", error);

//   //     // Show a failed toast
//   //     toast.error('Failed to submit form.');
//   //   }


//   const [isFileUploaded, setIsFileUploaded] = useState(false);
//   // };
//   const [selectedFile, setSelectedFile] = useState(null);
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);

//     // Show a success toast
//     toast.success('File selected successfully!');
//   };
//   const onSubmit = async (data) => {
//     try {
//       let attachmentFileName = null;
//       if (data.attachment_upload && data.attachment_upload.length > 0) {
//         attachmentFileName = data.attachment_upload[0].name;
//       }

//       const newData = {
//         warehouse_client_billing_id: parseInt(row.original.id),
//         discount: parseFloat(data.discount),
//         attachment_upload: attachmentFileName
//       };

//       const response = await postOthetRegenrateClientBilling(newData);

//       console.log("Mutation Response:", response.data);

//       if (response.status === 200) {
//         // Show a success toast
//         toast.success('Form submitted successfully!');

//         // Reload the page after 5 seconds
//         setTimeout(() => {
//           window.location.reload();
//         }, 5000);
//       } else {
//         // Show a failed toast
//         toast.error('Failed to submit form.');
//       }
//     } catch (error) {
//       console.error("Failed to submit form. Error:", error);

//       // Show a failed toast
//       toast.error('Failed to submit form.');
//     }
//   };


// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { usePostOtherReGenrateBillingMutation } from 'your-api-hook';
// import { Box, Button, Flex, Input } from '@chakra-ui/react';
// import { BiUpload } from 'react-icons/bi';
// import { toast } from 'react-toastify';

const OwnersKycCompletedCell = ({ row }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const numberValue = watch('discount');
  const attachmentUpload = watch('attachment_upload');
  console.log(attachmentUpload, "hii")
  const [postOthetRegenrateClientBilling, { isLoading: postOtherRegenrateClientBillingApiIsLoading }] =
    usePostOtherReGenrateBillingMutation();
  const [fileSelected, setFileSelected] = useState(false);
  // const [fileSelected, setFileSelected] = useState(false);

  const onSubmit = async (data) => {

    try {
      let attachmentFileName = null;
      if (data.attachment_upload && data.attachment_upload.length > 0) {
        attachmentFileName = data.attachment_upload[0].name;
      }

      const newData = {
        warehouse_client_billing_id: parseInt(row.original.id),
        discount: parseFloat(data.discount),
        attachment_upload: attachmentFileName
      };

      const response = await postOthetRegenrateClientBilling(newData);

      console.log("Mutation Response:", response.data.status);

      if (response.data.status === 200) {

        toast.success("Discount Applied Succesfully");

        // Reload the page after 5 seconds
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to submit form. Error:", error);

      // Show a failed toast
      toast.error('Failed to submit form.');
    }
  };
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileSelected(true);
      toast.success("File selected successfully");
    } else {
      setFileSelected(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex gap={3} px={2} alignItems={"center"}>
        <Box>
          <Input
            type="number"
            w={"70px"}
            step={0.1}
            placeholder="Discount (%)"
            border={`1px solid ${errors.discount ? 'red' : 'grey'}`}
            {...register('discount', {
              min: { value: 0.1, message: "Please enter a value greater than zero." },
              max: { value: 100, message: "Please enter a value less than or equal to 100." }
            })}
            isDisabled={row.original.is_dehiring}
            sx={{ '::placeholder': { opacity: 0.3 } }}
          //focusBorderColor="primary.700"
          />

        </Box>
        <Flex alignItems={"center"} >
          <Box w="20">Attach File</Box>
          <Box color="primary.700" ml={2} display="flex" alignItems="center">
            {/* <label htmlFor="file-upload">
              <BiUpload fontSize="26px" />
            </label>
            <input
               id={`file-upload-${row.id}`}
              type="file"
              style={{ display: "none" }}
              {...register('attachment_upload')}
              onInput={handleFileChange}

            /> */}
<label style={{ cursor: 'pointer' }}>
  <BiUpload fontSize="26px" />
  <Input
    type="file"
    w={"70px"}
    step={0.1}
    {...register('attachment_upload')}
    onInput={handleFileChange}
    placeholder="Discount (%)"
    border={`1px solid ${errors.discount ? 'red' : 'grey'}`}
    //focusBorderColor="primary.700"
    style={{ display: 'none' }} // Hide the actual file input
  />
</label>

          </Box>
        </Flex>
        <Box>
          <Button
            type="submit"
            backgroundColor={"primary.700"}
            _hover={"primary.700"}
            p={4}
            borderRadius={10}
            textColor={"white"}
            isDisabled={!numberValue || !fileSelected}
            isLoading={postOtherRegenrateClientBillingApiIsLoading}
          >
            Re Genrate Bill
          </Button>
        </Box>
      </Flex>
    </form>
  );
};

export default OwnersKycCompletedCell;




// const OwnersKycCompletedCell = ({ row }) => {
//   const { register, handleSubmit, watch } = useForm();
//   const numberValue = watch('discount');
//   const attachmentUpload = watch('attachment_upload');
//   const [fileSelected, setFileSelected] = useState(false);

//   const onSubmit = async (data) => {
//     try {
//       let attachmentFileName = null;
//       if (data.attachment_upload && data.attachment_upload.length > 0) {
//         attachmentFileName = data.attachment_upload[0].name;
//       }

//       const newData = {
//         warehouse_client_billing_id: parseInt(row.original.id),
//         discount: parseFloat(data.discount),
//         attachment_upload: attachmentFileName
//       };

//       // Assume postOthetRegenrateClientBilling is a function that sends the data to the server
//       const response = await postOthetRegenrateClientBilling(newData);

//       console.log("Mutation Response:", response.data.status);

//       if (response.data.status === 200) {
//         // Reload the page after 5 seconds
//         setTimeout(() => {
//           window.location.reload();
//         }, 5000);
//       }
//     } catch (error) {
//       console.error("Failed to submit form. Error:", error);

//       // Show a failed toast
//       toast.error('Failed to submit form.');
//     }
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files.length > 0) {
//       setFileSelected(true);
//       toast.success("File selected successfully");
//     } else {
//       setFileSelected(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <Flex gap={3} px={2} alignItems={"center"}>
//         <Box>
//           <Input
//             type="number"
//             w={100}
//             step={0.1}
//             placeholder="Discount (%)"
//             border={'1px solid grey'}
//             {...register('discount', {
//               min: { value: 0.1, message: "Please enter a value greater than zero." }
//             })}
//             isDisabled={row.original.is_dehiring}
//             sx={{ '::placeholder': { opacity: 0.3 } }}
//             focusBorderColor="primary.700"
//           />
//         </Box>
//         <Flex alignItems={"center"}>
//           <Box w="20">Attach File</Box>
//           <Box color="primary.700" ml={2} display="flex" alignItems="center">
//             <label htmlFor="file-upload">
//               <BiUpload fontSize="26px" />
//             </label>
//             <input
//               id="file-upload"
//               type="file"
//               style={{ display: "none" }}
//               {...register('attachment_upload')}
//               onChange={handleFileChange}
//             />
//           </Box>
//         </Flex>
//         <Box>
//           <Button
//             type="submit"
//             backgroundColor={"primary.700"}
//             _hover={"primary.700"}
//             p={4}
//             borderRadius={10}
//             textColor={"white"}
//             isDisabled={!numberValue || !attachmentUpload || !fileSelected}
//             isLoading={postOtherRegenrateClientBillingApiIsLoading}
//           >
//             Re Generate Bill
//           </Button>
//         </Box>
//       </Flex>
//     </form>
//   );
// };

// export default OwnersKycCompletedCell;






//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>

//       <Flex gap={3} px={2} alignItems={"center"}>

//         <Box>

//           <Input
//             type="number"
//             w={100}
//             placeholder=" Discount (%)"
//             border={'1px solid grey'}
//             {...register('discount')}
//             isDisabled={row.original.is_dehiring}
//             sx={{ '::placeholder': { opacity: 0.3 } }} // Adjust the opacity value as needed
//             focusBorderColor="primary.700" // Change the color value as neededY

//           />

//         </Box>



//         <Flex alignItems={"center"} >
//           <Box w="20">Attach File</Box>
//           <Box color="primary.700" ml={2} display="flex" alignItems="center">
//             <label htmlFor="file-upload">
//               <BiUpload fontSize="26px" />
//             </label>
//             <input
//               id="file-upload"
//               type="file"
//               style={{ display: "none" }}
//               {...register('attachment_upload')}
//               onChange={handleFileChange}
//             />
//           </Box>
//         </Flex>


//         <Box>

//           <Button
//             type="submit"
//             // width={100}
//             backgroundColor={"primary.700"}
//             _hover={"primary.700"}
//             p={4}
//             borderRadius={10}
//             textColor={"white"}
//             isDisabled={!numberValue || !attachmentUpload}
//           //  isLoading="postOtherRegenrateClientBillingApiIsLoading"
//           >
//             Re Genrate Bill
//           </Button>
//         </Box>

//       </Flex>
//     </form>
//   );
// };









// const [dateValue, setDateValue] = useState(row.original.owner_kyc_completed);
// const isDateValueValid = dateValue !== '';

// const handleChange = (e) => {
//   const newValue = e.target.value;
//   console.log("Value entered:", newValue);
//   setDateValue(newValue);
// };
// useEffect(() => {
//   // Set the value to dehiring_start_date if it exists
//   if (row.original.dehiring_End_date) {
//     setDateValue(row.original.dehiring_End_date);
//   }
// }, [row.original.dehiring_End_date]);

// const handleButtonClick = () => {
//   console.log("Button clicked");
//   console.log("Date value:", dateValue);
//   console.log("Warehouse ID:", row.original.id);

//   // addData({
//   //   warehouse: row.original.id,
//   //   dehire_date: dateValue,
//   // });

// };
// console.log("is_dehiring:", row.original.is_dehiring);

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