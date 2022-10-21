const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const CloneStat = sequelize.define("clone_stat", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  count: { type: DataTypes.INTEGER, allowNull: false },
  level: { type: DataTypes.STRING, defaultValue: null },
});
const Matrix = sequelize.define(
  "matrix",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    matrix_essence: { type: DataTypes.INTEGER, defaultValue: null },
    side_matrix: { type: DataTypes.INTEGER, defaultValue: null },
    parent_id: { type: DataTypes.BIGINT, defaultValue: null },
  },
  {
    // initialAutoIncrement: 11,
  }
);
const Matrix_Table = sequelize.define(
  "matrix_table",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false },
    can_buy: { type: DataTypes.BOOLEAN, allowNull: false },
    count: { type: DataTypes.INTEGER, allowNull: false },
    matrix_parent_id: { type: DataTypes.BIGINT, defaultValue: null },
    type_matrix_id: { type: DataTypes.BIGINT, defaultValue: null },
  },
  {
    // initialAutoIncrement: 11,
  }
);
// const StMatrix_Table = sequelize.define("st_matrix_table", {
//   id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
//   is_active: { type: DataTypes.BOOLEAN, allowNull: false },
//   can_buy: { type: DataTypes.BOOLEAN, allowNull: false },
//   count: { type: DataTypes.INTEGER, allowNull: false },
// });
const Role = sequelize.define("role", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, defaultValue: null },
});
// const StMatrix = sequelize.define("st_matrix", {
//   id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
//   date: { type: DataTypes.DATE, defaultValue: null },
//   matrix_essence: { type: DataTypes.INTEGER, defaultValue: null },
//   side_matrix: { type: DataTypes.INTEGER, defaultValue: null },
// });

const Transaction = sequelize.define("transaction", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  position: { type: DataTypes.INTEGER, allowNull: false },
  transaction_type: { type: DataTypes.INTEGER, defaultValue: null },
  value: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.STRING, defaultValue: null },
  date_of_transaction: { type: DataTypes.DATE, defaultValue: null },
  parent_matrix_id: { type: DataTypes.BIGINT, defaultValue: null },
});

const TypeMatrix = sequelize.define("type_matrix", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, defaultValue: null },
  summ: { type: DataTypes.INTEGER, allowNull: false },
  matrixTableRepository: { type: DataTypes.STRING, defaultValue: null },
  canBuy: { type: DataTypes.BOOLEAN, defaultValue: true },
  count: { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});
const Key = sequelize.define("key", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, defaultValue: null },
  level: { type: DataTypes.INTEGER, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, defaultValue: true },
});
// const StTypeMatrix = sequelize.define("st_type_matrix", {
//   id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
//   name: { type: DataTypes.STRING, defaultValue: null },
//   summ: { type: DataTypes.INTEGER, allowNull: false },
// });
const News = sequelize.define("news", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  ruTitle: { type: DataTypes.TEXT, defaultValue: null },
  ruText: { type: DataTypes.TEXT, defaultValue: null },
  ruHeadline :{type: DataTypes.TEXT, defaultValue: null},
  enHeadline :{type: DataTypes.TEXT, defaultValue: null},
  enDescription :{type: DataTypes.TEXT, defaultValue: null},
  ruDescription :{type: DataTypes.TEXT, defaultValue: null},
  image:{type: DataTypes.STRING, defaultValue:null}, 
  date: { type: DataTypes.DATE, allowNull: false },
});


