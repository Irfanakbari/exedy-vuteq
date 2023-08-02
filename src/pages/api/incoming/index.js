import checkCookieMiddleware from "@/pages/api/middleware";
import Customer from "@/models/Customer";
import connection from "@/config/database";
import IncomingMaterial from "@/models/IncomingMaterial";
import IncomingBarang from "@/models/IncomingBarang";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const im = await IncomingMaterial.findAll({
                    include: [Customer],
                })
                res.status(200).json({
                    ok : true,
                    data : im
                })
            } catch (e) {
                res.status(500).json({
                    ok : false,
                    data : "Internal Server Error"
                })
            }
            break;
        case 'POST':
            try {
                const rawData = req.body; // Anggap req.body berisi data pelanggan baru
                const lastBom = await IncomingMaterial.findAll();

                let nextId;
                if (lastBom.length > 0) {
                    const bomNumbers = lastBom.map(group => {
                        const palletId = group['kode'];
                        const numberString = palletId.split('ICM')[1];
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

                const nextIdFormatted = nextId.toString().padStart(5, '0');
                let newBarang = {
                    kode: `ICM${nextIdFormatted}`,
                    customer: rawData['customer'],
                    tanggal: rawData['tanggal'],
                    no_pr: rawData['no_pr'],
                    keterangan: rawData['keterangan'],
                }

                await connection.transaction(async (t) => {
                    try {
                        // Update status pallet menjadi 0
                        await IncomingMaterial.create(newBarang, { transaction: t });

                        // Buat data history baru
                        await Promise.all(
                            rawData['material'].map(async (material) => {
                                await IncomingBarang.create({
                                    incoming_id: `ICM${nextIdFormatted}`,
                                    barang_id: material.kode,
                                    qty: material.qty
                                }, { transaction: t });
                            })
                        );

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
