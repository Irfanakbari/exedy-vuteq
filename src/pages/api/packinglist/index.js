import checkCookieMiddleware from "@/pages/api/middleware";
import Customer from "@/models/Customer";
import connection from "@/config/database";
import PackingList from "@/models/PackingList";
import CustomerDetail from "@/models/CustomerDetail";
import BarangMaster from "@/models/BarangMaster";
import Operator from "@/models/Operator";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const im = await PackingList.findAll({
                    include: [
                        {
                            model: Customer,
                            attributes: ['kode','name']
                        },
                        {
                            model: CustomerDetail,
                            attributes: ['kode','sub_name']
                        },
                        {
                            model: BarangMaster,
                            attributes: ['name']
                        }, Operator],
                })
                res.status(200).json({
                    ok : true,
                    data : im
                })
            } catch (e) {
                console.log(e.message)
                res.status(500).json({
                    ok : false,
                    data : "Internal Server Error"
                })
            }
            break;
        case 'POST':
            try {
                const rawData = req.body; // Anggap req.body berisi data pelanggan baru
                const lastData = await PackingList.findAll();

                let nextId;
                if (lastData.length > 0) {
                    const bomNumbers = lastData.map(group => {
                        const pKode = group['kode'];
                        const numberString = pKode.split('PCL')[1];
                        return parseInt(numberString);
                    });

                    for (let i = 1; i <= lastData.length + 1; i++) {
                        if (!bomNumbers.includes(i)) {
                            nextId = i;
                            break;
                        }
                    }

                    // Jika tidak ada urutan kosong, gunakan urutan terakhir + 1
                    if (!nextId) {
                        const lastNumber = Math.max(...bomNumbers);
                        nextId = lastNumber + 1;
                    }
                } else {
                    // Jika tidak ada valet sebelumnya, gunakan urutan awal yaitu 1
                    nextId = 1;
                }

                const nextIdFormatted = nextId.toString().padStart(5, '0');
                let newBarang = {
                    kode: `PCL${nextIdFormatted}`,
                    ...rawData
                }

                await connection.transaction(async (t) => {
                    try {
                        // Update status pallet menjadi 0
                        await PackingList.create(newBarang, { transaction: t });

                        // Buat data history baru
                        // await Promise.all(
                        //     rawData['material'].map(async (material) => {
                        //         await IncomingBarang.create({
                        //             incoming_id: `ICM${nextIdFormatted}`,
                        //             barang_id: material.kode,
                        //             qty: material.qty
                        //         }, { transaction: t });
                        //     })
                        // );

                        // Commit transaksi jika semua operasi berhasil
                        await t.commit();
                        res.status(201).json({
                            ok: true,
                            data: "Sukses"
                        });
                    } catch (error) {
                        // Rollback transaksi jika terjadi kesalahan
                        await t.rollback();
                        throw error;
                    }
                });
            } catch (e) {
                console.log(e.message);
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
