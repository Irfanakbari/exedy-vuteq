import {BiFullscreen} from "react-icons/bi";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {showErrorToast} from "@/utils/toast";

export default function Dashboard() {
    const elemRef = useRef(null);


    // useEffect(()=>{
    //     // fetchData()
    //     const interval = setInterval(fetchData, 3000); // Panggil fetchData setiap 3 detik
    //
    //     return () => {
    //         clearInterval(interval); // Hentikan interval saat komponen dibongkar
    //     };
    // },[])

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/dashboard');
        } catch (error) {
            showErrorToast("Gagal Fetch Data");
        }
    }
    const enterFullscreen = () => {
        if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
            // Saat ini dalam mode fullscreen, keluar dari fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
            // Tidak dalam mode fullscreen, masuk ke fullscreen
            const elem = elemRef.current;

            if (elem) {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                }
            }
        }
    };

    return(
        <div className={`bg-white h-full`} ref={elemRef}>
            <div className={`bg-[#2589ce] py-1.5 px-2 text-white flex flex-row justify-between`}>
                <div className={`flex flex-row justify-between w-full mr-1 items-center`}>
                    <h2 className={`font-bold text-[18px]`}>PT VUTEQ INDONESIA</h2>
                </div>
                <div
                    onClick={enterFullscreen}
                    className={`flex items-center`}>
                    <BiFullscreen size={20}/>
                </div>
            </div>
            <div className={`w-full p-2`}>

            </div>
        </div>
    )
}