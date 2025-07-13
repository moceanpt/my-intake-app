# Clinical Reference Charts & Scoring Bands

This page summarizes the clinical reference values, scoring bands, and color logic used for all objective health tests in this app. Use this as a single source of truth for clinicians, staff, and developers.

---

## InBody Reference Ranges

### Hydration % (Total Body Water / Weight)
| Category                | Men         | Women       |
|-------------------------|-------------|-------------|
| Severely Dehydrated     | < 50%       | < 40%       |
| Moderately Dehydrated   | 50–52%      | 40–41%      |
| Low-Normal              | 52–58%      | 41–48%      |
| Normal/Optimal          | 58–66%      | 48–60%      |
| High-Well Hydrated      | > 66%       | > 60%       |

### Body Fat % (BIA, Adults)
#### Men
| Age   | Low | Excellent | Good | Fair | Poor | Dangerously High |
|-------|-----|-----------|------|------|------|-----------------|
| 20–29 | <8  | 8–10.5    |10.6–14.8|14.9–18.6|18.7–23.1|>23.2 |
| 30–39 | <8  | 8–14.5    |14.6–18.2|18.3–21.3|21.4–24.9|>25   |
| 40–49 | <8  | 8–17.4    |17.5–20.6|20.7–23.4|23.5–26.6|>26.7 |
| 50–59 | <8  | 8–19.1    |19.2–22.1|22.2–24.6|24.7–27.8|>27.9 |
| 60–69 | <8  | 8–19.7    |19.8–22.6|22.7–25.2|25.3–28.4|>28.5 |

#### Women
| Age   | Low | Excellent | Good | Fair | Poor | Dangerously High |
|-------|-----|-----------|------|------|------|-----------------|
| 20–29 | <14 |14–16.5    |16.6–19.4|19.5–22.7|22.8–27.1|>27.2 |
| 30–39 | <14 |14–17.4    |17.5–20.8|20.9–24.6|24.7–29.1|>29.2 |
| 40–49 | <14 |14–19.8    |19.9–23.8|23.9–27.6|27.7–31.9|>31.9 |
| 50–59 | <14 |14–22.5    |22.6–27  |27.1–30.4|30.5–34.5|>34.6 |
| 60–69 | <14 |14–23.2    |23.3–27.9|28–31.3  |31.4–35.4|>35.5 |

### Visceral Fat Area (cm²)
| Category         | VFA (cm²) |
|------------------|-----------|
| Optimal          | < 100     |
| Elevated Risk    | 100–130   |
| High             | 130–150   |
| Very High/Warning| > 150     |

### ECW/TBW Ratio
| Category         | Ratio         |
|------------------|--------------|
| Optimal (Ideal)  | <0.365–0.380  |
| Acceptable       | 0.381–0.390   |
| Caution          | 0.391–0.400   |
| Low/Recovery     | ≥0.401        |

### SMM % (Skeletal Muscle Mass / Weight)

#### Men
| Age (y) | Green ✓ Healthy | Yellow • Acceptable | Orange ! Caution | Red ✗ Low |
|---------|-----------------|---------------------|------------------|-----------|
| 18–35   | ≥ 40 %          | 37–39.9 %           | 34–36.9 %        | < 34 %    |
| 36–55   | ≥ 36 %          | 33–35.9 %           | 30–32.9 %        | < 30 %    |
| 56–75   | ≥ 32 %          | 29–31.9 %           | 26–28.9 %        | < 26 %    |
| 76+     | ≥ 31 %          | 27–30.9 %           | 24–26.9 %        | < 24 %    |

#### Women
| Age (y) | Green ✓ Healthy | Yellow • Acceptable | Orange ! Caution | Red ✗ Low |
|---------|-----------------|---------------------|------------------|-----------|
| 18–35   | ≥ 31 %          | 28–30.9 %           | 26–27.9 %        | < 26 %    |
| 36–55   | ≥ 29 %          | 26–28.9 %           | 24–25.9 %        | < 24 %    |
| 56–75   | ≥ 27 %          | 24–26.9 %           | 22–23.9 %        | < 22 %    |
| 76+     | ≥ 26 %          | 23–25.9 %           | 20–22.9 %        | < 20 %    |

