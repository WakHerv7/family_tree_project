
var gap_v = 450;
var gap_h = 150;
var largest_gen = null;
var nb_gen = null;
var family = null;
var familyGenerations = null;
var fmCoord = [];
var fmCoupleCoord = [];
var fmLineCoord = [];
var lastCoupleId = 0
var lastLineId = 0
let radius = 40;
let extraRadiusWidth = 8;
let padding_h = 30;
let padding_v = 30;

function generateRandomHSLColor() {
    let colorHue = Math.floor(Math.random() * 360);
    let colorSaturation = 50;
    let colorLuminosity = 50;

    let color = 'HSL(' + colorHue + ',' + colorSaturation + '%,' + colorLuminosity + '%)';
    return color;
}
function getFirst2Initials(name) {
    let w = '';
    const namesTab = name.split(' ');
    for (let i = 0; i < namesTab.length; i++) {
        if (i < 2) {
            w = w + namesTab[i][0];
        }        
    }
    w = w.toUpperCase();
    // console.log(w)
    return w
}
function createBallSvgCircle(id, x, y) {
    // let radius = 25;
    const svgCircles = document.querySelector('#mysvg #manyCircles');

    let randomColor = generateRandomHSLColor();
    // create a circle
    const circle0 = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    circle0.setAttribute('class', `oneBall oneBall${id}`);
    circle0.setAttribute('cx', x);
    circle0.setAttribute('cy', y);
    circle0.setAttribute('r', `${radius}`);
    // circle0.setAttribute('fill', 'red');
    circle0.setAttribute('style', `stroke:#ddd; fill:${randomColor}; stroke-width: 1;`);
    
    //stroke:#ddd;

    svgCircles.append(circle0);
}
function openBallMenu(ballDomId) {
    // console.log("openBallMenu : "+ballDomId)
    const oneBall = document.getElementById(ballDomId);
    // const oneScreen = document.getElementById("bg_screen0");
    // console.log(oneScreen)
    oneBall.classList.toggle('displayNone');
    // oneScreen.classList.toggle('displayNone');
    oneBall.setAttribute('onclick', `openBallMenu("${ballDomId}")`);
}

