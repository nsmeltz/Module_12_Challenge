// Dynamically Generate Dropdown Menu Items (ie each sample ID)
function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);

    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
      
    });
})}

// Initialize the dashboard
init();


// Use JS to detect the selected sample from dropdown menu
function optionChanged(newSample) {
  // print the selected sample id to console
  console.log(newSample);
  // Call buildMetadata function 
  buildMetadata(newSample);
  // Call buildCharts function
  buildCharts(newSample);
}


// populate demographics info panel by filtering for id called in dropdown menu

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // console.log("resultArray", resultArray)

    var result = resultArray[0];
    // console.log("result", result)

    var demoKeys = Object.keys(result)
    var demoValues = Object.values(result)
    // console.log( demoKeys)
    // console.log( demoValues)

    var PANEL = d3.select("#sample-metadata").html("");

    for (let i = 0; i < 7; i++) {
      PANEL.append("h6").text( demoKeys[i] + ":" + demoValues[i] ); 
    };
    // PANEL.append("h6").text( demoKeys[0] + ":" + demoValues[0] );
    // PANEL.append("h6").text( demoKeys[1] + ":" + demoValues[1] );
    // PANEL.append("h6").text( demoKeys[2] + ":" + demoValues[2] );
    // PANEL.append("h6").text( demoKeys[3] + ":" + demoValues[3] );
    // PANEL.append("h6").text( demoKeys[4] + ":" + demoValues[4] );
    // PANEL.append("h6").text( demoKeys[5] + ":" + demoValues[5] );
    // PANEL.append("h6").text( demoKeys[6] + ":" + demoValues[6] );
  });
}
