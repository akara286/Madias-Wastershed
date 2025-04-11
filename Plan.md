<Plan>
1. Revert from split charts back to a single combined trend visualization
2. Enhance the visualization with clearer labels, markers, and formatting
3. Add better explanatory text to ensure users understand the percentage change concept
4. Keep mobile optimizations for the combined chart
</Plan>

<file path="/Users/alikara/Desktop/508 website/index.html" action="modify">
  <change>
    <description>Replace split charts with improved combined trend chart</description>
    <search>
===
            <div class="plot-description">
        This visualization shows how climate change and land management strategies affect Madias Creek outflows across different rainfall event severities. The charts display percentage increases relative to baseline conditions for both Low and Peak events separately.
        
        <div style="background-color: #f8f9fa; border-left: 4px solid #6c757d; padding: 10px; margin: 15px 0; font-size: 0.85em; max-width: 100%; overflow-wrap: break-word;">
          <strong>Important Note on Percentage Changes:</strong> Each event type (Low and Peak) uses its own baseline value for calculating percentage change. Since Low event values are typically smaller than Peak values, the same absolute increase will result in a larger percentage change for Low events. This is why we've separated the visualizations to avoid misleading comparisons.
        </div>
        
        <ul>
            <li>The significant impact of climate change alone (baseline scenario) on all return periods, with dramatic increases for 200-year events in both Low and Peak.</li>
            <li>Even with replanting initiatives, all future scenarios show substantially higher outflows than current conditions.</li>
            <li>The Urban scenario shows the highest increases above baseline, reflecting increased runoff from impervious surfaces.</li>
            <li>In absolute terms, Peak events show greater increases than Low events, though percentage changes may appear different.</li>
        </ul>
        
        This analysis supports ʔakisq̓nuk First Nation's focus on both mitigation (replanting) and adaptation (improved culverts at Highway 93/95) strategies, as identified in the watershed's vulnerability assessment.
      </div>
      
      <div class="data-source-note">Calculated from summary values representing multiple return periods</div>
      
      <div class="flex flex-col md:flex-row gap-4">
        <div class="w-full md:w-1/2">
          <h3 class="text-lg font-medium text-center mb-2 text-gray-700">Low Events (% Change)</h3>
          <div class="chart-container" style="height: 350px; min-height: 300px;">
            <canvas id="trendChartLow"></canvas>
          </div>
        </div>
        <div class="w-full md:w-1/2">
          <h3 class="text-lg font-medium text-center mb-2 text-gray-700">Peak Events (% Change)</h3>
          <div class="chart-container" style="height: 350px; min-height: 300px;">
            <canvas id="trendChartPeak"></canvas>
          </div>
        </div>
      </div>
===
    </search>
    <content>
===
            <div class="plot-description">
        This visualization shows how climate change and land management strategies affect Madias Creek outflows across different rainfall event severities. The chart displays <strong>percentage increases relative to 2025 current conditions</strong>.
        
        <div style="background-color: #f8f9fa; border-left: 4px solid #6c757d; padding: 10px; margin: 15px 0; font-size: 0.85em; max-width: 100%; overflow-wrap: break-word;">
          <strong>Understanding Percentage Changes:</strong> Each bar represents how much higher the outflow is compared to 2025 conditions (shown as a percentage). Notice that <span style="color: #0056b3; font-weight: 500;">Low Events</span> typically show higher percentage changes than <span style="color: #dc3545; font-weight: 500;">Peak Events</span> for the same scenario. This is because Low Events start from smaller baseline values, so the same absolute increase results in a larger percentage change.
        </div>
        
        <ul>
            <li>All scenarios show significant outflow increases compared to current conditions, with the most dramatic changes in 200-year events.</li>
            <li>Urban development (2050+) generally shows the highest percentage increases across all return periods.</li>
            <li>Replanting (2050+) demonstrates some reduction compared to the 2050 baseline, particularly during smaller (2-year) rainfall events.</li>
            <li><strong>Important:</strong> While Low Events may show larger percentage changes, Peak Events typically have greater absolute increases in outflow volume (cms).</li>
        </ul>
        
        This analysis supports ʔakisq̓nuk First Nation's focus on both mitigation (replanting) and adaptation (improved culverts at Highway 93/95) strategies, as identified in the watershed's vulnerability assessment.
      </div>
      
      <div class="data-source-note">Calculated from summary values representing multiple return periods</div>
      
      <div class="chart-container" style="height: 450px; min-height: 350px;">
        <div style="text-align: center; margin-bottom: 8px;">
          <h3 class="text-lg font-medium text-gray-800">Percentage Change in Water Outflow from Current (2025) Conditions</h3>
          <div class="flex justify-center items-center gap-3 text-sm text-gray-600 mt-1 mb-2 flex-wrap">
            <div class="flex items-center">
              <div style="width: 14px; height: 14px; background-color: #0056b3; border-radius: 50%; margin-right: 4px;"></div>
              <span>Low Events</span>
            </div>
            <div class="flex items-center">
              <div style="width: 14px; height: 14px; background-color: #dc3545; border-radius: 50%; margin-right: 4px;"></div>
              <span>Peak Events</span>
            </div>
            <div class="text-xs bg-gray-100 px-2 py-1 rounded">
              Higher % ≠ Higher Flow Volume
            </div>
          </div>
        </div>
        <canvas id="trendChart"></canvas>
      </div>
