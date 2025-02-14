const fs=require('fs')
const iconv = require('iconv-lite');
const https = require("https")
const baseurl='https://84000.org/tipitaka/read/m_siri.php?';
const vols={
    //1:60,

    //DN
    9:13,
    10:10,
    11:11,
    //MN
    12:50,
    13:50,
    14:52,
    //SN
    15:271,
    16:240,
    17:333,
    18:292,
    19:444,
    //AN
    20:201,
    21:144,
    22:368,
    23:238,
    24:218

}
const outdir="html/";

function fetch(baseurl,book,siri){
    return new Promise((resolve,reject)=>{
        const req=https.get(baseurl+'B='+book+'&siri='+siri,function(res){
           let chunks=[]; 
            res.on("data",data=>{
                const decodedText = iconv.decode(data, 'TIS-620');

                chunks.push(decodedText.replace(/\ufffd/g,'"').replace('CHARSET="tis-620"','CHARSET="utf-8"'))
            })
            res.on("end",()=>{
                resolve(chunks.join(''));
            })
        });
        req.on("error",(err)=>{
            reject(err)
        })
        req.end();
    })
}
const doarticle=async  ()=>{
    for (let v in vols) {
        for (let i=1;i<vols[v];i++) {
            const d=await fetch(baseurl,v,i);
            process.stdout.write('\r'+i)
            fs.writeFileSync( outdir+v+'-'+i+'.html', d,'utf8');
        }
    }

}

doarticle();