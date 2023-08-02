import checkCookieMiddleware from "@/pages/api/middleware";
import BarangMaster from "@/models/BarangMaster";
import Customer from "@/models/Customer";
import CustomerDetail from "@/models/CustomerDetail";
import BarangGroup from "@/models/BarangGroup";
import BarangJenis from "@/models/BarangJenis";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const { page } = req.query;
                if (page) {
                    const pageNumber = parseInt(page) || 1;
                    const limitNumber = 50;

                    const offset = (pageNumber - 1) * limitNumber;

                    const totalCount = await BarangMaster.count();
                    const totalPages = Math.ceil(totalCount / limitNumber);

                    const barangMaster = await BarangMaster.findAll({
                        include: [Customer, CustomerDetail, BarangGroup, BarangJenis],
                        limit: limitNumber,
                        offset: offset,
                    });

                    res.status(200).json({
                        ok: true,
                        data: barangMaster,
                        pagination: {
                            totalItems: totalCount,
                            totalPages: totalPages,
                            currentPage: pageNumber,
                            itemsPerPage: limitNumber,
                        },
                    });
                } else {
                    const barangMaster = await BarangMaster.findAll();

                    res.status(200).json({
                        ok: true,
                        data: barangMaster,
                    });
                }
            } catch (e) {
                res.status(500).json({
                    ok: false,
                    data: "Internal Server Error",
                });
            }
            break;

        case 'POST':
            try {
                let newBarang = req.body; // Anggap req.body berisi data pelanggan baru

                const lastBarangMaster = await BarangMaster.findAll();

                let nextId;
                if (lastBarangMaster.length > 0) {
                    const palletNumbers = lastBarangMaster.map(group => {
                        const palletId = group['kode'];
                        const numberString = palletId.split('.')[2];
                        return parseInt(numberString);
                    });

                    for (let i = 1; i <= lastBarangMaster.length + 1; i++) {
                        if (!palletNumbers.includes(i)) {
                            nextId = i;
                            break;
                        }
                    }

                    // Jika tidak ada urutan kosong, gunakan urutan terakhir + 1
                    if (!nextId) {
                        const lastNumber = Math.max(...palletNumbers);
                        nextId = lastNumber + 1;
                    }
                } else {
                    // Jika tidak ada valet sebelumnya, gunakan urutan awal yaitu 1
                    nextId = 1;
                }

                const nextIdFormatted = nextId.toString().padStart(4, '0');
                newBarang.kode = `${newBarang.customer_sub}.${newBarang.jenis}.${nextIdFormatted}`;

                const barangMaster = await BarangMaster.create(newBarang);
                res.status(201).json({
                    ok: true,
                    data: barangMaster
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
