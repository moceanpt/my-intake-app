# AI Setup Instructions

## OpenAI API Key

Replace this with your own key:

OPENAI_API_KEY=sk-REDACTED

# Database Configuration (if needed)
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

### 3. Supported Document Types
The AI can extract data from:
- **InBody Reports**: Body composition analysis
- **AuraCom Reports**: Energy field analysis  
- **HeartMath Reports**: Heart rate variability analysis

### 4. Supported File Formats
- Images: PNG, JPG, JPEG, GIF, BMP, TIFF
- Documents: PDF

## How It Works

1. **Upload**: Drag and drop a scanned document
2. **Analysis**: AI analyzes the document using GPT-4 Vision
3. **Extraction**: Relevant metrics are automatically extracted
4. **Population**: Form fields are automatically filled
5. **Review**: Review and adjust values before saving

## Device-Specific Metrics

### InBody
- Hydration percentage
- Skeletal Muscle Mass percentage
- Body Fat percentage
- Visceral Fat Area (cm²)
- ECW/TBW ratio
- Phase Angle (degrees)

### AuraCom
- Zone colors (5 zones)
- Vital-line quality
- Ava overall energy
- Vigor percentage
- Stability percentage
- Five element values
- Overall Energy Level

### HeartMath
- Mean Heart Rate (bpm)
- SDNN (ms)
- RMSSD (ms)
- Total Power (ms²)
- LF/HF ratio
- High-coherence percentage

## Troubleshooting

### Common Issues
1. **API Key Error**: Ensure your OpenAI API key is correctly set in `.env.local`
2. **File Upload Error**: Check file format and size (max 20MB)
3. **Extraction Failed**: Try uploading a clearer image or different document format
4. **Parsing Error**: The AI response couldn't be parsed - try again with a clearer document

### Cost Considerations
- Each document analysis uses GPT-4 Vision tokens
- Typical cost: $0.01-0.05 per document
- Monitor usage in your OpenAI dashboard

## Security Notes
- Documents are processed by OpenAI and may be used for model improvement
- Don't upload documents with sensitive patient information
- Consider implementing additional data protection measures for production use 