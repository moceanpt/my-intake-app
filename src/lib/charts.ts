export function makeRadar(stress: Record<string,number>, support: Record<string,number>) {
    const labels = Object.keys(stress);
    const stressArr = labels.map((l) => stress[l]);
    const supportArr = labels.map((l) => support[l]);
  
    const qc = new QuickChart();
    qc.setConfig({
      type: 'radar',
      data: {
        labels,
        datasets: [
          { label: 'Body-Strain %', data: stressArr, borderColor: 'red', backgroundColor: 'rgba(255,0,0,0.15)' },
          { label: 'Support', data: supportArr, borderColor: 'green', backgroundColor: 'rgba(0,128,0,0.15)' },
        ],
      },
      options: {
        scales: {
            r: {
              min: 3,  // ⬅️ Raise the floor to emphasize strain
              max: 10,
              ticks: {
                stepSize: 1,
                callback: v => `${v}`,
              },
              pointLabels: {
                font: { size: 14 },
                color: '#333',
              },
            },
          },
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });
    qc.setWidth(500).setHeight(500).setBackgroundColor('transparent');
  
    return qc.getUrl();
  }