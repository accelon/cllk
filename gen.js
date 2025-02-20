const fs=require('fs');

const srcfolder='./html/';
const outfolder='./off/';

const tidy=content=>{
    const at=content.indexOf('</div>');
    content=content.slice(at);


    const at4=content.lastIndexOf("<a id=listen>");
    if (at4) {
        content=content.slice(0,at4)
    }
    content=content.replace(/\%20/g,' ')
    .replace(/&nbsp;/g,' ')
    .replace(/\%0A/g,'\n')
    .replace(/&#(\d+);/g,(m,m1)=>String.fromCharCode(m1))
    .replace(/<[^>]+>/g,'');

    return content;
};
const files=fs.readdirSync(srcfolder);

let prevvol='';
const out=[]
const flush=()=>{
    console.log('writing',prevvol)
    fs.writeFileSync(outfolder+prevvol+'.off',out.join('\n'),'utf8')
    out.length=0;
}
const dofile=f=>{
    const [m,vol]=f.match(/(\d+)-(\d+)/);
    if (vol!==prevvol&&prevvol) flush();
    let content=fs.readFileSync(srcfolder+f,'utf8');
    content=tidy(content);
    out.push(content);
    prevvol=vol;
}
//files.length=1;
files.forEach(dofile);
flush();