function buildMetadata(sample) {
  console.log("buildMetadata function: " + sample);

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  var meta_data = d3.select("#sample-metadata");
  //var dataPromise = d3.json("/metadata/"+sample); //.then(function(data) {
    //return data; 
  //});

  var value_gauge = 0;

   d3.json("/metadata/"+sample).then(function(data) {
    //console.log(data);
     meta_data.selectAll("h6").remove(); 
     for (var [key, value] of Object.entries(data)) {
        //console.log(key + ' : ' + value); // "a 5", "b 7", "c 9"
        meta_data
        //.html("")
        .append("h6")
        .text(key.toUpperCase() + ' : ' + value);
      }

      value_gauge = data.WFREQ;
      //console.log("VG:" + value_gauge);
      //console.log("Creating Gauge Chart:" + value_gauge);
      buildGauge(value_gauge);      

   });

    // Use `.html("") to clear any existing metadata
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart

}

function buildGauge(value){
  // Enter a speed between 0 and 180
  var level = value;
  //console.log("CASE");
/*  switch (parseInt(level)){      
    case 8 || 9:
      level = 9;
      //console.log("caso 9");
      break; 
    case 6 || 7:
      level = 7;
      //console.log("caso 7");
      break;     
    case 4 || 5:
      //console.log("caso 5");
      level = 5;
      break; 
    case 2 || 3:
      level = 3;
      //console.log("caso 3");
      break;   
    case 0 || 1:
      //console.log("caso 1");
      level = 1;
      break;                
  }
*/
  //console.log("Parsed" + level);

  // Trig to calc meter point
  var degrees = 180 - ((level*180)/10),
       radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'Weekly Washing Frequency',
      text: level,
      hoverinfo: 'text+name'},
    { values: [50/5, 50/5, 50/5, 50/5, 50/5, 50],
    rotation: 90,
    text: ['8-9', '6-7', '4-5',
              '2-3', '0-1', ''],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgba(110, 154, 22, .5)',
                           'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                           'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                           'rgba(255, 255, 255, 0)']},
    labels: ['8-9', '6-7', '4-5', '2-3', '0-1', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    title: 'Weekly Washing Frequency',
    //height: 1000,
    //width: 1000,
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]}
  };

  Plotly.newPlot('gauge', data, layout);

}
function buildCharts(sample) {
  console.log("buildCharts function");

  // @TODO: Use `d3.json` to fetch the sample data for the plots
   var pie_chart = d3.select("#pie");
   var id = [];
   var labels = [];
   var values = [];

   d3.json("/samples/"+sample).then(function(data) {
      //console.log(data.otu_ids);
      id = data.otu_ids;
      //console.log(id);
      labels = data.otu_labels;
      values = data.sample_values;

      id_v = id.slice(0,10);
      labels_v = labels.slice(0,10);
      values_v = values.slice(0,10);

      //console.log(labels);
      var data_pie = [{
        values: values_v,
        labels: id_v,
        hovertext: labels_v,
        type: 'pie'
      }];

      var layout = {
         title: 'Sample: ' + sample,
         showlegend: true
      };

      Plotly.newPlot('pie', data_pie,layout);

   });


   d3.json("/samples/"+sample).then(function(data) {
      //console.log(data.otu_ids);
      id = data.otu_ids;
      //console.log(id);
      labels = data.otu_labels;
      values = data.sample_values;

      //console.log(labels);

      var data_bubble = [{
        x: id,
        y: values,
        text: labels,
        mode: 'markers',
        marker: {
          size: values,
          color: id
        }
      }];

      var layout = {
         title: 'Sample: ' + sample,
         showlegend: true
      };

      Plotly.newPlot('bubble', data_bubble,layout);

   });


    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  console.log("Starting Init function");

  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  console.log("Option Changed function");
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
console.log("Calling Init function");
init();
