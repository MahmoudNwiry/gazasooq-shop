import { create } from "zustand/react";
import axios from 'axios'
import axiosInstance from "../utils/axiosInstance";

interface ShopState {
    shopdata: {
        name: string;
        owner: {
            name: string;
            id: string;
        };
        address: {
            governorate: string;
            area: string;
            details: string;
        }
        id: string;
        phoneNumber: string;
        logo: string;
        token: string;
    } | null;
    loading : boolean;
    isLoading : (value : boolean) => void; 
    isLoggedIn: boolean;
    setLoggedIn: (value : boolean ) => void;
    error : string | null;
    setShopData: (data: {id : string, name: string; owner: {name: string, id: string}, phoneNumber: string; token: string; logo: string, address: {governorate: string; area: string; details: string} }) => void;
    logout: () => void;
    fetchShopData: () => Promise<void | { success: boolean; errorType?: string; message?: string }>;
}

export const useShopStore = create<ShopState>((set) => ({
    shopdata: null,
    error: null,
    loading: false,
    isLoggedIn: false,
    setShopData: (data) => {
        set({ shopdata: data, isLoggedIn: true });
    },
    logout() {
        set({ shopdata: null, isLoggedIn: false });
    },
    setLoggedIn(value) {
        set({isLoggedIn : value})
    },
    isLoading : (value) => {
        set({loading : value})
    },
    fetchShopData: async () => {
        try {
            const getToken = JSON.parse(localStorage.getItem("sooq-token") as string);
            
            if(!getToken) {
                localStorage.removeItem("sooq-isLoggedIn")
                localStorage.removeItem("sooq-token")
                throw new Error("Faild to get token")
            }
            const response = await axiosInstance.get(`/shop/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    authorization: `Bearer ${getToken}`,
                },
            })
            

            if (response.status !== 200) {
                set({ shopdata: null, isLoggedIn: false });
                throw new Error("Failed to fetch user data");
            }


            const data = {
                id: response.data.shop.shopId,
                name: response.data.shop.name,
                owner: {
                    name : response.data.shop.owner.name,
                    id : response.data.shop.owner.id,
                },
                phoneNumber: response.data.shop.phoneNumber,
                logo: response.data.shop.logo,
                address : {
                    governorate: response.data.shop.address.governorate,
                    area: response.data.shop.address.area,
                    details: response.data.shop.address.details
                },
                token: getToken as string
            };

            set({shopdata : data, isLoggedIn: true });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.status === 500) {
                    set({ error: "Network Error. Please check your connection." });
                } else if (error.response) {
                    set({ shopdata: null, isLoggedIn: false });
                }
            }
        }
    }
}))
