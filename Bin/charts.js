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

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
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
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray =  samples.filter(sampleObj => sampleObj.id == sample);
    // For gauge
    var metadata = data.metadata;
    var metaArray = metadata.filter(sampleObj => sampleObj.id == sample);  
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    // For gauge
    var meta = metaArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    // For gauge
    var washFreq = parseFloat(meta.wfreq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0,10).map(id=> `OTU ${id}`).reverse();
    var xticks = sample_values.slice(0,10).reverse();
    var labels = otu_labels.slice(0,10).reverse();
    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        x: xticks,
        y: yticks,
        hovertemplate:'<i>Frecuency of the specie</i>: %{x}' + '<br><i>%{text}</i>',
        text: labels,
        hoverlabel: {namelenght : 0},
        type: "bar",
        orientation: "h"
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title:  "<b>Top 10 Bacteria Cultures Found</b>",
      font: {color: "darkblue", family: "arial"}     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        hovertemplate:'<i>(%{x},%{y})</i>' + '<br><i>${text}</i>',
        text: otu_labels,
        hoverlabel: {namelenght : 0},
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "portland"
        }
      }  
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Culteres Per Sample</b>",
      xaxis: {title: "OTU ID"},
      margin: {
        l:100,
        r:10,
        b:100,
        t:30,
      },
      hovermode:'closest',
      font: {color: "darkblue",family:"arial"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    // Create washreq variable

    var gaugeData = [{
      domain: {x: [0,1], y: [0,1]},
      value: washFreq,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "<b>Belly Button Washing Frequency</b><br># of Scrubs per Week" },
      gauge: {
        axis: {range: [null,10]},
        steps: [
          {range: [0,2], color:"#ea2c2c"},
          {range: [2,4], color:"#ea822c"},
          {range: [4,6], color:"#ee9c00"},
          {range: [6,8], color:"#eecc00"},
          {range: [8,10], color:"#d4ee00"}
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 450,
      height: 400,
      margin: { t: 25, r: 15, l: 15, b: 25 },
      font: { color: "darkblue", family: "arial" }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}