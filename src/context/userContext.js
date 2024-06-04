"use client"

import { authUser } from "../lib/request"
import React, { createContext, useContext, useEffect, useState } from "react"

const UserContext = createContext({
    user: undefined,
    setUser: () => {},
    authorized: false,
    logOut: () => {},
    fetchUser: async () => false,
    userLogging: false,
    setUserLogging: () => {},
});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);
    const [authorized, setAuthorized] = useState(false);
    const [userLogging, setUserLogging] = useState(false);

    const fetchUser = async () => {
        try {
            const data = await authUser();
            if (data) {
                setUser(data.user);
                if (data.user.id) {
                    setAuthorized(true);
                    return true;
                } else {
                    setUser(null);
                    setAuthorized(false);
                    return false;
                }
            } else {
                setUser(null);
                setAuthorized(false);
                return false;
            }
        } catch (error) {
            console.error("Authentication failed:", error);
            setUser(null);
            setAuthorized(false);
            return false;
        }
    }

    const logOut = () => {
        setUser(null);
        setAuthorized(false);
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider
            value={{ user, setUser, authorized, logOut, fetchUser, userLogging, setUserLogging }}
        >
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);
