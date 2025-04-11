<Plan>
The user reports that data is not visible on the dashboard. This suggests an issue with loading data from `uncertainty.xlsx`, processing it, or initializing the charts (both Chart.js and Recharts).

1.  **Improve Data Loading Robustness:** Modify the `loadExcelData` function in `index.html` to add console logs for debugging. Log the raw data read from each sheet and the processed data arrays (`rawOutflowData`, `percentageChangeData`, `trendData`, `boxPlotData`). Add checks to see if the expected sheets and data structures are found.
2.  **Ensure Correct Initialization Order:** Move the initial `loadExcelData()` call *inside* the `DOMContentLoaded` event listener. This guarantees the DOM (including canvas elements) is ready before data loading and subsequent chart initialization attempts begin. Remove the standalone `initializeRawChart()` call from `DOMContentLoaded` as `loadExcelData` will now handle initializing charts after data is loaded.
3.  **Conditional Chart Initialization:** Modify the tab switching logic and the `loadExcelData` function to ensure chart initialization functions (`initializeRawChart`, `initializePercentageChart`, `initializeTrendChart`) are only called if the corresponding data (`window.rawOutflowData`, `window.percentageChangeData`, `window.trendData`) has been successfully loaded and is not empty.
4.  **React Component Data Check:** Add a check within the React component (`DistributionAnalysisComponent`) to ensure `window.boxPlotData` exists and has the expected structure before attempting to render charts. Display a message if data is missing.
</Plan>

<file path="/Users/alikara/Desktop/508 website/index.html" action="modify">
  <change>
    <description>Modify loadExcelData for better logging and error checking, and ensure charts initialize only after successful data load.</description>
    <search>
