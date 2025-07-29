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

## ExBody MSK-Health Scoring (36-Point System)

**Core Metrics (16 points total):**
| Metric                        | Green (Optimal) | Yellow (Mild) | Orange (Moderate) | Red (High Risk) | Points | Notes |
|-------------------------------|-----------------|---------------|-------------------|-----------------|--------|-------|
| Loss of Height (in)           | ≤0.5            | 0.6–1.0       | 1.1–2.0           | >2.0             | 4      | ≥0.5 in ↑ vertebral fx risk |
| Misalignment Deviation (0–51) | 0–10            | 11–20         | 21–40             | 41+              | 4      | Color bands: green/yellow/orange/red |
| Imbalance Deviation (0–51)    | 0–10            | 11–20         | 21–40             | 41+              | 4      | Color bands: green/yellow/orange/red |
| Musculoskeletal Index         | 0–20            | 21–40         | 41–60             | 61+              | 4      | Sum of misalignment + imbalance deviation |

**Postural Metrics (20 points total):**
| Metric                        | Green (Optimal) | Yellow (Mild) | Orange (Moderate) | Red (High Risk) | Points | Notes |
|-------------------------------|-----------------|---------------|-------------------|-----------------|--------|-------|
| Shoulder Inclination (deg)    | ≤1              | 1.1–3         | 3.1–5             | >5              | 2      | >10mm ↑ RC risk |
| Shoulder Inclination (mm)     | ≤5              | 6–10          | 11–20             | >20             | 2      |  |
| Forward Head Posture (deg)    | ≤15             | 16–20         | 21–30             | >30             | 2      | >15–20° ↑ neck pain |
| Forward Head Posture (mm)     | ≤5              | 6–10          | 11–20             | >20             | 2      |  |
| PCMT (lb)                     | ≤2              | 2.1–4.0       | 4.1–6.0           | >6              | 4      | Normative data |
| Pelvic Tilt (deg)             | –4 to +10       | 11–15         | 16–20             | >20             | 2      | Mean APT ≈ 13° ± 6° |
| Pelvic Tilt (mm)              | ≤5              | 6–10          | 11–20             | >20             | 2      |  |
| Knee Flexion/Extension (deg)  | –5 to +5        | 6–10          | 11–15             | >15             | 2      | >10° ↑ PF-pain risk |
| Knee Flexion/Extension (mm)   | ≤5              | 6–10          | 11–20             | >20             | 2      |  |

### MSK_Health_Score Formula

**Component Scoring:**
- **Core Metrics:** Each scored 1-4 points (Green=4, Yellow=3, Orange=2, Red=1)
- **Postural Metrics:** 
  - PCMT: 1-4 points (Green=4, Yellow=3, Orange=2, Red=1)
  - Degree/MM pairs: Each scored 0.5-2.0 points (Green=2.0, Yellow=1.5, Orange=1.0, Red=0.5)

**Final MSK Score:**
\[
\text{MSK Score} = \frac{\text{Total Points}}{36} \times 100
\]

**Total MSK Score Reference Ranges:**
- **80–100: Green (Optimal)** - Excellent musculoskeletal health
- **60–79: Yellow (Mild deviation)** - Some postural/mobility issues
- **40–59: Orange (Moderate deviation)** - Significant musculoskeletal problems
- **<40: Red (High-risk)** - Critical musculoskeletal dysfunction

**Note:** The ExBody scoring uses evidence-based clinical reference ranges from vendor documentation, with degree and millimeter measurements scored independently but combined for each postural metric.

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

## ROM (Range of Motion) Reference Ranges

### Normal Range of Motion Values by Joint Movement

#### Neck Movements
| Movement | Normal Range | Status Thresholds |
|----------|-------------|------------------|
| **Neck Flexion** | 45° | 🟢 ≥80% (≥45°) | 🟡 60-79% (36-45°) | 🟠 40-59% (27-35.9°) | 🔴 <40% (<27°) |
| **Neck Lateral Flexion** | 45° | 🟢 ≥80% (≥45°) | 🟡 60-79% (36-45°) | 🟠 40-59% (27-35.9°) | 🔴 <40% (<27°) |