function createBallSvgInnerText(id, myname, myphoto=null, isIncomingSpouse, x, y) {
    const svgCircleTexts = document.querySelector('#mysvg #manyCircleTexts');

    // const path0 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // a = "M11.1 35.25q3.15-2.2 6.25-3.375Q20.45 30.7 24 30.7q3.55 0 6.675 1.175t6.275 3.375q2.2-2.7 3.125-5.45Q41 27.05 41 24q0-7.25-4.875-12.125T24 7q-7.25 0-12.125 4.875T7 24q0 3.05.95 5.8t3.15 5.45ZM24 25.5q-2.9 0-4.875-1.975T17.15 18.65q0-2.9 1.975-4.875T24 11.8q2.9 0 4.875 1.975t1.975 4.875q0 2.9-1.975 4.875T24 25.5ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.15 1.575-7.775t4.3-6.35q2.725-2.725 6.375-4.3Q19.9 4 24 4q4.15 0 7.775 1.575t6.35 4.3q2.725 2.725 4.3 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.3 6.375-2.725 2.725-6.35 4.3Q28.15 44 24 44Zm0-3q2.75 0 5.375-.8t5.175-2.8q-2.55-1.8-5.2-2.75-2.65-.95-5.35-.95-2.7 0-5.35.95-2.65.95-5.2 2.75 2.55 2 5.175 2.8Q21.25 41 24 41Zm0-18.5q1.7 0 2.775-1.075t1.075-2.775q0-1.7-1.075-2.775T24 14.8q-1.7 0-2.775 1.075T20.15 18.65q0 1.7 1.075 2.775T24 22.5Zm0-3.85Zm0 18.7Z"
    // a = "M24 23.95q-3.3 0-5.4-2.1-2.1-2.1-2.1-5.4 0-3.3 2.1-5.4 2.1-2.1 5.4-2.1 3.3 0 5.4 2.1 2.1 2.1 2.1 5.4 0 3.3-2.1 5.4-2.1 2.1-5.4 2.1ZM8 40v-4.7q0-1.9.95-3.25T11.4 30q3.35-1.5 6.425-2.25Q20.9 27 24 27q3.1 0 6.15.775 3.05.775 6.4 2.225 1.55.7 2.5 2.05.95 1.35.95 3.25V40Zm3-3h26v-1.7q0-.8-.475-1.525-.475-.725-1.175-1.075-3.2-1.55-5.85-2.125Q26.85 30 24 30t-5.55.575q-2.7.575-5.85 2.125-.7.35-1.15 1.075Q11 34.5 11 35.3Zm13-16.05q1.95 0 3.225-1.275Q28.5 18.4 28.5 16.45q0-1.95-1.275-3.225Q25.95 11.95 24 11.95q-1.95 0-3.225 1.275Q19.5 14.5 19.5 16.45q0 1.95 1.275 3.225Q22.05 20.95 24 20.95Zm0-4.5ZM24 37Z"
    // // a = "M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
    // path0.setAttribute('d', a);
    // path0.setAttribute('class', `oneBallInnerText oneBallInnerText${id}`);
    // path0.setAttribute('transform',`translate(${x-24},${y+6-30})`);
    // path0.setAttribute('style', 'fill: white; text-anchor: middle; font-size: 16px; text-shadow: 2px 2px 10px black; user-select: none;')    
    // svgCircleTexts.append(path0);
    // console.log("createBallSvgInnerText")


    const circleTextTop0 = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    circleTextTop0.setAttribute('class', `oneBallTextInner oneBallTextInner${id}`);
    circleTextTop0.setAttribute('x', x-25);
    circleTextTop0.setAttribute('y', y-25);
    circleTextTop0.setAttribute('width', 50);
    circleTextTop0.setAttribute('height', 50);
    const div0 = document.createElement("div");
    if (myphoto) {
        circleTextTop0.setAttribute('x', x-45);
        circleTextTop0.setAttribute('y', y-45);
        circleTextTop0.setAttribute('width', 90);
        circleTextTop0.setAttribute('height', 90);
        div0.setAttribute('onclick',`openBallMenu("oneBallMenu${id}")`)
        div0.setAttribute('style','color: white; width:100%; height:100%; background-image:url("'+myphoto+'"); background-size:cover; background-position: center center; border-radius:50%; border: 2px solid white; text-align:center; font-size:22px; font-weight:bold; user-select: none; display: flex; align-items:center; justify-content:center;')


    } else {        
        div0.innerHTML = getFirst2Initials(myname);
        div0.setAttribute('onclick',`openBallMenu("oneBallMenu${id}")`)
        div0.setAttribute('style','color: white; width:100%; height:100%; background:transparent; border-radius:50%; text-align:center; font-size:22px; font-weight:bold; user-select: none; display: flex; align-items:center; justify-content:center;')    
    }
    
    circleTextTop0.appendChild(div0);
    svgCircleTexts.append(circleTextTop0);


    const svgManyMenus = document.querySelector('#mysvg #manyMenus');
    const circleTextTop1 = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    circleTextTop1.setAttribute('class', `oneBallMenu oneBallMenu${id} displayNone`);
    circleTextTop1.setAttribute('id', `oneBallMenu${id}`);
    circleTextTop1.setAttribute('x', x-1080);
    circleTextTop1.setAttribute('y', `${y-1200}`);
    if (isIncomingSpouse) {
        circleTextTop1.setAttribute('x', x-1038);
        circleTextTop1.setAttribute('y', `${y-1140}`);
    }
    // circleTextTop1.setAttribute('width', 200);
    // circleTextTop1.setAttribute('height', 135);
    circleTextTop1.setAttribute('width', `${2000}`);
    circleTextTop1.setAttribute('height', `${2000}`);
    const div1 = document.createElement("div");
    if (isIncomingSpouse) {
        div1.innerHTML = `
        <ul>
            <li><a href="show_item/${id}">Voir</a></li>
            <li><a href="update_item/${id}">Modifier</a></li>
        </ul>
        `;
    } else {
        div1.innerHTML = `
        <ul>
            <li><a href="show_item/${id}">Voir</a></li>
            <li><a href="update_item/${id}">Modifier</a></li>
            <li><a href="new_spouse/${id}">Ajouter un conjoint</a></li>
            <li><a href="new_child/${id}">Ajouter un enfant</a></li>
        </ul>
        `;
    }
    
    div1.setAttribute('class','fm_menu ')
    div1.setAttribute('onclick',`console.log("oneBallMenu${id}")`)
    circleTextTop1.appendChild(div1);
    svgManyMenus.append(circleTextTop1);

}
function createBallSvgLowerText(id, myname, x, y) {
    const svgCircleTextsTop = document.querySelector('#mysvg #manyCircleTextsBottom');

    const circleTextTop0 = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");

    circleTextTop0.setAttribute('class', `oneBallTextBottom oneBallTextBottom${id}`);
    circleTextTop0.setAttribute('x', x-50);
    circleTextTop0.setAttribute('y', y + radius + 15);
    circleTextTop0.setAttribute('width', 100);
    circleTextTop0.setAttribute('height', 70);

    const div0 = document.createElement("div");
    div0.innerHTML = myname;
    div0.setAttribute('style','color: white; text-align:center; width:100px; font-size:13px; font-weight:bold; user-select: none;')
    circleTextTop0.appendChild(div0);
    // let textNode = document.createTextNode(this.ballName);
    // circleTextTop0.appendChild(textNode);
    circleTextTop0.setAttribute('style', 'font-family: 3ds, sans-serif; fill: white; text-anchor: middle; font-size: 14px; text-shadow: 2px 2px 10px black; user-select: none;');

    svgCircleTextsTop.append(circleTextTop0);
}

function drawLine(id, x1, y1, x2, y2) {
    const svgLines = document.querySelector('#mysvg #manyLines');
    let Line0 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    Line0.setAttribute('class', `Line Line${id}`);
    Line0.setAttribute('x1', x1);
    Line0.setAttribute('y1', y1);
    Line0.setAttribute('x2', x2);
    Line0.setAttribute('y2', y2);
    Line0.setAttribute('stroke', '#ffeb3b97');
    Line0.setAttribute('stroke-width', 2);
    // Line0.setAttribute('stroke-dasharray', 5.5);
    svgLines.append(Line0);
}
function toRadians (angle) {
    return angle * (Math.PI / 180);
  }
