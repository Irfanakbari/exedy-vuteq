import checkCookieMiddleware from "@/pages/api/middleware";
import BarangMaster from "@/models/BarangMaster";
import Customer from "@/models/Customer";
import CustomerDetail from "@/models/CustomerDetail";
import BarangGroup from "@/models/BarangGroup";
import BarangJenis from "@/models/BarangJenis";
import xlsx from 'xlsx';
import multer from 'multer';


import prettyjson from "prettyjson";

const storage = multer.memoryStorage()
const upload = multer({storage: storage});

async function handler(req, res) {
    switch (req.method) {
        case 'POST':
            upload.single('file')(req, res, async (error) => {
                if (error) {
                    console.error(error);
                    res.status(500).end();
                }
                try {
                    const { buffer } = req.file;

                    const workbook = xlsx.read(buffer, { type: 'buffer' });
                    const firstSheet = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheet];
                    const data = xlsx.utils.sheet_to_json(worksheet);

                    const createdData = [];

                    await BarangMaster.destroy({
                        where: {},
                        truncate: false
                    });

                    const subCustomerCounts = {}; // Objek untuk menyimpan urutan terakhir setiap sub_customer

                    for (const item of data) {
                        const subCust = await CustomerDetail.findOne({
                            where: {
                                sub_name: item.customer_sub
                            }
                        });

                        if (!(subCust.kode in subCustomerCounts)) {
                            subCustomerCounts[subCust.kode] = 1; // Inisialisasi urutan pertama untuk sub_customer baru
                        }

                        const nextIdFormatted = subCustomerCounts[subCust.kode].toString().padStart(4, '0');
                        const kode = `${subCust.kode}.${item.jenis}.${nextIdFormatted}`;

                        createdData.push({
                            ...item,
                            customer_sub: subCust.kode,
                            kode: kode
                        });

                        subCustomerCounts[subCust.kode]++; // Tambahkan urutan untuk sub_customer

                    }

                    console.log(prettyjson.render(createdData));
                    await BarangMaster.bulkCreate(createdData);

                    res.status(201).json({
                        ok: true,
                        data: "barangMaster"
                    });
                } catch (e) {
                    res.status(500).json({
                        ok: false,
                        data: "Internal Server Error"
                    });
                }
            });
            break;



    }
}
// const protectedAPIHandler = checkCookieMiddleware(handler);
export default handler;
export const config = {
    api: {
        bodyParser: false,
        responseLimit: false,
    },

}
