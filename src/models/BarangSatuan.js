import connection from "@/config/database";
import {DataTypes} from "sequelize";
import BarangMaster from "@/models/BarangMaster";


const BarangSatuan = connection.define('BarangSatuan', {
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
    tableName: 'barang_satuan',
    timestamps:false
});

BarangSatuan.hasMany(BarangMaster, {foreignKey:'satuan'})
BarangMaster.belongsTo(BarangSatuan, {foreignKey:'satuan'})

export default BarangSatuan;