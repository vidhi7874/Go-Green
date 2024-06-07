import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { columns, filterFields } from "./field";
import { useNavigate } from "react-router-dom";
import { BiEditAlt } from "react-icons/bi";
import { createColumnHelper } from "@tanstack/react-table";
import { Flex, Text } from "@chakra-ui/react";
import { setUpFilterFields } from "../../features/filter.slice";
import ROUTE_PATH from "../../constants/ROUTE";
import { useGetRegionMasterMutation } from "../../features/master-api-slice";
import FunctionalTable from "../../components/Tables/FunctionalTable";
import NotaccessImage from "../../components/NotAccessImage/NotaccessImage";
import { useGetClientBillingMutation } from "../../features/billing.slice";
import JSZip from "jszip";
import configuration from "../../config/configuration";

export default function ClientBillingComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigation = useNavigate();

  const filterQuery = useSelector(
    (state) => state.dataTableFiltersReducer.filterQuery
  );

  const columnHelper = createColumnHelper();

  const [pagePerm, setPagePerm] = useState({
    view: true,
    edit: false,
    add: false,
  });

  const [filter, setFilter] = useState({
    page: 1,
    totalPage: 1,
    limit: 25,
    totalFilter: 0,
    total: 0,
    add: false,
    download:true,
    modal: "WarehouseClientBilling",
    excelDownload: "WarehouseClientBilling",
  });

  const [viewColumns, setViewColumns] = useState(columns);

  const tableFilterSet = () => {
    dispatch(setUpFilterFields({ fields: filterFields }));
  };

  const [data, setData] = useState([]);
  let paramString = "";
  //Add Form Link Function Start
  const addForm = () => {
    navigate(`${ROUTE_PATH.CLIENT_BILLING_ADD}`);
  };
  //Add Form Link Function End

  //Edit Form Link Function Start
  const editForm = (info) => {
    // console.log(
    //   // "info.row.original.id kunal>>",
    //   `${ROUTE_PATH.CLIENT_BILLING_EDIT}/${info.row.original.id}`,
    //   info.row.original.id
    // );
    navigation(`${ROUTE_PATH.CLIENT_BILLING_EDIT}/${info.row.original.id}`, {
      state: { details: info.row.original },
    });
  };




  //Edit Form Link Function End

  //Region Master Get Api Start
  const [getClientBilling, { isLoading: getClientBillingApiIsLoading }] =
  useGetClientBillingMutation();

  const getData = async () => {
    paramString = Object.entries(filter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value
            .map((item) => `${key}=${encodeURIComponent(item)}`)
            .join("&");
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join("&");

    try {
      let query = filterQuery ? `${paramString}&${filterQuery}` : paramString;
      const response = await getClientBilling(query).unwrap();
      console.log("Success:", response);
      setData(response?.results || []);

      setPagePerm({
        view: response?.view || false,
        add: false,
        edit: false,
      });

      setFilter((old) => ({
        ...old,
        totalPage: Math.ceil(response?.total / old.limit),
        total: response?.total_data,
        totalFilter: response?.total,
        add: false,
        excelDownload: filterQuery ? `${old.modal}&${filterQuery}` : old.modal,
      }));
    } catch (error) {
      console.error("Error:", error);
      setPagePerm({
        // view: false,
        view: true,
        add: false,
        edit: false,
      });
    }
  };

  useEffect(() => {
    tableFilterSet();
    getData();
    // eslint-disable-next-line
  }, [filter.limit, filter.page, filterQuery]);
  // const downloadzip = () => {

  // };


// const downloadzip = async () => {
//   try {
//     const { data } = await getClientBilling();

//     // Check if data.results is an array
//     if (!Array.isArray(data.results)) {
//       console.error('Data.results is not an array:', data.results);
//       return;
//     }

//     const zip = new JSZip();

//     // Add each file to the zip
//     data.results.forEach((item) => {
//       const invoiceNumber = item.invoice_number.replace(/\//g, '_'); // Replace '/' with '_' in the invoice number
//       zip.file(`${invoiceNumber}.json`, JSON.stringify(item));
//     });

//     // Generate the zip file
//     const content = await zip.generateAsync({ type: 'blob' });

//     // Create a download link
//     const url = URL.createObjectURL(content);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'data.zip';

//     // Trigger the download
//     document.body.appendChild(a);
//     a.click();

//     // Clean up
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error('Error downloading zip file:', error);
//   }
// };
// const downloadzip = async () => {
//   try {
//     const { data } = await getClientBilling();

//     if (!Array.isArray(data.results)) {
//       console.error('Data.results is not an array:', data.results);
//       return;
//     }

//     const zip = new JSZip();

//     const fetchAndAddPromises = [];

//     data.results.forEach((item) => {
//       const billPath = item.bill_path;
//       if (billPath) { // Check if billPath is not null or undefined
//         const promise = fetch(billPath)
//           .then(response => {
//             if (!response.ok) {
//               throw new Error(`Failed to fetch ${billPath}: ${response.statusText}`);
//             }
//             return response.blob();
//           })
//           .then(blob => {
//             const fileName = billPath.split('/').pop();
//             zip.file(fileName, blob);
//           });
//         fetchAndAddPromises.push(promise);
//       } else {
//         console.error('Bill path is null or undefined for item:', item);
//       }
//     });

//     await Promise.all(fetchAndAddPromises);

//     const content = await zip.generateAsync({ type: 'blob' });

//     const url = URL.createObjectURL(content);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'files.zip';

//     document.body.appendChild(a);
//     a.click();

//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error('Error downloading zip file:', error);
//   }
// };
const fetchBillingData = async () => {
  // Make API call to getClientBilling to get the data
  const response = await getClientBilling();
  console.log(response.data.results,"hiiii")
  return response.data.results;
  // Assuming response.data contains the billing data
  console.log(response)
};

const downloadZip = async () => {
  const billingData = await fetchBillingData();
  const zip = new JSZip();

  if (Array.isArray(billingData)) {
    // Array to store promises for each file download
    const downloadPromises = [];

    // Define the base URL
    const BASE_URL = `${configuration.BASE_URL}`;

    // Iterate over the billingData array and add each PDF file to the zip
    billingData.forEach(({ bill_path }) => {
      if (bill_path && bill_path.endsWith('.pdf')) {
        // Construct the download URL
        const downloadUrl = `${BASE_URL}${bill_path}`;
        // Extract the file name from the bill_path
        const fileName = bill_path.split('/').pop();
        // Push the download promise to the array
        downloadPromises.push(
          fetch(downloadUrl)
            .then((response) => response.blob())
            .then((blob) => {
              // Add the file to the zip
              zip.file(fileName, blob);
            })
        );
      }
    });

    // Wait for all PDF files to be added to the zip
    await Promise.all(downloadPromises);
  }

  // Generate the zip file
  const zipBlob = await zip.generateAsync({ type: 'blob' });

  // Create a download link for the zip file
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'billing_files.zip';

  // Trigger the download
  link.click();

  // Clean up
  URL.revokeObjectURL(url);
};

// const fetchBillingData = async (filterQuery) => {
//   try {
//     const response = await getClientBilling(filterQuery).unwrap();
//     return response?.data?.results || [];
//   } catch (error) {
//     console.error('Error fetching billing data:', error);
//     return []; // Return an empty array or handle the error as needed
//   }
// };


// const downloadZip = async (filterQuery) => {
//   const billingData = await fetchBillingData(filterQuery);
//   const zip = new JSZip();

//   if (Array.isArray(billingData)) {
//     const downloadPromises = [];

//     const BASE_URL = `${configuration.BASE_URL}`;

//     billingData.forEach(({ bill_path }) => {
//       if (bill_path && bill_path.endsWith('.pdf')) {
//         const downloadUrl = `${BASE_URL}${bill_path}`;
//         const fileName = bill_path.split('/').pop();
//         downloadPromises.push(
//           fetch(downloadUrl)
//             .then((response) => {
//               if (!response.ok) {
//                 throw new Error(`Failed to fetch ${downloadUrl}: ${response.status} ${response.statusText}`);
//               }
//               return response.blob();
//             })
//             .then((blob) => {
//               if (blob.size === 0) {
//                 throw new Error(`Empty file: ${downloadUrl}`);
//               }
//               console.log(`Adding file ${fileName} to zip`);
//               zip.file(fileName, blob);
//             })
//             .catch((error) => {
//               console.error(`Error downloading ${downloadUrl}:`, error);
//             })
//         );
//       }
//     });

//     await Promise.all(downloadPromises);
//   }

//   console.log('Generating zip file');
//   const zipBlob = await zip.generateAsync({ type: 'blob' });

//   const url = URL.createObjectURL(zipBlob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = 'billing_files.zip';

//   link.click();

//   URL.revokeObjectURL(url);
// };




// const getDatafiltered = async () => {
//   let paramString = Object.entries(filter)
//     .map(([key, value]) => {
//       if (Array.isArray(value)) {
//         return value
//           .map((item) => `${key}=${encodeURIComponent(item)}`)
//           .join('&');
//       }
//       return `${key}=${encodeURIComponent(value)}`;
//     })
//     .join('&');

//   try {
//     let query = filterQuery ? `${paramString}&${filterQuery}` : paramString;
//     const response = await getClientBilling(query).unwrap();
//     setData(response?.results || []);

//     setPagePerm({
//       view: response?.view || false,
//       add: false,
//       edit: false,
//     });

//     setFilter((old) => ({
//       ...old,
//       totalPage: Math.ceil(response?.total / old.limit),
//       total: response?.total_data,
//       totalFilter: response?.total,
//       add: false,
//       excelDownload: filterQuery ? `${old.modal}&${filterQuery}` : old.modal,
//     }));
//   } catch (error) {
//     console.error('Error:', error);
//     setPagePerm({
//       view: true,
//       add: false,
//       edit: false,
//     });
//   }
// };

// useEffect(() => {
//   tableFilterSet();
//   getDatafiltered();
//   // eslint-disable-next-line
// }, [filter.limit, filter.page, filterQuery]);

// // Call downloadZip with filterQuery when needed, for example, in a button click event handler
// const handleDownloadButtonClick = () => {
//   downloadZip(filterQuery);
// };







// Call downloadZip function when downloadFile is clicked


// // Call downloadZip function when downloadFile is clicked
// const downloadFile = () => {
//   downloadZip();
// };










  return (
    <div>
      {pagePerm?.view ? (
        <FunctionalTable
          filter={filter}
          filterFields={filterFields}
          setFilter={setFilter}
          columns={viewColumns}
          data={data}
          loading={getClientBillingApiIsLoading}
          addForm={() => addForm()}
          downloadFile={() => downloadZip()}
        />
      ) : (
        <>
          <NotaccessImage />
          {/* <Text as="h3" color="black" fontWeight="800">
            You do not have access to this page{" "}
          </Text> */}
        </>
      )}
    </div>
  );
}
