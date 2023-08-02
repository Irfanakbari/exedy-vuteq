import connection from "@/config/database";
import {DataTypes} from "sequelize";
// import BarangMaster from "@/models/BarangMaster";


const TarifPacking = connection.define('TarifPacking', {
    // Model attributes are defined here
    kode: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    tarif: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    keterangan: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'tarif_packing',
    timestamps:false
});


export default TarifPacking;