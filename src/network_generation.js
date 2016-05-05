#!/usr/bin/env node
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

/*
	read the identified proteins
*/
var fileNamePrefix = '';
data = readfile('../data/spectral-counts.target.txt','\n',true);
data.pop();
data.sort(function(a,b){
	return b[1]-a[1];
});

var arr = [];
var temp;
for(i=0; i<data.length;i++) {
	temp = data[i][0].split('|');
	arr.push([]);
	arr[i].push(temp[2]);
	arr[i].push(data[i][1]);
}

console.log(arr.length+' genes are found in tandem MS');

/* 
	mapping to name and biogrid ID
*/


/* read mapping file */
// for winndows running
// data = readfile('../data/uniprot_name_info_plus_biogrid_ID.txt','\r\n',true);
// for mac testing
data = readfile('../data/uniprot_name_info_plus_biogrid_ID.txt','\n',true);
data.pop();

var foundGene = [];
var geneNotFound = [];
var counter = 1;
for(i=0; i<arr.length;i++) {
	var j=0;
	for(; j<data.length; j++){
		if(data[j][0]==arr[i][0]){
			tempArr=data[j];
			tempArr.push(counter);
			
			tempArr.push(Number(arr[i][1]))
			
			counter++;
			foundGene.push(tempArr);
			break;
		}
	}
	if(j===data.length){
		geneNotFound.push(arr[i][0]);
	}
}

var numNotFound = 0;
for(i=0; i<foundGene.length;i++) {
	if(foundGene[i][3]==='0'){
		numNotFound++;
	}
}


console.log(geneNotFound.length +' genes are not found in Uniprot');
console.log(foundGene.length + ' genes are matched in Uniprot');
console.log(numNotFound + ' genes can'+"'"+'t be matched to BioGrid');

/*
	find existing physical interactions
*/
data = readfile('../data/biogrid-interactor-ID-pairs.txt','\n',false);
/* produce the interactions want found */
var edge = [];
for(i=0;i<foundGene.length;i++){
	for(j=0;j<foundGene.length;j++){
		if(i==j){
			continue;
		}else if(foundGene[i][3]==='0' || foundGene[j][3]==='0'){
			continue;
		}else{
			if(foundGene[i][3]*1<foundGene[j][3]*1){
				edge.push(foundGene[i][3]+'\t'+foundGene[j][3]);
			}else{
				edge.push(foundGene[j][3]+'\t'+foundGene[i][3]);
			}
		}
	}
}
/* find the interactions*/
var foundEdges = _.intersection(edge, data);


/* check if the gene name is only presented once */
var isOnce = [];
var tempArr = [];
for(i=0;i<foundGene.length;i++){
	tempArr.push(foundGene[i][2]);
}
for(i=0;i<tempArr.length;i++){
	if(_.indexOf(tempArr,tempArr[i])!==_.lastIndexOf(tempArr,tempArr[i])){
		isOnce.push(false);
	}else{
		isOnce.push(true);
	}
}
tempArr = [];
/*
	Create Network Data
*/
data = [];
data.push([]);
for(i=0;i<foundGene.length;i++){
	if(isOnce[i]){
		data[0].push(
			{
				data: { id: foundGene[i][2] , weight: Number(foundGene[i][4]) }
			}
		);
	}else{
		data[0].push(
			{
				data: { id: foundGene[i][1].replace(/ /gi,'_') , weight: Number(foundGene[i][4]) }
			}
		)
	}
	foundGene[i].push(isOnce[i]);
}

for(i=0;i<foundEdges.length;i++){
	foundEdges[i]=foundEdges[i].split('\t');
	for(j=0;j<2;j++){
		for(k=0;k<foundGene.length;k++){
			if(foundEdges[i][j]==foundGene[k][3]){
				if(isOnce[k]){
					foundEdges[i][j]=foundGene[k][2];
				}else{
					foundEdges[i][j]=foundGene[k][1].replace(/ /gi,'_');
				}
				break;
			}
		}
	}
	data[0].push(
		{
			data: { id: foundEdges[i][0]+'-'+foundEdges[i][1], source: foundEdges[i][0], target: foundEdges[i][1] }
		}
	)
}
console.log(foundEdges.length+' interactions are found in BioGrid');
data.push([]);
data[1]=foundGene;
fs.writeFile('../data/all.js', JSON.stringify(data), function(err) {
	if(err) {
	    console.log(err);
	} 
	else {
		console.log("Protein Network Output Saved");
	}
});