function couple(x1, y1, x2, y2) {
    let rad = radius + extraRadiusWidth;
    let dx = x2-x1;
    let dy = y2-y1;
    let alpha = Math.atan(dx/dy);
    let beta = toRadians(180) - (alpha+toRadians(90));
    const svgCouples = document.querySelector('#mysvg #manyCouples');
    let path0 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path0.setAttribute('class', `Couple`);
    path0.setAttribute('d', `M${x1 + ((rad)*Math.sin(beta))},${y1 - ((rad)*Math.cos(beta))} 
                            L${x2 + ((rad)*Math.sin(beta))},${y2 - ((rad)*Math.cos(beta))}
                            A30,30 0 0,1 ${x2 - ((rad)*Math.sin(beta))},${y2 + ((rad)*Math.cos(beta))}
                            L${x1 - ((rad)*Math.sin(beta))},${y1 + ((rad)*Math.cos(beta))}
                            A30,30 0 0,1 ${x1 + ((rad)*Math.sin(beta))},${y1 - ((rad)*Math.cos(beta))}`);

    // path0.setAttribute('d', `M${x1},${y1-rad} 
    //                         L${x2},${y2-rad}
    //                         A30,30 0 0,1 ${x2},${y2+rad}
    //                         L${x1},${y1+rad}
    //                         A30,30 0 0,1 ${x1},${y1-rad}`);

    // path0.setAttribute('d', `M${50},${50+(i*gap_v)-30} 
    //                         L${50+((j-1)*gap_h)},${50+(i*gap_v)-30}
    //                         A30,30 0 0,1 ${50+((j-1)*gap_h)},${50+(i*gap_v)+30}
    //                         L${50},${50+(i*gap_v)+30}
    //                         A30,30 0 0,1 ${50},${50+(i*gap_v)-30}`);
                            // L${50},${(i*gap_v)+30}
    path0.setAttribute('style', "stroke:#ffffff99; stroke-width:2; fill:none;");
    svgCouples.append(path0);
}


function getById(Tab, id) {
    for (let i = 0; i < Tab.length; i++) {
        if (Tab[i]["id"] == id) {
            return Tab[i]
        }        
    }
    return false
}
function isFMIncomingSpouse(Tab, id) {
    for (let i = 0; i < Tab.length; i++) {
        if (Tab[i]["id"] == id) {
            // if (Tab[i]["isIncomingSpouse"] == false) {
                return Tab[i]["isIncomingSpouse"]
            // }
        }        
    }
    return false
}
function getFMIndex(Tab, id) {
    for (let i = 0; i < Tab.length; i++) {
        if (Tab[i]["id"] == id) {
            return i
        }        
    }
    return -1
}
function getFMParentIds(Tab, id) {
    for (let i = 0; i < Tab.length; i++) {
        if (Tab[i]["id"] == id) {
            return {"mother": Tab[i]["mother"], "father": Tab[i]["father"]}
        }        
    }
    return -1
}
function getCoupleByFMIds(Tab, id1, id2) {
    for (let i = 0; i < Tab.length; i++) {
        if ((Tab[i]["id1"] == id1 && Tab[i]["id2"] == id2) || (Tab[i]["id1"] == id2 && Tab[i]["id2"] == id1)) {
            return Tab[i]
        }        
    }
    return false
}


// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
function initializeSvgZone(viewboxWidth, viewboxHeight) {
    const svgImage = document.getElementById('mysvg');
    const svgContainer = document.getElementById('mysvgcontainer');
    var viewBox = {
        x:-300,
        y:0,
        w:viewboxWidth,
        h:viewboxHeight
    };
    svgImage.setAttribute(
        'viewBox', 
        `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`
    );
    const svgSize = {
        w:svgImage.clientWidth,
        h:svgImage.clientHeight
    };
    // console.log("svgSize : ", svgSize)
    var isPanning = false;
    var startPoint = {x:0,y:0};
    var endPoint = {x:0,y:0};;
    var scale = 1;

    svgContainer.addEventListener("mousewheel", (e) => {
        e.preventDefault();
        var w = viewBox.w;
        var h = viewBox.h;
        var mx = e.offsetX;//mouse x  
        var my = e.offsetY;    
        var dw = w*Math.sign(e.deltaY)*0.1;
        var dh = h*Math.sign(e.deltaY)*0.1;
        var dx = dw*mx/svgSize.w;
        var dy = dh*my/svgSize.h;
        viewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w-dw,h:viewBox.h-dh};
        scale = svgSize.w/viewBox.w;
        // console.log("scale : ", scale)
        // zoomValue.innerText = `${Math.round(scale*100)/100}`;
        svgImage.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    });

    svgContainer.addEventListener("mousedown", (e) =>{
        isPanning = true;
        startPoint = {x:e.x,y:e.y};   
    });
    
    
    svgContainer.addEventListener("mousemove", (e) =>{
        if (isPanning){
            endPoint = {x:e.x,y:e.y};
            var dx = (startPoint.x - endPoint.x)/scale;
            var dy = (startPoint.y - endPoint.y)/scale;
            var movedViewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w,h:viewBox.h};
            svgImage.setAttribute('viewBox', `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`);
        }
    });
    
    svgContainer.addEventListener("mouseup", (e) =>{
        if (isPanning){ 
            endPoint = {x:e.x,y:e.y};
            var dx = (startPoint.x - endPoint.x)/scale;
            var dy = (startPoint.y - endPoint.y)/scale;
            viewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w,h:viewBox.h};
            svgImage.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
            isPanning = false;
        }
    });
    
    svgContainer.addEventListener("mouseleave", (e) =>{
        isPanning = false;
    });
}


