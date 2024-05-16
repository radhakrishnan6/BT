const inputfile = process.argv;

const { Console } = require('console');
const fs = require('fs');
var arrfile=[];
for(var i=0;i<inputfile.length;i++)
{
    printfile(inputfile[i]);
   
    

    
}
//printfile('input.txt');

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
        collectarray(data.toString().split('\n').map((line)=>line.split(' ')))               
      });
      
}
//console.log(...arrfile);
function collectarray(fileprocessed)
{
   // console.log(...fileprocessed);
    let processobjofArr =fileprocessed.map(
    (item)=>item.map((x)=>
         {
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
            tempobj.Name=x;
        } 
        return tempobj;
      }       
      )   
    )
    
    let processreport = processobjofArr.reduce(getreport,{})
    
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
    console.log(processreport);
    
}

let tempsession =[];
let firsttimestampofthelog='';
let latesttimeofthelog='';
function getreport(acc,item)
{
    // console.log(item[0]);
   
    const uniqueName = item[1].Name;
    
       
        if (!acc[uniqueName]) {
            acc[uniqueName] = {'SessionCount':0,'TimeStamp':0};
        }
        let arrSession = tempsession.filter((x)=>(x.Name==item[1].Name))
        //console.log(item[1].Name);
        if(arrSession.length>0)
        {
            let prevtimestampinsec // =tempsession[arrSessioninx].TimeStamp.split(':').reduce((acc,time) => (60 * acc) + +time)
            let currenttimestampinsec//=item[0].TimeStamp.split(':').reduce((acc,time) => (60 * acc) + +time);
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
           //  console.log(arrSessioninx);
            if(firsttimestampofthelog==''){firsttimestampofthelog=item[0].TimeStamp.split(':').reduce((acc,time) => (60 * acc) + +time)};
            tempsession.push(
                {'TimeStamp':item[0].TimeStamp,
                'Name':item[1].Name,
                'Session':item[2].Session
            })
        }
        ///check whether the tempsession have any log value left 
      
        
        return acc
   /*let temparray={};
   var filterarr =item.map((x)=>
   {
      let temptime;
      let a;
      if(x.includes(":"))
       { 
         a =validateHhMm(x)
         if(a)
         {
             temptime=x.split(':').reduce((acc,time) => (60 * acc) + +time)
         }       
       }
       else
       {
           if(x !='Start' || x !='End')
           {
                if (!acc[x]) {
                    acc[x] = []
                }
                acc[category].push(item.name);
           }  
       }
   })*/
  /*  const category = item;
    if (!acc[category]) {
        acc[category] = []
    }
    acc[category].push(item.name);
    return acc
    */  
}

function validateHhMm(Datevalue) 
{
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(Datevalue);
    return isValid;
}

//console.log(validateHhMm('14:02:03'));
//console.log(inputfile[2]);
