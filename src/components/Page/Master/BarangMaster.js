import { BiEdit, BiPlusMedical, BiPrinter, BiRefresh, BiSolidUpArrow } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import {BsFillTrashFill} from "react-icons/bs";
import {AiFillFileExcel, AiOutlineImport} from "react-icons/ai";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import DeleteModal from "@/components/Modal/DeleteModal";
import { FaRegWindowMaximize } from "react-icons/fa";
import {showErrorToast, showSuccessToast} from "@/utils/toast";
import {customerState} from "@/utils/states";
import PaginationSelect from "@/components/PaginationSelect";

export default function BarangMaster() {
    const {setBarangMaster,listTarifPacking, listBarangGroup,listBarangType,listBarangJenis,listBarangSatuan,listBarangSegment, listBarangMaster, listCustomer, listSubCustomer} = customerState()
    const [selectedCell, setSelectedCell] = useState({});

    const [pagination, setPagination] = useState([])

    const {
        register,
        handleSubmit,
        reset
    } = useForm()

    const [closeModal, setCloseModal] = useState(false);
    const [closeAddModal, setCloseAddModal] = useState(false);
    const [closeEditModal, setCloseEditModal] = useState(false);
    const [closeImportModal, setCloseImportModal] = useState(false);


    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState([])



    useEffect(() => {
        fetchDataBarangMaster();
    }, []);

    const fetchDataBarangMaster = async () => {
        try {
            const response = await axios.get('/api/barang/master?page=1');
            setBarangMaster(response.data['data']);
            setPagination(response.data.pagination);
            setFilters(response.data['data']);
        } catch (error) {
            showErrorToast("Gagal Fetch Data");
        }
    };

    const submitData = async (data) => {
        try {
            await axios.post('/api/barang/master', data).then(r => {
                showSuccessToast("Sukses Simpan Data");
                fetchDataBarangMaster();
            });
        } catch (e) {
            showErrorToast("Gagal Simpan Data");
        } finally {
            reset()
            setCloseAddModal(false);
        }
    };


    const submitExcel = async (data) => {
        try {
            const formData = new FormData();
            await formData.append('file', data['excel'][0]); // data adalah file Excel yang ingin dikirim
            await axios.post('/api/barang/master/file', formData).then(r => {
                showSuccessToast("Sukses Simpan Data");
                fetchDataBarangMaster();
            });
        } catch (e) {
            console.log(e.message);
            showErrorToast("Gagal Simpan Data");
        } finally {
            reset()
            setCloseImportModal(false);
        }
    };


    const deleteData = async (e) => {
        try {
            await axios.delete('/api/barang/master/' + e);
            showSuccessToast("Sukses Hapus Data");
        } catch (e) {
            showErrorToast("Gagal Hapus Data");
        } finally {
            setCloseModal(false);
            await fetchDataBarangMaster();
        }
    };

    const editData = async (data) => {
        try {
            await axios.put('/api/barang/master/' + selectedCell.kode, data).then(r => {
                showSuccessToast("Sukses Edit Data");
                fetchDataBarangMaster();
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
            return listBarangMaster;
        }

        const searchValueLowerCase = value.toLowerCase();

        return listBarangMaster.filter((item) => {
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

    const handlePageChange = async (selectedPage) => {
        // Lakukan perubahan halaman di sini
        const response = await axios.get(`/api/barang/master?page=` + selectedPage);
        setBarangMaster(response.data);
        setFilters(response.data['data'])
    };

    return (
        <div className="h-full bg-white ">
            {closeModal ? (
                <DeleteModal data={selectedCell.kode} setCloseModal={setCloseModal} action={deleteData} />
            ) : null}
            {closeAddModal ? (
                <div className="fixed bg-black bg-opacity-20 h-full flex items-center justify-center top-0 left-0 z-[5000] w-full overflow-y-auto overflow-x-hidden outline-none">
                    <div className="w-1/3 rounded bg-white border-4 border-[#3da0e3]">
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
                                        <label className="w-1/4">Nama Barang : </label>
                                        <input required {...register("name")} className="border border-gray-300 p-1 flex-grow" />
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
                                        <select required {...register("customer_sub")} className="border border-gray-300 p-1 flex-grow">
                                            {
                                                listSubCustomer.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode +' - '+ e.sub_name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Satuan : </label>
                                        <select required {...register("satuan")} className="border border-gray-300 p-1 flex-grow">
                                            {
                                                listBarangSatuan.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode +' - '+ e.name}</option>
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
                                        <label className="w-1/4">Segment : </label>
                                        <select required {...register("segment")} className="border border-gray-300 p-1 flex-grow">
                                            {
                                                listBarangSegment.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode +' - '+ e.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Group : </label>
                                        <select required {...register("group")} className="border border-gray-300 p-1 flex-grow">
                                            {
                                                listBarangGroup.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode +' - '+ e.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Jenis : </label>
                                        <select required {...register("jenis")} className="border border-gray-300 p-1 flex-grow">
                                            {
                                                listBarangJenis.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode +' - '+ e.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">KPP1 : </label>
                                        <select  {...register("kpp1")} className="border border-gray-300 p-1 flex-grow">
                                            {
                                                listTarifPacking.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">KPP2 : </label>
                                        <select  {...register("kpp2")} className="border border-gray-300 p-1 flex-grow">
                                            {
                                                listTarifPacking.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Cust. Part No : </label>
                                        <input required {...register("cust_part_no")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Assy No : </label>
                                        <input required {...register("assy_no")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Keterangan : </label>
                                        <input {...register("keterangan")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                </div>
                                <div className="border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm">
                                    <div className="flex flex-row justify-center gap-2">
                                        <input type={'submit'} className="bg-[#f17373] w-full text-white py-1 text-sm rounded"/>
                                        <button onClick={() => setCloseAddModal(false)} className="border w-full border-gray-500 py-1 text-sm rounded">
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
            {closeImportModal ? (
                <div className="fixed bg-black bg-opacity-20 h-full flex items-center justify-center top-0 left-0 z-[5000] w-full overflow-y-auto overflow-x-hidden outline-none">
                    <div className="w-1/3 rounded bg-white border-4 border-[#3da0e3]">
                        <div className="w-full flex items-center justify-between bg-[#3da0e3] font-light py-1 px-2 text-white text-sm">
                            <div className="flex items-center gap-2">
                                <FaRegWindowMaximize />
                                Form Tambah Data
                            </div>
                            <div onClick={() => setCloseAddModal(false)} className="hover:bg-red-800 p-1">
                                <ImCross size={10} />
                            </div>
                        </div>
                        <form onSubmit={handleSubmit(submitExcel)}>
                            <div className="p-2 flex flex-col gap-5">
                                <div className="border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm">
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">File (excel format) : </label>
                                        <input type={`file`} {...register("excel")}  className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                </div>
                                <div className="border border-gray-300 w-full p-3 flex flex-col gap-3 text-sm">
                                    <div className="flex flex-row justify-center gap-2">
                                        <input type={'submit'} className="bg-[#f17373] w-full text-white py-1 text-sm rounded"/>
                                        <button onClick={() => setCloseImportModal(false)} className="border w-full border-gray-500 py-1 text-sm rounded">
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
                                        <label className="w-1/4">KPP1 : </label>
                                        <select defaultValue={selectedCell.kpp1} {...register("kpp1")} className="border border-gray-300 p-1 flex-grow">
                                            {
                                                listTarifPacking.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">KPP2 : </label>
                                        <select defaultValue={selectedCell.kpp2} {...register("kpp2")} className="border border-gray-300 p-1 flex-grow">
                                            {
                                                listTarifPacking.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode}</option>
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
                    <div
                        onClick={() => setCloseEditModal(true)}
                        className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer"
                    >
                        <BiEdit size={12} />
                        <p className="text-white font-bold text-sm">Ubah</p>
                    </div>
                    <div
                        onClick={() => setCloseImportModal(true)}
                        className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer"
                    >
                        <AiOutlineImport size={12} />
                        <p className="text-white font-bold text-sm">Excel Import</p>
                    </div>
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
                        onClick={fetchDataBarangMaster}
                        className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer"
                    >
                        <BiRefresh size={12} />
                        <p className="text-white font-bold text-sm">Refresh</p>
                    </div>
                </div>
                <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                    <table className="w-full bg-gray-100 ">
                        <thead>
                        <tr className={`sticky top-0`}>
                            <th className="py-2 bg-gray-100 text-center w-20">#</th>
                            <th className="py-2 bg-gray-100 text-left">Customer</th>
                            <th className="py-2 bg-gray-100 text-left">Sub Customer</th>
                            <th className="py-2 bg-gray-100 text-left">Segment</th>
                            <th className="py-2 bg-gray-100 text-left">Assy No</th>
                            <th className="py-2 bg-gray-100 text-left">Cust Part No</th>
                            <th className="py-2 bg-gray-100 text-left">Nama Barang</th>
                            <th className="py-2 bg-gray-100 text-left">Satuan</th>
                            <th className="py-2 bg-gray-100 text-left">Type</th>
                            <th className="py-2 bg-gray-100 text-left">Jenis</th>
                            <th className="py-2 bg-gray-100 text-left">Group</th>
                            <th className="py-2 bg-gray-100 text-left">Kode Internal</th>
                            <th className="py-2 bg-gray-100 text-left">Keterangan</th>
                            <th className="py-2 bg-gray-100 text-left">KPP1</th>
                            <th className="py-2 bg-gray-100 text-left">KPP2</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filters.map((e, index) => (
                            <tr
                                className={`${selectedCell.kode === e['kode'] ? 'bg-[#85d3ff]' : ''} text-sm font-semibold border-b border-gray-500`}
                                key={e['kode']}
                                onClick={() => setSelectedCell(e)}
                            >
                                <td className="text-center p-1">{index + 1}</td>
                                <td>{e['customer'] + ' - ' + e['Customer']['name']}</td>
                                <td>{e['customer_sub'] + ' - ' + e['CustomerDetail']['sub_name']}</td>
                                <td>{e['segment']}</td>
                                <td>{e['assy_no']}</td>
                                <td>{e['cust_part_no']}</td>
                                <td>{e['name']}</td>
                                <td>{e['satuan']}</td>
                                <td>{e['type']}</td>
                                <td>{e['jenis'] + ' - ' + e['BarangJeni']['name']}</td>
                                <td>{e['group'] + ' - ' + e['BarangGroup']['name']}</td>
                                <td>{e['kode']}</td>
                                <td>{e['keterangan']}</td>
                                <td>{e['kpp1']}</td>
                                <td>{e['kpp2']}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className={'sticky bottom-0 w-full bg-white pt-3'}>
                        <PaginationSelect
                            totalPages={pagination['totalPages']}
                            currentPage={pagination['currentPage']}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