// ************************************************************************************
(function ($) {
    $(document).ready(function ($) {

        
        function getFamilyMemebers() {
            $.ajax({
                type: 'GET',
                url: "family_data",
                data: {},
                success: function (response) {
                    // if not valid user, alert the user
                    if(!response["nb_gen"]){
                        alert("No gen");
                    }
                    else {
                        largest_gen = response["largest_gen"];
                        nb_gen = response["nb_gen"];
                        family = response["family"];
                        familyGenerations = response["familyGenerations"];

                        const mySvg = document.getElementById('mysvg');
                        // mySvg.setAttribute('width', `${50+(gap_h*largest_gen["size"])}px`);
                        // mySvg.setAttribute('height', `${50+(gap_v*nb_gen)}px`);
                        let parentTabAllGen = [];
                        // let reorganizedGen = [];
                        for (let i = 0; i < nb_gen; i++) {
                            let parentTab = {"fm":[], "fmsp":[]};
                            let reorganizedGen = {"fm":[], "fmsp":[]};
                            if (i > 0) {
                                parentTab["fm"] = parentTabAllGen[i-1]["fm"]
                                parentTab["fmsp"] = parentTabAllGen[i-1]["fmsp"]                               

                                for (let k = 0; k < parentTab["fm"].length; k++) {
                                    let parentHasChildren = false;
                                    for (let p = 0; p < familyGenerations[i].length; p++) {
                                        let myParentIds = getFMParentIds(family, familyGenerations[i][p]);
                                        if ((parentTab["fm"][k]["id"] == myParentIds["mother"] && myParentIds["mother"] != null) || (parentTab["fm"][k]["id"] == myParentIds["father"] && myParentIds["father"] != null)) {
                                            reorganizedGen["fm"].push({"id":familyGenerations[i][p], "children":0, "allChildren":0, "parentId": parentTab["fm"][k]["id"]})
                                            // parentTab["fm"][k]["children"]++
                                            parentTabAllGen[i-1]["fm"][k]["children"]++;
                                            parentTabAllGen[i-1]["fm"][k]["allChildren"]++;
                                            parentHasChildren = true;
                                        }                                        
                                    }
                                    if (parentHasChildren == false) {
                                        reorganizedGen["fm"].push({"id":null, "children":0, "allChildren":0, "parentId": parentTab["fm"][k]["id"]})
                                    }
                                }
                                for (let k = 0; k < familyGenerations[i].length; k++) {
                                    let flag = false;
                                    for (let p = 0; p < reorganizedGen["fm"].length; p++) {
                                        if (familyGenerations[i][k] == reorganizedGen["fm"][p]["id"]) {
                                            flag = true;
                                        }
                                    }
                                    if (flag == false) {
                                        reorganizedGen["fmsp"].push({"id":familyGenerations[i][k], "children":0, "allChildren":0, "parentId": null});
                                    }
                                }
                                // console.log(reorganizedGen);
                                
                                parentTabAllGen.push(reorganizedGen);
                                // console.log(parentTabAllGen);
                                // for (j = 0; j < reorganizedGen.length; j++) {                                
                                //     let fm = {"id":reorganizedGen[j], "x":50+(j*gap_h), "y":50+(i*gap_v), "gender":null, "couples":[]}
                                //     fmCoord.push(fm)
                                // }
                            } else {
                                for (let j = 0; j < familyGenerations[i].length; j++) {
                                    let isIncomingSpouse = isFMIncomingSpouse(family, familyGenerations[i][j]);
                                    if (isIncomingSpouse == false) {
                                      parentTab["fm"].push({"id":familyGenerations[i][j], "children":0, "allChildren":0, "parentId":null})
                                    } else {
                                        parentTab["fmsp"].push({"id":familyGenerations[i][j], "children":0, "allChildren":0, "parentId":null})
                                    }
                                    
                                }
                                parentTabAllGen.push(parentTab)
                            }
                        }
                        for (let i = nb_gen-1; i >=0; i--) {
                            for (let j = 0; j < parentTabAllGen[i]["fm"].length; j++) {
                                if (i > 0) {
                                    for (let k = 0; k < parentTabAllGen[i-1]["fm"].length; k++) {
                                        if (parentTabAllGen[i]["fm"][j]["parentId"] == parentTabAllGen[i-1]["fm"][k]["id"]) {
                                            let nn = parentTabAllGen[i]["fm"][j]["allChildren"];
                                            if (nn > 0) {
                                                nn = nn - 1;
                                            }
                                            // nn = parentTabAllGen[i]["fm"][j]["allChildren"] - 1;
                                            // console.log(nn);
                                            parentTabAllGen[i-1]["fm"][k]["allChildren"] += nn;
                                            
                                        }
                                    }
                                }

                            }
                        }
                        largest_gen["size"] = parentTabAllGen[0]["fm"][0]["allChildren"];                        
                        console.log(parentTabAllGen);

                        let distTab = [];
                        let distTabxx = [];
                        for (let i = nb_gen-1; i >=0; i--) {
                            let j = 0;
                            let prev_x = 0;
                            let prev_x_sp = 0;
                            let dist = [];
                            let distxx = [];
                            for (j = 0; j < parentTabAllGen[i]["fm"].length; j++) {
                                dist.push(prev_x);
                                if (parentTabAllGen[i]["fm"][j]["id"] == null) {
                                    prev_x += gap_h;
                                    // console.log('voluntary space')
                                    // console.log(parentTabAllGen[i]["fm"][j])
                                } else {
                                    if (parentTabAllGen[i]["fm"][j]["allChildren"] > 0) {
                                        // radius
                                        let ll = (((parentTabAllGen[i]["fm"][j]["allChildren"]-1)*gap_h));
                                        let xx = prev_x+(ll/2);
                                        let fm = {"id":parentTabAllGen[i]["fm"][j]["id"], "x":xx, "y":50+(i*gap_v), "length": ll, "gender":null, "couples":[]}
                                        fmCoord.push(fm)
                                        distxx.push({"x":xx, "prev_x": prev_x, "length": ll, "allChildren": (parentTabAllGen[i]["fm"][j]["allChildren"])});
                                        prev_x += ll+gap_h;
                                    } else {
                                       
                                        // let fm = {"id":parentTabAllGen[i]["fm"][j], "x":50+(j*gap_h), "y":50+(i*gap_v), "length":0, "gender":null, "couples":[]}
                                        let fm = {"id":parentTabAllGen[i]["fm"][j]["id"], "x":prev_x, "y":50+(i*gap_v), "length":0, "gender":null, "couples":[]}
                                        fmCoord.push(fm);
                                        distxx.push({"x":prev_x, "prev_x": prev_x, "length": 0, "allChildren": (parentTabAllGen[i]["fm"][j]["allChildren"])});
                                        prev_x += gap_h;
                                        
                                    }
                                }
                                
                                // createBallSvgCircle(familyGenerations[i][j], 50+(j*gap_h), 50+(i*gap_v))
                                // createBallSvgInnerText(familyGenerations[i][j], 50+(j*gap_h), 50+(i*gap_v))
                            }
                            prev_x_sp = prev_x
                            for (j = 0; j < parentTabAllGen[i]["fmsp"].length; j++) {                                
                                let fm = {"id":parentTabAllGen[i]["fmsp"][j]["id"], "x":prev_x_sp, "y":50+(i*gap_v), "length":0, "gender":null, "couples":[]}
                                fmCoord.push(fm);
                                prev_x_sp += gap_h;
                            }
                            // couple(50, 50+(i*gap_v), 50+((j-1)*gap_h), 50+(i*gap_v)) 
                            distTab.push(dist);
                            distTabxx.push(distxx);                         
                        }
                        console.log("distTab : ");
                        console.log(distTab);
                        console.log("distTabxx : ");
                        console.log(distTabxx);
                        

                        // lastCoupleId
                        // fmCoupleCoord

                        /**
                         * CREATE COUPLES
                         */
                        for (let i = 0; i < fmCoord.length; i++) {
                            let fm = getById(family, fmCoord[i]["id"])
                            // console.log(fmCoord[i]["id"])
                            // console.log(fm)
                            if (fm) {
                                fmCoord[i]["gender"] = fm["gender"]

                                if (fmCoord[i]["couples"].length == 0) {
                                    // console.log("///")
                                    // console.log(fmCoord[i]["id"])
                                    // console.log("///")
                                    if(fm["spouses"].length > 0 && fm["spouses"].length <2) {
                                        for (let j = 0; j < fm["spouses"].length; j++) {
                                            let fmsp = getById(family, fm["spouses"][j])
                                            
                                            let fmc = getById(fmCoord, fm["spouses"][j])
                                            let fmci = getFMIndex(fmCoord, fm["spouses"][j])
                                            // console.log("///")
                                            // console.log(fmsp)
                                            if (fmsp["father"] == null && fmsp["mother"] == null) {                                                
                                                fmCoord[fmci]["x"] = fmCoord[i]["x"]+(gap_h/1.4)
                                                fmc["x"] = fmCoord[i]["x"] + (gap_h/1.4)
                                                // console.log("///")
                                                // console.log(fmCoord[fmci])
                                                // console.log(fmc)
                                            }

                                            if (fmc) {
                                                fmCouple = {"id":lastCoupleId, "id1":fmCoord[i]["id"], "id2":fmc["id"],
                                                        "x1": fmCoord[i]["x"], "y1": fmCoord[i]["y"],
                                                        "x2": fmc["x"], "y2": fmc["y"],
                                                        "xmid": (fmCoord[i]["x"] + fmc["x"])/2,
                                                        "ymid": fmc["y"]+radius + extraRadiusWidth
                                                    };
                                                fmCoupleCoord.push(fmCouple);
                                                fmCoord[i]["couples"].push(fmCouple["id"]);
                                                fmCoord[fmci]["couples"].push(fmCouple["id"]);
                                                lastCoupleId++
                                            }
                                        }
                                    }
                                    else if(fm["spouses"].length >= 2) {
                                        for (let j = 0; j < fm["spouses"].length; j++) {
                                            let fmsp = getById(family, fm["spouses"][j])                                            
                                            let fmc = getById(fmCoord, fm["spouses"][j])
                                            let fmci = getFMIndex(fmCoord, fm["spouses"][j])

                                            if (fmsp["father"] == null && fmsp["mother"] == null) {                                                
                                                fmCoord[fmci]["x"] = gap_h*j*2
                                                fmc["x"] = gap_h*j*2
                                            }
                                        }
                                        let nb_sp = fm["spouses"].length;
                                        let largeur_sp = (nb_sp-1) * gap_h*2;
                                        // console.log("largeur_sp : ", largeur_sp);
                                        let xmidlsp = largeur_sp/2;
                                        // console.log("xmidlsp : ", xmidlsp);
                                        // console.log("fmCoord[i][x] : ", fmCoord[i]["x"]);
                                        let dxx = fmCoord[i]["x"] - xmidlsp;
                                        // console.log("dxx : ", dxx);

                                        for (let j = 0; j < fm["spouses"].length; j++) {
                                            let fmsp = getById(family, fm["spouses"][j])
                                            
                                            let fmc = getById(fmCoord, fm["spouses"][j])
                                            let fmci = getFMIndex(fmCoord, fm["spouses"][j])
                                            // console.log("///")
                                            // console.log(fmsp)
                                            if (fmsp["father"] == null && fmsp["mother"] == null) {                                                
                                                fmCoord[fmci]["x"] = fmCoord[fmci]["x"];
                                                fmc["x"] = fmc["x"]+dxx;
                                                console.log("fmc[x] : ", fmc["x"]+dxx);
                                                // debugger
                                                // fmCoord[fmci]["y"] = fmCoord[i]["y"]+(gap_v/2)
                                                fmc["y"] = fmCoord[i]["y"] + (gap_v/3.3)
                                                
                                                // console.log("///")
                                                // console.log(fmCoord[fmci])
                                                // console.log(fmc)
                                            }

                                            if (fmc) {
                                                fmCouple = {"id":lastCoupleId, "id1":fmCoord[i]["id"], "id2":fmc["id"],
                                                        "x1": fmCoord[i]["x"], "y1": fmCoord[i]["y"],
                                                        "x2": fmc["x"], "y2": fmc["y"],
                                                        "xmid": fmc["x"],
                                                        "ymid": fmc["y"]+radius + extraRadiusWidth
                                                    };
                                                fmCoupleCoord.push(fmCouple);
                                                fmCoord[i]["couples"].push(fmCouple["id"]);
                                                fmCoord[fmci]["couples"].push(fmCouple["id"]);
                                                lastCoupleId++
                                            }
                                        }
                                    }
                                }
                                
                            }
                            
                        }


                        /**
                         * CREATE LINES
                         */
                         for (let i = 0; i < fmCoord.length; i++){
                            let fm = getById(family, fmCoord[i]["id"])
                            let mfCouple = null;
                            let hasFatherSpouse = false; 
                            let hasMotherSpouse = false;                     
                            // console.log(fm)
                            if (fm) {
                                // fm["father"] != null &&
                                if (fm["mother"] != null) {
                                    // let fmmc = getById(fmCoord, fm["mother"])
                                    let fmm = getById(family, fm["mother"])
                                    if (fmm) {
                                        if (fmm["spouses"].length > 0) {
                                            for (let j = 0; j < fmm["spouses"].length; j++) {
                                                if (fm["father"] == fmm["spouses"][j]) {
                                                    hasFatherSpouse = true;
                                                    let fmf = getById(family, fm["father"])
                                                    mfCouple = getCoupleByFMIds(fmCoupleCoord, fmf["id"], fmm["id"])
                                                }
                                            }
                                        }
                                    }
                                    // 
                                    if (mfCouple) {
                                        oneLine = {"id": lastLineId, "x1":fmCoord[i]["x"], "y1": fmCoord[i]["y"], "x2":mfCouple["xmid"], "y2":mfCouple["ymid"]}
                                        fmLineCoord.push(oneLine)
                                        // drawLine(lastLineId, fmCoord[i]["x"], fmCoord[i]["y"], mfCouple["xmid"], mfCouple["ymid"])
                                        lastLineId++
                                    } else {
                                        let fmmc = getById(fmCoord, fm["mother"])
                                        oneLine = {"id": lastLineId, "x1":fmCoord[i]["x"], "y1": fmCoord[i]["y"], "x2":fmmc["x"], "y2":fmmc["y"]}
                                        fmLineCoord.push(oneLine)                                        
                                        lastLineId++
                                    }
                                }
                                if (fm["father"] != null && !hasFatherSpouse) {
                                    mfCouple = null;
                                    let fmm = getById(family, fm["father"])
                                    if (fmm) {
                                        if (fmm["spouses"].length > 0) {
                                            for (let j = 0; j < fmm["spouses"].length; j++) {
                                                if (fm["mother"] == fmm["spouses"][j]) {
                                                    hasMotherSpouse = true;
                                                    let fmf = getById(family, fm["father"])
                                                    mfCouple = getCoupleByFMIds(fmCoupleCoord, fmf["id"], fmm["id"])
                                                }
                                            }
                                        }
                                    }
                                    // 
                                    if (mfCouple) {
                                        oneLine = {"id": lastLineId, "x1":fmCoord[i]["x"], "y1": fmCoord[i]["y"], "x2":mfCouple["xmid"], "y2":mfCouple["ymid"]}
                                        fmLineCoord.push(oneLine)                                        
                                        lastLineId++
                                    } else {
                                        let fmmc = getById(fmCoord, fm["father"])
                                        oneLine = {"id": lastLineId, "x1":fmCoord[i]["x"], "y1": fmCoord[i]["y"], "x2":fmmc["x"], "y2":fmmc["y"]}
                                        fmLineCoord.push(oneLine)                                        
                                        lastLineId++
                                    }
                                }
                            }
                         }



                        // console.log("Family Members Coordinates", fmCoord)
                        // console.log("Family Couples Coordinates", fmCoupleCoord)

                        for (let i = 0; i < fmCoord.length; i++) {
                            let fm = getById(family, fmCoord[i]["id"])
                            
                            if (!fm) {
                                console.log("__fm__")
                                console.log(fm)
                                console.log(fmCoord[i])
                            }
                            if (fm) {
                                createBallSvgCircle(fmCoord[i]["id"], fmCoord[i]["x"]+padding_h, fmCoord[i]["y"]+padding_v)
                                createBallSvgInnerText(fmCoord[i]["id"], fm["name"], fm["photo"], fm["isIncomingSpouse"], fmCoord[i]["x"]+padding_h, fmCoord[i]["y"]+padding_v)                            
                                createBallSvgLowerText(fmCoord[i]["id"], fm["name"], fmCoord[i]["x"]+padding_h, fmCoord[i]["y"]+padding_v)
                            }
                        }
                        for (let i = 0; i < fmCoupleCoord.length; i++) {                            
                            couple(fmCoupleCoord[i]["x1"]+padding_h, fmCoupleCoord[i]["y1"]+padding_v, fmCoupleCoord[i]["x2"]+padding_h, fmCoupleCoord[i]["y2"]+padding_v)
                        }
                        for (let i = 0; i < fmLineCoord.length; i++) {                            
                            // drawLine(fmLineCoord[i]["id"], fmLineCoord[i]["x1"], fmLineCoord[i]["y1"], fmLineCoord[i]["x2"], fmLineCoord[i]["y2"])
                            drawCurve(fmLineCoord[i]["id"], fmLineCoord[i]["x1"]+padding_h, fmLineCoord[i]["y1"]+padding_v, fmLineCoord[i]["x2"]+padding_h, fmLineCoord[i]["y2"]+padding_v)
                            // if (i == 0) {
                            //     drawCurve(fmLineCoord[i]["id"], fmLineCoord[i]["x1"], fmLineCoord[i]["y1"], fmLineCoord[i]["x2"], fmLineCoord[i]["y2"])
                            // }
                        }

                        // mySvg.setAttribute('width', `${50+(gap_h*largest_gen["size"])}px`);
                        // mySvg.setAttribute('height', `${50+(gap_v*nb_gen)}px`);
                        initializeSvgZone(500+(gap_h*largest_gen["size"]), 80+(gap_v*nb_gen))

                        // console.log(allClients)
                        // alert("ALL CLIENTS LIST SET !!!");
                    }
                },
                error: function (response) {
                    console.log(response)
                }
            })
        }
        setTimeout(() => {
            getFamilyMemebers()
        }, 500);



        


        

        // ////////////////////////////////////////////////////////////////////////////////

        // function getCookie(name) {
        //     let cookieValue = null;
        //     if (document.cookie && document.cookie !== '') {
        //         const cookies = document.cookie.split(';');
        //         for (let i = 0; i < cookies.length; i++) {
        //             const cookie = cookies[i].trim();
        //             // Does this cookie string begin with the name we want?
        //             if (cookie.substring(0, name.length + 1) === (name + '=')) {
        //                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        //                 break;
        //             }
        //         }
        //     }
        //     return cookieValue;
        // }
    
        // function sendIncomeRequest(e) {
        //     e.preventDefault();

        //     let inputName = document.getElementById('name_input');
            
        //     let gs = document.getElementsByName('gender');    
        //     for(i = 0; i < gs.length; i++) {
        //         if(gs[i].checked)
        //         gender_value = gs[i].value
        //     }

        //     let fatherId = document.getElementById('parent_male_select').value;
        //     let newFatherCheck = document.getElementById('new_parent_male_check').checked;         
        //     let newFatherName = document.getElementById('new_parent_male_input').value;
        //     let noFatherCheck =  document.getElementById('no_parent_male_check').checked;

        //     let motherId = document.getElementById('parent_female_select').value;
        //     let newMotherCheck = document.getElementById('new_parent_female_check').checked;         
        //     let newMotherName = document.getElementById('new_parent_female_input').value;
        //     let noMotherCheck =  document.getElementById('no_parent_female_check').checked;

        //     let generationLevel = document.getElementById('generation_level_input').value;            
        //     let birthRank = document.getElementById('birth_rank_input').value;

        //     let spouse_values = [];
        //     let spouses = document.getElementsByName('spouse');   
        //     for(i = 0; i < spouses.length; i++) {
        //         if(spouses[i].checked)
        //         spouse_values.push(spouses[i].value)
        //     }
            

        //     let form_data = new FormData();
        //     form_data.append("name", inputName.value);
        //     form_data.append("genderValue", gender_value);

        //     form_data.append("fatherId", parseInt(fatherId));
        //     form_data.append("newFatherCheck", newFatherCheck);
        //     form_data.append("newFatherName", newFatherName);
        //     form_data.append("noFatherCheck", noFatherCheck);

        //     form_data.append("motherId", parseInt(motherId));
        //     form_data.append("newMotherCheck", newMotherCheck);
        //     form_data.append("newMotherName", newMotherName);
        //     form_data.append("noMotherCheck", noMotherCheck);

        //     form_data.append("generationLevel", generationLevel);
        //     form_data.append("birthRank", birthRank);

        //     form_data.append("spouseValues", spouse_values);
   
        //     $.ajaxSetup({
        //         headers:{
        //         'X-CSRFToken': getCookie("csrftoken")
        //         },
        //         beforeSend: function() {
        //             // $('#sgenerator_download_save_buttons').hide();
        //             // $('#loader_hw').removeClass("displayNone");
        //         },
        //         complete: function(){
        //             // $('#sgenerator_download_save_buttons').show();
        //             // $('#loader_hw').addClass("displayNone");
        //          },
        //     });
        //     jQuery.ajax({  //+"new_income/"
        //         url: window.location.pathname,
        //         type: "POST",
        //         data: form_data,
        //         contentType: false,
        //         processData: false,
        //         success: function (response) {
        //             console.log("Well done !!");                
        //             // console.log(noFatherCheck);  
        //             // console.log(noMotherCheck);  
        //             var reloadLink = document.createElement('a');
        //             reloadLink.href = window.location.href
        //             document.body.appendChild(reloadLink);
        //             reloadLink.click();
        //             reloadLink.remove();
        //         },
        //         error: function (response) {
        //             alert("Something went wrong");
        //         }
        //     });
        // }

        // document.getElementById('create_income_btn').addEventListener("click", function(e){
        //     sendIncomeRequest(e)
        // })

        
    })

}($));


