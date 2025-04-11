<Plan>
The logs show data loading is successful, but issues remain with chart initialization and React component data readiness.

1.  **React Data Passing:** The React component (`DistributionAnalysisComponent`) is checking `window.boxPlotData` in its `useEffect`, which might run before `loadExcelData` fully populates it, causing the "Distribution data... not ready" warning. We will modify the main script to pass the `boxPlotData` as a prop to the React component only when the distribution tab is clicked *and* the data is confirmed to be ready. The React component will be updated to accept and use this prop, removing its internal `useEffect` check for `window.boxPlotData`.
2.  **Chart.js Initialization Timing (Tab Switch):** The `setTimeout` for tab switching might still be insufficient, or the logic is flawed. We will simplify: inside the `setTimeout` for tab clicks, *always* call the relevant `initialize...Chart` function for the selected tab (Raw, Percentage, Trend). The initialization functions themselves already contain checks for data validity and canvas existence, and they destroy old instances. This makes the logic more robust.
3.  **Initial Raw Chart Initialization Timing:** The initial "Raw chart canvas not found" persists. We'll increase the `setTimeout` delay for the very first `initializeRawChart` call after data loading finishes (e.g., to 250ms) and add more specific logging within `initializeRawChart` to see if the canvas element itself is found by `getElementById`.

</Plan>

<file path="/Users/alikara/Desktop/508 website/index.html" action="modify">
  <change>
    <description>Modify tab click logic: Pass data as prop to React component; always call init for Chart.js tabs.</description>
    <search>
===
              // Mount/Unmount React component for Distribution tab
              if (tabId === 'distribution') {
                // Ensure Babel has processed the script before rendering
                 setTimeout(() => {
                    if (typeof DistributionAnalysisComponent !== 'undefined') {
                        console.log("Rendering DistributionAnalysisComponent");
                        ReactDOM.render(React.createElement(DistributionAnalysisComponent), distributionReactRoot);
                    } else {
                        console.error('DistributionAnalysisComponent not found. Babel might not have finished.');
                    }
                }, 0);
              } else {
                // Unmount React component if it exists and we are switching away
                if (distributionReactRoot.hasChildNodes()) {
                  console.log("Unmounting DistributionAnalysisComponent");
                  ReactDOM.unmountComponentAtNode(distributionReactRoot);
                }
              }
              
              // Use setTimeout to ensure the tab content is visible before initializing charts
              setTimeout(() => {
                if (tabId === 'raw' && !rawChartInstance && window.rawOutflowData && window.rawOutflowData.length > 0) {
                  console.log(`Tab ${tabId} selected, attempting to initialize chart.`);
                  initializeRawChart();
                } else if (tabId === 'percentage' && !percentageChartInstance && window.percentageChangeData && window.percentageChangeData.length > 0) {
                  console.log(`Tab ${tabId} selected, attempting to initialize chart.`);
                  initializePercentageChart();
                } else if (tabId === 'trends' && !trendChartInstance && window.trendData && window.trendData.length > 0) {
                  console.log(`Tab ${tabId} selected, attempting to initialize chart.`);
                  initializeTrendChart();
                }
              }, 0); // 0ms delay pushes execution after DOM update

            });
          });
===
    </search>
    <content>
===
              // Mount/Unmount React component for Distribution tab
              if (tabId === 'distribution') {
                 // Ensure Babel has processed the script AND data is ready before rendering
                 setTimeout(() => { // Use timeout to ensure DOM update
                    if (typeof DistributionAnalysisComponent !== 'undefined') {
                        // Check if boxPlotData seems valid before rendering
                        if (window.boxPlotData && Object.keys(window.boxPlotData).length > 0) {
                             console.log("Rendering DistributionAnalysisComponent with data prop:", window.boxPlotData);
                             // Pass the data as a prop
                             ReactDOM.render(React.createElement(DistributionAnalysisComponent, { initialData: window.boxPlotData }), distributionReactRoot);
                        } else {
                             console.warn("Attempted to render DistributionAnalysisComponent, but window.boxPlotData is not ready.");
                             // Optionally render a placeholder or error message here directly
                             distributionReactRoot.innerHTML = '<p class="text-red-500">Distribution data is not available. Please check the data source and console logs.</p>';
                        }
                    } else {
                        console.error('DistributionAnalysisComponent not found. Babel might not have finished.');
                    }
                }, 0); // Delay ensures DOM is updated
              } else {
                // Unmount React component if it exists and we are switching away
                if (distributionReactRoot.hasChildNodes()) {
                  console.log("Unmounting DistributionAnalysisComponent");
                  ReactDOM.unmountComponentAtNode(distributionReactRoot);
                }
              }
              
              // Use setTimeout to ensure the tab content is visible before initializing charts
              // Always attempt initialization; the functions handle data checks and re-creation.
              setTimeout(() => {
                console.log(`Tab '${tabId}' selected, attempting chart initialization if applicable.`);
                if (tabId === 'raw') {
                  initializeRawChart();
                } else if (tabId === 'percentage') {
                  initializePercentageChart();
                } else if (tabId === 'trends') {
                  initializeTrendChart();
                }
                // No need to initialize distribution chart here, handled above.
              }, 50); // Small delay after tab switch

            });
          });