#### Shoulder Movements
| Movement | Normal Range | Status Thresholds |
|----------|-------------|------------------|
| **Shoulder Abduction** | 175° (170-180°) | 🟢 ≥80% (≥140°) | 🟡 60-79% (105-139.9°) | 🟠 40-59% (70-104.9°) | 🔴 <40% (<70°) |
| **Shoulder Flexion** | 175° (170-180°) | 🟢 ≥80% (≥140°) | 🟡 60-79% (105-139.9°) | 🟠 40-59% (70-104.9°) | 🔴 <40% (<70°) |
| **Shoulder Extension** | 55° (45-60°) | 🟢 ≥80% (≥44°) | 🟡 60-79% (33-43.9°) | 🟠 40-59% (22-32.9°) | 🔴 <40% (<22°) |

#### Trunk Movements
| Movement | Normal Range | Status Thresholds |
|----------|-------------|------------------|
| **Trunk Lateral Flexion** | 35° | 🟢 ≥80% (≥28°) | 🟡 60-79% (21-27.9°) | 🟠 40-59% (14-20.9°) | 🔴 <40% (<14°) |

#### Hip Movements
| Movement | Normal Range | Status Thresholds |
|----------|-------------|------------------|
| **Hip Abduction** | 45° | 🟢 ≥80% (≥36°) | 🟡 60-79% (27-35.9°) | 🟠 40-59% (18-26.9°) | 🔴 <40% (<18°) |
| **Hip Flexion** | 75° (70-80°) | 🟢 ≥80% (≥60°) | 🟡 60-79% (45-59.9°) | 🟠 40-59% (30-44.9°) | 🔴 <40% (<30°) |
| **Hip Extension** | 25° (20-30°) | 🟢 ≥80% (≥20°) | 🟡 60-79% (15-19.9°) | 🟠 40-59% (10-14.9°) | 🔴 <40% (<10°) |

### ROM Status Color Coding

#### 🟢 Optimal (80-100% of normal range)
- Movement is within optimal range
- No functional limitations
- Good joint health and flexibility

#### 🟡 Moderate (60-79% of normal range)
- Slight reduction in range
- May have minor functional limitations
- Consider gentle stretching exercises

#### 🟠 High Risk (40-59% of normal range)
- Significant reduction in range
- Likely functional limitations
- May require targeted therapy

#### 🔴 Critical (<40% of normal range OR pain present)
- Severe reduction in range
- Significant functional limitations
- Pain indicates injury or pathology
- Requires medical evaluation

### Special Considerations

#### Pain Indicators
- **Any movement with pain = 🔴 Critical**
- Pain overrides ROM percentage
- Pain indicates potential injury, inflammation, or pathology
- Requires immediate attention

#### Single-Side vs Bilateral Movements
- **Neck Flexion**: Single side only (left)
- **All other movements**: Bilateral (left and right sides)
- Each side is evaluated independently

#### Clinical Interpretation
- Compare left vs right sides for asymmetry
- Consider age, activity level, and medical history
- Use in conjunction with other assessments
- Track progress over time

#### Measurement Notes
- All measurements in degrees (°)
- Ranges based on standard clinical guidelines
- Individual variations may apply
- Consider patient-specific factors (age, fitness level, etc.)

---

## Articular Joint System Scoring (ExBody ROM)

### Overview
The Articular Joint System evaluates **17 individual ROM measurements** across 9 joint movements, providing a comprehensive assessment of joint health and mobility.

### Individual ROM Scoring (4-Point Scale)
Each ROM measurement is scored independently using a 4-point scale:

