import { useState } from "react";
import UserIdentification from "../components/UserIdentification.new";
import ChatInterface from "../components/ChatInterface.new";
import type { UserInfo } from "../types/api";

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const handleUserComplete = (info: UserInfo) => {
    setUserInfo(info);
  };

  const handleBackToIdentification = () => {
    setUserInfo(null);
  };

  return (
    <>
      {!userInfo ? (
        <UserIdentification onComplete={handleUserComplete} />
      ) : (
        <ChatInterface
          userInfo={userInfo}
          onBack={handleBackToIdentification}
        />
      )}
    </>
  );
}
