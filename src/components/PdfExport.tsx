import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { FormSchema, FormData, FormSection } from '../types/form';

interface PdfExportOptions {
  schema: FormSchema;
  formData: FormData;
  protocolNumber: string;
  submissionDate: Date;
}

function formatPdfValue(val: string | string[] | undefined): string {
  if (val === undefined || val === '') return '—';
  return Array.isArray(val) ? val.join(', ') : String(val);
}

function buildQuestionNumberMap(sections: FormSection[]): Map<string, number> {
  const map = new Map<string, number>();
  let seq = 1;
  for (const section of sections) {
    for (const q of section.questions) {
      map.set(q.id, seq++);
      if (q.linkedField) map.set(q.linkedField.id, seq++);
      if (q.type === 'matrix' && q.matrixRows) {
        for (const row of q.matrixRows) map.set(row.id, seq++);
      }
    }
  }
  return map;
}

function getSectionsWithData(sections: FormSection[], formData: FormData): FormSection[] {
  return sections.filter((section) =>
    section.questions.some((q) => {
      if (q.type === 'matrix' && q.matrixRows) {
        return q.matrixRows.some((row) => formData[row.id] !== undefined && formData[row.id] !== '');
      }
      return formData[q.id] !== undefined && formData[q.id] !== '';
    })
  );
}