===
    // Load data from uncertainty.xlsx using XLSX library
    async function loadExcelData() {
      try {
        const response = await fetch('uncertainty.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        // Assume sheet names are: "RawData", "PercentageData", "2yr-low", "2yr-peak", "200yr-low", and "200yr-peak"
        window.rawOutflowData = XLSX.utils.sheet_to_json(workbook.Sheets["RawData"]);
        window.percentageChangeData = XLSX.utils.sheet_to_json(workbook.Sheets["PercentageData"]);
        window.boxPlotData = {
          "2yr-low": XLSX.utils.sheet_to_json(workbook.Sheets["2yr-low"]),
          "2yr-peak": XLSX.utils.sheet_to_json(workbook.Sheets["2yr-peak"]),
          "200yr-low": XLSX.utils.sheet_to_json(workbook.Sheets["200yr-low"]),
          "200yr-peak": XLSX.utils.sheet_to_json(workbook.Sheets["200yr-peak"])
        };
        window.trendData = window.rawOutflowData.map(item => ({
          name: item.category,
          Current: 0,
          Baseline: ((item.Baseline - item.Current) / item.Current) * 100,
          Replant: ((item.Replant - item.Current) / item.Current) * 100,
          Urban: ((item.Urban - item.Current) / item.Current) * 100,
          rawCurrent: item.Current,
          rawBaseline: item.Baseline,
          rawReplant: item.Replant,
          rawUrban: item.Urban,
        }));
        // Reinitialize Chart.js charts if they have been set up
        if(window.initializeRawChart) { window.initializeRawChart(); }
        if(window.initializePercentageChart) { window.initializePercentageChart(); }
        if(window.initializeTrendChart) { window.initializeTrendChart(); }
      } catch (error) {
        console.error("Failed to load Excel data:", error);
      }
    }
    loadExcelData();

    // Initialize charts and tabs
    document.addEventListener('DOMContentLoaded', function() {
      const distributionTabContent = document.getElementById('distribution');
      const distributionReactRoot = document.getElementById('distributionReactRoot');
      
      // Initialize tabs
      const tabLinks = document.querySelectorAll('.tab-link');
      tabLinks.forEach(tab => {
        tab.addEventListener('click', function() {
          const tabId = this.id.replace('tab-', '');
          
          // Hide all tabs and remove active class from links
          document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
          document.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
          
          // Show the selected tab and mark link as active
          const activeContent = document.getElementById(tabId);
          if (activeContent) activeContent.classList.add('active');
          this.classList.add('active');
          
          // Mount/Unmount React component for Distribution tab
          if (tabId === 'distribution') {
            // Ensure Babel has processed the script before rendering
             setTimeout(() => {
                if (typeof DistributionAnalysisComponent !== 'undefined') {
                    ReactDOM.render(React.createElement(DistributionAnalysisComponent), distributionReactRoot);
                } else {
                    console.error('DistributionAnalysisComponent not found. Babel might not have finished.');
                }
            }, 0);
          } else {
            // Unmount React component if it exists and we are switching away
            if (distributionReactRoot.hasChildNodes()) {
              ReactDOM.unmountComponentAtNode(distributionReactRoot);
            }
          }
          
          // Initialize Chart.js charts if they haven't been already and the tab is active
          if (tabId === 'raw' && !rawChartInstance) {
            initializeRawChart();
          } else if (tabId === 'percentage' && !percentageChartInstance) {
            initializePercentageChart();
          } else if (tabId === 'trends' && !trendChartInstance) {
            initializeTrendChart();
          }
        });
      });
      
      // Initialize the default active tab's chart (Raw Outflow)
      initializeRawChart();

    }); // End DOMContentLoaded

    // --- Chart.js Initialization Functions ---
    
    function initializeRawChart() {
        const rawCtx = document.getElementById('rawChart')?.getContext('2d');
        if (!rawCtx) return; // Don't initialize if canvas not visible/found
        if (rawChartInstance) rawChartInstance.destroy(); // Destroy previous instance if exists
        rawChartInstance = new Chart(rawCtx, {
            type: 'bar',
            data: {
            labels: rawOutflowData.map(d => d.category),
            datasets: [
                { label: 'Current Conditions', data: rawOutflowData.map(d => d.Current), backgroundColor: '#0056b3', borderRadius: 4 },
                { label: '2050 Baseline (ViT)', data: rawOutflowData.map(d => d.Baseline), backgroundColor: '#fd7e14', borderRadius: 4 },
                { label: 'Replanting Efforts', data: rawOutflowData.map(d => d.Replant), backgroundColor: '#17a2b8', borderRadius: 4 },
                { label: 'Urban Development', data: rawOutflowData.map(d => d.Urban), backgroundColor: '#dc3545', borderRadius: 4 }
            ]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'Max Outflow (cms)' } } }, plugins: { tooltip: { callbacks: { label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(2)} cms`; } } } } }
        });
    }

    function initializePercentageChart() {
        const percentageCtx = document.getElementById('percentageChart')?.getContext('2d');
        if (!percentageCtx) return;
        if (percentageChartInstance) percentageChartInstance.destroy();
        percentageChartInstance = new Chart(percentageCtx, {
            type: 'bar',
            data: {
            labels: percentageChangeData.map(d => d.category),
            datasets: [
                { label: 'Urban vs 2050', data: percentageChangeData.map(d => d.Urban), backgroundColor: '#dc3545', borderRadius: 4 },
                { label: 'Replant vs 2050', data: percentageChangeData.map(d => d.Replant), backgroundColor: '#17a2b8', borderRadius: 4 }
            ]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { title: { display: true, text: 'Change from Baseline (%)' }, ticks: { callback: function(value) { return value.toFixed(1) + '%'; } }, min: -6, max: 2 } }, plugins: { tooltip: { callbacks: { label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(2)}%`; } } } } }
        });
    }

    function initializeTrendChart() {
        const trendCtx = document.getElementById('trendChart')?.getContext('2d');
        if (!trendCtx) return;
        if (trendChartInstance) trendChartInstance.destroy();
        trendChartInstance = new Chart(trendCtx, {
            type: 'line',
            data: {
            labels: trendData.map(d => d.name),
            datasets: [
                { label: 'Current Conditions', data: trendData.map(d => d.Current), borderColor: '#0056b3', backgroundColor: '#0056b3', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                { label: '2050 Baseline (ViT)', data: trendData.map(d => d.Baseline), borderColor: '#fd7e14', backgroundColor: '#fd7e14', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                { label: 'Replanting Efforts', data: trendData.map(d => d.Replant), borderColor: '#17a2b8', backgroundColor: '#17a2b8', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                { label: 'Urban Development', data: trendData.map(d => d.Urban), borderColor: '#dc3545', backgroundColor: '#dc3545', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 }
            ]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { title: { display: true, text: 'Change from Current (%)' }, ticks: { callback: function(value) { return value + '%'; } }, min: 0, max: 70 } }, plugins: { tooltip: { callbacks: { label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(1)}%`; }, title: function(context) { return `Return Period: ${context[0].label}`; } } } } }
        });
    }
    
  </script>

  <!-- React Component Definition (using Babel for JSX) -->
  <script type="text/babel">
    const { useState, useEffect } = React;
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } = Recharts;

    // --- Helper Functions (copied from modern-water-dashboard.jsx) ---
    const calculateStats = (data) => {
        if (!data || data.length === 0) return { min: 0, max: 0, q1: 0, median: 0, q3: 0, avg: 0 };
        const sorted = [...data].sort((a, b) => a - b);
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const median = sorted[Math.floor(sorted.length * 0.5)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
        return { min, max, q1, median, q3, avg };
    };

    const getDistributionYAxisRange = (yearGroup) => {
        return yearGroup === '2yr' ? [1.0, 2.6] : [7.0, 24.0];
    };

    const generateAreaDistributionData = (yearGroup) => {
        const lowKey = `${yearGroup}-low`;
        const peakKey = `${yearGroup}-peak`;
        
        // Check if boxPlotData and the required keys exist
        if (!window.boxPlotData || !window.boxPlotData[lowKey] || !window.boxPlotData[peakKey]) {
            console.warn(`Box plot data for year group '${yearGroup}' not found.`);
            // Return empty structure to prevent errors
             return [
                { group: "Low", data: [] },
                { group: "Peak", data: [] }
            ];
        }

        const lowStats = {
            current: calculateStats(boxPlotData[lowKey]?.current || []),
            baseline: calculateStats(boxPlotData[lowKey]?.baseline || []),
            replant: calculateStats(boxPlotData[lowKey]?.replant || []),
            urban: calculateStats(boxPlotData[lowKey]?.urban || [])
        };
        
        const peakStats = {
            current: calculateStats(boxPlotData[peakKey]?.current || []),
            baseline: calculateStats(boxPlotData[peakKey]?.baseline || []),
            replant: calculateStats(boxPlotData[peakKey]?.replant || []),
            urban: calculateStats(boxPlotData[peakKey]?.urban || [])
        };
        
        const mapData = (stats, type) => ([
            { name: 'Current', ...stats.current, type },
            { name: '2050 Baseline', ...stats.baseline, type },
            { name: 'Replant', ...stats.replant, type },
            { name: 'Urban', ...stats.urban, type }
        ]);

        return [
            { group: "Low", data: mapData(lowStats, "Low") },
            { group: "Peak", data: mapData(peakStats, "Peak") }
        ];
    };

    // --- React Component for Distribution Tab ---
    function DistributionAnalysisComponent() {
        const [selectedYearGroup, setSelectedYearGroup] = useState('2yr');
        const [chartHover, setChartHover] = useState(null); // Optional hover state
        const [isDataReady, setIsDataReady] = useState(false);

        // Check for data on mount and when year group changes
        useEffect(() => {
            const checkData = () => {
                const lowKey = `${selectedYearGroup}-low`;
                const peakKey = `${selectedYearGroup}-peak`;
                const dataAvailable = window.boxPlotData && 
                                      window.boxPlotData[lowKey] && 
                                      window.boxPlotData[peakKey] &&
                                      window.boxPlotData[lowKey].current && // Check deeper
                                      window.boxPlotData[peakKey].current; 
                setIsDataReady(!!dataAvailable);
                if (!dataAvailable) {
                     console.warn(`Distribution data for ${selectedYearGroup} is not ready or incomplete.`);
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
             return (
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">Distribution Analysis</h2>
                    <p className="text-gray-600 mb-4 text-sm italic">Loading data or data unavailable for the selected period...</p>
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
                <p className="text-gray-600 mb-4 text-sm italic">Combined low and peak scenario distribution</p>
                
                {/* Period selector */}
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
                
                <div 
                    className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500"
                    onMouseEnter={() => setChartHover('dist')}
                    onMouseLeave={() => setChartHover(null)}
                >
                    <p className={`transition-opacity duration-300 ${chartHover === 'dist' ? 'opacity-100' : 'opacity-70'} text-sm`}>
                        This chart visualizes the statistical distribution of max outflow values for both low and peak events in
                        the {selectedYearGroup === '2yr' ? '2-year' : '200-year'} return period. Each chart shows min/max range, 
                        quartiles (colored areas), median (line), and average values (dots).
                    </p>
                </div>

                {/* Legend - Updated */}
                <div className="flex items-center justify-center mb-6 text-xs text-gray-600 flex-wrap">
                    <div className="flex items-center mr-4 mb-2">
                        <div className="w-4 h-4 bg-blue-100 opacity-50 mr-1"></div>
                        <span>= 25%-75% Quartiles</span>
                    </div>
                    <div className="flex items-center mr-4 mb-2">
                         <div className="w-4 h-px bg-blue-700 mx-1"></div>
                        <span>= Median</span>
                    </div>
                    <div className="flex items-center mr-4 mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                        <span>= Average</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Low Event Chart - Refactored */}
                    <div>
                        <h3 className="text-lg font-medium text-center mb-2 text-gray-700">Low Events</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={areaDistributionData[0].data}
                                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                    <YAxis 
                                        domain={yAxisRange}
                                        label={{ value: `Max Outflow (cms)`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 }, dx:-10 }}
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(val) => val.toFixed(1)}
                                        allowDataOverflow={true} // Prevent clipping of area/line near boundaries
                                    />
                                    <Tooltip content={<DistributionTooltip />} />
                                    
                                    {/* Area for Q1-Q3 Range */}
                                    <Area 
                                        type="monotone" 
                                        dataKey={d => [d.q1, d.q3]} // Use accessor function
                                        stroke="none" 
                                        fill="rgba(0,86,179,0.2)" // Blue fill for low events
                                        fillOpacity={0.6}
                                        name="Quartile Range (Q1-Q3)"
                                    />

                                    {/* Median Line */}
                                    <Line 
                                        type="monotone" 
                                        dataKey="median" 
                                        stroke="#0056b3" // Darker blue for median
                                        strokeWidth={2} 
                                        dot={false} 
                                        activeDot={false} 
                                        name="Median"
                                    />
                                    
                                    {/* Average Dot (using Line with only dots) */}
                                    <Line 
                                        type="monotone" 
                                        dataKey="avg" 
                                        stroke="transparent" // Hide the line itself
                                        dot={{ r: 4, fill: '#2196F3', strokeWidth: 1, stroke: '#0056b3' }}
                                        activeDot={{ r: 6 }}
                                        name="Average"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    {/* Peak Event Chart - Refactored */}
                    <div>
                        <h3 className="text-lg font-medium text-center mb-2 text-gray-700">Peak Events</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={areaDistributionData[1].data}
                                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                    <YAxis 
                                        domain={yAxisRange}
                                        label={{ value: `Max Outflow (cms)`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 }, dx:-10 }}
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(val) => val.toFixed(1)}
                                        allowDataOverflow={true} // Prevent clipping
                                    />
                                    <Tooltip content={<DistributionTooltip />} />
                                    
                                    {/* Area for Q1-Q3 Range */}
                                    <Area 
                                        type="monotone" 
                                        dataKey={d => [d.q1, d.q3]} // Use accessor function
                                        stroke="none" 
                                        fill="rgba(220,53,69,0.2)" // Red fill for peak events
                                        fillOpacity={0.6}
                                        name="Quartile Range (Q1-Q3)"
                                    />

                                    {/* Median Line */}
                                    <Line 
                                        type="monotone" 
                                        dataKey="median" 
                                        stroke="#dc3545" // Darker red for median
                                        strokeWidth={2} 
                                        dot={false} 
                                        activeDot={false} 
                                        name="Median"
                                    />
                                    
                                    {/* Average Dot */}
                                    <Line 
                                        type="monotone" 
                                        dataKey="avg" 
                                        stroke="transparent" 
                                        dot={{ r: 4, fill: '#dc3545', strokeWidth: 1, stroke: '#b02a37' }}
                                        activeDot={{ r: 6 }}
                                        name="Average"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                
                {/* Statistics and Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2 text-gray-800">Key Statistics</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden text-xs">
                                <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Scenario</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Type</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Min</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Max</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Average</th>
                                </tr>
                                </thead>
                                <tbody>
                                {areaDistributionData[0].data.map((item, index) => (
                                    <tr key={`low-${index}`} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    <td className="px-3 py-2 text-gray-800 font-medium">{item.name}</td>
                                    <td className="px-3 py-2 text-gray-800">Low</td>
                                    <td className="px-3 py-2 text-gray-800">{item.min?.toFixed(3)}</td>
                                    <td className="px-3 py-2 text-gray-800">{item.max?.toFixed(3)}</td>
                                    <td className="px-3 py-2 text-gray-800">{item.avg?.toFixed(3)}</td>
                                    </tr>
                                ))}
                                {areaDistributionData[1].data.map((item, index) => (
                                    <tr key={`peak-${index}`} className={index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}>
                                    <td className="px-3 py-2 text-gray-800 font-medium">{item.name}</td>
                                    <td className="px-3 py-2 text-gray-800">Peak</td>
                                    <td className="px-3 py-2 text-gray-800">{item.min?.toFixed(3)}</td>
                                    <td className="px-3 py-2 text-gray-800">{item.max?.toFixed(3)}</td>
                                    <td className="px-3 py-2 text-gray-800">{item.avg?.toFixed(3)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2 text-gray-800">Key Insights</h3>
                        {selectedYearGroup === '2yr' ? (
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-800">
                            <li>The <span className="font-medium">Urban</span> scenario shows the highest peak flow values (~2.44 cms avg).</li>
                            <li>The <span className="font-medium">Current</span> conditions have the lowest outflow values across both low and peak events.</li>
                            <li>The <span className="font-medium">Replant</span> strategy shows noticeable reduction compared to Baseline, especially for peak events.</li>
                            <li>The relative difference between low and peak events stays consistent across all scenarios.</li>
                        </ul>
                        ) : (
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-800">
                            <li>All future scenarios show dramatically higher values (~60%+) compared to current conditions.</li>
                            <li>The <span className="font-medium">Replant</span> scenario offers minimal reduction for extreme 200-year events compared to Baseline.</li>
                            <li>The <span className="font-medium">Urban</span> development impact becomes less significant relative to Baseline at 200-year peak events.</li>
                            <li>The gap between low and peak values is much wider than in 2-year return periods.</li>
                        </ul>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    
    // Make the component globally available for the main script
    window.DistributionAnalysisComponent = DistributionAnalysisComponent;

  </script>
</body>
</html>
===
    </content>
  </change>
  <change>
    <description>Move loadExcelData call into DOMContentLoaded and remove initial chart init.</description>
    <search>
===
    }
    loadExcelData();

    // Initialize charts and tabs
    document.addEventListener('DOMContentLoaded', function() {
      const distributionTabContent = document.getElementById('distribution');
      const distributionReactRoot = document.getElementById('distributionReactRoot');
      
      // Initialize tabs
      const tabLinks = document.querySelectorAll('.tab-link');
      tabLinks.forEach(tab => {
        tab.addEventListener('click', function() {
          const tabId = this.id.replace('tab-', '');
          
          // Hide all tabs and remove active class from links
          document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
          document.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
          
          // Show the selected tab and mark link as active
          const activeContent = document.getElementById(tabId);
          if (activeContent) activeContent.classList.add('active');
          this.classList.add('active');
          
          // Mount/Unmount React component for Distribution tab
          if (tabId === 'distribution') {
            // Ensure Babel has processed the script before rendering
             setTimeout(() => {
                if (typeof DistributionAnalysisComponent !== 'undefined') {
                    ReactDOM.render(React.createElement(DistributionAnalysisComponent), distributionReactRoot);
                } else {
                    console.error('DistributionAnalysisComponent not found. Babel might not have finished.');
                }
            }, 0);
          } else {
            // Unmount React component if it exists and we are switching away
            if (distributionReactRoot.hasChildNodes()) {
              ReactDOM.unmountComponentAtNode(distributionReactRoot);
            }
          }
          
          // Initialize Chart.js charts if they haven't been already and the tab is active
          if (tabId === 'raw' && !rawChartInstance) {
            initializeRawChart();
          } else if (tabId === 'percentage' && !percentageChartInstance) {
            initializePercentageChart();
          } else if (tabId === 'trends' && !trendChartInstance) {
            initializeTrendChart();
          }
        });
      });
      
      // Initialize the default active tab's chart (Raw Outflow)
      initializeRawChart();

    }); // End DOMContentLoaded

    // --- Chart.js Initialization Functions ---
===
    </search>
    <content>
===
    }
    // loadExcelData(); // Moved inside DOMContentLoaded

    // Initialize charts and tabs
    document.addEventListener('DOMContentLoaded', function() {
      console.log("DOM fully loaded and parsed");
      const distributionTabContent = document.getElementById('distribution');
      const distributionReactRoot = document.getElementById('distributionReactRoot');
      
      // Load data first, then initialize tabs and default chart
      loadExcelData().then(() => {
          console.log("Excel data loading attempted.");
          // Initialize tabs after data load attempt
          const tabLinks = document.querySelectorAll('.tab-link');
          tabLinks.forEach(tab => {
            tab.addEventListener('click', function() {
              const tabId = this.id.replace('tab-', '');
              
              // Hide all tabs and remove active class from links
              document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
              document.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
              
              // Show the selected tab and mark link as active
              const activeContent = document.getElementById(tabId);
              if (activeContent) activeContent.classList.add('active');
              this.classList.add('active');
              
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
              
              // Initialize Chart.js charts if they haven't been already, the tab is active, AND data is loaded
              if (tabId === 'raw' && !rawChartInstance && window.rawOutflowData && window.rawOutflowData.length > 0) {
                initializeRawChart();
              } else if (tabId === 'percentage' && !percentageChartInstance && window.percentageChangeData && window.percentageChangeData.length > 0) {
                initializePercentageChart();
              } else if (tabId === 'trends' && !trendChartInstance && window.trendData && window.trendData.length > 0) {
                initializeTrendChart();
              }
            });
          });
          
          // Initialize the default active tab's chart (Raw Outflow) IF data is loaded
          if (window.rawOutflowData && window.rawOutflowData.length > 0) {
             initializeRawChart();
          } else {
             console.warn("Raw outflow data not available, cannot initialize default chart.");
          }

      }).catch(error => {
          console.error("Error during initial data load sequence:", error);
      });

    }); // End DOMContentLoaded

    // --- Chart.js Initialization Functions ---
===
    </content>
  </change>
  <change>
    <description>Update Chart.js initialization functions to check for data existence and length before creating charts.</description>
    <search>
===
    // --- Chart.js Initialization Functions ---
    
    function initializeRawChart() {
        const rawCtx = document.getElementById('rawChart')?.getContext('2d');
        if (!rawCtx) return; // Don't initialize if canvas not visible/found
        if (rawChartInstance) rawChartInstance.destroy(); // Destroy previous instance if exists
        rawChartInstance = new Chart(rawCtx, {
            type: 'bar',
            data: {
            labels: rawOutflowData.map(d => d.category),
            datasets: [
                { label: 'Current Conditions', data: rawOutflowData.map(d => d.Current), backgroundColor: '#0056b3', borderRadius: 4 },
                { label: '2050 Baseline (ViT)', data: rawOutflowData.map(d => d.Baseline), backgroundColor: '#fd7e14', borderRadius: 4 },
                { label: 'Replanting Efforts', data: rawOutflowData.map(d => d.Replant), backgroundColor: '#17a2b8', borderRadius: 4 },
                { label: 'Urban Development', data: rawOutflowData.map(d => d.Urban), backgroundColor: '#dc3545', borderRadius: 4 }
            ]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'Max Outflow (cms)' } } }, plugins: { tooltip: { callbacks: { label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(2)} cms`; } } } } }
        });
    }

    function initializePercentageChart() {
        const percentageCtx = document.getElementById('percentageChart')?.getContext('2d');
        if (!percentageCtx) return;
        if (percentageChartInstance) percentageChartInstance.destroy();
        percentageChartInstance = new Chart(percentageCtx, {
            type: 'bar',
            data: {
            labels: percentageChangeData.map(d => d.category),
            datasets: [
                { label: 'Urban vs 2050', data: percentageChangeData.map(d => d.Urban), backgroundColor: '#dc3545', borderRadius: 4 },
                { label: 'Replant vs 2050', data: percentageChangeData.map(d => d.Replant), backgroundColor: '#17a2b8', borderRadius: 4 }
            ]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { title: { display: true, text: 'Change from Baseline (%)' }, ticks: { callback: function(value) { return value.toFixed(1) + '%'; } }, min: -6, max: 2 } }, plugins: { tooltip: { callbacks: { label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(2)}%`; } } } } }
        });
    }

    function initializeTrendChart() {
        const trendCtx = document.getElementById('trendChart')?.getContext('2d');
        if (!trendCtx) return;
        if (trendChartInstance) trendChartInstance.destroy();
        trendChartInstance = new Chart(trendCtx, {
            type: 'line',
            data: {
            labels: trendData.map(d => d.name),
            datasets: [
                { label: 'Current Conditions', data: trendData.map(d => d.Current), borderColor: '#0056b3', backgroundColor: '#0056b3', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                { label: '2050 Baseline (ViT)', data: trendData.map(d => d.Baseline), borderColor: '#fd7e14', backgroundColor: '#fd7e14', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                { label: 'Replanting Efforts', data: trendData.map(d => d.Replant), borderColor: '#17a2b8', backgroundColor: '#17a2b8', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                { label: 'Urban Development', data: trendData.map(d => d.Urban), borderColor: '#dc3545', backgroundColor: '#dc3545', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 }
            ]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { title: { display: true, text: 'Change from Current (%)' }, ticks: { callback: function(value) { return value + '%'; } }, min: 0, max: 70 } }, plugins: { tooltip: { callbacks: { label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(1)}%`; }, title: function(context) { return `Return Period: ${context[0].label}`; } } } } }
        });
    }
