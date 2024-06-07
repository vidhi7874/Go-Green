import { useState, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { Offline, Online } from "react-detect-offline";
import routes from "./routes/routes";
import { Box } from "@chakra-ui/react";
// import useNetworkStatus from "./hooks/useNetworkStatus";
import { MotionSlideDown } from "./utils/animation";

const messages = {
  online: "You are online",
  offline: "You are offline. Please check your internet connection.",
};

function App() {
  const element = useRoutes(routes);

  const [offlineMessage, setOfflineMessage] = useState("");
  const [onlineMessage, setOnlineMessage] = useState("");

  // useEffect(() => {
  //   const hideMessage = () => {
  //     setOfflineMessage("");
  //     setOnlineMessage("");
  //   };

  //   if (offlineMessage || onlineMessage) {
  //     const timeoutId = setTimeout(hideMessage, 2000);

  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [offlineMessage, onlineMessage]);

  return (
    <>
      <div>
        <Online onChange={() => setOnlineMessage(messages?.online)}>
          {onlineMessage && <ShowMsg msg={onlineMessage} isOnline={true} />}
        </Online>

        <Offline onChange={() => setOfflineMessage(messages?.offline)}>
          {offlineMessage && <ShowMsg msg={offlineMessage} isOnline={false} />}
        </Offline>
      </div>
      {element}
    </>
  );
}

export default App;

const ShowMsg = ({ msg, isOnline }) => {
  return (
    <MotionSlideDown duration={0.5} delay={0.5}>
      <Box
        data-aos="fade-down"
        textAlign="center"
        p="1"
        bgColor={`${isOnline ? "primary.700" : "red.50"}`}
        position="absolute"
        color={"white"}
        fontSize={18}
        top="0"
        left="0"
        width="100%"
      >
        {msg}
      </Box>
    </MotionSlideDown>
  );
};
// You are online