| Score | Color | Description | Criteria |
|-------|-------|-------------|----------|
| **4** | 🟢 Green | Optimal | ≥90% of reference range |
| **3** | 🟡 Yellow | Mild limitation | ≥70% of reference range |
| **2** | 🟠 Orange | Moderate limitation | <70% of reference range |
| **1** | 🔴 Red | Critical | Pain present OR no data |

### ROM Movements Evaluated (17 Total Metrics)

#### Neck Movements (1 metric)
| Movement | Side | Reference Range | Green (4 pts) | Yellow (3 pts) | Orange (2 pts) | Red (1 pt) |
|----------|------|----------------|---------------|----------------|----------------|------------|
| **Neck Flexion** | Left only | >45° | ≥40.5° | ≥31.5° | <31.5° | Pain or no data |

#### Bilateral Movements (16 metrics)
| Movement | Side | Reference Range | Green (4 pts) | Yellow (3 pts) | Orange (2 pts) | Red (1 pt) |
|----------|------|----------------|---------------|----------------|----------------|------------|
| **Neck Lateral Flexion** | Left/Right | 25-45° | ≥40.5° | ≥31.5° | <31.5° | Pain or no data |
| **Shoulder Abduction** | Left/Right | 170-180° | ≥162° | ≥126° | <126° | Pain or no data |
| **Shoulder Flexion** | Left/Right | 170-180° | ≥162° | ≥126° | <126° | Pain or no data |
| **Shoulder Extension** | Left/Right | 45-60° | ≥54° | ≥42° | <42° | Pain or no data |
| **Trunk Lateral Flexion** | Left/Right | >35° | ≥31.5° | ≥24.5° | <24.5° | Pain or no data |
| **Hip Abduction** | Left/Right | >40° | ≥36° | ≥28° | <28° | Pain or no data |
| **Hip Flexion** | Left/Right | 70-80° | ≥72° | ≥56° | <56° | Pain or no data |
| **Hip Extension** | Left/Right | 20-30° | ≥27° | ≥21° | <21° | Pain or no data |

### Articular Joint Score Formula

**Individual Scoring:**
- Each of the 17 ROM measurements is scored 1-4 points
- **Pain overrides ROM percentage** - any movement with pain = 1 point (Red)
- **No data** = 1 point (Red)

**Final Score Calculation:**
\[
\text{Articular Joint Score} = \frac{\text{Sum of all 17 scores}}{68} \times 100
\]

Where:
- **68** = maximum possible points (17 metrics × 4 points each)
- **Result** = percentage score (0-100%)

### Articular Joint Score Reference Ranges

| Score Range | Color | Description | Clinical Interpretation |
|-------------|-------|-------------|------------------------|
| **80-100%** | 🟢 Green | Optimal | Excellent joint health and mobility |
| **60-79%** | 🟡 Yellow | Mild limitation | Some joint restrictions, consider gentle exercises |
| **40-59%** | 🟠 Orange | Moderate limitation | Significant mobility issues, may need targeted therapy |
| **<40%** | 🔴 Red | Critical | Severe limitations, requires medical evaluation |

### Clinical Considerations

#### Pain Assessment Priority
- **Pain = immediate Red score** regardless of ROM value
- Pain indicates potential injury, inflammation, or pathology
- Requires immediate clinical attention

#### Bilateral Comparison
- Compare left vs right sides for asymmetry
- Asymmetry may indicate:
  - Compensatory patterns
  - Unilateral injury
  - Neurological issues
  - Postural imbalances

#### Age and Activity Factors
- Consider age-appropriate expectations
- Account for activity level and sport-specific demands
- Factor in previous injuries or surgeries

#### Progress Tracking
- Monitor changes over time
- Track response to interventions
- Use as outcome measure for therapy

### Example Calculations

**Perfect Score (All Green):**
- 17 metrics × 4 points = 68 points
- Final score: (68 × 100) / 68 = **100%**

