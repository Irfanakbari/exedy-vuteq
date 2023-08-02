import checkCookieMiddleware from "@/pages/api/middleware";
import BarangMaster from "@/models/BarangMaster";
import Customer from "@/models/Customer";
import CustomerDetail from "@/models/CustomerDetail";
import Bom from "@/models/Bom";
import BomBarang from "@/models/BomBarang";
import connection from "@/config/database";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const boms = await Bom.findAll({
                    include: [Customer, CustomerDetail, BarangMaster],
                })
                res.status(200).json({
                    ok : true,
                    data : boms
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
                const lastBom = await Bom.findAll();

                let nextId;
                if (lastBom.length > 0) {
                    const bomNumbers = lastBom.map(group => {
                        const palletId = group['kode'];
                        const numberString = palletId.split('BM')[1];
                        return parseInt(numberString);
                    });

                    for (let i = 1; i <= lastBom.length + 1; i++) {
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

                const nextIdFormatted = nextId.toString().padStart(6, '0');
                let newBarang = {
                    kode: `BM${nextIdFormatted}`,
                    customer: rawData['customer'],
                    sub_customer: rawData['sub_customer'],
                    type: rawData['type'],
                    satuan: rawData['satuan'],
                    barang_jadi: rawData['barang_jadi'],
                    assy_no: rawData['assy_no'],
                    cust_part_no: rawData['cust_part_no'],
                }

                await connection.transaction(async (t) => {
                    try {
                        // Update status pallet menjadi 0
                        await Bom.create(newBarang, { transaction: t });

                        // Buat data history baru
                        const bomBarangPromises = rawData['material'].map(async (material) => {
                            await BomBarang.create({
                                bom_id: `BM${nextIdFormatted}`,
                                barang_id: material.kode,
                                qty: material.qty
                            }, { transaction: t });
                        });

                        // Menunggu hingga semua operasi BomBarang.create() selesai
                        await Promise.all(bomBarangPromises);

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
