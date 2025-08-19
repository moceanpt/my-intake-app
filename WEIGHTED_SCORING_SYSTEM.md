# 🎯 MOCEAN Weighted Symptom Scoring System

## 📋 Overview

The MOCEAN Weighted Symptom Scoring System is a comprehensive, customizable algorithm that provides healthcare providers with accurate severity assessments based on client-reported symptoms and self-rated severity levels.

## 🔧 Key Features

### ✅ **Customizable Weights**
- Each symptom has a configurable weight (1.0, 1.5, 2.0)
- Area-specific multipliers for different health systems
- Easy to modify weights in `lib/symptomScoring.ts`

### ✅ **Enhanced Symptom Options**
- **97 total symptoms** across 6 health areas
- **4 severity categories**: Low, Medium, High, Critical
- **Detailed descriptions** for each symptom

### ✅ **Advanced Scoring Algorithm**
- Base score from slider (0-10)
- Weighted symptom penalties
- Combination penalties for symptom interactions
- Area-specific multipliers

## 🏥 Health Areas & Symptoms

### 1. **Musculoskeletal System** (15 symptoms)
- **Low Impact (1.0)**: Neck tension, back tightness, cramps, soreness, stiffness, joint popping
- **Medium Impact (1.5)**: Weakness, slow recovery, recurrent strains, trigger points, joint stiffness, waking with pain
- **High Impact (2.0)**: Strength loss, chronic tendon pain, muscle atrophy, exercise-induced pain

### 2. **Organ/Digestion/Hormone/Detox** (17 symptoms)
- **Low Impact (1.0)**: Bloating, reflux, post-meal fatigue, food sensitivities
- **Medium Impact (1.5)**: Constipation/diarrhea, chemical sensitivity, antibiotic use, IBS, abdominal pain, nausea/poor appetite, hormone imbalance, detox issues
- **High Impact (2.0)**: Metabolic syndrome, liver/skin issues, unexplained weight changes, autoimmune issues, chronic inflammation

### 3. **Circulation System** (16 symptoms)
- **Low Impact (1.0)**: Raynaud's, low immunity, cold intolerance, varicose veins
- **Medium Impact (1.5)**: Swelling/puffiness, skin issues/flares, orthostatic issues, slow healing, skin redness/flushing, chest tightness/irregular heartbeat, lymphatic issues
- **High Impact (2.0)**: Auto-inflammatory, high inflammation, blood pressure issues, heart issues, poor circulation

### 4. **Energy System** (19 symptoms)
- **Low Impact (1.0)**: Overheating, caffeine dependence, sleep trouble, mid-night waking, unrefreshed sleep, anxiety, mood swings, stress management, disconnection, emotional reactivity, low stamina
- **Medium Impact (1.5)**: Low drive, insomnia/restlessness, sleep apnea, burnout, body composition issues, afternoon energy crash
- **High Impact (2.0)**: Chronic fatigue, CFS

### 5. **Articular/Joint System** (15 symptoms)
- **Low Impact (1.0)**: Stiff knees/hips, shoulder pinch, clicking, weather flares, joint stiffness, cracking
- **Medium Impact (1.5)**: Ankle pain, joint swelling, recent sprain, sitting-related pain, stair pain/stiffness, joint instability
- **High Impact (2.0)**: Joint surgery, limits daily activities, exercise-induced pain

### 6. **Nervous System** (15 symptoms)
- **Low Impact (1.0)**: Screen sensitivity, focus issues, brain fog, tinnitus
- **Medium Impact (1.5)**: Headaches, temperature dysregulation, balance issues, pins & needles, environmental overstimulation, trembling/shakiness, muscle twitching/tics, dizziness
- **High Impact (2.0)**: Nerve pain, concussion history, neurological issues

## 🧮 Scoring Algorithm

### **Formula:**
```
Total Score = min(Base Score + (Weighted Symptom Penalty × Area Multiplier) + Combination Penalty, 10)
```

### **Components:**

1. **Base Score**: Self-rated severity from slider (0-10)
2. **Weighted Symptom Penalty**: Sum of individual symptom weights
3. **Area Multiplier**: System-specific multiplier
   - Nervous System: 1.3x
   - Energy: 1.2x
   - Others: 1.0x
4. **Combination Penalty**: Additional penalties for symptom interactions

### **Combination Penalties:**
- **Pain + Fatigue**: +0.5 points
- **Sleep + Energy Issues**: +0.3 points
- **Inflammation + Pain**: +0.4 points
- **Multiple High-Impact Symptoms**: +0.3 points