**Mixed Performance:**
- 8 Green (4 pts each) = 32 points
- 6 Yellow (3 pts each) = 18 points  
- 2 Orange (2 pts each) = 4 points
- 1 Red (1 pt) = 1 point
- **Total**: 32 + 18 + 4 + 1 = 55 points
- **Final Score**: (55 × 100) / 68 = **80.9%**

**Poor Performance (All Red):**
- 17 metrics × 1 point = 17 points
- Final score: (17 × 100) / 68 = **25%**

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

## Auracom Reference Ranges (Energy System Scoring)

| Metric                   | Green (Optimal)      | Yellow (Mild)      | Orange (Moderate)      | Red (High Risk)      | Max Points | Notes / Action                        |
|--------------------------|----------------------|--------------------|------------------------|---------------------|------------|---------------------------------------|
| **Energy Level (Ava)**   | 500–600              | 450–499            | 400–449 or >600        | <400                | 4          | Green: Balanced; Red: Intensive support; >600: Excess output (rest/calm) |
| **Vigor (Yang)**         | 60–70                | 50–59              | <50                    | >71                 | 2          | Green: Healthy; Red: Burnout risk     |
| **Stability (Yin)**      | 30–40                | 41–50              | <30                    | >51                 | 2          | Green: Optimal recovery; Red: Fatigued/overloaded |
| **Activity Level (ANS)** | 40–60%               | <40%               |                         | >60%                | 4          | Green: Balanced; Red: Sympathetic dom. (stress) |
| **Overall Energy Balance** | 96–110          | 86–95              | 75–85 or 111+         | <74                 | 4          | Green: Ideal; Orange: Below normal/Too high; Red: Low |

### 5-System Elemental Scoring
| System                   | Green (Optimal)      | Yellow (Mild)      | Orange (Moderate)      | Red (High Risk)      | Points     | Notes                                |
|--------------------------|----------------------|--------------------|------------------------|---------------------|------------|--------------------------------------|
| **Detoxification (Wood)** | 96–110              | 86–95              | 75–85 or 111+         | <74                 | 0.8        | Liver/gallbladder function            |
| **Circulation (Fire)**   | 96–110              | 86–95              | 75–85 or 111+         | <74                 | 0.8        | Heart/small intestine function        |
| **Digestive (Earth)**    | 96–110              | 86–95              | 75–85 or 111+         | <74                 | 0.8        | Spleen/stomach function               |
| **Immune (Metal)**       | 96–110              | 86–95              | 75–85 or 111+         | <74                 | 0.8        | Lung/large intestine function         |
| **Filteration (Water)**  | 96–110              | 86–95              | 75–85 or 111+         | <74                 | 0.8        | Kidney/bladder function               |

*Note: When overall balance is green (96-110), individual systems are scored based on deviation from balance. When overall balance is below green, systems are scored based on absolute values.*

### Auracom Energy Score Formula

**Component Scoring:**
- **Energy Level (Ava):** Green=4, Yellow=3, Orange=2, Red=1
- **Vigor + Stability:** Green=2.0 each, Yellow=1.5 each, Orange=1.0 each, Red=0.5 each (sum max=4)
- **Activity Level:** Green=4, Yellow=3, Orange=2, Red=1
- **Overall Energy Balance:** Green=4, Yellow=3, Orange=2, Red=1
- **5-System Total:** Sum of all 5 systems (range: 1.0-4.0)

**Final Energy Score:**
\[
\text{Energy Score} = \frac{\text{Energy Level} + (\text{Vigor} + \text{Stability}) + \text{Activity} + \text{Overall Balance} + \text{5-System Sum}}{20} \times 100
\]

**Total Energy Score Reference Ranges:**
- **80–100: Green (Optimal)** - Balanced energy systems
- **60–79: Yellow (Mild deviation)** - Some energy imbalances
- **40–59: Orange (Moderate deviation)** - Significant energy issues
- **<40: Red (High-risk)** - Critical energy system dysfunction

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

