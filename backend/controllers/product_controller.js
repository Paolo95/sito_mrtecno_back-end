const Database = require('../model/database');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { Sequelize } = require('sequelize');
const MimeNode = require('nodemailer/lib/mime-node');

dotenv.config();

class Product_controller{

    constructor(){};

    async getCategories(){

        const categories = await Database.product.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category'],
            ]    
        })

        if (categories === undefined) return [500, "Errore server"];
        
        return [categories];
    }

    async getBrands(categoryCheckedBody){

        const brands = await Database.product.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('brandName')), 'brandName'],
            ],
            where: {
                category: categoryCheckedBody.categoryChecked
            }
        }) 
        
        if (brands === undefined) return [500, "Errore server"];
        
        return [brands];
    }

    async getFilteredItems(filters){

        if (filters.brandCheckedList.length === 0 || filters.brandCheckedList.filter(n => n).length === 0){
            if (filters.orderChoice === 0){
                const shopItems = await Database.product.findAll({
                    where: {
                        category: filters.categoryChecked,
                        price: {
                            [Op.gte]: filters.min,
                            [Op.lte]: filters.max,
                        },
                        qtyInStock: {
                            [Op.gt]: 0,
                        }                      
                    },
                    order: [
                        ['stars', 'DESC']
                    ]
                }); 
    
                if (shopItems === undefined) return [500, "Errore server"];
            
                return [shopItems];
            }else if (filters.orderChoice === 1){
                const shopItems = await Database.product.findAll({
                    where: {
                        category: filters.categoryChecked,
                        price: {
                            [Op.gte]: filters.min,
                            [Op.lte]: filters.max,
                        },
                        qtyInStock: {
                            [Op.gt]: 0,
                        }                           
                    },
                    order: [
                        ['price', 'ASC']
                    ]
                }); 
    
                if (shopItems === undefined) return [500, "Errore server"];
            
                return [shopItems];
            }else if (filters.orderChoice === 2){
                const shopItems = await Database.product.findAll({
                    where: {
                        category: filters.categoryChecked,
                        price: {
                            [Op.gte]: filters.min,
                            [Op.lte]: filters.max,
                        },
                        qtyInStock: {
                            [Op.gt]: 0,
                        }                            
                    },
                    order: [
                        ['price', 'DESC']
                    ]
                }); 
    
                if (shopItems === undefined) return [500, "Errore server"];
            
                return [shopItems];
            }else if (filters.orderChoice === 3){
                const shopItems = await Database.product.findAll({
                    where: {
                        category: filters.categoryChecked,
                        price: {
                            [Op.gte]: filters.min,
                            [Op.lte]: filters.max,
                        },
                        qtyInStock: {
                            [Op.gt]: 0,
                        }                              
                    },
                    order: [
                        ['product_name', 'ASC']
                    ]
                }); 
    
                if (shopItems === undefined) return [500, "Errore server"];
            
                return [shopItems];
            } else if ( filters.orderChoice === 4){
                const shopItems = await Database.product.findAll({
                    where: {
                        category: filters.categoryChecked,
                        price: {
                            [Op.gte]: filters.min,
                            [Op.lte]: filters.max,
                        },
                        qtyInStock: {
                            [Op.gt]: 0,
                        }                                
                    },
                    order: [
                        ['product_name', 'DESC']
                    ]
                }); 
    
                if (shopItems === undefined) return [500, "Errore server"];
            
                return [shopItems];
            }
        } else{
            if (filters.orderChoice === 0){
                const shopItems = await Database.product.findAll({
                    where: {
                        category: filters.categoryChecked,
                        price: {
                            [Op.gte]: filters.min,
                            [Op.lte]: filters.max,
                        },
                        brandName: {
                            [Op.in]: filters.brandCheckedList,
                        },
                        qtyInStock: {
                            [Op.gt]: 0,
                        }                            
                    },
                    order: [
                        ['stars', 'DESC']
                    ]
                }); 
    
                if (shopItems === undefined) return [500, "Errore server"];
            
                return [shopItems];
            }else if (filters.orderChoice === 1){
                const shopItems = await Database.product.findAll({
                    where: {
                        category: filters.categoryChecked,
                        price: {
                            [Op.gte]: filters.min,
                            [Op.lte]: filters.max,
                        },
                        brandName: {
                            [Op.in]: filters.brandCheckedList,
                        },
                        qtyInStock: {
                            [Op.gt]: 0,
                        }         
                            
                    },
                    order: [
                        ['price', 'ASC']
                    ]
                }); 
    
                if (shopItems === undefined) return [500, "Errore server"];
            
                return [shopItems];
            }else if (filters.orderChoice === 2){
                const shopItems = await Database.product.findAll({
                    where: {
                        category: filters.categoryChecked,
                        price: {
                            [Op.gte]: filters.min,
                            [Op.lte]: filters.max,
                        },
                        brandName: {
                            [Op.in]: filters.brandCheckedList,
                        },
                        qtyInStock: {
                            [Op.gt]: 0,
                        }         
                            
                    },
                    order: [
                        ['price', 'DESC']
                    ]
                }); 
    
                if (shopItems === undefined) return [500, "Errore server"];
            
                return [shopItems];
            }else if (filters.orderChoice === 3){
                const shopItems = await Database.product.findAll({
                    where: {
                        category: filters.categoryChecked,
                        price: {
                            [Op.gte]: filters.min,
                            [Op.lte]: filters.max,
                        },
                        brandName: {
                            [Op.in]: filters.brandCheckedList,
                        },
                        qtyInStock: {
                            [Op.gt]: 0,
                        }         
                            
                    },
                    order: [
                        ['product_name', 'ASC']
                    ]
                }); 
    
                if (shopItems === undefined) return [500, "Errore server"];
            
                return [shopItems];
            } else if ( filters.orderChoice === 4){
                const shopItems = await Database.product.findAll({
                    where: {
                        category: filters.categoryChecked,
                        price: {
                            [Op.gte]: filters.min,
                            [Op.lte]: filters.max,
                        },
                        brandName: {
                            [Op.in]: filters.brandCheckedList,
                        },
                        qtyInStock: {
                            [Op.gt]: 0,
                        }         
                            
                    },
                    order: [
                        ['product_name', 'DESC']
                    ]
                }); 

        }        

            if (shopItems === undefined) return [500, "Errore server"];
        
            return [shopItems];
        }
        
       
    }

    async getAdminFilteredItems(filters){

        if(filters.searchString !== ''){
           
            if (filters.orderSelected === 'Migliori'){
                const productList = await Database.product.findAll({
                    where: {
                        category: filters.categorySelected,
                        product_name: {
                            [Op.like]: filters.searchString + '%',
                        }                      
                    },
                    order: [
                        ['stars', 'DESC']
                    ],
                }); 

                if (productList === undefined) return [500, "Errore server"];
            
                return [productList];
            }else if (filters.orderSelected === 'Crescente'){
                const productList = await Database.product.findAll({
                    where: {
                        category: filters.categorySelected,  
                        product_name: {
                            [Op.like]: filters.searchString + '%',
                        }                          
                    },
                    order: [
                        ['price', 'ASC']
                    ]
                }); 

                if (productList === undefined) return [500, "Errore server"];
            
                return [productList];
            }else if (filters.orderSelected === 'Decrescente'){
                const productList = await Database.product.findAll({
                    where: {
                        category: filters.categorySelected,
                        product_name: {
                            [Op.like]: filters.searchString + '%',
                        }                         
                    },
                    order: [
                        ['price', 'DESC']
                    ]
                }); 

                if (productList === undefined) return [500, "Errore server"];
            
                return [productList];
            }else if (filters.orderSelected === 'A-Z'){
                const productList = await Database.product.findAll({
                    where: {
                        category: filters.categorySelected,
                        product_name: {
                            [Op.like]: filters.searchString + '%',
                        }                               
                    },
                    order: [
                        ['product_name', 'ASC']
                    ]
                }); 

                if (productList === undefined) return [500, "Errore server"];
            
                return [productList];
            } else if ( filters.orderSelected === 'Z-A'){
                const productList = await Database.product.findAll({
                    where: {
                        category: filters.categorySelected,
                        product_name: {
                            [Op.like]: filters.searchString + '%',
                        }                         
                    },
                    order: [
                        ['product_name', 'DESC']
                    ]
                }); 

                if (productList === undefined) return [500, "Errore server"];
            
                return [productList];
            }

        }else{
            if (filters.orderSelected === 'Migliori'){
                const productList = await Database.product.findAll({
                    where: {
                        category: filters.categorySelected,                     
                    },
                    order: [
                        ['stars', 'DESC']
                    ],
                }); 

                if (productList === undefined) return [500, "Errore server"];
            
                return [productList];
            }else if (filters.orderSelected === 'Crescente'){
                const productList = await Database.product.findAll({
                    where: {
                        category: filters.categorySelected,                         
                    },
                    order: [
                        ['price', 'ASC']
                    ]
                }); 

                if (productList === undefined) return [500, "Errore server"];
            
                return [productList];
            }else if (filters.orderSelected === 'Decrescente'){
                const productList = await Database.product.findAll({
                    where: {
                        category: filters.categorySelected,                       
                    },
                    order: [
                        ['price', 'DESC']
                    ]
                }); 

                if (productList === undefined) return [500, "Errore server"];
            
                return [productList];
            }else if (filters.orderSelected === 'A-Z'){
                const productList = await Database.product.findAll({
                    where: {
                        category: filters.categorySelected,                             
                    },
                    order: [
                        ['product_name', 'ASC']
                    ]
                }); 

                if (productList === undefined) return [500, "Errore server"];
            
                return [productList];
            } else if ( filters.orderSelected === 'Z-A'){
                const productList = await Database.product.findAll({
                    where: {
                        category: filters.categorySelected,                       
                    },
                    order: [
                        ['product_name', 'DESC']
                    ]
                }); 

                if (productList === undefined) return [500, "Errore server"];
            
                return [productList];
            }
        }
    }

    async getAvailability(prodIdBody){
        
        let isAvailable = false;

        for (const item of prodIdBody.cart) {

            const productQty = await Database.product.findOne({
                attributes: ['qtyInStock'],
                where: {
                    id: item.id
                }
            });

            if (productQty.qtyInStock >= item.qty) {
                isAvailable = true;
            }else {
                isAvailable = false;
            }
    
        };  
   
        return [isAvailable];
    }

    async getProduct(prodIdBody){

        const product = await Database.product.findOne({
            where: {
                id: prodIdBody.prod_id,
            }
        });

        if ( product === undefined ) return [404, "Prodotto non trovato!"];

        const resultArray = Object.entries(product.dataValues).map(([key, value]) => ({key,value}));
 
        return[resultArray];
    }

    async getProductShop(prodIdBody){

        const product = await Database.product.findOne({
            where: {
                id: prodIdBody.prod_id,
            }
        });

        if ( product === undefined ) return [404, "Prodotto non trovato!"];
        
        return[product];
    }

    async editProduct(){
        
    }

}

module.exports = Product_controller;