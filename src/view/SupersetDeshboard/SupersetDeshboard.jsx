import React, { useEffect, useState } from "react";

import { Box } from "@chakra-ui/react";
// import CustomInput from "../../components/Elements/CustomInput";
// import { FormProvider, useForm } from "react-hook-form";
import { mastersSuperSet } from "../../features/superSet/masters";
import { localStorageService } from "../../services/localStorge.service";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { useParams } from "react-router-dom";
import configuration from "../../config/configuration";

function SupersetDeshboard() {
  const [embeddedUrl, setEmbeddedUrl] = useState("");
  // eslint-disable-next-line
  const [guestTokenData, setGuestTokenData] = useState({});
  const params = useParams();
  console.log(params);

  //fetch access token api calling
  const accessToken = async () => {
    try {
      let obj = {
        username: "admin",
        password: "admin",
        refresh: "true",
        provider: "db",
      };

      const response = await mastersSuperSet.getAccessToken(obj);

      console.log("responseaccessToken", response);
      if (response.status === 200) {
        localStorageService.set("Tokens", response?.data);
      }
    } catch (error) {
      console.error("Error:", error);
      // alert("catch");
    }
  };

  //fetch embedded dashboard URL
  const embeddedDashboardURL = async () => {
    try {
      let obj = {
        data: {
          allowed_domains: [""],
        },
        id: params?.id,
      };
      // data: { },
      const response = await mastersSuperSet.getEmbeddedDashboardUrl(obj);
      console.log("responseembeddedDashboardURL", response);
      setEmbeddedUrl(response.data.result.uuid);
      console.log("embeddedUrl", embeddedUrl);
    } catch (error) {
      console.log("Error:--", error);
    }
  };

  //fetch guestToken api calling
  const guestToken = async () => {
    try {
      console.log("embeddedUrl====>", embeddedUrl);
      let obj = {
        user: {
          username: "admin",
          first_name: "Guest",
          last_name: "Guest",
        },
        resources: [
          {
            type: "dashboard",
            id: embeddedUrl,
          },
        ],
        rls: [],
      };

      const response = await mastersSuperSet.getGuestToken(obj);

      console.log("responseguestToken", response);
      setGuestTokenData(response.data.token);
      return response?.data?.token;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  async function embedSupersetDashboard(guest_token) {
    // const loginAccessToken = localStorageService.get("Tokens")?.access_token;
    const guestToken = guest_token;
    // const embeddedDashboardUrl = await fetchEmbeddedDashboardUrl(loginAccessToken);

    embedDashboard({
      id: embeddedUrl,
      supersetDomain: configuration.SUPERSET_BASE_URL,
      mountPoint: document.getElementById("my-superset-container"),
      fetchGuestToken: () => guestToken,
      dashboardUiConfig: {
        hideTitle: true,
        hideChartControls: false,
        hideTab: false,
        filters: {
          expanded: false,
        },
      },
    });
  }

  useEffect(() => {
    accessToken();
    embeddedDashboardURL();

    //  guestToken();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (embeddedUrl) {
      let guest_token = guestToken();
      embedSupersetDashboard(guest_token);
    }
    // eslint-disable-next-line
  }, [embeddedUrl]);

  return (
    <Box>
      <Box>
        <Box id="my-superset-container"></Box>
      </Box>
    </Box>
  );
}

export default SupersetDeshboard;

// const obj = {};

// response.forEach(item => {
//   const [category, label] = item.dashboard_title.split("__");

//   if (!obj[category]) {
//     obj[category] = [];
//   }

//   obj[category].push({
//     label: label.trim(),
//     link: item.url,
//     id: item.id,
//   });
// });

// console.log(obj);
