const express           = require("express");
const cors              = require("cors");
const { mongoConnect }  = require("./utils/database");
const got               = require('got');
const cheerio           = require('cheerio');
const createTextVersion = require("textversionjs");
const fs                = require("fs"), readline = require('readline');

//Reading URLS line by line from TXT file
var rd = readline.createInterface({
    input: fs.createReadStream('urls.txt')
});

rd.on('line', function(line) {
    extractLinks(line);
});

//reading environment variables
require("dotenv").config({path: `${__dirname}/.env`,});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//connecting Database
mongoConnect((client) => {console.log("Connected")});

const callinglinks =[];
var        urllink =[];
var        urllink2=[];
var        urllink3=[];
var        urllink4=[];

//async function to get word count and linked URLs
const extractLinks = async (url) => {
  try {
    const response = await got(url);          
    const html  = response.body;

    //wordcount of that page
    wordcount   = wordCountcheck(html);        
    console.log(await "Word count in  "+url +"  :->  "+wordcount);
    
    const $     = cheerio.load(html);  

    const linkObjects       = $('a');    
    const linkObjectsCSS    = $('link');
    const linkObjectsJS     = $('script');
    
    
    linkObjects.each( async (index, element) => { 
        const link = $(element).attr('href')
 
        //linked urls with same domain
        if(checklink(link,url)==1)
            { urllink.push(link);}
 
        //linked urls with same domain
        else if(checklink(link,url)==2)
            { urllink2.push(link);}
        });

    //linked URL CSS
    linkObjectsCSS.each( async (index, element) => { 
        const link3 = $(element).attr('href')
        urllink3.push(link3);
   
    });

    //Linked URL JavaScript
    linkObjectsJS.each( async (index, element) => { 
        const link4 = $(element).attr('src')
        if (link4!=null){
            urllink4.push(link4);
        }
    });

    //Calling save function
    savedata(url,urllink,urllink2,urllink3,urllink4,wordcount);
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

//For word count in each page
const wordCountcheck = (html) =>{
    var textVersion = createTextVersion(html);  //to do word count
    var wordCount = textVersion.match(/(\w+)/g).length;
    return wordCount;   
}

//To check the list of urls for correct category
const checklink = (link,url) => {

 if(link != null){   
    if(link.includes(url)){
        return 1;}
    else if(link.includes('https')||link.includes('http')){
        return 2;
    }
    }
}

//to save data in Database
const savedata = (url,urllink,urllink2,urllink3,urllink4,wordcount) => {
    try{
    var myobj ={"baseUrl": url,"baseSubUrl": urllink,"SubUrl":urllink2,"jsUrl":urllink3,"cssUrl":urllink4,"wordcount": wordcount};
    var dbo = db.db("mydb");
    dbo.collection("websites").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
});
}
catch (error) {console.log(error.response.body);}  
}