## Organ System Scoring (InBody Device)

### Evidence-Based Reference Chart
| Metric                    | Green (4 pts) | Yellow (3 pts) | Orange (2 pts) | Red (1 pt) | Notes |
|---------------------------|---------------|----------------|----------------|------------|-------|
| **Hydration % (TBW/Weight)** |               |                |                |            |       |
| Men                       | ≥58%          | 52–57.9%       | 50–51.9%       | <50%       | Normal/Optimal: 58-66% |
| Women                     | ≥48%          | 41–47.9%       | 40–40.9%       | <40%       | Normal/Optimal: 48-60% |
| **Body Fat % (Age & Sex)** |               |                |                |            |       |
| Men (20-29)               | 8–14.8%       | 14.9–18.6%     | 18.7–23.1%     | <8% or >23.2% | Excellent/Good = Green |
| Men (30-39)               | 8–18.2%       | 18.3–21.3%     | 21.4–24.9%     | <8% or >25% | Fair = Yellow, Poor = Orange |
| Men (40-49)               | 8–20.6%       | 20.7–23.4%     | 23.5–26.6%     | <8% or >26.7% | Danger = Red |
| Men (50-59)               | 8–22.1%       | 22.2–24.6%     | 24.7–27.8%     | <8% or >27.9% |       |
| Men (60-69)               | 8–22.6%       | 22.7–25.2%     | 25.3–28.4%     | <8% or >28.5% |       |
| Women (20-29)             | 14–19.4%      | 19.5–22.7%     | 22.8–27.1%     | <14% or >27.2% |       |
| Women (30-39)             | 14–20.8%      | 20.9–24.6%     | 24.7–29.1%     | <14% or >29.2% |       |
| Women (40-49)             | 14–23.8%      | 23.9–27.6%     | 27.7–31.9%     | <14% or >31.9% |       |
| Women (50-59)             | 14–27.0%      | 27.1–30.4%     | 30.5–34.5%     | <14% or >34.6% |       |
| Women (60-69)             | 14–27.9%      | 28.0–31.3%     | 31.4–35.4%     | <14% or >35.5% |       |
| **Visceral Fat Area (cm²)** | <100         | 100–129        | 130–149        | ≥150       | Optimal <100, Warning ≥150 |
| **ECW/TBW Ratio**         | <0.381        | 0.381–0.390    | 0.391–0.400    | ≥0.401     | Optimal <0.365–0.380 |
| **SMM % (Age & Sex)**     |               |                |                |            |       |
| Men (18-35)               | ≥40%          | 37–39.9%       | 34–36.9%       | <34%       | Athletic >48% |
| Men (36-55)               | ≥36%          | 33–35.9%       | 30–32.9%       | <30%       |       |
| Men (56-75)               | ≥32%          | 29–31.9%       | 26–28.9%       | <26%       |       |
| Men (76+)                 | ≥31%          | 27–30.9%       | 24–26.9%       | <24%       |       |
| Women (18-35)             | ≥31%          | 28–30.9%       | 26–27.9%       | <26%       | Athletic >38% |
| Women (36-55)             | ≥29%          | 26–28.9%       | 24–25.9%       | <24%       |       |
| Women (56-75)             | ≥27%          | 24–26.9%       | 22–23.9%       | <22%       |       |
| Women (76+)               | ≥26%          | 23–25.9%       | 20–22.9%       | <20%       |       |
| **Phase Angle (Age & Sex)** |              |                |                |            |       |
| Men (18-29)               | ≥6.8°         | 6.2–6.7°       | 5.4–6.1°       | <5.4°      | Healthy = Green |
| Men (30-39)               | ≥6.6°         | 6.0–6.5°       | 5.2–5.9°       | <5.2°      | Acceptable = Yellow |
| Men (40-49)               | ≥6.4°         | 5.8–6.3°       | 5.0–5.7°       | <5.0°      | Caution = Orange |
| Men (50-59)               | ≥6.0°         | 5.4–5.9°       | 4.7–5.3°       | <4.7°      | Low/Recovery = Red |
| Men (60-69)               | ≥5.6°         | 5.0–5.5°       | 4.3–4.9°       | <4.3°      |       |
| Men (70-79)               | ≥5.2°         | 4.6–5.1°       | 3.9–4.5°       | <3.9°      |       |
| Men (80+)                 | ≥4.8°         | 4.2–4.7°       | 3.5–4.1°       | <3.5°      |       |
| Women (18-29)             | ≥6.2°         | 5.6–6.1°       | 4.8–5.5°       | <4.8°      |       |
| Women (30-39)             | ≥6.0°         | 5.4–5.9°       | 4.6–5.3°       | <4.6°      |       |
| Women (40-49)             | ≥5.8°         | 5.2–5.7°       | 4.4–5.1°       | <4.4°      |       |
| Women (50-59)             | ≥5.4°         | 4.8–5.3°       | 4.0–4.7°       | <4.0°      |       |
| Women (60-69)             | ≥5.0°         | 4.4–4.9°       | 3.6–4.3°       | <3.6°      |       |
| Women (70-79)             | ≥4.6°         | 4.0–4.5°       | 3.2–3.9°       | <3.2°      |       |
| Women (80+)               | ≥4.2°         | 3.6–4.1°       | 2.9–3.5°       | <2.9°      |       |

