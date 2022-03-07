function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // // Use the first sample from the list to build the initial plots
    // var firstSample = sampleNames[0];
    // buildCharts(firstSample);
    // buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();


// Fetch new data each time a new sample is selected
function optionChanged(newSample) {
  // print selected Subject ID to console
  console.log(newSample)
  
  // Call buildMetadata & buildCharts function
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let samplesArray = data.samples

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    //  5. Create a variable that holds the first sample in the array.
    let sampleObj = samplesArray.filter(sampleObj => sampleObj.id == sample);
    console.log("sampleObj", sampleObj)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let sample_ids = sampleObj[0].otu_ids
    // console.log("otu_ids", sample_ids)

    let sample_labels = sampleObj[0].otu_labels
    // console.log("otu_labels", sample_labels)

    let sample_values = sampleObj[0].sample_values
    // console.log("sample_values", sample_values)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    let top10 = sample_ids.slice(0,10)
    console.log("top10", top10)
    //for loop converting the top10 to string that says "OTU id#""
    yticks = top10.reverse().map(id => `OTU ${id}`) 
    console.log("yticks", yticks)

    // 8. Create the trace for the bar chart. 
    var barData = [ {
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: sample_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: 'h'
    }
      
    ];
    // // 9. Create the layout for the bar chart. 
    var barLayout = {
          title: "Top 10 Bacteria Cultures Found",
          xaxis: {title: "Number of Cultures" },
          yaxis: {title: "Sample Label"}
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

  });
};
