import { BiEdit, BiPlusMedical, BiPrinter, BiRefresh, BiSolidUpArrow } from "react-icons/bi";
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

export default function BillOfMaterials() {
    const {setBom, listBom,listBarangMasterAll, listBarangGroup,listBarangType,listBarangSatuan,listBarangSegment, listCustomer, listSubCustomer} = customerState()
    const [selectedCell, setSelectedCell] = useState({});

    const [barangMasterOptions, setBarangMasterOptions] = useState([]);
    const [barangMasterOptions2, setBarangMasterOptions2] = useState([]);
    const [listMaterial, setListMaterial] = useState([])

    const [showDetail, setShowDetail] = useState(false);

    const [listDetail, setListDetail] = useState([])



    const {
        register,
        handleSubmit,
        reset,
        watch
    } = useForm()

    const [closeModal, setCloseModal] = useState(false);
    const [closeAddModal, setCloseAddModal] = useState(false);
    const [closeEditModal, setCloseEditModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState([])



    useEffect(() => {
        fetchDataBarangMaster();
        const filteredBarangMaster = listBarangMasterAll.filter((e) => e.customer_sub === watch('sub_customer') && e.jenis === 'F');
        setBarangMasterOptions(filteredBarangMaster);
        const filteredBarangMaster2 = listBarangMasterAll.filter((e) => e.customer_sub === watch('sub_customer') && e.jenis === 'R');
        setBarangMasterOptions2(filteredBarangMaster2);
    }, [watch('sub_customer')]);

    const fetchDataBarangMaster = async () => {
        try {
            const response = await axios.get('/api/bom');
            setBom(response.data['data']);
            setFilters(response.data['data']);
        } catch (error) {
            showErrorToast("Gagal Fetch Data");
        }
    };

    const fetchDataBomDetail = async (e) =>{
        try {
            const response = await axios.get('/api/bom/detail/'+ e);
            setListDetail(response.data['data']);
        } catch (error) {
            showErrorToast("Gagal Fetch Data");
        } finally {
            setShowDetail(true); // Show the detail window/box
        }
    }

    const submitData = async (data) => {
        const body = data
        body.material = listMaterial
        try {
            await axios.post('/api/bom', body).then(r => {
                showSuccessToast("Sukses Simpan Data");
                fetchDataBarangMaster();
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
            await fetchDataBarangMaster();
        }
    };

    const editData = async (data) => {
        try {
            await axios.put('/api/bom/' + selectedCell.kode, data).then(r => {
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
            return listBom;
        }

        const searchValueLowerCase = value.toLowerCase();

        return listBom.filter((item) => {
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

    const handleTambahMaterial = () => {
        const selectedMaterialString = watch('material');
        const selectedMaterial = JSON.parse(selectedMaterialString);
        setListMaterial((prevSelectedMaterials) => [...prevSelectedMaterials, selectedMaterial]);
    };

    const handleRemoveMaterial = (index) => {
        setListMaterial((prevSelectedMaterials) => {
            const updatedSelectedMaterials = [...prevSelectedMaterials];
            updatedSelectedMaterials.splice(index, 1);
            return updatedSelectedMaterials;
        });
    };

    const handleQtyChange = (e, index) => {
        const { value } = e.target;
        setListMaterial((prevListMaterial) => {
            const updatedListMaterial = [...prevListMaterial];
            updatedListMaterial[index].qty = value;
            return updatedListMaterial;
        });
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
                                        <label className="w-1/4">Barang Jadi : </label>
                                        <select required {...register("barang_jadi")} className="border border-gray-300 p-1 flex-grow">
                                            {
                                                barangMasterOptions.map((e,index)=>(
                                                    <option key={index} value={e.kode}>{e.kode +' - '+ e.name}</option>
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
                                        <label className="w-1/4">Cust. Part No : </label>
                                        <input required {...register("cust_part_no")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Assy No : </label>
                                        <input required {...register("assy_no")} className="border border-gray-300 p-1 flex-grow" />
                                    </div>
                                    <div className="flex flex-row w-full justify-between items-center gap-2">
                                        <label className="w-1/4">Material Mentah : </label>
                                        <select required {...register("material")} className="border border-gray-300 p-1 flex-grow">
                                            {barangMasterOptions2
                                                .map((e, index) => (
                                                    <option key={index} value={JSON.stringify(e)}>
                                                        {e.kode + ' - ' + e.name}
                                                    </option>
                                                ))}
                                        </select>
                                        <button onClick={handleTambahMaterial}>Tambah</button>
                                    </div>
                                    <br/>
                                    <table className="border border-gray-300">
                                        <thead>
                                        <tr>
                                            <th className="border-b-2 px-4 py-2 text-left">Material Code</th>
                                            <th className="border-b-2 px-4 py-2 text-left">Name</th>
                                            <th className="border-b-2 px-4 py-2 text-left">Qty</th>
                                            <th className="border-b-2 px-4 py-2 text-left">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {listMaterial.map((material, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="px-4 py-2">{material.kode}</td>
                                                <td className="px-4 py-2">{material.name}</td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        required
                                                        value={material.qty || ''}
                                                        onChange={(e) => handleQtyChange(e, index)}
                                                        className="border border-gray-300 px-2 py-1"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <button onClick={() => handleRemoveMaterial(index)}>Remove</button>
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
                    <div className="w-1/3 rounded bg-white border-4 border-[#3da0e3]">
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
                        <div className={`p-4`}>
                            <table className="w-full p-3">
                                <thead>
                                <tr>
                                    <th className="py-2 bg-gray-100 text-center text-[12px]">#</th>
                                    <th className="py-2 bg-gray-100 text-left text-[12px]">Assy No</th>
                                    <th className="py-2 bg-gray-100 text-left text-[12px]">Cust. Part No</th>
                                    <th className="py-2 bg-gray-100 text-left text-[12px]">Qty Terpakai</th>
                                    <th className="py-2 bg-gray-100 text-left text-[12px]">Nama Barang</th>
                                    <th className="py-2 bg-gray-100 text-left text-[12px]">Satuan</th>
                                    <th className="py-2 bg-gray-100 text-left text-[12px]">Kode Internal</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    listDetail.map((e,index)=>(
                                        <tr key={index} className={`text-[12px]`}>
                                            <td>{index + 1}</td>
                                            <td>{e['BarangMaster']['assy_no']}</td>
                                            <td>{e['BarangMaster']['cust_part_no']}</td>
                                            <td>{e['qty']}</td>
                                            <td>{e['BarangMaster']['name']}</td>
                                            <td>{e['BarangMaster']['satuan']}</td>
                                            <td>{e['BarangMaster']['kode']}</td>
                                        </tr>
                                    ))
                                }
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
                        onClick={fetchDataBarangMaster}
                        className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#2589ce] hover:cursor-pointer"
                    >
                        <BiRefresh size={12} />
                        <p className="text-white font-bold text-sm">Refresh</p>
                    </div>
                </div>
                <div className="flex overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr>
                            <th className="py-2 bg-gray-100 text-center w-20">#</th>
                            <th className="py-2 bg-gray-100 text-left">No. BOM</th>
                            <th className="py-2 bg-gray-100 text-left">Customer</th>
                            <th className="py-2 bg-gray-100 text-left">Sub Customer</th>
                            <th className="py-2 bg-gray-100 text-left">Type</th>
                            <th className="py-2 bg-gray-100 text-left">Barang Jadi</th>
                            <th className="py-2 bg-gray-100 text-left">Satuan</th>
                            <th className="py-2 bg-gray-100 text-left">Assy No</th>
                            <th className="py-2 bg-gray-100 text-left">Cust. Part No</th>
                            <th className="py-2 bg-gray-100 text-left">Aksi</th>

                        </tr>
                        </thead>
                        <tbody>
                        {filters.map((e, index) => (
                            <tr
                                className={`${selectedCell.kode === e['kode'] ? 'bg-[#85d3ff]' : ''} text-sm font-semibold border-b border-gray-500`}
                                key={e['kode']}
                                onClick={async () => {
                                    setSelectedCell(e)
                                }}
                            >
                                <td className="text-center p-1">{index + 1}</td>
                                <td>{e['kode']}</td>
                                <td>{e['customer'] + ' - ' + e['Customer']['name']}</td>
                                <td>{e['sub_customer'] + ' - ' + e['CustomerDetail']['sub_name']}</td>
                                <td>{e['type']}</td>
                                <td>{e['barang_jadi'] + ' - ' + e['BarangMaster']['name']}</td>
                                <td>{e['satuan']}</td>
                                <td>{e['assy_no']}</td>
                                <td>{e['cust_part_no']}</td>
                                <td>
                                    <button className={'flex items-center'} type="button" onClick={async () => {
                                        setSelectedCell(e)
                                        await fetchDataBomDetail(e.kode)
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
