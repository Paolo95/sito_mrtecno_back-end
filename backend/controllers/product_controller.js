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

        console.log(filters.brandCheckedList)
        if (filters.brandCheckedList.length === 0 || filters.brandCheckedList.filter(n => n).length === 0){
            if (filters.orderChoice === 0){
                const shopItems = await Database.product.findAll({
                    where: {
                        category: filters.categoryChecked,
                        price: {
                            [Op.gte]: filters.min,
                            [Op.lte]: filters.max,
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

}

module.exports = Product_controller;