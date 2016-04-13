const fs = require('fs');
const _ = require('lodash');
const math = require('math');

function readfile(filePath,endOfLineCharacter,isSplit) {
	data = fs.readFileSync(filePath);
	data = data.toString();
	data = data.split(endOfLineCharacter);
	var arr=[];
	if(isSplit==true){
		for(i=1; i<data.length;i++) {
			arr.push(data[i].split('\t'));
		}
	}else{
		for(i=1; i<data.length;i++) {
			arr.push(data[i]);
		}
	}
	return arr;
}

var fileNamePrefix = '';
data = readfile('../data/spectral-counts.target.txt','\n',true);
data.pop();
data.sort(function(a,b){
	return b[1]-a[1];
});

var arr = [];
for(i=0; i<data.length;i++) {
	arr.push(data[i][0].split('|'));
	arr[i].push(data[i][1]);
}

console.log(arr.length+' genes are found in tandem MS');

data = readfile('../data/human-uniprot-entry-name-biogrid-ID-mapping.txt','\r\n',true);
var biogridID = [];
var numNotFound = 0;
var counter = 1;
for(i=0; i<arr.length;i++) {
	var j=0;
	for(; j<data.length-1; j++){
		if(data[j][0]==arr[i][2]){
			tempArr=[];
			tempArr.push(data[j][1]);
			tempArr.push(counter);
			counter++;
			biogridID.push(tempArr);
			break;
		}
	}
	if(j===data.length-1){
		numNotFound++;
	}

}
console.log(numNotFound +' genes are not found in BioGrid');
console.log(biogridID.length + ' genes are matched in BioGrid');

data = readfile('../data/biogrid-interactor-ID-pairs.txt','\n',false);

var edge = [];
for(i=0;i<biogridID.length;i++){
	for(j=0;j<biogridID.length;j++){
		if(i==j){
			continue;
		}else{
			if(biogridID[i][0]*1<biogridID[j][0]*1){
				edge.push(biogridID[i][0]+'\t'+biogridID[j][0]);
			}else{
				edge.push(biogridID[j][0]+'\t'+biogridID[i][0]);
			}
		}
	}
}


var foundEdges = _.intersection(edge, data);

data = readfile('../data/biogrid-ID-official-symbol-mapping.txt','\n',true);
var geneName = [];
for(i=0;i<biogridID.length;i++){
	for(j=0;j<data.length;j++){
		if(data[j][0]==biogridID[i][0]){
			geneName.push(data[j][1]);
			break;
		}
	}
}
data=[];
for(i=0;i<biogridID.length;i++){
	data.push(
		{
			data: { id: geneName[i] , weight: Number(biogridID[i][1]) }
		}
	)
}

for(i=0;i<foundEdges.length;i++){
	foundEdges[i]=foundEdges[i].split('\t');
	for(j=0;j<2;j++){
		for(k=0;k<geneName.length;k++){
			if(foundEdges[i][j]==biogridID[k][0]){
				foundEdges[i][j]=geneName[k];
				break;
			}
		}
	}
	data.push(
		{
			data: { id: foundEdges[i][0]+'-'+foundEdges[i][1], source: foundEdges[i][0], target: foundEdges[i][1] }
		}
	)
}
console.log(data.length+' interactions are found in BioGrid');
fs.writeFile('../data/all.js', JSON.stringify(data), function(err) {
	if(err) {
	    console.log(err);
	} 
	else {
		console.log("Protein Network Output Saved");
	}
});
console.log(data[10]);
console.log(data[20]);