export async function generatePdf(options: PdfExportOptions): Promise<void> {
  const { schema, formData, submissionDate } = options;

  const formattedDate = submissionDate.toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
  const formattedTime = submissionDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit',
  });
  const formattedDateTime = `${formattedDate} às ${formattedTime}`;

  const unitName = (formData.q1 as string) || 'formulario';
  const sanitizedUnitName = unitName.replace(/[^a-zA-Z0-9À-ú]/g, '_').substring(0, 60);
  const now = new Date();
  const dateStamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const timeStamp = `${String(now.getHours()).padStart(2, '0')}h${String(now.getMinutes()).padStart(2, '0')}`;

  const numberMap = buildQuestionNumberMap(schema.sections);
  const activeSections = getSectionsWithData(schema.sections, formData);
  const W = 794;
  const MX = 44;

  function renderRows(questions: FormSection['questions']): string {
    let html = '';
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const bg = i % 2 === 0 ? '#f8fafc' : '#ffffff';
      const num = numberMap.get(q.id) ?? '—';

      if (q.type === 'matrix' && q.matrixRows) {
        html += `<tr style="background-color:${bg};">
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;width:30px;text-align:center;vertical-align:middle;font-size:10px;color:#94a3b8;font-weight:600;">${num}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;vertical-align:middle;font-weight:600;color:#1e293b;font-size:11.5px;line-height:1.4;">${q.label}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#94a3b8;font-size:10px;font-style:italic;text-align:right;vertical-align:middle;">—</td>
        </tr>`;
        for (let ri = 0; ri < q.matrixRows.length; ri++) {
          const row = q.matrixRows[ri];
          const val = formatPdfValue(formData[row.id]);
          const rowBg = ri % 2 === 0 ? '#ffffff' : '#f1f5f9';
          const rn = numberMap.get(row.id) ?? '—';
          html += `<tr style="background-color:${rowBg};">
            <td style="padding:5px 10px;border-bottom:1px solid #f1f5f9;width:30px;text-align:center;vertical-align:middle;font-size:9px;color:#94a3b8;font-weight:600;">${rn}</td>
            <td style="padding:5px 10px 5px 34px;border-bottom:1px solid #f1f5f9;vertical-align:middle;font-size:10.5px;color:#475569;line-height:1.35;">${row.label}</td>
            <td style="padding:5px 12px;border-bottom:1px solid #f1f5f9;font-size:10.5px;color:#1e293b;text-align:center;font-weight:600;vertical-align:middle;">${val}</td>
          </tr>`;
        }
      } else {
        const val = formatPdfValue(formData[q.id]);
        html += `<tr style="background-color:${bg};">
          <td style="padding:8px 10px;border-bottom:1px solid #e8ecf1;width:30px;text-align:center;vertical-align:middle;font-size:10px;color:#94a3b8;font-weight:600;">${num}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e8ecf1;vertical-align:middle;font-weight:600;color:#1e293b;font-size:11.5px;line-height:1.4;">${q.label}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8ecf1;color:#334155;font-size:11.5px;vertical-align:middle;line-height:1.5;">${val}</td>
        </tr>`;
      }
    }
    return html;
  }

  /** Captura div off-screen e retorna canvas */
  async function capture(innerHtml: string): Promise<HTMLCanvasElement> {
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;left:0;top:0;width:${W}px;z-index:-9999;opacity:0;pointer-events:none;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;color:#1e293b;background:#fff;`;
    el.innerHTML = `<div style="width:${W}px;">${innerHtml}</div>`;
    document.body.appendChild(el);
    try {
      await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
      const target = el.firstElementChild as HTMLElement;
      const c = await html2canvas(target, {
        scale: 2, useCORS: true, letterRendering: true,
        backgroundColor: '#ffffff', logging: false, windowWidth: W,
      });
      return c;
    } finally {
      document.body.removeChild(el);
    }
  }

  /** Converte canvas para pdf.addImage com paginação */
  function addCanvasToPdf(pdf: jsPDF, canvas: HTMLCanvasElement) {
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgH = (canvas.height * pageW) / canvas.width;

    let left = imgH;
    let pos = 0;
    pdf.addImage(imgData, 'JPEG', 0, pos, pageW, imgH);
    left -= pageH;
    while (left > 0) {
      pos = left - imgH;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, pos, pageW, imgH);
      left -= pageH;
    }
  }

  // ═══════════════════════════════════════════════════
  //  1) CAPA
  // ═══════════════════════════════════════════════════
  const idxHtml = activeSections.map((s, i) => {
    const sep = i < activeSections.length - 1 ? 'border-bottom:1px solid #f1f5f9;' : '';
    return `<div style="padding:9px 0;${sep}"><table style="border-collapse:collapse;"><tr>
      <td style="width:26px;text-align:center;"><div style="width:22px;height:22px;background:linear-gradient(135deg,#1e3a8a,#2563eb);border-radius:4px;text-align:center;line-height:22px;color:#fff;font-size:9px;font-weight:700;">${s.number}</div></td>
      <td style="padding-left:10px;font-size:11.5px;color:#334155;font-weight:500;">${s.title}</td>
    </tr></table></div>`;
  }).join('');

  const coverCanvas = await capture(`
    <div style="width:${W}px;">
      <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#1d4ed8 100%);color:#fff;padding:36px ${MX}px 26px;">
        <table style="width:100%;border-collapse:collapse;"><tr>
          <td style="width:52px;vertical-align:middle;">
            <div style="width:46px;height:46px;background:rgba(255,255,255,0.12);border-radius:12px;text-align:center;line-height:46px;font-size:18px;font-weight:800;color:#93c5fd;border:1px solid rgba(255,255,255,0.08);">AP</div>
          </td>
          <td style="vertical-align:middle;">
            <div style="font-size:17px;font-weight:700;letter-spacing:-0.3px;">${schema.title}</div>
            <div style="font-size:11.5px;color:#93c5fd;margin-top:3px;">${schema.subtitle}</div>
          </td>
        </tr></table>
        <div style="font-size:10px;color:#bfdbfe;margin-top:10px;line-height:1.5;padding-left:58px;">${schema.description}</div>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
        <tr>
          <td style="padding:13px ${MX}px;font-size:11px;color:#475569;width:50%;border-right:1px solid #e2e8f0;">
            <strong style="color:#1e293b;">Unidade:</strong> ${unitName}
          </td>
          <td style="padding:13px ${MX}px;font-size:11px;color:#475569;width:50%;text-align:right;">
            <strong style="color:#1e293b;">Data/Hora:</strong> ${formattedDateTime}
          </td>
        </tr>
      </table>
      <div style="padding:28px ${MX}px 36px;">
        <div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:12px;">Indice de Secoes</div>
        ${idxHtml}
      </div>
      <div style="padding:12px ${MX}px;border-top:1px solid #e2e8f0;background:#f8fafc;">
        <div style="font-size:9px;color:#94a3b8;text-align:center;">Documento gerado automaticamente — comprovante de submissao do Formulario de Avaliacao CAP 5.3.</div>
      </div>
    </div>
  `);

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  addCanvasToPdf(pdf, coverCanvas);

  // ── Header compacto para páginas de seção ──
  const pageHeader = `
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#1d4ed8 100%);color:#fff;padding:12px ${MX}px;">
      <table style="width:100%;border-collapse:collapse;"><tr>
        <td style="vertical-align:middle;font-size:11px;font-weight:600;letter-spacing:-0.2px;">${schema.title}</td>
        <td style="vertical-align:middle;text-align:right;font-size:10px;color:#93c5fd;">
          <strong style="color:#e0e7ff;">Unidade:</strong> <span style="color:#e0e7ff;margin-right:14px;">${unitName}</span>
          <strong style="color:#e0e7ff;">${formattedDateTime}</strong>
        </td>
      </tr></table>
    </div>
  `;

  // ═══════════════════════════════════════════════════
  //  2) UMA SEÇÃO POR PÁGINA
  // ═══════════════════════════════════════════════════
  for (const section of activeSections) {
    const secCanvas = await capture(`
      <div style="width:${W}px;">
        ${pageHeader}
        <div style="padding:0 ${MX}px;">
          <table style="width:100%;border-collapse:collapse;margin-bottom:14px;margin-top:16px;">
            <tr>
              <td style="width:6px;vertical-align:middle;">
                <div style="width:4px;height:36px;background:linear-gradient(180deg,#1e3a8a,#3b82f6);border-radius:2px;"></div>
              </td>
              <td style="padding-left:14px;vertical-align:middle;">
                <div style="font-size:18px;font-weight:800;color:#0f172a;letter-spacing:-0.3px;">${section.title}</div>
                ${section.description ? `<div style="font-size:10.5px;color:#64748b;margin-top:4px;line-height:1.4;">${section.description}</div>` : ''}
              </td>
            </tr>
          </table>
          <table style="width:100%;border-collapse:collapse;border:1px solid #dde3ea;">
            <thead>
              <tr>
                <th style="background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;padding:8px 10px;text-align:center;font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;width:30px;border-right:1px solid rgba(255,255,255,0.1);">#</th>
                <th style="background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;padding:8px 10px;text-align:left;font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;border-right:1px solid rgba(255,255,255,0.1);">Pergunta</th>
                <th style="background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;padding:8px 12px;text-align:left;font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">Resposta</th>
              </tr>
            </thead>
            <tbody>${renderRows(section.questions)}</tbody>
          </table>
        </div>
      </div>
    `);

    pdf.addPage();
    addCanvasToPdf(pdf, secCanvas);
  }

  pdf.save(`${sanitizedUnitName}_${dateStamp}_${timeStamp}.pdf`);
}
