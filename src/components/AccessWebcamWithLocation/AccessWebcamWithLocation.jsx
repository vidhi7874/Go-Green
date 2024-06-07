import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  IconButton,
  Image,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { MdDelete } from "react-icons/md";

const AccessWebcamWithLocation = () => {
  const webcamRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const watchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    watchLocation();

    if ("geolocation" in navigator) {
      var options = {
        enableHighAccuracy: true, // Request high accuracy
        timeout: 5000, // Set a timeout (in milliseconds) for the request
        maximumAge: 0, // Force the device to get a fresh location
      };

      navigator.geolocation.getCurrentPosition(
        function (position) {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;

          console.log("Latitude --->: " + latitude);
          console.log("Longitude ----> : " + longitude);
        },
        function (error) {
          console.log("Error retrieving location: " + error.message);
        },
        options
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  // const capture = () => {
  //   const imageSrc = webcamRef.current.getScreenshot();
  //   console.log("Captured image:", imageSrc);
  // };

  const capture = () => {
    const imageSrc = webcamRef?.current?.getScreenshot();
    if (imageSrc) {
      const blob = dataURLtoBlob(imageSrc);
      const blobUrl = URL.createObjectURL(blob);
      setCapturedImage(blobUrl);
    }
  };

  // Helper function to convert Data URL to Blob
  const dataURLtoBlob = (dataURL) => {
    const parts = dataURL.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const byteString = atob(parts[1]);
    let arrayBuffer = new ArrayBuffer(byteString.length);
    let uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: contentType });
  };

  return (
    <Box w="full">
      <h1>Webcam Location App</h1>
      {location ? (
        <div>
          <Webcam audio={false} ref={webcamRef} />
          <p>
            Current Location: {location.latitude}, {location.longitude}
          </p>
          <button onClick={capture}>Capture</button>
        </div>
      ) : (
        <p>Loading location...</p>
      )}

      <Card align="center">
        <CardHeader>
          <Heading size="md"> </Heading>
        </CardHeader>
        <CardBody>
          <Box>
            {capturedImage ? (
              <Box
                border="1px"
                borderColor={"primary.700"}
                borderRadius={10}
                display="flex"
                boxSize="sm"
              >
                <Image src={capturedImage} alt="img" />
              </Box>
            ) : (
              <Box
                height={310}
                border="1px"
                borderColor={"primary.700"}
                borderRadius={10}
              >
                <Webcam audio={false} ref={webcamRef} />
              </Box>
            )}
          </Box>
        </CardBody>
        <CardFooter>
          {capturedImage ? (
            <IconButton
              variant="outline"
              colorScheme="teal"
              aria-label="Call Sage"
              fontSize="20px"
              icon={<MdDelete />}
              onClick={() => setCapturedImage(null)}
            />
          ) : (
            <Button
              _hover={{}}
              onClick={capture}
              color="white"
              bg="primary.700"
            >
              Capture
            </Button>
          )}
        </CardFooter>
      </Card>
    </Box>
  );
};

export default AccessWebcamWithLocation;

// import React, { useRef, useState } from 'react';

// const MyComponent = () => {
//   const webcamRef = useRef(null);
//   const [capturedImage, setCapturedImage] = useState(null);

//   const capture = () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     const blob = dataURLtoBlob(imageSrc);
//     const blobUrl = URL.createObjectURL(blob);
//     setCapturedImage(blobUrl);
//   };

//   // Helper function to convert Data URL to Blob
//   const dataURLtoBlob = dataURL => {
//     const parts = dataURL.split(';base64,');
//     const contentType = parts[0].split(':')[1];
//     const byteString = atob(parts[1]);
//     let arrayBuffer = new ArrayBuffer(byteString.length);
//     let uint8Array = new Uint8Array(arrayBuffer);
//     for (let i = 0; i < byteString.length; i++) {
//       uint8Array[i] = byteString.charCodeAt(i);
//     }
//     return new Blob([arrayBuffer], { type: contentType });
//   };

//   return (
//     <div>
//       <video ref={webcamRef} autoPlay />
//       <button onClick={capture}>Capture Image</button>
//       {capturedImage && <img src={capturedImage} alt="Captured" />}
//     </div>
//   );
// };

// export default MyComponent;
