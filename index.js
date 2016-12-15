#!/usr/bin/env node
console.log('Tool is still under heavy development, if this is what you\'ve been looking for then join the team at https://github.com/kalaspuffar/polymer-dependency-weight\n\n');

const fs = require("fs"); //Load the filesystem module
const Analyzer = require('polymer-analyzer').Analyzer;
const FSUrlLoader = require('polymer-analyzer/lib/url-loader/fs-url-loader').FSUrlLoader;
const PackageUrlResolver = require('polymer-analyzer/lib/url-loader/package-url-resolver').PackageUrlResolver;

let analyzer = new Analyzer({
  urlLoader: new FSUrlLoader("."),
  urlResolver: new PackageUrlResolver(),
});

if (process.argv.length <= 2) {
  console.log("Usage: " + __filename + " [file1..file(n)]");
  process.exit(-1);
}

var outputString;
for(var i=2; i<process.argv.length; i++) {
  var processFile = process.argv[i];
  analyzer.analyze(process.argv[i])
    .then((document) => {
      outputString = "";
      recursiveWeightSearch(document, 0, []);

      var pathParts = document.url.split('/');
      var filename = pathParts[pathParts.length-1].replace('.html', '');

      fs.writeFile('dependency-'+filename+'.txt', outputString, (err) => {
        if (err) throw err;
        console.log('Created dependency tree output in dependency-'+filename+'.txt');
      });
    });
}

function recursiveWeightSearch(document, indentCount, seen) {
  var indentPrefix = "";
  for(var i=0; i<indentCount; i++) indentPrefix += ">> ";

  var size = 0;
  if(seen.indexOf(document.url) == -1) {
    size = fs.statSync(document.url)["size"];
  }
  seen.push(document.url);
  for(feature of document._localFeatures) {
    if (feature.kinds.has('import')) {
      size += recursiveWeightSearch(feature.document, indentCount+1, seen);
    }
  }

  outputString += (indentPrefix + document.url + " - " + (size > 0 ? Math.round(size / 1024.0) : 0) + " kb\n");
  return size;
}
