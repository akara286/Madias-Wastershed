<Plan>
1.  **Modify `index.html`:**
    *   **Update `getDistributionYAxisRange` function:** Modify this helper function (within the `<script type="text/babel">` block) to accept a third argument, `dataType` ('low' or 'peak'). It will now calculate the min/max range based only on the data relevant to that specific type (low or peak) for the selected `yearGroup`. It will find the min/max across the 'current', 'baseline', 'replant', and 'urban' arrays within the specified sheet data (e.g., only `2yr max outflow - low` data for the low chart). Padding will be added to this specific range.
    *   **Update `DistributionAnalysisComponent`:**
        *   Inside the `useMemo` hook, call the modified `getDistributionYAxisRange` twice: once for 'low' (`yAxisRangeLow = getDistributionYAxisRange(selectedYearGroup, initialData, 'low')`) and once for 'peak' (`yAxisRangePeak = getDistributionYAxisRange(selectedYearGroup, initialData, 'peak')`).
        *   In the JSX for the "Low Events" chart, pass `domain={yAxisRangeLow}` to the `<YAxis>`.
        *   In the JSX for the "Peak Events" chart, pass `domain={yAxisRangePeak}` to the `<YAxis>`.
</Plan>

<file path="/Users/alikara/Desktop/508 website/index.html" action="modify">
  <change>
    <description>Modify getDistributionYAxisRange to calculate range per data type (low/peak).</description>
    <search>
