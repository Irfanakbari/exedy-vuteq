import connection from "@/config/database";
import {DataTypes} from "sequelize";
import BarangMaster from "@/models/BarangMaster";


const BarangJenis = connection.define('BarangJenis', {
    // Model attributes are defined here
    kode: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    keterangan: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'barang_jenis',
    modelName:'BarangJenis',
    timestamps:false
});

BarangJenis.hasMany(BarangMaster, {foreignKey:'jenis'})
BarangMaster.belongsTo(BarangJenis, {foreignKey:'jenis'})

export default BarangJenis;