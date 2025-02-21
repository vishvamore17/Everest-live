const mongoose = require('mongoose');

// Define the Owner schema
const ownerSchema = new mongoose.Schema(
  {
    logo: {
      type:String
    },
    companyName: {
      type:String
    },
    ownerName: {
      type:String
    },
    contactNumber: {
      type:String
    },
    emailAddress: {
      type:String
    },
    website: {
      type:String
    },
    businessRegistration: {
      type:String,
      enum: ["Sole proprietorship" , "One person Company","Parternship","Private Limited"],
    },
    companyType: {
      type:String,
    },
    employeeSize: {
      type:String, 
      enum:["1-10","11-50","51-100",">100"],
    },
    panNumber: {
      type:String
    },
    documentType:{
    type:String,
    required:true,
    enum:["GST Number","UdhayamAadhar Number","State Certificate", "Certificate of Incorporation"],
    description:"Type of document selected"
   },
   gstNumber:{
    type:String,
   },

   udhayamAadhar :{
    type:String,
   },

   stateCertificate:{
    type:String,
   },

   incorporationCertificate:{
    type:String,
     },
     dataFilled: { type: Boolean, default: true }, // Adding the flag to the schema

  },
  { timestamps: true }
);




const Owner = mongoose.model('Owner', ownerSchema); 

module.exports = Owner;
