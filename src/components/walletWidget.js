"use client";

import React from "react";
import { useUser } from "../context/userContext";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
// import { useRouter } from "next/navigation";

export default function DynamicConnectButton() {
    const { user, authorized, userLogging, setUserLogging } = useUser();
    const { setShowAuthFlow } = useDynamicContext();
    const { primaryWallet } = useDynamicContext();

    // const router = useRouter();

    return (
        <>
           <DynamicWidget />
        </>
    );
}
