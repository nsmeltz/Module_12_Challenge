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

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
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
    console.log("Data from JSON", data)

    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    //  5. Create a variable that holds the first sample in the array.
    var sampleObj = samplesArray.filter(sampleObj => sampleObj.id == sample);
    console.log("sampleObj", sampleObj)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sample_ids = sampleObj[0].otu_ids
    // console.log("otu_ids", sample_ids)

    var sample_labels = sampleObj[0].otu_labels
    // console.log("otu_labels", sample_labels)

    var sample_values = sampleObj[0].sample_values
    // console.log("sample_values", sample_values)
  
  
  // -------------------- Bar Chart -------------------------------

  // 7. Create the yticks for the bar chart.
  // Hint: Get the the top 10 otu_ids and map them in descending order  
  let top10_otu_ids = sample_ids.slice(0,10)
  // console.log("top10", top10_otu_ids)

  //for loop converting the top10 to string that says "OTU id#""
  yticks = top10_otu_ids.reverse().map(id => `OTU ${id}`) 
  // console.log("yticks", yticks)

  // 8. Create the trace for the bar chart. 
  var barData = [{
    x: sample_values.slice(0,10).reverse(),
    y: yticks,
    text: sample_labels.slice(0,10).reverse(),
    type: "bar",
    orientation: 'h'
  }];

  // // 9. Create the layout for the bar chart. 
  var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        xaxis: {title: "Number of Cultures" },
        yaxis: {title: "Sample Label"}
  };

  // 10. Use Plotly to plot the data with the layout. 
  Plotly.newPlot("bar", barData, barLayout);

  // -------------------- Bubble Chart -----------------------------
  // 1. Create the trace for the bubble chart.
  let bubbleData = [{
    x: sample_ids ,
    y: sample_values,
    mode: 'markers',
    marker: {
      color: sample_ids,
      size: sample_values
    },
    text: sample_labels
  }];

  // 2. Create the layout for the bubble chart.
  let bubbleLayout = {
    title: "Bacteria Cultures per Sample",
    xaxis: {title: "OTU ID Number" },
    yaxis: {title: "Number of Bacteria"}
  };

  // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

  // -------------------- Gauge Chart -----------------------------
   // 1. Create a variable that filters the metadata array
  // Filter the data for the object with the desired sample number
  var metadata = data.metadata;
  var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
  console.log("Result Array", resultArray)

   // 2. Create a variable that holds the first sample in the metadata array.
  var result = resultArray[0];
  console.log("Result", result)

  // 3. Create a variable that holds the washing frequency.
  var wfreq = result.wfreq
  console.log(wfreq)
 
  // 4. Create the trace for the gauge chart.
  var gaugeData = [{
		domain: { x: [0, 1], y: [0, 1] },
		value: wfreq,
		title: { text: "Belly Button Washing Frequency (Scrubs per Week)" },
		type: "indicator",
		mode: "gauge+number",
    gauge: {
      axis: { 
        range: [null, 10], 
        tickwidth: 1, 
        tickcolor: "black" 
      },
      bar: { color: "black" },
      bgcolor: "white",
      borderwidth: 2,
      bordercolor: "black",
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "yellow"},
        { range: [6, 8], color: "lightgreen"},
        { range: [8, 10], color:"darkgreen"}
      ],
    }
	}];
  
  // 5. Create the layout for the gauge chart.
  var gaugeLayout = {
    width: 600, 
    height: 500, 
    margin: { t: 0, b: 0 } 
  };

  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  
  
  

  });
};
