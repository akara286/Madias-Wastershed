<Plan>
The user has provided the correct sheet names from their Excel file. The previous warnings ("No matching sheet found") confirm that the code was looking for different names.

1.  **Update Sheet Names in `loadExcelData`:** Modify the `loadExcelData` function in `index.html` to use the exact sheet names provided (`2yr max outflow - low`, `2yr max outflow - peak`, `200yr max outflow - low`, `200yr max outflow - peak`) when reading data for the `boxPlotData` object.
2.  **Update Keys in React Component:** Modify the `generateAreaDistributionData` function (within the `<script type="text/babel">` block) to use these same correct names as keys when accessing `window.boxPlotData`.
3.  **Update Data Check in React Component:** Modify the `useEffect` hook and the initial data check within the React component to look for the correct keys (`2yr max outflow - low`, etc.) in `window.boxPlotData` to determine if the data is ready.
</Plan>

<file path="/Users/alikara/Desktop/508 website/index.html" action="modify">
  <change>
    <description>Use correct sheet names when loading box plot data in loadExcelData.</description>
    <search>
===
            window.rawOutflowData = safeSheetToJson("RawData");
            window.percentageChangeData = safeSheetToJson("PercentageData");
            window.boxPlotData = {
                "2yr-low": safeSheetToJson("2yr-low"),
                "2yr-peak": safeSheetToJson("2yr-peak"),
                "200yr-low": safeSheetToJson("200yr-low"),
                "200yr-peak": safeSheetToJson("200yr-peak")
            };

            // Process trendData only if rawOutflowData is valid
===
    </search>
    <content>
===
            window.rawOutflowData = safeSheetToJson("RawData");
            window.percentageChangeData = safeSheetToJson("PercentageData");
            
            // Use the correct sheet names provided by the user
            const boxPlotSheetNames = {
                low2yr: "2yr max outflow - low",
                peak2yr: "2yr max outflow - peak",
                low200yr: "200yr max outflow - low",
                peak200yr: "200yr max outflow - peak"
            };
            window.boxPlotData = {
                [boxPlotSheetNames.low2yr]: safeSheetToJson(boxPlotSheetNames.low2yr),
                [boxPlotSheetNames.peak2yr]: safeSheetToJson(boxPlotSheetNames.peak2yr),
                [boxPlotSheetNames.low200yr]: safeSheetToJson(boxPlotSheetNames.low200yr),
                [boxPlotSheetNames.peak200yr]: safeSheetToJson(boxPlotSheetNames.peak200yr)
            };
            console.log("Box plot data loaded with keys:", Object.keys(window.boxPlotData));


            // Process trendData only if rawOutflowData is valid
===
    </content>
  </change>
  <change>
    <description>Use correct keys when accessing box plot data in generateAreaDistributionData.</description>
    <search>
===
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
===
    </search>
    <content>
===
    };

    const generateAreaDistributionData = (yearGroup) => {
        // Map yearGroup to the correct sheet names/keys
        const lowKey = yearGroup === '2yr' ? "2yr max outflow - low" : "200yr max outflow - low";
        const peakKey = yearGroup === '2yr' ? "2yr max outflow - peak" : "200yr max outflow - peak";
        
        // Check if boxPlotData and the required keys exist
        if (!window.boxPlotData || !window.boxPlotData[lowKey] || !window.boxPlotData[peakKey]) {
            console.warn(`Box plot data for keys '${lowKey}' or '${peakKey}' not found in window.boxPlotData.`);
            // Return empty structure to prevent errors
             return [
                { group: "Low", data: [] },
                { group: "Peak", data: [] }
            ];
        }

        // Access data using the correct keys
        const lowData = window.boxPlotData[lowKey];
        const peakData = window.boxPlotData[peakKey];

        // Check if the data itself has the expected structure (e.g., 'current' property)
         if (!lowData || !peakData || typeof lowData !== 'object' || typeof peakData !== 'object') {
             console.warn(`Data structure invalid for keys '${lowKey}' or '${peakKey}'.`);
             return [ { group: "Low", data: [] }, { group: "Peak", data: [] } ];
         }


        const lowStats = {
            current: calculateStats(lowData?.current || []),
            baseline: calculateStats(lowData?.baseline || []),
            replant: calculateStats(lowData?.replant || []),
            urban: calculateStats(lowData?.urban || [])
        };
        
        const peakStats = {
            current: calculateStats(peakData?.current || []),
            baseline: calculateStats(peakData?.baseline || []),
            replant: calculateStats(peakData?.replant || []),
            urban: calculateStats(peakData?.urban || [])
        };
===
    </content>
  </change>
  <change>
    <description>Update React component useEffect and initial check to use correct sheet names/keys.</description>
    <search>
===
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
             // Check which specific sheets might be missing based on the selected group
             const missingSheets = [];
             const lowKey = `${selectedYearGroup}-low`;
             const peakKey = `${selectedYearGroup}-peak`;
             if (!window.boxPlotData || !window.boxPlotData[lowKey]) missingSheets.push(lowKey);
             if (!window.boxPlotData || !window.boxPlotData[peakKey]) missingSheets.push(peakKey);

             let message = `Loading data or data unavailable for the ${selectedYearGroup === '2yr' ? '2-Year' : '200-Year'} period...`;
             if (missingSheets.length > 0) {
                 message = `Data unavailable. Please ensure the 'uncertainty.xlsx' file contains the following sheets: ${missingSheets.join(', ')}.`;
             }

             return (
                <div>
===
    </search>
    <content>
===
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
===
    </content>
  </change>
</file>