*Note: >48% (men) and >38% (women) is flagged as “Athletic” rather than downgraded.*

### Phase Angle (PhA) – Men
| Age   | Healthy | Acceptable | Caution | Low/Recovery |
|-------|---------|------------|---------|--------------|
|18–29  | ≥6.8°   |6.2–6.7°    |5.4–6.1° |<5.4°         |
|30–39  | ≥6.6°   |6.0–6.5°    |5.2–5.9° |<5.2°         |
|40–49  | ≥6.4°   |5.8–6.3°    |5.0–5.7° |<5.0°         |
|50–59  | ≥6.0°   |5.4–5.9°    |4.7–5.3° |<4.7°         |
|60–69  | ≥5.6°   |5.0–5.5°    |4.3–4.9° |<4.3°         |
|70–79  | ≥5.2°   |4.6–5.1°    |3.9–4.5° |<3.9°         |
|80+    | ≥4.8°   |4.2–4.7°    |3.5–4.1° |<3.5°         |

### Phase Angle (PhA) – Women
| Age   | Healthy | Acceptable | Caution | Low/Recovery |
|-------|---------|------------|---------|--------------|
|18–29  | ≥6.2°   |5.6–6.1°    |4.8–5.5° |<4.8°         |
|30–39  | ≥6.0°   |5.4–5.9°    |4.6–5.3° |<4.6°         |
|40–49  | ≥5.8°   |5.2–5.7°    |4.4–5.1° |<4.4°         |
|50–59  | ≥5.4°   |4.8–5.3°    |4.0–4.7° |<4.0°         |
|60–69  | ≥5.0°   |4.4–4.9°    |3.6–4.3° |<3.6°         |
|70–79  | ≥4.6°   |4.0–4.5°    |3.2–3.9° |<3.2°         |
|80+    | ≥4.2°   |3.6–4.1°    |2.9–3.5° |<2.9°         |

---

## Musculoskeletal Scoring Systems

### 1. Subjective Musculoskeletal (Health Check Questions)
**Source:** Patient-reported symptoms and discomfort from health check questions
**Scoring:** Based on symptom frequency and severity from lifestyle and health questionnaires
**Radar Spoke:** `musculoskeletal_subjective`

### 2. Objective Musculoskeletal (ExBody Device)
**Source:** ExBody posture and musculoskeletal analysis device measurements
**Scoring:** Evidence-based metrics with clinical reference ranges
**Radar Spoke:** `musculoskeletal_objective`

---

## ExBody MSK-Health Scoring (Objective)
| Metric                        | Green (Optimal) | Yellow (Mild) | Orange (Moderate) | Red (High Risk) | Max pts | Notes |
|-------------------------------|-----------------|---------------|-------------------|-----------------|---------|-------|
| Loss of Height (in)           | ≤0.5            | 0.6–1.0       | 1.1–2.0           | >2.0 (8 pts)    | 8       | ≥0.5 in ↑ vertebral fx risk |
| Misalignment Deviation (0–51) | 0–10            | 11–20         | 21–40             | 41+             | 51      | Color bands: green/yellow/orange/red |
| Imbalance Deviation (0–51)    | 0–10            | 11–20         | 21–40             | 41+             | 51      | Color bands: green/yellow/orange/red |
| Musculoskeletal Index         | 0–10            | 11–20         | 21–40             | 41+             | 102     | Sum of misalignment + imbalance deviation; same color bands |
| Shoulder Inclination (deg)    | ≤1              | 1.1–3         | 3.1–5             | >5              | 6       | >10mm ↑ RC risk |
| Shoulder Inclination (mm)     | ≤5              | 6–10          | 11–20             | >20             | 6       |  |
| Forward Head Posture (deg)    | ≤15             | 16–20         | 21–30             | >30             | 6       | >15–20° ↑ neck pain |
| FHP translation (mm)          | +1/5mm >15mm    |               |                   | cap 6           | 6       |  |
| PCMT (lb)                     | ≤2              | 2.1–4.0       | 4.1–6.0           | >6              | 6       | Normative data |
| Pelvic Tilt (deg)             | –4 to +10       | 11–15         | 16–20             | >20             | 6       | Mean APT ≈ 13° ± 6° |
| Pelvic height diff (mm)       | +1/5mm >10mm    |               |                   | cap 6           | 6       |  |
| Knee Flex/Hyperext (deg)      | –5 to +5        | 6–10          | 11–15             | >15             | 6       | >10° ↑ PF-pain risk |

