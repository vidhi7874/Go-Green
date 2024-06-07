import React from "react";
import { AiOutlineCloudDownload, AiOutlineDownload } from "react-icons/ai";
import JSZip from "jszip";
import { Button } from "@chakra-ui/react";
import configuration from "../config/configuration";

const DownloadFilesFromUrl = ({
  details,
  label = "",
  iconFontSize = "26px",
}) => {
  const paths = details?.paths || [];
  const downloadUrls = paths.map((path) => `${configuration.BASE_URL}${path}`);

  const downloadFiles = async () => {
    if (paths.length === 1) {
      const singleFilePath = paths[0];
      const singleFileUrl = downloadUrls[0];
      downloadSingleFile(singleFilePath, singleFileUrl);
    } else {
      const zipBlob = await createZip(paths, downloadUrls);
      const zipFileName = "downloaded_files.zip";

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(zipBlob);
      link.download = zipFileName;
      link.setAttribute("download", zipFileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    }
  };

  const downloadSingleFile = (filePath, fileUrl) => {
    fetch(fileUrl, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const fileName = filePath.split("/").pop();
        const url = window.URL.createObjectURL(new Blob([blob]));

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error("Download error:", error);
      });
  };

  const createZip = async (fileNames, urls) => {
    const zip = new JSZip();

    // Add each file to the zip
    for (let i = 0; i < fileNames.length; i++) {
      const fileName = fileNames[i];
      const url = urls[i];

      // Fetch the file content
      const response = await fetch(url);
      const blob = await response.blob();

      // Add the file to the zip
      zip.file(fileName, blob);
    }

    // Generate the zip file as a Blob
    const zipBlob = await zip.generateAsync({ type: "blob" });

    return zipBlob;
  };

  return (
    <>
      {label === "" ? (
        <AiOutlineDownload
          onClick={() => downloadFiles()}
          fontSize={iconFontSize || "26px"}
          cursor="pointer"
        />
      ) : (
        <Button
          bg="#A6CE39"
          _hover={{}}
          color="white"
          padding="0px 20px"
          borderRadius={"50px"}
          isDisabled={paths?.length === 0}
          type="button"
          marginTop={"20px"}
          onClick={() => downloadFiles()}
          leftIcon={<AiOutlineCloudDownload fontSize="26px" cursor="pointer" />}
        >
          {label}
        </Button>
      )}
    </>
  );
};

export default DownloadFilesFromUrl;
