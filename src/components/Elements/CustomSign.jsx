import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import React, { useRef, useEffect, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { usePostFileUploadMutation } from "../../features/master-api-slice";
import { showToastByStatusCode } from "../../services/showToastByStatusCode";

function CustomSign({
  onChange,
  fileuplaod_folder_structure = {},
  showErr,
  url,
  InputDisabled = false,
}) {
  const sigCanvas = useRef({});
  const [autoFillUrl, setAutoFillUrl] = useState("");

  const [fileUploadHandle] = usePostFileUploadMutation();

  const SaveCanvas = async () => {
    // console.log(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
    // setImgValue(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
    console.log(document.getElementById("signature_file"));

    const dataURL = sigCanvas?.current
      ?.getTrimmedCanvas()
      .toDataURL("image/png");
    console.log(dataURL);
    const blob = await dataURLtoBlob(dataURL);

    const file = new File([blob], "signature.png", { type: "image/png" });

    function dataURLtoBlob(dataURL) {
      const parts = dataURL.split(";base64,");
      const contentType = parts[0].split(":")[1];
      const byteCharacters = atob(parts[1]);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: contentType });
    }

    try {
      if (sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")) {
        const formData = new FormData();
        formData.append("file_path", file);
        formData.append("type", fileuplaod_folder_structure?.type);
        formData.append("subtype", fileuplaod_folder_structure?.subtype);
        const response = await fileUploadHandle(formData).unwrap();

        console.log(response, "file");
        if (response?.status === 200) {
          onChange(response?.data || "");
        }
      }
    } catch (error) {
      let errorMessage =
        error?.data?.data ||
        error?.data?.message ||
        error?.data ||
        "Signature Catcher Failed";
      console.log("Error:", errorMessage);
      toasterAlert({
        message: JSON.stringify(errorMessage),
        status: 440,
      });
      console.error("Error:", error);
    }
  };

  const clear = () => {
    if (autoFillUrl) {
      setAutoFillUrl(null);
    } else {
      onChange("");
      sigCanvas?.current?.clear();
    }
  };

  const toasterAlert = (obj) => {
    let msg = obj?.message;
    let status = obj?.status;
    console.log("toasterAlert", obj);
    if (status === 400) {
      const errorData =
        obj?.data?.message ||
        obj?.data?.data ||
        obj?.data ||
        "Photo Catcher Failed";
      let errorMessage = "";

      Object.keys(errorData)?.forEach((key) => {
        const messages = errorData[key];
        console.log("messages --> ", messages);
        if (typeof messages === "object") {
          messages &&
            messages?.forEach((message) => {
              errorMessage += `${key} : ${message} \n`;
            });
        } else {
          showToastByStatusCode(status, msg);
        }
      });
      showToastByStatusCode(status, errorMessage);
      return false;
    } else if (status === 410) {
      showToastByStatusCode(status, msg);
    }
    showToastByStatusCode(status, msg);
  };

  useEffect(() => {
    // sigCanvas?.current?.fromDataURL(url);
    setAutoFillUrl(url);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Box>
        <Box border={"1px solid #000"}>
          {autoFillUrl ? (
            <Box>
              <Image
                src={autoFillUrl}
                width="400"
                height="200"
                alt="signatures"
              />
            </Box>
          ) : (
            <SignaturePad
              penColor="green"
              ref={sigCanvas}
              canvasProps={{
                width: 500,
                height: 200,
                className: "signatureCanvas",
              }}
            />
          )}
        </Box>
        <Flex gap="10px" mb="10px">
          {!autoFillUrl && (
            <Button
              onClick={() => {
                SaveCanvas();
              }}
            >
              Save{" "}
            </Button>
          )}

          <Button
            isDisabled={InputDisabled}
            onClick={() => {
              clear();
            }}
          >
            Clear
          </Button>
        </Flex>
        {showErr ? (
          <Text fontSize={"10px"} color="red" textAlign={"left"}>
            {" "}
            Please Upload Signature{" "}
          </Text>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}

export default CustomSign;
