import connection from "../db/mysql.mjs";
import { DataTypes } from "sequelize";

const User = connection.define('User', {
    name: {
        type: DataTypes.STRING,
        required: true
    },
    email: {
        type: DataTypes.STRING,
        required: true
    },
    password: {
        type: DataTypes.STRING,
        required: true
    },
    image: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING,
        required: true
    }

})

export default User