===
    </content>
  </change>
  <change>
    <description>Increase delay for initial raw chart init and add logging for canvas element check.</description>
    <search>
===
          
          // Initialize the default active tab's chart (Raw Outflow) IF data is loaded
          // Add a small delay to ensure the canvas is rendered
          setTimeout(() => {
              if (window.rawOutflowData && window.rawOutflowData.length > 0) {
                 console.log("Attempting initial Raw Chart initialization.");
                 initializeRawChart();
              } else {
                 console.warn("Raw outflow data not available, cannot initialize default chart.");
                 // Optionally try to display message on canvas if it exists
                 const rawCtx = document.getElementById('rawChart')?.getContext('2d');
                 if (rawCtx) {
                    rawCtx.clearRect(0, 0, rawCtx.canvas.width, rawCtx.canvas.height);
                    rawCtx.textAlign = 'center';
                    rawCtx.fillText('Data not available', rawCtx.canvas.width / 2, rawCtx.canvas.height / 2);
                 }
              }
          }, 100); // 100ms delay - adjust if needed

      }).catch(error => {
          console.error("Error during initial data load sequence:", error);
      });
===
    </search>
    <content>
===
          
          // Initialize the default active tab's chart (Raw Outflow) IF data is loaded
          // Add a slightly longer delay to ensure the canvas is rendered after initial load
          setTimeout(() => {
              if (window.rawOutflowData && window.rawOutflowData.length > 0) {
                 console.log("Attempting initial Raw Chart initialization after delay.");
                 initializeRawChart();
              } else {
                 console.warn("Initial load: Raw outflow data not available, cannot initialize default chart.");
                 // Optionally try to display message on canvas if it exists
                 const canvasElement = document.getElementById('rawChart');
                 if (canvasElement) {
                     const rawCtx = canvasElement.getContext('2d');
                     if (rawCtx) {
                        rawCtx.clearRect(0, 0, rawCtx.canvas.width, rawCtx.canvas.height);
                        rawCtx.textAlign = 'center';
                        rawCtx.fillText('Data not available', rawCtx.canvas.width / 2, rawCtx.canvas.height / 2);
                     }
                 } else {
                     console.warn("Initial load: Raw chart canvas element not found even after delay.");
                 }
              }
          }, 250); // Increased delay to 250ms

      }).catch(error => {
          console.error("Error during initial data load sequence:", error);
      });
===
    </content>
  </change>
   <change>
    <description>Add logging inside initializeRawChart to check for canvas element.</description>
    <search>
