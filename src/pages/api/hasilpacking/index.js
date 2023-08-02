import checkCookieMiddleware from "@/pages/api/middleware";
import connection from "@/config/database";
import PackingList from "@/models/PackingList";
import HasilPacking from "@/models/HasilPacking";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const hp = await HasilPacking.findAll({
                    include: [
                        {
                            model: PackingList,
                        }
                    ]
                })
                res.status(200).json({
                    ok : true,
                    data : hp
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
                const lastData = await HasilPacking.findAll();

                let nextId;
                if (lastData.length > 0) {
                    const bomNumbers = lastData.map(group => {
                        const pKode = group['kode'];
                        const numberString = pKode.split('PH')[1];
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
                    kode: `PH${nextIdFormatted}`,
                    ...rawData
                }

                await connection.transaction(async (t) => {
                    try {
                        // Update status pallet menjadi 0
                        await HasilPacking.create(newBarang, { transaction: t });

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
