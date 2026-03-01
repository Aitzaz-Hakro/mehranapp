"use client";
import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function OneSignalInit() {
  useEffect(() => {
    OneSignal.init({
      appId: "b09bf568-29e7-4551-b3ec-6115d9684f69",
      allowLocalhostAsSecureOrigin: true,
      notifyButton: {
        enable: true,
      },
    });
  }, []);

  return null;
}