### Organ_Health_Score Formula
`Organ_Health_Score = (total_pts × 100) / 24`

Where:
- `total_pts` = sum of all individual metric scores (1-4 each)
- `24` = maximum possible points (6 metrics × 4 points each)

**Total Organ Health Score Reference Ranges:**
- 80–100: Green (Optimal)
- 60–79: Yellow (Mild deviation)
- 40–59: Orange (Moderate deviation)
- <40: Red (High-risk)

**Note:** The Organ System Score combines InBody bioelectrical impedance analysis metrics to provide a comprehensive assessment of cellular health, hydration status, body composition, and metabolic function. Each metric is scored based on age and sex-specific clinical reference ranges.

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
| Metric                    | Green (4 pts) | Yellow (3 pts) | Orange (2 pts) | Red (1 pt) | Notes |
|---------------------------|---------------|----------------|----------------|------------|-------|
| **OmniFit PPG Metrics**   |               |                |                |            |       |
| HRV Index                 | ≥13.0         | 10.0–12.9      | 6.0–9.9        | <6.0       | Autonomic function |
| LF Power (log ms²)        | ≥6.0          | 3.59–5.99      | 2.0–3.58       | <2.0       | Sympathetic activity |
| **HeartMath Metrics**     |               |                |                |            |       |
| Mean Heart Rate (bpm)     | 60–100        | 50–59 or        | 40–49 or       | <40 or     | Resting heart rate |
|                           |                | 101–120         | >120           | >120       |        |
| Mean IBI (ms)             | 600–1000      | 500–599 or      | 400–499 or     | <400 or    | Inter-beat interval |
|                           |                | 1001–1500       | >1500          | >1500      |        |
| SDNN (ms)                 | ≥50           | 45–49          | 30–44          | <30        | Overall HRV |
| Total Power (ms²)         | ≥1000         | 750–999        | 500–749        | <500       | Overall HRV power |
| VLF Power (ms²)           | 100–500       | 50–99 or        | 20–49 or       | <20 or     | Very low frequency |
|                           |                | 501–1000        | 1001–2000      | >2000      |        |
| LF Power (ms²)            | 300–1170      | 200–299 or      | 100–199 or     | <100 or    | Sympathetic activity |
|                           |                | 1171–2000       | >2000          | >2000      |        |
| R-R Intervals (count)     | ≥60           | 50–59          | 40–49          | <40        | Arrhythmia surveillance |
| Normalized Coherence (%)  | ≥60           | 50–59          | 30–49          | <30        | Heart-brain coherence |

