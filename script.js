// let pencil= document.querySelector("#pencil");
// let redo= document.querySelector("#redo");
// let undo= document.querySelector("#undo");
// let download= document.querySelector("#Download");
// let upload= document.querySelector("#upload");

// let eraser= document.querySelector("#eraser");
// let StickyNote=document.querySelector("#StickyNote");

// pencil.addEventListener("click",function tellpencil(){
//     console.log("pencil is clicked");
// })
// redo.addEventListener("click",function tellredo(){
//     console.log("redo is clicked");
// })
// undo.addEventListener("click",function tellundo(){
//     console.log("undo is clicked");
// })
// download.addEventListener("click",function telldownload(){
//     console.log("download is clicked");
// })
// upload.addEventListener("click",function tellupload(){
//     console.log("upload is clicked");
// })
// eraser.addEventListener("click",function telleraser(){
//     console.log("eraser is clicked");
// })
// StickyNote.addEventListener("click",function tellStickyNote(){
//     console.log("StickyNote is clicked");
// })

let canvas=document.querySelector("#board")
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let tool= canvas.getContext("2d");
// select all in a better way
let toolarr= document.querySelectorAll(".tool");
let currtool="pencil";
for(let i=0;i<toolarr.length;i++){
    toolarr[i].addEventListener("click",function(e){
        // console.log("clicked on",toolarr[i]);
        const toolname=toolarr[i].id;
        if(toolname=="pencil"){
            currtool="pencil"
            tool.strokeStyle="blue"
        }
        else if(toolname=="StickyNote"){
            currtool= "StickyNote";
            createsticky();
        }
        else if(toolname=="undo"){
            currtool="undo"
            undofn()
        }
        else if(toolname=="Download"){
            currtool="Download";
            downloadfile()
        }
        else if(toolname=="upload"){
            currtool="upload"
            uploadfile()
        }
        else if(toolname=="eraser"){
            currtool="eraser"
            tool.strokeStyle="white"
            tool.lineWidth=50
        }else if(toolname=="redo"){
            currtool="redo"
            redofn()
        }
        else{

        }

    })
}

// using canvas 
// let canvas=document.querySelector("#board")
// canvas.width=window.innerWidth
// canvas.height=window.innerHeight

// let tool= canvas.getContext("2d");
//to start drawing
// tool.beginPath();
// //start point
// tool.moveTo(0,0);
// // change color of pencil
// tool.strokeStyle="red"
// //change widht of pencil
// tool.lineWidth=5;
// //ending point
// tool.lineTo(300,150)
// // drwn by calling stroke
// tool.stroke()
// //  stop drawing
// tool.closePath()
//check properties of tool
// console.log("toole",tool)


// to start draw on canvas
// where you clicked on canvas
// it gives an event Object

// there will be bug bcz of toolbar height
let to= document.querySelector(".toolbar")

function getYDelta(){
    let heightoftoolbar= to.getBoundingClientRect().height;
    return heightoftoolbar;
     
}
// to draw when 
let draw= false;


//create an undo stack
let undostack=[]
//create an redo stack
let redostack=[]
//we have some options like
// use function of canvas -clearRect()

// or use point store
canvas.addEventListener("mousedown",function(e){
    
    // console.log("X",e.clientX);
    // console.log("Y",e.clientY);
    let sx = e.clientX;
    let sy = e.clientY;
    //start draw here 
    tool.beginPath();
    //minus the cordinates of toolbar for correct drawing
    let toolbarheight=getYDelta();
    
    tool.moveTo(sx,sy-toolbarheight);
    draw=true;

    //getting every cordinate for undo
    let pointdesc={
        desc:"md",
        x:sx,
        y:sy-toolbarheight,
        
    }
    undostack.push(pointdesc)
})
//to keep drawing where evermouse goes
canvas.addEventListener("mousemove",function(e){
    if(draw==false){
        return 
    }
    let ex = e.clientX;
    let ey = e.clientY;
      //minus the cordinates of toolbar for correct drawing
      let toolbarheight=getYDelta();
      //end draw heere
    tool.lineTo(ex,ey-toolbarheight)
    tool.stroke()

     //getting every cordinate for undo
     let pointdesc={
        desc:"mm",
        x:ex,
        y:ey-toolbarheight,
        
    }
    undostack.push(pointdesc)
})

