import connection from "@/config/database";
import {DataTypes} from "sequelize";


const Gudang = connection.define('Gudang', {
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
    tableName: 'gudang',
    timestamps:false
});

export default Gudang;