===
    // --- Chart.js Initialization Functions ---
    
    function initializeRawChart() {
        const rawCtx = document.getElementById('rawChart')?.getContext('2d');
        if (!rawCtx) {
            console.warn("Raw chart canvas not found.");
            return; 
        }
        // Check if data is loaded and valid
===
    </search>
    <content>
===
    // --- Chart.js Initialization Functions ---
    
    function initializeRawChart() {
        console.log("initializeRawChart called.");
        const canvasElement = document.getElementById('rawChart');
        if (!canvasElement) {
             console.warn("initializeRawChart: Canvas element with ID 'rawChart' not found in the DOM.");
             return;
        }
        console.log("initializeRawChart: Canvas element found:", canvasElement);
        const rawCtx = canvasElement.getContext('2d');
        if (!rawCtx) {
            console.warn("initializeRawChart: Failed to get 2D context from canvas.");
            return; 
        }
        // Check if data is loaded and valid
===
    </content>
  </change>
  <change>
    <description>Modify React component to accept data via props and remove internal useEffect check.</description>
    <search>
===
    // --- React Component for Distribution Tab ---
    function DistributionAnalysisComponent() {
        const [selectedYearGroup, setSelectedYearGroup] = useState('2yr');
        const [chartHover, setChartHover] = useState(null); // Optional hover state
        const [isDataReady, setIsDataReady] = useState(false);

        // Check for data on mount and when year group changes
        useEffect(() => {
            const checkData = () => {
                const lowKey = selectedYearGroup === '2yr' ? "2yr max outflow - low" : "200yr max outflow - low";
                const peakKey = selectedYearGroup === '2yr' ? "2yr max outflow - peak" : "200yr max outflow - peak";
                
                const dataAvailable = window.boxPlotData && 
                                      window.boxPlotData[lowKey] && 
                                      window.boxPlotData[peakKey] &&
                                      // Check deeper structure - ensure data was parsed correctly
                                      Array.isArray(window.boxPlotData[lowKey]) && window.boxPlotData[lowKey].length > 0 &&
                                      Array.isArray(window.boxPlotData[peakKey]) && window.boxPlotData[peakKey].length > 0; 
                                      // Note: We calculate stats later, so just check if arrays exist and aren't empty
                                      
                setIsDataReady(!!dataAvailable);
                if (!dataAvailable) {
                     console.warn(`Distribution data for keys '${lowKey}' or '${peakKey}' is not ready or incomplete.`);
                } else {
                     console.log(`Distribution data for keys '${lowKey}' and '${peakKey}' appears ready.`);
                }
            };
            checkData();
        }, [selectedYearGroup]); // Re-check when selectedYearGroup changes

        // Regenerate data only if ready
        const areaDistributionData = isDataReady ? generateAreaDistributionData(selectedYearGroup) : [{ group: "Low", data: [] }, { group: "Peak", data: [] }];
        const yAxisRange = getDistributionYAxisRange(selectedYearGroup);

        const DistributionTooltip = ({ active, payload, label }) => {
            if (active && payload && payload.length) {
                const data = payload[0].payload; // Access the data point object
                // Check if data properties exist before accessing them
                if (!data || data.min === undefined) return null; 
                return (
                    <div className="bg-white p-3 rounded shadow-lg border border-gray-200 text-xs">
                        <div className="font-semibold text-gray-800 mb-1">{data.name} - {data.type}</div>
                        <div className="space-y-1">
                            <div>Min: {data.min?.toFixed(4)} cms</div>
                            <div>Q1: {data.q1?.toFixed(4)} cms</div>
                            <div className="font-medium">Median: {data.median?.toFixed(4)} cms</div>
                            <div>Q3: {data.q3?.toFixed(4)} cms</div>
                            <div>Max: {data.max?.toFixed(4)} cms</div>
                            <div className="font-medium">Average: {data.avg?.toFixed(4)} cms</div>
                        </div>
                    </div>
                );
            }
            return null;
        };
        
        // Display loading or error message if data isn't ready
        if (!isDataReady) {
             // Check which specific sheets/keys might be missing based on the selected group
             const missingKeys = [];
             const lowKey = selectedYearGroup === '2yr' ? "2yr max outflow - low" : "200yr max outflow - low";
             const peakKey = selectedYearGroup === '2yr' ? "2yr max outflow - peak" : "200yr max outflow - peak";
             
             if (!window.boxPlotData || !window.boxPlotData[lowKey] || !Array.isArray(window.boxPlotData[lowKey]) || window.boxPlotData[lowKey].length === 0) {
                 missingKeys.push(`'${lowKey}'`);
             }
             if (!window.boxPlotData || !window.boxPlotData[peakKey] || !Array.isArray(window.boxPlotData[peakKey]) || window.boxPlotData[peakKey].length === 0) {
                 missingKeys.push(`'${peakKey}'`);
             }

             let message = `Loading data or data unavailable for the ${selectedYearGroup === '2yr' ? '2-Year' : '200-Year'} period...`;
             if (missingKeys.length > 0) {
                 message = `Data unavailable. Please ensure the 'uncertainty.xlsx' file contains valid data in the sheet(s): ${missingKeys.join(' and ')}. Check console for details.`;
             }

             return (
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">Distribution Analysis</h2>
                    <p className="text-red-600 bg-red-100 p-3 rounded border border-red-300 mb-4 text-sm italic">{message}</p>
                     {/* Still show selectors */}
                     <div className="flex flex-wrap mb-6">
                        <button 
                            onClick={() => setSelectedYearGroup('2yr')} 
                            className={`px-4 py-2 mr-2 mb-2 text-sm rounded-md transition-colors ${
                            selectedYearGroup === '2yr' 
                                ? 'bg-blue-700 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            2-Year Return Period
                        </button>
                        <button 
                            onClick={() => setSelectedYearGroup('200yr')} 
                            className={`px-4 py-2 mb-2 text-sm rounded-md transition-colors ${
                            selectedYearGroup === '200yr' 
                                ? 'bg-blue-700 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            200-Year Return Period
                        </button>
                    </div>
                </div>
            );
        }


        return (
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    Distribution Analysis ({selectedYearGroup === '2yr' ? '2-Year' : '200-Year'} Return Period)
                </h2>
===
    </search>
    <content>
===
    // --- React Component for Distribution Tab ---
    function DistributionAnalysisComponent(props) { // Accept props
        const { initialData } = props; // Destructure the passed data
        const [selectedYearGroup, setSelectedYearGroup] = useState('2yr');
        const [chartHover, setChartHover] = useState(null); // Optional hover state
        
        // Determine data readiness based on the passed prop and selected group
        const checkDataReadiness = () => {
            const lowKey = selectedYearGroup === '2yr' ? "2yr max outflow - low" : "200yr max outflow - low";
            const peakKey = selectedYearGroup === '2yr' ? "2yr max outflow - peak" : "200yr max outflow - peak";
            
            const dataAvailable = initialData && 
                                  initialData[lowKey] && 
                                  initialData[peakKey] &&
                                  Array.isArray(initialData[lowKey]) && initialData[lowKey].length > 0 &&
                                  Array.isArray(initialData[peakKey]) && initialData[peakKey].length > 0;
            return !!dataAvailable;
        };

        const isDataReady = checkDataReadiness(); // Check readiness on each render

        // Regenerate data only if ready, using the prop
        const areaDistributionData = isDataReady ? generateAreaDistributionData(selectedYearGroup, initialData) : [{ group: "Low", data: [] }, { group: "Peak", data: [] }];
        const yAxisRange = getDistributionYAxisRange(selectedYearGroup);

        const DistributionTooltip = ({ active, payload, label }) => {
            if (active && payload && payload.length) {
                const data = payload[0].payload; // Access the data point object
                // Check if data properties exist before accessing them
                if (!data || data.min === undefined) return null; 
                return (
                    <div className="bg-white p-3 rounded shadow-lg border border-gray-200 text-xs">
                        <div className="font-semibold text-gray-800 mb-1">{data.name} - {data.type}</div>
                        <div className="space-y-1">
                            <div>Min: {data.min?.toFixed(4)} cms</div>
                            <div>Q1: {data.q1?.toFixed(4)} cms</div>
                            <div className="font-medium">Median: {data.median?.toFixed(4)} cms</div>
                            <div>Q3: {data.q3?.toFixed(4)} cms</div>
                            <div>Max: {data.max?.toFixed(4)} cms</div>
                            <div className="font-medium">Average: {data.avg?.toFixed(4)} cms</div>
                        </div>
                    </div>
                );
            }
            return null;
        };
        
        // Display loading or error message if data isn't ready
        if (!isDataReady) {
             // Check which specific sheets/keys might be missing based on the selected group
             const missingKeys = [];
             const lowKey = selectedYearGroup === '2yr' ? "2yr max outflow - low" : "200yr max outflow - low";
             const peakKey = selectedYearGroup === '2yr' ? "2yr max outflow - peak" : "200yr max outflow - peak";
             
             // Check the passed initialData prop
             if (!initialData || !initialData[lowKey] || !Array.isArray(initialData[lowKey]) || initialData[lowKey].length === 0) {
                 missingKeys.push(`'${lowKey}'`);
             }
             if (!initialData || !initialData[peakKey] || !Array.isArray(initialData[peakKey]) || initialData[peakKey].length === 0) {
                 missingKeys.push(`'${peakKey}'`);
             }

             let message = `Loading data or data unavailable for the ${selectedYearGroup === '2yr' ? '2-Year' : '200-Year'} period...`;
             if (missingKeys.length > 0) {
                 message = `Data unavailable. Please ensure the 'uncertainty.xlsx' file contains valid data in the sheet(s): ${missingKeys.join(' and ')}. Check console for details.`;
             } else if (!initialData) {
                 message = `Data not passed correctly to the component. Check console logs.`;
             }


             return (
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">Distribution Analysis</h2>
                    <p className="text-red-600 bg-red-100 p-3 rounded border border-red-300 mb-4 text-sm italic">{message}</p>
                     {/* Still show selectors */}
                     <div className="flex flex-wrap mb-6">
                        <button 
                            onClick={() => setSelectedYearGroup('2yr')} 
                            className={`px-4 py-2 mr-2 mb-2 text-sm rounded-md transition-colors ${
                            selectedYearGroup === '2yr' 
                                ? 'bg-blue-700 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            2-Year Return Period
                        </button>
                        <button 
                            onClick={() => setSelectedYearGroup('200yr')} 
                            className={`px-4 py-2 mb-2 text-sm rounded-md transition-colors ${
                            selectedYearGroup === '200yr' 
                                ? 'bg-blue-700 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            200-Year Return Period
                        </button>
                    </div>
                </div>
            );
        }


        return (
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    Distribution Analysis ({selectedYearGroup === '2yr' ? '2-Year' : '200-Year'} Return Period)
                </h2>
===
    </content>
  </change>
  <change>
    <description>Update generateAreaDistributionData to accept boxPlotData as an argument.</description>
    <search>
===
    };

    const generateAreaDistributionData = (yearGroup) => {
        // Map yearGroup to the correct sheet names/keys
        const lowKey = yearGroup === '2yr' ? "2yr max outflow - low" : "200yr max outflow - low";
        const peakKey = yearGroup === '2yr' ? "2yr max outflow - peak" : "200yr max outflow - peak";

        // Check if boxPlotData and the required keys exist and contain data
        if (!window.boxPlotData || 
            !window.boxPlotData[lowKey] || !Array.isArray(window.boxPlotData[lowKey]) || window.boxPlotData[lowKey].length === 0 ||
            !window.boxPlotData[peakKey] || !Array.isArray(window.boxPlotData[peakKey]) || window.boxPlotData[peakKey].length === 0) {
            console.warn(`Box plot data for keys '${lowKey}' or '${peakKey}' not found, is not an array, or is empty.`);
            return [{ group: "Low", data: [] }, { group: "Peak", data: [] }];
        }

        // Helper to extract numeric data for a scenario based on potential column names
===
    </search>
    <content>
===
    };

    // Update function signature to accept data as argument
    const generateAreaDistributionData = (yearGroup, boxPlotData) => { 
        // Map yearGroup to the correct sheet names/keys
        const lowKey = yearGroup === '2yr' ? "2yr max outflow - low" : "200yr max outflow - low";
        const peakKey = yearGroup === '2yr' ? "2yr max outflow - peak" : "200yr max outflow - peak";

        // Check if the passed boxPlotData and the required keys exist and contain data
        if (!boxPlotData || 
            !boxPlotData[lowKey] || !Array.isArray(boxPlotData[lowKey]) || boxPlotData[lowKey].length === 0 ||
            !boxPlotData[peakKey] || !Array.isArray(boxPlotData[peakKey]) || boxPlotData[peakKey].length === 0) {
            console.warn(`generateAreaDistributionData: Box plot data for keys '${lowKey}' or '${peakKey}' not found in passed data, is not an array, or is empty.`);
            return [{ group: "Low", data: [] }, { group: "Peak", data: [] }];
        }

        // Helper to extract numeric data for a scenario based on potential column names
===
    </content>
  </change>
   <change>
    <description>Update generateAreaDistributionData calls within itself to use the passed 'boxPlotData' argument.</description>
    <search>
===
        };

        // Extract data for each scenario from the LOW sheet data
        const lowCurrentData = extractScenarioData(window.boxPlotData[lowKey], 'current');
        const lowBaselineData = extractScenarioData(window.boxPlotData[lowKey], 'baseline');
        const lowReplantData = extractScenarioData(window.boxPlotData[lowKey], 'replant');
        const lowUrbanData = extractScenarioData(window.boxPlotData[lowKey], 'urban');

        // Extract data for each scenario from the PEAK sheet data
        const peakCurrentData = extractScenarioData(window.boxPlotData[peakKey], 'current');
        const peakBaselineData = extractScenarioData(window.boxPlotData[peakKey], 'baseline');
        const peakReplantData = extractScenarioData(window.boxPlotData[peakKey], 'replant');
        const peakUrbanData = extractScenarioData(window.boxPlotData[peakKey], 'urban');

        // Calculate stats on the extracted numerical arrays
===
    </search>
    <content>
===
        };

        // Extract data for each scenario from the LOW sheet data using the passed argument
        const lowCurrentData = extractScenarioData(boxPlotData[lowKey], 'current');
        const lowBaselineData = extractScenarioData(boxPlotData[lowKey], 'baseline');
        const lowReplantData = extractScenarioData(boxPlotData[lowKey], 'replant');
        const lowUrbanData = extractScenarioData(boxPlotData[lowKey], 'urban');

        // Extract data for each scenario from the PEAK sheet data using the passed argument
        const peakCurrentData = extractScenarioData(boxPlotData[peakKey], 'current');
        const peakBaselineData = extractScenarioData(boxPlotData[peakKey], 'baseline');
        const peakReplantData = extractScenarioData(boxPlotData[peakKey], 'replant');
        const peakUrbanData = extractScenarioData(boxPlotData[peakKey], 'urban');

        // Calculate stats on the extracted numerical arrays
===
    </content>
  </change>
</file>