const User = sequelize.define(
  "user",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11, },
    referal_id: { type: DataTypes.BIGINT, defaultValue: null },
    statistic_id: { type: DataTypes.BIGINT, defaultValue: null },
    activation_date: { type: DataTypes.DATE, defaultValue: null },
    // active_partners: { type: DataTypes.INTEGER, allowNull: false },
    avatar: { type: DataTypes.STRING, defaultValue: null },
    balance: { type: DataTypes.INTEGER, defaultValue: 1000, allowNull: false },
    kurs1: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    kurs2: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    kurs3: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    kurs4: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    // can_create_comment: { type: DataTypes.BOOLEAN,  allowNull:false },
    email: { type: DataTypes.STRING, allowNull: false },
    finance_password: { type: DataTypes.STRING, defaultValue: null },
    // first_enter: { type: DataTypes.BOOLEAN,  allowNull: false },
    // first_lines: { type: DataTypes.INTEGER,  allowNull: false },
    first_name: { type: DataTypes.STRING, defaultValue: null },
    // has_fin_password: { type: DataTypes.BOOLEAN,  allowNull: false },
    // income: { type: DataTypes.INTEGER,  allowNull: false },
    instagram: { type: DataTypes.STRING, defaultValue: null },
    is_verified: { type: DataTypes.INTEGER, defaultValue: 0 },
    last_name: { type: DataTypes.STRING, defaultValue: null },
    locale: { type: DataTypes.STRING, defaultValue: null },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    ref_link: { type: DataTypes.STRING, defaultValue: null },
    // registration_date: { type: DataTypes.DATE, defaultValue: null },
    show_inviter: { type: DataTypes.BOOLEAN, defaultValue: null },
    telegram: { type: DataTypes.STRING, defaultValue: null },
    tg_key: { type: DataTypes.STRING, defaultValue: null },
    user_on_links: { type: DataTypes.INTEGER, defaultValue: 0 },
    username: { type: DataTypes.STRING, allowNull: false },
    vkontakte: { type: DataTypes.STRING, defaultValue: null },
    description: { type: DataTypes.STRING, defaultValue: null },
  },
  {
    // initialAutoIncrement: 11,
  }
);

const UserRole = sequelize.define("user_role", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
});

// User.hasOne(Basket);
// Basket.belongsTo(User);

// User.hasOne(Favourite);
// Favourite.belongsTo(User);

User.hasMany(Matrix, { as: "matrix" });
Matrix.belongsTo(User);


User.hasMany(Transaction);
Transaction.belongsTo(User);

User.hasMany(Key);
Key.belongsTo(User);

User.hasOne(Matrix_Table);
Matrix_Table.belongsTo(User, { as: "user" });

// Favourite.hasMany(FavouriteDevice);
// FavouriteDevice.belongsTo(Favourite);

// Type.hasOne(Category);
// Category.belongsTo(Type);

// TitleType.hasOne(Category);
// Category.belongsTo(TitleType);

// SubType.hasOne(Category);
// Category.belongsTo(SubType);

// Basket.hasMany(BasketDevice);
// BasketDevice.belongsTo(Basket);

// Type.hasMany(TitleType);
// TitleType.belongsTo(Type);

// TitleType.hasMany(SubType);
// SubType.belongsTo(TitleType);

// Type.hasMany(Device);
// Device.belongsTo(Type);

// SubType.hasMany(Device);
// Device.belongsTo(SubType);

// TitleType.hasMany(Device);
// Device.belongsTo(TitleType);

// Brand.hasMany(Device);
// Device.belongsTo(Brand);

// Device.hasMany(Rating, { as: "rating" });
// Rating.belongsTo(Device);

// Device.hasMany(DeviceDescription, { as: "device_description" });
// DeviceDescription.belongsTo(Device);

// Device.hasMany(DeviceImg, { as: "deviceImg" });
// DeviceImg.belongsTo(Device);

// Device.hasMany(SubDevice, { as: "subDevice" });
// SubDevice.belongsTo(Device);

// Device.hasMany(BasketDevice);
// BasketDevice.belongsTo(Device);

// Device.hasMany(FavouriteDevice);
// FavouriteDevice.belongsTo(Device);

// SubDevice.hasMany(DeviceInfo, { as: "info" });
// DeviceInfo.belongsTo(SubDevice);

// Device.hasMany(DeviceMoreInfo, { as: "more_info" });
// DeviceMoreInfo.belongsTo(Device);

User.belongsToMany(Role, { through: UserRole });
Role.belongsToMany(User, { through: UserRole });

module.exports = {
  CloneStat,
  Matrix,
  Matrix_Table,
  Role,
  Key,
  News,
  // StMatrix,
  Transaction,
  TypeMatrix,
  // Statistic,
  User,
  // StMatrix_Table,
  // StTypeMatrix
};
