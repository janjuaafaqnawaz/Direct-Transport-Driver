import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { registerIndieID } from "native-notify";
import LoadingScreen from "@/components/LoadingScreen";
import useGlobalContext from "@/context/GlobalProvider";
import { remove } from "@/lib/SecureStore/SecureStore";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const APP_ID = 23374;
const APP_TOKEN = "hZawrJYXBzBbQZgTgLVsZP";

export default function Index() {
  // registerNNPushToken(23374, "hZawrJYXBzBbQZgTgLVsZP");
  const { isLoggedIn, isLoading, user } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    const handleNavigationAndSplash = async () => {
      console.log({ user });

      try {
        if (!isLoading && user) {
          if (isLoggedIn) {
            const regis = await registerIndieID(user.email, APP_ID, APP_TOKEN);
            // console.log(user.email, { regis, user, APP_ID, APP_TOKEN });
            router.replace("Home");
          } else {
            router.replace("signin");
          }
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error("Navigation error:", error);
        await remove("user");
        router.replace("signin");
        await SplashScreen.hideAsync();
      }
    };

    if (!isLoading) {
      handleNavigationAndSplash();
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <LoadingScreen />;
}
