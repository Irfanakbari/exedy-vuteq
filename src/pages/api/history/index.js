import Customer from "@/models/Customer";
import Pallet from "@/models/Pallet";
import Vehicle from "@/models/Vehicle";
import History from "@/models/History";
import connection from "@/config/database";
import checkCookieMiddleware from "@/pages/api/middleware";
import Part from "@/models/Part";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            const { customer, vehicle, page } = req.query;
            try {
                let whereClause = {}; // Inisialisasi objek kosong untuk kondisi where

                if (customer && vehicle) {
                    whereClause = {
                        '$Pallet.Customer.kode$': customer,
                        '$Pallet.Vehicle.kode$': vehicle,
                    };
                } else if (customer) {
                    whereClause = {
                        '$Pallet.Customer.kode$': customer,
                    };
                } else if (vehicle) {
                    whereClause = {
                        '$Pallet.Vehicle.kode$': vehicle,
                    };
                }

                // Menghitung offset berdasarkan halaman dan batasan data
                const offset = (parseInt(page) - 1) * 20;

                const histories = await History.findAndCountAll({
                    where: whereClause,
                    include: [
                        {
                            model: Pallet,
                            include: [
                                {
                                    model: Customer,
                                },
                                {
                                    model: Vehicle,
                                },
                                {
                                    model: Part,
                                },
                            ],
                        },
                    ],
                    limit: parseInt(20),
                    offset: offset,
                });

                const totalPages = Math.ceil(histories.count / parseInt(20));

                res.status(200).json({
                    ok: true,
                    data: histories.rows,
                    totalPages,
                    currentPage: parseInt(page),
                });
            } catch (e) {
                res.status(500).json({
                    ok: false,
                    data: "Internal Server Error",
                });
            }
            break;

        case 'POST':
            try {
                const { kode } = req.body;

                const pallet = await Pallet.findOne({
                    where: { kode: kode }
                });

                if (pallet.status === 0) {
                    return res.status(400).json({
                        ok: false,
                        data: "Pallet Sedang Berada Diluar"
                    });
                }
                else if (pallet.status === 3) {
                    return res.status(400).json({
                        ok: false,
                        data: "Pallet Sedang Dalam Status Pemeliharaan"
                    });
                }
                else {
                    await connection.transaction(async (t) => {
                        // Update status pallet menjadi 0
                        await Pallet.update(
                            { status: 0 },
                            { where: { kode: kode }, transaction: t }
                        );

                        // Buat data history baru
                        await History.create(
                            {
                                id_pallet: kode,
                                user_out: req.user.username
                            },
                            { transaction: t }
                        );
                    });
                    res.status(201).json({
                        ok: true,
                        data: "Sukses"
                    });
                }
            } catch (e) {
                res.status(500).json({
                    ok: false,
                    data: "Internal Server Error"
                });
            }
            break;
        case 'PUT':
            try {
                const { kode } = req.body;

                const pallet = await Pallet.findOne({
                    where: { kode: kode }
                });
                if (pallet.status === 1) {
                    return res.status(400).json({
                        ok: false,
                        data: "Pallet Sudah Masuk"
                    });
                }
                else if (pallet.status === 3) {
                    return res.status(400).json({
                        ok: false,
                        data: "Pallet Sedang Dalam Status Pemeliharaan"
                    });
                }

                await connection.transaction(async (t) => {
                    // Update status pallet menjadi 0
                    await Pallet.update(
                        { status: 1 },
                        { where: { kode: kode }, transaction: t }
                    );

                    // Buat data history baru
                    await History.update(
                        { masuk: Date.now(), user_in: req.user.username},
                        { where: { id_pallet: kode }, transaction: t }
                    );
                });
                res.status(200).json({
                    ok: true,
                    data: "Sukses"
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
