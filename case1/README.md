# test_network_visualization
- use `node index.js` to start

## src
- use `node network_generation.js` to generate network data
- use `RScript GO_analysis.R [input file name] [output file name]` to run hypergeometric test to find the over-representation genes
	- ex: `RScript GO_analysis.R Script GO_analysis.R ../data/spectral-counts.target.txt ../data/enrichmentGO`