### MSK_Health_Score Formula
`MSK_Health_Score = 100 – (total_pts × 100 / 78)`

**Total MSK-Health Score Reference Ranges:**
- 80–100: Green (Optimal)
- 60–79: Yellow (Moderate imbalance)
- 40–59: Orange (High-risk imbalance)
- <40: Red (Critical – immediate attention)

**Color Banding for Misalignment, Imbalance, and MSK Index:**
- 0–10: Green (Optimal)
- 11–20: Yellow (Mild)
- 21–40: Orange (Moderate)
- 41+: Red (High Risk)

**Note:** Musculoskeletal Index is now the sum of misalignment + imbalance deviation, and uses the same color bands. Ant. tibial shear (mm) is no longer measured or scored.

---
## OmniFit Reference Ranges (PPG)

### Heart-Rate-Variability Index (HRV-Index, unitless)
| Category | HRV-Index Score |
|----------|-----------------|
| Danger   | < 5.0           |
| Warning  | 5.0 – 5.9       |
| Normal   | 6.0 – 9.9       |
| Good     | 10.0 – 12.9     |
| Very Good| ≥ 13.0          |

### Stress Level (0 – 100)
| Category   | Score |
|------------|-------|
| Very Low   | < 20  |
| Low        | 20–39 |
| Average    | 40–59 |
| High       | 60–79 |
| Very High  | ≥ 80  |

### ANS Health Score (0 – 10)
| Category   | Score |
|------------|-------|
| Danger     | < 3   |
| Warning    | 3–4.9 |
| Normal     | 5–6.9 |
| Good       | 7–8.9 |
| Very Good  | ≥ 9   |

### ANS Age (Delta vs. Chronological Age)
| Category   | Delta (yrs) |
|------------|-------------|
| Excellent  | ≤ –10       |
| Good       | –9 … –5     |
| Normal     | –4 … +4     |
| Warning    | +5 … +9     |
| Danger     | ≥ +10       |

### Low-Frequency Power (LF, log ms²)
| Category   | log LF |
|------------|--------|
| Very Low   | < 2.0  |
| Low        | 2.0–3.58|
| Normal     | 3.59–5.99|
| High       | 6.0–9.99|
| Very High  | ≥ 10   |

### High-Frequency Power (HF, log ms²)
| Category   | log HF |
|------------|--------|
| Very Low   | < 2.0  |
| Low        | 2.0–3.99|
| Normal     | 4.00–5.99|
| High       | 6.0–9.99|
| Very High  | ≥ 10   |

---

## OmniFit Reference Ranges (EEG)

### Evidence-Based Reference Chart

| Metric                                              | Green (Optimal)   | Yellow (Mild)   | Orange (Moderate) | Red (High Risk)   | Max pts | Notes                                                        |
|-----------------------------------------------------|-------------------|-----------------|-------------------|-------------------|---------|--------------------------------------------------------------|
| Overall Brain-Function Score (0–100)                | ≥ 80              | 60–79           | 40–59             | < 40              | 8       | Device bar turns red < 40; ≥ 70 called “good brain condition”|
| Mental Stress Level (0–10)                          | < 3               | 3–5             | 5.1–7             | ≥ 7.1             | 8       | Five-band legend: Very-low < 3 … Very-high ≥ 9               |
| Intrinsic EEG Performance Factor (Peak α-freq, Hz)  | ≥ 9.0             | 8.0–8.9         | 7.0–7.9           | < 7.0             | 8       | “9 Hz above = higher, the better” (vendor PDF)               |
| Brain Work-Load Index (dominant β burst, Hz)        | 15–19.5           | 12–14.9 or      | 25–29.9           | < 12 or ≥ 30      | 8       | Vendor avg SEF-90 ≈ 11.7–19.5 Hz; sample 28.3 Hz marked high |
|                                                     |                   | 19.6–24.9       |                   |                   |         |                                                              |

### EEG Scoring Formula
`EEG_Score = 100 – (total_pts × 100 / max_possible_pts)`

