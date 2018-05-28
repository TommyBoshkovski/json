var catSubCat = [];
catSubCat["T1_Relaxometry"] = ["Inversion Recovery", "T1 VFA"];
catSubCat["T2_Relaxometry"] = ["MWF"];
catSubCat["Noise"] = ["Noise Level"];
catSubCat["Magnetization_transfer"] = ["MT Sat","qMT bssfp","qMT sirfse","qMT spgr"];
catSubCat["Diffusion"] = ["DTI","CHARMED","NODDI"];
catSubCat["FieldMaps"] = ["B0", "B1"];

var subCat = [];
subCat["T1_Relaxometry"] = ["inversion_recovery", "vfa_t1"];
subCat["T2_Relaxometry"] = ["mwf"];
subCat["Noise"] = ["Noise Level"];
subCat["Magnetization_transfer"] = ["mt_sat","qmt_bssfp","qmt_sirfse","qmt_spgr"];
subCat["Diffusion"] = ["dti","charmed","noddi"];
subCat["FieldMaps"] = ["b0_dem", "b1_dam"];

function subcategory()
{
    var x = document.getElementById('category');
    var y = document.getElementById('subCategory');
    while (y.length > 0) 
    {
        y.remove(y.length-1);
    }
    var cat = x.options[x.selectedIndex].value;
    for (var i = 0; i < subCat[cat].length; i++) {
        var option = document.createElement("option");
        option.text = catSubCat[cat][i];
        option.value = subCat[cat][i];
        y.add(option);
    };


}


function myFunction(){
    var x = document.getElementById("myFile");
    
    var txt ="";
    var fil = new Array(); 
    if ('files' in x) {
        if (x.files.length == 0) {
            txt = "Select one or more files.";
        } else {
            txt += "<table id=\"res\"><tr><td><strong>Filename</strong></td><td><strong>Image Type</strong></td><td><strong>Repetition Time</strong></td><td><strong>Flip Angle</strong></td></tr>"
            for (var i = 0; i < x.files.length; i++) {
                 var file = x.files[i];
                 var ext = file.name.split(".");
                 if(ext[ext.length-1] == "nii" || ext[ext.length-2] == "nii"){
                 fil.push(file.name);
                 
                txt += "<tr><td><strong style=\"color:red;\">" + file.webkitRelativePath + "</strong></td>";
                txt +="<td><select id=\""+ ext[0]+ "\">"
                txt += "</select></td>"
                txt += "<td><input type=\"number\" id=\"" + ext[0] + "_TR\"/></td>"
                txt += "<td><input type=\"number\" id=\"" + ext[0] + "_FA\"/></td></tr>"
                
              }  
            }
            txt += "<tr><td><input type=\"submit\" class=\"btn btn-success\" onclick=\"createJson()\"></td></tr></table>"
        }
        sessionStorage.setItem("files", fil);
    } 
    else {
        if (x.value == "") {
            txt += "Select one or more files.";
        } else {
            txt += "The files property is not supported by your browser!";
            txt  += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead. 
        }
    }
    document.getElementById("demo").innerHTML = txt;
    fill_list(fil)
}

function fill_list(x)
{
    for (var i = 0; i < x.length; i++) {
    ext = x[i].split(".");
    el = document.getElementById(ext[0]);
    var option = document.createElement("option");
    option.text = "Don't include";
    option.value = "No";
    el.add(option);
    var option = document.createElement("option");
    option.text = "MTw";
    option.value = "MTw";
    el.add(option);
    var option = document.createElement("option");
    option.text = "T1w";
    option.value = "T1w";
    el.add(option);
    var option = document.createElement("option");
    option.text = "PDw";
    option.value = "PDw";
    el.add(option);
}
}
function createJson()
{
    var y = document.getElementById('subCategory');
jsonFile ={};
jsonFile[y.options[y.selectedIndex].value] = {};
f = sessionStorage.getItem("files");
files = f.split(",")
for(var i =0; i<files.length; i++){
    var ext = files[i].split(".");
var im = document.getElementById(ext[0]).value;
var tr = document.getElementById(ext[0] + "_TR").value;
var fa = document.getElementById(ext[0] + "_FA").value;
if(im.value !="Don't include")
{
    jsonFile[y.options[y.selectedIndex].value][im]={};
 jsonFile[y.options[y.selectedIndex].value][im]["Filename"] = files[i]; 
 jsonFile[y.options[y.selectedIndex].value][im]["FlipAngle"]=fa;
  jsonFile[y.options[y.selectedIndex].value][im]["RepetitionTime"]=tr;
} 
}
var obj = JSON.stringify(jsonFile, null, "\t");

    
    //var data = encode( obj, null, 4);

    var blob = new Blob( [ obj ], {
        type: 'application/octet-stream'
    });
    
    url = URL.createObjectURL( blob );
    var link = document.createElement( 'a' );
    link.setAttribute( 'href', url );
    link.setAttribute( 'download', 'example.json' );

    var event = document.createEvent( 'MouseEvents' );
    event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent( event );
}
