import { useContext, useState, createContext, useEffect } from "react";
import { render } from "react-dom";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

export const QueueContext = createContext(null);
export default function NotificationBanner({ children }) {
  const [notificationQueue, setNotificationQueue] = useState([]);

  const bannerShow = (val) => {
    const notificationTimer = 3000;
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: "Success",
      autoClose: notificationTimer,
      textBody: val + " successfully downloaded",
      onHide: () => {
        setTimeout(() => setNotificationQueue((prev) => prev.slice(1)), 500);
      },
    });
  };
  const pushToQueue = (val) => setNotificationQueue((prev) => [...prev, val]);
  //   const pushToQueueContext = createContext(pushToQueue);
  useEffect(() => {
    console.log("USE ACTIVATED");
    if (notificationQueue.length === 0) return;
    console.log("past if ");
    console.log(notificationQueue);
    bannerShow(notificationQueue[0]);
  }, [notificationQueue]);
  //   useEffect(() => {
  //     console.log("caled");
  //     Toast.show({
  //       type: ALERT_TYPE.SUCCESS,
  //       title: "Success",
  //       textBody: "Welcome to the App",
  //     });
  //   }, []);

  return (
    <AlertNotificationRoot>
      <QueueContext.Provider value={pushToQueue}>
        {children}
      </QueueContext.Provider>
    </AlertNotificationRoot>
  );
}
