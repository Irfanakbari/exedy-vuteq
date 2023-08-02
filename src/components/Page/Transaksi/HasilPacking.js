import { BiPlusMedical, BiPrinter, BiRefresh, BiSolidUpArrow } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import {BsArrowRightShort, BsFillTrashFill} from "react-icons/bs";
import { AiFillFileExcel } from "react-icons/ai";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import DeleteModal from "@/components/Modal/DeleteModal";
import { FaRegWindowMaximize } from "react-icons/fa";
import {showErrorToast, showSuccessToast} from "@/utils/toast";
import {customerState} from "@/utils/states";

export default function HasilPacking() {
    const {setHasilPacking,setPackingList, listPackingList, listBom, listHasilPacking,listOperator,listBarangGroup,listBarangType,listBarangSatuan,listBarangSegment, listCustomer, listSubCustomer} = customerState()
    const [selectedCell, setSelectedCell] = useState({});


    const {
        register,
        handleSubmit,
        reset,
    } = useForm()

    const [closeModal, setCloseModal] = useState(false);
    const [closeAddModal, setCloseAddModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState([])



    useEffect(() => {
        fetchDataPL();
    }, []);




    const fetchDataPL = async () => {
        try {
            const response1 = await axios.get('/api/packinglist');
            setPackingList(response1.data['data']);
            const response = await axios.get('/api/hasilpacking');
            setHasilPacking(response.data['data']);
            setFilters(response.data['data']);
        } catch (error) {
            showErrorToast("Gagal Fetch Data");
        }
    };


    const submitData = async (data) => {
        const body = data
        try {
            await axios.post('/api/hasilpacking', body).then(() => {
                showSuccessToast("Sukses Simpan Data");
                fetchDataPL();
            });
        } catch (e) {
            showErrorToast("Gagal Simpan Data");
        } finally {
            reset()
            setCloseAddModal(false);
        }
    };

    const deleteData = async (e) => {
        try {
            await axios.delete('/api/bom/' + e);
            showSuccessToast("Sukses Hapus Data");
        } catch (e) {
            showErrorToast("Gagal Hapus Data");
        } finally {
            setCloseModal(false);
            await fetchDataPL();
        }
    };

    const searchValue = (value) => {
        if (value.trim() === '') {
            return listHasilPacking;
        }

        const searchValueLowerCase = value.toLowerCase();

        return listHasilPacking.filter((item) => {
            for (let key in item) {
                if (typeof item[key] === 'string' && item[key].toLowerCase().includes(searchValueLowerCase)) {
                    return true;
                }
            }
            return false;
        });
    };

    const handleSearch = () => {
        const searchResult = searchValue(searchTerm);
        setFilters(searchResult);
    };



    return (
        <div className="h-full bg-white">
            {closeModal ? (
                <DeleteModal data={selectedCell.kode} setCloseModal={setCloseModal} action={deleteData} />
            ) : null}
            {closeAddModal ? (
                <div className="fixed max-h-screen bg-black bg-opacity-20 h-full flex items-center justify-center top-0 left-0 z-[5000] w-full overflow-y-auto overflow-x-hidden outline-none">
                    <div className="w-1/2 rounded bg-white border-4 border-[#3da0e3]">
                        <div className="w-full flex items-center justify-between bg-[#3da0e3] font-light py-1 px-2 text-white text-sm">
                            <div className="flex items-center gap-2">
                                <FaRegWindowMaximize />
                                Form Tambah Data
                            </div>
                            <div onClick={() => setCloseAddModal(false)} className="hover:bg-red-800 p-1">
                                <ImCross size={10} />
                            </div>
                        </div>
                        <form onSubmit={handleSubmit(submitData)}>
                            <div className="p-2 flex flex-col gap-5">
                                <div className="border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm">
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Kode : </label>
                                        <input disabled placeholder={`Otomatis`} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Tanggal : </label>
                                        <input type={`date`} required {...register("tanggal")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">No. Packing List : </label>
                                        <select required {...register("no_packing")} className="border border-gray-300 p-1 flex-grow">
                                            <option value="">-- Pilih Formula --</option> {/* Opsi kosong sebagai default */}
                                            {
                                                listPackingList.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode +' - '+ e['BarangMaster']['name']}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Qty Terima : </label>
                                        <input type={`number`}  {...register("qty_terima")} required className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Keterangan : </label>
                                        <input required {...register("keterangan")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                </div>
                                <div className="border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm">
                                    <div className="flex flex-row justify-center gap-2">
                                        <input type={'submit'} className="bg-[#f17373] w-full text-white py-1 text-sm rounded"/>
                                        <button onClick={() => {
                                            reset()
                                            setCloseAddModal(false)
                                        }} className="border w-full border-gray-500 py-1 text-sm rounded">
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
            <div className="bg-[#2589ce] py-1.5 px-2 text-white flex flex-row justify-between">
                <h2 className="font-bold text-[14px]">Filter</h2>
                <div className="flex items-center">
                    <BiSolidUpArrow size={10} />
                </div>
            </div>
            <div className="w-full flex items-center px-3 py-2">
                <label className="text-sm font-semibold mr-3">Cari : </label>
                <input
                    type="text"
                    className="border border-gray-300 rounded mr-3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ImCross
                    className="hover:cursor-pointer text-blue-700 mr-4"
                    onClick={() => setSearchTerm('')}
                />
                <button
                    className="bg-green-500 py-1 px-2 text-white font-semibold text-sm"
                    onClick={handleSearch}
                >
                    Dapatkan Data
                </button>
            </div>
            <div className="w-full h-4 border border-gray-500" />
            <div className="w-full p-2">
                <div className="w-full bg-[#3da0e3] py-0.5 px-1 text-white flex flex-row">
                    <div
                        onClick={() => setCloseAddModal(true)}
                        className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer"
                    >
                        <BiPlusMedical size={12} />
                        <p className="text-white font-bold text-sm">Baru</p>
                    </div>
                    {/*<div*/}
                    {/*    onClick={() => setCloseEditModal(true)}*/}
                    {/*    className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer"*/}
                    {/*>*/}
                    {/*    <BiEdit size={12} />*/}
                    {/*    <p className="text-white font-bold text-sm">Ubah</p>*/}
                    {/*</div>*/}
                    <div
                        onClick={() => setCloseModal(true)}
                        className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer"
                    >
                        <BsFillTrashFill size={12} />
                        <p className="text-white font-bold text-sm">Hapus</p>
                    </div>
                    <div className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer">
                        <BiPrinter size={12} />
                        <p className="text-white font-bold text-sm">Cetak</p>
                    </div>
                    <div className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer">
                        <AiFillFileExcel size={12} />
                        <p className="text-white font-bold text-sm">Excel</p>
                    </div>
                    <div
                        onClick={fetchDataPL}
                        className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer"
                    >
                        <BiRefresh size={12} />
                        <p className="text-white font-bold text-sm">Refresh</p>
                    </div>
                </div>
                <div className="overflow-y-auto max-h-[calc(90vh-200px)] overflow-x-auto">
                    <table className="w-full bg-gray-100">
                        <thead>
                        <tr className={`sticky top-0 whitespace-nowrap`}>
                            <th className="py-2 bg-gray-100 text-center w-20">#</th>
                            <th className="py-2 bg-gray-100 text-left">Kode Txn</th>
                            <th className="py-2 bg-gray-100 text-left">Tanggal</th>
                            <th className="py-2 bg-gray-100 text-left">No. Packing</th>
                            <th className="py-2 bg-gray-100 text-left">Tanggal Packing</th>
                            <th className="py-2 bg-gray-100 text-left">Nama Barang</th>
                            <th className="py-2 bg-gray-100 text-left">Qty Terima</th>
                            <th className="py-2 bg-gray-100 text-left">Type</th>
                            <th className="py-2 bg-gray-100 text-left">Aprroved</th>
                            <th className="py-2 bg-gray-100 text-left">Approved Date</th>
                            <th className="py-2 bg-gray-100 text-left">Approved By</th>
                            <th className="py-2 bg-gray-100 text-left">Customer</th>
                            <th className="py-2 bg-gray-100 text-left">Sub Customer</th>
                            <th className="py-2 bg-gray-100 text-left">Assy No</th>
                            <th className="py-2 bg-gray-100 text-left">Cust. Part No</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filters.map((e, index) => (
                            <tr
                                className={`${selectedCell.kode === e['kode'] ? 'bg-[#85d3ff]' : ''} text-sm whitespace-nowrap font-semibold border-b border-gray-500`}
                                key={e['kode']}
                                onClick={async () => {
                                    setSelectedCell(e)
                                }}
                            >
                                <td className="text-center p-1">{index + 1}</td>
                                <td>{e['kode']}</td>
                                <td>{e['tanggal']}</td>
                                <td>{e['PackingList']['kode'] }</td>
                                <td>{e['PackingList']['tanggal']}</td>
                                <td>{e['PackingList']['barang_jadi']}</td>
                                <td>{e['qty_terima']}</td>
                                <td>{e['PackingList']['type']}</td>
                                <td>{e['approved']}</td>
                                <td>{e['approved_date']}</td>
                                <td>{e['approved_by']}</td>
                                <td>{e['PackingList']['customer']}</td>
                                <td>{e['PackingList']['sub_customer']}</td>
                                <td>{e['PackingList']['assy_no']}</td>
                                <td>{e['PackingList']['cust_part_no']}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