**Total EEG Score Reference Ranges:**
- 80–100: Green (Optimal)
- 60–79: Yellow (Mild deviation)
- 40–59: Orange (Moderate deviation)
- <40: Red (High-risk – immediate attention)

**Note:** The EEG scoring uses the same 4-category color banding system as other health scores, with evidence-based clinical reference ranges from vendor documentation.

---

### OmniFit Color-Band Logic
- Very Good / Very High / Excellent = dark-green
- Good / High = light-green
- Normal / Average = yellow
- Warning / Low / High-risk = orange
- Danger / Very Low / Critical = red

These color tags align 1-for-1 with the legend printed on each OmniFit PDF page.

---

## HeartMath Reference Ranges (5-min)

### Evidence-Based Reference Chart
| Metric (5-min) | Green (Optimal) | Yellow (Mild) | Orange (Moderate) | Red (Critical) |
|----------------|-----------------|---------------|-------------------|----------------|
| SDNN (ms) | ≥ 50 | 45 – 49 | 30 – 44 | < 30 |
| RMSSD (ms) | ≥ 40 | 35 – 39 | 20 – 34 | < 20 |
| Total Power (ms²) | ≥ 1,000 | 750 – 999 | 500 – 749 | < 500 |
| LF Power (ms²) | 300 – 1,170 | 200 – 299 | 100 – 199 | < 100 |
| HF Power (ms²) | 300 – 975 | 200 – 299 | 100 – 199 | < 100 |
| LF/HF ratio | 0.5 – 2.0 | 0.8 – 0.99 or 1.01 – 1.25 | 0.21 – 0.79 or 2.01 – 4.0 | < 0.20 or > 4.0 |
| Normalized Coherence % | ≥ 60 | 50 – 59 | 30 – 49 | < 30 |

### HeartMath Color-Band Logic
- **Green (Optimal)** = dark-green
- **Yellow (Mild)** = yellow
- **Orange (Moderate)** = orange
- **Red (Critical)** = red

### Scoring Logic
Each metric is scored on a 0-100 scale:
- **Green**: 100 points
- **Yellow**: 50 points
- **Orange**: 25 points
- **Red**: 0 points

The overall HeartMath score is the average of all individual metric scores.

---

## Auracom Reference Ranges (4-Band Scoring)

| Metric                   | Green (Optimal)      | Yellow (Mild)      | Orange (Moderate)      | Red (High Risk)      | Notes / Action                        |
|--------------------------|----------------------|--------------------|------------------------|---------------------|---------------------------------------|
| **Energy Score (Ava)**   | 500–600              | 450–499            | 400–449 or >600        | <400                | Green: Balanced; Red: Intensive support; >600: Excess output (rest/calm) |
| **Vigor (Yang)**         | 60–70                | 50–59              | <50                    | >71                 | Green: Healthy; Red: Burnout risk     |
| **Stability (Yin)**      | 30–40                | 41–50              | <30                    | >51                 | Green: Optimal recovery; Red: Fatigued/overloaded |
| **Activity % (ANS)**     | ≈50%                 | <40%                |                        | >60%                | Green: Balanced; Red: Sympathetic dom. (stress) |
| **Overall Elemental Balance** | 95–110          | 90–94              | 80–89 or >110          | <80                 | Green: Balanced; Red: Significant deficiency    |

### Elemental Deviation Severity
| Max–Min Deviation | Label              | Color Tag   |
|-------------------|--------------------|-------------|
| 0–5               | Balanced           | Dark Green  |
| 6–10              | Mild imbalance     | Yellow ⚠    |
| 11–15             | Needs improvement  | Orange      |
| >15               | Severe imbalance   | Red ❗       |

### Auracom Scoring Logic (4-Band)
- **Green (Optimal):** 0 pts (best/healthy range)
- **Yellow (Mild):** 4 pts (slight deviation, monitor)
- **Orange (Moderate):** 6 pts (moderate deviation, support needed)
- **Red (High Risk):** 8 pts (critical, intensive support or risk)

Each metric is scored according to the above ranges. For **Elemental Deviation Severity**, the max–min deviation among the five elements is used:
- 0–5: Green (0 pts)
- 6–10: Yellow (4 pts)
- 11–15: Orange (6 pts)
- >15: Red (8 pts)

