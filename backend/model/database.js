const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

class Singleton{
    
  static createSingleton = (function () {
      let instance;

      function createInstance() {
        const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
          host: process.env.MYSQL_HOST,
          dialect: process.env.MYSQL_DIALECT,
          port: process.env.MYSQL_PORT,
          dialectOptions: {
            decimalNumbers: true
          }
        });
          return sequelize;
      }

      return {
          getInstance: function () {
              if (!instance) {
                  instance = createInstance();
              }
              return instance;
          }
      };
  })();

};

const User = Singleton.createSingleton.getInstance().define('user', {
  id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
  lastname: {
      type: Sequelize.STRING(50),
      allowNull: false
  },
  name: {
      type: Sequelize.STRING(50),
      allowNull: false
  },
  email: {
      type: Sequelize.STRING(50),
      allowNull: false
  },
  username: {
      type: Sequelize.STRING(50),
      allowNull: false
  },
  password: {
      type: Sequelize.STRING(100),
      allowNull: false
  },
  role: {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'customer'
  },
  refresh_token: {
    type: Sequelize.STRING(600),
    allowNull: false,
    defaultValue: ''
},
}, { 
  timestamps: false,
  freezeTableName: true
});

const Faq = Singleton.createSingleton.getInstance().define('faq', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    question: {
        type: Sequelize.STRING(400),
        allowNull: false
    },
    answer: {
        type: Sequelize.STRING(400),
        allowNull: false
    },
  }, { 
    timestamps: false,
    freezeTableName: true
  });

const Barter = Singleton.createSingleton.getInstance().define('barter', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    barter_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    barter_telephone: {
        type: Sequelize.STRING(15),
        allowNull: false,
    },
    barter_items: {
        type: Sequelize.STRING(2500),
        allowNull: false
    },
    status: {
        type: Sequelize.STRING(400),
        allowNull: false,
        defaultValue: 'In lavorazione'
    },
    paypal_fee: {
        type: Sequelize.FLOAT(7,2),
        allowNull: true,
        defaultValue: 0,
    },
    shipping_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
    },
    shipping_code: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
    },
    shipping_address: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
    },
    shipping_carrier: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
    },
    shipping_cost: {
        type: Sequelize.FLOAT(7,2),
        allowNull: false,
        defaultValue: 0,
    },
    total: {
        type: Sequelize.FLOAT(7,2),
        allowNull: true,
        defaultValue: 0,
    },
    notes: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '',
    },
    }, { 
timestamps: false,
freezeTableName: true
});

const Product = Singleton.createSingleton.getInstance().define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    cover: {
        type: Sequelize.STRING,
        allowNull: false
    },
    product_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    photo_1: {
        type: Sequelize.STRING,
        allowNull: false
    },
    photo_2: {
        type: Sequelize.STRING,
        allowNull: false
    },
    photo_3: {
        type: Sequelize.STRING,
        allowNull: false
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false
    },
    brandName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.FLOAT(7,2),
        allowNull: false
    },
    prod_description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    color: {
        type: Sequelize.STRING,
        allowNull: true
    },
    CPU: {
        type: Sequelize.STRING,
        allowNull: true
    },
    RAM: {
        type: Sequelize.STRING,
        allowNull: true
    },
    HDD: {
        type: Sequelize.STRING,
        allowNull: true
    }, 
    graphics_card: {
        type: Sequelize.STRING,
        allowNull: true
    },   
    stars: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    discount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    qtyInStock: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
  }, { 
    timestamps: false,
    freezeTableName: true
  });

const Order_Product = Singleton.createSingleton.getInstance().define('order_product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    priceEach: {
        type: Sequelize.FLOAT(7,2),
        allowNull: false,
    },
    }, { 
    timestamps: false,
    freezeTableName: true
});

const Order = Singleton.createSingleton.getInstance().define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    order_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    order_status: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    shipping_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Corriere',
    },
    shipping_address: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    shipping_carrier: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
    },
    shipping_cost: {
        type: Sequelize.FLOAT(7,2),
        allowNull: false,
    },
    payment_method: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    paypal_fee: {
        type: Sequelize.FLOAT(7,2),
        allowNull: true,
        defaultValue: 0,
    },
    shipping_code: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    notes: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '',
    },
    }, { 
    timestamps: false,
    freezeTableName: true
});

const Review = Singleton.createSingleton.getInstance().define('review', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    review_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    review_text: {
        type: Sequelize.STRING(2000),
        allowNull: false,
        defaultValue: '',
    },
    review_reply: {
        type: Sequelize.STRING(2000),
        allowNull: true,
        defaultValue: '',
    },
    stars: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
    }, { 
    timestamps: false,
    freezeTableName: true
});

Product.hasMany(Order_Product, {
    foreignKey: 'productId'
});

Order.hasMany(Order_Product, {
    foreignKey: 'orderId'
});

User.hasMany(Order, {
    foreignKey: 'userId'
});

User.hasMany(Review, {
    foreignKey: 'userId'
});

Product.hasMany(Review, {
    foreignKey: 'productId'
});

User.hasMany(Barter, {
    foreignKey: 'userId'
});

Product.hasMany(Barter, {
    foreignKey: 'productId'
});

Order_Product.belongsTo(Product);
Order_Product.belongsTo(Order);
Order.belongsTo(User);
Review.belongsTo(User);
Review.belongsTo(Product);
Barter.belongsTo(Product)
Barter.belongsTo(User);

  module.exports = {
    sequelize: Singleton.createSingleton.getInstance(),
    user: User,
    product: Product,
    order_product: Order_Product,
    order: Order,
    review: Review,
    faq: Faq,
    barter: Barter,
};