// draw a curvy line between point (startX,startY) and point (endX,endY)
function drawCurve(id, startX, startY, endX, endY) {
    myid = id
    // exemple of a path: M318,345 L330,345 C450,345 380,124 504,124 L519,124

    // // M
    // var AX = startX;
    // console.log(AX);
    // var AY = startY;

    // // L
    // var BX = Math.abs(endX - startX) * 0.05 + startX;
    // var BY = startY;
  
    // // C
    // var CX = (endX - startX) * 0.66 + startX;
    // var CY = startY;
    // var DX = (endX - startX) * 0.33 + startX;
    // var DY = endY;
    // var EX = - Math.abs(endX - startX) * 0.05 + endX;
    // var EY = endY;

    // // L
    // var FX = endX;
    // var FY = endY;


    // M
    var AX = startX;
    // console.log(AX);
    var AY = startY;
    // console.log(AY);

    // L
    var BX = startX;
    var BY = Math.abs(endY - startY) * 0.05 + startY;
    
  
    // C
    var CX = startX;
    var CY = (endY - startY) * 0.66  + startY;
    
    var DX = endX;
    var DY = (endY - startY) * 0.33 + startY;
    
    var EX = endX;
    var EY =  + endY;
    

    // L
    var FX = endX;
    var FY = endY;

    // [DEBUGGING] add all the colored points for testing
    // document.getElementById('pointA').setAttribute("cx", AX);
    // document.getElementById('pointA').setAttribute("cy", AY);
    // document.getElementById('pointB').setAttribute("cx", BX);
    // document.getElementById('pointB').setAttribute("cy", BY);
    // document.getElementById('pointC').setAttribute("cx", CX);
    // document.getElementById('pointC').setAttribute("cy", CY);
    // document.getElementById('pointD').setAttribute("cx", DX);
    // document.getElementById('pointD').setAttribute("cy", DY);
    // document.getElementById('pointE').setAttribute("cx", EX);
    // document.getElementById('pointE').setAttribute("cy", EY);
    // document.getElementById('pointF').setAttribute("cx", FX);
    // document.getElementById('pointF').setAttribute("cy", FY);

    // setting up the path string

    var path = 'M' + AX + ',' + AY;
    path += ' L' + BX + ',' + BY;
    path +=  ' ' + 'C' + CX + ',' + CY;
    path += ' ' + DX + ',' + DY;
    path += ' ' + EX + ',' + EY;
    // path += ' L' + FX + ',' + FY;

    // var path = 'M' + AY + ',' + AX;
    // path += ' L' + BY + ',' + BX;
    // path +=  ' ' + 'C' + CY + ',' + CX;
    // path += ' ' + DY + ',' + DX;
    // path += ' ' + EY + ',' + EX;
    // path += ' L' + FY + ',' + FX;

    // [DEBUGGING] display the path string
    // console.log(path);

    const svgLines = document.querySelector('#mysvg #manyLines');
    let path0 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path0.setAttribute('class', `Curved Line`);
    path0.setAttribute('d', path);
    path0.setAttribute('style', "stroke:#ffeb3b97; stroke-width:2; fill:none;");
    svgLines.append(path0);


    // applying the new path to the element
    // document.getElementById('myPath').setAttribute("d", path);

}


// function selectCustomer(index) {
//     currentCustomer = allClients[index]
//     var input = document.getElementById('customer_name_input');
//     input.value = currentCustomer[1]
//     console.log(currentCustomer[1])
//     customerOptions = $("#customerOptions")
//     customerOptions.empty()
// }
// function selectIncomeDetails(index) {
//     currentIncomeStream = allIncomeStreams[index]
//     var input = document.getElementById('income_details_input');
//     input.value = currentIncomeStream[1]
//     incomeDetailsOptions = $("#incomeDetailsOptions")
//     incomeDetailsOptions.empty()
// }
// function selectBank(index) {
//     currentBank = allBanks[index]
//     var input = document.getElementById('bank_input');
//     input.value = currentBank[1]
//     bankOptions = $("#bankOptions")
//     bankOptions.empty()
// }