===
        return { min, max, q1, median, q3, avg };
    };

    const getDistributionYAxisRange = (yearGroup, allData) => {
        // Calculate range dynamically based on actual data min/max across both low/peak for the selected year group
        const lowKey = yearGroup === '2yr' ? "2yr max outflow - low" : "200yr max outflow - low";
        const peakKey = yearGroup === '2yr' ? "2yr max outflow - peak" : "200yr max outflow - peak";
        
        let overallMin = Infinity;
        let overallMax = -Infinity;

        const updateMinMax = (dataArray) => {
             if (dataArray && dataArray.length > 0) {
                const numericData = dataArray.map(Number).filter(n => !isNaN(n));
                if (numericData.length > 0) {
                    overallMin = Math.min(overallMin, ...numericData);
                    overallMax = Math.max(overallMax, ...numericData);
                }
            }
        };

        if (allData && allData[lowKey]) {
            updateMinMax(allData[lowKey].current);
            updateMinMax(allData[lowKey].baseline);
            updateMinMax(allData[lowKey].replant);
            updateMinMax(allData[lowKey].urban);
        }
         if (allData && allData[peakKey]) {
            updateMinMax(allData[peakKey].current);
            updateMinMax(allData[peakKey].baseline);
            updateMinMax(allData[peakKey].replant);
            updateMinMax(allData[peakKey].urban);
        }

        if (overallMin === Infinity || overallMax === -Infinity) {
            // Fallback if no data found
            return yearGroup === '2yr' ? [1.0, 2.6] : [7.0, 24.0];
        }

        // Add some padding
        const padding = (overallMax - overallMin) * 0.1; // 10% padding
        const domainMin = Math.max(0, Math.floor(overallMin - padding)); // Ensure min is not negative unless data is
        const domainMax = Math.ceil(overallMax + padding);

        // console.log(`Calculated Y-axis range for ${yearGroup}: [${domainMin}, ${domainMax}]`);
        return [domainMin, domainMax];
    };

    // Update function signature to accept data as argument
    const generateAreaDistributionData = (yearGroup, boxPlotData) => { 
===
    </content>
    <content>
===
        return { min, max, q1, median, q3, avg };
    };

    // Calculate Y-axis range dynamically for EITHER low OR peak data
    const getDistributionYAxisRange = (yearGroup, allData, dataType) => { // Added dataType ('low' or 'peak')
        const targetKey = yearGroup === '2yr' 
            ? (dataType === 'low' ? "2yr max outflow - low" : "2yr max outflow - peak")
            : (dataType === 'low' ? "200yr max outflow - low" : "200yr max outflow - peak");

        let overallMin = Infinity;
        let overallMax = -Infinity;

        const updateMinMax = (dataArray) => {
             if (dataArray && dataArray.length > 0) {
                const numericData = dataArray.map(Number).filter(n => !isNaN(n));
                if (numericData.length > 0) {
                    // Use Math.min/max directly on the array elements
                    const currentMin = Math.min(...numericData);
                    const currentMax = Math.max(...numericData);
                    overallMin = Math.min(overallMin, currentMin);
                    overallMax = Math.max(overallMax, currentMax);
                }
            }
        };

        // Only process the relevant sheet data (low or peak)
        if (allData && allData[targetKey]) {
            updateMinMax(allData[targetKey].current);
            updateMinMax(allData[targetKey].baseline);
            updateMinMax(allData[targetKey].replant);
            updateMinMax(allData[targetKey].urban);
             console.log(`Range calculation for ${targetKey}: Min=${overallMin}, Max=${overallMax}`);
        } else {
             console.warn(`Data not found for key ${targetKey} during range calculation.`);
        }


        if (overallMin === Infinity || overallMax === -Infinity || isNaN(overallMin) || isNaN(overallMax)) {
            // Fallback if no valid data found
             console.warn(`Could not determine valid min/max for ${targetKey}. Using fallback range.`);
            return yearGroup === '2yr' 
                   ? (dataType === 'low' ? [1.0, 1.5] : [2.0, 2.6]) // Tighter fallbacks
                   : (dataType === 'low' ? [7.0, 12.0] : [15.0, 24.0]); // Tighter fallbacks
        }

        // Add some padding (e.g., 15% of the range)
        const range = overallMax - overallMin;
        // Handle case where min and max are the same
        const padding = range === 0 ? overallMax * 0.15 || 0.1 : range * 0.15; 
        
        // Ensure minimum is not negative unless data actually goes below zero
        let domainMin = overallMin - padding;
        if (overallMin >= 0) {
             domainMin = Math.max(0, domainMin); // Cap at 0 if all data is non-negative
        }
        let domainMax = overallMax + padding;

        // Round appropriately for display (e.g., to one decimal place)
        domainMin = Math.floor(domainMin * 10) / 10; 
        domainMax = Math.ceil(domainMax * 10) / 10; 

        // Ensure min is strictly less than max
        if (domainMin >= domainMax) {
             domainMax = domainMin + 0.1; // Add a small amount if they ended up equal
        }

        console.log(`Calculated Y-axis range for ${targetKey}: [${domainMin}, ${domainMax}]`);
        return [domainMin, domainMax];
    };

    // Update function signature to accept data as argument
    const generateAreaDistributionData = (yearGroup, boxPlotData) => { 
===
    </content>
  </change>
  <change>
    <description>Calculate and use separate Y-axis ranges for low and peak charts in React component.</description>
    <search>
===
        const [chartHover, setChartHover] = useState(null); // Optional hover state
        
        // Memoize data generation and axis range calculation
        const { areaDistributionData, yAxisRange, isDataReady } = useMemo(() => {
            const lowKey = selectedYearGroup === '2yr' ? "2yr max outflow - low" : "200yr max outflow - low";
            const peakKey = selectedYearGroup === '2yr' ? "2yr max outflow - peak" : "200yr max outflow - peak";
            
            // More robust check: ensure the keys exist and the arrays within have length > 0
            const dataAvailable = initialData && 
                                initialData[lowKey] && 
                                initialData[peakKey] &&
                                Array.isArray(initialData[lowKey].current) && initialData[lowKey].current.length > 0 &&
                                Array.isArray(initialData[lowKey].baseline) && initialData[lowKey].baseline.length > 0 &&
                                Array.isArray(initialData[lowKey].replant) && initialData[lowKey].replant.length > 0 &&
                                Array.isArray(initialData[lowKey].urban) && initialData[lowKey].urban.length > 0 &&
                                Array.isArray(initialData[peakKey].current) && initialData[peakKey].current.length > 0 &&
                                Array.isArray(initialData[peakKey].baseline) && initialData[peakKey].baseline.length > 0 &&
                                Array.isArray(initialData[peakKey].replant) && initialData[peakKey].replant.length > 0 &&
                                Array.isArray(initialData[peakKey].urban) && initialData[peakKey].urban.length > 0;

            if (!dataAvailable) {
                 console.warn(`Distribution data for keys '${lowKey}' or '${peakKey}' is not ready or incomplete in initialData.`);
                 return { areaDistributionData: [{ group: "Low", data: [] }, { group: "Peak", data: [] }], yAxisRange: [0, 1], isDataReady: false };
            }

            console.log(`Distribution data for keys '${lowKey}' and '${peakKey}' appears ready. Generating chart data.`);
            const generatedData = generateAreaDistributionData(selectedYearGroup, initialData);
            const range = getDistributionYAxisRange(selectedYearGroup, initialData); // Pass initialData for dynamic range
            return { areaDistributionData: generatedData, yAxisRange: range, isDataReady: true };

        }, [selectedYearGroup, initialData]); // Recalculate only when these change

        const DistributionTooltip = ({ active, payload, label }) => {
===
    </content>
    <content>
===
        const [chartHover, setChartHover] = useState(null); // Optional hover state
        
        // Memoize data generation and axis range calculation
        const { areaDistributionData, yAxisRangeLow, yAxisRangePeak, isDataReady } = useMemo(() => {
            const lowKey = selectedYearGroup === '2yr' ? "2yr max outflow - low" : "200yr max outflow - low";
            const peakKey = selectedYearGroup === '2yr' ? "2yr max outflow - peak" : "200yr max outflow - peak";
            
            // More robust check: ensure the keys exist and the arrays within have length > 0
            const dataAvailable = initialData && 
                                initialData[lowKey] && 
                                initialData[peakKey] &&
                                Array.isArray(initialData[lowKey].current) && initialData[lowKey].current.length > 0 &&
                                Array.isArray(initialData[lowKey].baseline) && initialData[lowKey].baseline.length > 0 &&
                                Array.isArray(initialData[lowKey].replant) && initialData[lowKey].replant.length > 0 &&
                                Array.isArray(initialData[lowKey].urban) && initialData[lowKey].urban.length > 0 &&
                                Array.isArray(initialData[peakKey].current) && initialData[peakKey].current.length > 0 &&
                                Array.isArray(initialData[peakKey].baseline) && initialData[peakKey].baseline.length > 0 &&
                                Array.isArray(initialData[peakKey].replant) && initialData[peakKey].replant.length > 0 &&
                                Array.isArray(initialData[peakKey].urban) && initialData[peakKey].urban.length > 0;

            if (!dataAvailable) {
                 console.warn(`Distribution data for keys '${lowKey}' or '${peakKey}' is not ready or incomplete in initialData.`);
                 // Provide default ranges even when data is not ready
                 const defaultRangeLow = getDistributionYAxisRange(selectedYearGroup, null, 'low');
                 const defaultRangePeak = getDistributionYAxisRange(selectedYearGroup, null, 'peak');
                 return { 
                     areaDistributionData: [{ group: "Low", data: [] }, { group: "Peak", data: [] }], 
                     yAxisRangeLow: defaultRangeLow, 
                     yAxisRangePeak: defaultRangePeak, 
                     isDataReady: false 
                 };
            }

            console.log(`Distribution data for keys '${lowKey}' and '${peakKey}' appears ready. Generating chart data.`);
            const generatedData = generateAreaDistributionData(selectedYearGroup, initialData);
            // Calculate separate ranges for low and peak
            const rangeLow = getDistributionYAxisRange(selectedYearGroup, initialData, 'low'); 
            const rangePeak = getDistributionYAxisRange(selectedYearGroup, initialData, 'peak'); 
            return { 
                areaDistributionData: generatedData, 
                yAxisRangeLow: rangeLow, 
                yAxisRangePeak: rangePeak, 
                isDataReady: true 
            };

        }, [selectedYearGroup, initialData]); // Recalculate only when these change

        const DistributionTooltip = ({ active, payload, label }) => {
===
    </content>
  </change>
  <change>
    <description>Apply yAxisRangeLow to the Low Events chart YAxis.</description>
    <search>
===
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                                    <YAxis 
                                        domain={yAxisRange}
                                        label={{ value: `Max Outflow (cms)`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 }, dx:-15 }} // Adjusted dx
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(val) => val.toFixed(1)}
                                        allowDataOverflow={true} // Prevent clipping of area/line near boundaries
                                        width={40} // Explicit width for YAxis
                                    />
                                    <Tooltip content={<DistributionTooltip />} wrapperStyle={{ zIndex: 1100 }} />
                                    
                                    {/* Area for Q1-Q3 Range */}
===
    </content>
    <content>
===
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                                    <YAxis 
                                        domain={yAxisRangeLow} {/* Use specific range for Low */}
                                        label={{ value: `Max Outflow (cms)`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 }, dx:-15 }} // Adjusted dx
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(val) => val.toFixed(1)}
                                        allowDataOverflow={true} // Prevent clipping of area/line near boundaries
                                        width={40} // Explicit width for YAxis
                                    />
                                    <Tooltip content={<DistributionTooltip />} wrapperStyle={{ zIndex: 1100 }} />
                                    
                                    {/* Area for Q1-Q3 Range */}
===
    </content>
  </change>
  <change>
    <description>Apply yAxisRangePeak to the Peak Events chart YAxis.</description>
    <search>
===
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                                    <YAxis 
                                        domain={yAxisRange}
                                        label={{ value: `Max Outflow (cms)`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 }, dx:-15 }} // Adjusted dx
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(val) => val.toFixed(1)}
                                        allowDataOverflow={true} // Prevent clipping
                                        width={40} // Explicit width
                                    />
                                     <Tooltip content={<DistributionTooltip />} wrapperStyle={{ zIndex: 1100 }} />
                                    
                                    {/* Area for Q1-Q3 Range */}
===
    </content>
    <content>
===
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                                    <YAxis 
                                        domain={yAxisRangePeak} {/* Use specific range for Peak */}
                                        label={{ value: `Max Outflow (cms)`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 }, dx:-15 }} // Adjusted dx
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(val) => val.toFixed(1)}
                                        allowDataOverflow={true} // Prevent clipping
                                        width={40} // Explicit width
                                    />
                                     <Tooltip content={<DistributionTooltip />} wrapperStyle={{ zIndex: 1100 }} />
                                    
                                    {/* Area for Q1-Q3 Range */}
===
    </content>
  </change>
</file>