### Circulation_Score Formula
`Circulation_Score = (total_pts × 100) / (metric_count × 4)`

Where:
- `total_pts` = sum of all individual metric scores (1-4 each)
- `metric_count` = number of metrics with data (up to 12)
- `metric_count × 4` = maximum possible points for available metrics

**Total Circulation Score Reference Ranges:**
- 80–100: Green (Optimal)
- 60–79: Yellow (Mild imbalance)
- 40–59: Orange (High-risk imbalance)
- <40: Red (Critical – immediate attention)

**Note:** The Total Circulation Score combines OmniFit PPG autonomic metrics with HeartMath HRV measurements to provide a comprehensive assessment of cardiovascular and autonomic nervous system health. Each metric contributes equally to the final score, and missing metrics are excluded from the calculation rather than penalized.

---

## Nervous System Score (OmniFit EEG + HeartMath + OmniFit PPG)

### Evidence-Based Reference Chart
| Metric                    | Green (4 pts) | Yellow (3 pts) | Orange (2 pts) | Red (1 pt) | Notes |
|---------------------------|---------------|----------------|----------------|------------|-------|
| **OmniFit EEG Metrics**   |               |                |                |            |       |
| Overall Brain Function Score (0-100) | ≥80 | 60–79 | 40–59 | <40 | Cognitive function |
| Mental Stress Level (0-10) | <3 | 3–4.9 | 5–6.9 | ≥7 | Mental stress |
| Intrinsic EEG Performance Factor (Hz) | ≥9.0 | 8.0–8.9 | 7.0–7.9 | <7.0 | Peak α-frequency |
| Brain Workload Index (Hz) | 15–19.5 | 12–14.9 or 19.6–24.9 | 25–29.9 | <12 or ≥30 | Dominant β-burst |
| **HeartMath Metrics**     |               |                |                |            |       |
| LF/HF Ratio               | 0.8–1.25      | 0.99–1.01 or   | 0.21–0.79 or   | <0.20 or   | Sympathovagal balance |
|                           |                | 1.01–2.0       | 2.01–4.0       | >4.0       |        |
| HF Power (ms²)            | 300–975       | 200–299 or      | 100–199 or     | <100 or    | Parasympathetic activity |
|                           |                | 976–2000       | >2000          | >2000      |        |
| RMSSD (ms)                | ≥40           | 35–39          | 20–34          | <20        | Parasympathetic tone |
| Normalized Coherence (%)  | ≥60           | 50–59          | 30–49          | <30        | Heart-brain coherence |
| **OmniFit PPG Metrics**   |               |                |                |            |       |
| Stress Level (0-100)      | <20           | 20–39          | 40–59          | ≥60        | Lower is better |
| ANS Health Score          | ≥9.0          | 7.0–8.9        | 5.0–6.9        | <5.0       | Autonomic health |
| ANS Age (years)           | ≤-10          | -9 to -5       | -4 to +4       | >+4        | Biological age delta |

### Nervous_Score Formula
`Nervous_Score = (total_pts × 100) / (metric_count × 4)`

Where:
- `total_pts` = sum of all individual metric scores (1-4 each)
- `metric_count` = number of metrics with data (up to 11)
- `metric_count × 4` = maximum possible points for available metrics

**Total Nervous System Score Reference Ranges:**
- 80–100: Green (Optimal)
- 60–79: Yellow (Mild deviation)
- 40–59: Orange (Moderate deviation)
- <40: Red (Critical – immediate attention)

**Note:** The Nervous System Score combines OmniFit EEG brain metrics with HeartMath HRV measurements and OmniFit PPG autonomic metrics to provide a comprehensive assessment of nervous system health, including cognitive function, autonomic regulation, and stress response. Each metric contributes equally to the final score, and missing metrics are excluded from the calculation rather than penalized.

---