===
    </content>
  </change>
  <change>
    <description>Update trend chart initialization for combined, clearer visualization</description>
    <search>
===
    function initializeTrendChart(canvasElement) {
        console.log("Trend Chart functionality is now split into Low and Peak charts");
        initializeTrendChartLow(document.getElementById('trendChartLow'));
        initializeTrendChartPeak(document.getElementById('trendChartPeak'));
    }
    
    // New function to initialize the Low events trend chart
    function initializeTrendChartLow(canvasElement) {
        console.log("Attempting to initialize Low Trend Chart...");
        if (!canvasElement) {
            console.warn("initializeTrendChartLow: Received null canvas element.");
            return;
        }
        
        let chartInstance = null;
        const chartCtx = canvasElement.getContext('2d');
        if (!chartCtx) {
            console.warn("initializeTrendChartLow: Failed to get 2D context.");
            return;
        }
        
        if (!window.trendData || window.trendData.length === 0) {
            console.warn("Trend summary data is not available or empty. Cannot initialize chart.");
            chartCtx.clearRect(0, 0, chartCtx.canvas.width, chartCtx.canvas.height);
            chartCtx.textAlign = 'center';
            chartCtx.fillText('Summary data not available', chartCtx.canvas.width / 2, chartCtx.canvas.height / 2);
            return;
        }

        console.log("Initializing Low Trend Chart");

        try {
            // Filter data to only include Low events
            const lowEventData = window.trendData.filter(d => d.name.toLowerCase().includes('low'));
            
            // Determine min/max for y-axis dynamically
            const allLowValues = lowEventData.flatMap(d => [d.Baseline, d.Replant, d.Urban]);
            const dataMin = Math.min(0, ...allLowValues);
            const dataMax = Math.max(0, ...allLowValues);
            const yMin = Math.floor(dataMin - Math.abs(dataMin * 0.1));
            const yMax = Math.ceil(dataMax + Math.abs(dataMax * 0.1));

            // Add zoom controls
            const container = canvasElement.closest('.chart-container');
            if (container) {
                const zoomControls = document.createElement('div');
                zoomControls.className = 'zoom-controls';
                zoomControls.style.display = 'flex';
                zoomControls.style.justifyContent = 'center';
                zoomControls.style.alignItems = 'center';
                zoomControls.style.marginTop = '0.5rem';
                
                zoomControls.innerHTML = `
                    <button id="resetZoomBtnLow" style="font-size: 0.75rem; background: #f0f0f0; border: 1px solid #ddd; padding: 0.25rem 0.5rem; border-radius: 3px; cursor: pointer; display: flex; align-items: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.3rem;"><path d="M3 2v6h6"></path><path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path><path d="M21 22v-6h-6"></path><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path></svg>
                        Reset Zoom
                    </button>
                `;
                
                container.appendChild(zoomControls);
                
                // Add click handler for reset button
                const resetBtn = container.querySelector('#resetZoomBtnLow');
                if (resetBtn) {
                    resetBtn.addEventListener('click', function() {
                        if (chartInstance && chartInstance.resetZoom) {
                            chartInstance.resetZoom();
                        }
                    });
                }
            }
            
            chartInstance = new Chart(chartCtx, {
                type: 'line',
                data: {
                    labels: lowEventData.map(d => d.name.replace('Low Avg', '')), // Simplify labels
                    datasets: [
                        { label: '2050 Baseline', data: lowEventData.map(d => d.Baseline), borderColor: '#fd7e14', backgroundColor: '#fd7e14', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                        { label: 'Replanting (2050+)', data: lowEventData.map(d => d.Replant), borderColor: '#17a2b8', backgroundColor: '#17a2b8', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                        { label: 'Urban Development (2050+)', data: lowEventData.map(d => d.Urban), borderColor: '#dc3545', backgroundColor: '#dc3545', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 }
                    ]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false,
                    // Mobile optimizations
                    onResize: function(chart, size) {
                        // Adjust point and line sizes based on screen width
                        const datasets = chart.data.datasets;
                        const isMobile = size.width < 500;
                        
                        datasets.forEach(dataset => {
                            dataset.pointRadius = isMobile ? 4 : 6;
                            dataset.pointHoverRadius = isMobile ? 6 : 8;
                            dataset.borderWidth = isMobile ? 2 : 3;
                        });
                        
                        // Adjust legend display
                        chart.options.plugins.legend.display = size.width > 380;
                    },
                    plugins: {
                        zoom: {
                            limits: {
                                y: {min: 'original', max: 'original', minRange: 1}
                            },
                            pan: {
                                enabled: true,
                                mode: 'xy',
                                // Mobile-friendly pan settings
                                threshold: isMobileDevice() ? 5 : 10, // More sensitive for touch
                            },
                            zoom: {
                                wheel: {
                                    enabled: true,
                                },
                                pinch: {
                                    enabled: true
                                },
                                mode: 'xy',
                                drag: {
                                    enabled: true,
                                    threshold: isMobileDevice() ? 5 : 10, // More sensitive on mobile
                                    backgroundColor: 'rgba(0,106,179,0.1)', 
                                    borderColor: 'rgba(0,106,179,0.3)',
                                    borderWidth: 1
                                }
                            }
                        }
                    },
                    scales: { 
                        y: { 
                            title: { display: true, text: 'Change from 2025 Baseline (%)' }, 
                            ticks: { callback: function(value) { return value.toFixed(0) + '%'; } },
                            min: yMin,
                            max: yMax
                        },
                        x: {
                            ticks: {
                                autoSkip: false, 
                                maxRotation: 30,
                                minRotation: 0
                            }
                        }
                    }, 
                    plugins: { 
                        tooltip: { 
                            callbacks: { 
                                label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(1)}%`; }, 
                                title: function(context) { return `${context[0].label} (Low)`; }
                            } 
                        },
                        title: {
                            display: true,
                            text: 'Low Events: % Change from 2025',
                            font: {
                                size: 14
                            }
                        }
                    } 
                }
            });
            console.log("Low Trend Chart initialized successfully.");
        } catch (error) {
            console.error("Error initializing Low Trend Chart:", error);
        }
    }
    
    // New function to initialize the Peak events trend chart
    function initializeTrendChartPeak(canvasElement) {
        console.log("Attempting to initialize Peak Trend Chart...");
        if (!canvasElement) {
            console.warn("initializeTrendChartPeak: Received null canvas element.");
            return;
        }
        
        let chartInstance = null;
        const chartCtx = canvasElement.getContext('2d');
        if (!chartCtx) {
            console.warn("initializeTrendChartPeak: Failed to get 2D context.");
            return;
        }
        
        if (!window.trendData || window.trendData.length === 0) {
            console.warn("Trend summary data is not available or empty. Cannot initialize chart.");
            chartCtx.clearRect(0, 0, chartCtx.canvas.width, chartCtx.canvas.height);
            chartCtx.textAlign = 'center';
            chartCtx.fillText('Summary data not available', chartCtx.canvas.width / 2, chartCtx.canvas.height / 2);
            return;
        }

        console.log("Initializing Peak Trend Chart");

        try {
            // Filter data to only include Peak events
            const peakEventData = window.trendData.filter(d => d.name.toLowerCase().includes('peak'));
            
            // Determine min/max for y-axis dynamically
            const allPeakValues = peakEventData.flatMap(d => [d.Baseline, d.Replant, d.Urban]);
            const dataMin = Math.min(0, ...allPeakValues);
            const dataMax = Math.max(0, ...allPeakValues);
            const yMin = Math.floor(dataMin - Math.abs(dataMin * 0.1));
            const yMax = Math.ceil(dataMax + Math.abs(dataMax * 0.1));

            // Add zoom controls
            const container = canvasElement.closest('.chart-container');
            if (container) {
                const zoomControls = document.createElement('div');
                zoomControls.className = 'zoom-controls';
                zoomControls.style.display = 'flex';
                zoomControls.style.justifyContent = 'center';
                zoomControls.style.alignItems = 'center';
                zoomControls.style.marginTop = '0.5rem';
                
                zoomControls.innerHTML = `
                    <button id="resetZoomBtnPeak" style="font-size: 0.75rem; background: #f0f0f0; border: 1px solid #ddd; padding: 0.25rem 0.5rem; border-radius: 3px; cursor: pointer; display: flex; align-items: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.3rem;"><path d="M3 2v6h6"></path><path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path><path d="M21 22v-6h-6"></path><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path></svg>
                        Reset Zoom
                    </button>
                `;
                
                container.appendChild(zoomControls);
                
                // Add click handler for reset button
                const resetBtn = container.querySelector('#resetZoomBtnPeak');
                if (resetBtn) {
                    resetBtn.addEventListener('click', function() {
                        if (chartInstance && chartInstance.resetZoom) {
                            chartInstance.resetZoom();
                        }
                    });
                }
            }
            
            chartInstance = new Chart(chartCtx, {
                type: 'line',
                data: {
                    labels: peakEventData.map(d => d.name.replace('Peak Avg', '')), // Simplify labels
                    datasets: [
                        { label: '2050 Baseline', data: peakEventData.map(d => d.Baseline), borderColor: '#fd7e14', backgroundColor: '#fd7e14', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                        { label: 'Replanting (2050+)', data: peakEventData.map(d => d.Replant), borderColor: '#17a2b8', backgroundColor: '#17a2b8', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 },
                        { label: 'Urban Development (2050+)', data: peakEventData.map(d => d.Urban), borderColor: '#dc3545', backgroundColor: '#dc3545', tension: 0.1, borderWidth: 3, pointRadius: 6, pointHoverRadius: 8 }
                    ]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false,
                    // Mobile optimizations
                    onResize: function(chart, size) {
                        // Adjust point and line sizes based on screen width
                        const datasets = chart.data.datasets;
                        const isMobile = size.width < 500;
                        
                        datasets.forEach(dataset => {
                            dataset.pointRadius = isMobile ? 4 : 6;
                            dataset.pointHoverRadius = isMobile ? 6 : 8;
                            dataset.borderWidth = isMobile ? 2 : 3;
                        });
                        
                        // Adjust legend display
                        chart.options.plugins.legend.display = size.width > 380;
                    },
                    plugins: {
                        zoom: {
                            limits: {
                                y: {min: 'original', max: 'original', minRange: 1}
                            },
                            pan: {
                                enabled: true,
                                mode: 'xy',
                                // Mobile-friendly pan settings
                                threshold: isMobileDevice() ? 5 : 10, // More sensitive for touch
                            },
                            zoom: {
                                wheel: {
                                    enabled: true,
                                },
                                pinch: {
                                    enabled: true
                                },
                                mode: 'xy',
                                drag: {
                                    enabled: true,
                                    threshold: isMobileDevice() ? 5 : 10, // More sensitive on mobile
                                    backgroundColor: 'rgba(0,106,179,0.1)', 
                                    borderColor: 'rgba(0,106,179,0.3)',
                                    borderWidth: 1
                                }
                            }
                        }
                    },
                    scales: { 
                        y: { 
                            title: { display: true, text: 'Change from 2025 Baseline (%)' }, 
                            ticks: { callback: function(value) { return value.toFixed(0) + '%'; } },
                            min: yMin,
                            max: yMax
                        },
                        x: {
                            ticks: {
                                autoSkip: false, 
                                maxRotation: 30,
                                minRotation: 0
                            }
                        }
                    }, 
                    plugins: { 
                        tooltip: { 
                            callbacks: { 
                                label: function(context) { return `${context.dataset.label}: ${context.raw.toFixed(1)}%`; }, 
                                title: function(context) { return `${context[0].label} (Peak)`; }
                            } 
                        },
                        title: {
                            display: true,
                            text: 'Peak Events: % Change from 2025',
                            font: {
                                size: 14
                            }
                        }
                    } 
                }
            });
            console.log("Peak Trend Chart initialized successfully.");
        } catch (error) {
            console.error("Error initializing Peak Trend Chart:", error);
        }
    }
===
    </search>
    <content>
===
    function initializeTrendChart(canvasElement) {
        console.log("Attempting to initialize Combined Trend Chart...");
        if (!canvasElement) {
            console.warn("initializeTrendChart: Received null canvas element.");
            canvasElement = document.getElementById('trendChart');
            if (!canvasElement) {
                console.error("Could not find trendChart canvas element");
                return;
            }
        }
        
        if (trendChartInstance && trendChartInstance.canvas === canvasElement) {
            console.log("Trend Chart instance already exists.");
            return;
        }
        if (trendChartInstance) { trendChartInstance.destroy(); trendChartInstance = null; }

        const trendCtx = canvasElement.getContext('2d');
        if (!trendCtx) {
            console.warn("initializeTrendChart: Failed to get 2D context.");
            return;
        }
        
        if (!window.trendData || window.trendData.length === 0) {
            console.warn("Trend summary data is not available or empty. Cannot initialize chart.");
            trendCtx.clearRect(0, 0, trendCtx.canvas.width, trendCtx.canvas.height);
            trendCtx.textAlign = 'center';
            trendCtx.fillText('Summary data not available', trendCtx.canvas.width / 2, trendCtx.canvas.height / 2);
            return;
        }

        console.log("Initializing Combined Trend Chart");

        try {
            // Prepare data - Transform the trend data into clearer format
            const transformedData = [];
            
            // Get unique categories (like "2-Year", "200-Year")
            const baseCategories = [...new Set(window.trendData.map(item => 
                item.category.replace(' Low Avg', '').replace(' Peak Avg', '')))];
                
            console.log("Base categories:", baseCategories);
            
            // For clarity, we'll create a full dataset where Low and Peak are distinguished
            baseCategories.forEach(category => {
                const lowItem = window.trendData.find(item => 
                    item.category.includes(category) && item.category.includes('Low'));
                    
                const peakItem = window.trendData.find(item => 
                    item.category.includes(category) && item.category.includes('Peak'));
                
                if (lowItem) {
                    transformedData.push({
                        category: category,
                        eventType: 'Low',
                        Baseline: lowItem.Baseline,
                        Replant: lowItem.Replant,
                        Urban: lowItem.Urban
                    });
                }
                
                if (peakItem) {
                    transformedData.push({
                        category: category,
                        eventType: 'Peak',
                        Baseline: peakItem.Baseline,
                        Replant: peakItem.Replant,
                        Urban: peakItem.Urban
                    });
                }
            });
            
            console.log("Transformed data:", transformedData);
            
            // Determine min/max for y-axis dynamically
            const allValues = transformedData.flatMap(d => [d.Baseline, d.Replant, d.Urban]);
            const dataMin = Math.min(0, ...allValues);
            const dataMax = Math.max(0, ...allValues);
            const yMin = Math.floor(dataMin - Math.abs(dataMin * 0.1));
            const yMax = Math.ceil(dataMax + Math.abs(dataMax * 0.1));

            // Add zoom controls
            const container = canvasElement.closest('.chart-container');
            if (container) {
                const zoomControls = document.createElement('div');
                zoomControls.className = 'zoom-controls';
                zoomControls.style.display = 'flex';
                zoomControls.style.justifyContent = 'center';
                zoomControls.style.alignItems = 'center';
                zoomControls.style.marginTop = '1rem';
                
                zoomControls.innerHTML = `
                    <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 0.5rem; font-size: 0.75rem; color: #666;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.3rem;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                        Drag to zoom, scroll to pan
                    </div>
                    <button id="resetZoomBtn" style="font-size: 0.75rem; background: #f0f0f0; border: 1px solid #ddd; padding: 0.25rem 0.5rem; border-radius: 3px; cursor: pointer; display: flex; align-items: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.3rem;"><path d="M3 2v6h6"></path><path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path><path d="M21 22v-6h-6"></path><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path></svg>
                        Reset Zoom
                    </button>
                `;
                
                container.appendChild(zoomControls);
                
                // Add click handler for reset button
                const resetBtn = container.querySelector('#resetZoomBtn');
                if (resetBtn) {
                    resetBtn.addEventListener('click', function() {
                        if (trendChartInstance && trendChartInstance.resetZoom) {
                            trendChartInstance.resetZoom();
                        }
                    });
                }
            }
            
            // Custom plugins for better visualization
            const backgroundColorPlugin = {
                id: 'backgroundColorPlugin',
                beforeDraw: (chart) => {
                    const ctx = chart.canvas.getContext('2d');
                    const dataset = chart.data.datasets[0];
                    const meta = chart.getDatasetMeta(0);
                    
                    // Don't draw if the chart is still animating
                    if (chart.options.animation && chart.animating) return;
                    
                    // Add subtle background highlight to differentiate low vs peak sections
                    const chartArea = chart.chartArea;
                    const xScale = chart.scales.x;
                    const barCount = chart.data.labels.length;
                    const barWidth = (chartArea.right - chartArea.left) / barCount;
                    
                    // Draw alternate light background for Peak events
                    chart.data.datasets[0].data.forEach((value, i) => {
                        if (transformedData[i].eventType === 'Peak') {
                            const x = xScale.getPixelForValue(i);
                            ctx.fillStyle = 'rgba(220, 53, 69, 0.05)';  // Very light red
                            ctx.fillRect(x - barWidth/2, chartArea.top, barWidth, chartArea.bottom - chartArea.top);
                        } else {
                            const x = xScale.getPixelForValue(i);
                            ctx.fillStyle = 'rgba(0, 86, 179, 0.05)';  // Very light blue
                            ctx.fillRect(x - barWidth/2, chartArea.top, barWidth, chartArea.bottom - chartArea.top);
                        }
                    });
                }
            };
            
            // Define datasets with visual differences between Low and Peak
            trendChartInstance = new Chart(trendCtx, {
                type: 'bar',
                data: {
                    labels: transformedData.map(d => `${d.category} ${d.eventType}`),
                    datasets: [
                        { 
                            label: '2050 Baseline', 
                            data: transformedData.map(d => d.Baseline), 
                            backgroundColor: transformedData.map(d => 
                                d.eventType === 'Low' ? 'rgba(253, 126, 20, 0.7)' : 'rgba(253, 126, 20, 0.9)'
                            ),
                            borderColor: '#fd7e14',
                            borderWidth: 1,
                            borderRadius: 4,
                            barPercentage: 0.8,
                            categoryPercentage: 0.8
                        },
                        { 
                            label: 'Replanting (2050+)', 
                            data: transformedData.map(d => d.Replant), 
                            backgroundColor: transformedData.map(d => 
                                d.eventType === 'Low' ? 'rgba(23, 162, 184, 0.7)' : 'rgba(23, 162, 184, 0.9)'
                            ),
                            borderColor: '#17a2b8',
                            borderWidth: 1,
                            borderRadius: 4,
                            barPercentage: 0.8,
                            categoryPercentage: 0.8
                        },
                        { 
                            label: 'Urban Development (2050+)', 
                            data: transformedData.map(d => d.Urban), 
                            backgroundColor: transformedData.map(d => 
                                d.eventType === 'Low' ? 'rgba(220, 53, 69, 0.7)' : 'rgba(220, 53, 69, 0.9)'
                            ),
                            borderColor: '#dc3545',
                            borderWidth: 1,
                            borderRadius: 4,
                            barPercentage: 0.8,
                            categoryPercentage: 0.8
                        }
                    ]
                },
                plugins: [backgroundColorPlugin],
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false,
                    // Mobile optimizations
                    onResize: function(chart, size) {
                        // Adjust sizes based on screen width
                        const datasets = chart.data.datasets;
                        const isMobile = size.width < 500;
                        
                        // Adjust legend display
                        chart.options.plugins.legend.display = size.width > 380;
                        
                        // Adjust font sizes
                        chart.options.plugins.title.font.size = isMobile ? 12 : 14;
                    },
                    plugins: {
                        zoom: {
                            limits: {
                                y: {min: 'original', max: 'original', minRange: 1}
                            },
                            pan: {
                                enabled: true,
                                mode: 'xy',
                                // Mobile-friendly pan settings
                                threshold: isMobileDevice() ? 5 : 10, // More sensitive for touch
                            },
                            zoom: {
                                wheel: {
                                    enabled: true,
                                },
                                pinch: {
                                    enabled: true
                                },
                                mode: 'xy',
                                drag: {
                                    enabled: true,
                                    threshold: isMobileDevice() ? 5 : 10, // More sensitive on mobile
                                    backgroundColor: 'rgba(0,106,179,0.1)', 
                                    borderColor: 'rgba(0,106,179,0.3)',
                                    borderWidth: 1
                                }
                            }
                        },
                        tooltip: { 
                            callbacks: { 
                                label: function(context) { 
                                    return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`; 
                                },
                                title: function(context) {
                                    const idx = context[0].dataIndex;
                                    const eventType = transformedData[idx].eventType;
                                    const category = transformedData[idx].category;
                                    return `${category} ${eventType} Event`;
                                }
                            },
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            titleColor: '#1e293b',
                            bodyColor: '#475569',
                            borderColor: 'rgba(0, 0, 0, 0.1)',
                            borderWidth: 1,
                            padding: {
                                x: 12,
                                y: 8
                            },
                            cornerRadius: 6,
                            displayColors: true,
                            boxWidth: 10,
                            boxHeight: 10,
                            boxPadding: 3,
                            usePointStyle: true
                        },
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: isMobileDevice() ? 12 : 20
                            }
                        },
                        title: {
                            display: false
                        },
                        annotation: {
                            annotations: {
                                lowLabel: {
                                    type: 'label',
                                    xValue: 0.5,
                                    yValue: yMax - 5,
                                    backgroundColor: 'rgba(0, 86, 179, 0.1)',
                                    content: ['Low Events'],
                                    font: {
                                        size: 12
                                    },
                                    color: '#0056b3'
                                },
                                peakLabel: {
                                    type: 'label',
                                    xValue: 2.5,
                                    yValue: yMax - 5,
                                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                                    content: ['Peak Events'],
                                    font: {
                                        size: 12
                                    },
                                    color: '#dc3545'
                                }
                            }
                        }
                    },
                    scales: { 
                        y: { 
                            title: { 
                                display: true, 
                                text: 'Change from 2025 Baseline (%)',
                                font: {
                                    weight: '600',
                                    size: isMobileDevice() ? 11 : 13
                                }
                            }, 
                            ticks: { 
                                callback: function(value) { return value.toFixed(0) + '%'; },
                                font: {
                                    size: isMobileDevice() ? 10 : 12
                                }
                            },
                            min: yMin,
                            max: yMax,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                                lineWidth: 1
                            }
                        },
                        x: {
                            ticks: {
                                autoSkip: false,
                                maxRotation: 45,
                                minRotation: 45,
                                font: {
                                    size: isMobileDevice() ? 9 : 11
                                },
                                color: (context) => {
                                    const idx = context.index;
                                    if (idx < transformedData.length) {
                                        return transformedData[idx].eventType === 'Low' 
                                            ? '#0056b3' // Blue for Low events
                                            : '#dc3545'; // Red for Peak events
                                    }
                                    return Chart.defaults.color;
                                }
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
            console.log("Combined Trend Chart initialized successfully.");
        } catch (error) {
            console.error("Error initializing Combined Trend Chart:", error);
        }
    }
===
    </content>
  </change>
  <change>
    <description>Update the key observations section to reflect the combined chart</description>
    <search>
===
          <ul>
            <li>When comparing <span class="font-semibold">Low Events</span> and <span class="font-semibold">Peak Events</span> separately, we see that both show significant increases under climate change (2050 baseline).</li>
            <li><span class="font-semibold" style="color: #17a2b8;">Replanting (2050+)</span> appears most effective at reducing both low and peak outflows during smaller events (2-year return periods).</li>
            <li><span class="font-semibold" style="color: #dc3545;">Urban development (2050+)</span> generally increases outflow across all event types when compared to the 2050 baseline.</li>
            <li>While percentage changes may differ between low and peak events (due to different baseline values), all future scenarios show substantially higher absolute outflow values than current conditions.</li>
          </ul>
===
    </search>
    <content>
===
          <ul>
            <li>The chart shows <span class="font-semibold">percentage change</span> from 2025 baseline. Notice that <span style="color: #0056b3; font-weight: 500;">Low Events</span> (in blue) often show larger percentage increases than <span style="color: #dc3545; font-weight: 500;">Peak Events</span> (in red).</li>
            <li>This percentage difference occurs because Low events start from smaller baseline values, even though Peak events typically have larger absolute increases in water volume.</li>
            <li><span class="font-semibold" style="color: #17a2b8;">Replanting (2050+)</span> shows some reduction compared to the 2050 baseline, particularly for 2-year events.</li>
            <li><span class="font-semibold" style="color: #dc3545;">Urban development (2050+)</span> consistently shows the highest outflow values across most scenarios.</li>
          </ul>
===
    </content>
  </change>
</file>
