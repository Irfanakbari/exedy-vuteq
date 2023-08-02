import connection from "@/config/database";
import {DataTypes} from "sequelize";
import BarangMaster from "@/models/BarangMaster";
import PackingList from "@/models/PackingList";


const BarangType = connection.define('BarangType', {
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
    tableName: 'barang_type',
    timestamps:false
});

BarangType.hasMany(BarangMaster, {foreignKey:'type'})
BarangMaster.belongsTo(BarangType, {foreignKey:'type'})


BarangType.hasMany(PackingList, {foreignKey:'type'})
PackingList.belongsTo(BarangType, {foreignKey:'type'})

export default BarangType;