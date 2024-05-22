const inputfile = process.argv;

const { Console } = require('console');
const fs = require('fs');
var arrfile=[];
for(var i=0;i<inputfile.length;i++)
{
    printfile(inputfile[i]);       
}

function printfile(file)
{     
     if(file.includes('.txt'))
     {        
       fnFileProcess(file)         
     }     
}
function fnFileProcess(file)
{
    let x;
    fs.readFile(file, (err, data) => {
        if (err) throw err;
        
        if(data.length !==0) 
        {
            collectarray(data.toString().split('\n').map(
                (line)=>                       
                        line.split(' ')                        
            )) 
        }                      
      });        
}


function collectarray(fileprocessed)
{   
    let processobjofArr =fileprocessed.map(
    (item)=>
        item.map((x)=>
        {           
            if(x.toLowerCase().trim() !==""){
                let tempobj={};
                if(x.includes(":"))
                    {
                       tempobj.TimeStamp=x; 
                    }
                    else if(x.toLowerCase().trim() =='start' || x.toLowerCase().trim() =='end' )
                    {                      
                        tempobj.Session=x.toLowerCase().trim();
                    }
                    else
                    {                            
                      tempobj.Name=(x.trim()!='')?x:'undefined';                                
                    } 
                    return tempobj;
            }                 
        }          
     )   
   )
    processobjectreport(processobjofArr); 
}

function processobjectreport(processArr)
{
    let processreport = processArr.reduce(getreport,{})
    if(processreport)
    {
        if(tempsession.length>0)
        {            
              for(var j=0;j<tempsession.length;j++)
               {
                   if(tempsession[j].Session =='start')
                   {       
                     let starttimestamp =tempsession[j].TimeStamp.split(':').reduce((acc,time) => (60 * acc) + +time)
                     if(latesttimeofthelog<starttimestamp)
                      {  processreport[tempsession[j].Name].SessionCount++;  } // check if this is a last start this is last record in the log  so just increment the session count 
                      else 
                      {
                        processreport[tempsession[j].Name].SessionCount++;
                        processreport[tempsession[j].Name].TimeStamp=processreport[tempsession[j].Name].TimeStamp+(latesttimeofthelog-starttimestamp);
                         
                       }
        
                   }
                   else if(tempsession[j].Session =='end')
                   {
                       let endtimestamp =tempsession[j].TimeStamp.split(':').reduce((acc,time) => (60 * acc) + +time)
                       if(firsttimestampofthelog>endtimestamp)
                       {  processreport[tempsession[j].Name].SessionCount++;   
                       } //check if end time stamp is logged as first record  if yes just increment the session count  
                       else 
                       {
                        processreport[tempsession[j].Name].SessionCount++;
                        processreport[tempsession[j].Name].TimeStamp=processreport[tempsession[j].Name].TimeStamp+(endtimestamp-firsttimestampofthelog);
                        
                       }
                   }
              }
         }

        if(processreport)
         {
            for(var key in processreport)
            {
                console.log(key+" "+processreport[key].SessionCount+" "+processreport[key].TimeStamp);
            }       
         }
    }
        
}

let tempsession =[];
let firsttimestampofthelog='';
let latesttimeofthelog='';
function getreport(acc,item)
{  
        
        if(item[0] !== undefined )
        {           
            const uniqueName = item[1].Name;   
            if (!acc[uniqueName]) {
                acc[uniqueName] = {'SessionCount':0,'TimeStamp':0};
            }
            let arrSession = tempsession.filter((x)=>(x.Name==item[1].Name))           
            if(arrSession.length>0)
            {
                let prevtimestampinsec ;
                let currenttimestampinsec;
                if(item[2].Session=='end')
                {
                    let arrsessioninx =tempsession.findIndex((x)=>(x.Name==item[1].Name && x.Session=='start'))
                    prevtimestampinsec  =tempsession[arrsessioninx].TimeStamp.split(':').reduce((acc,time) => (60 * acc) + +time)
                    currenttimestampinsec=item[0].TimeStamp.split(':').reduce((acc,time) => (60 * acc) + +time);
                    latesttimeofthelog=(latesttimeofthelog<currenttimestampinsec)?currenttimestampinsec:latesttimeofthelog;
                    
                    if(tempsession[arrsessioninx].Session=='start')
                    { 
                         acc[uniqueName].SessionCount++;
                         acc[uniqueName].TimeStamp=acc[uniqueName].TimeStamp+(currenttimestampinsec-prevtimestampinsec);
                         tempsession.splice(arrsessioninx,1);
                    }
                    else if(tempsession[arrsessioninx].Session=='end')
                    {
                        tempsession.push(
                            {'TimeStamp':item[0].TimeStamp,
                            'Name':item[1].Name,
                            'Session':item[2].Session
                        })     
                    }
                }
                else if(item[2].Session=='start')
                {
                   
                    tempsession.push(
                        {'TimeStamp':item[0].TimeStamp,
                        'Name':item[1].Name,
                        'Session':item[2].Session
                    }) 
                }
                            
            }  
            else
            {
               
                if(firsttimestampofthelog==''){firsttimestampofthelog=item[0].TimeStamp.split(':').reduce((acc,time) => (60 * acc) + +time)};
                tempsession.push(
                    {'TimeStamp':item[0].TimeStamp,
                    'Name':item[1].Name,
                    'Session':item[2].Session
                })
            }
            ///check whether the tempsession have any log value left 
        }   
        return acc

}

function validateHhMm(Datevalue) 
{
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(Datevalue);
    return isValid;
}


