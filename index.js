const express           = require("express");
const cors              = require("cors");
const { mongoConnect }  = require("./utils/database");
const got               = require('got');
const cheerio           = require('cheerio');
const createTextVersion = require("textversionjs");
const fs                = require("fs");

fs.readFile("urls.txt", function(err, buf) {  
    const url = buf.toString();
    extractLinks(url);
});

require("dotenv").config({path: `${__dirname}/.env`,});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

mongoConnect((client) => {console.log("Connected")});
//calling urls list
const callinglinks =[];
var        urllink =[];
var        urllink2=[];
var        urllink3=[];
var        urllink4=[];

//loop
const extractLinks = async (url) => {
  try {
    const response = await got(url);          
    const html  = response.body;

    wordcount   = wordCountcheck(html);        
    console.log("Word count in  "+url +"  :->  "+wordcount);
    
    const $     = cheerio.load(html);  

    const linkObjects       = $('a');    
    const linkObjectsCSS    = $('link');
    const linkObjectsJS     = $('script');
    
    linkObjects.each( async (index, element) => { 
        const link = $(element).attr('href')
   
        if(checklink(link)==1)
            { urllink.push(link);}
   
        else if(checklink(link)==2)
            { urllink2.push(link);}
        });

    linkObjectsCSS.each( async (index, element) => { 
        const link3 = $(element).attr('href')
        urllink3.push(link3);
   
    });

    linkObjectsJS.each( async (index, element) => { 
        const link4 = $(element).attr('src')
        if (link4!=null){
            urllink4.push(link4);
        }
    });

    console.log("URL with BASE URL");
    console.log(urllink);
    console.log("URL without BASE URL");
    console.log(urllink2);
    console.log("CSS URL");
    console.log(urllink3);
    console.log("javascript URL");
    console.log(urllink4);
    //Store urllink, urllink2, urllink3, urllink4 in DB
   }
    
    catch (error) {console.log(error.response.body);}    
} 

const wordCountcheck = (html) =>{
    var textVersion = createTextVersion(html);  //to do word count
    var wordCount = textVersion.match(/(\w+)/g).length;
    return wordCount;   
}
const checklink = (link) => {

const URL = "https://richpanel.com" 
 if(link != null){   
    if(link.includes(URL)){
        return 1;}
    else if(link.includes('https')||link.includes('http')){
        return 2;
    }
    }
}

