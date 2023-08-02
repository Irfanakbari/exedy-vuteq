import connection from "@/config/database";
import {DataTypes} from "sequelize";

const HasilPacking = connection.define(
    'HasilPacking',
    {
        kode: {
            type: DataTypes.STRING(100),
            allowNull: true,
            primaryKey: true,
        },
        tanggal: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        no_packing: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        qty_terima: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        approved: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: true,
        },
        approved_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        approved_by: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        keterangan: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        tableName: 'hasil_packing',
        timestamps: false, // Set to true if you want to include timestamps (createdAt, updatedAt)
    }
);

export default HasilPacking