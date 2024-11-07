import connection from "../db/mysql.mjs";
import { DataTypes } from "sequelize";
import User from "./User.mjs";

const Pet = connection.define('Pet', {
    name: {
        type: DataTypes.STRING,
        required: true
    },
    age: {
        type: DataTypes.INTEGER,
        required: true
    },
    weight: {
        type: DataTypes.FLOAT,
        required: true
    },
    color: {
        type: DataTypes.STRING,
        required: true
    },
    images: {
        type: DataTypes.JSON,
        required: true
    },
    available: {
        type: DataTypes.BOOLEAN,
        required: true
    },
    adopterId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    }
})

//relationship
User.hasMany(Pet,{
    foreignKey: {
        name: 'ownerId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

Pet.belongsTo(User,{
    foreignKey: {
        name: 'ownerId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})



User.hasMany(Pet,{
    foreignKey: {
        name: 'adopterId',
        allowNull: true,
        defaultValue: null
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

Pet.belongsTo(User,{
    foreignKey: {
        name: 'adopterId',
        allowNull: true,
        defaultValue: null
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


export default Pet