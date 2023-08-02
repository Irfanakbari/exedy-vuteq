import checkCookieMiddleware from "@/pages/api/middleware";
import IncomingMaterial from "@/models/IncomingMaterial";
import BarangMaster from "@/models/BarangMaster";
import {where} from "sequelize";
import IncomingBarang from "@/models/IncomingBarang";
import connection from "@/config/database";
import Hasilpacking from "@/pages/api/hasilpacking/index";
import Packinglist from "@/pages/api/packinglist";
import Bom from "@/models/Bom";

async function handler(req, res) {
    switch (req.method) {
        case 'DELETE':
            try {
                const barangId = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus
                await Hasilpacking.destroy({
                    where: {
                        kode: barangId
                    }
                });
                res.status(200).json({
                    ok: true,
                    data: "Incoming Material deleted successfully"
                });
            } catch (e) {
                console.log(e);
                res.status(500).json({
                    ok: false,
                    data: "Internal Server Error"
                });
            }
            break;
        case 'PUT':
            try {
                const kodeHasilPacking = req.query.kode; // Anggap req.query.kode berisi kode pelanggan yang akan diubah
                const newIncomingData = req.body;
                const currentUser = req.user.username;

                // Mendapatkan data IncomingMaterial sebelumnya
                const previousHasilPacking = await Hasilpacking.findByPk(kodeHasilPacking);

                if (!previousHasilPacking) {
                    // Jika IncomingMaterial tidak ditemukan, kirim respons error
                    res.status(404).json({
                        ok: false,
                        data: "Hasil Packing not found"
                    });
                    return;
                }

                // Memeriksa apakah status is_approved berubah
                if (previousHasilPacking.is_approved === newIncomingData.is_approved) {
                    res.status(400).json({
                        ok: false,
                        data: "No change in is_approved status"
                    });
                    return;
                }

                const dataDirty = await Packinglist.findOne({
                    where: {
                        kode: previousHasilPacking.no_packing
                    },
                    include: [
                        {
                            model: Bom
                        }
                    ]
                })


                // Memulai transaksi
                // await connection.transaction(async t => {
                //     if (newIncomingData.is_approved === 1) {
                //         // Mendapatkan daftar IncomingBarang
                //         const materials = await Hasilpacking.findAll({
                //             where: {
                //                 kode: kodeHasilPacking
                //             }
                //         }, { transaction: t });
                //
                //
                //
                //         // Menambahkan stok
                //         materials.map(async e => {
                //             const barang = await BarangMaster.findByPk(e.dataValues.barang_id, { transaction: t });
                //             const newStok = barang.stok + e.dataValues.qty;
                //             await BarangMaster.update({
                //                 stok: newStok
                //             }, {
                //                 where: {
                //                     kode: e.dataValues.barang_id
                //                 }
                //             }, { transaction: t });
                //         });
                //         // Update IncomingMaterial dengan data baru
                //         await IncomingMaterial.update({
                //             ...newIncomingData,
                //             approved_by: currentUser,
                //             approved_date: Date.now()
                //         }, {
                //             where: {
                //                 kode: incomingId
                //             }
                //         }, { transaction: t });
                //
                //     } else {
                //
                //         // Mendapatkan daftar IncomingBarang
                //         const materials = await IncomingBarang.findAll({
                //             where: {
                //                 incoming_id: incomingId
                //             }
                //         }, { transaction: t });
                //
                //         // Mengurangi stok
                //         materials.map(async e => {
                //             const barang = await BarangMaster.findByPk(e.dataValues.barang_id, { transaction: t });
                //             const newStok = barang.stok - e.dataValues.qty;
                //             await BarangMaster.update({
                //                 stok: newStok
                //             }, {
                //                 where: {
                //                     kode: e.dataValues.barang_id
                //                 }
                //             }, { transaction: t });
                //         });
                //
                //         // Update IncomingMaterial dengan data baru
                //         await IncomingMaterial.update({
                //             ...newIncomingData,
                //             approved_by: null,
                //             approved_date: null
                //         }, {
                //             where: {
                //                 kode: incomingId
                //             }
                //         }, { transaction: t });
                //     }
                //
                //
                // });

                res.status(201).json({
                    ok: true,
                    data: "Success"
                });
            } catch (e) {
                res.status(500).json({
                    ok: false,
                    data: "Internal Server Error"
                });
            }
            break;
    }
}

const protectedAPIHandler = checkCookieMiddleware(handler);

export default protectedAPIHandler;
