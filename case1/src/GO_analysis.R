#!/usr/bin/env RScript
library(clusterProfiler)
library(org.Hs.eg.db)

args <- commandArgs(trailingOnly = TRUE)
con <- file(args[1],"r")
proteinList <- vector()
line <- readLines(con, n=1)
while(TRUE){
	line <- readLines(con, n=1)
	if( length(line) == 0 ){
		break
	}
	line <- unlist(strsplit(line, "\t", fixed = TRUE))
	line <- line[1]
	line <- unlist(strsplit(line, "|", fixed = TRUE))
	line <- line[2]
	proteinList <- append(proteinList,line)
}
close(con)
enrichmentGO <- enrichGO(gene=proteinList,OrgDb="org.Hs.eg.db",keytype="UNIPROT",pvalueCutoff=0.01,ont="MF")
data <- enrichmentGO@result
write.table(data, file = paste(args[2],"GO_MF.csv",sep=""), sep = ",")
enrichmentGO <- enrichGO(gene=proteinList,OrgDb="org.Hs.eg.db",keytype="UNIPROT",pvalueCutoff=0.01,ont="BP")
data <- enrichmentGO@result
write.table(data, file = paste(args[2],"_GO_BP.csv",sep=""), sep = ",")
enrichmentGO <- enrichGO(gene=proteinList,OrgDb="org.Hs.eg.db",keytype="UNIPROT",pvalueCutoff=0.01,ont="CC")
data <- enrichmentGO@result
write.table(data, file = paste(args[2],"_GO_CC.csv",sep=""), sep = ",")


