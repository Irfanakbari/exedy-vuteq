import Head from "next/head";
import HeadTitle from "@/components/Head/HeadTitle";
import {useEffect, useState} from "react";
import Customer from "@/components/Page/Master/Customer";
import Dashboard from "@/components/Page/Master/Dashboard";
import {ImCross} from "react-icons/im";
import Pallet from "@/components/Page/Master/Pallet";
import LapRiwayat from "@/components/Page/Laporan/LapRiwayat";
import LapMaintenance from "@/components/Page/Laporan/LapMaintenance";
import User from "@/components/Page/Master/User";
import {getCookie} from "cookies-next";
import axios from "axios";
import Vehicle from "@/components/Page/Master/Vehicle";
import Part from "@/components/Page/Master/Part";
import useStoreTab from "@/utils/home_state";
import MainMenu from "@/components/Menu/MainMenu";
import {laporan, master, transaksi} from "@/components/Menu/ListMenu";
import CustomerDetail from "@/components/Page/Master/CustomerDetail";
import {customerState} from "@/utils/states";
import {showErrorToast} from "@/utils/toast";
import BarangType from "@/components/Page/Master/BarangType";
import BarangJenis from "@/components/Page/Master/BarangJenis";
import BarangGroup from "@/components/Page/Master/BarangGroup";
import BarangSegment from "@/components/Page/Master/BarangSegment";
import BarangSatuan from "@/components/Page/Master/BarangSatuan";
import BarangMaster from "@/components/Page/Master/BarangMaster";
import TarifPacking from "@/components/Page/Master/TarifPacking";
import Gudang from "@/components/Page/Master/Gudang";
import Operator from "@/components/Page/Master/Operator";
import BillOfMaterials from "@/components/Page/Master/BillOfMaterials";
import IncomingMaterial from "@/components/Page/Transaksi/IncomingMaterial";
import PackingList from "@/components/Page/Transaksi/PackingList";
import HasilPacking from "@/components/Page/Transaksi/HasilPacking";

export default function Home() {
    const [user, setUser] = useState({})
    const { listTab, setCloseTab, activeMenu, setActiveMenu } = useStoreTab();
    const {setCustomer,setOperator,setTarifPacking,setBarangMaster,setBarangMasterAll, setListSubCustomer,setBarangType,setBarangSegment,setBarangSatuan,setBarangJenis,setBarangGroup} = customerState()


    useEffect(()=>{
        getCurrentUser()
        fetchDataCustomer()
    },[])

    const fetchDataCustomer = async () => {
        try {
            const response = await axios.get('/api/customers');
            setCustomer(response.data['data']);
            const response2 = await axios.get('/api/customers/details');
            setListSubCustomer(response2.data['data']);
            const response3 = await axios.get('/api/barang/type');
            setBarangType(response3.data['data']);
            const response4 = await axios.get('/api/barang/segment');
            setBarangSegment(response4.data['data']);
            const response5 = await axios.get('/api/barang/satuan');
            setBarangSatuan(response5.data['data']);
            const response6 = await axios.get('/api/barang/jenis');
            setBarangJenis(response6.data['data']);
            const response7 = await axios.get('/api/barang/group');
            setBarangGroup(response7.data['data']);
            const response8 = await axios.get('/api/barang/master?page=1');
            setBarangMaster(response8.data['data']);
            const response9 = await axios.get('/api/barang/master');
            setBarangMasterAll(response9.data['data'])
            const response10 = await axios.get('/api/tarif');
            setTarifPacking(response10.data['data'])
            const response11 = await axios.get('/api/operator');
            setOperator(response11.data['data'])
        } catch (error) {
            showErrorToast("Gagal Fetch Data");
        }
    };

    function getCurrentUser(){
        axios.get('/api/auth/user').then((user)=>setUser(user.data['data']))
    }

    return (
        <>
            <Head>
                <title>Home | PT Vuteq Indonesia</title>
            </Head>
            <div className={`p-2 h-screen w-full flex`}>
                <div className={`w-full bg-white border border-gray-500 h-full flex flex-col`}>
                    <HeadTitle user={user} />
                    <div className={`p-2`}>
                        <div className={`flex bg-[#EBEBEB] text-sm font-bold`}>
                            <MainMenu data={master} title={'Master Data'}/>
                            <MainMenu data={transaksi} title={'Transaksi'}/>
                            <MainMenu data={laporan} title={'Laporan'}/>
                        </div>
                    </div>
                    <div className={`bg-[#3da0e3] w-full flex mt-2 pt-1 px-1 overflow-x-auto`}>
                        {
                            listTab.map(e=>{
                                return (
                                    <div
                                        key={e}
                                        onClick={() => setActiveMenu(e)}
                                        className={`${activeMenu === e ? "bg-white text-black" : "text-white"} flex items-center bg-[#2589ce] py-1.5 px-5 text-sm font-bold mr-2 hover:bg-white hover:text-black hover:cursor-pointer truncate min-w-fit `}>
                                        {e} {
                                            e !== 'Dashboard' ? <ImCross className={`ml-2`} size={10} onClick={()=>setCloseTab(e)} /> : null
                                    }
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="w-full h-full bg-white p-2 overflow-y-auto">
                        <div className="bg-[#EBEBEB] p-2 h-full">
                            {
                                (() => {
                                    switch (activeMenu) {
                                        case "Dashboard":
                                            return <Dashboard />;
                                        case "Customer":
                                            return <Customer />;
                                        case "Customer Detail":
                                            return <CustomerDetail />;
                                        case "Type Barang":
                                            return <BarangType />;
                                        case "Jenis Barang":
                                            return <BarangJenis />;
                                        case "Group Barang":
                                            return <BarangGroup />;
                                        case "Segment Barang":
                                            return <BarangSegment />;
                                        case "Satuan Barang":
                                            return <BarangSatuan />;
                                        case "Master Barang":
                                            return <BarangMaster />;
                                        case "Vehicle":
                                            return <Vehicle />;
                                        case "Part":
                                            return <Part />;
                                        case "Pallet":
                                            return <Pallet />;
                                        case "Lap. Riwayat Pallet":
                                            return <LapRiwayat />;
                                        case "Lap. Maintenance Pallet":
                                            return <LapMaintenance />;
                                        case "Tarif Packing":
                                            return <TarifPacking />;
                                        case "Master Gudang":
                                            return <Gudang />;
                                        case "Operator":
                                            return <Operator />;
                                        case "Users":
                                            return <User />;
                                        case "Bill Of Materials (BOM)":
                                            return <BillOfMaterials />;
                                        case "Incoming Material":
                                            return <IncomingMaterial />;
                                        case "Packing List":
                                            return <PackingList />;
                                        case "Hasil Packing":
                                            return <HasilPacking />;
                                        default:
                                            return null;
                                    }
                                })()
                            }
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = async ({req, res}) => {
    const cookie = getCookie('@vuteq-token-exedy', {req, res});

    if (!cookie) {
        res.writeHead(302, {Location: '/'});
        res.end();
    }

    return {props: {}};
};