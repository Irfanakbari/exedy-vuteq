import connection from "@/config/database";
import {DataTypes} from "sequelize";
import BarangMaster from "@/models/BarangMaster";


const BarangGroup = connection.define('BarangGroup', {
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
    tableName: 'barang_group',
    timestamps:false
});

BarangGroup.hasMany(BarangMaster, {foreignKey:'group'})
BarangMaster.belongsTo(BarangGroup, {foreignKey:'group'})

export default BarangGroup;