canvas.addEventListener("mouseup",function(e){
    // console.log("X",e.clientX);s
    // console.log("Y",e.clientY);
    draw=false;
    // let ex = e.clientX;
    // let ey = e.clientY;
    //   //minus the cordinates of toolbar for correct drawing
    //   let toolbarheight=getYDelta();
    //   //end draw heere
    // tool.lineTo(ex,ey-toolbarheight)
    // tool.stroke()
  
})


function createsticky(){
// making sticky note dynamic

let stickydiv=createroutershell()

let textarea=document.createElement("textarea");

textarea.setAttribute("class","textaare")

stickydiv.appendChild(textarea);
//add to page




}
// makiing commoon code for sticky note and upload image
function createroutershell(){
 
    let stickydiv=document.createElement("div");
    let stickyhead=document.createElement("div");
    let minimize=document.createElement("div");
    let closediv=document.createElement("div");
   
    //element append
    stickydiv.setAttribute("class","sticky");
    stickyhead.setAttribute("class","stickyhead");
   
    closediv.innerText="X";
    minimize.innerText="min"
    // now make structure
    stickydiv.appendChild(stickyhead);
    // stickydiv.appendChild(textarea);
    stickyhead.appendChild(minimize);
    stickyhead.appendChild(closediv);
    
    //add to page
    document.body.appendChild(stickydiv)
    
    let isminimized=false;
    closediv.addEventListener("click",function(){
        stickydiv.remove()
    })
    minimize.addEventListener("click",function(){
        
            textarea.style.display=isminimized==true?"block":"none";
            isminimized=!isminimized;
        
    
        
    })
    
    
    // sticky movement
    let isstickydown= false;
    stickyhead.addEventListener("mousedown",function(e){
        
         sx = e.clientX;
         sy = e.clientY;
        isstickydown=true
    })
    //to keep drawing where evermouse goes
    stickyhead.addEventListener("mousemove",function(e){
        if(isstickydown==true){
            let ex = e.clientX;
            let ey = e.clientY;
    
            let dx= ex-sx;
            let dy= ey-sy;
    
            let {top,left}=stickydiv.getBoundingClientRect();
            stickydiv.style.top=top+dy+"px";
            stickydiv.style.left=left+dx+"px";
            sx=ex;
            sy=ey;
        }
        
        
    })
    
    stickyhead.addEventListener("mouseup",function(e){
       
      isstickydown=false
    })
    return stickydiv;
}
let uploadbtn=document.querySelector(".uploadfile")
function uploadfile(){
    console.log("upload file clicked")
    //make click directly on input tage use click func which make input tag clicked
    uploadbtn.click();
    uploadbtn.addEventListener("change",function(){
        console.log("files",uploadbtn.files)  //to check only when data is inserted in file array
        //if check before adding eventlistener will give empty file array
        let data = uploadbtn.files[0]
        let img = document.createElement("img")

        // uploading image
        // img ke src me ye url jayega
        // img.src = URL.createObjectURL(data) //converting image to url
        let url = URL.createObjectURL(data) 
        img.src= url;
        // console.log("url",url)
        // giving image height
        // img.height=80;
        // img.width=100;
        img.setAttribute("class","uploadimg")
        // document.body.appendChild(img)
        let stickydiv= createroutershell();
        stickydiv.appendChild(img) //then add syling same like textare 
    })
    
}
function downloadfile(){
    //anchor button bnao
    // href me canvas ko url me convert krke dalo
    //anchor click
    // anchor remove

    let a = document.createElement("a")
    a.download="file.jpeg"
    let url = canvas.toDataURL("images/jpeg;base64")//to convert canvas to url
    a.href= url;
    a.click();
    a.remove();
}

function undofn(){
    
    if(undostack.length>0){
        tool.clearRect(0, 0, canvas.width, canvas.height);

        redostack.push(undostack.pop());
        for(let i=0;i<undostack.length;i++){
            let {x,y,desc}=undostack[i]
            if(desc=="md"){
                tool.beginPath();
                tool.moveTo(x,y);
            }
            else if(desc=="mm"){
                tool.lineTo(x,y);
                tool.stroke()
            }
        }
    }
}
function redofn(){
    if(redostack.length>0){
        tool.clearRect(0, 0, canvas.width, canvas.height);
        undostack.push(redostack.pop())
        for(let i=0;i<undostack.length;i++){
            let {x,y,desc}=undostack[i]
            if(desc=="md"){
                tool.beginPath();
                tool.moveTo(x,y);
            }
            else if(desc=="mm"){
                tool.lineTo(x,y);
                tool.stroke()
            }
        }
    }
}