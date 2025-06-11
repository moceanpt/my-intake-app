import { pdf, Text, View, Page, Document, StyleSheet, Image } from '@react-pdf/renderer';
import fs   from 'fs';
import path from 'path';

export async function buildPdf(data:{stress:any,support:any,chartUrl:string,rec:string[]}) {
  const styles = StyleSheet.create({
    page: { padding: 24, fontSize: 10, fontFamily: 'Helvetica' },
    h1:   { fontSize: 18, marginBottom: 8 },
    h2:   { fontSize: 12, marginTop: 12, marginBottom: 4, fontWeight: 'bold' },
  });

  const doc = (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.h1}>MOCEAN Health Snapshot</Text>
        <Image src={data.chartUrl} style={{ width: 250, height: 250, alignSelf:'center' }}/>
        <Text style={styles.h2}>Top Focus Areas</Text>
        {data.rec.map((r) => <Text key={r}>• {r}</Text>)}
      </Page>
    </Document>
  );

  /* save locally then upload to S3 / Supabase */
  const buf = await pdf(doc).toBuffer();
  const filePath = path.join('/tmp', `snapshot-${Date.now()}.pdf`);
  fs.writeFileSync(filePath, buf);
  return filePath;             // hand back the local path
}