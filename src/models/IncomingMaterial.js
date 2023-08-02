import connection from "@/config/database";
import {DataTypes} from "sequelize";


const IncomingMaterial = connection.define('IncomingMaterial', {
    // Model attributes are defined here
    kode: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    customer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tanggal: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    no_pr: {
        type: DataTypes.STRING,
        allowNull: false
    },
    keterangan: {
        type: DataTypes.STRING
    },
    is_approved: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    approved_date: {
        type: DataTypes.DATE,
    },
    approved_by: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'incoming_material',
    timestamps:false
});


export default IncomingMaterial;