The total Auracom score is calculated as:

`Auracom_Score = 100 – (total_pts × 100 / max_possible_pts)`

**Total Auracom Score Reference Ranges:**
- 80–100: Green (Optimal)
- 60–79: Yellow (Mild deviation)
- 40–59: Orange (Moderate deviation)
- <40: Red (High-risk – immediate attention)

---

## Color Banding Logic (All Tests)
- **Green (Optimal):** 90–100
- **Yellow (Mild):** 75–89
- **Orange (Moderate):** 60–74
- **Red (High Risk):** 40–59
- **Red (Critical):** <40

---

*For more details or to update these charts, see the scoring logic in `/lib/objective/`.* 


---

## Subjective Musculoskeletal Scoring (Health Check)

### Scoring Logic
- **Source:** Patient-reported symptoms from health check questions
- **Method:** Symptom frequency and severity assessment
- **Range:** 0-10 scale (10 = optimal, 0 = severe issues)

### Health Check Questions Included
- Muscle symptoms (tightness, soreness, weakness)
- Pain areas and intensity
- Functional limitations
- Recovery patterns
- Exercise tolerance

### Color Bands (Subjective)
- **8-10: Green (Optimal)** - Minimal symptoms, good function
- **6-7: Yellow (Mild)** - Some symptoms, manageable
- **4-5: Orange (Moderate)** - Significant symptoms, affecting function
- **0-3: Red (High Risk)** - Severe symptoms, major functional impact

---

## Total Circulation Score (OmniFit PPG + HeartMath)

### Evidence-Based Reference Chart
| Metric                    | Green (0 pts) | Yellow (2-4 pts) | Orange (6 pts) | Red (8 pts) | Max pts | Notes |
|---------------------------|---------------|------------------|----------------|-------------|---------|-------|
| **OmniFit PPG Metrics**   |               |                  |                |             |         |       |
| HRV Index                 | ≥13.0         | 10.0–12.9        | 6.0–9.9        | <6.0        | 8       | Autonomic function |
| Stress Level (0-100)      | <20           | 20–39            | 40–59          | ≥60         | 8       | Lower is better |
| ANS Health Score          | ≥9.0          | 7.0–8.9          | 5.0–6.9        | <5.0        | 8       | Autonomic health |
| ANS Age (years)           | ≤-10          | -9 to -5         | -4 to +4       | >+4         | 8       | Biological age delta |
| LF Power (log ms²)        | ≥6.0          | 3.59–5.99        | 2.0–3.58       | <2.0        | 8       | Sympathetic activity |
| HF Power (log ms²)        | ≥6.0          | 4.0–5.99         | 2.0–3.99       | <2.0        | 8       | Parasympathetic activity |
| **HeartMath Metrics**     |               |                  |                |             |         |       |
| SDNN (ms)                 | ≥50           | 45–49            | 30–44          | <30         | 8       | Overall HRV |
| RMSSD (ms)                | ≥40           | 35–39            | 20–34          | <20         | 8       | Parasympathetic tone |
| Total Power (ms²)         | ≥1000         | 750–999          | 500–749        | <500        | 8       | Overall HRV power |
| LF Power (ms²)            | 300–1170      | 200–299          | 100–199        | <100 or >1170| 8      | Sympathetic activity |
| HF Power (ms²)            | 300–975       | 200–299          | 100–199        | <100 or >975| 8       | Parasympathetic activity |
| LF/HF Ratio               | 0.8–1.25      | 0.99–1.01        | 0.21–0.79      | <0.20 or >4.0| 8      | Sympathovagal balance |
| Normalized Coherence (%)  | ≥60           | 50–59            | 30–49          | <30         | 8       | Heart-brain coherence |

### Circulation_Score Formula
`Circulation_Score = 100 – (total_pts × 100 / max_possible_pts)`

**Total Circulation Score Reference Ranges:**
- 80–100: Green (Optimal)
- 60–79: Yellow (Mild imbalance)
- 40–59: Orange (High-risk imbalance)
- <40: Red (Critical – immediate attention)

**Note:** The Total Circulation Score combines OmniFit PPG autonomic metrics with HeartMath HRV measurements to provide a comprehensive assessment of cardiovascular and autonomic nervous system health.

---

