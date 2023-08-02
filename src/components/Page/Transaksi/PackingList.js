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
import {FaCheck} from "react-icons/fa6";
import dayjs from "dayjs";

export default function PackingList() {
    const {setPackingList, listBom, listPackingList,listOperator,listBarangGroup,listBarangType,listBarangSatuan,listBarangSegment, listCustomer, listSubCustomer} = customerState()
    const [selectedCell, setSelectedCell] = useState({});

    const [listMaterial, setListMaterial] = useState([])

    const [formula, setFormula] = useState([])

    const [showDetail, setShowDetail] = useState(false);

    const [listDetail, setListDetail] = useState([])



    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue
    } = useForm()

    const [closeModal, setCloseModal] = useState(false);
    const [closeAddModal, setCloseAddModal] = useState(false);
    const [closeEditModal, setCloseEditModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState([])



    useEffect(() => {
        fetchDataPL();
    }, []);

    useEffect(() =>{
        axios.get('/api/bom/' + watch('bom')).then(r=>{
            setFormula(r.data['data'])
            setValue('cust_part_no', r.data['data']?.cust_part_no || '-'); // Atur nilai input menggunakan setValue
            setValue('assy_no', r.data['data']?.assy_no || '-'); // Atur nilai input menggunakan setValue
            setValue('barang_jadi', r.data['data']?.barang_jadi || '-'); // Atur nilai input menggunakan setValue
        })
    },[watch('bom')])

    const fetchDataPL = async () => {
        try {
            const response = await axios.get('/api/packinglist');
            setPackingList(response.data['data']);
            setFilters(response.data['data']);
        } catch (error) {
            showErrorToast("Gagal Fetch Data");
        }
    };

    const fetchDataPLDetail = async (e) =>{
        try {
            const response = await axios.get('/api/packinglist/detail/'+ e);
            setListDetail(response.data['data']);
        } catch (error) {
            showErrorToast("Gagal Fetch Data");
        } finally {
            setShowDetail(true); // Show the detail window/box
        }
    }

    const validateQtyPakai = () => {
        const qtyOrder = watch('qty_order');

        for (const material of formula['BomBarangs']) {
            const qtyPakai = material.qty * qtyOrder;
            if (qtyPakai > material['BarangMaster'].stok) {
                return `Qty Pakai (${qtyPakai}) is greater than Qty Stok (${material['BarangMaster'].stok}) for material ${material['BarangMaster'].kode}`;
            }
        }

        return ''; // No error, return an empty string
    };


    const submitData = async (data) => {
        const body = data
        console.log(body)
        const validationError = validateQtyPakai();
        if (validationError) {
            console.log("error boi kebanyakan")
            return; // Stop form submission
        }

        // body.material = listMaterial
        try {
            await axios.post('/api/packinglist', body).then(() => {
                showSuccessToast("Sukses Simpan Data");
                fetchDataPL();
            });
        } catch (e) {
            showErrorToast("Gagal Simpan Data");
        } finally {
            reset()
            setCloseAddModal(false);
            setListMaterial([])
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

    const editData = async (data) => {
        try {
            await axios.put('/api/bom/' + selectedCell.kode, data).then(() => {
                showSuccessToast("Sukses Edit Data");
                fetchDataPL();
            });
        } catch (e) {
            showErrorToast("Gagal Edit Data");
        } finally {
            reset()
            setCloseEditModal(false);
        }
    };

    const searchValue = (value) => {
        if (value.trim() === '') {
            return listPackingList;
        }

        const searchValueLowerCase = value.toLowerCase();

        return listPackingList.filter((item) => {
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
                                        <label className="w-1/4">Customer : </label>
                                        <select required {...register("customer")} className="border border-gray-300 p-1 flex-grow">
                                            {
                                                listCustomer.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode +' - '+ e.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Sub Customer : </label>
                                        <select required {...register("sub_customer")} className="border border-gray-300 p-1 flex-grow">
                                            {
                                                listSubCustomer.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode +' - '+ e.sub_name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Tanggal : </label>
                                        <input type={`date`} required {...register("tanggal")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">No. Request : </label>
                                        <input required {...register("mr_no")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Formula : </label>
                                        <select required {...register("bom")} className="border border-gray-300 p-1 flex-grow">
                                            <option value="">-- Pilih Formula --</option> {/* Opsi kosong sebagai default */}
                                            {
                                                listBom.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode +' - '+ e.barang_jadi}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Type : </label>
                                        <select required {...register("type")} className="border border-gray-300 p-1 flex-grow">
                                            {
                                                listBarangType.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode +' - '+ e.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">QTY : </label>
                                        <input type={`number`} required {...register("qty_order")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Operator : </label>
                                        <select required {...register("operator")} className="border border-gray-300 p-1 flex-grow">
                                            {
                                                listOperator.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode +' - '+ e.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Explanner No : </label>
                                        <input  {...register("explanner_no")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Barang Jadi : </label>
                                        <input disabled required {...register("barang_jadi")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Cust. Part No : </label>
                                        <input disabled required {...register("cust_part_no")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Assy No : </label>
                                        <input disabled required {...register("assy_no")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Keterangan : </label>
                                        <input required {...register("keterangan")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <br/>
                                    <table className="border border-gray-300">
                                        <thead>
                                        <tr>
                                            <th className="border-b-2 px-4 py-2 text-left">Material Code</th>
                                            <th className="border-b-2 px-4 py-2 text-left">Assy No</th>
                                            <th className="border-b-2 px-4 py-2 text-left">Cust. Part No</th>
                                            <th className="border-b-2 px-4 py-2 text-left">Name</th>
                                            <th className="border-b-2 px-4 py-2 text-left">Qty Formula</th>
                                            <th className="border-b-2 px-4 py-2 text-left">Qty Stok</th>
                                            <th className="border-b-2 px-4 py-2 text-left">Qty Pakai</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {formula && formula['BomBarangs'] && formula['BomBarangs'].map((material, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="px-4 py-2">{material['BarangMaster'].kode}</td>
                                                <td className="px-4 py-2">{material['BarangMaster'].assy_no}</td>
                                                <td className="px-4 py-2">{material['BarangMaster'].cust_part_no}</td>
                                                <td className="px-4 py-2">{material['BarangMaster'].name}</td>
                                                <td className="px-4 py-2">{material.qty}</td>
                                                <td className="px-4 py-2">{material['BarangMaster'].stok}</td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        required
                                                        disabled
                                                        value={material.qty * watch('qty_order')}
                                                        className="border border-gray-300 px-2 py-1"
                                                    />
                                                </td>
                                            </tr>
                                        ))}

                                        </tbody>
                                    </table>

                                </div>
                                <div className="border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm">
                                    <div className="flex flex-row justify-center gap-2">
                                        <input type={'submit'} className="bg-[#f17373] w-full text-white py-1 text-sm rounded"/>
                                        <button onClick={() => {
                                            reset()
                                            setCloseAddModal(false)
                                            setListMaterial([])
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
            {closeEditModal ? (
                <div className="fixed bg-black bg-opacity-20 h-full flex items-center justify-center top-0 left-0 z-[5000] w-full overflow-y-auto overflow-x-hidden outline-none">
                    <div className="w-1/3 rounded bg-white border-4 border-[#3da0e3]">
                        <div className="w-full flex items-center justify-between bg-[#3da0e3] font-light py-1 px-2 text-white text-sm">
                            <div className="flex items-center gap-2">
                                <FaRegWindowMaximize />
                                Form Edit Data
                            </div>
                            <div onClick={() => setCloseEditModal(false)}
                                 className="hover:bg-red-800 p-1"
                            >
                                <ImCross size={10} />
                            </div>
                        </div>
                        <form onSubmit={handleSubmit(editData)}>
                            <div className="p-2 flex flex-col gap-5">
                                <div className="border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm">
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Kode : </label>
                                        <input defaultValue={selectedCell.kode} disabled className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Nama Barang : </label>
                                        <input defaultValue={selectedCell.name} {...register("name")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Customer : </label>
                                        <input disabled defaultValue={selectedCell.customer} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Sub Customer : </label>
                                        <input disabled defaultValue={selectedCell.customer_sub} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Satuan : </label>
                                        <select defaultValue={selectedCell.satuan}  {...register("satuan")} className="border border-gray-300 p-1 flex-grow">
                                            {
                                                listBarangSatuan.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode +' - '+ e.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Type : </label>
                                        <select defaultValue={selectedCell.type} {...register("type")} className="border border-gray-300 p-1 flex-grow">
                                            {
                                                listBarangType.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode +' - '+ e.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Segment : </label>
                                        <select defaultValue={selectedCell.segment} {...register("segment")} className="border border-gray-300 p-1 flex-grow">
                                            {
                                                listBarangSegment.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode +' - '+ e.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Group : </label>
                                        <select defaultValue={selectedCell.group} {...register("group")} className="border border-gray-300 p-1 flex-grow">
                                            {
                                                listBarangGroup.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode +' - '+ e.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Jenis : </label>
                                        <input disabled defaultValue={selectedCell.jenis} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Cust. Part No : </label>
                                        <input defaultValue={selectedCell.cust_part_no} {...register("cust_part_no")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Assy No : </label>
                                        <input defaultValue={selectedCell.assy_no} {...register("assy_no")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Keterangan : </label>
                                        <input defaultValue={selectedCell.keterangan} {...register("keterangan")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                </div>
                                <div className="border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm">
                                    <div className="flex flex-row justify-center gap-2">
                                        <input type={'submit'} className="bg-[#f17373] w-full text-white py-1 text-sm rounded"/>
                                        <button onClick={() =>{
                                            setCloseEditModal(false)
                                            reset()
                                        } } className="border w-full border-gray-500 py-1 text-sm rounded">
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
            {showDetail ? (
                <div className="fixed bg-black bg-opacity-20 h-full flex items-center justify-center top-0 left-0 z-[5000] w-full overflow-y-auto overflow-x-hidden outline-none">
                    <div className="rounded bg-white border-4 border-[#3da0e3]">
                        <div className="w-full flex items-center justify-between bg-[#3da0e3] font-light py-1 px-2 text-white text-sm">
                            <div className="flex items-center gap-2">
                                <FaRegWindowMaximize />
                                Form Detail
                            </div>
                            <div onClick={() => setShowDetail(false)}
                                 className="hover:bg-red-800 p-1"
                            >
                                <ImCross size={10} />
                            </div>
                        </div>
                        <div className="p-4">
                            <table className="w-full p-3">
                                <thead>
                                <tr>
                                    <th className="py-2 bg-gray-100 text-left text-sm w-28">Qty Packing</th>
                                    <th className="py-2 bg-gray-100 text-left text-sm w-28">Qty Formula</th>
                                    <th className="py-2 bg-gray-100 text-left text-sm w-28">Qty Pakai</th>
                                    <th className="py-2 bg-gray-100 text-left text-sm w-36">Assy No</th>
                                    <th className="py-2 bg-gray-100 text-left text-sm w-36">Cust. Part No</th>
                                    <th className="py-2 bg-gray-100 text-left text-sm w-36">Nama Barang</th>
                                    <th className="py-2 bg-gray-100 text-left text-sm w-20">Satuan</th>
                                    <th className="py-2 bg-gray-100 text-left text-sm w-28">Kode Internal</th>
                                </tr>
                                </thead>
                                <tbody>
                                {listDetail.map((e, index) => (
                                    <tr key={index} className="text-sm">
                                        <td>{selectedCell.qty_order}</td>
                                        <td>{e.qty}</td>
                                        <td>{selectedCell.qty_order * e.qty}</td>
                                        <td>{e['BarangMaster']['assy_no']}</td>
                                        <td>{e['BarangMaster']['cust_part_no']}</td>
                                        <td>{e['BarangMaster']['name']}</td>
                                        <td>{e['BarangMaster']['satuan']}</td>
                                        <td>{e['BarangMaster']['kode']}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

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
                            <th className="py-2 bg-gray-100 text-left">Kode PL</th>
                            <th className="py-2 bg-gray-100 text-left">Tanggal</th>
                            <th className="py-2 bg-gray-100 text-left">Customer</th>
                            <th className="py-2 bg-gray-100 text-left">Sub Customer</th>
                            <th className="py-2 bg-gray-100 text-left">Barang Jadi</th>
                            <th className="py-2 bg-gray-100 text-left">Type</th>
                            <th className="py-2 bg-gray-100 text-left">Qty order</th>
                            <th className="py-2 bg-gray-100 text-left">Qts Selesai</th>
                            <th className="py-2 bg-gray-100 text-left">Qty Out</th>
                            <th className="py-2 bg-gray-100 text-left">Formula</th>
                            <th className="py-2 bg-gray-100 text-left">Cust. Part No</th>
                            <th className="py-2 bg-gray-100 text-left">Assy No</th>
                            <th className="py-2 bg-gray-100 text-left">Explanner No</th>
                            <th className="py-2 bg-gray-100 text-left">MR No</th>
                            <th className="py-2 bg-gray-100 text-left">Keterangan</th>
                            <th className="py-2 bg-gray-100 text-left">Operator</th>
                            <th className="py-2 bg-gray-100 text-left">Status</th>
                            <th className="py-2 bg-gray-100 text-left">Action</th>
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
                                <td>{e['Customer']['kode'] + ' - ' + e['Customer']['name']}</td>
                                <td>{e['CustomerDetail']['kode'] + ' - ' + e['CustomerDetail']['sub_name']}</td>
                                <td>{e['BarangMaster']['name']}</td>
                                <td>{e['type']}</td>
                                <td>{e['qty_order'] ?? '-'}</td>
                                <td>{e['qty_selesai'] ?? '-'}</td>
                                <td>{e['qty_out'] ?? '-'}</td>
                                <td>{e['bom']}</td>
                                <td>{e['cust_part_no']}</td>
                                <td>{e['assy_no']}</td>
                                <td>{e['explanner_no'] ?? '-'}</td>
                                <td>{e['mr_no'] ?? '-'}</td>
                                <td>{e['keterangan']}</td>
                                <td>{e['Operator']['name']}</td>
                                <td>{e['status']}</td>
                                <td>
                                    <button className={'flex items-center'} type="button" onClick={async () => {
                                        setSelectedCell(e)
                                        await fetchDataPLDetail(e.kode)
                                    }}>Detail <BsArrowRightShort/></button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
