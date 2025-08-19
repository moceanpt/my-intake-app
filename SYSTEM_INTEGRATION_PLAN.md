# 🔧 MOCEAN Weighted Scoring System Integration Plan

## 🚨 Current Status: **PARTIALLY IMPLEMENTED**

The weighted scoring system (97 symptoms) has been built but is **NOT fully integrated** into the application flow.

## ❌ **What's NOT Working:**

### 1. **Intake Form Uses Old System**
- Current: Uses generic chip codes (`${q.id}_${i}`)
- Needed: Use specific symptom codes (`MSK_NeckTension`, `ENE_Fatigue`)
- Impact: New weighted scoring can't process current chip data

### 2. **Score Generation Uses Old Algorithm**
- File: `lib/score.ts` → `buildSubjectiveRadar()` 
- Current: Simple `pillarScore(sliderValue, chipCount, maxChips)`
- Needed: `calculateWeightedSymptomScore()` with individual symptom weights
- Impact: All scoring calculations are using old simple algorithm

### 3. **Preview/Final Plans Use Old System**
- Files: `lib/generatePlan.ts`, `lib/planFactory.ts`
- Current: Calls old `buildSubjectiveRadar()`
- Needed: Update to use new weighted scoring
- Impact: Previews and final plans don't reflect new scoring

### 4. **Chip Data Structure Mismatch**
- Current: `{ musculoskeletal: ["msk_0", "msk_1"] }`
- Needed: `{ musculoskeletal: ["MSK_NeckTension", "MSK_JointPopping"] }`
- Impact: Can't map current data to new symptom weights

## ✅ **What IS Working:**

1. **Weighted Scoring Algorithm** (`lib/symptomScoring.ts`) ✅
2. **Staff Review Page** (`pages/staff/review/[id].jsx`) ✅  
3. **Test Page** (`pages/test-scoring.jsx`) ✅
4. **Documentation** (`WEIGHTED_SCORING_SYSTEM.md`) ✅

## 🔧 **Required Fixes:**

### **Phase A: Update Intake Form Chip Generation**
1. **Update symptom questions** to use new symptom codes
2. **Map old chip system** to new weighted symptom codes
3. **Update chip components** to handle new codes

### **Phase B: Replace Core Scoring Engine**
1. **Replace `buildSubjectiveRadar()`** with weighted scoring calls
2. **Update `pillarScore()`** to use `calculateWeightedSymptomScore()`
3. **Maintain backward compatibility** for existing data

### **Phase C: Update All Score Consumers**
1. **Update `generatePlan.ts`** to use new scoring
2. **Update API endpoints** (`/api/preview`, `/api/score`)
3. **Update staff interfaces** to display weighted scores

### **Phase D: Data Migration**
1. **Convert existing submissions** to new format
2. **Update database** to support new scoring
3. **Test with real data**

## 🎯 **Implementation Priority:**

### **HIGH PRIORITY** (System Breaking)
- [ ] Fix chip code mapping (Phase A)
- [ ] Replace core scoring engine (Phase B)
- [ ] Update preview generation (Phase C)

### **MEDIUM PRIORITY** (Feature Complete)
- [ ] Update intake form UI to show new symptoms
- [ ] Add weighted score breakdown to all interfaces
- [ ] Data migration for existing submissions

### **LOW PRIORITY** (Polish)
- [ ] Performance optimizations
- [ ] Advanced analytics
- [ ] Historical trend analysis

## 📊 **Current vs Target State:**

| Component | Current State | Target State | Status |
|-----------|---------------|--------------|---------|
| Scoring Algorithm | Simple count-based | Weighted symptom-based | ✅ Built |
| Staff Review | Uses old system | Uses weighted system | ✅ Done |
| Intake Form | Generic chips | Specific symptom codes | ❌ Needs Fix |
| Score Generation | `pillarScore()` | `calculateWeightedSymptomScore()` | ❌ Needs Fix |
| Preview Plans | Old algorithm | New weighted scores | ❌ Needs Fix |
| Final Plans | Old algorithm | New weighted scores | ❌ Needs Fix |
| Test Interface | N/A | Comprehensive testing | ✅ Done |
| Documentation | Incomplete | Full documentation | ✅ Done |

## 🚀 **Recommended Next Steps:**

1. **IMMEDIATE**: Fix the core scoring integration (Phase B)
2. **SHORT-TERM**: Update intake form to use new chip codes (Phase A)  
3. **MEDIUM-TERM**: Full system testing and validation
4. **LONG-TERM**: Advanced features and optimizations

## ⚠️ **Risk Assessment:**

- **HIGH**: Current system is partially broken - staff reviews show weighted scores but intake generates simple scores
- **MEDIUM**: Data inconsistency between old and new submissions
- **LOW**: Performance impact of new algorithm

## 🧪 **Testing Strategy:**

1. **Unit Tests**: Test weighted scoring with known inputs
2. **Integration Tests**: Test full intake → review → final flow
3. **User Acceptance**: Test with actual healthcare providers
4. **Performance Tests**: Ensure scoring speed is acceptable

---

**Status**: 🟡 **PARTIALLY IMPLEMENTED** - Core algorithm built, integration incomplete  
**Next Action**: Replace `buildSubjectiveRadar()` with weighted scoring calls  
**Timeline**: 2-3 hours for core fixes, 1-2 days for full integration 