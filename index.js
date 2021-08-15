const express           = require("express");
const cors              = require("cors");
const { mongoConnect }  = require("./utils/database");

const got               = require('got');
const cheerio           = require('cheerio');
const createTextVersion = require("textversionjs");
const fs                = require("fs");

//fs.readFile("urls.txt", function(err, buf) {  //const url = buf.toString();
//});

require("dotenv").config({
    path: `${__dirname}/.env`,
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

mongoConnect((client) => {  console.log("Connected")});


//calling urls list
const callinglinks =[];
var        urllink =[];
var        urllink2=[];

//loop
const extractLinks = async (url) => {
  try {
    const response = await got(url);            // Fetching HTML Code
    const html = response.body;

    var textVersion = createTextVersion(html);  //to do word count
    var wordCount = textVersion.match(/(\w+)/g).length;
    
    console.log(wordCount);        // Using cheerio to extract <a> tags
    
    const $ = cheerio.load(html);  //console.log($('link').attr('stylesheet'));

    const linkObjects = $('a');    // this is a mass object, not an array

   
    linkObjects.each( async (index, element) => { 
   
        const link = $(element).attr('href')
   
        if(checklink(link)==1)
            { urllink.push(link);}
   
        else if(checklink(link)==2)
            { urllink2.push(link);}
        }
   
        );
    }
    
    catch (error) {console.log(error.response.body);}    
} 
    
    



//URL
const URL = 'https://richpanel.com';
extractLinks(URL);

const checklink = (link) => {
 
 if(link != null){   
    if(link.includes(URL)){
        return 1;}
    else if(link.includes('https')||link.includes('http')){
        return 2;
    }
    }
}


exports.getDatabase = async (req, res, next) => {
    req.db = await getDb();
    next();
};