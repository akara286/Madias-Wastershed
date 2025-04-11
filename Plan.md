<Plan>
Remove all "Source:" notes from the dashboard for a cleaner appearance
</Plan>

<file path="/Users/alikara/Desktop/508 website/index.html" action="modify">
  <change>
    <description>Remove source note from raw tab</description>
    <search>
===
      <div class="plot-description">
        The bar chart below shows the projected <b>maximum outflow</b> (peak water flow rate, in cubic meters per second) for Madias Creek, which flows through the ʔakisq̓nuk First Nation territory into Windermere Lake in southeastern British Columbia. Four modeling scenarios are compared:
        <ul>
          <li><b>Current (2020):</b> Current climate and land-use conditions in the Madias Creek watershed.</li>
          <li><b>2050 Baseline:</b> Year 2050 climate projection under baseline conditions (climate change only).</li>
          <li><b>Urban Development:</b> 2050 scenario with increased urban encroachment into floodplains (more impervious surfaces).</li>
          <li><b>Replanting:</b> 2050 scenario with ʔakisq̓nuk-led reforestation and wetland restoration projects.</li>
        </ul>
        Each scenario is evaluated for both <b>2-year</b> (common) and <b>200-year</b> (rare) return period events, under both <i>low-impact</i> and <i>high-impact</i> (peak) climate cases. Note the significant increase in flow rate for extreme events.
      </div>
      
      <p class="data-source-note">Source: Summary values representing multiple return periods</p>
===
    </search>
    <content>
===
      <div class="plot-description">
        The bar chart below shows the projected <b>maximum outflow</b> (peak water flow rate, in cubic meters per second) for Madias Creek, which flows through the ʔakisq̓nuk First Nation territory into Windermere Lake in southeastern British Columbia. Four modeling scenarios are compared:
        <ul>
          <li><b>Current (2020):</b> Current climate and land-use conditions in the Madias Creek watershed.</li>
          <li><b>2050 Baseline:</b> Year 2050 climate projection under baseline conditions (climate change only).</li>
          <li><b>Urban Development:</b> 2050 scenario with increased urban encroachment into floodplains (more impervious surfaces).</li>
          <li><b>Replanting:</b> 2050 scenario with ʔakisq̓nuk-led reforestation and wetland restoration projects.</li>
        </ul>
        Each scenario is evaluated for both <b>2-year</b> (common) and <b>200-year</b> (rare) return period events, under both <i>low-impact</i> and <i>high-impact</i> (peak) climate cases. Note the significant increase in flow rate for extreme events.
      </div>
===
    </content>
  </change>
  
  <change>
    <description>Remove source note from percentage tab</description>
    <search>
===
        These patterns align with the Regional District of East Kootenay (RDEK) flood management objectives and the BC Flood Strategy (2023).
      </div>
      
      <p class="data-source-note">Source: Calculated from summary values representing multiple return periods</p>
===
    </search>
    <content>
===
        These patterns align with the Regional District of East Kootenay (RDEK) flood management objectives and the BC Flood Strategy (2023).
      </div>
===
    </content>
  </change>
  
  <change>
    <description>Remove source note from trends tab</description>
    <search>
===
        This analysis supports ʔakisq̓nuk First Nation's focus on both mitigation (replanting) and adaptation (improved culverts at Highway 93/95) strategies, as identified in the watershed's vulnerability assessment.
      </div>
      
      <p class="data-source-note">Source: Calculated from summary values representing multiple return periods</p>
===
    </search>
    <content>
===
        This analysis supports ʔakisq̓nuk First Nation's focus on both mitigation (replanting) and adaptation (improved culverts at Highway 93/95) strategies, as identified in the watershed's vulnerability assessment.
      </div>
===
    </content>
  </change>
  
  <change>
    <description>Remove source note from distribution tab</description>
    <search>
===
        The box plots show statistical distributions of outflow values, with each scenario's spread representing model uncertainty. The Current scenario shows the narrowest range, while future projections show wider spreads due to climate uncertainty. This analysis helps ʔakisq̓nuk First Nation and RDEK planners understand not just average effects but the full range of possible outcomes for flood management decisions.
      </div>
      
      <p class="data-source-note">Source: Full 100 samples from the uncertainty model runs</p>
===
    </search>
    <content>
===
        The box plots show statistical distributions of outflow values, with each scenario's spread representing model uncertainty. The Current scenario shows the narrowest range, while future projections show wider spreads due to climate uncertainty. This analysis helps ʔakisq̓nuk First Nation and RDEK planners understand not just average effects but the full range of possible outcomes for flood management decisions.
      </div>
===
    </content>
  </change>
  
  <change>
    <description>Remove data-source-note CSS class since it's no longer used</description>
    <search>
===
    /* Data source note styling (from 2nd file) */
    .data-source-note {
      font-size: 0.9em;
      color: var(--text-secondary);
      margin-top: -0.5rem;
      margin-bottom: 1.5rem;
      font-style: italic;
      font-weight: 500;
      background-color: #fffadf;
      padding: 0.3rem 0.75rem;
      border-radius: 3px;
      display: inline-block;
    }
===
    </search>
    <content>
===
    /* Data source note styling removed */
===
    </content>
  </change>
</file>