## 🎨 Severity Tiers

| Score Range | Tier | Color | Description |
|-------------|------|-------|-------------|
| 0-2.9 | 🟢 Low | Green | Minimal impact on daily function |
| 3-5.9 | 🟡 Moderate | Yellow | Some impact on daily activities |
| 6-7.9 | 🟠 High | Orange | Significant impact on quality of life |
| 8-10 | 🔴 Critical | Red | Severe impact requiring immediate attention |

## 🔧 Customization Guide

### **Modifying Symptom Weights**

Edit `lib/symptomScoring.ts`:

```typescript
// Example: Increase weight for "Chronic Fatigue"
{ code: 'ENE_Fatigue', label: 'Chronic Fatigue', weight: 2.5, category: 'high', description: 'Persistent fatigue or energy crashes' }

// Example: Add new symptom
{ code: 'MSK_NewSymptom', label: 'New Symptom', weight: 1.5, category: 'medium', description: 'Description here' }
```

### **Modifying Area Multipliers**

```typescript
// Example: Increase nervous system multiplier
nervous_system: {
  area: 'nervous_system',
  areaLabel: 'Nervous System',
  baseMultiplier: 1.5, // Changed from 1.3
  // ...
}
```

### **Adding New Symptoms**

1. Add symptom to appropriate health area in `SYMPTOM_WEIGHTS`
2. Update combination penalty functions if needed
3. Test with sample data

## 📊 Example Calculations

### **Example 1: Musculoskeletal**
- **Slider Value**: 6/10
- **Symptoms**: Neck tension (1.0), Muscle weakness (1.5), Strength loss (2.0)
- **Calculation**: 6 + (1.0 + 1.5 + 2.0) × 1.0 = 6 + 4.5 = **10.0** (capped)
- **Result**: 🔴 Critical

### **Example 2: Energy System**
- **Slider Value**: 4/10
- **Symptoms**: Sleep trouble (1.0), Chronic fatigue (2.0)
- **Combination**: Sleep + Energy penalty (+0.3)
- **Calculation**: 4 + (1.0 + 2.0) × 1.2 + 0.3 = 4 + 3.6 + 0.3 = **7.9**
- **Result**: 🟠 High

## 🚀 Implementation

### **Files Modified:**
- `lib/symptomScoring.ts` - Core scoring system
- `pages/staff/review/[id].jsx` - Updated intake review

### **Key Functions:**
- `calculateWeightedSymptomScore()` - Main scoring function
- `getSeverityInfo()` - Get severity tier and styling
- `getSymptomsByArea()` - Get symptoms for specific area
- `getAreaConfig()` - Get area configuration

## 🎯 Benefits

### **For Healthcare Providers:**
- **Accurate Severity Assessment**: Weighted scoring provides more precise severity levels
- **Comprehensive Symptom Coverage**: 97 symptoms across all major health areas
- **Visual Severity Indicators**: Color-coded tiers for quick assessment
- **Detailed Breakdown**: See exactly how scores are calculated

### **For Clients:**
- **Better Symptom Recognition**: More specific symptom options
- **Accurate Severity Tracking**: Weighted scoring reflects true impact
- **Comprehensive Assessment**: Covers all major health systems

### **For System:**
- **Scalable**: Easy to add new symptoms or modify weights
- **Maintainable**: Centralized scoring logic
- **Flexible**: Customizable for different clinical needs

## 🔄 Future Enhancements

### **Potential Additions:**
- **Age-based weighting**: Different weights for different age groups
- **Gender-specific symptoms**: Tailored symptom lists
- **Condition-specific algorithms**: Specialized scoring for specific conditions
- **Machine learning integration**: AI-powered weight optimization
- **Historical trend analysis**: Track severity changes over time

### **Integration Opportunities:**
- **Treatment planning**: Use severity scores for treatment prioritization
- **Progress tracking**: Monitor severity changes over time
- **Risk assessment**: Identify high-risk clients
- **Resource allocation**: Prioritize care based on severity

## 📝 Notes

- All weights are easily modifiable in the `SYMPTOM_WEIGHTS` object
- The system is backward compatible with existing data
- Combination penalties can be customized for specific clinical needs
- Area multipliers can be adjusted based on clinical experience
- The scoring system is designed to be transparent and explainable

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Maintainer**: MOCEAN Development Team 