===
    </search>
    <content>
===
    // --- Chart.js Initialization Functions ---
    
    function initializeRawChart() {
        const rawCtx = document.getElementById('rawChart')?.getContext('2d');
        if (!rawCtx) {
            console.warn("Raw chart canvas not found.");
            return; 
        }
        // Check if data is loaded and valid
        if (!window.rawOutflowData || window.rawOutflowData.length === 0) {
            console.warn("Raw outflow data is not available or empty. Cannot initialize chart.");
            // Optionally display a message on the canvas
            rawCtx.clearRect(0, 0, rawCtx.canvas.width, rawCtx.canvas.height);
            rawCtx.textAlign = 'center';
            rawCtx.fillText('Data not available', rawCtx.canvas.width / 2, rawCtx.canvas.height / 2);
            return;
        }
        
        console.log("Initializing Raw Chart with data:", window.rawOutflowData);
        if (rawChartInstance) rawChartInstance.destroy(); // Destroy previous instance if exists
        
        try {
            rawChartInstance = new Chart(rawCtx, {
                type: 'bar',
                data: {
                labels: window.rawOutflowData.map(d => d.category),
                datasets: [
                    { label: 'Current Conditions', data: window.rawOutflowData.map(d => d.Current), backgroundColor: '#0056b3', borderRadius: 4 },
                    { label: '2050 Baseline (ViT)', data: window.rawOutflowData.map(d => d.Baseline), backgroundColor: '#fd7e14', borderRadius: 4 },
                    { label: 'Replanting Efforts', data: window.rawOutflowData.map(d => d.Replant), backgroundColor: '#17a2b8', borderRadius: 4 },
                    { label: 'Urban Development', data: window.rawOutflowData.map(d => d.Urban), backgroundColor: '#dc3545', borderRadius: 4 }
                ]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'Max Outflow (cms)' } } }, plugins: { tooltip: { callbacks: { label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(2)} cms`; } } } } }
            });
        } catch (error) {
            console.error("Error initializing Raw Chart:", error);
        }
    }

    function initializePercentageChart() {
        const percentageCtx = document.getElementById('percentageChart')?.getContext('2d');
         if (!percentageCtx) {
            console.warn("Percentage chart canvas not found.");
            return; 
        }
       if (!window.percentageChangeData || window.percentageChangeData.length === 0) {
            console.warn("Percentage change data is not available or empty. Cannot initialize chart.");
            percentageCtx.clearRect(0, 0, percentageCtx.canvas.width, percentageCtx.canvas.height);
            percentageCtx.textAlign = 'center';
            percentageCtx.fillText('Data not available', percentageCtx.canvas.width / 2, percentageCtx.canvas.height / 2);
            return;
        }

        console.log("Initializing Percentage Chart with data:", window.percentageChangeData);
        if (percentageChartInstance) percentageChartInstance.destroy();

        try {
            percentageChartInstance = new Chart(percentageCtx, {
                type: 'bar',
                data: {
                labels: window.percentageChangeData.map(d => d.category),
                datasets: [
                    { label: 'Urban vs 2050', data: window.percentageChangeData.map(d => d.Urban), backgroundColor: '#dc3545', borderRadius: 4 },
                    { label: 'Replant vs 2050', data: window.percentageChangeData.map(d => d.Replant), backgroundColor: '#17a2b8', borderRadius: 4 }
                ]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { title: { display: true, text: 'Change from Baseline (%)' }, ticks: { callback: function(value) { return value.toFixed(1) + '%'; } }, min: -6, max: 2 } }, plugins: { tooltip: { callbacks: { label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(2)}%`; } } } } }
            });
        } catch (error) {
             console.error("Error initializing Percentage Chart:", error);
        }
    }

    function initializeTrendChart() {
        const trendCtx = document.getElementById('trendChart')?.getContext('2d');
        if (!trendCtx) {
            console.warn("Trend chart canvas not found.");
            return;
        }
        if (!window.trendData || window.trendData.length === 0) {
            console.warn("Trend data is not available or empty. Cannot initialize chart.");
             trendCtx.clearRect(0, 0, trendCtx.canvas.width, trendCtx.canvas.height);
            trendCtx.textAlign = 'center';
            trendCtx.fillText('Data not available', trendCtx.canvas.width / 2, trendCtx.canvas.height / 2);
            return;
        }

        console.log("Initializing Trend Chart with data:", window.trendData);
        if (trendChartInstance) trendChartInstance.destroy();

        try {
            trendChartInstance = new Chart(trendCtx, {
                type: 'line',
                data: {
                labels: window.trendData.map(d => d.name),
                datasets: [
                    { label: 'Current Conditions', data: window.trendData.map(d => d.Current), borderColor: '#0056b3', backgroundColor: '#0056b3', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                    { label: '2050 Baseline (ViT)', data: window.trendData.map(d => d.Baseline), borderColor: '#fd7e14', backgroundColor: '#fd7e14', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                    { label: 'Replanting Efforts', data: window.trendData.map(d => d.Replant), borderColor: '#17a2b8', backgroundColor: '#17a2b8', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                    { label: 'Urban Development', data: window.trendData.map(d => d.Urban), borderColor: '#dc3545', backgroundColor: '#dc3545', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 }
                ]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { title: { display: true, text: 'Change from Current (%)' }, ticks: { callback: function(value) { return value + '%'; } }, min: 0, max: 70 } }, plugins: { tooltip: { callbacks: { label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(1)}%`; }, title: function(context) { return `Return Period: ${context[0].label}`; } } } } }
            });
        } catch (error) {
            console.error("Error initializing Trend Chart:", error);
        }
    }
===
    </content>
  </change>
  <change>
    <description>Refactor loadExcelData to add detailed logging and checks for sheet/data validity.</description>
    <search>
===
    // Load data from uncertainty.xlsx using XLSX library
    async function loadExcelData() {
      try {
        const response = await fetch('uncertainty.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        // Assume sheet names are: "RawData", "PercentageData", "2yr-low", "2yr-peak", "200yr-low", and "200yr-peak"
        window.rawOutflowData = XLSX.utils.sheet_to_json(workbook.Sheets["RawData"]);
        window.percentageChangeData = XLSX.utils.sheet_to_json(workbook.Sheets["PercentageData"]);
        window.boxPlotData = {
          "2yr-low": XLSX.utils.sheet_to_json(workbook.Sheets["2yr-low"]),
          "2yr-peak": XLSX.utils.sheet_to_json(workbook.Sheets["2yr-peak"]),
          "200yr-low": XLSX.utils.sheet_to_json(workbook.Sheets["200yr-low"]),
          "200yr-peak": XLSX.utils.sheet_to_json(workbook.Sheets["200yr-peak"])
        };
        window.trendData = window.rawOutflowData.map(item => ({
          name: item.category,
          Current: 0,
          Baseline: ((item.Baseline - item.Current) / item.Current) * 100,
          Replant: ((item.Replant - item.Current) / item.Current) * 100,
          Urban: ((item.Urban - item.Current) / item.Current) * 100,
          rawCurrent: item.Current,
          rawBaseline: item.Baseline,
          rawReplant: item.Replant,
          rawUrban: item.Urban,
        }));
        // Reinitialize Chart.js charts if they have been set up
        if(window.initializeRawChart) { window.initializeRawChart(); }
        if(window.initializePercentageChart) { window.initializePercentageChart(); }
        if(window.initializeTrendChart) { window.initializeTrendChart(); }
      } catch (error) {
        console.error("Failed to load Excel data:", error);
      }
    }
===
    </search>
    <content>
===
    // Load data from uncertainty.xlsx using XLSX library
    async function loadExcelData() {
        console.log("Attempting to load Excel data...");
        try {
            const response = await fetch('uncertainty.xlsx');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            console.log("Workbook loaded. Sheets found:", workbook.SheetNames);

            const requiredSheets = ["RawData", "PercentageData", "2yr-low", "2yr-peak", "200yr-low", "200yr-peak"];
            let missingSheets = requiredSheets.filter(sheetName => !workbook.Sheets[sheetName]);
            if (missingSheets.length > 0) {
                 console.warn("Warning: The following required sheets are missing from uncertainty.xlsx:", missingSheets.join(', '));
            }

            // Function to safely parse sheet to JSON and log issues
            const safeSheetToJson = (sheetName) => {
                const sheet = workbook.Sheets[sheetName];
                if (!sheet) {
                    console.warn(`Sheet "${sheetName}" not found.`);
                    return []; // Return empty array if sheet is missing
                }
                try {
                    const data = XLSX.utils.sheet_to_json(sheet);
                    console.log(`Sheet "${sheetName}" parsed successfully. Rows: ${data.length}`);
                    if (data.length === 0) {
                         console.warn(`Sheet "${sheetName}" parsed but resulted in 0 rows.`);
                    } else {
                         // Log first row keys to check headers
                         console.log(`Sheet "${sheetName}" first row keys:`, Object.keys(data[0]));
                    }
                    return data;
                } catch (e) {
                    console.error(`Error parsing sheet "${sheetName}":`, e);
                    return []; // Return empty array on parsing error
                }
            };

            // Load data using the safe function
            window.rawOutflowData = safeSheetToJson("RawData");
            window.percentageChangeData = safeSheetToJson("PercentageData");
            window.boxPlotData = {
                "2yr-low": safeSheetToJson("2yr-low"),
                "2yr-peak": safeSheetToJson("2yr-peak"),
                "200yr-low": safeSheetToJson("200yr-low"),
                "200yr-peak": safeSheetToJson("200yr-peak")
            };

            // Process trendData only if rawOutflowData is valid
            if (window.rawOutflowData && window.rawOutflowData.length > 0 && window.rawOutflowData[0].category !== undefined) {
                 try {
                    window.trendData = window.rawOutflowData.map(item => {
                        // Add checks for numeric values and handle potential division by zero
                        const current = Number(item.Current) || 0;
                        const baseline = Number(item.Baseline) || 0;
                        const replant = Number(item.Replant) || 0;
                        const urban = Number(item.Urban) || 0;
                        const baselineChange = current !== 0 ? ((baseline - current) / current) * 100 : 0;
                        const replantChange = current !== 0 ? ((replant - current) / current) * 100 : 0;
                        const urbanChange = current !== 0 ? ((urban - current) / current) * 100 : 0;

                        return {
                            name: item.category,
                            Current: 0, // Trend chart shows change FROM current, so current is 0% change
                            Baseline: baselineChange,
                            Replant: replantChange,
                            Urban: urbanChange,
                            rawCurrent: current,
                            rawBaseline: baseline,
                            rawReplant: replant,
                            rawUrban: urban,
                        };
                    });
                    console.log("Trend data processed:", window.trendData);
                 } catch (e) {
                     console.error("Error processing trendData:", e);
                     window.trendData = [];
                 }
            } else {
                console.warn("Cannot process trendData because rawOutflowData is invalid or empty.");
                window.trendData = [];
            }

            console.log("Final loaded data structure:", {
                rawOutflowData: window.rawOutflowData,
                percentageChangeData: window.percentageChangeData,
                boxPlotData: window.boxPlotData,
                trendData: window.trendData
            });
            console.log("Excel data loading and processing finished successfully.");

            // Initialize charts AFTER data is processed and logged
            // The actual initialization will be triggered by DOMContentLoaded or tab clicks checking data validity

        } catch (error) {
            console.error("Failed to load or process Excel data:", error);
            // Ensure data variables are empty arrays if loading fails
            window.rawOutflowData = [];
            window.percentageChangeData = [];
            window.boxPlotData = {};
            window.trendData = [];
        }
    }
===
    </content>
  </change>
  <change>
    <description>Update React component AreaChart dataKey prop for q1/q3 to use an accessor function, fixing a potential Recharts issue.</description>
    <search>
===
                                    {/* Area for Q1-Q3 Range */}
                                    <Area 
                                        type="monotone" 
                                        dataKey={['q1', 'q3']} // Define range using q1 and q3
                                        stroke="none" 
                                        fill="rgba(0,86,179,0.2)" // Blue fill for low events
                                        fillOpacity={0.6}
                                        name="Quartile Range (Q1-Q3)"
                                    />

                                    {/* Median Line */}
===
    </search>
    <content>
===
                                    {/* Area for Q1-Q3 Range */}
                                    <Area 
                                        type="monotone" 
                                        dataKey={d => [d.q1, d.q3]} // Use accessor function
                                        stroke="none" 
                                        fill="rgba(0,86,179,0.2)" // Blue fill for low events
                                        fillOpacity={0.6}
                                        name="Quartile Range (Q1-Q3)"
                                    />

                                    {/* Median Line */}
===
    </content>
  </change>
  <change>
    <description>Update React component AreaChart dataKey prop for q1/q3 in the Peak chart as well.</description>
    <search>
===
                                    {/* Area for Q1-Q3 Range */}
                                    <Area 
                                        type="monotone" 
                                        dataKey={['q1', 'q3']} // Define range using q1 and q3
                                        stroke="none" 
                                        fill="rgba(220,53,69,0.2)" // Red fill for peak events
                                        fillOpacity={0.6}
                                        name="Quartile Range (Q1-Q3)"
                                    />

                                    {/* Median Line */}
===
    </search>
    <content>
===
                                    {/* Area for Q1-Q3 Range */}
                                    <Area 
                                        type="monotone" 
                                        dataKey={d => [d.q1, d.q3]} // Use accessor function
                                        stroke="none" 
                                        fill="rgba(220,53,69,0.2)" // Red fill for peak events
                                        fillOpacity={0.6}
                                        name="Quartile Range (Q1-Q3)"
                                    />

                                    {/* Median Line */}
===
    </content>
  </change>
</file>
